import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  MessageCircle, 
  Music, 
  Trophy, 
  ChevronRight, 
  Sparkles,
  Crown,
  Zap,
  GraduationCap,
  Languages
} from "lucide-react";
import { Link } from "wouter";
import { ToneTransformation } from "@/components/ToneTransformation";

// Tone configuration for the 5 registers
const TONE_CONFIG = {
  dirty: { emoji: "🔥", label: "Vulgaire", labelRu: "Грязный", color: "from-red-600 to-red-800", description: "Langage très familier et cru" },
  slang: { emoji: "🗣️", label: "Argot", labelRu: "Сленг", color: "from-purple-600 to-purple-800", description: "Expressions de rue et jeunes" },
  informal: { emoji: "💬", label: "Informel", labelRu: "Неформальный", color: "from-blue-600 to-blue-800", description: "Conversation décontractée" },
  formal: { emoji: "👔", label: "Formel", labelRu: "Формальный", color: "from-gray-600 to-gray-800", description: "Langage professionnel" },
  diplomatic: { emoji: "🎩", label: "Diplomatique", labelRu: "Дипломатический", color: "from-amber-600 to-amber-800", description: "Haut niveau et raffiné" }
};

// Level configuration
const LEVELS = [
  { id: "A1", name: "Débutant", nameRu: "Начальный", lessons: 100 },
  { id: "A2", name: "Élémentaire", nameRu: "Элементарный", lessons: 100 },
  { id: "B1", name: "Intermédiaire", nameRu: "Средний", lessons: 100 },
  { id: "B2", name: "Avancé", nameRu: "Продвинутый", lessons: 100 },
  { id: "C1", name: "Maîtrise", nameRu: "Мастерство", lessons: 100 }
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-primary" />
              <span className="text-2xl font-serif font-bold gold-text">Russian Mastery</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/lessons" className="text-muted-foreground hover:text-foreground transition-colors">Leçons</Link>
              <Link href="/chat" className="text-muted-foreground hover:text-foreground transition-colors">Chat</Link>
              <Link href="/songs" className="text-muted-foreground hover:text-foreground transition-colors">Chansons</Link>
              <Link href="/progress" className="text-muted-foreground hover:text-foreground transition-colors">Progrès</Link>
              <Link href="/dj-party" className="text-muted-foreground hover:text-foreground transition-colors">DJ Party 🎧</Link>
            </div>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Mon Tableau de Bord
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Zap className="w-4 h-4 mr-2" />
                  Commencer
                </Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Propulsé par Prize2Pride</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold mb-6 leading-tight">
              <span className="gold-text">Maîtrisez le Russe</span>
              <br />
              <span className="text-foreground">Du Zéro à l'Excellence</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Apprenez le russe avec notre système révolutionnaire à 5 registres de langue. 
              De l'argot de rue au langage diplomatique, maîtrisez toutes les nuances 
              avec des explications en français.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/lessons">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explorer les Leçons
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="lg" variant="outline" className="text-lg px-8 border-primary/50 hover:bg-primary/10">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat en Direct
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Founder Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-card via-card to-primary/10 p-8 border border-primary/30 gold-glow">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
              
              {/* Floating decorations */}
              <div className="absolute top-4 left-4 w-2 h-2 bg-primary rounded-full animate-pulse" />
              <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full animate-ping" />
              <div className="absolute bottom-12 left-12 w-1.5 h-1.5 bg-primary/70 rounded-full animate-pulse" />
              
              <div className="relative z-10 text-center">
                <div className="absolute -top-4 -right-4 px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full animate-pulse flex items-center gap-1">
                  <Zap className="w-3 h-3" /> OMEGA PROTOCOL ACTIVE
                </div>
                <motion.div
                  className="mb-4"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-5xl">👑</span>
                </motion.div>
                
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-2xl">💎</span>
                  <h2 className="text-4xl font-serif font-bold gold-text tracking-wider">
                    RAOUED FADHEL
                  </h2>
                  <span className="text-2xl">💎</span>
                </div>
                
                <p className="text-xl text-primary/90 font-light tracking-wide mb-6">
                  Fondateur & Visionnaire
                </p>
                
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/20 border border-primary/40 mb-6">
                  <span className="text-primary font-semibold">Prize2Pride Ultimate</span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {['Fiction2Real', 'Purchase2Win', 'MLM-Prize2Pride'].map((platform, index) => (
                    <motion.span
                      key={platform}
                      className="px-4 py-1.5 rounded-full bg-secondary/50 border border-primary/20 text-primary/80 text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      {platform}
                    </motion.span>
                  ))}
                </div>
                
                <div className="pt-6 border-t border-primary/20">
                  <p className="text-lg text-muted-foreground italic">
                    "Augmenter le Monde Commence chez Prize2Pride"
                  </p>
                  <p className="text-sm text-primary/60 mt-2">
                    Transformer l'Éducation en une Expérience Inoubliable
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-primary/40 uppercase tracking-widest">
                    <span>Extreme Protocols</span>
                    <span className="w-1 h-1 bg-primary/40 rounded-full" />
                    <span>GDPR Protected</span>
                    <span className="w-1 h-1 bg-primary/40 rounded-full" />
                    <span>Manus Augmented</span>
                  </div>
                </div>
              </div>
              
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/30 rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary/30 rounded-bl-3xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-3xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-4">
            <span className="gold-text">Fonctionnalités</span> Révolutionnaires
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une plateforme complète pour maîtriser le russe à tous les niveaux
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<BookOpen className="w-6 h-6" />}
            title="500 Leçons par Niveau"
            description="Curriculum complet de A1 à C1 avec vocabulaire, grammaire et dialogues"
            gradient="from-blue-500 to-blue-700"
            link="/lessons"
          />
          <FeatureCard
            icon={<MessageCircle className="w-6 h-6" />}
            title="Chat en Direct"
            description="Tuteur IA interactif avec explications en français et adaptation de ton"
            gradient="from-purple-500 to-purple-700"
            link="/chat"
          />
          <FeatureCard
            icon={<Music className="w-6 h-6" />}
            title="10 Chansons/Jour"
            description="Générez des raps russes personnalisés avec Suno AI pour apprendre"
            gradient="from-pink-500 to-pink-700"
            link="/songs"
          />
          <FeatureCard
            icon={<Trophy className="w-6 h-6" />}
            title="Suivi de Progrès"
            description="Statistiques détaillées, achievements et système de niveaux"
            gradient="from-amber-500 to-amber-700"
            link="/progress"
          />
        </div>

        {/* DJ Party Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <Link href="/dj-party">
            <Card className="bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-purple-900/50 border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer overflow-hidden">
              <CardContent className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">🎧 DJ Party Mode</h3>
                    <p className="text-purple-300">Transformez vos leçons en fête avec du rap russe généré par IA!</p>
                    <p className="text-sm text-purple-400 mt-1 cyrillic">Русский рэп и музыка • 5 стилей</p>
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 text-purple-400" />
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </section>

      {/* Tone Levels Section */}
      <section className="relative z-10 container py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
              <span className="gold-text">5 Registres</span> de Langue
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Maîtrisez toutes les nuances du russe, de l'argot de rue au langage diplomatique. 
              Notre IA transforme instantanément n'importe quelle phrase pour vous montrer 
              comment l'adapter à chaque situation sociale.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <h4 className="font-bold gold-text mb-1">Immersion Totale</h4>
                <p className="text-sm text-muted-foreground">Apprenez le vrai russe parlé, pas seulement celui des livres.</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <h4 className="font-bold gold-text mb-1">Intelligence Culturelle</h4>
                <p className="text-sm text-muted-foreground">Comprenez quand utiliser chaque ton pour éviter les gaffes.</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ToneTransformation />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(TONE_CONFIG).map(([key, config], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`bg-gradient-to-br ${config.color} rounded-2xl p-6 text-center cursor-pointer`}
            >
              <div className="text-4xl mb-3">{config.emoji}</div>
              <div className="font-bold text-white text-lg">{config.label}</div>
              <div className="text-white/70 text-sm cyrillic">{config.labelRu}</div>
              <div className="text-white/60 text-xs mt-2">{config.description}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Levels Section */}
      <section className="relative z-10 container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-4">
            <span className="gold-text">Niveaux</span> CECR
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            500 leçons structurées pour chaque niveau de compétence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-4">
          {LEVELS.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="bg-card/50 border-border hover:border-primary/50 transition-all duration-300 cursor-pointer h-full backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">{level.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{level.name}</h3>
                  <p className="text-sm text-muted-foreground cyrillic mb-2">{level.nameRu}</p>
                  <p className="text-xs text-primary">{level.lessons} leçons</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />
          <div className="absolute inset-0 backdrop-blur-xl" />
          <div className="relative p-12 lg:p-20 text-center border border-primary/30 rounded-3xl">
            <Crown className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6">
              <span className="gold-text">Prêt à Transformer Votre Apprentissage?</span>
            </h2>
            <p className="text-muted-foreground text-xl mb-8 max-w-2xl mx-auto">
              Rejoignez la révolution. Vivez l'éducation comme jamais auparavant.
            </p>
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl px-12 py-6">
                <Zap className="w-6 h-6 mr-2" />
                Commencez Votre Voyage
                <ChevronRight className="w-6 h-6 ml-2" />
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-primary/20 bg-background/50 backdrop-blur-xl">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold gold-text">Russian Mastery</span>
            </div>
            <div className="text-muted-foreground text-center">
              Créé par{" "}
              <span className="font-bold gold-text">Raoued Fadhel</span>
              {" "}• © 2027 Tous Droits Réservés
            </div>
            <div className="flex items-center gap-4">
              <Languages className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Propulsé par Prize2Pride</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ 
  icon, 
  title, 
  description, 
  gradient, 
  link 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  gradient: string;
  link: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <Link href={link}>
        <Card className="bg-card/50 border-border hover:border-primary/50 transition-all duration-300 cursor-pointer h-full backdrop-blur-sm">
          <CardContent className="p-6">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 text-white`}>
              {icon}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
