import React, { useState } from "react";

export default function TaskForm({ initial = {}, onSubmit, onCancel }) {
  const [name, setName] = useState(initial.name || "");
  const [time, setTime] = useState(initial.notificationTime || "08:00");

  const handle = (e) =>
    e.preventDefault() || onSubmit({ name, notificationTime: time });

  return (
    <form onSubmit={handle} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Habit Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-solid border-gray-300 rounded p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Notify at</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="mt-1 block w-32 border border-solid border-gray-300 rounded p-2"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border border-solid cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary border border-solid px-4 py-2 rounded cursor-pointer"
        >
          {initial._id ? "Save" : "Create"}
        </button>
      </div>
    </form>
  );
}
