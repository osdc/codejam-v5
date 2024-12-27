import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import {RecoilRoot,useRecoilState} from "recoil"
import { UserProvider } from "./components/context/userContext";
import ProfilePage from "./pages/ProfilePage";
import SpendingPage from "./pages/SpendingPage";
function App() {
  return (
    <Router>
          <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/spending" element={<SpendingPage />} />
      </Routes>
        </UserProvider>
    </Router>
  );
}

export default App;
