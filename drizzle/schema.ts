import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

// ============================================
// USERS TABLE
// ============================================
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Learning preferences
  currentLevel: mysqlEnum("currentLevel", ["A1", "A2", "B1", "B2", "C1"]).default("A1"),
  preferredTone: mysqlEnum("preferredTone", ["dirty", "slang", "informal", "formal", "diplomatic"]).default("informal"),
  dailySongsUsed: int("dailySongsUsed").default(0),
  lastSongResetDate: timestamp("lastSongResetDate"),
  totalLessonsCompleted: int("totalLessonsCompleted").default(0),
  totalXp: int("totalXp").default(0),
  streak: int("streak").default(0),
  lastActivityDate: timestamp("lastActivityDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// LESSONS TABLE
// ============================================
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  titleFr: varchar("titleFr", { length: 255 }).notNull(), // French title
  description: text("description"),
  descriptionFr: text("descriptionFr"), // French description
  level: mysqlEnum("level", ["A1", "A2", "B1", "B2", "C1"]).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  tone: mysqlEnum("tone", ["dirty", "slang", "informal", "formal", "diplomatic"]).default("informal"),
  lessonNumber: int("lessonNumber").notNull(),
  // Content
  vocabulary: json("vocabulary"), // Array of {russian, french, pronunciation, example}
  grammar: json("grammar"), // Grammar rules and explanations
  dialogue: json("dialogue"), // Dialogue lines with translations
  culturalNotes: text("culturalNotes"),
  culturalNotesFr: text("culturalNotesFr"),
  pronunciationGuide: json("pronunciationGuide"),
  // Metadata
  estimatedMinutes: int("estimatedMinutes").default(15),
  xpReward: int("xpReward").default(50),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

// ============================================
// USER PROGRESS TABLE
// ============================================
export const userProgress = mysqlTable("userProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lessonId: int("lessonId").notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed"]).default("not_started"),
  score: int("score").default(0),
  timeSpentMinutes: int("timeSpentMinutes").default(0),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

// ============================================
// EXERCISES TABLE
// ============================================
export const exercises = mysqlTable("exercises", {
  id: int("id").autoincrement().primaryKey(),
  lessonId: int("lessonId").notNull(),
  type: mysqlEnum("type", ["fill_blank", "multiple_choice", "translation", "listening", "speaking", "matching"]).notNull(),
  questionRu: text("questionRu").notNull(),
  questionFr: text("questionFr").notNull(),
  options: json("options"), // For multiple choice
  correctAnswer: text("correctAnswer").notNull(),
  explanationFr: text("explanationFr"),
  audioUrl: varchar("audioUrl", { length: 500 }),
  points: int("points").default(10),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;

// ============================================
// EXERCISE RESULTS TABLE
// ============================================
export const exerciseResults = mysqlTable("exerciseResults", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  exerciseId: int("exerciseId").notNull(),
  userAnswer: text("userAnswer"),
  isCorrect: boolean("isCorrect").default(false),
  attemptNumber: int("attemptNumber").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExerciseResult = typeof exerciseResults.$inferSelect;
export type InsertExerciseResult = typeof exerciseResults.$inferInsert;

// ============================================
// CHAT SESSIONS TABLE
// ============================================
export const chatSessions = mysqlTable("chatSessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tone: mysqlEnum("tone", ["dirty", "slang", "informal", "formal", "diplomatic"]).default("informal"),
  topic: varchar("topic", { length: 255 }),
  level: mysqlEnum("level", ["A1", "A2", "B1", "B2", "C1"]).default("A1"),
  messagesCount: int("messagesCount").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = typeof chatSessions.$inferInsert;

// ============================================
// CHAT MESSAGES TABLE
// ============================================
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  vocabularyHighlights: json("vocabularyHighlights"),
  grammarTip: text("grammarTip"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// ============================================
// GENERATED SONGS TABLE
// ============================================
export const generatedSongs = mysqlTable("generatedSongs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  lyrics: text("lyrics").notNull(),
  lyricsFr: text("lyricsFr"), // French translation
  style: varchar("style", { length: 100 }).default("rap"),
  level: mysqlEnum("level", ["A1", "A2", "B1", "B2", "C1"]).default("A1"),
  tone: mysqlEnum("tone", ["dirty", "slang", "informal", "formal", "diplomatic"]).default("slang"),
  audioUrl: varchar("audioUrl", { length: 500 }),
  sunoTaskId: varchar("sunoTaskId", { length: 100 }),
  status: mysqlEnum("status", ["pending", "generating", "completed", "failed"]).default("pending"),
  vocabulary: json("vocabulary"), // Words to learn from the song
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GeneratedSong = typeof generatedSongs.$inferSelect;
export type InsertGeneratedSong = typeof generatedSongs.$inferInsert;

// ============================================
// ACHIEVEMENTS TABLE
// ============================================
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  nameFr: varchar("nameFr", { length: 100 }).notNull(),
  description: text("description"),
  descriptionFr: text("descriptionFr"),
  icon: varchar("icon", { length: 50 }),
  xpReward: int("xpReward").default(100),
  requirement: json("requirement"), // {type: 'lessons_completed', value: 10}
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

// ============================================
// USER ACHIEVEMENTS TABLE
// ============================================
export const userAchievements = mysqlTable("userAchievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementId: int("achievementId").notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;
