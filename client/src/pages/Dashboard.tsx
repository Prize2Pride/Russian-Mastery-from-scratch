import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { motion } from "framer-motion";
import { 
  Crown, 
  BookOpen, 
  MessageCircle, 
  Music, 
  Trophy,
  ArrowLeft,
  ChevronRight,
  Flame,
  Star,
  Target,
  Clock,
  Zap,
  LogOut
} from "lucide-react";
import { Link } from "wouter";

// Sample user data
const USER_DATA = {
  name: "Apprenant",
  level: 3,
  levelTitle: "Étudiant",
  levelTitleRu: "Студент",
  totalXp: 2750,
  nextLevelXp: 3000,
  streak: 5,
  currentCefrLevel: "A1",
  cefrProgress: 65,
  lessonsCompleted: 23,
  wordsLearned: 156,
  songsGenerated: 8,
  todayXp: 120,
  dailyGoal: 150
};

// Recent activity
const RECENT_ACTIVITY = [
  { type: "lesson", title: "Приветствия", titleFr: "Les Salutations", xp: 50, time: "Il y a 2h" },
  { type: "song", title: "Привет Москва", titleFr: "Salut Moscou", xp: 30, time: "Il y a 5h" },
  { type: "chat", title: "Conversation informelle", titleFr: "Conversation informelle", xp: 20, time: "Hier" },
  { type: "lesson", title: "Числа", titleFr: "Les Nombres", xp: 70, time: "Hier" }
];

// Recommended lessons
const RECOMMENDED = [
  { id: 1, title: "Семья", titleFr: "La Famille", level: "A1", duration: 20, xp: 60 },
  { id: 2, title: "Еда и напитки", titleFr: "Nourriture et Boissons", level: "A1", duration: 30, xp: 80 },
  { id: 3, title: "В ресторане", titleFr: "Au Restaurant", level: "A1", duration: 25, xp: 70 }
];

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="bg-card/50 border-border max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Crown className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Tableau de Bord</h2>
            <p className="text-muted-foreground mb-6">
              Connectez-vous pour accéder à votre tableau de bord personnalisé.
            </p>
            <a href={getLoginUrl()}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Se Connecter
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dailyGoalProgress = (USER_DATA.todayXp / USER_DATA.dailyGoal) * 100;
  const levelProgress = ((USER_DATA.totalXp % 500) / 500) * 100;

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
                <span className="text-xl font-serif font-bold gold-text">Mon Tableau de Bord</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold">{USER_DATA.streak}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                <span className="font-bold">{USER_DATA.totalXp} XP</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => logout()}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">
                Bonjour, <span className="gold-text">{user?.name || USER_DATA.name}</span>! 👋
              </h1>
              <p className="text-muted-foreground">
                Continuez votre apprentissage du russe. Vous êtes sur une série de <span className="text-orange-500 font-bold">{USER_DATA.streak} jours</span>!
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/lessons">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Continuer
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Daily Goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/50 border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant={dailyGoalProgress >= 100 ? "default" : "outline"}>
                    {dailyGoalProgress >= 100 ? "Complété!" : "En cours"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Objectif Quotidien</p>
                <p className="text-2xl font-bold text-primary">{USER_DATA.todayXp}/{USER_DATA.dailyGoal} XP</p>
                <Progress value={dailyGoalProgress} className="h-2 mt-3" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Level Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="bg-card/50 border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-2xl font-bold text-purple-500">Niv. {USER_DATA.level}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{USER_DATA.levelTitle}</p>
                <p className="text-xs text-muted-foreground cyrillic mb-2">{USER_DATA.levelTitleRu}</p>
                <Progress value={levelProgress} className="h-2" />
              </CardContent>
            </Card>
          </motion.div>

          {/* CEFR Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/50 border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-2xl font-bold text-blue-500">{USER_DATA.currentCefrLevel}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Niveau CECR</p>
                <p className="text-xs text-muted-foreground mb-2">{USER_DATA.cefrProgress}% complété</p>
                <Progress value={USER_DATA.cefrProgress} className="h-2" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="bg-card/50 border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-2xl font-bold text-orange-500">{USER_DATA.streak}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Série de Jours</p>
                <p className="text-xs text-muted-foreground">Continuez demain!</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/lessons" className="block">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      Leçons
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/chat" className="block">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-purple-500" />
                      Chat Tuteur
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/songs" className="block">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-pink-500" />
                      Studio Chansons
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/progress" className="block">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      Progrès & Achievements
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Stats Summary */}
            <Card className="bg-card/50 border-border mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Leçons complétées</span>
                  <span className="font-bold">{USER_DATA.lessonsCompleted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Mots appris</span>
                  <span className="font-bold">{USER_DATA.wordsLearned}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Chansons générées</span>
                  <span className="font-bold">{USER_DATA.songsGenerated}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">XP Total</span>
                  <span className="font-bold text-primary">{USER_DATA.totalXp}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Recommended Lessons */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Leçons Recommandées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {RECOMMENDED.map((lesson, index) => (
                    <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-bold cyrillic">{lesson.title}</h4>
                            <p className="text-sm text-muted-foreground">{lesson.titleFr}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{lesson.level}</Badge>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {lesson.duration}m
                            </div>
                            <div className="flex items-center gap-1 text-sm text-primary">
                              <Star className="w-3 h-3" />
                              {lesson.xp} XP
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  Activité Récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {RECENT_ACTIVITY.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-4 rounded-xl bg-secondary/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activity.type === 'lesson' ? 'bg-blue-500/20' :
                          activity.type === 'song' ? 'bg-pink-500/20' : 'bg-purple-500/20'
                        }`}>
                          {activity.type === 'lesson' && <BookOpen className="w-5 h-5 text-blue-500" />}
                          {activity.type === 'song' && <Music className="w-5 h-5 text-pink-500" />}
                          {activity.type === 'chat' && <MessageCircle className="w-5 h-5 text-purple-500" />}
                        </div>
                        <div>
                          <h4 className="font-medium">{activity.titleFr}</h4>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-primary">+{activity.xp} XP</Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
