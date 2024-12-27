import React from "react";
import Register from "./../components/Auth/Register";

const RegisterPage = () => {
  const handleRegister = (userData) => {
    console.log("Registered user:", userData);
  };

  return (
    <div className="container1 flex justify-center items-center p-4">
      {/* <h2 className="text-2xl font-bold mb-4">Register</h2> */}
      <Register onRegister={handleRegister} />
    </div>
  );
};

export default RegisterPage;
