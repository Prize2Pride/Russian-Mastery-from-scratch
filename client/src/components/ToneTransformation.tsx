import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Languages, Info, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TONE_CONFIG = {
  dirty: { emoji: "🔥", label: "Vulgaire", color: "text-red-400", border: "border-red-500/30" },
  slang: { emoji: "🗣️", label: "Argot", color: "text-purple-400", border: "border-purple-500/30" },
  informal: { emoji: "💬", label: "Informel", color: "text-blue-400", border: "border-blue-500/30" },
  formal: { emoji: "👔", label: "Formel", color: "text-gray-400", border: "border-gray-500/30" },
  diplomatic: { emoji: "🎩", label: "Diplomatique", color: "text-amber-400", border: "border-amber-500/30" }
};

export function ToneTransformation() {
  const [inputText, setInputText] = useState("");
  const transformMutation = trpc.tone.transform.useMutation();

  const handleTransform = () => {
    if (!inputText.trim()) return;
    transformMutation.mutate({ text: inputText });
  };

  return (
    <Card className="bg-card/50 border-primary/30 backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b border-primary/20 bg-primary/5">
        <CardTitle className="flex items-center gap-2 gold-text">
          <Sparkles className="w-5 h-5" />
          Transformateur de Ton 5-en-1
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Entrez une phrase en français (ex: Je veux manger)"
            className="bg-secondary/30 border-primary/20 focus:border-primary/50"
            onKeyDown={(e) => e.key === 'Enter' && handleTransform()}
          />
          <Button 
            onClick={handleTransform} 
            disabled={transformMutation.isPending || !inputText.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {transformMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Languages className="w-4 h-4 mr-2" />
            )}
            Transformer
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {transformMutation.data ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Tabs defaultValue="informal" className="w-full">
                <TabsList className="grid grid-cols-5 bg-secondary/30 p-1">
                  {Object.entries(TONE_CONFIG).map(([key, config]) => (
                    <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
                      <span className="mr-1 hidden sm:inline">{config.emoji}</span>
                      {config.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(transformMutation.data).map(([key, data]: [string, any]) => (
                  <TabsContent key={key} value={key} className="mt-4">
                    <div className={`p-4 rounded-xl border ${TONE_CONFIG[key as keyof typeof TONE_CONFIG].border} bg-secondary/20`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-2xl font-bold text-foreground cyrillic">
                          {data.russian}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${TONE_CONFIG[key as keyof typeof TONE_CONFIG].color} bg-white/5`}>
                          {key}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-muted-foreground italic">
                          <Volume2 className="w-4 h-4" />
                          {data.phonetic}
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[10px] font-bold text-primary">FR</span>
                          </div>
                          <p className="text-sm">{data.explanation}</p>
                        </div>
                        
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            <strong className="text-primary mr-1">Contexte :</strong>
                            {data.context}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>
          ) : !transformMutation.isPending && (
            <div className="text-center py-12 border-2 border-dashed border-primary/20 rounded-xl">
              <Sparkles className="w-12 h-12 text-primary/20 mx-auto mb-4" />
              <p className="text-muted-foreground">Entrez une phrase pour voir la magie opérer sur les 5 tons</p>
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
