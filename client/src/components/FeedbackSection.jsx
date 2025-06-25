// components/FeedbackSection.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const feedbackTypes = [
  { id: "general", label: "General Feedback", icon: "💭" },
  { id: "feature", label: "Feature Suggestion", icon: "💡" },
  { id: "bug", label: "Bug Report", icon: "🐛" },
  { id: "ux", label: "User Experience", icon: "✨" },
];

const FeedbackSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      type: "",
      message: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.message ) {
      setSubmitStatus({
        success: false,
        message: "Please fill in all required fields.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Thank you for your feedback!",
        });
        resetForm();
      } else {
        throw new Error(data.message || "Failed to submit feedback");
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-3xl">📝</span>
          </motion.div>
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4 
                     relative flex flex-col items-center gap-2"
          >
            <span>Share Your Thoughts</span>
            <span className="text-orange-500">Help Us Improve</span>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-0.5 bg-orange-500/20 rounded-full w-24"
            />
          </motion.h2>
          <p className="text-neutral-600">
            Your feedback shapes our future updates. Share your thoughts and
            help us serve you better.
          </p>
        </div>

        {/* Feedback Form */}
        <motion.div
          className="bg-white/95 rounded-2xl p-8 shadow-lg border border-neutral-200 backdrop-blur-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {feedbackTypes.map((type) => (
                <motion.button
                  key={type.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, type: type.id })}
                  className={`p-4 rounded-xl border ${
                    formData.type === type.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-neutral-200 hover:border-orange-200"
                  } transition-all duration-200`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl mb-2"
                  >
                    {type.icon}
                  </motion.div>
                  <div className="text-sm font-medium text-neutral-800">
                    {type.label}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 
                           focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                           transition-all duration-200"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email <span className="text-orange-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 
                           focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                           transition-all duration-200"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Your Message <span className="text-orange-500">*</span>
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 
                         focus:border-orange-500 focus:ring-2 focus:ring-orange-200 
                         transition-all duration-200 h-32"
                placeholder="Share your thoughts with us..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-4">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 
                         text-white rounded-full font-medium hover:from-orange-600 hover:to-orange-700 
                         disabled:opacity-50 disabled:cursor-not-allowed 
                         transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Send Feedback</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </motion.button>

              {/* Status Message */}
              <AnimatePresence>
                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`text-center p-3 rounded-lg ${
                      submitStatus.success
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    {submitStatus.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeedbackSection;
