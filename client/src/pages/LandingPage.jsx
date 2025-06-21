import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNavbar from "../components/LandingNavbar";

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
    className="bg-white/15 backdrop-blur-lg rounded-xl p-6 
               border border-white/20 hover:bg-white/20 
               transition-all duration-200 shadow-lg hover:shadow-xl
               flex flex-col items-center text-center group"
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
      transition={{ duration: 0.3 }}
      className="mb-4 p-3 rounded-full bg-white/10 
                 group-hover:bg-white/20 transition-colors"
    >
      <span className="text-4xl transform transition-transform">{icon}</span>
    </motion.div>

    <h3
      className="text-xl font-semibold mb-3 text-white 
                   group-hover:text-white/90 transition-colors"
    >
      {title}
    </h3>

    <p
      className="text-white/80 text-sm leading-relaxed 
                  group-hover:text-white/90 transition-colors"
    >
      {description}
    </p>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 overflow-hidden">
      {/* Hero Section */}
      <LandingNavbar />
      <div className="container mx-auto px-4 pt-20">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
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
              className="text-6xl mb-6"
            >
              🔥
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Stop Breaking Promises to Yourself.
              <span className="block mt-2 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Start Building Lasting Habits
              </span>
            </h1>

            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Tired of starting habits but never sticking to them? StreakSpark
                combines powerful habit tracking, daily planning, and
                motivational features to help you stay consistent and achieve
                your goals, one day at a time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="text-white font-semibold mb-1">
                    Track Progress
                  </h3>
                  <p className="text-white/80 text-sm">
                    See your growth with visual streaks
                  </p>
                </div>

                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl mb-2">⏰</div>
                  <h3 className="text-white font-semibold mb-1">
                    Stay Consistent
                  </h3>
                  <p className="text-white/80 text-sm">
                    Smart reminders keep you on track
                  </p>
                </div>

                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="text-white font-semibold mb-1">
                    Achieve Goals
                  </h3>
                  <p className="text-white/80 text-sm">
                    Turn intentions into achievements
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-orange-300">✓</span>
                  No Credit Card
                </div>
                <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <span className="text-orange-300">✓</span>
                  Free Forever Plan
                </div>
                <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <span className="text-orange-300">✓</span>
                  Quick Setup
                </div>
              </div>
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
              className="bg-white text-orange-600 px-8 py-4 rounded-full
                         font-semibold text-lg shadow-lg
                         hover:bg-orange-50 transform hover:scale-105
                         transition-all duration-200 inline-flex items-center gap-2"
            >
              Start Your Journey
              <svg
                className="w-5 h-5"
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
            </Link>
          </motion.div>
          {/* Features Grid */}
          {/* Features Grid */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">
            Everything You Need to Build Better Habits
          </h2>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4"
          >
            <FeatureCard
              icon="🎯"
              title="Habit Tracking & Analytics"
              description="Build lasting habits with intelligent tracking and analytics. Monitor streaks, analyze patterns, and visualize your progress journey."
            />

            <FeatureCard
              icon="📅"
              title="Smart Daily Planner"
              description="Take control of your day with dynamic scheduling, task prioritization, and time blocking. Perfect for balancing habits and daily tasks."
            />

            <FeatureCard
              icon="📔"
              title="Digital Journal"
              description="Reflect and grow with our beautiful lined diary. Add timestamps, format text, and organize your thoughts in one dedicated space."
            />

            <FeatureCard
              icon="⚡"
              title="Focus & Reminders"
              description="Stay on track with Pomodoro timer and smart notifications. Maintain focus during work sessions and never miss important habits."
            />

            <FeatureCard
              icon="🌟"
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
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      transition: { duration: 2, repeat: Infinity },
                    }}
                    className="text-4xl mb-3"
                  >
                    🔥
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-2">10K+</h3>
                  <p className="text-white/80">Active Users</p>
                </div>

                <div className="flex flex-col items-center border-l border-r border-white/10">
                  <blockquote className="text-white/90 text-lg italic mb-3">
                    "Small daily improvements are the key to staggering
                    long-term results"
                  </blockquote>
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                      transition: { duration: 2, repeat: Infinity },
                    }}
                    className="text-2xl"
                  >
                    ⭐
                  </motion.div>
                </div>

                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      transition: { duration: 2, repeat: Infinity },
                    }}
                    className="text-4xl mb-3"
                  >
                    📈
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-2">1M+</h3>
                  <p className="text-white/80">Habits Tracked</p>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-20 pb-10 w-full"
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/20">
                <div>
                  <h3 className="text-white font-bold text-lg mb-4">
                    StreakSpark
                  </h3>
                  <p className="text-white/70 text-sm">
                    Building better habits, one streak at a time.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Product</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li>
                      <a href="#" className="hover:text-white">
                        Features
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Company</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li>
                      <a href="#" className="hover:text-white">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Careers
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-4">Connect</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li>
                      <a href="#" className="hover:text-white">
                        Twitter
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Instagram
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        LinkedIn
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
                <div className="mb-4 md:mb-0">
                  © 2025 StreakSpark. All rights reserved.
                </div>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                  <a href="#" className="hover:text-white">
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </motion.footer>
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
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-orange-400/20 to-transparent rounded-full"
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
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-orange-600/20 to-transparent rounded-full"
        />
      </div>
    </div>
  );
}
