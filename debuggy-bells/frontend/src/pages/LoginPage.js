import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

import Login from "./../components/Auth/Login";
import { useUserContext } from "./../components/context/userContext";
const LoginPage = () => {
  const [userData, setUserData] = useState({
    Email:"",
    name:"",
    ExpenseScore:0
  });
 const { userDetails, setUserDetails } = useUserContext();
  useEffect(() => {
    
    const token = Cookies.get("token"); 
    if (token) {
      try {
        
        const {Email,name,ExpenseScore} = jwtDecode(token);
        setUserData({Email,name,ExpenseScore}); 
        
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      console.log("No token found in cookies.");
    }
  }, []);
  const handleLogin = (userData) => {
    console.log("Logged in user:", userData);
  };

  return (
    <div className="container1 flex justify-center items-center p-4">
      {/* <h2 className="text-2xl font-bold mb-4"></h2> */}
      <Login onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
