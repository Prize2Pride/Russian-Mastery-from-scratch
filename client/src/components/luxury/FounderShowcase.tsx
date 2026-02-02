/**
 * Prize2Pride Ultimate - Founder Showcase Component
 * "Augmenting the World Starts at Prize2Pride"
 * Raoued Fadhel - Gold & Diamond Display
 */

import React from 'react';
import { motion } from 'framer-motion';

interface FounderShowcaseProps {
  variant?: 'full' | 'compact' | 'badge';
  showMotto?: boolean;
  animated?: boolean;
}

export const FounderShowcase: React.FC<FounderShowcaseProps> = ({
  variant = 'full',
  showMotto = true,
  animated = true
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const shimmerVariants = {
    animate: {
      backgroundPosition: ["200% 0%", "-200% 0%"],
      transition: { duration: 3, repeat: Infinity, ease: "linear" }
    }
  };

  const GoldDiamondText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <motion.span
      className={`bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent font-bold ${className}`}
      style={{
        backgroundSize: "200% 100%",
        textShadow: "0 0 30px rgba(255, 215, 0, 0.5)"
      }}
      variants={animated ? shimmerVariants : undefined}
      animate={animated ? "animate" : undefined}
    >
      {children}
    </motion.span>
  );

  const DiamondIcon = () => (
    <svg className="w-6 h-6 inline-block mx-1" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L2 9L12 22L22 9L12 2Z"
        fill="url(#diamond-gradient)"
        stroke="url(#diamond-stroke)"
        strokeWidth="1"
      />
      <defs>
        <linearGradient id="diamond-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E5E4E2" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E5E4E2" />
        </linearGradient>
        <linearGradient id="diamond-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </linearGradient>
      </defs>
    </svg>
  );

  if (variant === 'badge') {
    return (
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-900/30 to-yellow-700/30 border border-yellow-500/50"
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
        variants={containerVariants}
      >
        <DiamondIcon />
        <GoldDiamondText className="text-sm">RAOUED FADHEL</GoldDiamondText>
        <DiamondIcon />
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        className="text-center p-4"
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
        variants={containerVariants}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <DiamondIcon />
          <GoldDiamondText className="text-2xl tracking-wider">RAOUED FADHEL</GoldDiamondText>
          <DiamondIcon />
        </div>
        <p className="text-yellow-500/80 text-sm">Founder & Visionary</p>
      </motion.div>
    );
  }

  // Full variant
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 border border-yellow-500/30"
      initial={animated ? "hidden" : undefined}
      animate={animated ? "visible" : undefined}
      variants={containerVariants}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute bottom-12 left-12 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse" />
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-white/50 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Crown Icon */}
        <motion.div
          className="mb-4"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-4xl">👑</span>
        </motion.div>

        {/* Name with Diamonds */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <DiamondIcon />
          <DiamondIcon />
          <GoldDiamondText className="text-4xl md:text-5xl tracking-widest">
            RAOUED FADHEL
          </GoldDiamondText>
          <DiamondIcon />
          <DiamondIcon />
        </div>

        {/* Title */}
        <motion.p
          className="text-xl text-yellow-400/90 font-light tracking-wide mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Founder & Visionary
        </motion.p>

        {/* Platform Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 border border-yellow-500/40 mb-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-yellow-400 font-semibold">Prize2Pride Ultimate</span>
        </motion.div>

        {/* Sub-platforms */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {['Fiction2Real', 'Purchase2Win', 'MLM-Prize2Pride'].map((platform, index) => (
            <motion.span
              key={platform}
              className="px-4 py-1.5 rounded-full bg-gray-800/50 border border-yellow-500/20 text-yellow-300/80 text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              {platform}
            </motion.span>
          ))}
        </div>

        {/* Motto */}
        {showMotto && (
          <motion.div
            className="mt-8 pt-6 border-t border-yellow-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-lg text-gray-300 italic">
              "Augmenting the World Starts at Prize2Pride"
            </p>
            <p className="text-sm text-yellow-500/60 mt-2">
              Transforming Education into an Unforgettable Experience
            </p>
          </motion.div>
        )}
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-yellow-500/30 rounded-br-2xl" />
    </motion.div>
  );
};

export default FounderShowcase;
