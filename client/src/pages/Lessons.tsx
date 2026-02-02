import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Crown, 
  ChevronRight, 
  Clock, 
  Star,
  Lock,
  CheckCircle,
  Play,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

// Level configuration
const LEVELS = [
  { id: "A1", name: "Débutant", nameRu: "Начальный", color: "bg-green-500" },
  { id: "A2", name: "Élémentaire", nameRu: "Элементарный", color: "bg-blue-500" },
  { id: "B1", name: "Intermédiaire", nameRu: "Средний", color: "bg-yellow-500" },
  { id: "B2", name: "Avancé", nameRu: "Продвинутый", color: "bg-orange-500" },
  { id: "C1", name: "Maîtrise", nameRu: "Мастерство", color: "bg-red-500" }
];

// Categories
const CATEGORIES = [
  { id: "basics", name: "Bases", nameRu: "Основы", icon: "📚" },
  { id: "vocabulary", name: "Vocabulaire", nameRu: "Словарь", icon: "📖" },
  { id: "grammar", name: "Grammaire", nameRu: "Грамматика", icon: "✏️" },
  { id: "conversation", name: "Conversation", nameRu: "Разговор", icon: "💬" },
  { id: "culture", name: "Culture", nameRu: "Культура", icon: "🎭" },
  { id: "business", name: "Affaires", nameRu: "Бизнес", icon: "💼" }
];

// Tone configuration
const TONES = [
  { id: "dirty", name: "Vulgaire", emoji: "🔥" },
  { id: "slang", name: "Argot", emoji: "🗣️" },
  { id: "informal", name: "Informel", emoji: "💬" },
  { id: "formal", name: "Formel", emoji: "👔" },
  { id: "diplomatic", name: "Diplomatique", emoji: "🎩" }
];

// Sample lessons data (will be replaced with API data)
const SAMPLE_LESSONS = [
  { id: 1, title: "Приветствия", titleFr: "Les Salutations", level: "A1", category: "basics", tone: "informal", duration: 15, xp: 50, completed: true },
  { id: 2, title: "Знакомство", titleFr: "Se Présenter", level: "A1", category: "basics", tone: "informal", duration: 20, xp: 60, completed: true },
  { id: 3, title: "Числа", titleFr: "Les Nombres", level: "A1", category: "basics", tone: "informal", duration: 25, xp: 70, completed: false },
  { id: 4, title: "Семья", titleFr: "La Famille", level: "A1", category: "vocabulary", tone: "informal", duration: 20, xp: 60, completed: false },
  { id: 5, title: "Еда и напитки", titleFr: "Nourriture et Boissons", level: "A1", category: "vocabulary", tone: "informal", duration: 30, xp: 80, completed: false },
];

export default function Lessons() {
  const { user, isAuthenticated } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState("A1");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTone, setSelectedTone] = useState("all");

  // Filter lessons
  const filteredLessons = SAMPLE_LESSONS.filter(lesson => {
    if (selectedLevel !== "all" && lesson.level !== selectedLevel) return false;
    if (selectedCategory !== "all" && lesson.category !== selectedCategory) return false;
    if (selectedTone !== "all" && lesson.tone !== selectedTone) return false;
    return true;
  });

  const completedCount = filteredLessons.filter(l => l.completed).length;
  const progressPercent = (completedCount / filteredLessons.length) * 100 || 0;

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
                <Crown className="w-6 h-6 text-primary" />
                <span className="text-xl font-serif font-bold gold-text">Leçons de Russe</span>
              </div>
            </div>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  <span className="text-primary font-bold">{user?.totalXp || 0}</span> XP
                </div>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Tableau de Bord
                  </Button>
                </Link>
              </div>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Connexion
                </Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {/* Level Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-serif font-bold mb-4">Niveau CECR</h2>
          <div className="flex flex-wrap gap-3">
            {LEVELS.map((level) => (
              <Button
                key={level.id}
                variant={selectedLevel === level.id ? "default" : "outline"}
                className={selectedLevel === level.id ? "bg-primary text-primary-foreground" : ""}
                onClick={() => setSelectedLevel(level.id)}
              >
                <span className={`w-2 h-2 rounded-full ${level.color} mr-2`} />
                {level.id} - {level.name}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            {/* Progress Card */}
            <Card className="bg-card/50 border-border mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Votre Progrès</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Niveau {selectedLevel}</span>
                      <span className="text-primary font-bold">{completedCount}/{filteredLessons.length}</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Filter */}
            <Card className="bg-card/50 border-border mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Catégories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory("all")}
                  >
                    📋 Toutes les Catégories
                  </Button>
                  {CATEGORIES.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.icon} {cat.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tone Filter */}
            <Card className="bg-card/50 border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Registre de Langue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedTone === "all" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedTone("all")}
                  >
                    🌐 Tous les Registres
                  </Button>
                  {TONES.map((tone) => (
                    <Button
                      key={tone.id}
                      variant={selectedTone === tone.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedTone(tone.id)}
                    >
                      {tone.emoji} {tone.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content - Lessons List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold">
                Leçons Disponibles
                <span className="text-muted-foreground text-lg ml-2">({filteredLessons.length})</span>
              </h2>
            </div>

            <div className="space-y-4">
              {filteredLessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/lesson/${lesson.id}`}>
                    <Card className={`bg-card/50 border-border hover:border-primary/50 transition-all duration-300 cursor-pointer ${lesson.completed ? 'border-l-4 border-l-green-500' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${lesson.completed ? 'bg-green-500/20' : 'bg-primary/20'}`}>
                              {lesson.completed ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                              ) : (
                                <Play className="w-6 h-6 text-primary" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-foreground cyrillic">{lesson.title}</h3>
                              <p className="text-muted-foreground">{lesson.titleFr}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Clock className="w-4 h-4" />
                                {lesson.duration} min
                              </div>
                              <div className="flex items-center gap-2 text-sm text-primary">
                                <Star className="w-4 h-4" />
                                {lesson.xp} XP
                              </div>
                            </div>
                            <Badge variant="outline" className={`bg-tone-${lesson.tone}`}>
                              {TONES.find(t => t.id === lesson.tone)?.emoji} {TONES.find(t => t.id === lesson.tone)?.name}
                            </Badge>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}

              {filteredLessons.length === 0 && (
                <Card className="bg-card/50 border-border">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Aucune leçon trouvée</h3>
                    <p className="text-muted-foreground">
                      Essayez de modifier vos filtres pour voir plus de leçons.
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
