import React, { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import Navbar from "./Navbar";
import TaskList from "./TaskList";
import TaskModal from "./TaskModal";
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const QuoteSection = ({ quote }) => (
  <motion.blockquote
    variants={itemVariants}
    className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex items-start"
    >
      <span className="text-3xl text-orange-400 mr-3">❝</span>
      <div className="flex flex-col">
        <p className="text-gray-600 italic text-lg">{quote.q}</p>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 text-sm mt-2"
        >
          — {quote.a}
        </motion.span>
      </div>
    </motion.div>
  </motion.blockquote>
);

const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex justify-center items-center py-12"
  >
    <motion.div
      animate={{
        rotate: 360,
        scale: [1, 1.1, 1],
      }}
      transition={{
        rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
        scale: { duration: 1, repeat: Infinity },
      }}
      className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full"
    />
  </motion.div>
);

export default function Dashboard() {
  const { quote, loading } = useContext(TaskContext);
  const [modalTask, setModalTask] = useState(null);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gray-50"
    >
      <Navbar />
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <AnimatePresence mode="wait">
          {quote && <QuoteSection quote={quote} />}
        </AnimatePresence>

        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-6"
        >
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-2xl font-bold text-gray-800 flex items-center gap-3"
          >
            <span className="text-orange-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </span>
            Your Habits
          </motion.h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalTask({})}
            className="px-5 py-2.5 rounded-lg bg-orange-500 text-white 
                     hover:bg-orange-600 transition-colors duration-200
                     flex items-center gap-2 font-medium shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Habit
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <motion.div
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, y: -20 }}
            >
              <TaskList onEdit={setModalTask} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modalTask !== null && (
          <TaskModal task={modalTask} onClose={() => setModalTask(null)} />
        )}
      </AnimatePresence>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </motion.div>
  );
}

// import React, { useContext, useState } from "react";
// import { TaskContext } from "../context/TaskContext";
// import Navbar from "./Navbar";
// import TaskList from "./TaskList";
// import TaskModal from "./TaskModal";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function Dashboard() {
//   const { quote, loading } = useContext(TaskContext);
//   const [modalTask, setModalTask] = useState(null);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="px-4 py-6">
//         {quote && (
//           <blockquote className="mb-4 italic text-gray-600">
//             “{quote.q}” — {quote.a}
//           </blockquote>
//         )}
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-2xl font-semibold">Your Habits</h1>
//           <button
//             onClick={() => setModalTask({})}
//             className="btn-primary px-4 py-2 rounded bg-accent text-white hover:bg-accent-dark cursor-pointer"
//           >
//             + New
//           </button>
//         </div>
//         {loading ? (
//           <div>Loading tasks…</div>
//         ) : (
//           <TaskList onEdit={setModalTask} />
//         )}
//       </div>
//       {modalTask !== null && (
//         <TaskModal task={modalTask} onClose={() => setModalTask(null)} />
//       )}
//       <ToastContainer position="bottom-right" />
//     </div>
//   );
// }
