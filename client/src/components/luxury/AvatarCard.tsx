/**
 * Prize2Pride Ultimate - Avatar Card Component
 * Mega Luxurious Hosts & Hostesses Display
 * "Augmenting the World Starts at Prize2Pride"
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToneLevel = 'dirty' | 'slang' | 'informal' | 'formal' | 'diplomatic';

interface Avatar {
  id: number;
  name: string;
  nativeName?: string;
  gender: string;
  language: string;
  languageCode: string;
  nationality: string;
  specialty: string;
  subSpecialties: string[];
  bio: string;
  introScript: Record<ToneLevel, string>;
  personality: {
    warmth: number;
    humor: number;
    formality: number;
    sensuality: number;
    intelligence: number;
    patience: number;
  };
  appearance: {
    hairColor: string;
    eyeColor: string;
    skinTone: string;
    style: string;
    outfit: string;
    accessories: string[];
  };
  avatarImageUrl: string;
  rating: number;
  totalLessons: number;
  totalStudents: number;
}

interface AvatarCardProps {
  avatar: Avatar;
  onSelect?: (avatar: Avatar, tone: ToneLevel) => void;
  variant?: 'full' | 'compact' | 'mini';
  showToneSelector?: boolean;
}

const TONE_LABELS: Record<ToneLevel, { label: string; emoji: string; color: string }> = {
  dirty: { label: '18+ Dirty', emoji: '🔥', color: 'from-red-600 to-pink-600' },
  slang: { label: 'Slang', emoji: '😎', color: 'from-purple-600 to-indigo-600' },
  informal: { label: 'Informal', emoji: '😊', color: 'from-green-600 to-teal-600' },
  formal: { label: 'Formal', emoji: '👔', color: 'from-blue-600 to-cyan-600' },
  diplomatic: { label: 'Diplomatic', emoji: '👑', color: 'from-yellow-600 to-amber-600' }
};

export const AvatarCard: React.FC<AvatarCardProps> = ({
  avatar,
  onSelect,
  variant = 'full',
  showToneSelector = true
}) => {
  const [selectedTone, setSelectedTone] = useState<ToneLevel>('informal');
  const [showIntro, setShowIntro] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToneSelect = (tone: ToneLevel) => {
    setSelectedTone(tone);
    setShowIntro(true);
  };

  const handleStartLesson = () => {
    if (onSelect) {
      onSelect(avatar, selectedTone);
    }
  };

  const PersonalityBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 w-20">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs text-gray-500 w-8">{value}%</span>
    </div>
  );

  if (variant === 'mini') {
    return (
      <motion.div
        className="relative w-16 h-16 rounded-full overflow-hidden cursor-pointer border-2 border-yellow-500/50"
        whileHover={{ scale: 1.1, borderColor: 'rgba(255, 215, 0, 1)' }}
        onClick={handleStartLesson}
      >
        <img src={avatar.avatarImageUrl} alt={avatar.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute bottom-0 left-0 right-0 text-center text-[8px] text-white font-medium pb-0.5">
          {avatar.name}
        </span>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 border border-yellow-500/20 cursor-pointer"
        whileHover={{ scale: 1.02, borderColor: 'rgba(255, 215, 0, 0.5)' }}
        onClick={handleStartLesson}
      >
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500/50">
          <img src={avatar.avatarImageUrl} alt={avatar.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-400">{avatar.name}</h3>
          <p className="text-sm text-gray-400">{avatar.language} • {avatar.specialty}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-500">★ {avatar.rating}%</span>
            <span className="text-gray-500 text-xs">• {avatar.totalStudents.toLocaleString()} students</span>
          </div>
        </div>
        <div className="text-2xl">{avatar.gender === 'female' ? '👩' : '👨'}</div>
      </motion.div>
    );
  }

  // Full variant
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-yellow-500/30"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Avatar Image */}
      <div className="relative h-64 overflow-hidden">
        <motion.img
          src={avatar.avatarImageUrl}
          alt={avatar.name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/50">
          <span className="text-yellow-400 font-semibold">★ {avatar.rating}%</span>
        </div>

        {/* Language Flag */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gray-900/80 border border-gray-700">
          <span className="text-white text-sm">{avatar.language}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Name & Title */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            {avatar.name}
            {avatar.nativeName && <span className="text-lg text-gray-500 ml-2">({avatar.nativeName})</span>}
          </h3>
          <p className="text-gray-400">{avatar.nationality} • {avatar.specialty}</p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">📚</span>
            <span className="text-gray-300">{avatar.totalLessons.toLocaleString()} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">👥</span>
            <span className="text-gray-300">{avatar.totalStudents.toLocaleString()} students</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{avatar.bio}</p>

        {/* Specialties */}
        <div className="flex flex-wrap gap-2 mb-4">
          {avatar.subSpecialties.slice(0, 3).map((specialty, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300 border border-gray-700"
            >
              {specialty}
            </span>
          ))}
        </div>

        {/* Personality Bars */}
        <div className="space-y-2 mb-4">
          <PersonalityBar label="Intelligence" value={avatar.personality.intelligence} color="bg-blue-500" />
          <PersonalityBar label="Warmth" value={avatar.personality.warmth} color="bg-pink-500" />
          <PersonalityBar label="Patience" value={avatar.personality.patience} color="bg-green-500" />
        </div>

        {/* Tone Selector */}
        {showToneSelector && (
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">Select Teaching Tone:</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TONE_LABELS) as ToneLevel[]).map((tone) => (
                <motion.button
                  key={tone}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTone === tone
                      ? `bg-gradient-to-r ${TONE_LABELS[tone].color} text-white`
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToneSelect(tone)}
                >
                  {TONE_LABELS[tone].emoji} {TONE_LABELS[tone].label}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Introduction Preview */}
        <AnimatePresence>
          {showIntro && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 rounded-xl bg-gray-800/50 border border-yellow-500/20"
            >
              <p className="text-sm text-gray-300 italic">
                "{avatar.introScript[selectedTone]}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Lesson Button */}
        <motion.button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-500 text-gray-900 font-bold text-lg"
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartLesson}
        >
          Start 15-Min Lesson with {avatar.name}
        </motion.button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-br-full" />
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-yellow-500/10 to-transparent rounded-tl-full" />
    </motion.div>
  );
};

export default AvatarCard;
