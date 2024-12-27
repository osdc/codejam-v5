import express from "express";
import User from "../models/userModels.js";
import Expense from "../models/trackerModel.js";

const router = express.Router();
router.get("/typeN", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    
    const expenses = await Expense.find({ userEmail: email });

    
    const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const niceTotal = expenses
      .filter((expense) => expense.typeN === "Nice")
      .reduce((acc, curr) => acc + curr.amount, 0);
    const naughtyTotal = total - niceTotal;

 
    const nicePercentage = total ? parseFloat(((niceTotal / total) * 100).toFixed(2)) : 0;
    const naughtyPercentage = total ? parseFloat(((naughtyTotal / total) * 100).toFixed(2)) : 0;
    
console.log({nicePercentage,naughtyPercentage})
    return res.status(200).json({
      success: true,
      data: {
        nice: nicePercentage,
        naughty: naughtyPercentage,
        totalExpenses: total,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch expense data",
    });
  }
});

router.get("/filterByEmail", async (req, res) => {
  try {
    const { email, page } = req.query;

    let pageNumber = parseInt(page) || 1;
    let pageSize = 2;
    let skip = (pageNumber - 1) * pageSize;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not recieved",
      });
    }

    const filteredExpenses = await Expense.find({
      userEmail: email,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    const total = await Expense.countDocuments({ userEmail: email });
    res.status(200).json({
      success: true,
      expenses: filteredExpenses,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error filtering expenses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.put("/update-expense-score", async (req, res) => {
  try {
    const { email, expenseScore } = req.body;

    if (!email || expenseScore === undefined) {
      return res.status(400).json({
        success: false,
        message: "Email and expenseScore are required",
      });
    }

    const findUser = await User.findOne({ email });
    let updatedUserFinal = await User.findOneAndUpdate(
      { userEmail: email },
      { expenseScore },
      { new: true }
    );

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense score updated successfully",
      user: updatedUserFinal,
    });
  } catch (error) {
    console.error("Error updating expense score:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.put("/update-due-date", async (req, res) => {
  try {
    const { email, sharedWith, dueDate, expense_id } = req.body;
    //we have to make sure dueDate format matches with what mongo db accepts
    console.log({ email, sharedWith, dueDate });
    if (!email || !dueDate || !expense_id) {
      return res.status(400).json({
        success: false,
        message: "Email, expense id and  due date are required",
      });
    }

    const updatedUser = await Expense.findOneAndUpdate(
      {
        $and: [
          { userEmail: email },
          // {sharedWith: { $elemMatch: { email: sharedWith } } }
          { _id: expense_id }, // shared with email sharedWith: { $elemMatch: { email: sharedWith } }
        ],
      },
      { dueDate: new Date(dueDate) },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "New DueDate added",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating due date:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.put("/updateStatus", async (req, res) => {
  //todo: allow updateStatus button only if its in pending state so to avoid concurrency issue
  //allow expense to be deleted and undo the expense score change for to be taken person as we only update it for to be taken when expense is created
  try {
    const { email, sharedWith, status, expense_id } = req.body;
    //we have to make sure dueDate format matches with what mongo db accepts
    // console.log({ email, sharedWith, dueDate });
    if (!email || !status) {
      return res.status(400).json({
        success: false,
        message: "Email and  status are required",
      });
    }
    const findExpense = await Expense.findOne({ _id: expense_id });

    const findUser = await User.findOne({ email }); //reduce the expense score of other person because status was updated as settled after due date has been passed
    //Case I: To be taken then reduce the expense score of other person
    if (findExpense.sharedWith[0].type == "To be Taken") {
      const findSharedUser = await User.findOne({ email: sharedWith });
      let updatedUserFinal;
      if (findExpense.dueDate < new Date() && status == "Settled") {
        let newExpenseScore;
        if (findSharedUser.expenseScore == 0) {
          newExpenseScore = (5 / 100) * 100;
        } else {
          newExpenseScore = findSharedUser.expenseScore * (5 / 100);
        }
        let finalExpenseScore = findSharedUser.expenseScore - newExpenseScore;
        console.log({ finalExpenseScore });
        updatedUserFinal = await User.findOneAndUpdate(
          { email: sharedWith },
          { expenseScore: finalExpenseScore },
          { new: true }
        );
      }
    }
    //Case II: To be given then reduce the expense score of user
    if (findExpense.sharedWith[0].type == "To be Given") {
      //reduce the expense score of other person because status was updated as settled after due date has been passed
      let updatedUserFinal;
      if (findExpense.dueDate < new Date() && status == "settled") {
        let newExpenseScore;
        if (findUser.expenseScore == 0) {
          newExpenseScore = (5 / 100) * 100;
        } else {
          newExpenseScore = findUser.expenseScore * (5 / 100);
        }
        let finalExpenseScore = findUser.expenseScore - newExpenseScore;
        console.log({ finalExpenseScore });
        updatedUserFinal = await User.findOneAndUpdate(
          { email },
          { expenseScore: finalExpenseScore },
          { new: true }
        );
      }
    }
    // {sharedWith: { $elemMatch: { email: sharedWith } } }
    // { "sharedWith.email": sharedWith },
    const updatedUser = await Expense.findOneAndUpdate(
      { userEmail: email, _id: expense_id, "sharedWith.email": sharedWith },

      { $set: { "sharedWith.$.status": status } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status Updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      userEmail,
      title,
      amount,
      category,
      dueDate,
      description,
      sharedEmail,
      type,
      status,
      typeN
    } = req.body;

    if (!userEmail || !title || !amount || !category || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    const findUser = await User.findOne({ email: userEmail });
    let updatedUserFinal;
    if (type == "To be Taken") {
      let newExpenseScore;
      if (findUser.expenseScore == 0) {
        newExpenseScore = (50 / 100) * 100; //make it 50 for first time
      } else {
        newExpenseScore = findUser.expenseScore % 5;
      }

      let finalExpenseScore = findUser.expenseScore + newExpenseScore;
      console.log({ finalExpenseScore });
      try {
        updatedUserFinal = await User.findOneAndUpdate(
          { email: userEmail },
          { expenseScore: finalExpenseScore },
          { new: true }
        );

        console.log({ updatedUserFinal });
      } catch (err) {
        console.error(err);
      }
    }
    const newExpense = new Expense({
      userEmail,
      title,
      amount,
      category,
      typeN,
      dueDate: new Date(dueDate),
      description,
      sharedWith: {
        email: sharedEmail,
        type,
        status,
        amount,
      },
    });

    const savedExpense = await newExpense.save();

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense: savedExpense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/filterByEmail", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not recieved",
      });
    }

    const filteredExpenses = await Expense.find({
      userEmail: email,
    });

    res.status(200).json({
      success: true,
      expenses: filteredExpenses,
    });
  } catch (error) {
    console.error("Error filtering expenses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
// GET - Fetch expenses by status  and type

router.get("/filter", async (req, res) => {
  try {
    const { status, type } = req.query;

    // Validate input
    if (!status || !["Pending", "Settled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing status (Pending/Settled)",
      });
    }

    if (!type || !["To Be Taken", "To Be Given"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing type (To Be Taken/To Be Given)",
      });
    }

    const filteredExpenses = await Expense.find({
      "sharedWith.status": status,
      "sharedWith.type": type,
    });

    res.status(200).json({
      success: true,
      expenses: filteredExpenses,
    });
  } catch (error) {
    console.error("Error filtering expenses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/filterCategory", async (req, res) => {
  try {
    const { email } = req.query;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Missing email field",
      });
    }

    // Query expenses based on category
    const categorizedExpenses = await Expense.aggregate([
      {
        $match: { userEmail: email }
      },
      {
        $group: {
          _id: "$category", 
          totalAmount: { $sum: "$amount" } 
        }
      },{
        $sort: { totalAmount: -1 } 
      }
    ]);
console.log({categorizedExpenses})
    res.status(200).json({
      success: true,
      expenses: categorizedExpenses,
    });
  } catch (error) {
    console.error("Error filtering expenses by category:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

//delete expense
router.post("/deleteExpense", async (req, res) => {
  //allow expense to be deleted and undo the expense score change for to be taken person
  //  as we only update it for to be taken when expense is created
  try {
    const { email, expense_id } = req.body;
    if (!email || !expense_id) {
      return res.status(400).json({
        success: false,
        message: "Email and  expense_id are required",
      });
    }
    const findUser = await User.findOne({ email });
    const findExpense = await Expense.findOne({ _id: expense_id });
    if (findExpense.sharedWith[0].type == "To be Taken") {
      let updatedUserFinal;

      let newExpenseScore;
      if (findUser.expenseScore != 0) {
        newExpenseScore = findUser.expenseScore % 5;

        newExpenseScore = findUser.expenseScore - newExpenseScore;
        updatedUserFinal = await User.findOneAndUpdate(
          { email },
          { expenseScore: newExpenseScore },
          { new: true }
        );
      }
    }
    const deletedExpense = await Expense.findOneAndDelete({
      _id: expense_id,
    });

    if (!findUser || !findExpense) {
      return res.status(404).json({
        success: false,
        message: "User or expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
