import { useState } from "react";
import { addExpense } from "../../utils/api";
import { useUserContext } from "./../context/userContext";
import ExpenseList from "./ExpenseList";
import toast, { Toaster } from "react-hot-toast";
const AddExpense = ({ onExpenseAdded }) => {
  const { userDetails } = useUserContext();
  let userEmail = userDetails?.Email;
  const [mnExpense, setMnExpense] = useState(false);
  const [formData, setFormData] = useState({
    userEmail,
    sharedEmail: "",
    name: "",
    amount: "",
    dueDate: "",
    title: "",
    description: "",
    category: "",
    type: "",
    status: "",
    typeN: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addExpense(formData);
      console.log(res);
      if (res.status === 201) {
        // alert("Expense added");
        toast("Expense Added", {
          icon: "❄❄❄",
        });
        setFormData({
          userEmail,
          sharedEmail: "",
          name: "",
          amount: "",
          dueDate: "",
          title: "",
          description: "",
          category: "",
          type: "",
          status: "",
          typeN: "",
        });
        // onExpenseAdded(data);
        if (mnExpense) {
          setMnExpense(false);
        } else {
          setMnExpense(true);
        }
      }
    } catch (err) {
      toast(`${err.response?.data?.message || "Failed to add expense"}`, {
        icon: "⛑",
      });
      // alert(err.response?.data?.message || "Failed to add expense");
    }
  };

  return (
    <div className="">
      <div>
        <Toaster />
      </div>
      <div className="lg:flex">
        <div>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-100 p-4 md:mx-4  border-4 border-blue-500 rounded-xl shadow-xl  opacity-75"
          >
            <h2 className="text-lg font-bold mb-4 ml-1 mt-1">Add Expense</h2> 
            <input
              type="text"
              placeholder="Title"
              name="title"
              className="border w-full p-2 mb-2 border-green-500 rounded-xl"
              value={formData.title}
              onChange={(e) => handleChange(e)}
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              className="border w-full p-2 mb-2 border-green-500 rounded-xl"
              value={formData.description}
              onChange={handleChange}
            />
            <input
              type="text"
              name="sharedEmail"
              placeholder="Person's email"
              className="border w-full p-2 mb-2 border-green-500 rounded-xl"
              value={formData.sharedEmail}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Amount"
              name="amount"
              className="border w-full p-2 mb-2 border-green-500 rounded-xl"
              value={formData.amount}
              onChange={handleChange}
            />
            <input
              type="date"
              className="border w-full p-2 mb-2 border-green-500 rounded-xl"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
            <select
              value={formData.category}
              onChange={handleChange}
              name="category"
              className="border w-full p-2 mb-4"
            >
              <option value="">Select Category</option>
              <option value="Cafe Food">Cafe Food</option>
              <option value="Groceries">Groceries</option>
              <option value="Munchies">Munchies</option>
              <option value="Outside Food">Outside Food</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={formData.typeN}
              onChange={handleChange}
              name="typeN"
              className="border w-full p-2 mb-4"
            >
              <option value="">Select Expense Type</option>
              <option value="Naughty">Naughty</option>
              <option value="Nice">Nice</option>
            </select>
            <select
              value={formData.type}
              onChange={handleChange}
              name="type"
              className="border w-full p-2 mb-4"
            >
              <option value="">Select Type</option>
              <option value="To be Taken">To be Taken</option>
              <option value="To be Given">To be Given</option>
            </select>
        
            <select
              value={formData.status}
              onChange={handleChange}
              name="status"
              className="border w-full p-2 mb-4"
            >
              <option value="">Status</option>
              <option value="Pending">Pending</option>
              <option value="Settled">Settled</option>
            </select>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Create
            </button>
          </form>
        </div>
        <div>
          <ExpenseList mnExpense={mnExpense} />
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
