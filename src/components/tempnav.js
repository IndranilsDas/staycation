"use client";
import React, { useEffect, useState } from "react";

export default function Tempnav() {
  // Check localStorage to persist the closed state
  const [isNavVisible, setIsNavVisible] = useState(() => {
    return localStorage.getItem("tempNavClosed") !== "true";
  });

  // Function to handle closing the nav and storing state in localStorage
  const handleClose = () => {
    setIsNavVisible(false);
    localStorage.setItem("tempNavClosed", "true");
  };

  // If nav is closed, don't render anything
  if (!isNavVisible) return null;

  return (
    <section className="">
      <nav>
        <div className="relative flex items-center justify-center w-full bg-gradient-to-r from-blue-300 to-orange-300 py-2 px-4">
          {/* Promo text */}
          <span className="text-black">
            FLAT 15% OFF on your next escape. Use code: WIN15
          </span>

          {/* Close Button (right-most position) */}
          <button
            onClick={handleClose}
            className="text-white font-bold"
          >
            ✕
          </button>
        </div>
      </nav>
    </section>
  );
}
