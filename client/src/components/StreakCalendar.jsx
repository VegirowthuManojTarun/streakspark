import React, { useState, useContext, useMemo } from "react";
import { motion } from "framer-motion";
import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5";
import { TaskContext } from "../context/TaskContext";
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

const StreakCalendar = ({ highestStreakTask }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Create doneSet from highest streak task's history
  const doneSet = useMemo(() => {
    if (!highestStreakTask?.history) return new Set();
    return new Set(
      highestStreakTask.history.map((date) =>
        format(parseISO(date), "yyyy-MM-dd")
      )
    );
  }, [highestStreakTask]);

  // Calendar calculations
  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const blanks = Array(getDay(monthStart)).fill(null);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (!highestStreakTask) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-3 w-full h-full flex items-center justify-center">
        <p className="text-gray-400 text-xs">No tasks available</p>
      </div>
    );
  }

  const RANK_TIERS = [
    { name: "Novice", threshold: 0, icon: "🔥", color: "text-gray-500" },
    { name: "Bronze", threshold: 7, icon: "🥉", color: "text-amber-600" },
    { name: "Silver", threshold: 30, icon: "🥈", color: "text-gray-400" },
    { name: "Gold", threshold: 100, icon: "🥇", color: "text-yellow-500" },
    { name: "Platinum", threshold: 180, icon: "💫", color: "text-cyan-500" },
    { name: "Diamond", threshold: 365, icon: "💎", color: "text-blue-500" },
    { name: "Master", threshold: 500, icon: "👑", color: "text-purple-500" },
  ];

  const getCurrentRank = (streak) => {
    return RANK_TIERS.reduce((prev, curr) => {
      return streak >= curr.threshold ? curr : prev;
    });
  };

  const CompactRankLadder = ({ streak }) => {
    const currentRank = getCurrentRank(streak);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg p-4 text-xs shadow-sm"
      >
        <h3 className="text-md sm:text-lg font-bold text-gray-800 mb-4">
          Rank Ladder
        </h3>
        <div className="space-y-1">
          {RANK_TIERS.map((tier) => (
            <motion.div
              key={tier.name}
              className={`flex items-center p-1.5 rounded-md ${
                tier.name === currentRank.name
                  ? "bg-orange-50 border border-orange-200"
                  : ""
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-sm mr-1.5">{tier.icon}</span>
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${tier.color} truncate`}>
                  {tier.name}
                </div>
                <div className="text-[10px] text-gray-500">
                  {tier.threshold}+ days
                </div>
              </div>
              {tier.name === currentRank.name && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap ml-1"
                >
                  Current
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <div className="flex gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-sm p-3 w-1/2"
        >
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-800 text-md md:text-lg font-bold mb-6"
          >
            Monthly Streak
          </motion.h2>
          {/* Task Info Header */}
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-gray-700 truncate max-w-[100px]">
                  {highestStreakTask.name}
                </span>
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px]">🔥</span>
                  <span className="text-[10px] font-bold text-orange-500">
                    {highestStreakTask.streak || 0}
                  </span>
                </div>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <IoChevronBackCircle className="w-3 h-3" />
                </motion.button>

                <span className="text-[10px] font-medium text-gray-600">
                  {format(monthStart, "MMM yyyy")}
                </span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <IoChevronForwardCircle className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 mb-1 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, index) => (
              <div
                key={`weekday-${index}`}
                className="text-[8px] font-medium text-gray-400"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-[1px] text-center">
            {blanks.map((_, i) => (
              <div key={`blank-${i}`} className="w-full aspect-square" />
            ))}

            {days.map((day) => {
              const dayStr = format(day, "yyyy-MM-dd");
              const isDone = doneSet.has(dayStr);
              const inPast = isBefore(day, today) && !isSameDay(day, today);

              return (
                <motion.div
                  key={dayStr}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                flex items-center justify-center
                w-[90%] mb-1 aspect-square rounded-full
                ${
                  isDone
                    ? "bg-orange-50 border border-orange-500"
                    : inPast
                    ? "bg-gray-50 border border-gray-200"
                    : "bg-white border border-gray-100"
                }
              `}
                >
                  {isDone ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-sm"
                      role="img"
                      aria-label="achieved"
                    >
                      🔥
                    </motion.span>
                  ) : inPast ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-sm opacity-20"
                      role="img"
                      aria-label="missed"
                    >
                      🔥
                    </motion.span>
                  ) : (
                    <span className="text-gray-400">{format(day, "d")}</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        <div className="w-1/2">
          <CompactRankLadder streak={highestStreakTask.streak || 0} />
        </div>
      </div>
    </>
  );
};

export default StreakCalendar;
