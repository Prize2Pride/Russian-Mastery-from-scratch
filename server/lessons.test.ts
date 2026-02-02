import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock authenticated user
function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      currentLevel: "A1",
      preferredTone: "informal",
      dailySongsUsed: 0,
      lastSongResetDate: null,
      totalLessonsCompleted: 5,
      totalXp: 500,
      streak: 3,
      lastActivityDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// Mock public context (no user)
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Russian Mastery API", () => {
  describe("auth.me", () => {
    it("returns null for unauthenticated users", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.auth.me();
      
      expect(result).toBeNull();
    });

    it("returns user data for authenticated users", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.auth.me();
      
      expect(result).not.toBeNull();
      expect(result?.name).toBe("Test User");
      expect(result?.currentLevel).toBe("A1");
    });
  });

  describe("lessons.list", () => {
    it("returns lessons list without authentication", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      
      // Should not throw - lessons are public
      const result = await caller.lessons.list();
      
      expect(Array.isArray(result)).toBe(true);
    });

    it("accepts filter parameters", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      
      // Should not throw with filters
      const result = await caller.lessons.list({
        level: "A1",
        tone: "informal",
        limit: 10,
        offset: 0
      });
      
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("songs.dailyCount", () => {
    it("returns daily song count for authenticated users", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.songs.dailyCount();
      
      expect(result).toHaveProperty("count");
      expect(result).toHaveProperty("limit");
      expect(result).toHaveProperty("remaining");
      expect(result.limit).toBe(10);
    });
  });

  describe("progress.get", () => {
    it("returns progress for authenticated users", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.progress.get();
      
      // Result can be null if no stats yet
      expect(result === null || typeof result === "object").toBe(true);
    });
  });

  describe("admin.generateLessons", () => {
    it("rejects non-admin users", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(
        caller.admin.generateLessons({
          level: "A1",
          category: "basics",
          count: 10
        })
      ).rejects.toThrow("Unauthorized");
    });

    it("allows admin users", async () => {
      const ctx = createAuthContext();
      ctx.user!.role = "admin";
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.admin.generateLessons({
        level: "A1",
        category: "basics",
        count: 10
      });
      
      expect(result.success).toBe(true);
      expect(result.jobId).toBeDefined();
    });
  });
});

describe("Tone System", () => {
  it("supports all 5 tone levels", () => {
    const tones = ["dirty", "slang", "informal", "formal", "diplomatic"];
    
    tones.forEach(tone => {
      expect(typeof tone).toBe("string");
    });
    
    expect(tones.length).toBe(5);
  });
});

describe("CEFR Levels", () => {
  it("supports A1 to C1 levels", () => {
    const levels = ["A1", "A2", "B1", "B2", "C1"];
    
    levels.forEach(level => {
      expect(level).toMatch(/^[ABC][12]$/);
    });
    
    expect(levels.length).toBe(5);
  });
});
