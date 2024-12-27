import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

export const UserContext = createContext();


export const useUserContext = () => useContext(UserContext);


export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
const [loading, setLoading] = useState(true);
  useEffect(() => {
      
      const token = Cookies.get('token'); 
      if (token) {
        try {
          
          const {Email,name,ExpenseScore} = jwtDecode(token);
          setUserDetails({Email,name,ExpenseScore}); 
          setLoading(false);
        } catch (error) {
          console.error("Invalid token:", error);
        }
      } else {
        setLoading(false);
        console.log("No token found in cookies.");
      }
    }, []);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};
