import { MemoryRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import HomePage from "./pages/Homepage";
import ChatBot from "./pages/Chatbot";
import Lecture from "./pages/Lecture";
import Notes from "./pages/Notes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getItem } from "./utils/storage.js";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const PrivateRoute = ({ element }) => {
  const [authStatus, setAuthStatus] = useState({
    isChecked: false,
    hasToken: false,
  });

  useEffect(() => {
    const validateToken = async () => {
      const token = await getItem("token");
      console.log("token", token);
      setAuthStatus({
        isChecked: true,
        hasToken: !!token,
      });
    };

    validateToken();
  }, []);

  // Show loading while checking token
  if (!authStatus.isChecked) {
    return <div>Loading...</div>; // Or your loading component
  }

  // Redirect to login if no token
  if (!authStatus.hasToken) {
    return <Navigate to="/login" />;
  }

  // Return protected route component if authenticated
  return element;
};

const CheckAuth = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getItem("token");
      console.log("token", token);
      setIsAuthenticated(!!token);
    };

    checkToken();
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or your loading component
  }

  // Redirect if authenticated
  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  // Return the original element if not authenticated
  return element;
};

const App = () => {
  return (
    <div className="h-[600px] w-[400px]">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<CheckAuth element={<Auth />} />} />
          <Route
            path="/home"
            element={<PrivateRoute element={<HomePage />} />}
          />
          <Route
            path="/chatbot"
            element={<PrivateRoute element={<ChatBot />} />}
          />
          <Route
            path="/lecture"
            element={<PrivateRoute element={<Lecture />} />}
          />
          <Route path="/notes" element={<PrivateRoute element={<Notes />} />} />
        </Routes>
      </MemoryRouter>
    </div>
  );
};

export default App;
