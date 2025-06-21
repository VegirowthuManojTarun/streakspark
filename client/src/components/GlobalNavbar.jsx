import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import PomodoroTimer from "./PomodoroTimer";
import { UserButton } from "@clerk/clerk-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiBook,
  FiBookOpen,
  FiCalendar,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Animation for mobile menu
  const menuVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white shadow-sm border-b border-gray-100 px-2 py-3 sticky top-0 z-50"
    >
      <div className="container mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate("/")} // Add navigate import from react-router-dom
          className="flex items-center space-x-2 cursor-pointer"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 5,
            }}
            className="text-2xl"
          >
            🔥
          </motion.div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            StreakSpark
          </h2>
        </motion.button>
        {/* Always-on Pomodoro (small on mobile) & Hamburger (mobile only) */}
        {user && (
          <div className="flex md:hidden items-center ml-auto space-x-2">
            <PomodoroTimer small />
            <button
              className="text-gray-500 focus:outline-none"
              onClick={() => setMenuOpen(true)}
              aria-label="Toggle navigation menu"
            >
              <FiMenu className="w-7 h-7" />
            </button>
          </div>
        )}

        {/* Desktop Nav Links */}
        {user && (
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg font-medium transition-all gap-2
                 ${
                   isActive || location.pathname === "/dashboard"
                     ? "bg-orange-100 text-orange-600 shadow"
                     : "text-gray-700 hover:bg-gray-50"
                 }`
              }
            >
              <FiActivity className="w-5 h-5" />
              Dashboard
            </NavLink>
            <NavLink
              to="/timetable"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg font-medium transition-all gap-2
                 ${
                   isActive || location.pathname === "/timetable"
                     ? "bg-orange-100 text-orange-600 shadow"
                     : "text-gray-700 hover:bg-gray-50"
                 }`
              }
            >
              <FiCalendar className="w-5 h-5" />
              Timetable
            </NavLink>
            <NavLink
              to="/diary"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg font-medium transition-all gap-2
                 ${
                   isActive || location.pathname === "/timetable"
                     ? "bg-orange-100 text-orange-600 shadow"
                     : "text-gray-700 hover:bg-gray-50"
                 }`
              }
            >
              <FiBook className="w-5 h-5" />
              Diary
            </NavLink>
          </div>
        )}

        {/* User, Pomodoro (desktop) */}
        {user && (
          <div className="hidden md:flex items-center space-x-4 ml-4">
            <PomodoroTimer />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </motion.button>
            <UserButton />
          </div>
        )}

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {menuOpen && user && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuVariants}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="absolute top-0 right-0 w-3/4 max-w-xs h-screen bg-white shadow-lg z-50 flex flex-col gap-2 pt-6 pr-4 pl-8 md:hidden"
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-500"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <FiX className="w-7 h-7" />
              </button>
              {/* Spacer to align with logo */}
              <div style={{ height: 40 }} />
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `mb-2 flex items-center px-4 py-3 rounded-lg font-medium transition-all gap-2 text-lg
                     ${
                       isActive || location.pathname === "/dashboard"
                         ? "bg-orange-100 text-orange-600 shadow"
                         : "text-gray-700 hover:bg-gray-100"
                     }`
                }
                onClick={() => setMenuOpen(false)}
              >
                <FiActivity className="w-5 h-5" />
                Dashboard
              </NavLink>
              <NavLink
                to="/timetable"
                className={({ isActive }) =>
                  `mb-2 flex items-center px-4 py-3 rounded-lg font-medium transition-all gap-2 text-lg
                     ${
                       isActive || location.pathname === "/timetable"
                         ? "bg-orange-100 text-orange-600 shadow"
                         : "text-gray-700 hover:bg-gray-100"
                     }`
                }
                onClick={() => setMenuOpen(false)}
              >
                <FiCalendar className="w-5 h-5" />
                Timetable
              </NavLink>
              <NavLink
                to="/diary"
                className={({ isActive }) =>
                  `mb-2 flex items-center px-4 py-3 rounded-lg font-medium transition-all gap-2 text-lg
                     ${
                       isActive || location.pathname === "/timetable"
                         ? "bg-orange-100 text-orange-600 shadow"
                         : "text-gray-700 hover:bg-gray-100"
                     }`
                }
                onClick={() => setMenuOpen(false)}
              >
                <FiBook className="w-5 h-5" />
                Diary
              </NavLink>
              <div className="flex items-center space-x-3 pl-2 mt-4">
                <UserButton />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
