import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

const TONE_LEVELS = ["dirty", "slang", "informal", "formal", "diplomatic"] as const;

export const toneRouter = router({
  transform: protectedProcedure
    .input(z.object({
      text: z.string().min(1).max(500),
    }))
    .mutation(async ({ input }) => {
      const prompt = `Transformez la phrase suivante en russe à travers les 5 registres de langue : "dirty" (vulgaire), "slang" (argot), "informal" (informel), "formal" (formel), et "diplomatic" (diplomatique).
      
Phrase à transformer : "${input.text}"

Pour chaque registre, fournissez :
1. Le texte en cyrillique
2. La prononciation phonétique
3. Une explication en français
4. Le contexte culturel (quand l'utiliser ou non)

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
          { role: "system", content: "Tu es un expert en linguistique russe spécialisé dans les registres de langue. Réponds uniquement en format JSON." },
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
});
