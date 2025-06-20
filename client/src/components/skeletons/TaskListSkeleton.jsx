// First, create a new component: src/components/skeletons/TaskListSkeleton.jsx
import { motion } from "framer-motion";

const TaskListSkeleton = () => {
  const shimmer = {
    hidden: { x: "-100%" },
    visible: {
      x: "100%",
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      },
    },
  };

  // Single task skeleton item
  const TaskItemSkeleton = () => (
    <div className="relative bg-white rounded-xl p-4 shadow-sm border border-gray-100 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        variants={shimmer}
        initial="hidden"
        animate="visible"
      />

      <div className="flex items-start gap-4">
        {/* Checkbox skeleton */}
        <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />

        <div className="flex-1">
          {/* Title and streak skeleton */}
          <div className="flex items-center justify-between mb-2">
            <div className="h-5 bg-gray-200 rounded w-1/3" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-gray-200 rounded" />
              <div className="h-4 w-8 bg-gray-200 rounded" />
            </div>
          </div>

          {/* Description skeleton */}
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>

          {/* Tags/Priority skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-lg" />
          <div className="w-8 h-8 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {[1, 2, 3, 4].map((index) => (
        <TaskItemSkeleton key={index} />
      ))}
    </div>
  );
};

export default TaskListSkeleton;
