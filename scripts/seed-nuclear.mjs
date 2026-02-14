import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../drizzle/schema.ts';

const sqlite = new Database('local.db');
const db = drizzle(sqlite, { schema });

const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
const TONES = ["dirty", "slang", "informal", "formal", "diplomatic"];
const GENRES = ["standard", "comedy", "dramatic", "horror"];
const CATEGORIES = ["Grammaire", "Conversation", "Culture", "Affaires"];

async function seed() {
  console.log("🚀 Seeding 2500+ Nuclear Lessons...");
  
  let count = 0;
  const target = 2500;
  
  for (const level of LEVELS) {
    for (const category of CATEGORIES) {
      for (const tone of TONES) {
        for (const genre of GENRES) {
          const lessonsPerCombo = Math.ceil(target / (LEVELS.length * CATEGORIES.length * TONES.length * GENRES.length));
          
          for (let i = 1; i <= lessonsPerCombo; i++) {
            if (count >= target) break;
            
            await db.insert(schema.lessons).values({
              title: `${category} ${level} - ${tone} (${genre}) #${i}`,
              titleFr: `${category} ${level} - ${tone} (${genre}) #${i}`,
              description: `Leçon de ${category} au niveau ${level} avec un ton ${tone} et un style ${genre}.`,
              descriptionFr: `Apprenez le russe ${tone} dans un style ${genre}.`,
              level,
              category,
              tone,
              lessonNumber: count + 1,
              vocabulary: [
                { russian: "Привет", french: "Salut", pronunciation: "Priviet", example: "Привет, как дела?" }
              ],
              grammar: { rule: "Base", explanation: "Explication de base" },
              dialogue: [
                { speaker: "A", text: "Привет", translation: "Salut" }
              ],
              culturalNotes: "Notes culturelles",
              culturalNotesFr: "Notes culturelles en français",
              pronunciationGuide: { tips: "Écoutez bien" },
              estimatedMinutes: 15,
              xpReward: 50
            });
            
            count++;
            if (count % 500 === 0) console.log(`✅ Seeded ${count} lessons...`);
          }
        }
      }
    }
  }
  
  console.log(`🎉 Successfully seeded ${count} lessons into the local database!`);
}

seed().catch(console.error);
