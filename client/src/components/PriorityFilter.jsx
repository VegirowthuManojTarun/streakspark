// PriorityFilterDropdown.jsx
import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoFilterSharp } from "react-icons/io5";

const PRIORITY_OPTIONS = [
  { value: 1, label: "Urgent", className: "text-red-500" },
  { value: 2, label: "High", className: "text-orange-500" },
  { value: 3, label: "Medium", className: "text-yellow-600" },
  { value: 4, label: "Low", className: "text-green-500" },
  { value: 5, label: "None", className: "text-gray-500" },
];

export default function PriorityFilter({
  selectedPriorities,
  onPriorityChange,
  isOpen,
  setIsOpen,
}) {
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const togglePriority = (priority) => {
    const newSelected = selectedPriorities.includes(priority)
      ? selectedPriorities.filter((p) => p !== priority)
      : [...selectedPriorities, priority];
    onPriorityChange(newSelected);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-2.5 rounded-lg flex items-center gap-2 transition-colors duration-200
          ${
            selectedPriorities.length > 0
              ? "bg-orange-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }
        `}
      >
        <IoFilterSharp className="w-5 h-5" />
        {selectedPriorities.length > 0 && (
          <span className="text-sm font-medium">
            {selectedPriorities.length}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
          >
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Filter by Priority
              </h3>
              <div className="space-y-1">
                {PRIORITY_OPTIONS.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ x: 2 }}
                    onClick={() => togglePriority(option.value)}
                    className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-gray-50"
                  >
                    <motion.div
                      initial={false}
                      animate={{
                        background: selectedPriorities.includes(option.value)
                          ? "rgb(249, 115, 22)"
                          : "white",
                      }}
                      className={`
                        w-4 h-4 rounded border-2 border-orange-500 mr-3
                        flex items-center justify-center
                      `}
                    >
                      {selectedPriorities.includes(option.value) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="w-2 h-2 bg-white rounded"
                        />
                      )}
                    </motion.div>
                    <span className={`${option.className} font-medium`}>
                      {option.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
