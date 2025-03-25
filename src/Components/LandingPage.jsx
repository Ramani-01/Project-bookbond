import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function LandingPage() {
    
  return (
    <div>
    <div className="relative h-screen w-full">
      {/* Header Component */}
      <Header />

      {/* Dark Gradient Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-transparent"></div>

   </div>
   </div>
  );
}

export default LandingPage;
