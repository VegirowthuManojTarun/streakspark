import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTaskDetail } from "../apis";
import { motion, AnimatePresence } from "framer-motion";
import { CurrentRank, RankLadder } from "./RankDisplay"; // adjust the path as needed
import {
  IoChevronBackCircle,
  IoChevronBackCircleOutline,
  IoChevronForwardCircle,
} from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";

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
  const [task, setTask] = useState(null);
  const [doneSet, setDoneSet] = useState(new Set());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchTaskDetail(id);
        setTask(data);
        setDoneSet(
          new Set(data.history.map((d) => format(parseISO(d), "yyyy-MM-dd")))
        );
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  // Calendar math
  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const blanks = Array(getDay(monthStart)).fill(null);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

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
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 mt-10">
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
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
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
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <IoChevronForwardCircle />
            </motion.button>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 mb-2 text-center text-sm font-semibold text-gray-400">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d}>{d}</div>
            ))}
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
              const inPast = isBefore(day, today) && !isSameDay(day, today);
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
                    <span className="text-gray-400">{format(day, "d")}</span>
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
              <span className="text-gray-500 mb-1 text-[15px]">Max Streak</span>
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

      {/* Right Column - Rank Ladder */}
      <div className="md:w-80 mx-10">
        <RankLadder streak={task.streak} />
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { fetchTaskDetail } from "../apis";
// import {
//   format,
//   parseISO,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   getDay,
//   addMonths,
//   subMonths,
// } from "date-fns";

// export default function StreakPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [task, setTask] = useState(null);
//   const [doneSet, setDoneSet] = useState(new Set());
//   const [currentMonth, setCurrentMonth] = useState(new Date());

//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await fetchTaskDetail(id);
//         setTask(data);
//         // build a Set of "yyyy-MM-dd"
//         setDoneSet(
//           new Set(data.history.map((d) => format(parseISO(d), "yyyy-MM-dd")))
//         );
//       } catch (err) {
//         console.error(err);
//       }
//     })();
//   }, [id]);

//   if (!task) return <div className="p-4">Loading…</div>;

//   // Calendar math
//   const monthStart = startOfMonth(currentMonth);
//   const monthEnd = endOfMonth(currentMonth);
//   const blanks = Array(getDay(monthStart)).fill(null);
//   const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-4 text-gray-600 hover:underline"
//       >
//         &larr; Back
//       </button>

//       {/* Header */}
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <h1 className="text-2xl font-semibold mb-2">{task.name}</h1>
//         <div className="flex space-x-10">
//           <div>
//             <p className="text-sm text-gray-500">Current Streak</p>
//             <div className="flex items-center space-x-1 text-xl font-bold">
//               <span className="text-red-500">🔥</span>
//               <span>{task.streak}</span>
//             </div>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Max Streak</p>
//             <div className="flex items-center space-x-1 text-xl font-bold">
//               <span className="text-yellow-500">⚡</span>
//               <span>{task.longestStreak}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Calendar */}
//       <div className="bg-white rounded-lg shadow p-6">
//         {/* Month Nav */}
//         <div className="flex items-center justify-between mb-4">
//           <p className="text-lg font-medium">
//             {format(monthStart, "MMMM yyyy")}
//           </p>
//           <div className="space-x-2">
//             <button
//               onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
//               className="px-2 py-1 rounded hover:bg-gray-200"
//             >
//               &lt;
//             </button>
//             <button
//               onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
//               className="px-2 py-1 rounded hover:bg-gray-200"
//             >
//               &gt;
//             </button>
//           </div>
//         </div>

//         {/* Weekday labels */}
//         <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-600 mb-2">
//           {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//             <div key={d}>{d}</div>
//           ))}
//         </div>

//         {/* Days */}
//         <div className="grid grid-cols-7 gap-1 text-center">
//           {blanks.map((_, i) => (
//             <div key={"b" + i} className="h-10" />
//           ))}
//           {days.map((day) => {
//             const dayStr = format(day, "yyyy-MM-dd");
//             const done = doneSet.has(dayStr);
//             return (
//               <div
//                 key={dayStr}
//                 className={`h-10 flex items-center justify-center border rounded ${
//                   done ? "bg-red-100" : ""
//                 }`}
//               >
//                 {done ? (
//                   <span className="text-red-500">🔥</span>
//                 ) : (
//                   <span className="text-gray-400">{format(day, "d")}</span>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }
