import { useState } from "react";
import { loginUser } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import snowflakes from "../../assets/snowflakes.png";
import toast, { Toaster } from "react-hot-toast";
import "./Login.css";
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ email, password });
      toast("Login successful", {
        icon: "🦌",
      });
      onLogin(data);
      // navigate("/");
      window.location.href = "/";
    } catch (err) {
      toast(`${err.response?.data?.message || "Login failed"}`, {
        icon: "➕",
      });
      // alert(err.response?.data?.message || "Login failed");
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
      <form onSubmit={handleSubmit} className="form-bg">
        <h2 className="h2-login">LOGIN</h2>
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
        <button className="btn btn2">Login</button>
      </form>
    </div>
  );
};

export default Login;
