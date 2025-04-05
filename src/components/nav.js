"use client";
import React, { useEffect, useState } from "react";
import { Prompt } from "next/font/google";
import { CiBellOn } from "react-icons/ci";
import { FaUserCircle, FaSearch, FaHome, FaClipboardList } from "react-icons/fa";
import { LuPhoneCall } from "react-icons/lu";
import SignupModal from "./sign-up"; // Adjust path if needed
import LoginModal from "./sign-in"; // Adjust path if needed

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "800"],
});

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [tempNav, setTempNav] = useState(true);
  const [isUnder, setIsUnder] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  const handleSignupSubmit = (phoneNumber) => {
    console.log("User phone number:", phoneNumber);
    // Here, you can check the phone number, send OTP, etc.
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight / 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsUnder(window.innerWidth > 850);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openSignup = () => {
    setIsSignupVisible(true);
    setIsLoginVisible(false);
  };

  const closeSignup = () => setIsSignupVisible(false);

  const openLogin = () => {
    setIsLoginVisible(true);
    setIsSignupVisible(false);
  };

  const closeLogin = () => setIsLoginVisible(false);

  return (
    <div className={`${prompt.className}`}>
      {isUnder ? (
        <nav>
          <div
            className={`fixed w-full top-0 z-50 transition duration-300 
            ${scrolled ? "backdrop-blur-md shadow-xl" : "bg-transparent"}`}
          >
            {tempNav && (
              <div className="relative flex items-center justify-between bg-gradient-to-r from-blue-300 to-orange-300 py-2 px-4 text-xs sm:text-sm md:text-base">
                <span className="text-black text-center flex-1">
                  FLAT 15% OFF on your next escape. Use code: <strong>WIN15</strong>
                </span>
                <button
                  onClick={() => setTempNav(false)}
                  className="text-white font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between px-4 md:px-6 py-3">
              <div className="flex items-center">
                <img
                  src="images/stayvista_logo.svg"
                  className={`h-10 w-20 ${scrolled ? "invert-0" : "invert"}`}
                  alt="StayVista Logo"
                />
              </div>

              <div className="flex items-center gap-2 md:gap-4 ml-auto">
                <button
                  className={`text-xs sm:text-sm md:text-base ${
                    scrolled ? "text-black" : "text-white"
                  } hover:text-orange-300 transition duration-300`}
                >
                  Explore
                </button>
                <button
                  className={`flex items-center gap-1 text-xs sm:text-sm md:text-base uppercase font-semibold px-2 md:px-3 py-1 md:py-2 rounded 
                  ${
                    scrolled ? "ring ring-black text-black" : "ring ring-white text-white"
                  } hover:bg-orange-300 hover:text-black transition duration-200`}
                >
                  Buy a Property
                </button>
                <button
                  className={`flex items-center gap-1 text-xs sm:text-sm md:text-base uppercase font-semibold px-2 md:px-3 py-1 md:py-2 rounded 
                  ${
                    scrolled ? "ring ring-black text-black" : "ring ring-white text-white"
                  } hover:bg-orange-300 hover:text-black transition duration-200`}
                >
                  List Your Property
                </button>
                <button
                  className={`flex items-center gap-1 text-xs sm:text-sm md:text-base uppercase font-semibold px-2 md:px-3 py-1 md:py-2 rounded 
                  ${
                    scrolled ? "ring ring-black text-black" : "ring ring-white text-white"
                  } hover:bg-orange-300 hover:text-black transition duration-200`}
                >
                  <LuPhoneCall className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">+91 9167928471</span>
                </button>
                <button>
                  <CiBellOn
                    className={`h-6 w-6 sm:h-8 sm:w-8 cursor-pointer hover:text-orange-300 transition duration-300 ${
                      scrolled ? "text-black" : "text-white"
                    }`}
                  />
                </button>
                <button onClick={openSignup}>
                  <FaUserCircle
                    className={`h-6 w-6 sm:h-8 sm:w-8 cursor-pointer hover:text-orange-300 transition duration-300 ${
                      scrolled ? "text-black" : "text-white"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </nav>
      ) : (
        <nav>
          <div
            className={`fixed w-full top-0 z-50 transition duration-300 
            ${scrolled ? "backdrop-blur-md shadow-xl" : "bg-transparent"}`}
          >
            <div className="flex flex-wrap items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <img
                  src="images/stayvista_logo.svg"
                  className={`h-8 w-16 ${scrolled ? "invert-0" : "invert"}`}
                  alt="StayVista Logo"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  className={`flex items-center gap-1 text-xs ${
                    scrolled ? "text-black" : "text-white"
                  } hover:text-orange-300 transition`}
                >
                  <FaSearch className="h-5 w-5" />
                  <span>Explore</span>
                </button>
                <button
                  className={`flex items-center gap-1 text-xs ${
                    scrolled ? "text-black" : "text-white"
                  } hover:text-orange-300 transition`}
                >
                  <FaHome className="h-5 w-5" />
                  <span>Buy</span>
                </button>
                <button
                  className={`flex items-center gap-1 text-xs ${
                    scrolled ? "text-black" : "text-white"
                  } hover:text-orange-300 transition`}
                >
                  <FaClipboardList className="h-5 w-5" />
                  <span>List</span>
                </button>
                <button
                  className={`flex items-center gap-1 text-xs ${
                    scrolled ? "text-black" : "text-white"
                  } hover:text-orange-300 transition`}
                >
                  <LuPhoneCall className="h-5 w-5" />
                  <span>Call</span>
                </button>
                <button
                  className={`flex items-center gap-1 text-xs ${
                    scrolled ? "text-black" : "text-white"
                  } hover:text-orange-300 transition`}
                >
                  <CiBellOn className="h-5 w-5" />
                  <span>Alerts</span>
                </button>
                <button
                  onClick={openSignup}
                  className={`flex items-center gap-1 text-xs ${
                    scrolled ? "text-black" : "text-white"
                  } hover:text-orange-300 transition`}
                >
                  <FaUserCircle className="h-5 w-5" />
                  <span>Profile</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <SignupModal
        isVisible={isSignupVisible}
        onClose={closeSignup}
        onOpenLogin={openLogin} // Pass callback to open LoginModal
      />
      <LoginModal
        isVisible={isLoginVisible}
        onClose={closeLogin}
        onOpenSignup={openSignup} // Pass callback to open SignupModal
      />
    </div>
  );
}