import React, { useEffect, useState, createContext, useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

import "./Home.css";
import snowflakes from "../assets/snowflakes.png";

import { atom, useRecoilState } from "recoil";
import { useUserContext } from "./../components/context/userContext";
const charAtom = atom({
  key: "userState",
  default: { Email: "", name: "", ExpenseScore: 0 },
});

const Home = () => {
  const { userDetails, setLoading } = useUserContext();

  const handleLogout = () => {
    Cookies.remove("token");
    setLoading(false);
    window.location.href = "/login";
  };
  useEffect(() => {
    if (!userDetails) {
      console.log({ userDetails });
      // window.location.href = "/login";
    }
  }, [userDetails]);
  return (
    <div className="container1 p-4 ">
      <div className="bg2">
        
        {userDetails && userDetails.Email ? <p>Hi {userDetails.name}</p> : ""}

        <img className="sf1" src={snowflakes} alt="" />
        <img className="sf sf2" src={snowflakes} alt="" />
        <img className="sf sf3" src={snowflakes} alt="" />
        <img className="sf sf4" src={snowflakes} alt="" />

        <h1 id="welcome">Welcome to Your</h1>
        <h1 id="name">Expense Tracker</h1>

        <nav className="display">
          {userDetails && userDetails.Email ? (
            <div className="flex justify-center items-center my-4">
              <button onClick={handleLogout} className="btn btn1 mx-2">
                Logout
              </button>
              <Link to="/dashboard" className="btn btn1 w-fit h-fit mr-2">
                Go to Dashboard
              </Link>

              <Link to="/profile" className="btn btn1 w-fit h-fit">
                Profile
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn1">
                Login
              </Link>
              <h2>Don't have an account? Register below</h2>
              <Link to="/register" className="btn">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>

      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
};

export default Home;