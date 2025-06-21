import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

export default function DiaryCalendar({
  date,
  setDate,
  open,
  setOpen,
  trigger,
}) {
  const calendarWrapperRef = useRef();
  const [view, setView] = useState("month");
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
  const [yearRangeStart, setYearRangeStart] = useState(() => {
    const currentYear = date.getFullYear();
    return Math.floor(currentYear / 20) * 20;
  });

  useEffect(() => {
    setSelectedYear(date.getFullYear());
    setSelectedMonth(date.getMonth());
  }, [date]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        open &&
        calendarWrapperRef.current &&
        !calendarWrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setOpen]);

  const calVariants = {
    hidden: { opacity: 0, y: -8, pointerEvents: "none" },
    visible: { opacity: 1, y: 0, pointerEvents: "auto" },
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const generateYearRange = () => {
    return Array.from({ length: 20 }, (_, i) => yearRangeStart + i);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setView("month");
    setDate(new Date(year, date.getMonth(), date.getDate()));
  };

  const navigateYears = (direction) => {
    setYearRangeStart((prev) => prev + direction * 20);
  };

  const navigationLabel = ({ date }) => (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setView("month");
      }}
      className="text-gray-800 hover:text-orange-600 font-semibold cursor-pointer px-2 py-1 rounded transition-colors"
    >
      {months[date.getMonth()]}
    </div>
  );

  const customCalendarClasses = `
    .react-calendar {
      border: none;
      background: white;
      font-family: system-ui, -apple-system, sans-serif;
      width: 350px;
      padding: 1rem;
    }
    .react-calendar__navigation {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
    }
    .react-calendar__navigation button {
      background: none;
      border: none;
      padding: 0.5rem;
      border-radius: 0.5rem;
      min-width: 44px;
      font-size: 1rem;
      color: #1f2937;
    }
    .react-calendar__navigation button:enabled:hover,
    .react-calendar__navigation button:enabled:focus {
      background-color: #fff7ed;
    }
    .react-calendar__navigation button[disabled] {
      background: none;
      opacity: 0.5;
    }
    .react-calendar__month-view__weekdays {
      font-weight: 600;
      color: #ea580c;
      font-size: 0.875rem;
    }
    .react-calendar__month-view__weekdays__weekday {
      padding: 0.5rem;
    }
    .react-calendar__month-view__weekdays__weekday abbr {
      text-decoration: none;
    }
    .react-calendar__tile {
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-weight: 500;
      color: #1f2937;
    }
    .react-calendar__tile:enabled:hover,
    .react-calendar__tile:enabled:focus {
      background-color: #fff7ed;
      color: #ea580c;
    }
    .react-calendar__tile--active {
      background-color: #ea580c !important;
      color: white !important;
    }
    .react-calendar__tile--now {
      background-color: #ffedd5;
      color: #9a3412;
    }
    .react-calendar__tile--now:enabled:hover,
    .react-calendar__tile--now:enabled:focus {
      background-color: #fed7aa;
    }
  `;

  return (
    <>
      {trigger}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={calendarWrapperRef}
            className="absolute left-0 top-[110%] md:left-auto md:right-0 rounded-2xl shadow-xl border border-orange-200 z-40 bg-white overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={calVariants}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {view === "year" && (
              <div className="p-4 w-[350px]">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div
                      onClick={() => setView("month")}
                      className="text-orange-600 hover:text-orange-700 font-medium cursor-pointer flex items-center gap-1"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                      Back
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigateYears(-1)}
                        className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-600 cursor-pointer"
                      >
                        <FiChevronsLeft className="w-5 h-5" />
                      </motion.div>
                      <span className="text-lg font-semibold text-gray-800 min-w-[120px] text-center">
                        {yearRangeStart} - {yearRangeStart + 19}
                      </span>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigateYears(1)}
                        className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-600 cursor-pointer"
                      >
                        <FiChevronsRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {generateYearRange().map((year) => (
                      <motion.button
                        key={year}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleYearSelect(year)}
                        className={`p-2 rounded-lg text-center transition-colors ${
                          year === selectedYear
                            ? "bg-orange-500 text-white"
                            : "hover:bg-orange-50 text-gray-700"
                        }`}
                      >
                        {year}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {view === "month" && (
              <>
                <div className="p-4 border-b border-orange-100">
                  <div
                    onClick={() => setView("year")}
                    className="flex items-center  gap-2 text-lg font-semibold text-gray-800 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    {selectedYear}
                  </div>
                </div>
                <Calendar
                  onChange={(d) => {
                    const newDate = new Date(
                      d.getFullYear(),
                      d.getMonth(),
                      d.getDate()
                    );
                    setDate(newDate);
                    setSelectedYear(newDate.getFullYear());
                    setSelectedMonth(newDate.getMonth());
                    setOpen(false);
                  }}
                  value={date}
                  next2Label={null}
                  prev2Label={null}
                  showNeighboringMonth={false}
                  minDetail="month"
                  maxDetail="month"
                  nextLabel={<FiChevronRight className="w-5 h-5" />}
                  prevLabel={<FiChevronLeft className="w-5 h-5" />}
                  navigationLabel={navigationLabel}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <style>{customCalendarClasses}</style>
    </>
  );
}