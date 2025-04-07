import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/Logo_Bookbond.png";
import loginImg from "../assets/Login_Img.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // Clear previous error
    
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    try {
      const response = await axios.post("http://localhost:3001/login", { email, password });
  
      // ✅ Store token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
  
      alert("Login successful!");
      navigate("/LandingPage");
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      setError(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="auth-page login-container">
      <div className="auth-logo-container">
        <img src={logo} alt="BookBond Logo" className="auth-logo" />
      </div>
      <div className="auth-box login-box">
        <div className="auth-form-section login-form">
          <h2 className="auth-title login-title">Login</h2>
          {error && <p className="auth-error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="auth-input-group input-container">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                placeholder="Your Email"
                className="auth-input-field input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="auth-input-group input-container">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                placeholder="Password"
                className="auth-input-field input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="auth-button login-btn">Login</button>
          </form>
          <p className="auth-links login-links">
            Don't have an account? <Link to="/signup" className="auth-link login-link">Sign Up</Link>
          </p>
        </div>
        <div className="auth-illustration-container login-illustration">
          <img src={loginImg} alt="Login Illustration" className="auth-illustration-image illustration-img" />
        </div>
      </div>
    </div>
  );
};

export default Login;
