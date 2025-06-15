import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTaskDetail } from "../apis";
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

  if (!task) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#17181C]">
        <div className="text-white text-lg">Loading…</div>
      </div>
    );
  }

  // Calendar math
  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const blanks = Array(getDay(monthStart)).fill(null);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="min-h-screen bg-[#17181C] flex flex-col items-center justify-center py-6 px-2">
      <div className="max-w-md w-full bg-[#191A1F] rounded-2xl shadow-lg p-6 md:p-8">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white mb-3"
        >
          &larr; Back
        </button>
        <h2 className="text-white text-xl md:text-2xl font-bold mb-6">
          Monthly Streak
        </h2>

        {/* Month Nav */}
        <div className="flex items-center justify-between mb-4">
          <button
            aria-label="Previous Month"
            className="text-white/40 text-xl px-2 py-1 rounded-full hover:bg-black/30"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            &#60;
          </button>
          <span className="font-bold text-white tracking-wide text-lg md:text-xl">
            {format(monthStart, "MMMM yyyy")}
          </span>
          <button
            aria-label="Next Month"
            className="text-white/40 text-xl px-2 py-1 rounded-full hover:bg-black/30"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            &#62;
          </button>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 mb-2 text-center text-[13px] font-semibold text-[#E0E0E0]">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-2 text-center mb-7 animate-in fade-in">
          {blanks.map((_, i) => (
            <div key={"b" + i} />
          ))}
          {days.map((day) => {
            const dayStr = format(day, "yyyy-MM-dd");
            const isDone = doneSet.has(dayStr);
            const inPast = isBefore(day, today) && !isSameDay(day, today);
            const isFuture = isAfter(day, today);
            return (
              <div
                key={dayStr}
                className={`
                  flex items-center justify-center 
                  h-10 w-10 md:h-11 md:w-11 mx-auto 
                  rounded-full shadow-sm
                  font-semibold text-lg
                  ${
                    isDone
                      ? "bg-[#1d1e23] border-2 border-[#FE8040]" // Flame: orange border
                      : inPast
                      ? "bg-[#23232A] border-2 border-[#25262b] opacity-100" // Missed: dim bg
                      : "bg-[#23232A] border-2 border-[#25262b] opacity-60" // Future: faded
                  }
                  transition-all
                `}
                style={{ margin: "auto" }}
              >
                {isDone ? (
                  <span className="text-2xl" role="img" aria-label="achieved">
                    🔥
                  </span>
                ) : inPast ? (
                  <span className="text-2xl" role="img" aria-label="missed">
                    🥲
                  </span>
                ) : (
                  <span className="text-gray-500">{format(day, "d")}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Streak Stats - style as bottom bar in reference */}
        <div className="flex justify-between items-center rounded-lg bg-[#23232A] px-6 py-4 text-white font-semibold">
          <div className="flex flex-col items-center flex-1">
            <span className="opacity-80 mb-1 text-[15px]">Current Streak</span>
            <span className="flex items-center gap-2 text-orange-400 text-2xl font-extrabold">
              <span className="text-2xl" role="img" aria-label="Current Streak">
                🔥
              </span>{" "}
              {task.streak}
            </span>
          </div>
          <div className="flex flex-col items-center flex-1 border-l border-[#373840]">
            <span className="opacity-80 mb-1 text-[15px]">Max Streak</span>
            <span className="flex items-center gap-2 text-[#ffa600] text-2xl font-extrabold">
              <span className="text-2xl" role="img" aria-label="Max Streak">
                📈
              </span>{" "}
              {task.longestStreak}
            </span>
          </div>
        </div>
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
