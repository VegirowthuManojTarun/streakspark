import { motion } from "framer-motion";

const HeroSection = () => {
  // Animation variants for staggered children
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative px-4 py-16 overflow-hidden bg-gradient-to-b from-white to-orange-50"
    >
      {/* Decorative background elements */}
      <motion.div
        className="absolute top-0 right-0 -z-10 opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
      </motion.div>

      {/* Main content */}
      <motion.div variants={itemVariants} className="mb-12">
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

        {/* Feature cards with hover effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: "📊",
              title: "Track Progress",
              description: "See your growth with visual streaks",
            },
            {
              icon: "⏰",
              title: "Stay Consistent",
              description: "Smart reminders keep you on track",
            },
            {
              icon: "🎯",
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
              className="bg-white/95 p-6 rounded-xl border border-neutral-200
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
              <p className="text-neutral-600 text-sm">{feature.description}</p>
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
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
