import React, { useEffect, useState, useContext } from "react";
import { useUserContext } from "../components/context/userContext";
import toast, { Toaster } from "react-hot-toast";
import snowflakes from "../assets/snowflakes.png";
import "./ProfilePage.css";
import { API } from "../utils/api";
import Spending from "../components/smartSpending/Spending";
import { useNavigate } from "react-router-dom";
const ProfilePage = () => {
  const navigate = useNavigate();
  const { userDetails, loading } = useUserContext();
  const [userData, setUserData] = useState({});
  const [totalExpenseByCategory, setTotalExpenseByCategory] = useState([
    {
      X: 5000,
    },
    { X: 3000 },
    { X: 2000 }
  ]);
 
  const getUserDetails = async () => {
    try {
      const fetchUserByEmail = () =>
        API.get(`/auth/user/?userEmail=${userDetails.Email}`);
      const { data } = await fetchUserByEmail();
      setUserData(data.result);
    } catch (err) {
      console.error(err);
      toast("Failed to fetch user details", { icon: "⛑" });
    }
  };
  const getCategories = async () => {
    try {
      const fetchUserByEmail = () =>
        API.get(`/api/filterCategory/?email=${userDetails.Email}`);
      const { data } = await fetchUserByEmail();
      setTotalExpenseByCategory(data.expenses);
    } catch (err) {
      console.error(err);
      toast("Failed to fetch user details", { icon: "⛑" });
    }
  };

  useEffect(() => {
    if (!loading && userDetails) {
      getUserDetails();
      getCategories();
    }
  }, [userDetails, loading]);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
  
    <div className="container2">
      <div className="bg3">
        <Toaster />
        <img className="sf1" src={snowflakes} alt="snowflake" />
        <img className="sf sf2" src={snowflakes} alt="snowflake" />
        <img className="sf sf3" src={snowflakes} alt="snowflake" />
        <img className="sf sf4" src={snowflakes} alt="snowflake" />
        <h1 id="welcome">Welcome to Your Profile</h1>
        <h1 id="name1">{userData?.name || "Guest"}</h1>
        <div className="profile-details">
          <p>
            <strong>Email:</strong> {userData?.email || "N/A"}
          </p>
          <p>
            <strong>Expense Score:</strong> {userData?.expenseScore}
          </p>
        </div>
        <div className="expense-summary">
          <h2>Total Expenses by Category</h2>
          <ul>
          {totalExpenseByCategory.map((categoryData, index) => {
         
          const categoryType = Object.keys(categoryData)[0];
          const categoryName = categoryData[categoryType];
          const categoryAmount = Object.keys(categoryData)[1];
          const categoryExpense = categoryData[categoryAmount];

          return (
            <li key={index}>
              <strong>{categoryName}</strong>: ₹ {categoryExpense}
            </li>
          );
        })}
          </ul>
        </div>
        <button className="font-bold w-12 h-12 bg-gray-100 rounded-md w-fit h-fit p-2 my-2 opacity-75 btn" onClick={()=>navigate("/")}>Home</button>
        <div className="my-4">
      <Spending />
      </div>
      </div>
    
    </div>
  );
};

export default ProfilePage;
