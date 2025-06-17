// TaskList.jsx
import React, { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import TaskItem from "./TaskItem";

export default function TaskList({ onEdit }) {
  const { tasks } = useContext(TaskContext);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">
          No habits yet. Start by adding one!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onEdit={onEdit} />
      ))}
    </div>
  );
}

// import React, { useContext } from "react";
// import { TaskContext } from "../context/TaskContext";
// import TaskItem from "./TaskItem";

// export default function TaskList({ onEdit }) {
//   const { tasks } = useContext(TaskContext);

//   if (tasks.length === 0) {
//     return <p className="text-gray-500">No habits yet. Add one!</p>;
//   }

//   return (
//     <div className="space-y-4">
//       {tasks.map((task) => (
//         <TaskItem key={task._id} task={task} onEdit={onEdit} />
//       ))}
//     </div>
//   );
// }
