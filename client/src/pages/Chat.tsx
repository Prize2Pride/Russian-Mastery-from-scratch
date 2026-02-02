import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { Streamdown } from "streamdown";
import { 
  Crown, 
  Send, 
  Loader2, 
  Sparkles,
  ArrowLeft,
  MessageCircle,
  Volume2,
  BookOpen,
  Lightbulb
} from "lucide-react";
import { Link } from "wouter";
import { useState, useRef, useEffect, useCallback } from "react";

// Tone configuration with French labels
const TONE_CONFIG = {
  dirty: { 
    emoji: "🔥", 
    label: "Vulgaire", 
    labelRu: "Грязный",
    color: "text-red-400",
    bgColor: "bg-red-500/20 border-red-500/30",
    description: "Langage très familier, expressions crues",
    systemPrompt: "Tu es un tuteur de russe qui enseigne le langage vulgaire et très familier. Utilise des expressions crues et de l'argot de rue. Explique tout en français."
  },
  slang: { 
    emoji: "🗣️", 
    label: "Argot", 
    labelRu: "Сленг",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20 border-purple-500/30",
    description: "Expressions de rue, langage des jeunes",
    systemPrompt: "Tu es un tuteur de russe qui enseigne l'argot et le langage des jeunes. Utilise des expressions modernes et du slang. Explique tout en français."
  },
  informal: { 
    emoji: "💬", 
    label: "Informel", 
    labelRu: "Неформальный",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20 border-blue-500/30",
    description: "Conversation décontractée entre amis",
    systemPrompt: "Tu es un tuteur de russe qui enseigne le langage informel et décontracté. Utilise un ton amical et des expressions courantes. Explique tout en français."
  },
  formal: { 
    emoji: "👔", 
    label: "Formel", 
    labelRu: "Формальный",
    color: "text-gray-400",
    bgColor: "bg-gray-500/20 border-gray-500/30",
    description: "Langage professionnel et respectueux",
    systemPrompt: "Tu es un tuteur de russe qui enseigne le langage formel et professionnel. Utilise un ton respectueux et des formules de politesse. Explique tout en français."
  },
  diplomatic: { 
    emoji: "🎩", 
    label: "Diplomatique", 
    labelRu: "Дипломатический",
    color: "text-amber-400",
    bgColor: "bg-amber-500/20 border-amber-500/30",
    description: "Haut niveau, langage raffiné et élégant",
    systemPrompt: "Tu es un tuteur de russe qui enseigne le langage diplomatique et de haut niveau. Utilise un vocabulaire raffiné et des expressions élégantes. Explique tout en français."
  }
};

type ToneLevel = keyof typeof TONE_CONFIG;

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tone?: ToneLevel;
  timestamp: Date;
}

// Quick responses in French
const QUICK_RESPONSES: Record<ToneLevel, string[]> = {
  dirty: [
    "Apprends-moi des gros mots russes 🔥",
    "Comment insulter quelqu'un poliment?",
    "Les expressions vulgaires courantes",
    "Le langage de la rue en Russie"
  ],
  slang: [
    "C'est quoi le slang des jeunes russes?",
    "Les expressions TikTok en russe",
    "Comment parler comme un ado russe?",
    "Les mots à la mode en Russie"
  ],
  informal: [
    "Comment saluer un ami en russe?",
    "Les expressions du quotidien",
    "Parler de la météo en russe",
    "Commander au restaurant"
  ],
  formal: [
    "Comment écrire un email professionnel?",
    "Les formules de politesse au travail",
    "Se présenter dans un contexte formel",
    "Vocabulaire des réunions"
  ],
  diplomatic: [
    "Le protocole diplomatique russe",
    "Expressions pour les négociations",
    "Langage des relations internationales",
    "Formules de courtoisie élégantes"
  ]
};

export default function Chat() {
  const { user, isAuthenticated } = useAuth();
  const [selectedTone, setSelectedTone] = useState<ToneLevel>('informal');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Use a ref for the messages container - native div for proper scrolling
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom function - smooth and reliable
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, scrollToBottom]);

  // Also scroll when loading state changes
  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading, scrollToBottom]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputMessage,
      tone: selectedTone,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response (will be replaced with actual API call)
    setTimeout(() => {
      const responses: Record<ToneLevel, string> = {
        dirty: `**Réponse en mode vulgaire** 🔥\n\nD'accord, tu veux apprendre le russe de la rue! Voici quelques expressions:\n\n- **Блин** (Blin) - Merde! (version soft)\n- **Чёрт** (Chyort) - Putain!\n- **Фигня** (Fignya) - Conneries\n\n*⚠️ Note: Utilise ces expressions avec précaution! Ne les utilise jamais dans un contexte formel.*\n\n**Prononciation:**\n- Блин: "bleen"\n- Чёрт: "chyort"\n\nTu veux en apprendre d'autres? 😈`,
        slang: `**Réponse en mode argot** 🗣️\n\nYo! Voici du slang russe moderne:\n\n- **Круто** (Kruto) - Trop cool!\n- **Чувак** (Chuvak) - Mec, gars\n- **Тусить** (Tusit') - Faire la fête\n- **Кайф** (Kayf) - Le pied, génial\n- **Чё?** (Cho?) - Quoi? (très familier)\n\n**Exemple de conversation:**\n> — Чувак, пойдём тусить?\n> — Круто! Кайф!\n\n*Les jeunes russes utilisent beaucoup ces mots!*`,
        informal: `**Réponse en mode informel** 💬\n\nSalut! Voici comment on parle entre amis en russe:\n\n- **Привет!** (Privet!) - Salut!\n- **Как дела?** (Kak dela?) - Comment ça va?\n- **Всё хорошо** (Vsyo khorosho) - Tout va bien\n- **Пока!** (Poka!) - Salut! (au revoir)\n- **Давай!** (Davay!) - Allez! / OK!\n\n**Mini-dialogue:**\n> — Привет! Как дела?\n> — Привет! Всё хорошо, а у тебя?\n> — Тоже хорошо!\n\n*C'est le niveau de langue le plus courant au quotidien.*`,
        formal: `**Réponse en mode formel** 👔\n\nBonjour. Voici les expressions formelles en russe:\n\n- **Здравствуйте** (Zdravstvuyte) - Bonjour (formel)\n- **Благодарю вас** (Blagodaryu vas) - Je vous remercie\n- **С уважением** (S uvazheniyem) - Cordialement\n- **Извините** (Izvinite) - Excusez-moi\n- **Пожалуйста** (Pozhaluysta) - S'il vous plaît\n\n**Pour un email professionnel:**\n> Уважаемый Иван Иванович,\n> Благодарю вас за ваше письмо...\n> С уважением,\n> [Votre nom]\n\n*Utilisez ces expressions dans un contexte professionnel.*`,
        diplomatic: `**Réponse en mode diplomatique** 🎩\n\nExcellente question. Voici le langage diplomatique russe:\n\n- **Имею честь** (Imeyu chest') - J'ai l'honneur de...\n- **Позвольте выразить** (Pozvol'te vyrazit') - Permettez-moi d'exprimer...\n- **С глубоким уважением** (S glubokim uvazheniyem) - Avec le plus profond respect\n- **Ваше превосходительство** (Vashe prevoskhoditel'stvo) - Votre Excellence\n- **Соблаговолите принять** (Soblagovolite prinyat') - Veuillez agréer\n\n**Formule de clôture diplomatique:**\n> Примите, Ваше Превосходительство, уверения в моём глубочайшем уважении.\n\n*Ce niveau de langue est utilisé dans les cercles diplomatiques et officiels.*`
      };

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: responses[selectedTone],
        tone: selectedTone,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickResponse = (response: string) => {
    setInputMessage(response);
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Navigation - Fixed at top */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50 flex-shrink-0">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-primary" />
                <span className="text-xl font-serif font-bold gold-text">Chat Tuteur Russe</span>
              </div>
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
      </nav>

      {/* Main Content - Flex grow */}
      <div className="flex-1 container py-4 flex flex-col min-h-0 overflow-hidden">
        {/* Tone Selector - Fixed height */}
        <div className="mb-4 flex-shrink-0">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Sélectionnez le registre de langue:</h3>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TONE_CONFIG) as ToneLevel[]).map((tone) => {
              const config = TONE_CONFIG[tone];
              return (
                <motion.button
                  key={tone}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTone(tone)}
                  className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
                    selectedTone === tone
                      ? config.bgColor + ' ' + config.color
                      : 'bg-secondary/30 border-border hover:border-primary/50 text-muted-foreground'
                  }`}
                >
                  <span className="text-lg">{config.emoji}</span>
                  <span className="font-medium">{config.label}</span>
                </motion.button>
              );
            })}
          </div>
          <p className="text-muted-foreground text-sm mt-2">
            Mode actuel: <span className={TONE_CONFIG[selectedTone].color}>{TONE_CONFIG[selectedTone].description}</span>
          </p>
        </div>

        {/* Chat Area - Flex grow with overflow */}
        <Card className="flex-1 bg-card/50 border-border flex flex-col min-h-0 overflow-hidden">
          <CardHeader className="border-b border-border py-3 flex-shrink-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">{TONE_CONFIG[selectedTone].emoji}</span>
              <span className={TONE_CONFIG[selectedTone].color}>Mode {TONE_CONFIG[selectedTone].label}</span>
              <span className="text-muted-foreground cyrillic">({TONE_CONFIG[selectedTone].labelRu})</span>
            </CardTitle>
          </CardHeader>
          
          {/* Messages Container - FIXED: Native scrolling with overflow-y-auto */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden p-4"
            style={{ 
              overscrollBehavior: 'contain',
              scrollBehavior: 'smooth'
            }}
          >
            <div className="space-y-4 min-h-full">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Commencez une conversation en mode {TONE_CONFIG[selectedTone].label}</p>
                  <p className="text-muted-foreground/70 text-sm mt-2">
                    L'IA adaptera ses réponses au niveau de langue sélectionné
                  </p>
                  
                  {/* Quick Responses */}
                  <div className="mt-8">
                    <p className="text-sm text-muted-foreground mb-4">Suggestions rapides:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {QUICK_RESPONSES[selectedTone].map((response, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickResponse(response)}
                          className="text-sm"
                        >
                          {response}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary/20 border border-primary/30 text-foreground'
                          : 'bg-secondary/50 border border-border text-foreground'
                      }`}>
                        {message.role === 'assistant' ? (
                          <div className="prose prose-invert prose-sm max-w-none">
                            <Streamdown>{message.content}</Streamdown>
                          </div>
                        ) : (
                          <p>{message.content}</p>
                        )}
                        {message.tone && (
                          <span className={`text-xs ${TONE_CONFIG[message.tone].color} mt-2 block`}>
                            {TONE_CONFIG[message.tone].emoji} {TONE_CONFIG[message.tone].label}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-secondary/50 border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-muted-foreground">Réflexion en cours...</span>
                  </div>
                </motion.div>
              )}
              
              {/* Scroll anchor - this is what we scroll to */}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="border-t border-border p-4 flex-shrink-0">
            <div className="flex gap-3">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Posez votre question en mode ${TONE_CONFIG[selectedTone].label}...`}
                className="flex-1 bg-secondary/30 border-border text-foreground placeholder:text-muted-foreground resize-none min-h-[60px] max-h-[120px]"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 self-end"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
