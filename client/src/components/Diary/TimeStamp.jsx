// components/Diary/TimeStamp.jsx
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiX } from "react-icons/fi";

export default function TimeStamp({ onInsert }) {
  const timePickerRef = useRef();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerPosition, setTimePickerPosition] = useState({ x: 0, y: 0 });

  // Set default time to current time
  const [selectedTime, setSelectedTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        timePickerRef.current &&
        !timePickerRef.current.contains(event.target)
      ) {
        setShowTimePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTimeSelect = () => {
    onInsert(`[${selectedTime}] `);
    setShowTimePicker(false);
  };

  const openTimePicker = () => {
    // Update position based on button location
    const button = timePickerRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      setTimePickerPosition({
        x: rect.left,
        y: rect.bottom + window.scrollY + 10,
      });
    }
    setShowTimePicker(true);
  };

  return (
    <div ref={timePickerRef}>
      <motion.button
        type="button"
        onClick={openTimePicker}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-full bg-orange-50 hover:bg-orange-100 
                   text-orange-600 transition-colors shadow-sm 
                   border border-orange-200"
        title="Insert timestamp"
      >
        <FiClock className="w-4 h-4" />
      </motion.button>

      <AnimatePresence>
        {showTimePicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bg-white rounded-lg shadow-xl border border-orange-200 p-3 z-20"
            style={{
              bottom: "-0.5rem",
              right: "3rem",
            }}
          >
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="border border-orange-200 rounded px-2 py-1 text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTimeSelect}
                className="bg-orange-500 text-white px-3 py-1 rounded text-sm 
                         hover:bg-orange-600 transition-colors"
              >
                Insert
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTimePicker(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
