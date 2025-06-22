import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNavbar from "../components/LandingNavbar";
import ReviewsSection from "../components/ReviewsSection";
import Footer from "../components/Footer";
import ProceduralBackground from "../components/ProceduralBackground";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
    className="bg-white rounded-xl p-6 border border-neutral-200
               hover:border-primary-200 transition-all duration-200 
               shadow-sm hover:shadow-md flex flex-col items-center 
               text-center group"
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
      transition={{ duration: 0.3 }}
      className="mb-4 p-3 rounded-full bg-primary-50 
                 group-hover:bg-primary-100 transition-colors"
    >
      <span className="text-4xl">{icon}</span>
    </motion.div>
    <h3 className="text-xl font-semibold mb-3 text-neutral-800">{title}</h3>
    <p className="text-neutral-600 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const QuoteSection = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.8 }}
    className="max-w-4xl mx-auto text-center my-20 px-4 relative"
  >
    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-6xl opacity-30">
      "
    </div>
    <blockquote className="text-white/90 text-xl italic leading-relaxed">
      "Success is not final, failure is not fatal: it is the courage to continue
      that counts."
    </blockquote>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="text-white/70 mt-4 font-medium"
    >
      - Winston Churchill
    </motion.p>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/10 to-neutral-100 relative cursor-grab ">
      <ProceduralBackground
        ballCount={20} // Number of balls
        backgroundColor="white"
      />
      {/* Hero Section */}
      <LandingNavbar />
      <div className="container-fluid mx-auto px-4 pt-20">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="my-12"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="relative text-6xl mb-6 mx-auto w-fit"
            >
              {/* Animated flame effect */}
              <motion.div
                className="absolute -inset-4 bg-orange-300 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              🔥
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold mb-6 text-neutral-800 leading-tight text-center"
            >
              Stop Breaking Promises to Yourself.
              <motion.span
                className="block mt-2 bg-gradient-to-r from-primary-400 to-primary-600 
                       bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0%", "100%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                Start Building Lasting Habits
              </motion.span>
            </motion.h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg md:text-xl text-neutral-600 mb-8 leading-relaxed">
                Struggling to maintain habits? StreakSpark turns motivation into
                action, offering smart tracking, daily planning, and
                inspirational tools that transform your goals from dreams to
                daily achievements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mx-15 md:mx-0">
                {[
                  {
                    icon: "📈", // Instead of 📊 - Better represents progress tracking
                    title: "Track Progress",
                    description: "See your growth with visual streaks",
                  },
                  {
                    icon: "🔔", // Instead of ⏰ - More modern representation for reminders
                    title: "Stay Consistent",
                    description: "Smart reminders keep you on track",
                  },
                  {
                    icon: "⭐", // Instead of 🎯 - Represents achievement better
                    title: "Achieve Goals",
                    description: "Turn intentions into achievements",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                    className="bg-white/95 p-5 rounded-xl border border-neutral-200
                         transition-all duration-200 backdrop-blur-sm"
                  >
                    <motion.div
                      className="text-3xl mb-3 text-primary-500"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-neutral-800 font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Trust indicators */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center gap-4 text-neutral-600 text-sm"
              >
                {["No Credit Card", "Free Forever Plan", "Quick Setup"].map(
                  (item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <motion.span
                        className="text-primary-500"
                        whileHover={{ scale: 1.2 }}
                      >
                        ✓
                      </motion.span>
                      {item}
                      {index < 2 && (
                        <div className="w-1 h-1 bg-neutral-300 rounded-full ml-2" />
                      )}
                    </div>
                  )
                )}
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-20"
          >
            <Link
              to="/login"
              className="bg-gradient-to-r from-primary-500 to-primary-600 
               text-white px-8 py-4 rounded-full
               font-semibold text-lg shadow-md
               hover:from-primary-600 hover:to-primary-700 
               transform hover:scale-105
               transition-all duration-200 inline-flex items-center gap-2
               relative overflow-hidden group"
            >
              <span className="relative z-10">Start Your Journey</span>
              <svg
                className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 
                 transition-transform duration-200"
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
              <div
                className="absolute inset-0 bg-white/20 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-200"
              ></div>
            </Link>
          </motion.div>
          {/* Features Grid */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-2xl md:text-3xl font-bold text-neutral-800 mb-10 
             relative flex flex-col items-center gap-2"
          >
            <span>Everything You Need to</span>
            <span className="text-primary-500">Build Better Habits</span>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-0.5 bg-primary-500/20 rounded-full w-24"
            />
          </motion.h2>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4"
          >
            <FeatureCard
              icon="📊"
              title="Habit Tracking & Analytics"
              description="Build lasting habits with intelligent tracking and analytics. Monitor streaks, analyze patterns, and visualize your progress journey."
            />

            <FeatureCard
              icon="📅"
              title="Smart Daily Planner"
              description="Take control of your day with dynamic scheduling, task prioritization, and time blocking. Perfect for balancing habits and daily tasks."
            />

            <FeatureCard
              icon="✍️"
              title="Digital Journal"
              description="Reflect and grow with our beautiful lined diary. Add timestamps, format text, and organize your thoughts in one dedicated space."
            />

            <FeatureCard
              icon="⏱️"
              title="Focus & Reminders"
              description="Stay on track with Pomodoro timer and smart notifications. Maintain focus during work sessions and never miss important habits."
            />

            <FeatureCard
              icon="🏆"
              title="Achievements & Community"
              description="Celebrate milestones with badges and join a community of achievers. Share progress, participate in challenges, and stay motivated together."
            />

            <FeatureCard
              icon="🔄"
              title="Seamless Experience"
              description="Access your data anywhere with instant sync across devices. Enjoy a consistent experience whether you're at home or on the go."
            />
          </motion.div>
          {/* Replace the Quote and Stats sections with a single, more impactful section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="max-w-4xl mx-auto mt-20 px-4"
          >
            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {/* Active Users */}
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      transition: { duration: 2, repeat: Infinity },
                    }}
                    className="text-4xl mb-3 bg-primary-50 w-16 h-16 rounded-full 
                     flex items-center justify-center"
                  >
                    🔥
                  </motion.div>
                  <h3 className="text-3xl font-bold text-neutral-800 mb-2">
                    <span
                      className="bg-gradient-to-r from-primary-500 to-primary-600 
                         bg-clip-text text-transparent"
                    >
                      10K+
                    </span>
                  </h3>
                  <p className="text-neutral-600">Active Users</p>
                </div>

                {/* Quote Section */}
                <div
                  className="flex flex-col items-center border-l border-r 
                      border-neutral-200 px-6"
                >
                  <blockquote
                    className="text-neutral-700 text-lg italic mb-3 
                             font-medium"
                  >
                    "Small daily improvements are the key to staggering
                    long-term results"
                  </blockquote>
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                      transition: { duration: 2, repeat: Infinity },
                    }}
                    className="text-2xl bg-primary-50 w-10 h-10 rounded-full 
                     flex items-center justify-center"
                  >
                    ⭐
                  </motion.div>
                </div>

                {/* Habits Tracked */}
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      transition: { duration: 2, repeat: Infinity },
                    }}
                    className="text-4xl mb-3 bg-primary-50 w-16 h-16 rounded-full 
                     flex items-center justify-center"
                  >
                    📈
                  </motion.div>
                  <h3 className="text-3xl font-bold text-neutral-800 mb-2">
                    <span
                      className="bg-gradient-to-r from-primary-500 to-primary-600 
                         bg-clip-text text-transparent"
                    >
                      1M+
                    </span>
                  </h3>
                  <p className="text-neutral-600">Habits Tracked</p>
                </div>
              </div>
            </div>
          </motion.div>
          <ReviewsSection />
          {/* Footer */}
          <Footer />
        </div>
      </div>
      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-orange-400/40 to-transparent rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [180, 270, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-orange-600/60 to-transparent rounded-full"
        />
      </div>
    </div>
  );
}
