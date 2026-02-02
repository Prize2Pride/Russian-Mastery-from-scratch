import { eq, and, desc, sql, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  lessons, InsertLesson, Lesson,
  userProgress, InsertUserProgress,
  exercises, InsertExercise,
  exerciseResults, InsertExerciseResult,
  chatSessions, InsertChatSession,
  chatMessages, InsertChatMessage,
  generatedSongs, InsertGeneratedSong,
  achievements, userAchievements
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================
// USER FUNCTIONS
// ============================================
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserPreferences(userId: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set(data).where(eq(users.id, userId));
}

export async function updateUserProgress(userId: number, xpGained: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set({
    totalXp: sql`${users.totalXp} + ${xpGained}`,
    totalLessonsCompleted: sql`${users.totalLessonsCompleted} + 1`,
    lastActivityDate: new Date()
  }).where(eq(users.id, userId));
}

// ============================================
// LESSONS FUNCTIONS
// ============================================
export async function getLessons(level?: string, category?: string, tone?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(lessons).where(eq(lessons.isActive, true));
  
  const conditions = [eq(lessons.isActive, true)];
  if (level) conditions.push(eq(lessons.level, level as any));
  if (category) conditions.push(eq(lessons.category, category));
  if (tone) conditions.push(eq(lessons.tone, tone as any));

  return await db.select().from(lessons).where(and(...conditions)).orderBy(lessons.lessonNumber);
}

export async function getLesson(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
  return result[0] || null;
}

export async function createLesson(data: InsertLesson) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(lessons).values(data);
  return { id: result[0].insertId, ...data };
}

export async function bulkCreateLessons(lessonsData: InsertLesson[]) {
  const db = await getDb();
  if (!db) return [];

  await db.insert(lessons).values(lessonsData);
  return lessonsData;
}

export async function getLessonsByLevel(level: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(lessons)
    .where(and(eq(lessons.level, level as any), eq(lessons.isActive, true)))
    .orderBy(lessons.lessonNumber);
}

export async function getLessonCategories() {
  const db = await getDb();
  if (!db) return [];

  const result = await db.selectDistinct({ category: lessons.category }).from(lessons);
  return result.map(r => r.category);
}

// ============================================
// USER PROGRESS FUNCTIONS
// ============================================
export async function getUserLessonProgress(userId: number, lessonId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
    .limit(1);
  return result[0] || null;
}

export async function updateLessonProgress(data: InsertUserProgress) {
  const db = await getDb();
  if (!db) return null;

  const existing = await getUserLessonProgress(data.userId, data.lessonId);
  
  if (existing) {
    await db.update(userProgress).set({
      status: data.status,
      score: data.score,
      timeSpentMinutes: sql`${userProgress.timeSpentMinutes} + ${data.timeSpentMinutes || 0}`,
      completedAt: data.status === 'completed' ? new Date() : undefined
    }).where(eq(userProgress.id, existing.id));
    return { ...existing, ...data };
  } else {
    const result = await db.insert(userProgress).values(data);
    return { id: result[0].insertId, ...data };
  }
}

export async function getUserCompletedLessons(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.status, 'completed')));
}

// ============================================
// EXERCISES FUNCTIONS
// ============================================
export async function getExercisesByLesson(lessonId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(exercises).where(eq(exercises.lessonId, lessonId));
}

export async function createExercise(data: InsertExercise) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(exercises).values(data);
  return { id: result[0].insertId, ...data };
}

export async function bulkCreateExercises(exercisesData: InsertExercise[]) {
  const db = await getDb();
  if (!db) return [];

  await db.insert(exercises).values(exercisesData);
  return exercisesData;
}

export async function saveExerciseResult(data: InsertExerciseResult) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(exerciseResults).values(data);
  return { id: result[0].insertId, ...data };
}

// ============================================
// CHAT FUNCTIONS
// ============================================
export async function createChatSession(data: InsertChatSession) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(chatSessions).values(data);
  return { id: result[0].insertId, ...data };
}

export async function getChatSession(sessionId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(chatSessions).where(eq(chatSessions.id, sessionId)).limit(1);
  return result[0] || null;
}

export async function getUserChatSessions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(chatSessions)
    .where(eq(chatSessions.userId, userId))
    .orderBy(desc(chatSessions.updatedAt));
}

export async function addChatMessage(data: InsertChatMessage) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(chatMessages).values(data);
  
  // Update session message count
  await db.update(chatSessions).set({
    messagesCount: sql`${chatSessions.messagesCount} + 1`
  }).where(eq(chatSessions.id, data.sessionId));

  return { id: result[0].insertId, ...data };
}

export async function getChatMessages(sessionId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(chatMessages.createdAt);
}

// ============================================
// SONG GENERATION FUNCTIONS
// ============================================
export async function createGeneratedSong(data: InsertGeneratedSong) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(generatedSongs).values(data);
  return { id: result[0].insertId, ...data };
}

export async function getUserSongs(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(generatedSongs)
    .where(eq(generatedSongs.userId, userId))
    .orderBy(desc(generatedSongs.createdAt));
}

export async function updateSongStatus(songId: number, status: string, audioUrl?: string) {
  const db = await getDb();
  if (!db) return;

  const updateData: any = { status };
  if (audioUrl) updateData.audioUrl = audioUrl;

  await db.update(generatedSongs).set(updateData).where(eq(generatedSongs.id, songId));
}

export async function getUserDailySongCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await db.select({ count: sql<number>`count(*)` })
    .from(generatedSongs)
    .where(and(
      eq(generatedSongs.userId, userId),
      gte(generatedSongs.createdAt, today)
    ));

  return result[0]?.count || 0;
}

// ============================================
// ACHIEVEMENTS FUNCTIONS
// ============================================
export async function getAchievements() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(achievements);
}

export async function getUserAchievements(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select({
    achievement: achievements,
    unlockedAt: userAchievements.unlockedAt
  })
    .from(userAchievements)
    .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
    .where(eq(userAchievements.userId, userId));
}

export async function unlockAchievement(userId: number, achievementId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(userAchievements).values({ userId, achievementId });
  return { id: result[0].insertId, userId, achievementId };
}

// ============================================
// STATISTICS FUNCTIONS
// ============================================
export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user[0]) return null;

  const completedLessons = await db.select({ count: sql<number>`count(*)` })
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.status, 'completed')));

  const songsGenerated = await db.select({ count: sql<number>`count(*)` })
    .from(generatedSongs)
    .where(eq(generatedSongs.userId, userId));

  return {
    user: user[0],
    lessonsCompleted: completedLessons[0]?.count || 0,
    songsGenerated: songsGenerated[0]?.count || 0
  };
}
