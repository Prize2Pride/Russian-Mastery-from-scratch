import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Music, 
  Mic2, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sparkles,
  Crown,
  ArrowLeft,
  Disc3,
  Radio,
  Waves,
  Flame,
  MessageCircle,
  Coffee,
  Briefcase,
  Award,
  RefreshCw,
  Download,
  Heart,
  Share2
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

type ToneLevel = "dirty" | "slang" | "informal" | "formal" | "diplomatic";

const TONE_CONFIG: Record<ToneLevel, { 
  icon: React.ReactNode; 
  label: string; 
  labelFr: string;
  description: string;
  color: string;
  bgColor: string;
  gradient: string;
  emoji: string;
  musicStyle: string;
}> = {
  dirty: {
    icon: <Flame className="w-5 h-5" />,
    label: "Грязный (+18)",
    labelFr: "Vulgaire (+18)",
    description: "Rap de rue hardcore russe",
    color: "text-red-400",
    bgColor: "bg-red-500/20 border-red-500/50",
    gradient: "from-red-600 to-orange-600",
    emoji: "🔥",
    musicStyle: "Hardcore Street Rap"
  },
  slang: {
    icon: <MessageCircle className="w-5 h-5" />,
    label: "Сленг",
    labelFr: "Argot",
    description: "Hip-hop moderne russe",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20 border-purple-500/50",
    gradient: "from-purple-600 to-pink-600",
    emoji: "🗣️",
    musicStyle: "Modern Hip-Hop"
  },
  informal: {
    icon: <Coffee className="w-5 h-5" />,
    label: "Неформальный",
    labelFr: "Informel",
    description: "Pop-rap décontracté",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20 border-blue-500/50",
    gradient: "from-blue-600 to-cyan-600",
    emoji: "💬",
    musicStyle: "Chill Pop-Rap"
  },
  formal: {
    icon: <Briefcase className="w-5 h-5" />,
    label: "Формальный",
    labelFr: "Formel",
    description: "Rap poétique classique",
    color: "text-gray-400",
    bgColor: "bg-gray-500/20 border-gray-500/50",
    gradient: "from-gray-600 to-slate-600",
    emoji: "👔",
    musicStyle: "Classic Poetic Rap"
  },
  diplomatic: {
    icon: <Award className="w-5 h-5" />,
    label: "Дипломатический",
    labelFr: "Diplomatique",
    description: "Poésie orchestrale élégante",
    color: "text-amber-400",
    bgColor: "bg-amber-500/20 border-amber-500/50",
    gradient: "from-amber-500 to-yellow-500",
    emoji: "🎩",
    musicStyle: "Elegant Orchestral Poetry"
  }
};

// Sample Russian tracks for each tone
const RUSSIAN_TRACKS: Record<ToneLevel, Array<{
  id: number;
  title: string;
  titleFr: string;
  artist: string;
  bpm: number;
  lyrics: string[];
  lyricsFr: string[];
}>> = {
  dirty: [
    {
      id: 1,
      title: "Улицы Москвы",
      titleFr: "Les Rues de Moscou",
      artist: "DJ Рауэд",
      bpm: 140,
      lyrics: [
        "🔥 Улицы Москвы, бетон и сталь",
        "💀 Здесь каждый день - это борьба",
        "🎤 Мы не сдаёмся, идём вперёд",
        "⚡ Русский дух никогда не умрёт"
      ],
      lyricsFr: [
        "🔥 Les rues de Moscou, béton et acier",
        "💀 Ici chaque jour est un combat",
        "🎤 On ne se rend pas, on avance",
        "⚡ L'esprit russe ne mourra jamais"
      ]
    }
  ],
  slang: [
    {
      id: 2,
      title: "Кайф и Тусовка",
      titleFr: "Le Kif et la Fête",
      artist: "MC Прайз",
      bpm: 128,
      lyrics: [
        "🗣️ Йо, чувак, погнали тусить",
        "🎉 Сегодня ночь - это наш кайф",
        "💎 Норм движ, всё круто",
        "🚀 Зашибись, мы на вершине"
      ],
      lyricsFr: [
        "🗣️ Yo, mec, on va faire la fête",
        "🎉 Cette nuit c'est notre kif",
        "💎 Bon délire, tout est cool",
        "🚀 Génial, on est au sommet"
      ]
    }
  ],
  informal: [
    {
      id: 3,
      title: "Привет, Друзья",
      titleFr: "Salut, les Amis",
      artist: "Группа Дружба",
      bpm: 110,
      lyrics: [
        "💬 Привет, друзья, как дела?",
        "☀️ Сегодня классный день",
        "🎵 Давайте петь вместе",
        "❤️ Дружба - это сила"
      ],
      lyricsFr: [
        "💬 Salut les amis, comment ça va?",
        "☀️ Aujourd'hui c'est une belle journée",
        "🎵 Chantons ensemble",
        "❤️ L'amitié c'est la force"
      ]
    }
  ],
  formal: [
    {
      id: 4,
      title: "Путь к Знаниям",
      titleFr: "Le Chemin du Savoir",
      artist: "Профессор Рэп",
      bpm: 95,
      lyrics: [
        "👔 Уважаемые слушатели",
        "📚 Знание - это сила и свет",
        "🎓 Образование открывает двери",
        "🌟 К успеху ведёт упорный труд"
      ],
      lyricsFr: [
        "👔 Chers auditeurs",
        "📚 Le savoir est force et lumière",
        "🎓 L'éducation ouvre les portes",
        "🌟 Le travail acharné mène au succès"
      ]
    }
  ],
  diplomatic: [
    {
      id: 5,
      title: "Симфония Мира",
      titleFr: "Symphonie de la Paix",
      artist: "Посол Гармонии",
      bpm: 80,
      lyrics: [
        "🎩 Ваше Превосходительство",
        "🕊️ Мир и согласие между народами",
        "🌍 Дипломатия строит мосты",
        "👑 Величие в мудрости и терпении"
      ],
      lyricsFr: [
        "🎩 Votre Excellence",
        "🕊️ Paix et harmonie entre les peuples",
        "🌍 La diplomatie construit des ponts",
        "👑 La grandeur dans la sagesse et la patience"
      ]
    }
  ]
};

export default function DJParty() {
  const { user, isAuthenticated } = useAuth();
  const [selectedTone, setSelectedTone] = useState<ToneLevel>("slang");
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [lyricsEnabled, setLyricsEnabled] = useState(true);
  const [showFrench, setShowFrench] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(30).fill(0));
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const tracks = RUSSIAN_TRACKS[selectedTone];
  const currentTrackData = tracks[currentTrack % tracks.length];
  const config = TONE_CONFIG[selectedTone];

  // Simulate audio visualizer
  useEffect(() => {
    if (!isPlaying || !musicEnabled) {
      setVisualizerBars(Array(30).fill(5));
      return;
    }

    const interval = setInterval(() => {
      setVisualizerBars(Array(30).fill(0).map(() => Math.random() * 100));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, musicEnabled]);

  // Cycle through lyrics
  useEffect(() => {
    if (!isPlaying || !lyricsEnabled) return;

    const interval = setInterval(() => {
      setCurrentLyricIndex(prev => (prev + 1) % currentTrackData.lyrics.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, lyricsEnabled, currentTrackData.lyrics.length]);

  const generateNewSong = async () => {
    setIsGenerating(true);
    // Simulate song generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black flex items-center justify-center p-6">
        <Card className="bg-gray-900/50 border-purple-500/30 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Music className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Connexion Requise</h2>
            <p className="text-lg text-purple-300 mb-4 cyrillic">Требуется вход</p>
            <p className="text-gray-400 mb-6">
              Connectez-vous pour accéder au DJ Party Mode et transformer vos leçons de russe en expérience festive!
            </p>
            <a href={getLoginUrl()}>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold">
                <Sparkles className="w-4 h-4 mr-2" />
                Se Connecter pour la Fête
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Disco lights effect when playing */}
        {isPlaying && musicEnabled && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute top-20 left-20 w-4 h-40 bg-gradient-to-b from-purple-500 to-transparent opacity-40"
              style={{ transformOrigin: "top center" }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute top-20 right-20 w-4 h-40 bg-gradient-to-b from-pink-500 to-transparent opacity-40"
              style={{ transformOrigin: "top center" }}
            />
            <motion.div
              animate={{ rotate: 180 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute top-20 left-1/2 w-4 h-32 bg-gradient-to-b from-amber-500 to-transparent opacity-30"
              style={{ transformOrigin: "top center" }}
            />
          </>
        )}
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-purple-500/20 backdrop-blur-xl bg-black/30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-purple-400">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
              >
                <Disc3 className="w-8 h-8 text-purple-400" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  DJ Party Mode 🎧
                </h1>
                <p className="text-gray-500 text-sm">Rap Russe & Chansons • Русский Рэп</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
              <Radio className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm">{isPlaying ? "EN DIRECT" : "PAUSE"}</span>
            </div>
            <Badge className={`${config.bgColor} ${config.color}`}>
              {config.emoji} {config.labelFr}
            </Badge>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Tone Selector */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-400 mb-3">🎭 Sélectionnez le Style Musical / Выберите стиль:</h3>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(TONE_CONFIG) as ToneLevel[]).map((tone) => {
              const toneConfig = TONE_CONFIG[tone];
              const isSelected = selectedTone === tone;
              return (
                <motion.button
                  key={tone}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedTone(tone);
                    setCurrentTrack(0);
                    setCurrentLyricIndex(0);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                    isSelected 
                      ? `${toneConfig.bgColor} ${toneConfig.color} border-current shadow-lg` 
                      : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <span className="text-2xl">{toneConfig.emoji}</span>
                  <div className="text-left">
                    <span className="font-bold block">{toneConfig.labelFr}</span>
                    <span className="text-xs opacity-70 cyrillic">{toneConfig.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
          <p className="text-gray-500 text-sm mt-3">
            Style actuel: <span className={config.color}>{config.description}</span> • {config.musicStyle}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Now Playing Card */}
            <Card className="bg-gray-900/50 border-purple-500/30 overflow-hidden">
              <CardContent className="p-0">
                {/* Album Art / Visualizer */}
                <div className={`relative h-72 bg-gradient-to-br ${config.gradient} flex items-end justify-center p-4`}>
                  {/* Visualizer Bars */}
                  <div className="flex items-end gap-1 h-full w-full">
                    {visualizerBars.map((height, i) => (
                      <motion.div
                        key={i}
                        className={`flex-1 bg-gradient-to-t ${config.gradient} rounded-t opacity-80`}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    ))}
                  </div>
                  
                  {/* Track Info Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6">
                    <motion.div
                      animate={isPlaying ? { scale: [1, 1.02, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">{config.emoji}</span>
                        <Badge className={config.bgColor}>{config.labelFr}</Badge>
                      </div>
                      <h2 className="text-4xl font-black text-white cyrillic">{currentTrackData?.title}</h2>
                      <p className="text-lg text-gray-300">{currentTrackData?.titleFr}</p>
                      <p className={config.color}>{currentTrackData?.artist}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span>{config.musicStyle}</span>
                        <span>•</span>
                        <span>{currentTrackData?.bpm} BPM</span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Lyrics Display */}
                {lyricsEnabled && (
                  <div className="p-6 bg-black/50 border-t border-purple-500/20">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentLyricIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center space-y-2"
                      >
                        <p className="text-2xl font-bold cyrillic text-white">
                          {currentTrackData.lyrics[currentLyricIndex]}
                        </p>
                        {showFrench && (
                          <p className="text-lg text-gray-400">
                            {currentTrackData.lyricsFr[currentLyricIndex]}
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}

                {/* Controls */}
                <div className="p-6 space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Slider
                      defaultValue={[33]}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>1:23</span>
                      <span>3:45</span>
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                      onClick={() => setCurrentTrack(prev => Math.max(0, prev - 1))}
                    >
                      <SkipBack className="w-6 h-6" />
                    </Button>
                    
                    <Button
                      size="lg"
                      className={`w-20 h-20 rounded-full bg-gradient-to-r ${config.gradient} hover:opacity-90 shadow-lg shadow-purple-500/30`}
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="w-10 h-10 text-white" />
                      ) : (
                        <Play className="w-10 h-10 text-white ml-1" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                      onClick={() => setCurrentTrack(prev => prev + 1)}
                    >
                      <SkipForward className="w-6 h-6" />
                    </Button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                      onClick={() => setVolume(prev => prev[0] > 0 ? [0] : [75])}
                    >
                      {volume[0] === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-gray-400 text-sm w-12">{volume[0]}%</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-3">
                    <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-400">
                      <Heart className="w-4 h-4 mr-2" />
                      Favoris
                    </Button>
                    <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-400">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                    <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-400">
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Controls Card */}
            <Card className="bg-gray-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Waves className="w-5 h-5" />
                  Contrôles DJ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Music Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-purple-400" />
                    <span>Musique</span>
                  </div>
                  <Switch
                    checked={musicEnabled}
                    onCheckedChange={setMusicEnabled}
                  />
                </div>

                {/* Lyrics Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic2 className="w-5 h-5 text-pink-400" />
                    <span>Paroles</span>
                  </div>
                  <Switch
                    checked={lyricsEnabled}
                    onCheckedChange={setLyricsEnabled}
                  />
                </div>

                {/* French Translation Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇫🇷</span>
                    <span>Traduction FR</span>
                  </div>
                  <Switch
                    checked={showFrench}
                    onCheckedChange={setShowFrench}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Generate New Song Card */}
            <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-400">
                  <Sparkles className="w-5 h-5" />
                  Générer avec Suno AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Créez un nouveau rap russe personnalisé avec l'IA Suno dans le style <span className={config.color}>{config.labelFr}</span>
                </p>
                <Button
                  className={`w-full bg-gradient-to-r ${config.gradient} hover:opacity-90`}
                  onClick={generateNewSong}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Générer un Rap Russe
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  10 chansons gratuites par jour • 10 бесплатных песен в день
                </p>
              </CardContent>
            </Card>

            {/* Tone Info Card */}
            <Card className={`bg-gray-900/50 border ${config.color.replace('text-', 'border-')}/30`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${config.color}`}>
                  {config.icon}
                  {config.labelFr}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl cyrillic mb-2">{config.label}</p>
                <p className="text-gray-400 text-sm mb-4">{config.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Style:</span>
                    <span className={config.color}>{config.musicStyle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">BPM moyen:</span>
                    <span className="text-white">{currentTrackData.bpm}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Founder Credit */}
            <Card className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 border-amber-500/30">
              <CardContent className="p-4 text-center">
                <Crown className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-amber-300 font-bold">Prize2Pride Ultimate</p>
                <p className="text-xs text-gray-400">Créé par Raoued Fadhel</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
