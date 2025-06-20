// src/components/Timetable/TimetableSkeleton.jsx
import { motion } from "framer-motion";

const TimetableSkeleton = () => {
  // Animation for shimmer effect
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

  // Generate dummy rows for skeleton
  const dummyRows = Array(5).fill(null);

  return (
    <div className="space-y-6">
      {/* Progress Banner Skeleton */}
      <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-4 sm:p-6 animate-pulse">
        <div className="h-6 w-48 bg-orange-200 rounded mb-4" />
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-orange-200 rounded" />
            <div className="h-4 w-12 bg-orange-200 rounded" />
          </div>
          <div className="h-2 bg-orange-200 rounded-full" />
        </div>
      </div>

      {/* Header Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full" />
            <div className="h-8 w-40 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-gray-200 rounded-lg" />
            <div className="h-10 w-24 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Table Skeleton */}
        {/* Mobile View */}
        <div className="sm:hidden space-y-4">
          <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
            <div className="w-[100px] h-4 bg-gray-200 rounded" />
            <div className="flex-1 h-4 bg-gray-200 rounded" />
            <div className="w-[60px] h-4 bg-gray-200 rounded" />
          </div>

          {dummyRows.map((_, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden bg-white rounded-lg p-4 border border-gray-100"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                variants={shimmer}
                initial="hidden"
                animate="visible"
              />
              <div className="flex items-center gap-3">
                <div className="w-[100px] h-4 bg-gray-200 rounded" />
                <div className="flex-1 h-4 bg-gray-200 rounded" />
                <div className="w-[60px] h-8 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 w-[200px]">
                  <div className="h-4 bg-gray-200 rounded" />
                </th>
                <th className="px-6 py-3">
                  <div className="h-4 bg-gray-200 rounded" />
                </th>
                <th className="px-6 py-3 w-[100px]">
                  <div className="h-4 bg-gray-200 rounded" />
                </th>
              </tr>
            </thead>
            <tbody>
              {dummyRows.map((_, idx) => (
                <tr key={idx} className="relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                  />
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-8 w-20 bg-gray-200 rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimetableSkeleton;
