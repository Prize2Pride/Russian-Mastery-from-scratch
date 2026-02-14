import React from 'react';
import { motion } from 'framer-motion';

interface FounderShowcaseProps {
  variant?: 'full' | 'compact' | 'badge';
  showMotto?: boolean;
  animated?: boolean;
}

const DiamondIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-500">
    <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 6L6 12L12 18L18 12L12 6Z" fill="currentColor"/>
  </svg>
);

const GoldDiamondText = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={`bg-gradient-to-r from-yellow-600 via-yellow-200 to-yellow-600 bg-clip-text text-transparent font-serif font-bold ${className}`}>
    {children}
  </span>
);

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
      transition: { duration: 0.8, staggerChildren: 0.2 }
    }
  };

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
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-gray-900 to-black p-10 border border-yellow-500/40 shadow-[0_0_50px_rgba(234,179,8,0.1)]"
      initial={animated ? "hidden" : undefined}
      animate={animated ? "visible" : undefined}
      variants={containerVariants}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-transparent to-transparent" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
        {/* Founder Image Section */}
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-64 h-80 rounded-2xl overflow-hidden border-2 border-yellow-500/50">
            <img 
              src="/images/founder.jpg" 
              alt="Raoued Fadhel" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <GoldDiamondText className="text-lg">THE VISIONARY</GoldDiamondText>
            </div>
          </div>
          
          {/* Hostess Avatars - Floating */}
          <motion.div 
            className="absolute -right-8 -top-8 w-24 h-24 rounded-full border-2 border-yellow-500/50 overflow-hidden shadow-xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src="/images/hostess1.png" alt="Hostess" className="w-full h-full object-cover" />
          </motion.div>
        </motion.div>

        {/* Content Section */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            className="mb-4 inline-block"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-5xl">👑</span>
          </motion.div>

          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <DiamondIcon />
            <GoldDiamondText className="text-4xl md:text-6xl tracking-tighter">
              RAOUED FADHEL
            </GoldDiamondText>
            <DiamondIcon />
          </div>

          <motion.p
            className="text-2xl text-yellow-400/90 font-serif italic tracking-wide mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Founder & Architect of the Singularity
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-white/5 border border-yellow-500/20 backdrop-blur-sm">
              <h4 className="text-yellow-500 font-bold mb-1">Prize2Pride Ultimate</h4>
              <p className="text-gray-400 text-sm">The world's most advanced learning ecosystem.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-yellow-500/20 backdrop-blur-sm">
              <h4 className="text-yellow-500 font-bold mb-1">Manus 2030 Fusion</h4>
              <p className="text-gray-400 text-sm">Powered by 1 Billion Token Intelligence.</p>
            </div>
          </div>

          {showMotto && (
            <motion.div
              className="pt-6 border-t border-yellow-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-xl text-gray-300 italic font-serif">
                "Augmenting the World Starts at Prize2Pride"
              </p>
              <p className="text-sm text-yellow-500/60 mt-2 tracking-[0.2em] uppercase">
                Transforming Education into an Unforgettable Experience
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-3xl" />
      <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-3xl" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-yellow-500/30 rounded-br-3xl" />
    </motion.div>
  );
};

export default FounderShowcase;
