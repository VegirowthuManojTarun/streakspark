import React, { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import TaskList from "../components/TaskList";
import TaskModal from "../components/modals/TaskModal";
import SearchBar from "../components/SearchBar";
import PriorityFilter from "../components/PriorityFilter";
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import TaskListSkeleton from "../components/skeletons/TaskListSkeleton";

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

export default function Dashboard() {
  const { quote, loading } = useContext(TaskContext);
  const [modalTask, setModalTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gray-50"
    >
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <AnimatePresence mode="wait">
          {quote && <QuoteSection quote={quote} />}
        </AnimatePresence>
        <div className="flex flex-col space-y-6 mb-6">
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

          {/* Search and Filter Bar */}
          <motion.div
            variants={itemVariants}
            className="flex gap-2" // Add mb-6 here instead
          >
            <div className="flex-1">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
            <PriorityFilter
              selectedPriorities={priorityFilter}
              onPriorityChange={setPriorityFilter}
              isOpen={isFilterOpen}
              setIsOpen={setIsFilterOpen}
            />
          </motion.div>
        </div>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TaskListSkeleton />
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, y: -20 }}
            >
              <TaskList
                onEdit={setModalTask}
                searchQuery={searchQuery}
                priorityFilter={priorityFilter}
              />
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
