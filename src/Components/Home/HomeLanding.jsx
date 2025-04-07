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
    confirmPassword: ""
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/users", {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        type: "user" // fixed as only user allowed
      });

      if (res.data.success) {
        setRegisterData({ name: "", email: "", password: "", confirmPassword: "" });
        setIsLogin(true); // switch to login after successful signup
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log("Registration error:", err);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/login", loginData);

      if (res.data.success) {
        localStorage.setItem("userid", res.data.userId);
        navigate("/genres");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log("Login error:", err);
    }
  };

  return (
    <div className="home-landing">
    <div className="home-landing-bg">
      <div className="form-container">
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
              Don’t have an account?{" "}
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
