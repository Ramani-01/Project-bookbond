import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/Logo_Bookbond.png";
import loginImg from "../assets/Login_Img.jpg";

const Login = () => {   // ✅ Define the component
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate(); // ✅ Add useNavigate() for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    
    setError("");
    try {
      const response = await axios.post("http://localhost:3001/users", { email, password });
      console.log("Login success:", response.data);
      alert("Login successful!");
      navigate("/LandingPage"); // ✅ Correct redirection after login
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
    }
  };
};


export default Login;