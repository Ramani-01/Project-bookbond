import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import Login from "./Components/Login"; // ✅ Import Login correctly
import Signup from "./Components/Signup";
import Genres  from "./Components/DashBoard/Genres";

import "./App.css";
import "./style.css";
import HomeLanding from "./Components/Home/HomeLanding";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLanding />} />  {/* Home Page */}

        <Route path="/HomeLanding" element={<HomeLanding />} />
        <Route path="/genres" element={<Genres/>}/>  Genres Page
        <Route path="/Login" element={<Login />} />   {/* Login Page */}
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
