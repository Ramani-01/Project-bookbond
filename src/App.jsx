import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Genres from "./Components/DashBoard/Genres";
import SelectGenres from "./Components/DashBoard/SelectGenres";
import MyLibrary from "./Components/Home/MyLibrary";
import Profile from "./Components/Home/Profile";
import Challenge from "./Components/Home/Challenge";  

import "./App.css";
import "./style.css";
import HomeLanding from "./Components/Home/HomeLanding";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<HomeLanding />} /> {/* Home Page */}
          <Route path="/genres" element={<Genres />} /> {/* Genres Page */}
          <Route path="/selectgenres/:genre" element={<SelectGenres />} />
          <Route path="/login" element={<Login />} /> {/* Login Page */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/mylibrary" element={<MyLibrary />} />
          <Route path="/profile" element={<Profile />} /> {/* Profile Page */}
          <Route path="*" element={<div>Page Not Found</div>} />
          <Route path="/challenge" element={<Challenge />} />

        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </>
    </Router>
  );
}

export default App;
