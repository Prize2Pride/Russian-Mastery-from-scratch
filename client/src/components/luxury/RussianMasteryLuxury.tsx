/**
 * RUSSIAN MASTERY UNLIMITED - Luxury Landing Component
 * Prize2Pride Ultimate Design System
 * Gold & Diamond Theme with Immersive Animations
 * 
 * "Augmenting the World Starts at Prize2Pride"
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Flame, MessageCircle, Briefcase, FileText, 
  Sparkles, Music, BookOpen, Users, Trophy, Star,
  Zap, Globe, Shield, ChevronRight, Play, Volume2,
  Diamond, Award
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface ToneLevel {
  level: number;
  name: string;
  nameRu: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

interface PlatformStat {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const TONE_LEVELS: ToneLevel[] = [
  { 
    level: 1, 
    name: "Street Russian", 
    nameRu: "Уличный русский", 
    icon: Flame, 
    color: "from-red-600 to-orange-500", 
    description: "Raw, unfiltered street language - vulgar, slang, criminal jargon" 
  },
  { 
    level: 2, 
    name: "Casual Russian", 
    nameRu: "Разговорный русский", 
    icon: MessageCircle, 
    color: "from-orange-500 to-yellow-500", 
    description: "Everyday conversational language among friends and family" 
  },
  { 
    level: 3, 
    name: "Professional Russian", 
    nameRu: "Деловой русский", 
    icon: Briefcase, 
    color: "from-blue-500 to-cyan-500", 
    description: "Business communication and corporate environments" 
  },
  { 
    level: 4, 
    name: "Formal Russian", 
    nameRu: "Официальный русский", 
    icon: FileText, 
    color: "from-purple-500 to-indigo-500", 
    description: "Official and legal language for government and ceremonies" 
  },
  { 
    level: 5, 
    name: "Diplomatic Russian", 
    nameRu: "Дипломатический русский", 
    icon: Crown, 
    color: "from-yellow-400 to-amber-500", 
    description: "Elite international relations and state affairs" 
  }
];

export const PLATFORM_STATS: PlatformStat[] = [
  { label: "Total Lessons", value: "2,500+", icon: BookOpen },
  { label: "Vocabulary Words", value: "195,000+", icon: Globe },
  { label: "Transformations", value: "1,500,000+", icon: Zap },
  { label: "Registers", value: "5", icon: Crown },
  { label: "Training Data", value: "50GB+", icon: Shield }
];

// ============================================================================
// COMPONENTS
// ============================================================================

export const DiamondIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={`inline-block ${className}`} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L2 9L12 22L22 9L12 2Z"
      fill="url(#diamond-gradient-luxury)"
      stroke="url(#diamond-stroke-luxury)"
      strokeWidth="1"
    />
    <defs>
      <linearGradient id="diamond-gradient-luxury" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E5E4E2" />
        <stop offset="50%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E5E4E2" />
      </linearGradient>
      <linearGradient id="diamond-stroke-luxury" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FFA500" />
      </linearGradient>
    </defs>
  </svg>
);

export const GoldShimmerText: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  animated?: boolean;
}> = ({ children, className = "", animated = true }) => (
  <motion.span
    className={`bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent font-bold ${className}`}
    style={{ backgroundSize: "200% 100%" }}
    animate={animated ? { backgroundPosition: ["200% 0%", "-200% 0%"] } : undefined}
    transition={animated ? { duration: 3, repeat: Infinity, ease: "linear" } : undefined}
  >
    {children}
  </motion.span>
);

export const ParticleField: React.FC<{ count?: number; color?: string }> = ({ 
  count = 50, 
  color = "bg-yellow-400" 
}) => {
  const [particles, setParticles] = useState<Array<{ 
    id: number; 
    x: number; 
    y: number; 
    size: number; 
    delay: number 
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${color}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export const GoldBorderDecorations: React.FC = () => (
  <>
    <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-3xl pointer-events-none" />
    <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-3xl pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-3xl pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-yellow-500/30 rounded-br-3xl pointer-events-none" />
  </>
);

export const LuxuryBadge: React.FC<{ text: string }> = ({ text }) => (
  <motion.div
    className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-yellow-900/30 to-yellow-700/30 border border-yellow-500/50"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 0.3, type: "spring" }}
  >
    <DiamondIcon className="w-4 h-4" />
    <span className="text-yellow-400 font-semibold tracking-wider text-sm">{text}</span>
    <DiamondIcon className="w-4 h-4" />
  </motion.div>
);

export const ToneLevelCard: React.FC<{
  tone: ToneLevel;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}> = ({ tone, isSelected, onSelect, index }) => {
  const Icon = tone.icon;
  
  return (
    <motion.div
      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'bg-gradient-to-br ' + tone.color + ' scale-105 shadow-2xl shadow-yellow-500/20'
          : 'bg-gray-900/50 border border-gray-800 hover:border-yellow-500/50'
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          isSelected ? 'bg-white/20' : 'bg-gradient-to-br ' + tone.color
        }`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="text-3xl font-bold text-white mb-2">{tone.level}</div>
        <div className="text-sm font-semibold text-white mb-1">{tone.name}</div>
        <div className="text-xs text-white/70">{tone.nameRu}</div>
        {isSelected && (
          <motion.p
            className="mt-3 text-xs text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {tone.description}
          </motion.p>
        )}
      </div>
      {isSelected && (
        <motion.div
          className="absolute -top-2 -right-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
        </motion.div>
      )}
    </motion.div>
  );
};

export const StatCard: React.FC<{ stat: PlatformStat; index: number }> = ({ stat, index }) => {
  const Icon = stat.icon;
  
  return (
    <motion.div
      className="text-center p-4 rounded-xl bg-gray-900/50 border border-yellow-500/20 hover:border-yellow-500/40 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 + index * 0.1 }}
    >
      <Icon className="w-6 h-6 text-yellow-500/60 mx-auto mb-2" />
      <div className="text-2xl md:text-3xl font-bold text-yellow-400">{stat.value}</div>
      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</div>
    </motion.div>
  );
};

export const FeatureCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  index: number;
}> = ({ icon: Icon, title, description, index }) => (
  <motion.div
    className="p-6 rounded-2xl bg-gray-900/50 border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(255, 215, 0, 0.1)' }}
  >
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center mb-4">
      <Icon className="w-7 h-7 text-black" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </motion.div>
);

export const NavigationCard: React.FC<{
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  borderColor: string;
  textColor: string;
}> = ({ href, icon: Icon, title, description, gradient, borderColor, textColor }) => (
  <a href={href}>
    <motion.div
      className={`p-8 rounded-2xl ${gradient} border ${borderColor} cursor-pointer`}
      whileHover={{ scale: 1.02 }}
    >
      <Icon className={`w-12 h-12 ${textColor} mb-4`} />
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <div className={`flex items-center ${textColor}`}>
        <span>Explore</span>
        <ChevronRight className="w-5 h-5 ml-2" />
      </div>
    </motion.div>
  </a>
);

// ============================================================================
// MAIN EXPORT
// ============================================================================

export default {
  DiamondIcon,
  GoldShimmerText,
  ParticleField,
  GoldBorderDecorations,
  LuxuryBadge,
  ToneLevelCard,
  StatCard,
  FeatureCard,
  NavigationCard,
  TONE_LEVELS,
  PLATFORM_STATS
};
