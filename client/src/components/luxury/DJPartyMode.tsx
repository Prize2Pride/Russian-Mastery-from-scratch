/**
 * Prize2Pride Ultimate - DJ Party Mode Component
 * Transform Learning into an Unforgettable Experience
 * "Augmenting the World Starts at Prize2Pride"
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DJTrack {
  id: number;
  title: string;
  artist: string;
  genre: string;
  mood: string;
  bpm: number;
  duration: number;
  coverUrl?: string;
  lyrics?: { time: number; text: string; highlight?: string[] }[];
}

interface DJPartyModeProps {
  track?: DJTrack;
  isPlaying?: boolean;
  musicEnabled?: boolean;
  lyricsEnabled?: boolean;
  visualizationEnabled?: boolean;
  volume?: number;
  currentTime?: number;
  onTogglePlay?: () => void;
  onToggleMusic?: () => void;
  onToggleLyrics?: () => void;
  onToggleVisualization?: () => void;
  onNextTrack?: () => void;
  onPreviousTrack?: () => void;
  onVolumeChange?: (volume: number) => void;
}

export const DJPartyMode: React.FC<DJPartyModeProps> = ({
  track,
  isPlaying = false,
  musicEnabled = true,
  lyricsEnabled = true,
  visualizationEnabled = true,
  volume = 0.8,
  currentTime = 0,
  onTogglePlay,
  onToggleMusic,
  onToggleLyrics,
  onToggleVisualization,
  onNextTrack,
  onPreviousTrack,
  onVolumeChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  const [currentLyric, setCurrentLyric] = useState<{ text: string; highlight?: string[] } | null>(null);

  // Simulated audio visualization
  useEffect(() => {
    if (!isPlaying || !visualizationEnabled) return;

    const interval = setInterval(() => {
      const data: number[] = [];
      for (let i = 0; i < 64; i++) {
        data.push(Math.random() * 255 * (isPlaying ? 1 : 0.2));
      }
      setFrequencyData(data);
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, visualizationEnabled]);

  // Update current lyric
  useEffect(() => {
    if (!track?.lyrics || !lyricsEnabled) {
      setCurrentLyric(null);
      return;
    }

    for (let i = track.lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= track.lyrics[i].time) {
        setCurrentLyric(track.lyrics[i]);
        break;
      }
    }
  }, [currentTime, track, lyricsEnabled]);

  // Canvas visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visualizationEnabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / frequencyData.length;
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, '#FFD700');
      gradient.addColorStop(0.5, '#FF00FF');
      gradient.addColorStop(1, '#00FFFF');

      frequencyData.forEach((value, index) => {
        const barHeight = (value / 255) * canvas.height;
        const x = index * barWidth;
        const y = canvas.height - barHeight;

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2, barHeight);

        // Add glow effect
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;
      });
    };

    draw();
  }, [frequencyData, visualizationEnabled]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const HighlightedLyric: React.FC<{ text: string; highlight?: string[] }> = ({ text, highlight }) => {
    if (!highlight || highlight.length === 0) {
      return <span>{text}</span>;
    }

    const words = text.split(' ');
    return (
      <>
        {words.map((word, index) => {
          const isHighlighted = highlight.some(h => 
            word.toLowerCase().includes(h.toLowerCase())
          );
          return (
            <span key={index}>
              {isHighlighted ? (
                <motion.span
                  className="text-yellow-400 font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  {word}
                </motion.span>
              ) : (
                word
              )}
              {index < words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border border-yellow-500/30"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl"
          animate={{
            rotate: isPlaying ? 360 : 0,
            scale: isPlaying ? [1, 1.2, 1] : 1
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/20 to-transparent rounded-full blur-3xl"
          animate={{
            rotate: isPlaying ? -360 : 0,
            scale: isPlaying ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-pink-500 flex items-center justify-center"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <span className="text-2xl">🎧</span>
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-yellow-400">DJ Party Mode</h3>
              <p className="text-sm text-gray-400">Learn with Music</p>
            </div>
          </div>
          
          {/* Toggle Buttons */}
          <div className="flex gap-2">
            <motion.button
              className={`p-2 rounded-lg ${musicEnabled ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-500'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleMusic}
              title="Toggle Music"
            >
              {musicEnabled ? '🔊' : '🔇'}
            </motion.button>
            <motion.button
              className={`p-2 rounded-lg ${lyricsEnabled ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-500'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleLyrics}
              title="Toggle Lyrics"
            >
              📝
            </motion.button>
            <motion.button
              className={`p-2 rounded-lg ${visualizationEnabled ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-500'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleVisualization}
              title="Toggle Visualization"
            >
              📊
            </motion.button>
          </div>
        </div>

        {/* Visualization Canvas */}
        {visualizationEnabled && (
          <div className="mb-6 rounded-xl overflow-hidden bg-gray-900/50 border border-gray-700">
            <canvas
              ref={canvasRef}
              width={600}
              height={150}
              className="w-full"
            />
          </div>
        )}

        {/* Current Track Info */}
        {track && (
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-yellow-500 to-pink-500"
              animate={{ rotate: isPlaying ? [0, 5, -5, 0] : 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {track.coverUrl ? (
                <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">🎵</div>
              )}
            </motion.div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-white">{track.title}</h4>
              <p className="text-sm text-gray-400">{track.artist}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span>{track.genre}</span>
                <span>•</span>
                <span>{track.bpm} BPM</span>
                <span>•</span>
                <span>{track.mood}</span>
              </div>
            </div>
          </div>
        )}

        {/* Lyrics Display */}
        <AnimatePresence>
          {lyricsEnabled && currentLyric && (
            <motion.div
              className="mb-6 p-4 rounded-xl bg-gray-800/50 border border-yellow-500/20 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              key={currentLyric.text}
            >
              <p className="text-xl text-white">
                <HighlightedLyric text={currentLyric.text} highlight={currentLyric.highlight} />
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        {track && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(track.duration)}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-500 to-pink-500"
                style={{ width: `${(currentTime / track.duration) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <motion.button
            className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onPreviousTrack}
          >
            ⏮️
          </motion.button>
          
          <motion.button
            className="p-4 rounded-full bg-gradient-to-r from-yellow-500 to-pink-500 text-white text-2xl"
            whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onTogglePlay}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </motion.button>
          
          <motion.button
            className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onNextTrack}
          >
            ⏭️
          </motion.button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="text-gray-500">🔈</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange?.(parseFloat(e.target.value))}
            className="w-32 accent-yellow-500"
          />
          <span className="text-gray-500">🔊</span>
        </div>

        {/* Prize2Pride Branding */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🎵 Powered by <span className="text-yellow-500">Prize2Pride</span> DJ Party Mode
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DJPartyMode;
