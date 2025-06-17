// PomodoroTimer.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoTimerOutline,
  IoPauseCircle,
  IoPlayCircle,
  IoRefreshCircle,
  IoAddCircleOutline,
  IoRemoveCircleOutline,
} from "react-icons/io5";

const DEFAULT_TIME = 25 * 60;
const PRESET_TIMES = [
  { label: "25min", value: 25 },
  { label: "15min", value: 15 },
  { label: "5min", value: 5 },
];

export default function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);
  const [customTime, setCustomTime] = useState(25);
  const timerRef = useRef(null);
  const audioRef = useRef(new Audio("/notification.mp3"));

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    audioRef.current.play();
    // Optional: Show notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Time's up!", {
        body: "Your focus session is complete!",
        icon: "🎯",
      });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCustomTimeChange = (e) => {
    const value = Math.min(Math.max(parseInt(e.target.value) || 1, 1), 60);
    setCustomTime(value);
    setTimeLeft(value * 60);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(customTime * 60);
  };

  const adjustTime = (amount) => {
    if (!isActive) {
      const newTime = Math.min(Math.max(customTime + amount, 1), 60);
      setCustomTime(newTime);
      setTimeLeft(newTime * 60);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600"
      >
        <IoTimerOutline className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Focus Timer
              </h3>

              {/* Timer Display */}
              <div className="text-4xl font-mono font-bold text-gray-800 mb-4">
                {formatTime(timeLeft)}
              </div>

              {/* Preset Times */}
              <div className="flex justify-center gap-2 mb-4">
                {PRESET_TIMES.map(({ label, value }) => (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (!isActive) {
                        setCustomTime(value);
                        setTimeLeft(value * 60);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                      ${
                        customTime === value
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }
                      ${isActive ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>

              {/* Custom Time Input */}
              <div className="mb-6 bg-gray-50 p-3 rounded-lg">
                <label className="text-sm text-gray-600 mb-2 block">
                  Custom Duration
                </label>
                <div className="flex items-center justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => adjustTime(-1)}
                    disabled={isActive}
                    className={`text-2xl text-gray-500 hover:text-gray-700 
                      ${isActive ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <IoRemoveCircleOutline />
                  </motion.button>

                  <div className="flex items-center">
                    <input
                      type="number"
                      value={customTime}
                      onChange={handleCustomTimeChange}
                      className="w-16 text-center rounded border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      min="1"
                      max="60"
                      disabled={isActive}
                    />
                    <span className="ml-2 text-gray-600">minutes</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => adjustTime(1)}
                    disabled={isActive}
                    className={`text-2xl text-gray-500 hover:text-gray-700
                      ${isActive ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <IoAddCircleOutline />
                  </motion.button>
                </div>
              </div>

              {/* Timer Progress */}
              <div className="mb-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{
                    width: `${(timeLeft / (customTime * 60)) * 100}%`,
                  }}
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                />
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsActive(!isActive)}
                  className="text-3xl text-orange-500 hover:text-orange-600"
                >
                  {isActive ? <IoPauseCircle /> : <IoPlayCircle />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleReset}
                  className="text-3xl text-gray-400 hover:text-gray-600"
                >
                  <IoRefreshCircle />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
