import React, { useState } from "react";
import { motion } from "framer-motion";

export default function TaskForm({ initial = {}, onSubmit, onCancel }) {
  const [name, setName] = useState(initial.name || "");
  const [time, setTime] = useState(initial.notificationTime || "08:00");

  const handle = (e) =>
    e.preventDefault() || onSubmit({ name, notificationTime: time });

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handle}
      className="space-y-6"
    >
      {/* Habit Name Input */}
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Habit Name
        </label>
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter your habit name"
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 
                     focus:border-orange-400 focus:ring-2 focus:ring-orange-200 
                     outline-none transition-all duration-200
                     text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Notification Time Input */}
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Reminder Time
        </label>
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="px-4 py-3 rounded-lg border-2 border-gray-200 
                     focus:border-orange-400 focus:ring-2 focus:ring-orange-200 
                     outline-none transition-all duration-200
                     text-gray-700 w-auto"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-lg border-2 border-gray-300
                     text-gray-600 font-medium
                     hover:bg-gray-50 hover:border-gray-400
                     transition-colors duration-200"
        >
          Cancel
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-orange-500 
                     text-white font-medium
                     hover:bg-orange-600 
                     transition-colors duration-200
                     shadow-sm hover:shadow"
        >
          {initial._id ? "Save Changes" : "Create Habit"}
        </motion.button>
      </div>

      {/* Optional Helper Text */}
      <p className="text-sm text-gray-500 text-center mt-4">
        {initial._id
          ? "Update your habit details above"
          : "Start your journey by creating a new habit"}
      </p>
    </motion.form>
  );
}

// import React, { useState } from "react";

// export default function TaskForm({ initial = {}, onSubmit, onCancel }) {
//   const [name, setName] = useState(initial.name || "");
//   const [time, setTime] = useState(initial.notificationTime || "08:00");

//   const handle = (e) =>
//     e.preventDefault() || onSubmit({ name, notificationTime: time });

//   return (
//     <form onSubmit={handle} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium">Habit Name</label>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//           className="mt-1 block w-full border border-solid border-gray-300 rounded p-2"
//         />
//       </div>
//       <div>
//         <label className="block text-sm font-medium">Notify at</label>
//         <input
//           type="time"
//           value={time}
//           onChange={(e) => setTime(e.target.value)}
//           required
//           className="mt-1 block w-32 border border-solid border-gray-300 rounded p-2"
//         />
//       </div>
//       <div className="flex justify-end space-x-2">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="px-4 py-2 rounded border border-solid cursor-pointer"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           className="btn-primary border border-solid px-4 py-2 rounded cursor-pointer"
//         >
//           {initial._id ? "Save" : "Create"}
//         </button>
//       </div>
//     </form>
//   );
// }
