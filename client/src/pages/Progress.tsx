import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Crown, 
  Star,
  ArrowLeft,
  BookOpen,
  MessageCircle,
  Music,
  Flame,
  Target,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  Zap
} from "lucide-react";
import { Link } from "wouter";

// Level thresholds
const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, title: "Débutant", titleRu: "Новичок" },
  { level: 2, xp: 500, title: "Apprenti", titleRu: "Ученик" },
  { level: 3, xp: 1500, title: "Étudiant", titleRu: "Студент" },
  { level: 4, xp: 3000, title: "Intermédiaire", titleRu: "Средний" },
  { level: 5, xp: 5000, title: "Avancé", titleRu: "Продвинутый" },
  { level: 6, xp: 8000, title: "Expert", titleRu: "Эксперт" },
  { level: 7, xp: 12000, title: "Maître", titleRu: "Мастер" },
  { level: 8, xp: 17000, title: "Grand Maître", titleRu: "Гранд Мастер" },
  { level: 9, xp: 23000, title: "Légende", titleRu: "Легенда" },
  { level: 10, xp: 30000, title: "Virtuose", titleRu: "Виртуоз" }
];

// Sample achievements
const ACHIEVEMENTS = [
  { id: 1, name: "Premier Pas", nameRu: "Первый шаг", description: "Complétez votre première leçon", icon: "🎯", unlocked: true, xp: 50 },
  { id: 2, name: "Polyglotte", nameRu: "Полиглот", description: "Apprenez 100 mots de vocabulaire", icon: "📚", unlocked: true, xp: 100 },
  { id: 3, name: "Musicien", nameRu: "Музыкант", description: "Générez votre première chanson", icon: "🎵", unlocked: true, xp: 75 },
  { id: 4, name: "Bavard", nameRu: "Болтун", description: "Envoyez 50 messages dans le chat", icon: "💬", unlocked: false, xp: 100 },
  { id: 5, name: "Série de 7", nameRu: "Серия 7", description: "Maintenez une série de 7 jours", icon: "🔥", unlocked: false, xp: 150 },
  { id: 6, name: "Maître A1", nameRu: "Мастер A1", description: "Complétez toutes les leçons A1", icon: "🏆", unlocked: false, xp: 500 },
  { id: 7, name: "Diplomate", nameRu: "Дипломат", description: "Maîtrisez le registre diplomatique", icon: "🎩", unlocked: false, xp: 300 },
  { id: 8, name: "Rappeur", nameRu: "Рэпер", description: "Générez 10 chansons rap", icon: "🎤", unlocked: false, xp: 200 }
];

// Sample user stats
const USER_STATS = {
  totalXp: 2750,
  lessonsCompleted: 23,
  totalLessons: 500,
  wordsLearned: 156,
  songsGenerated: 8,
  chatMessages: 42,
  streak: 5,
  longestStreak: 12,
  totalTimeMinutes: 480,
  currentLevel: "A1",
  levelProgress: 65
};

export default function Progress() {
  const { user, isAuthenticated } = useAuth();

  // Calculate current level
  const currentLevelData = LEVEL_THRESHOLDS.reduce((acc, level) => {
    if (USER_STATS.totalXp >= level.xp) return level;
    return acc;
  }, LEVEL_THRESHOLDS[0]);

  const nextLevelData = LEVEL_THRESHOLDS.find(l => l.xp > USER_STATS.totalXp) || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpForNextLevel = nextLevelData.xp - currentLevelData.xp;
  const xpProgress = USER_STATS.totalXp - currentLevelData.xp;
  const levelProgressPercent = (xpProgress / xpForNextLevel) * 100;

  const unlockedAchievements = ACHIEVEMENTS.filter(a => a.unlocked);
  const lockedAchievements = ACHIEVEMENTS.filter(a => !a.unlocked);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="bg-card/50 border-border max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Suivez Votre Progrès</h2>
            <p className="text-muted-foreground mb-6">
              Connectez-vous pour voir vos statistiques, achievements et progression.
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
                <Trophy className="w-6 h-6 text-primary" />
                <span className="text-xl font-serif font-bold gold-text">Mon Progrès</span>
              </div>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Tableau de Bord</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {/* Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-primary/20 via-card to-card border-primary/30">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center mb-4">
                    <span className="text-5xl font-bold text-primary">{currentLevelData.level}</span>
                  </div>
                  <h2 className="text-2xl font-bold">{currentLevelData.title}</h2>
                  <p className="text-muted-foreground cyrillic">{currentLevelData.titleRu}</p>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Niveau {currentLevelData.level}</span>
                    <span className="text-muted-foreground">Niveau {nextLevelData.level}</span>
                  </div>
                  <ProgressBar value={levelProgressPercent} className="h-4 mb-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-primary font-bold">{USER_STATS.totalXp} XP</span>
                    <span className="text-muted-foreground">{nextLevelData.xp} XP</span>
                  </div>
                  <p className="text-center text-muted-foreground mt-4">
                    Encore <span className="text-primary font-bold">{nextLevelData.xp - USER_STATS.totalXp} XP</span> pour atteindre {nextLevelData.title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Flame className="w-6 h-6" />}
            title="Série Actuelle"
            value={`${USER_STATS.streak} jours`}
            subtitle={`Record: ${USER_STATS.longestStreak} jours`}
            color="text-orange-500"
            bgColor="bg-orange-500/20"
          />
          <StatCard
            icon={<BookOpen className="w-6 h-6" />}
            title="Leçons Complétées"
            value={USER_STATS.lessonsCompleted.toString()}
            subtitle={`sur ${USER_STATS.totalLessons} leçons`}
            color="text-blue-500"
            bgColor="bg-blue-500/20"
          />
          <StatCard
            icon={<Target className="w-6 h-6" />}
            title="Mots Appris"
            value={USER_STATS.wordsLearned.toString()}
            subtitle="vocabulaire maîtrisé"
            color="text-green-500"
            bgColor="bg-green-500/20"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            title="Temps Total"
            value={`${Math.floor(USER_STATS.totalTimeMinutes / 60)}h ${USER_STATS.totalTimeMinutes % 60}m`}
            subtitle="d'apprentissage"
            color="text-purple-500"
            bgColor="bg-purple-500/20"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Music className="w-6 h-6" />}
            title="Chansons Générées"
            value={USER_STATS.songsGenerated.toString()}
            subtitle="avec Suno AI"
            color="text-pink-500"
            bgColor="bg-pink-500/20"
          />
          <StatCard
            icon={<MessageCircle className="w-6 h-6" />}
            title="Messages Chat"
            value={USER_STATS.chatMessages.toString()}
            subtitle="conversations"
            color="text-cyan-500"
            bgColor="bg-cyan-500/20"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Niveau CECR"
            value={USER_STATS.currentLevel}
            subtitle={`${USER_STATS.levelProgress}% complété`}
            color="text-amber-500"
            bgColor="bg-amber-500/20"
          />
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            Achievements
            <Badge variant="outline" className="ml-2">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</Badge>
          </h2>

          {/* Unlocked Achievements */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-muted-foreground mb-4">Débloqués</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {unlockedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-primary/10 border-primary/30">
                    <CardContent className="p-4 text-center">
                      <span className="text-4xl mb-2 block">{achievement.icon}</span>
                      <h4 className="font-bold">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground cyrillic mb-2">{achievement.nameRu}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <Badge className="mt-2 bg-primary/20 text-primary">+{achievement.xp} XP</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Locked Achievements */}
          <div>
            <h3 className="text-lg font-medium text-muted-foreground mb-4">À Débloquer</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {lockedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-secondary/30 border-border opacity-60">
                    <CardContent className="p-4 text-center">
                      <span className="text-4xl mb-2 block grayscale">{achievement.icon}</span>
                      <h4 className="font-bold">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground cyrillic mb-2">{achievement.nameRu}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <Badge variant="outline" className="mt-2">+{achievement.xp} XP</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  title,
  value,
  subtitle,
  color,
  bgColor
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  bgColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-card/50 border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center ${color}`}>
              {icon}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
