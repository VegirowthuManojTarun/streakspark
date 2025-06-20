// src/components/LandingNavbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser, UserButton } from "@clerk/clerk-react";

export default function LandingNavbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="absolute top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 md:px-1 py-4 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <span className="text-2xl">🔥</span>
          <span className="text-white font-bold text-xl">StreakSpark</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 
                        border border-white/20 rounded-full transition-all duration-200
                        text-white font-medium group"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                Sign In
              </span>
            </Link>
          )}
        </motion.div>
      </div>
    </nav>
  );
}
