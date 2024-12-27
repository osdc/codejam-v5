import { useEffect, useState } from "react";
import { fetchExpenses } from "../../utils/api";
import { useUserContext } from "./../context/userContext";
import { API } from "./../../utils/api";
import toast, { Toaster } from "react-hot-toast";
import useSWR from "swr";
const ExpenseList = ({ mnExpense }) => {
  const { userDetails, loading } = useUserContext();
  const [expenses, setExpenses] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editStatus, setEditStatus] = useState(null);
  const [newDueDate, setNewDueDate] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const categories = [
    "Cafe Food",
    "Groceries",
    "Munchies",
    "Outside Food",
    "Other",
  ];
  const statuses = ["Settled", "Pending"];

  const getExpenses = async () => {
    try {
      const fetchExpensesByEmail = () =>
        API.get(
          `/api/filterByEmail/?email=${userDetails.Email}&page=${pageNumber}`
        );
      const { data } = await fetchExpensesByEmail();
      setExpenses(data.expenses);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast("Failed to fetch expenses", { icon: "⛑" });
    }
  };

  useEffect(() => {
    if (!loading && userDetails) {
      getExpenses();
    }
  }, [mnExpense]);
  useEffect(() => {
    if (!loading && userDetails) {
      getExpenses();
    }
  }, [pageNumber]);

  const handleCategoryChange = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((cat) => cat !== value)
        : [...prev, value]
    );
  };

  const handleStatusChange = (value) => {
    setSelectedStatuses((prev) =>
      prev.includes(value)
        ? prev.filter((status) => status !== value)
        : [...prev, value]
    );
  };

  const filteredData = expenses.filter((item) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(item.category);
    const statusMatch =
      selectedStatuses.length === 0 ||
      selectedStatuses.includes(item.sharedWith[0].status);
    return categoryMatch && statusMatch;
  });

  const updateDueDate = async (sharedEmail, expense_id) => {
    try {
      const response = await fetch(
        "https://expense-tracker-backend-h1vd.onrender.com/api/update-due-date",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userDetails.Email,
            sharedWith: sharedEmail,
            dueDate: newDueDate,
            expense_id,
          }),
        }
      );

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      setEditIndex(-3);
      toast("Due date updated successfully!", { icon: "🤶" });
      getExpenses();
    } catch (error) {
      toast("Failed to update due date. Please try again.", { icon: "🏮" });
    }
  };

  const updateStatus = async (sharedEmail, expense_id) => {
    try {
      const response = await fetch("https://expense-tracker-backend-h1vd.onrender.com/api/updateStatus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userDetails.Email,
          sharedWith: sharedEmail,
          status: newStatus,
          expense_id,
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      setEditStatus(-3);
      toast("Status updated successfully!", { icon: "🤶" });
      getExpenses();
    } catch (error) {
      toast("Failed to update Status. Please try again.", { icon: "🤬" });
    }
  };

  const deleteExpense = async (expense_id) => {
    try {
      const response = await fetch("https://expense-tracker-backend-h1vd.onrender.com/api/deleteExpense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userDetails.Email,
          expense_id,
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      toast("Expense deleted successfully!", { icon: "🤶" });
      getExpenses();
    } catch (error) {
      toast("Failed deleting expense. Please try again.", { icon: "🤬" });
    }
  };

  return (
    <div className="my-4">
      <Toaster />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    selectedCategories.includes(category)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-blue-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Status</h3>
            <div className="flex gap-2 flex-wrap">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    selectedStatuses.includes(status)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 hover:bg-green-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
        <h2 className="text-lg font-bold ml-1 mt-8 mb-2">Expenses</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredData.map((expense, index) => (
            <li
              key={expense._id}
              className="py-2 bg-gray-100 p-4 rounded-xl border border-blue-200"
            >
              <div className="flex justify-between">
                <span>
                  {expense.title} - ₹{expense.amount} <br />
                  Category: {expense.category}
                  --<strong>{expense.typeN}</strong>
                </span>
                <br />
                <span
                  className="my-2 px-2 py-1 rounded ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={() => deleteExpense(expense._id)}
                >
                  ❌
                </span>
              </div>
              <ul>
                {expense.sharedWith.map((sharedWith) => (
                  <li key={sharedWith._id} className="text-sm md:text-base">
                    <span className="mr-2 break-words">
                      SharedWith: {sharedWith.email}
                    </span>
                    <br />
                    <span className="font-medium">{sharedWith.type}</span>
                    <br />
                    <span className="pr-2">Status: {sharedWith.status}</span>
                    <br />
                    <span>
                      Due Date:{" "}
                      {new Date(expense.dueDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </span>
                    <br />
                    <div className="flex justify-between bottom-0">
                      {editIndex === index ? (
                        <div className="mt-2 flex flex-col items-start space-y-2">
                          <input
                            type="date"
                            value={newDueDate}
                            onChange={(e) => setNewDueDate(e.target.value)}
                            className="p-2 border rounded focus:ring focus:ring-blue-300"
                          />
                          <button
                            onClick={() =>
                              updateDueDate(sharedWith.email, expense._id)
                            }
                            className="px-4 py-2 text-white text-sm bg-green-500 rounded hover:bg-green-600"
                          >
                            Update
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditIndex(index)}
                          className=" mt-2 px-2 py-1 text-white text-sm bg-green-500 rounded hover:bg-red-600"
                        >
                          Update Due Date
                        </button>
                      )}
                      {editStatus === index ? (
                        <div className="mt-2 flex flex-col items-start space-y-2">
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            name="status"
                            className="p-2 border rounded focus:ring focus:ring-blue-300"
                          >
                            <option value="">Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Settled">Settled</option>
                          </select>
                          <button
                            onClick={() =>
                              updateStatus(sharedWith.email, expense._id)
                            }
                            className=" px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                          >
                            Update
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditStatus(index)}
                          className="mt-2 px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 ml-2"
                        >
                          Update Status
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`flex items-center justify-evenly mt-4 md:mt-12  ${
          totalPages >= 1 ? "" : "hidden"
        }`}
      >
        <button
          className={`text-blue-700 font-bold  ${
            pageNumber <= 1 ? "cursor-not-allowed" : ""
          }`}
          disabled={pageNumber <= 1}
          onClick={() => {
            if (pageNumber > 1) {
              setPageNumber((prev) => prev - 1);
              console.log({ totalPages });
            }
          }}
        >
          Previous
        </button>

        <button
          className={`text-blue-700 font-bold ${
            pageNumber >= totalPages ? "cursor-not-allowed" : ""
          }`}
          disabled={pageNumber >= totalPages}
          onClick={() => {
            if (pageNumber <= totalPages) {
              setPageNumber((prev) => prev + 1);
              console.log({ totalPages }, pageNumber);
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ExpenseList;
