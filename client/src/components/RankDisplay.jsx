// RankDisplay.jsx
import React from "react";
import { motion } from "framer-motion";

const RANK_TIERS = [
  { name: "Novice", threshold: 0, icon: "🔥", color: "text-gray-500" },
  { name: "Bronze", threshold: 7, icon: "🥉", color: "text-amber-600" },
  { name: "Silver", threshold: 30, icon: "🥈", color: "text-gray-400" },
  { name: "Gold", threshold: 100, icon: "🥇", color: "text-yellow-500" },
  { name: "Platinum", threshold: 180, icon: "💫", color: "text-cyan-500" },
  { name: "Diamond", threshold: 365, icon: "💎", color: "text-blue-500" },
  { name: "Master", threshold: 500, icon: "👑", color: "text-purple-500" },
];

export const getCurrentRank = (streak) => {
  return RANK_TIERS.reduce((prev, curr) => {
    return streak >= curr.threshold ? curr : prev;
  });
};

export const CurrentRank = ({ streak }) => {
  const currentRank = getCurrentRank(streak);
  const nextRank = RANK_TIERS[RANK_TIERS.indexOf(currentRank) + 1];
  const progress = nextRank
    ? ((streak - currentRank.threshold) /
        (nextRank.threshold - currentRank.threshold)) *
      100
    : 100;

  return (
    <motion.div
      className="flex flex-col items-center flex-1 border-l border-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <span className="text-gray-500 mb-1 text-[15px]">Current Rank</span>
      <div className="flex items-center gap-2">
        <motion.span
          className="text-2xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          {currentRank.icon}
        </motion.span>
        <span className={`${currentRank.color} text-xl font-bold`}>
          {currentRank.name}
        </span>
      </div>
      {nextRank && (
        <div className="w-full mt-2 px-2">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const RankLadder = ({ streak }) => {
  const currentRank = getCurrentRank(streak);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">Rank Ladder</h3>
      <div className="space-y-3">
        {RANK_TIERS.map((tier) => (
          <motion.div
            key={tier.name}
            className={`flex items-center p-3 rounded-lg ${
              tier.name === currentRank.name
                ? "bg-orange-50 border-2 border-orange-200"
                : "bg-gray-50"
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-2xl mr-3">{tier.icon}</span>
            <div className="flex-1">
              <div className={`font-semibold ${tier.color}`}>{tier.name}</div>
              <div className="text-sm text-gray-500">
                {tier.threshold}+ days streak
              </div>
            </div>
            {tier.name === currentRank.name && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full"
              >
                Current
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RankLadder;
