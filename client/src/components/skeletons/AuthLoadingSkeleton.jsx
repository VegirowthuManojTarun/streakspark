// src/components/skeletons/AuthLoadingSkeleton.jsx
import { motion } from "framer-motion";

const AuthLoadingSkeleton = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Skeleton */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo/Brand skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Nav items skeleton */}
            <div className="flex items-center gap-4">
              <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content area skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            variants={shimmer}
            initial="hidden"
            animate="visible"
          />

          {/* Content blocks */}
          <div className="space-y-6">
            {/* Header block */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mt-2" />
            </div>

            {/* Secondary blocks */}
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLoadingSkeleton;
