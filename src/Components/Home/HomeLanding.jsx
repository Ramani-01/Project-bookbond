import React, { useState } from "react";
import "./HomeLanding.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomeLanding = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { name, email, password, confirmPassword } = registerData;

    if (!name || name.trim().length < 2) {
      setError("Please enter a valid name (at least 2 characters)");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters and contain letters and numbers");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/register", {
        name,
        email,
        password,
      });

      if (res.data.message === "User registered successfully") {
        alert("Registered successfully. Please login.");
        setRegisterData({ name: "", email: "", password: "", confirmPassword: "" });
        setIsLogin(true);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { email, password } = loginData;

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3001/login", 
        { email, password },
        { withCredentials: true }
      );

      if (res.data.message === "Login successful") {
        localStorage.setItem("userid", res.data.user._id);
        localStorage.setItem("username", res.data.user.name);
        navigate("/genres");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="home-landing">
      <div className="home-landing-bg">
        <div className="form-container">
          {error && <div className="error-message">{error}</div>}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="login-form">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
              <button type="submit">Login</button>
              <p>
                Don't have an account?{" "}
                <span className="form-toggle" onClick={() => setIsLogin(false)}>
                  Signup
                </span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="register-form">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={registerData.name}
                onChange={handleRegisterChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                required
              />
              <button type="submit">Register</button>
              <p>
                Already have an account?{" "}
                <span className="form-toggle" onClick={() => setIsLogin(true)}>
                  Login
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeLanding;