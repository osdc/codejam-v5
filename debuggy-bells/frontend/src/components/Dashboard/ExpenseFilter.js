import { useState } from "react";
import { filterExpenses } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";
const ExpenseFilter = ({ onFilter }) => {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const handleFilter = async (e) => {
    e.preventDefault();
    try {
      const { data } = await filterExpenses(status, type);
      onFilter(data.expenses); // Pass filtered expenses to the parent component
    } catch (err) {
      toast(`${err.response?.data?.message || "Failed to filter expenses"}`, {
        icon: '⛑'
      });
      // alert(err.response?.data?.message || "Failed to filter expenses");
    }
  };

  return (
    <div>
       <div><Toaster/></div>
  
    <form onSubmit={handleFilter} className="bg-gray-100 p-4 rounded mb-4">
      <h2 className="text-lg font-bold mb-4">Filter Expenses</h2>
      <div className="mb-4">
        <label htmlFor="status" className="block font-medium">
          Status:
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border w-full p-2"
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Settled">Settled</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="type" className="block font-medium">
          Type:
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border w-full p-2"
        >
          <option value="">Select Type</option>
          <option value="To Be Taken">To Be Taken</option>
          <option value="To Be Given">To Be Given</option>
        </select>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Filter</button>
    </form>
    </div>
  );
};

export default ExpenseFilter;
