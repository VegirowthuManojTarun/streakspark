import React, { useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../apis";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const onSuccess = async (codeResponse) => {
    try {
      const res = await googleAuth(codeResponse.code);
      const { user, token } = res.data;
      Cookies.set("jwt_token", token, { expires: 7 });
      setUser(user);
      toast.success("Welcome, " + user.displayName);
      navigate("/app");
    } catch {
      toast.error("Google login failed");
    }
  };

  const onError = () => toast.error("Google login error");

  const login = useGoogleLogin({
    onSuccess,
    onError,
    flow: "auth-code",
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
          className="text-5xl mb-4"
        >
          🔥
        </motion.div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          StreakSpark
        </h1>
        <p className="text-gray-600 text-lg">
          Track your habits, build your streak
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Welcome Back
        </h2>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => login()}
          className="w-full flex items-center justify-center space-x-3 px-6 py-3
                     bg-white border-2 border-gray-200 rounded-lg
                     text-gray-700 font-medium
                     hover:bg-gray-50 hover:border-gray-300
                     transition-all duration-200 shadow-sm"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Continue with Google</span>
        </motion.button>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>🎯</span>
              <span>Set and track daily goals</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>📊</span>
              <span>Monitor your progress</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>🎉</span>
              <span>Celebrate your achievements</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center text-sm text-gray-500"
      >
        <p>By continuing, you agree to our</p>
        <div className="space-x-2">
          <a href="#" className="text-orange-500 hover:underline">
            Terms of Service
          </a>
          <span>and</span>
          <a href="#" className="text-orange-500 hover:underline">
            Privacy Policy
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
