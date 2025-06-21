// components/ReviewsSection.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

const ReviewCard = ({ name, role, comment, image }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex-shrink-0 w-[300px] p-6 mx-4 
                 bg-white/10 backdrop-blur-lg rounded-xl 
                 border border-white/20 hover:bg-white/15 
                 transition-all duration-200 shadow-lg"
  >
    <div className="flex items-start gap-4">
      <img
        src={image}
        alt={name}
        className="w-12 h-12 rounded-full object-cover 
                     border-2 border-orange-300/50"
      />
      <div>
        <h4 className="text-white font-semibold">{name}</h4>
        <p className="text-white/60 text-sm">{role}</p>
      </div>
    </div>
    <div className="mt-4">
      <p className="text-white/80 text-sm leading-relaxed">"{comment}"</p>
    </div>
    <div className="flex gap-1 mt-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.span
          key={star}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ delay: star * 0.1 }}
          className="text-orange-300"
        >
          ⭐
        </motion.span>
      ))}
    </div>
  </motion.div>
);
const reviews = [
  {
    name: "Sarah Johnson",
    role: "Student",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    comment:
      "StreakSpark transformed my study habits. I've maintained a 45-day streak and my grades have never been better!",
  },
  {
    name: "Michael Chen",
    role: "Software Developer",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    comment:
      "The combination of habit tracking and daily planning is perfect. I've boosted my productivity by 40%.",
  },
  {
    name: "Emma Davis",
    role: "Fitness Trainer",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    comment:
      "I recommend StreakSpark to all my clients. It's the best way to maintain workout consistency.",
  },
  {
    name: "James Wilson",
    role: "Entrepreneur",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    comment:
      "Finally found an app that keeps me accountable. The streak system is incredibly motivating!",
  },
  {
    name: "Lisa Thompson",
    role: "Artist",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    comment:
      "The daily journal feature helps me track my creative progress. Love how everything syncs seamlessly.",
  },
  {
    name: "David Kim",
    role: "Medical Student",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    comment:
      "Perfect for building multiple habits at once. The smart reminders keep me on track with my study schedule.",
  },
];

export default function ReviewsSection() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="w-full py-20 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Join Our Community of Achievers
        </h2>
        <p className="text-white/80 text-lg">
          See what others have accomplished with StreakSpark
        </p>
      </motion.div>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* First Row */}
        <motion.div
          className="flex mb-8"
          animate={{
            x: isPaused ? 0 : [-1920, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {[...reviews, ...reviews].map((review, index) => (
            <ReviewCard key={`row1-${index}`} {...review} />
          ))}
        </motion.div>

        {/* Second Row */}
        <motion.div
          className="flex"
          animate={{
            x: isPaused ? 0 : [0, -1920],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {[...reviews.reverse(), ...reviews].map((review, index) => (
            <ReviewCard key={`row2-${index}`} {...review} />
          ))}
        </motion.div>

        {/* Gradient Overlays */}
        <div
          className="absolute inset-y-0 left-0 w-20
                        bg-gradient-to-r from-orange-600 via-orange-600/90 to-transparent z-10"
        />
        <div
          className="absolute inset-y-0 right-0 w-20 
                        bg-gradient-to-l from-orange-600 via-orange-600/90 to-transparent z-10"
        />
      </div>
    </div>
  );
}
