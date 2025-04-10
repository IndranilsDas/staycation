"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaBars,
  FaLayerGroup,
  FaHome,
  FaDatabase,
  FaSignOutAlt,
} from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";
import { BiSolidOffer } from "react-icons/bi";
import { Tooltip } from "react-tooltip";
import { useAuth } from "../../lib/authcontext";

export default function AdminDrawer({ isDrawerOpen, toggleDrawer }) {
  const { logout } = useAuth();

  const iconWrapperStyle = {
    transition: "transform 0.3s",
    transform: isDrawerOpen ? "scale(1)" : "scale(1.1)",
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-gray-900 text-white shadow-lg transition-all duration-300 z-40 flex flex-col justify-between ${
        isDrawerOpen ? "w-48" : "w-14"
      }`}
    >
      {/* Top Section: Header + Menu Items */}
      <div>
        {/* Drawer Toggle Button */}
        <button
          onClick={toggleDrawer}
          className="absolute -right-5 top-4 bg-gray-700 text-white p-2 rounded-full shadow-md focus:outline-none"
        >
          {isDrawerOpen ? "◀" : "▶"}
        </button>

        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {isDrawerOpen && <h2 className="text-lg font-semibold">Admin Menu</h2>}
        </div>

        {/* Menu Items */}
        <ul className="flex flex-col justify-start space-y-2 p-4">
          <li className="group">
            <Link
              href="/admin/hero-form"
              className="flex items-center space-x-3 text-gray-200 hover:bg-gray-700 p-2 rounded transition"
            >
              <span style={iconWrapperStyle}>
                <FaLayerGroup className="text-xl" />
              </span>
              {isDrawerOpen && <span>Hero Form</span>}
            </Link>
            {!isDrawerOpen && (
              <Tooltip id="hero-tooltip" place="right" effect="solid">
                Hero Form
              </Tooltip>
            )}
          </li>

          <li className="group">
            <Link
              href="/admin/add-destinations"
              className="flex items-center space-x-3 text-gray-200 hover:bg-gray-700 p-2 rounded transition"
            >
              <span style={iconWrapperStyle}>
                <FaHome className="text-xl" />
              </span>
              {isDrawerOpen && <span>Destinations</span>}
            </Link>
            {!isDrawerOpen && (
              <Tooltip id="destinations-tooltip" place="right" effect="solid">
                Destinations
              </Tooltip>
            )}
          </li>

          <li className="group">
            <Link
              href="/admin/villas"
              className="flex items-center space-x-3 text-gray-200 hover:bg-gray-700 p-2 rounded transition"
            >
              <span style={iconWrapperStyle}>
                <FaHome className="text-xl" />
              </span>
              {isDrawerOpen && <span>Villas</span>}
            </Link>
            {!isDrawerOpen && (
              <Tooltip id="villas-tooltip" place="right" effect="solid">
                Villas
              </Tooltip>
            )}
          </li>

          <li className="group">
            <Link
              href="/admin/collections"
              className="flex items-center space-x-3 text-gray-200 hover:bg-gray-700 p-2 rounded transition"
            >
              <span style={iconWrapperStyle}>
                <FaDatabase className="text-xl" />
              </span>
              {isDrawerOpen && <span>Collections</span>}
            </Link>
            {!isDrawerOpen && (
              <Tooltip id="collections-tooltip" place="right" effect="solid">
                Collections
              </Tooltip>
            )}
          </li>
          <li className="group">
            <Link
              href="/admin/offers"
              className="flex items-center space-x-3 text-gray-200 hover:bg-gray-700 p-2 rounded transition"
            >
              <span style={iconWrapperStyle}>
                <BiSolidOffer className="text-xl" />
              </span>
              {isDrawerOpen && <span>Offers</span>}
            </Link>
            {!isDrawerOpen && (
              <Tooltip id="Offers-tooltip" place="right" effect="solid">
                Offers
              </Tooltip>
            )}
          </li>
          <li className="group">
            <Link
              href="/admin/add_celebs"
              className="flex items-center space-x-3 text-gray-200 hover:bg-gray-700 p-2 rounded transition"
            >
              <span style={iconWrapperStyle}>
                <RiVipCrownFill className="text-xl" />
              </span>
              {isDrawerOpen && <span>Celebrity Customers</span>}
            </Link>
            {!isDrawerOpen && (
              <Tooltip id="Celebs-tooltip" place="right" effect="solid">
                Celebrity Customers
              </Tooltip>
            )}
          </li>
        </ul>
      </div>

      {/* Bottom Section: Sign Out Button */}
      <div className="p-4">
        <button
          onClick={logout}
          className="flex items-center space-x-3 text-gray-200 hover:bg-gray-700 p-2 rounded transition w-full"
        >
          <span style={iconWrapperStyle}>
            <FaSignOutAlt className="text-xl" />
          </span>
          {isDrawerOpen && <span>Sign Out</span>}
        </button>
        {!isDrawerOpen && (
          <Tooltip id="signout-tooltip" place="right" effect="solid">
            Sign Out
          </Tooltip>
        )}
      </div>
    </div>
  );
}
