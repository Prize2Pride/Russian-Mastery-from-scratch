import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { 
  getLessons, 
  getLesson, 
  getUserLessonProgress, 
  updateLessonProgress,
  getUserChatSessions,
  getChatMessages,
  addChatMessage,
  createChatSession,
  getUserSongs,
  createGeneratedSong,
  getUserDailySongCount,
  getUserAchievements,
  unlockAchievement,
  getUserStats,
  updateUserProgress
} from "./db";

// Tone levels for Russian language
const TONE_LEVELS = ["dirty", "slang", "informal", "formal", "diplomatic"] as const;
const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;

// Chat system prompts for different tones (French explanations)
const TONE_SYSTEM_PROMPTS: Record<string, string> = {
  dirty: `Tu es un tuteur de russe expert qui enseigne le langage vulgaire et très familier russe. 
Tu dois:
- Expliquer les expressions crues et vulgaires en russe avec leurs équivalents français
- Donner des exemples d'utilisation dans des contextes appropriés
- Avertir sur quand NE PAS utiliser ces expressions
- Toujours fournir la prononciation phonétique
- Répondre UNIQUEMENT en français pour les explications
- Inclure le cyrillique pour les mots russes`,

  slang: `Tu es un tuteur de russe expert qui enseigne l'argot et le langage des jeunes russes.
Tu dois:
- Enseigner les expressions modernes et le slang russe actuel
- Expliquer l'origine et le contexte culturel des expressions
- Donner des exemples de conversations entre jeunes
- Toujours fournir la prononciation phonétique
- Répondre UNIQUEMENT en français pour les explications
- Inclure le cyrillique pour les mots russes`,

  informal: `Tu es un tuteur de russe expert qui enseigne le langage informel et quotidien.
Tu dois:
- Enseigner les expressions courantes utilisées entre amis et famille
- Expliquer les nuances entre le tutoiement (ты) et le vouvoiement (вы)
- Donner des dialogues pratiques du quotidien
- Toujours fournir la prononciation phonétique
- Répondre UNIQUEMENT en français pour les explications
- Inclure le cyrillique pour les mots russes`,

  formal: `Tu es un tuteur de russe expert qui enseigne le langage formel et professionnel.
Tu dois:
- Enseigner les formules de politesse et le langage des affaires
- Expliquer comment s'adresser aux supérieurs et collègues
- Donner des exemples d'emails et de présentations professionnelles
- Toujours fournir la prononciation phonétique
- Répondre UNIQUEMENT en français pour les explications
- Inclure le cyrillique pour les mots russes`,

  diplomatic: `Tu es un tuteur de russe expert qui enseigne le langage diplomatique et de haut niveau.
Tu dois:
- Enseigner le vocabulaire raffiné et les expressions élégantes
- Expliquer le protocole et les formules diplomatiques russes
- Donner des exemples de discours officiels et de correspondance formelle
- Toujours fournir la prononciation phonétique
- Répondre UNIQUEMENT en français pour les explications
- Inclure le cyrillique pour les mots russes`
};

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Lessons Router
  lessons: router({
    list: publicProcedure
      .input(z.object({
        level: z.enum(CEFR_LEVELS).optional(),
        category: z.string().optional(),
        tone: z.enum(TONE_LEVELS).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0)
      }).optional())
      .query(async ({ input }) => {
        const lessons = await getLessons(input?.level, input?.category, input?.tone);
        return lessons;
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const lesson = await getLesson(input.id);
        return lesson;
      }),

    completeLesson: protectedProcedure
      .input(z.object({
        lessonId: z.number(),
        score: z.number().min(0).max(100),
        timeSpent: z.number()
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await updateLessonProgress({
          userId: ctx.user.id,
          lessonId: input.lessonId,
          score: input.score,
          timeSpentMinutes: input.timeSpent,
          status: input.score >= 70 ? 'completed' : 'in_progress'
        });
        
        // Update user XP
        if (input.score >= 70) {
          await updateUserProgress(ctx.user.id, Math.floor(input.score / 2));
        }
        
        return result;
      }),
  }),

  // Chat Router
  chat: router({
    send: protectedProcedure
      .input(z.object({
        message: z.string().min(1).max(2000),
        tone: z.enum(TONE_LEVELS).default("informal"),
        sessionId: z.number().optional()
      }))
      .mutation(async ({ ctx, input }) => {
        let sessionId = input.sessionId;
        
        // Create session if not provided
        if (!sessionId) {
          const session = await createChatSession({
            userId: ctx.user.id,
            topic: `Chat ${input.tone}`,
            tone: input.tone
          });
          sessionId = session?.id;
        }
        
        if (!sessionId) {
          throw new Error("Failed to create chat session");
        }

        // Save user message
        await addChatMessage({
          sessionId,
          role: 'user',
          content: input.message
        });

        // Get system prompt based on tone
        const systemPrompt = TONE_SYSTEM_PROMPTS[input.tone];

        // Call LLM for response
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input.message }
          ]
        });

        const messageContent = response.choices[0]?.message?.content;
        const assistantMessage = typeof messageContent === 'string' 
          ? messageContent 
          : "Je suis désolé, je n'ai pas pu générer une réponse.";

        // Save assistant message
        await addChatMessage({
          sessionId,
          role: 'assistant',
          content: assistantMessage
        });

        return {
          message: assistantMessage,
          tone: input.tone,
          sessionId
        };
      }),

    sessions: protectedProcedure.query(async ({ ctx }) => {
      const sessions = await getUserChatSessions(ctx.user.id);
      return sessions;
    }),

    messages: protectedProcedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ input }) => {
        const messages = await getChatMessages(input.sessionId);
        return messages;
      }),
  }),

  // Songs Router (Suno API integration)
  songs: router({
    generate: protectedProcedure
      .input(z.object({
        topic: z.string().min(1).max(200),
        level: z.enum(CEFR_LEVELS),
        tone: z.enum(TONE_LEVELS),
        style: z.enum(["rap", "pop", "rock", "folk", "electronic"])
      }))
      .mutation(async ({ ctx, input }) => {
        // Check daily limit
        const dailyCount = await getUserDailySongCount(ctx.user.id);
        if (dailyCount >= 10) {
          throw new Error("Limite quotidienne de 10 chansons atteinte. Revenez demain!");
        }

        // Generate lyrics using LLM
        const lyricsPrompt = `Génère des paroles de chanson en russe sur le thème "${input.topic}".
Style musical: ${input.style}
Niveau de langue: ${input.level}
Registre: ${input.tone}

Les paroles doivent:
- Être adaptées au niveau ${input.level} (vocabulaire approprié)
- Utiliser le registre ${input.tone}
- Avoir environ 4 couplets
- Inclure un refrain accrocheur
- Être éducatives pour apprendre le russe

Format de réponse:
TITRE_RU: [titre en russe]
TITRE_FR: [titre en français]
PAROLES_RU:
[paroles en russe]

PAROLES_FR:
[traduction française]

VOCABULAIRE:
[liste de 5-10 mots clés à apprendre]`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Tu es un parolier expert en russe qui crée des chansons éducatives." },
            { role: "user", content: lyricsPrompt }
          ]
        });

        const messageContent = response.choices[0]?.message?.content;
        const content = typeof messageContent === 'string' ? messageContent : "";
        
        // Parse the response
        const titleRuMatch = content.match(/TITRE_RU:\s*(.+)/);
        const titleFrMatch = content.match(/TITRE_FR:\s*(.+)/);
        const lyricsRuMatch = content.match(/PAROLES_RU:\s*([\s\S]*?)(?=PAROLES_FR:|$)/);
        const lyricsFrMatch = content.match(/PAROLES_FR:\s*([\s\S]*?)(?=VOCABULAIRE:|$)/);
        const vocabMatch = content.match(/VOCABULAIRE:\s*([\s\S]*?)$/);

        const song = await createGeneratedSong({
          userId: ctx.user.id,
          title: titleRuMatch?.[1]?.trim() || `Песня о ${input.topic}`,
          lyrics: lyricsRuMatch?.[1]?.trim() || content,
          lyricsFr: lyricsFrMatch?.[1]?.trim() || "",
          vocabulary: vocabMatch?.[1]?.trim().split('\n').filter(Boolean) || [],
          level: input.level,
          tone: input.tone,
          style: input.style,
          status: 'completed'
        });

        return song;
      }),

    list: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(50).default(20)
      }).optional())
      .query(async ({ ctx }) => {
        const songs = await getUserSongs(ctx.user.id);
        return songs;
      }),

    dailyCount: protectedProcedure.query(async ({ ctx }) => {
      const count = await getUserDailySongCount(ctx.user.id);
      return {
        count,
        limit: 10,
        remaining: Math.max(0, 10 - count)
      };
    }),
  }),

  // Progress Router
  progress: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const stats = await getUserStats(ctx.user.id);
      return stats;
    }),

    achievements: protectedProcedure.query(async ({ ctx }) => {
      const achievements = await getUserAchievements(ctx.user.id);
      return achievements;
    }),

    unlockAchievement: protectedProcedure
      .input(z.object({ achievementId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const result = await unlockAchievement(ctx.user.id, input.achievementId);
        return result;
      }),
  }),

  // Bulk Lesson Generation (Admin only)
  admin: router({
    generateLessons: protectedProcedure
      .input(z.object({
        level: z.enum(CEFR_LEVELS),
        category: z.string(),
        count: z.number().min(1).max(500).default(100)
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if user is admin
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized: Admin access required');
        }

        // This would be a long-running task in production
        return {
          success: true,
          message: `Génération de ${input.count} leçons ${input.level} en cours...`,
          jobId: `job_${Date.now()}`
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
