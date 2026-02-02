/**
 * RUSSIAN MASTERY UNLIMITED - Luxury Studio Environment
 * Prize2Pride Ultimate Design System
 * Immersive AI Tutoring Environment
 * 
 * "Augmenting the World Starts at Prize2Pride"
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, Sparkles, Volume2, VolumeX, Settings, 
  Maximize, Minimize, Sun, Moon, Palette
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface StudioEnvironment {
  id: string;
  name: string;
  nameRu: string;
  theme: 'dark' | 'light' | 'gold';
  backgroundGradient: string;
  accentColor: string;
  particleColor: string;
  ambientSound: string;
  lighting: 'warm' | 'cool' | 'golden' | 'dramatic';
}

interface LuxuryStudioProps {
  children: React.ReactNode;
  environment?: StudioEnvironment;
  showControls?: boolean;
  onEnvironmentChange?: (env: StudioEnvironment) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STUDIO_ENVIRONMENTS: StudioEnvironment[] = [
  {
    id: 'imperial-gold',
    name: 'Imperial Gold',
    nameRu: 'Императорское золото',
    theme: 'gold',
    backgroundGradient: 'from-gray-950 via-yellow-950/20 to-gray-950',
    accentColor: 'yellow-500',
    particleColor: 'bg-yellow-400',
    ambientSound: 'classical',
    lighting: 'golden'
  },
  {
    id: 'midnight-diamond',
    name: 'Midnight Diamond',
    nameRu: 'Полуночный бриллиант',
    theme: 'dark',
    backgroundGradient: 'from-gray-950 via-blue-950/20 to-gray-950',
    accentColor: 'blue-400',
    particleColor: 'bg-blue-300',
    ambientSound: 'ambient',
    lighting: 'cool'
  },
  {
    id: 'kremlin-red',
    name: 'Kremlin Red',
    nameRu: 'Кремлёвский красный',
    theme: 'dark',
    backgroundGradient: 'from-gray-950 via-red-950/20 to-gray-950',
    accentColor: 'red-500',
    particleColor: 'bg-red-400',
    ambientSound: 'dramatic',
    lighting: 'dramatic'
  },
  {
    id: 'winter-palace',
    name: 'Winter Palace',
    nameRu: 'Зимний дворец',
    theme: 'light',
    backgroundGradient: 'from-slate-100 via-blue-50 to-slate-100',
    accentColor: 'slate-600',
    particleColor: 'bg-slate-300',
    ambientSound: 'snow',
    lighting: 'cool'
  }
];

// ============================================================================
// COMPONENTS
// ============================================================================

const GoldenParticles: React.FC<{ color?: string; count?: number }> = ({ 
  color = 'bg-yellow-400', 
  count = 30 
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 3
    }));
    setParticles(newParticles);
  }, [count, color]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${color} opacity-60`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

const LuxuryFrame: React.FC<{ accentColor: string }> = ({ accentColor }) => (
  <>
    {/* Corner Decorations */}
    <div className={`absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-${accentColor}/30 rounded-tl-3xl pointer-events-none`} />
    <div className={`absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-${accentColor}/30 rounded-tr-3xl pointer-events-none`} />
    <div className={`absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-${accentColor}/30 rounded-bl-3xl pointer-events-none`} />
    <div className={`absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-${accentColor}/30 rounded-br-3xl pointer-events-none`} />
    
    {/* Inner Frame Lines */}
    <div className={`absolute top-4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-${accentColor}/20 to-transparent pointer-events-none`} />
    <div className={`absolute bottom-4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-${accentColor}/20 to-transparent pointer-events-none`} />
    <div className={`absolute top-4 bottom-4 left-4 w-px bg-gradient-to-b from-transparent via-${accentColor}/20 to-transparent pointer-events-none`} />
    <div className={`absolute top-4 bottom-4 right-4 w-px bg-gradient-to-b from-transparent via-${accentColor}/20 to-transparent pointer-events-none`} />
  </>
);

const StudioControls: React.FC<{
  currentEnv: StudioEnvironment;
  environments: StudioEnvironment[];
  onEnvChange: (env: StudioEnvironment) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}> = ({ 
  currentEnv, 
  environments, 
  onEnvChange, 
  isMuted, 
  onToggleMute,
  isFullscreen,
  onToggleFullscreen
}) => {
  const [showEnvPicker, setShowEnvPicker] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
      {/* Environment Picker */}
      <div className="relative">
        <motion.button
          className="p-2 rounded-xl bg-black/50 backdrop-blur-sm border border-yellow-500/30 text-yellow-400 hover:bg-black/70 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowEnvPicker(!showEnvPicker)}
        >
          <Palette className="w-5 h-5" />
        </motion.button>
        
        <AnimatePresence>
          {showEnvPicker && (
            <motion.div
              className="absolute top-full mt-2 right-0 w-64 p-3 rounded-xl bg-gray-900/95 backdrop-blur-sm border border-yellow-500/30"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-xs text-yellow-400/70 uppercase tracking-wider mb-2">Studio Environment</p>
              {environments.map((env) => (
                <motion.button
                  key={env.id}
                  className={`w-full p-2 rounded-lg text-left mb-1 last:mb-0 transition-colors ${
                    currentEnv.id === env.id
                      ? 'bg-yellow-500/20 border border-yellow-500/50'
                      : 'hover:bg-gray-800'
                  }`}
                  whileHover={{ x: 3 }}
                  onClick={() => {
                    onEnvChange(env);
                    setShowEnvPicker(false);
                  }}
                >
                  <p className="text-sm font-medium text-white">{env.name}</p>
                  <p className="text-xs text-gray-400">{env.nameRu}</p>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sound Toggle */}
      <motion.button
        className="p-2 rounded-xl bg-black/50 backdrop-blur-sm border border-yellow-500/30 text-yellow-400 hover:bg-black/70 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleMute}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </motion.button>

      {/* Fullscreen Toggle */}
      <motion.button
        className="p-2 rounded-xl bg-black/50 backdrop-blur-sm border border-yellow-500/30 text-yellow-400 hover:bg-black/70 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleFullscreen}
      >
        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
      </motion.button>
    </div>
  );
};

const StudioHeader: React.FC<{ environment: StudioEnvironment }> = ({ environment }) => (
  <motion.div
    className="absolute top-4 left-4 z-50"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
  >
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm border border-yellow-500/30">
      <Crown className="w-5 h-5 text-yellow-400" />
      <div>
        <p className="text-sm font-semibold text-yellow-400">Russian Mastery Studio</p>
        <p className="text-xs text-gray-400">{environment.name} • {environment.nameRu}</p>
      </div>
    </div>
  </motion.div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const LuxuryStudio: React.FC<LuxuryStudioProps> = ({
  children,
  environment = STUDIO_ENVIRONMENTS[0],
  showControls = true,
  onEnvironmentChange
}) => {
  const [currentEnv, setCurrentEnv] = useState(environment);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleEnvChange = (env: StudioEnvironment) => {
    setCurrentEnv(env);
    onEnvironmentChange?.(env);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <motion.div
      className={`relative min-h-screen bg-gradient-to-br ${currentEnv.backgroundGradient} overflow-hidden`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Particle Background */}
      <GoldenParticles color={currentEnv.particleColor} count={40} />

      {/* Luxury Frame */}
      <LuxuryFrame accentColor={currentEnv.accentColor} />

      {/* Studio Header */}
      <StudioHeader environment={currentEnv} />

      {/* Controls */}
      {showControls && (
        <StudioControls
          currentEnv={currentEnv}
          environments={STUDIO_ENVIRONMENTS}
          onEnvChange={handleEnvChange}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />
      )}

      {/* Ambient Glow Effects */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-${currentEnv.accentColor}/5 rounded-full blur-3xl pointer-events-none`} />
      <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-${currentEnv.accentColor}/5 rounded-full blur-3xl pointer-events-none`} />

      {/* Content Area */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>

      {/* Bottom Status Bar */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-4 px-6 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-yellow-500/30">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-gray-400">OMEGA PROTOCOL ACTIVE</span>
          </div>
          <div className="w-px h-4 bg-yellow-500/30" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-yellow-400">Prize2Pride Ultimate</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export { STUDIO_ENVIRONMENTS };
export default LuxuryStudio;
