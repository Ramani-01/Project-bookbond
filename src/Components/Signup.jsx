import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/Logo_Bookbond.png";
import loginImg from "../assets/Login_Img.jpg";  

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.(com|org)$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Field validation
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email. Only .com and .org domains are allowed.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(""); // Clear any previous errors
    setSuccess(""); // Clear previous success message

    try {
      const response = await axios.post("http://localhost:3001/users", {
        name: username, 
        email,
        password
      });

      console.log("Signup success:", response.data);
      setSuccess("Signup successful! Redirecting to login...");
      
      // Redirect after 2 seconds
      setTimeout(() => navigate('/login'), 1500);
      
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Error signing up. Please try again.");
    }
  };

  return (
    <div className="auth-page signup-container">
      <div className="auth-logo-container">
        <img src={logo} alt="BookBond Logo" className="auth-logo" />
      </div>
      <div className="auth-box signup-box">
        <div className="auth-form-section signup-form">
          <h2 className="auth-title signup-title">Sign Up</h2>
          
          {error && <p className="auth-error-message">{error}</p>}
          {success && <p className="auth-success-message">{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group input-container">
              <i className="fas fa-user input-icon"></i>
              <input
                type="text"
                placeholder="Username"
                className="auth-input-field input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
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
            <div className="auth-input-group input-container">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                placeholder="Confirm Password"
                className="auth-input-field input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="auth-button signup-btn">Sign Up</button>
          </form>
          <p className="auth-links signup-links">
            Already have an account? <Link to="/login" className="auth-link signup-link">Login</Link>
          </p>
        </div>
        <div className="auth-illustration-container login-illustration">
          <img src={loginImg} alt="Login Illustration" className="auth-illustration-image illustration-img" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
