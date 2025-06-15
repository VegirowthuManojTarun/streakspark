import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow p-4 flex items-center justify-between">
      <h2 className="text-xl font-bold text-primary">StreakSpark</h2>
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <span className="text-gray-700 font-bold font-mono">{user.name}</span>
            <img
              src={user.avatar || user.image}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:underline border border-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
