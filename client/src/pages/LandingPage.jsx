import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const Navbar = () => (
  <nav className="absolute top-0 left-0 right-0 z-10">
    <div className="container mx-auto px-4 py-6 flex justify-between items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center space-x-2"
      >
        <span className="text-2xl">🔥</span>
        <span className="text-white font-bold text-xl">StreakSpark</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link
          to="/login"
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 
                     border border-white/20 rounded-full transition-all duration-200
                     text-white font-medium group"
        >
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
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          <span className="group-hover:translate-x-1 transition-transform duration-200">
            Sign In
          </span>
        </Link>
      </motion.div>
    </div>
  </nav>
);

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ duration: 0.2 }}
    className="bg-white/15 backdrop-blur-lg rounded-xl p-6 flex flex-col items-center text-center
               border border-white/20 hover:bg-white/20 transition-all duration-200
               shadow-lg hover:shadow-xl"
  >
    <motion.span
      whileHover={{ scale: 1.1 }}
      className="text-4xl mb-4 transform transition-transform"
    >
      {icon}
    </motion.span>
    <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
    <p className="text-white/90 text-sm leading-relaxed">{description}</p>
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
      <Navbar />
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

            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Transform Your Life with Daily Habits
            </h1>

            <div className="max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
                Are you struggling to build consistent habits? Want to track
                your progress and stay motivated? StreakSpark is your personal
                habit companion that helps you build lasting habits through
                streak tracking, timely reminders, and social accountability.
              </p>
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
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">
            Everything You Need to Build Better Habits
          </h2>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            <FeatureCard
              icon="🎯"
              title="Smart Habit Tracking"
              description="Set daily, weekly, or custom habits. Track your progress with beautiful visualizations and stay motivated with streak counters."
            />
            <FeatureCard
              icon="⏰"
              title="Smart Reminders"
              description="Never miss a habit with customizable notifications. Get reminders at your preferred time via email or push notifications."
            />
            <FeatureCard
              icon="📊"
              title="Progress Analytics"
              description="View detailed insights about your habits. Track completion rates, longest streaks, and identify patterns in your behavior."
            />
            <FeatureCard
              icon="🤝"
              title="Social Accountability"
              description="Share your progress with friends or on social media. Join habit groups and motivate each other to maintain streaks."
            />
            <FeatureCard
              icon="🏆"
              title="Achievements & Rewards"
              description="Earn badges and rewards for maintaining streaks. Celebrate milestones and stay motivated with visual progress markers."
            />
            <FeatureCard
              icon="📱"
              title="Cross-Platform Sync"
              description="Access your habits anywhere. Seamlessly sync across devices and never lose track of your progress."
            />
          </motion.div>

          {/* Quote Section */}
          <QuoteSection />

          {/* Stats Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className=" grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            {[
              { number: "10K+", label: "Active Users", icon: "👥" },
              { number: "1M+", label: "Habits Tracked", icon: "📈" },
              { number: "5M+", label: "Streaks Maintained", icon: "🔥" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-lg border border-white/20"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-2xl mb-2 block"
                >
                  {stat.icon}
                </motion.span>
                <h3 className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </h3>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            ))}
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

// import React from "react";
// import { Link } from "react-router-dom";

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary to-secondary text-white">
//       <h1 className="text-5xl font-bold mb-4">Welcome to StreakSpark</h1>
//       <p className="mb-8 text-lg max-w-xl text-center">
//         Build habits, stay motivated, and watch your streaks grow every day!
//       </p>
//       <Link to="/login" className="btn-primary">
//         Get Started
//       </Link>
//     </div>
//   );
// }
