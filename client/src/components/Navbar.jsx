import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

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
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-700">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-400">View Profile</span>
                </div>
                <motion.div whileHover={{ scale: 1.1 }} className="relative">
                  <img
                    src={user.avatar || user.image}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-orange-100"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                  />
                </motion.div>
              </motion.div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700">
                        Signed in as
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Your Profile
                    </motion.button>

                    <motion.button
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Settings
                    </motion.button>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <motion.button
                        whileHover={{ backgroundColor: "#fee2e2" }}
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Sign Out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

// import React, { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// export default function Navbar() {
//   const { user, logout } = useContext(AuthContext);

//   return (
//     <nav className="bg-white shadow p-4 flex items-center justify-between">
//       <h2 className="text-xl font-bold text-primary">StreakSpark</h2>
//       <div className="flex items-center space-x-4">
//         {user && (
//           <>
//             <span className="text-gray-700 font-bold font-mono">{user.name}</span>
//             <img
//               src={user.avatar || user.image}
//               alt="avatar"
//               className="w-8 h-8 rounded-full"
//             />
//             <button
//               onClick={logout}
//               className="text-sm text-red-500 hover:underline border border-red-500 px-3 py-1 rounded"
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }
