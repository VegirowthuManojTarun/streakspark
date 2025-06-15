
import React, { useState, useContext, useEffect } from "react";
import { TaskContext } from "../context/TaskContext";
import TaskForm from "./TaskForm";

export default function TaskModal({ task, onClose }) {
  const { addTask, editTask } = useContext(TaskContext);
  const isEdit = Boolean(task._id);

  const handleSubmit = async (values) => {
    if (isEdit) {
      await editTask(task._id, values);
    } else {
      await addTask(values);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Habit" : "New Habit"}
        </h2>
        <TaskForm initial={task} onSubmit={handleSubmit} onCancel={onClose} />
      </div>
    </div>
  );
}
