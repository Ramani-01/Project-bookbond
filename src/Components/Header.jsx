import React from "react";
import logo from "../assets/Logo_Bookbond.png"; // ✅ Import the logo
import BookList from "./BookList";
import { NavLink } from "react-router-dom";
import Challenge from "./Home/Challenge";
import BelowSection from "./BelowSection";
import Footer from "./Footer";
import homeLanding from "./Home/HomeLanding";
import Genres from "./DashBoard/Genres";


function Header() {
  return (
    <div className="header-background">
    <header className="absolute top-0 left-0 w-full flex items-center justify-between px-12 py-4">
      {/* Logo */}
      {/* <img src={logo} alt="BookBond Logo" className="" /> */}
      {/* <img src="../assets/Logo_Bookbond.png" alt="" /> */}

      
      {/* Navigation without background */}
      <div className="navbar">
          <img src={logo} alt="Logo" className="logo" />
          <ul className="links">
            {[
              { name: "MyLibrary", path: "/MyLibrary" }, // ✅ Path matches `Login.jsx`
              { name: "Challenge", path: "/challenge" },
              { name: "About Us", path: "/About Us" },
              { name: "Profile", path: "/profile" } // 👈 lowercase to match your route

            ].map((item, index) => (
              <li key={index} className="cursor-pointer">
                <NavLink
                  to={item.path}
                  className="block w-full h-full px-5 py-3 font-bold text-lg text-white no-underline transition-all hover:scale-110 hover:bg-red-700 hover:rounded-full hover:text-red-400"
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
    </header>
    <div className="slogan" >
       <p >
        YOUR STORY <br/>
        STARTS HERE
       </p>
       <h6 className="small-slogen">Explore your books here</h6>
      <button className="play-button">Explore</button>
    </div>
    <BookList/>
   {/* <div>
    <Footer/>
   </div> */}
    </div>
  );
}
export default Header;
