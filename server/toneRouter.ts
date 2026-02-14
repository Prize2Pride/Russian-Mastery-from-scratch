import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

const TONE_LEVELS = ["dirty", "slang", "informal", "formal", "diplomatic"] as const;
const GENRES = ["standard", "comedy", "dramatic", "horror"] as const;

export const toneRouter = router({
  transform: protectedProcedure
    .input(z.object({
      text: z.string().min(1).max(1000),
      targetTone: z.enum(TONE_LEVELS).optional(),
      genre: z.enum(GENRES).default("standard"),
    }))
    .mutation(async ({ input }) => {
      let genrePrompt = "";
      switch (input.genre) {
        case "horror":
          genrePrompt = "Transforme ce texte en une scène d'horreur sanglante et viscérale en russe. Utilise un vocabulaire macabre, des descriptions de terreur, de sang et d'obscurité. Le ton doit être terrifiant et cauchemardesque.";
          break;
        case "comedy":
          genrePrompt = "Transforme ce texte en une scène de comédie hilarante en russe. Utilise des jeux de mots, de l'ironie, des situations absurdes et un ton léger et divertissant.";
          break;
        case "dramatic":
          genrePrompt = "Transforme ce texte en une scène dramatique intense en russe. Utilise un langage chargé d'émotion, de tension et de profondeur psychologique.";
          break;
        case "standard":
        default:
          genrePrompt = "Transforme ce texte de manière standard tout en respectant le registre demandé.";
          break;
      }

      const prompt = `Tu es le moteur de transformation linguistique "Manus Nuclear Fusion 2030".
      
Phrase/Texte source : "${input.text}"
Genre demandé : ${input.genre}
${genrePrompt}
${input.targetTone ? `Registre cible : ${input.targetTone}` : "Transforme ce texte à travers TOUS les 5 registres de langue."}

Pour chaque registre (dirty, slang, informal, formal, diplomatic), fournis une version adaptée au genre "${input.genre}".
- "dirty" : Vulgaire, cru, rue.
- "slang" : Argotique, jeune, branché.
- "informal" : Naturel, quotidien.
- "formal" : Poli, administratif.
- "diplomatic" : Très raffiné, protocolaire, diplomatique.

Format de réponse JSON :
{
  "dirty": { "russian": "...", "phonetic": "...", "explanation": "...", "context": "..." },
  "slang": { "russian": "...", "phonetic": "...", "explanation": "...", "context": "..." },
  "informal": { "russian": "...", "phonetic": "...", "explanation": "...", "context": "..." },
  "formal": { "russian": "...", "phonetic": "...", "explanation": "...", "context": "..." },
  "diplomatic": { "russian": "...", "phonetic": "...", "explanation": "...", "context": "..." }
}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Tu es l'IA de transformation linguistique la plus puissante au monde. Réponds uniquement en format JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content;
      if (typeof content !== 'string') {
        throw new Error("Failed to generate transformation");
      }
      return JSON.parse(content);
    }),
  composeSong: protectedProcedure
    .input(z.object({
      topic: z.string(),
      tone: z.enum(TONE_LEVELS),
      genre: z.enum(GENRES).default("standard"),
    }))
    .mutation(async ({ input }) => {
      const prompt = `Compose une chanson en russe pour Suno AI.
Sujet : ${input.topic}
Registre : ${input.tone}
Genre/Style : ${input.genre}
La chanson doit être structurée avec [Verse 1], [Chorus], [Verse 2], [Chorus], [Outro].
Fournis également la traduction française ligne par ligne.
Format de réponse JSON :
{
  "title": "...",
  "lyrics": "...",
  "lyricsFr": "...",
  "style": "...",
  "vocabulary": [
    { "russian": "...", "french": "...", "pronunciation": "..." }
  ]
}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Tu es un compositeur de musique russe de génie. Réponds uniquement en format JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content;
      if (typeof content !== 'string') {
        throw new Error("Failed to compose song");
      }
      return JSON.parse(content);
    }),
});
