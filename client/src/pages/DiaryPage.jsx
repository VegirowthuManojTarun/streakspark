import React, { useMemo, useEffect, useState } from "react";

import {
  FiSave,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import DiaryCalendar from "../components/Diary/DiaryCalendar";
import LinedJournalTextarea from "../components/Diary/LinedJournalTextArea";
import { useDiary } from "../context/DiaryContext";

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
    if (savedDate) return new Date(savedDate);
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });
  const {
    entries,
    getEntryByDateStr,
    addEntry,
    updateEntry,
    removeEntry,
    loading,
  } = useDiary();

  const dateStr = useMemo(() => dateToStr(date), [date]);
  const entry = getEntryByDateStr(dateStr);

  const [value, setValue] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [pageDirection, setPageDirection] = useState(0);

  // UI: reveal entry on date change
  useEffect(() => {
    setValue(entry ? entry.content : "");
  }, [entry, dateStr]);

  // Save last selected date for UX
  useEffect(() => {
    localStorage.setItem("diary_last_date", date.toISOString());
  }, [date]);

  const handleDateNavigation = (direction) => {
    setPageDirection(direction);
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + direction);
    handleDateChange(newDate);
  };

  const handleDateChange = (newDate) => {
    const cleanDate = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    );
    setDate(cleanDate);
  };

  async function handleSave(e) {
    e && e.preventDefault();
    if (!value.trim() && entry) {
      // Remove
      await removeEntry(entry._id);
      setSaveMsg("Entry deleted!");
      setTimeout(() => setSaveMsg(""), 1200);
      return;
    }
    if (entry) await updateEntry(entry._id, value);
    else await addEntry(dateStr, value);
    setSaveMsg("Saved!");
    setTimeout(() => setSaveMsg(""), 1200);
  }

  // Animation variants
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
          <LinedJournalTextarea
            value={value}
            setValue={setValue}
            loading={loading}
          />
          {/* Enhanced Action Buttons Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-6 -bottom-8 flex items-center gap-3"
          >
            {/* Primary Save/Update Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`
      flex items-center gap-2 px-4 py-2.5 rounded-lg
      font-semibold text-sm transition-all duration-200
      ${
        loading
          ? "bg-orange-100 text-orange-400 cursor-not-allowed"
          : "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-0.5"
      }
    `}
            >
              <motion.div
                animate={loading ? { rotate: 360 } : {}}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <FiSave className={`w-4 h-4 ${loading ? "opacity-70" : ""}`} />
              </motion.div>
              {loading ? "Saving..." : entry ? "Update Entry" : "Save Entry"}
            </motion.button>

            {/* Delete Button - Only show if entry exists */}
            {value && entry && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={async () => {
                  await removeEntry(entry._id);
                  setValue("");
                  setSaveMsg("Entry deleted!");
                }}
                disabled={loading}
                className={`
        flex items-center gap-2 px-4 py-2.5 rounded-lg
        font-semibold text-sm transition-all duration-200
        ${
          loading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 hover:-translate-y-0.5"
        }
      `}
              >
                <motion.div
                  whileHover={{ rotate: 20 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </motion.div>
                Delete
              </motion.button>
            )}

            {/* Save Message Animation */}
            <AnimatePresence>
              {saveMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { type: "spring", stiffness: 400, damping: 25 },
                  }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-14 bg-white px-4 py-2 rounded-lg shadow-lg border border-green-100"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, times: [0, 0.5, 1] }}
                    >
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <span className="text-sm font-medium text-green-600">
                      {saveMsg}
                    </span>
                  </div>
                </motion.div>
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
