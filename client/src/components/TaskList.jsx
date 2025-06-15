import React, { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import TaskItem from "./TaskItem";

export default function TaskList({ onEdit }) {
  const { tasks } = useContext(TaskContext);

  if (tasks.length === 0) {
    return <p className="text-gray-500">No habits yet. Add one!</p>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onEdit={onEdit} />
      ))}
    </div>
  );
}
