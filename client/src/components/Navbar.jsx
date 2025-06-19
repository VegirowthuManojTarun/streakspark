import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import PomodoroTimer from "./PomodoroTimer";
import { UserButton } from "@clerk/clerk-react";
// In your component...

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white shadow-sm border-b border-gray-100 px-2 py-3 sticky top-0 z-50"
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-2"
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
        </motion.div>

        {/* User Section */}
        {user && (
          <div className="flex items-center space-x-6">
            {/* Notification Bell - Optional */}
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

            {/* User Profile */}
            <UserButton />
          </div>
        )}
      </div>
    </motion.nav>
  );
}
