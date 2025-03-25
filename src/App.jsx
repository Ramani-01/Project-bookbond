import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import Login from "./Components/Login"; // ✅ Import Login correctly
import Signup from "./Components/Signup";

import "./App.css";
import "./style.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />  {/* Home Page */}
        <Route path="/Login" element={<Login />} />   {/* Login Page */}
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
