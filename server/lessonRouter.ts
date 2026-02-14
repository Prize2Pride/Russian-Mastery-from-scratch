import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";
import fs from "fs";
import path from "path";

const lessonsPath = path.resolve(process.cwd(), "data/lessons.json");

export const lessonRouter = router({
  list: publicProcedure
    .input(z.object({
      level: z.string().optional(),
      category: z.string().optional(),
      tone: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const data = JSON.parse(fs.readFileSync(lessonsPath, "utf-8"));
      return data.filter((l: any) => {
        if (input.level && l.level !== input.level) return false;
        if (input.category && l.category !== input.category) return false;
        if (input.tone && l.tone !== input.tone) return false;
        return true;
      });
    }),
  get: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      const data = JSON.parse(fs.readFileSync(lessonsPath, "utf-8"));
      return data.find((l: any) => l.id === input);
    }),
});
