import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getLoginUrl } from "@/const";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Music, 
  Crown, 
  Sparkles,
  ArrowLeft,
  Play,
  Pause,
  Download,
  Loader2,
  Mic,
  Volume2,
  Clock,
  Star,
  Zap
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

// Level configuration
const LEVELS = [
  { id: "A1", name: "Débutant" },
  { id: "A2", name: "Élémentaire" },
  { id: "B1", name: "Intermédiaire" },
  { id: "B2", name: "Avancé" },
  { id: "C1", name: "Maîtrise" }
];

// Tone configuration
const TONES = [
  { id: "dirty", name: "Vulgaire", emoji: "🔥" },
  { id: "slang", name: "Argot", emoji: "🗣️" },
  { id: "informal", name: "Informel", emoji: "💬" },
  { id: "formal", name: "Formel", emoji: "👔" },
  { id: "diplomatic", name: "Diplomatique", emoji: "🎩" }
];

// Music styles
const STYLES = [
  { id: "rap", name: "Rap", emoji: "🎤" },
  { id: "pop", name: "Pop", emoji: "🎵" },
  { id: "rock", name: "Rock", emoji: "🎸" },
  { id: "folk", name: "Folk Russe", emoji: "🪆" },
  { id: "electronic", name: "Électronique", emoji: "🎧" }
];

// Sample generated songs
const SAMPLE_SONGS = [
  {
    id: 1,
    title: "Привет Москва",
    titleFr: "Salut Moscou",
    style: "rap",
    level: "A1",
    tone: "slang",
    lyrics: "Привет, Москва, я здесь!\nУчу русский каждый день\nСлова летят как снег\nЯ становлюсь сильней",
    lyricsFr: "Salut Moscou, je suis là!\nJ'apprends le russe chaque jour\nLes mots volent comme la neige\nJe deviens plus fort",
    status: "completed",
    audioUrl: "#",
    vocabulary: ["Привет", "Москва", "русский", "слова", "снег"]
  },
  {
    id: 2,
    title: "Русская Душа",
    titleFr: "L'Âme Russe",
    style: "folk",
    level: "B1",
    tone: "formal",
    lyrics: "В глубине русской души\nЛежит мудрость веков\nКаждое слово - как ключ\nК сердцам наших предков",
    lyricsFr: "Au fond de l'âme russe\nRepose la sagesse des siècles\nChaque mot est comme une clé\nVers les cœurs de nos ancêtres",
    status: "completed",
    audioUrl: "#",
    vocabulary: ["душа", "мудрость", "веков", "слово", "сердце"]
  }
];

export default function SongStudio() {
  const { user, isAuthenticated } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState("A1");
  const [selectedTone, setSelectedTone] = useState("slang");
  const [selectedStyle, setSelectedStyle] = useState("rap");
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSongs, setGeneratedSongs] = useState(SAMPLE_SONGS);
  const [playingSong, setPlayingSong] = useState<number | null>(null);
  const [dailySongsUsed, setDailySongsUsed] = useState(2);
  const maxDailySongs = 10;

  const handleGenerate = async () => {
    if (!topic.trim() || isGenerating || dailySongsUsed >= maxDailySongs) return;

    setIsGenerating(true);

    // Simulate song generation (will be replaced with actual Suno API call)
    setTimeout(() => {
      const newSong = {
        id: Date.now(),
        title: `Новая Песня о ${topic}`,
        titleFr: `Nouvelle Chanson sur ${topic}`,
        style: selectedStyle,
        level: selectedLevel,
        tone: selectedTone,
        lyrics: `Это новая песня\nО теме: ${topic}\nНа уровне ${selectedLevel}\nВ стиле ${STYLES.find(s => s.id === selectedStyle)?.name}`,
        lyricsFr: `C'est une nouvelle chanson\nSur le thème: ${topic}\nAu niveau ${selectedLevel}\nDans le style ${STYLES.find(s => s.id === selectedStyle)?.name}`,
        status: "completed",
        audioUrl: "#",
        vocabulary: ["песня", "тема", "уровень", "стиль"]
      };

      setGeneratedSongs([newSong, ...generatedSongs]);
      setDailySongsUsed(dailySongsUsed + 1);
      setTopic("");
      setIsGenerating(false);
    }, 3000);
  };

  const togglePlay = (songId: number) => {
    setPlayingSong(playingSong === songId ? null : songId);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Music className="w-6 h-6 text-primary" />
                <span className="text-xl font-serif font-bold gold-text">Studio de Chansons</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Chansons aujourd'hui: </span>
                <span className="text-primary font-bold">{dailySongsUsed}/{maxDailySongs}</span>
              </div>
              {!isAuthenticated && (
                <a href={getLoginUrl()}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Connexion
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Song Generator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="bg-card/50 border-border sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Générer une Chanson
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Daily Limit Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Limite quotidienne</span>
                    <span className="text-primary">{maxDailySongs - dailySongsUsed} restantes</span>
                  </div>
                  <Progress value={(dailySongsUsed / maxDailySongs) * 100} className="h-2" />
                </div>

                {/* Topic Input */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Thème de la chanson</label>
                  <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: l'amour, Moscou, l'hiver..."
                    className="bg-secondary/30"
                  />
                </div>

                {/* Level Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Niveau de langue</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="bg-secondary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          {level.id} - {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tone Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Registre de langue</label>
                  <Select value={selectedTone} onValueChange={setSelectedTone}>
                    <SelectTrigger className="bg-secondary/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((tone) => (
                        <SelectItem key={tone.id} value={tone.id}>
                          {tone.emoji} {tone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Style Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Style musical</label>
                  <div className="grid grid-cols-2 gap-2">
                    {STYLES.map((style) => (
                      <Button
                        key={style.id}
                        variant={selectedStyle === style.id ? "default" : "outline"}
                        className={selectedStyle === style.id ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => setSelectedStyle(style.id)}
                      >
                        {style.emoji} {style.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={!topic.trim() || isGenerating || dailySongsUsed >= maxDailySongs}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : dailySongsUsed >= maxDailySongs ? (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      Limite atteinte
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Générer avec Suno AI
                    </>
                  )}
                </Button>

                {dailySongsUsed >= maxDailySongs && (
                  <p className="text-sm text-muted-foreground text-center">
                    Revenez demain pour 10 nouvelles chansons gratuites!
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Generated Songs List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold">
                Vos Chansons
                <span className="text-muted-foreground text-lg ml-2">({generatedSongs.length})</span>
              </h2>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {generatedSongs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-card/50 border-border hover:border-primary/50 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Play Button */}
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-14 h-14 rounded-xl bg-primary/20 border-primary/30 hover:bg-primary/30"
                            onClick={() => togglePlay(song.id)}
                          >
                            {playingSong === song.id ? (
                              <Pause className="w-6 h-6 text-primary" />
                            ) : (
                              <Play className="w-6 h-6 text-primary" />
                            )}
                          </Button>

                          {/* Song Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold cyrillic">{song.title}</h3>
                              <Badge variant="outline">{song.level}</Badge>
                              <Badge variant="outline" className={`bg-tone-${song.tone}`}>
                                {TONES.find(t => t.id === song.tone)?.emoji}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">{song.titleFr}</p>

                            {/* Lyrics Preview */}
                            <div className="grid md:grid-cols-2 gap-4 p-4 rounded-xl bg-secondary/30">
                              <div>
                                <p className="text-xs text-muted-foreground mb-2">Paroles (Russe)</p>
                                <p className="text-sm cyrillic whitespace-pre-line">{song.lyrics}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-2">Traduction (Français)</p>
                                <p className="text-sm whitespace-pre-line">{song.lyricsFr}</p>
                              </div>
                            </div>

                            {/* Vocabulary */}
                            <div className="mt-4">
                              <p className="text-xs text-muted-foreground mb-2">Vocabulaire à apprendre:</p>
                              <div className="flex flex-wrap gap-2">
                                {song.vocabulary.map((word, i) => (
                                  <Badge key={i} variant="secondary" className="cyrillic">
                                    {word}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <Button variant="ghost" size="icon">
                              <Volume2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {generatedSongs.length === 0 && (
                <Card className="bg-card/50 border-border">
                  <CardContent className="p-12 text-center">
                    <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Aucune chanson générée</h3>
                    <p className="text-muted-foreground">
                      Créez votre première chanson russe avec Suno AI!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
