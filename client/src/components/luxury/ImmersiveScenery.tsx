/**
 * Prize2Pride Ultimate - Immersive Scenery Component
 * VR-Ready Transformative Environments
 * "Augmenting the World Starts at Prize2Pride"
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SceneryEnvironment {
  id: string;
  name: string;
  description: string;
  theme: string;
  imageUrl: string;
  videoUrl?: string;
  lighting: string;
  weather: string;
  ambientSounds: string[];
  colorPalette: { primary: string; secondary: string; accent: string; background: string };
  particles: { type: string; density: number; color: string }[];
  isVRReady: boolean;
  is360: boolean;
}

interface ImmersiveSceneryProps {
  scenery: SceneryEnvironment;
  isActive?: boolean;
  onTransition?: (toSceneryId: string) => void;
  availableSceneries?: SceneryEnvironment[];
  showControls?: boolean;
  children?: React.ReactNode;
}

export const ImmersiveScenery: React.FC<ImmersiveSceneryProps> = ({
  scenery,
  isActive = true,
  onTransition,
  availableSceneries = [],
  showControls = true,
  children
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showScenerySelector, setShowScenerySelector] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; opacity: number }[]>([]);

  // Generate particles based on scenery settings
  useEffect(() => {
    if (!isActive) return;

    const generateParticles = () => {
      const newParticles: typeof particles = [];
      scenery.particles.forEach((particleConfig, configIndex) => {
        for (let i = 0; i < particleConfig.density; i++) {
          newParticles.push({
            id: configIndex * 100 + i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1,
            opacity: Math.random() * 0.8 + 0.2
          });
        }
      });
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 5000);
    return () => clearInterval(interval);
  }, [scenery, isActive]);

  const handleTransition = (toSceneryId: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      onTransition?.(toSceneryId);
      setIsTransitioning(false);
      setShowScenerySelector(false);
    }, 1000);
  };

  const getLightingStyle = () => {
    switch (scenery.lighting) {
      case 'golden_hour':
        return 'from-yellow-900/30 via-orange-900/20 to-transparent';
      case 'night':
        return 'from-blue-900/40 via-purple-900/30 to-transparent';
      case 'neon':
        return 'from-pink-900/40 via-cyan-900/30 to-transparent';
      case 'candlelight':
        return 'from-orange-900/40 via-red-900/20 to-transparent';
      case 'dramatic':
        return 'from-gray-900/60 via-black/40 to-transparent';
      default:
        return 'from-gray-900/30 via-transparent to-transparent';
    }
  };

  const getWeatherEffect = () => {
    switch (scenery.weather) {
      case 'snow':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-80"
                initial={{ x: Math.random() * 100 + '%', y: -10 }}
                animate={{ y: '110%', x: `${Math.random() * 100}%` }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: Math.random() * 5
                }}
              />
            ))}
          </div>
        );
      case 'rain':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-4 bg-blue-300/50"
                initial={{ x: Math.random() * 100 + '%', y: -20 }}
                animate={{ y: '110%' }}
                transition={{
                  duration: Math.random() * 0.5 + 0.3,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        );
      case 'fireworks':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: `${20 + i * 15}%`, top: '30%' }}
                animate={{
                  scale: [0, 1, 1.5, 0],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: 'easeOut'
                }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 blur-sm" />
              </motion.div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        {scenery.videoUrl ? (
          <video
            src={scenery.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${scenery.imageUrl})`,
              backgroundColor: scenery.colorPalette.background
            }}
          />
        )}
      </div>

      {/* Lighting Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getLightingStyle()}`} />

      {/* Weather Effects */}
      {getWeatherEffect()}

      {/* Particle Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: scenery.particles[0]?.color || '#FFD700',
              opacity: particle.opacity
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Transition Effect */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="absolute inset-0 bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="flex items-center justify-between">
            {/* Scenery Info */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm border border-yellow-500/30">
              <span className="text-yellow-400 font-semibold">{scenery.name}</span>
              {scenery.isVRReady && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/50">
                  VR Ready
                </span>
              )}
              {scenery.is360 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/30 text-cyan-300 border border-cyan-500/50">
                  360°
                </span>
              )}
            </div>

            {/* Scenery Selector Button */}
            <motion.button
              className="px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 215, 0, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowScenerySelector(!showScenerySelector)}
            >
              🌍 Change Scenery
            </motion.button>
          </div>

          {/* Scenery Selector Dropdown */}
          <AnimatePresence>
            {showScenerySelector && availableSceneries.length > 0 && (
              <motion.div
                className="absolute bottom-full mb-2 right-0 w-80 max-h-64 overflow-y-auto rounded-xl bg-gray-900/95 backdrop-blur-sm border border-yellow-500/30 p-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {availableSceneries.map((s) => (
                  <motion.button
                    key={s.id}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg text-left ${
                      s.id === scenery.id
                        ? 'bg-yellow-500/20 border border-yellow-500/50'
                        : 'hover:bg-gray-800'
                    }`}
                    whileHover={{ x: 5 }}
                    onClick={() => handleTransition(s.id)}
                    disabled={s.id === scenery.id}
                  >
                    <div
                      className="w-12 h-12 rounded-lg bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${s.imageUrl})`,
                        backgroundColor: s.colorPalette.background
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.theme} • {s.lighting}</p>
                    </div>
                    {s.isVRReady && <span className="text-purple-400">🥽</span>}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Ambient Sound Indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-gray-700">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🔊
          </motion.span>
          <span className="text-xs text-gray-400">{scenery.ambientSounds[0]}</span>
        </div>
      </div>

      {/* VR Mode Button */}
      {scenery.isVRReady && (
        <motion.button
          className="absolute top-4 left-4 z-20 px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/50"
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
          whileTap={{ scale: 0.95 }}
        >
          🥽 Enter VR Mode
        </motion.button>
      )}

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-2xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-yellow-500/30 rounded-br-2xl pointer-events-none" />
    </motion.div>
  );
};

export default ImmersiveScenery;
