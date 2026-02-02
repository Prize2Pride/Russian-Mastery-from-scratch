import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getLoginUrl } from "@/const";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Crown, 
  ChevronRight, 
  ChevronLeft,
  Clock, 
  Star,
  Volume2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  MessageCircle,
  Lightbulb,
  Globe
} from "lucide-react";
import { Link, useParams } from "wouter";
import { useState } from "react";

// Sample lesson data
const SAMPLE_LESSON = {
  id: 1,
  title: "Приветствия",
  titleFr: "Les Salutations",
  level: "A1",
  category: "basics",
  tone: "informal",
  duration: 15,
  xp: 50,
  description: "Apprenez les salutations de base en russe pour commencer vos conversations.",
  vocabulary: [
    { russian: "Привет", french: "Salut", pronunciation: "Privyet", example: "Привет, как дела?" },
    { russian: "Здравствуйте", french: "Bonjour (formel)", pronunciation: "Zdrastvuytye", example: "Здравствуйте, господин Иванов." },
    { russian: "Доброе утро", french: "Bonjour (matin)", pronunciation: "Dobroye utro", example: "Доброе утро! Как спалось?" },
    { russian: "Добрый день", french: "Bonjour (journée)", pronunciation: "Dobryy den'", example: "Добрый день, рад вас видеть." },
    { russian: "Добрый вечер", french: "Bonsoir", pronunciation: "Dobryy vecher", example: "Добрый вечер, как прошёл день?" },
    { russian: "До свидания", french: "Au revoir", pronunciation: "Da svidaniya", example: "До свидания, до завтра!" },
    { russian: "Пока", french: "Salut (au revoir)", pronunciation: "Paka", example: "Пока! Увидимся!" }
  ],
  grammar: {
    title: "Les Formules de Politesse",
    titleRu: "Формулы вежливости",
    explanation: "En russe, le niveau de formalité est très important. 'Привет' est informel et utilisé entre amis, tandis que 'Здравствуйте' est formel et utilisé avec des inconnus ou dans un contexte professionnel.",
    rules: [
      "Utilisez 'ты' (tu) avec les amis et la famille",
      "Utilisez 'вы' (vous) avec les inconnus et les supérieurs",
      "Le matin jusqu'à midi: Доброе утро",
      "L'après-midi: Добрый день",
      "Le soir: Добрый вечер"
    ]
  },
  dialogue: [
    { speaker: "Анна", text: "Привет, Иван! Как дела?", translation: "Salut Ivan ! Comment ça va ?" },
    { speaker: "Иван", text: "Привет, Анна! Хорошо, спасибо. А у тебя?", translation: "Salut Anna ! Bien, merci. Et toi ?" },
    { speaker: "Анна", text: "Тоже хорошо. Что делаешь сегодня?", translation: "Bien aussi. Qu'est-ce que tu fais aujourd'hui ?" },
    { speaker: "Иван", text: "Иду на работу. До свидания!", translation: "Je vais au travail. Au revoir !" },
    { speaker: "Анна", text: "Пока! Удачи!", translation: "Salut ! Bonne chance !" }
  ],
  culturalNotes: "En Russie, il est courant de serrer la main lors d'une première rencontre. Les Russes peuvent sembler réservés au début, mais ils deviennent très chaleureux une fois qu'ils vous connaissent. Le sourire n'est pas aussi courant qu'en France dans les interactions quotidiennes.",
  exercises: [
    {
      id: 1,
      type: "multiple_choice",
      questionRu: "Comment dit-on 'Bonjour' de manière formelle?",
      questionFr: "Comment dit-on 'Bonjour' de manière formelle?",
      options: ["Привет", "Здравствуйте", "Пока", "Спасибо"],
      correctAnswer: "Здравствуйте",
      explanation: "'Здравствуйте' est la forme formelle de 'Bonjour' en russe."
    },
    {
      id: 2,
      type: "fill_blank",
      questionRu: "Complétez: _____ утро! (Bon matin)",
      questionFr: "Complétez: _____ утро! (Bon matin)",
      correctAnswer: "Доброе",
      explanation: "'Доброе утро' signifie 'Bonjour' le matin."
    },
    {
      id: 3,
      type: "translation",
      questionRu: "Traduisez en français: До свидания",
      questionFr: "Traduisez en français: До свидания",
      correctAnswer: "Au revoir",
      explanation: "'До свидания' est la façon formelle de dire 'Au revoir'."
    },
    {
      id: 4,
      type: "multiple_choice",
      questionRu: "Quelle salutation utilisez-vous le soir?",
      questionFr: "Quelle salutation utilisez-vous le soir?",
      options: ["Доброе утро", "Добрый день", "Добрый вечер", "Привет"],
      correctAnswer: "Добрый вечер",
      explanation: "'Добрый вечер' signifie 'Bonsoir'."
    }
  ]
};

export default function LessonView() {
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const [currentTab, setCurrentTab] = useState("vocabulary");
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  const lesson = SAMPLE_LESSON; // Will be replaced with API call
  const exercise = lesson.exercises[currentExercise];
  const progressPercent = (completedExercises.length / lesson.exercises.length) * 100;

  const checkAnswer = () => {
    const correct = userAnswer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim();
    setIsCorrect(correct);
    setShowResult(true);
    if (correct && !completedExercises.includes(exercise.id)) {
      setCompletedExercises([...completedExercises, exercise.id]);
    }
  };

  const nextExercise = () => {
    if (currentExercise < lesson.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer("");
      setShowResult(false);
    }
  };

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setUserAnswer("");
      setShowResult(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/lessons">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold cyrillic">{lesson.title}</h1>
                <p className="text-sm text-muted-foreground">{lesson.titleFr}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">{lesson.level}</Badge>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                {lesson.duration} min
              </div>
              <div className="flex items-center gap-2 text-sm text-primary">
                <Star className="w-4 h-4" />
                {lesson.xp} XP
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-8">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto">
            <TabsTrigger value="vocabulary">📖 Vocabulaire</TabsTrigger>
            <TabsTrigger value="grammar">✏️ Grammaire</TabsTrigger>
            <TabsTrigger value="dialogue">💬 Dialogue</TabsTrigger>
            <TabsTrigger value="culture">🎭 Culture</TabsTrigger>
            <TabsTrigger value="exercises">📝 Exercices</TabsTrigger>
          </TabsList>

          {/* Vocabulary Tab */}
          <TabsContent value="vocabulary">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Vocabulaire de la Leçon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lesson.vocabulary.map((word, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold cyrillic text-primary">{word.russian}</span>
                            <span className="text-lg text-foreground">{word.french}</span>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Volume2 className="w-5 h-5" />
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          Prononciation: <span className="text-foreground font-mono">{word.pronunciation}</span>
                        </div>
                        <div className="text-sm italic text-muted-foreground">
                          Exemple: <span className="cyrillic text-foreground">{word.example}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Grammar Tab */}
          <TabsContent value="grammar">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    {lesson.grammar.title}
                    <span className="text-muted-foreground cyrillic">({lesson.grammar.titleRu})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg leading-relaxed">{lesson.grammar.explanation}</p>
                  
                  <div className="space-y-3">
                    <h4 className="font-bold text-primary">Règles importantes:</h4>
                    {lesson.grammar.rules.map((rule, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20"
                      >
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                        <span>{rule}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Dialogue Tab */}
          <TabsContent value="dialogue">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Dialogue Pratique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lesson.dialogue.map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className={`p-4 rounded-xl ${index % 2 === 0 ? 'bg-primary/10 ml-0 mr-12' : 'bg-secondary/30 ml-12 mr-0'}`}
                      >
                        <div className="font-bold text-primary mb-1">{line.speaker}</div>
                        <div className="text-lg cyrillic mb-2">{line.text}</div>
                        <div className="text-sm text-muted-foreground italic">{line.translation}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Culture Tab */}
          <TabsContent value="culture">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Notes Culturelles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">{lesson.culturalNotes}</p>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Exercises Tab */}
          <TabsContent value="exercises">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progrès des exercices</span>
                  <span className="text-primary font-bold">{completedExercises.length}/{lesson.exercises.length}</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>

              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Exercice {currentExercise + 1} / {lesson.exercises.length}</CardTitle>
                    <Badge variant="outline">
                      {exercise.type === 'multiple_choice' && 'Choix Multiple'}
                      {exercise.type === 'fill_blank' && 'Compléter'}
                      {exercise.type === 'translation' && 'Traduction'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-xl">{exercise.questionFr}</p>

                  {exercise.type === 'multiple_choice' && (
                    <RadioGroup value={userAnswer} onValueChange={setUserAnswer}>
                      <div className="space-y-3">
                        {exercise.options?.map((option, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                            <RadioGroupItem value={option} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer cyrillic text-lg">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}

                  {(exercise.type === 'fill_blank' || exercise.type === 'translation') && (
                    <Input
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Votre réponse..."
                      className="text-lg"
                    />
                  )}

                  <AnimatePresence>
                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl ${isCorrect ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {isCorrect ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="font-bold text-green-500">Correct!</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-red-500" />
                              <span className="font-bold text-red-500">Incorrect</span>
                            </>
                          )}
                        </div>
                        <p className="text-muted-foreground">{exercise.explanation}</p>
                        {!isCorrect && (
                          <p className="mt-2">
                            Réponse correcte: <span className="font-bold text-primary cyrillic">{exercise.correctAnswer}</span>
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={prevExercise}
                      disabled={currentExercise === 0}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Précédent
                    </Button>

                    {!showResult ? (
                      <Button
                        onClick={checkAnswer}
                        disabled={!userAnswer}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Vérifier
                      </Button>
                    ) : (
                      <Button
                        onClick={nextExercise}
                        disabled={currentExercise === lesson.exercises.length - 1}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Suivant
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {completedExercises.length === lesson.exercises.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 text-center"
                >
                  <Card className="bg-primary/20 border-primary/50">
                    <CardContent className="py-8">
                      <Crown className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Félicitations!</h3>
                      <p className="text-muted-foreground mb-4">Vous avez terminé tous les exercices de cette leçon.</p>
                      <div className="flex items-center justify-center gap-2 text-primary text-xl">
                        <Star className="w-6 h-6" />
                        <span className="font-bold">+{lesson.xp} XP</span>
                      </div>
                      <div className="mt-6">
                        <Link href="/lessons">
                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Continuer les Leçons
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
