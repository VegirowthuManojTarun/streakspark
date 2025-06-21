import React, { useState, useEffect } from "react";
import {
  FiSave,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import DiaryCalendar from "../components/Diary/DiaryCalendar";
import LinedJournalTextarea from "../components/Diary/LinedJournalTextArea";
function pad(n) {
  return String(n).padStart(2, "0");
}
function dateToStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function formatDateHeading(dt) {
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DiaryPage() {
  const [date, setDate] = useState(() => {
    const savedDate = localStorage.getItem("diary_last_date");
    if (savedDate) {
      return new Date(savedDate);
    }
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });
  const [value, setValue] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [pageDirection, setPageDirection] = useState(0); // -1 for left, 1 for right

  const handleDateNavigation = (direction) => {
    setPageDirection(direction);
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + direction);
    handleDateChange(newDate);
  };

  // Save selected date to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("diary_last_date", date.toISOString());
  }, [date]);

  // Load data for date
  useEffect(() => {
    const key = `diary_unified_${dateToStr(date)}`;
    const stored = window.localStorage.getItem(key);
    setValue(stored || "");
  }, [date]);

  // Modified setDate function to ensure consistent date handling
  const handleDateChange = (newDate) => {
    // Ensure we're working with a clean date object
    const cleanDate = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    );
    setDate(cleanDate);
  };

  // Save logic
  function handleSave(e) {
    if (e) e.preventDefault();
    const key = `diary_unified_${dateToStr(date)}`;
    if (value.trim().length > 0) {
      window.localStorage.setItem(key, value);
      setSaveMsg("Saved!");
      setTimeout(() => setSaveMsg(""), 1200);
    } else {
      window.localStorage.removeItem(key);
    }
  }
  // Page turn animation variants
  const pageVariants = {
    enter: (direction) => ({
      x: direction * 500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction * -500,
      opacity: 0,
    }),
  };

  const pageTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-white flex flex-col items-center py-8 px-2">
      <div className="max-w-2xl w-full mx-auto mb-4 flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
        <div className="flex items-center gap-4">
          {/* Left Arrow */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDateNavigation(-1)}
            className="p-2 rounded-full bg-white border border-orange-100 shadow 
                     hover:bg-orange-50 transition text-orange-500"
          >
            <FiChevronLeft className="w-6 h-6" />
          </motion.button>

          {/* Date Display */}
          <div className="flex items-center">
            <motion.h1
              key={date.toISOString()}
              initial={{ opacity: 0, y: pageDirection * 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: pageDirection * -20 }}
              className="select-none text-2xl md:text-3xl font-bold text-orange-700 
                       tracking-tight font-journal"
            >
              {formatDateHeading(date)}
            </motion.h1>
            <DiaryCalendar
              date={date}
              setDate={handleDateChange}
              open={calendarOpen}
              setOpen={setCalendarOpen}
              trigger={
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.06 }}
                  className="ml-2 rounded-full p-2 bg-white border border-orange-100 
                           shadow hover:bg-orange-50 transition"
                  aria-label="Pick date"
                  type="button"
                  style={{ lineHeight: 0 }}
                  onClick={() => setCalendarOpen((c) => !c)}
                >
                  <FiCalendar className="text-orange-500 w-6 h-6" />
                </motion.button>
              }
            />
          </div>

          {/* Right Arrow */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDateNavigation(1)}
            className="p-2 rounded-full bg-white border border-orange-100 shadow 
                     hover:bg-orange-50 transition text-orange-500"
          >
            <FiChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait" custom={pageDirection}>
        <motion.form
          key={date.toISOString()}
          custom={pageDirection}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={pageTransition}
          onSubmit={handleSave}
          className="relative max-w-2xl mx-auto w-full rounded-2xl shadow-xl 
                   border border-orange-100/90 pt-2.5 pb-3 px-0 md:px-0 
                   bg-white/95 transition"
        >
          <LinedJournalTextarea value={value} setValue={setValue} />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-10 -bottom-7 flex items-center space-x-3"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex items-center text-orange-700 text-base bg-orange-50 
                       hover:bg-orange-200 px-4 py-1.5 rounded shadow transition 
                       font-bold border border-orange-100 gap-2"
            >
              <FiSave />
              Save Entry
            </motion.button>
            <AnimatePresence>
              {saveMsg && (
                <motion.span
                  key="saved"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
                  className="ml-2 text-green-500 font-medium"
                >
                  {saveMsg}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.form>
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite:wght@400&display=swap');
        .font-journal {
          font-family: 'Special Elite', 'Courier New', Courier, monospace;
        }
      `}</style>
    </div>
  );
}
