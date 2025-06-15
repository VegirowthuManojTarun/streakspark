import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TaskContext } from "../context/TaskContext";
import { format } from "date-fns";

export default function TaskItem({ task, onEdit }) {
  const { checkOff } = useContext(TaskContext);
  const navigate = useNavigate();

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const doneToday =
    task.lastMarkedDate &&
    format(new Date(task.lastMarkedDate), "yyyy-MM-dd") === todayStr;

  return (
    <div className="bg-white p-4 rounded shadow flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium">{task.name}</h3>
        <div className="flex items-center space-x-1 mt-1">
          <span className="text-red-500 text-2xl">🔥</span>
          <span className="text-xl font-bold">{task.streak}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Mark */}
        <button
          onClick={() => checkOff(task._id)}
          disabled={doneToday}
          className={`px-3 py-1 rounded ${
            doneToday ? "bg-gray-300" : "bg-accent text-white hover:opacity-90"
          }`}
        >
          {doneToday ? "Done" : "Mark"}
        </button>

        {/* Track */}
        <button
          onClick={() => navigate(`/app/${task._id}/streak`)}
          className="px-3 py-1 rounded border border-secondary text-secondary hover:bg-secondary hover:text-white"
        >
          Track
        </button>

        {/* Edit */}
        <button
          onClick={() => onEdit(task)}
          className="px-3 py-1 rounded border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
