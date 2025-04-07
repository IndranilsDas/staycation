"use client";
import React, { useEffect, useState } from "react";
import { Prompt } from "next/font/google";
import { CiBellOn } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { LuPhoneCall } from "react-icons/lu";
import SignupModal from "./sign-up";
import LoginModal from "./sign-in";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = () => setIsMenuOpen(false);
    if (isMenuOpen) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

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
      <nav>
        <div
          className={`fixed w-full top-0 z-50 transition duration-300 ${
            scrolled ? "backdrop-blur-md shadow-xl" : "bg-transparent"
          }`}
        >
          {tempNav && (
            <div className="relative flex items-center justify-between bg-gradient-to-r from-blue-300 to-orange-300 py-2 px-4 text-xs sm:text-sm md:text-base">
              <span className="text-black text-center flex-1">
                FLAT 15% OFF on your next escape. Use code: <strong>WIN15</strong>
              </span>
              <button onClick={() => setTempNav(false)} className="text-white font-bold">
                ✕
              </button>
            </div>
          )}

          {isUnder ? (
            <div className="flex items-center justify-between px-2 md:px-4 py-3">
              <div className="flex items-center">
                <img
                  src="images/stayvista_logo.svg"
                  className={`h-8 w-16 ${scrolled ? "invert-0" : "invert"}`}
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
                  className={`flex items-center gap-1 text-xs sm:text-sm md:text-base uppercase font-semibold px-2 md:px-3 py-1 md:py-2 rounded ${
                    scrolled ? "ring ring-black text-black" : "ring ring-white text-white"
                  } hover:bg-orange-300 hover:text-black transition duration-200`}
                >
                  Buy a Property
                </button>
                <button
                  className={`flex items-center gap-1 text-xs sm:text-sm md:text-base uppercase font-semibold px-2 md:px-3 py-1 md:py-2 rounded ${
                    scrolled ? "ring ring-black text-black" : "ring ring-white text-white"
                  } hover:bg-orange-300 hover:text-black transition duration-200`}
                >
                  List Your Property
                </button>
                <button
                  className={`flex items-center gap-1 text-xs sm:text-sm md:text-base uppercase font-semibold px-2 md:px-3 py-1 md:py-2 rounded ${
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
          ) : (
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
                  <span>Explore</span>
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

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(!isMenuOpen);
                    }}
                    className={`flex items-center gap-1 text-xs ${
                      scrolled ? "text-black" : "text-white"
                    } hover:text-orange-300 transition`}
                  >
                    ☰ Menu
                  </button>

                  {isMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-44 bg-white text-black rounded-xl shadow-2xl z-50 animate-fadeIn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={openSignup}
                        className="w-full text-left px-5 py-3 hover:bg-orange-100 rounded-b-xl"
                      >
                        Profile
                      </button>
                      <button className="w-full text-left px-5 py-3 hover:bg-orange-100 rounded-t-xl">
                        Buy a Property
                      </button>
                      <button className="w-full text-left px-5 py-3 hover:bg-orange-100">
                        List Your Property
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <SignupModal
        isVisible={isSignupVisible}
        onClose={closeSignup}
        onOpenLogin={openLogin}
      />
      <LoginModal
        isVisible={isLoginVisible}
        onClose={closeLogin}
        onOpenSignup={openSignup}
      />
    </div>
  );
}
