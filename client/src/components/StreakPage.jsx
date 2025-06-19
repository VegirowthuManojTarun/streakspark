import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTaskDetail } from "../apis";

import { AuthContext } from "../context/AuthContext"; // ← pull in AuthContext
import { toast } from "react-toastify"; // ← import toast

import { motion, AnimatePresence } from "framer-motion";
import { CurrentRank, RankLadder } from "./RankDisplay"; // adjust the path as needed
import {
  IoChevronBackCircle,
  IoChevronBackCircleOutline,
  IoChevronForwardCircle,
} from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import ShareButton from "../components/ShareButton/ShareButton";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isBefore,
  isAfter,
  isSameDay,
} from "date-fns";

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

const calendarVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const dayVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
    },
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.2,
    },
  },
  tap: { scale: 0.95 },
};

export default function StreakPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useContext(AuthContext);
  const [task, setTask] = useState(null);
  const [doneSet, setDoneSet] = useState(new Set());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const contentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const res = await fetchTaskDetail(id, token);
        // if your API wraps the payload in `task`:
        const taskObj = res.data.task || res.data;
        setTask(taskObj);
        setDoneSet(
          new Set(
            (taskObj.history || []).map((d) =>
              format(parseISO(d), "yyyy-MM-dd")
            )
          )
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load task details");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  // Calendar math
  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const blanks = Array(getDay(monthStart)).fill(null);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add loading state
  if (!task) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 text-lg"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 text-lg"
          >
            Loading...
          </motion.div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div ref={contentRef} className="space-y-6">
              {/* Main Content */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column */}
                <div className="flex-1">
                  <motion.div
                    variants={calendarVariants}
                    className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
                  >
                    <motion.button
                      whileHover={{ x: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(-1)}
                      className="text-gray-500 hover:text-gray-700 mb-3 flex items-center gap-2"
                    >
                      <IoMdArrowRoundBack />
                      <span>Back</span>
                    </motion.button>

                    <div className="mb-8 border-b border-gray-100 pb-6">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col space-y-2"
                      >
                        {/* Task Name */}
                        <div className="flex items-start justify-between">
                          <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight"
                          >
                            {task.name}
                          </motion.h1>
                        </div>

                        {/* Description and Meta Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm">
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-600"
                          >
                            Track your daily progress and achievements
                          </motion.p>

                          <div className="flex items-center gap-4 text-gray-500">
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                              className="flex items-center gap-1"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                              </svg>
                              <span>Daily Check-in</span>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 }}
                              className="flex items-center gap-1"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                              </svg>
                              <span>
                                Started{" "}
                                {format(
                                  parseISO(task.createdAt),
                                  "MMM d, yyyy"
                                )}
                              </span>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    <motion.h2
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-gray-800 text-xl md:text-2xl font-bold mb-6"
                    >
                      Monthly Streak
                    </motion.h2>

                    {/* Month Nav */}
                    <div className="flex items-center justify-between mb-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-gray-600 text-xl px-2 py-1 rounded-full hover:bg-gray-100"
                        onClick={() =>
                          setCurrentMonth(subMonths(currentMonth, 1))
                        }
                      >
                        <IoChevronBackCircle />
                      </motion.button>
                      <motion.span
                        layout
                        className="font-bold text-gray-700 tracking-wide text-lg md:text-xl"
                      >
                        {format(monthStart, "MMMM yyyy")}
                      </motion.span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-gray-600 text-xl px-2 py-1 rounded-full hover:bg-gray-100"
                        onClick={() =>
                          setCurrentMonth(addMonths(currentMonth, 1))
                        }
                      >
                        <IoChevronForwardCircle />
                      </motion.button>
                    </div>

                    {/* Weekday labels */}
                    <div className="grid grid-cols-7 mb-2 text-center text-sm font-semibold text-gray-400">
                      {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                        (d) => (
                          <div key={d}>{d}</div>
                        )
                      )}
                    </div>

                    {/* Calendar days grid */}
                    <motion.div
                      className="grid grid-cols-7 gap-2 text-center mb-7"
                      variants={calendarVariants}
                    >
                      {blanks.map((_, i) => (
                        <div key={"b" + i} />
                      ))}
                      {days.map((day) => {
                        const dayStr = format(day, "yyyy-MM-dd");
                        const isDone = doneSet.has(dayStr);
                        const inPast =
                          isBefore(day, today) && !isSameDay(day, today);
                        const isFuture = isAfter(day, today);

                        return (
                          <motion.div
                            key={dayStr}
                            variants={dayVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className={`
                  flex items-center justify-center 
                  h-10 w-10 md:h-11 md:w-11 mx-auto 
                  rounded-full shadow-sm
                  font-semibold text-lg
                  ${
                    isDone
                      ? "bg-orange-50 border-2 border-orange-500"
                      : inPast
                      ? "bg-gray-50 border-2 border-gray-200"
                      : "bg-white border-2 border-gray-100"
                  }
                  transition-all duration-200
                `}
                            style={{ margin: "auto" }}
                          >
                            {isDone ? (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-2xl"
                                role="img"
                                aria-label="achieved"
                              >
                                🔥
                              </motion.span>
                            ) : inPast ? (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-2xl opacity-50"
                                role="img"
                                aria-label="missed"
                              >
                                🥲
                              </motion.span>
                            ) : (
                              <span className="text-gray-400">
                                {format(day, "d")}
                              </span>
                            )}
                          </motion.div>
                        );
                      })}
                    </motion.div>

                    {/* Updated Stats Section with Current Rank */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex justify-between items-center rounded-xl bg-gray-50 px-6 py-4 border border-gray-100"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center flex-1"
                      >
                        <span className="text-gray-500 mb-1 text-[15px]">
                          Current Streak
                        </span>
                        <span className="flex items-center gap-2 text-orange-500 text-2xl font-extrabold">
                          <motion.span
                            animate={{
                              rotate: [0, -10, 10, -10, 0],
                              scale: [1, 1.1, 1.1, 1.1, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatDelay: 2,
                            }}
                            className="text-2xl"
                          >
                            🔥
                          </motion.span>
                          {task.streak}
                        </span>
                      </motion.div>

                      {/* Add Current Rank here */}
                      <CurrentRank streak={task.streak} />
                      <div className="flex flex-col items-center flex-1 border-l border-gray-200">
                        <span className="text-gray-500 mb-1 text-[15px]">
                          Max Streak
                        </span>
                        <span className="flex items-center gap-2 text-orange-600 text-2xl font-extrabold">
                          <motion.span
                            animate={{
                              y: [0, -5, 0],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              repeatDelay: 3,
                            }}
                            className="text-2xl"
                          >
                            📈
                          </motion.span>
                          {task.longestStreak}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
                {/* Right Column */}
                <div className="w-full lg:w-80">
                  <RankLadder streak={task.streak} />
                </div>
              </div>
            </div>
          </div>

          <ShareButton
            contentRef={contentRef}
            taskName={task?.name || ""} // Add fallback value
            streak={task?.streak || 0} // Add fallback value
          />
        </div>
      )}
    </>
  );
}
