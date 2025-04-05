'use client';
import React from 'react'
import { CiBellOn } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { LuPhoneCall } from "react-icons/lu";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";

export default function Detailview_nav({ scrolled = false }) {
  // You may pass the `scrolled` prop from the parent if needed
  return (
    <nav>
      {/* Changed z-50 to z-60 so this nav always stays on top */}
      <div
        id='toolbar'
        className='fixed top-0 w-screen bg-black/50 flex justify-between z-60 px-12 py-3'
      >
        <img
          src="images/stayvista_logo.svg"
          className={`h-10 w-20 ${scrolled ? 'invert-0' : 'invert'}`}
          alt="StayVista Logo"
        />
        <div className='flex px-2 rounded-full border border-black w-100 justify-evenly items-center ml-30'>
          <div className='text-center'>Villa</div>
          <h1 className='h-full border-l border-l-black'></h1>
          <div className='text-center'>Date</div>
          <h1 className='h-full border-l border-l-black'></h1>
          <div className='text-center'>
            <HiMagnifyingGlassCircle className='h-6 w-6' />
          </div>
        </div>
        <div className='flex gap-4'>
          <button
            className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base uppercase font-semibold px-2 md:px-3 py-1 md:py-2 rounded 
                        ${scrolled ? 'ring ring-black text-black' : 'ring ring-white text-white'} 
                        hover:bg-orange-300 hover:text-black transition duration-200`}
          >
            <LuPhoneCall className='h-4 w-4 sm:h-5 sm:w-5' />
            <span className="hidden sm:inline">+91 9167928471</span>
          </button>
          <button>
            <CiBellOn
              className={`h-6 w-6 sm:h-8 sm:w-8 cursor-pointer hover:text-orange-300 duration-300 ${
                scrolled ? 'text-black' : 'text-white'
              }`}
            />
          </button>
          <button>
            <FaUserCircle
              className={`h-6 w-6 sm:h-8 sm:w-8 cursor-pointer hover:text-orange-300 duration-300 ${
                scrolled ? 'text-black' : 'text-white'
              }`}
            />
          </button>
        </div>
      </div>
    </nav>
  )
}
