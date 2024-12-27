import { useState } from "react";
import { registerUser } from "./../../utils/api";
import { useNavigate } from "react-router-dom";
import snowflakes from "../../assets/snowflakes.png";
import toast, { Toaster } from "react-hot-toast";
import "./Register.css";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast("Passwords do not match", {
        icon: "➕",
      });
      return;
    }
    try {
      await registerUser({ name, email, password });
      toast("Registration successful", {
        icon: "🎄",
      });
      navigate("/dashboard");
    } catch (err) {
      toast(`${err.response?.data?.message || "Registration failed"}`, {
        icon: "⛑",
      });
      // alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <div>
        <Toaster />
      </div>
      <img className="sf1" src={snowflakes} alt="" />
      <img className="sf sf2" src={snowflakes} alt="" />
      <img className="sf sf3" src={snowflakes} alt="" />
      <img className="sf sf4" src={snowflakes} alt="" />
      <form onSubmit={handleSubmit} className="form-bg register">
        <h2 className="h2-login mt-1">Register</h2>
        <input
          type="text"
          placeholder="Name"
          className="input-box"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="input-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input-box"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="input-box"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="btn btn2 btn3">Register</button>
      </form>
    </div>
  );
};

export default Register;
