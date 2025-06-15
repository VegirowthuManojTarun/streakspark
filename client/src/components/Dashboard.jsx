import React, { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import Navbar from "./Navbar";
import TaskList from "./TaskList";
import TaskModal from "./TaskModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const { quote, loading } = useContext(TaskContext);
  const [modalTask, setModalTask] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="px-4 py-6">
        {quote && (
          <blockquote className="mb-4 italic text-gray-600">
            “{quote.q}” — {quote.a}
          </blockquote>
        )}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Your Habits</h1>
          <button
            onClick={() => setModalTask({})}
            className="btn-primary px-4 py-2 rounded bg-accent text-white hover:bg-accent-dark cursor-pointer"
          >
            + New
          </button>
        </div>
        {loading ? (
          <div>Loading tasks…</div>
        ) : (
          <TaskList onEdit={setModalTask} />
        )}
      </div>
      {modalTask !== null && (
        <TaskModal task={modalTask} onClose={() => setModalTask(null)} />
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}
