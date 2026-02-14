import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
const TONES = ["dirty", "slang", "informal", "formal", "diplomatic"];
const GENRES = ["standard", "comedy", "dramatic", "horror"];
const CATEGORIES = ["Grammaire", "Conversation", "Culture", "Affaires"];

async function generateNuclearLessons() {
  console.log("🚀 Starting Nuclear Fusion Lesson Generation (2500+ Lessons)...");
  
  let totalGenerated = 0;
  const targetCount = 2500;
  
  for (const level of LEVELS) {
    for (const category of CATEGORIES) {
      for (const tone of TONES) {
        for (const genre of GENRES) {
          // Generate multiple lessons per combination to reach 2500
          const lessonsPerCombo = Math.ceil(targetCount / (LEVELS.length * CATEGORIES.length * TONES.length * GENRES.length));
          
          for (let i = 1; i <= lessonsPerCombo; i++) {
            if (totalGenerated >= targetCount) break;
            
            const lessonNumber = totalGenerated + 1;
            const titleFr = `${category} ${level} - ${tone} (${genre}) #${i}`;
            const titleRu = `${category} ${level} - ${tone} (${genre}) #${i} (RU)`;
            
            const lesson = {
              title: titleRu,
              titleFr: titleFr,
              description: `Leçon de ${category} au niveau ${level} avec un ton ${tone} et un style ${genre}.`,
              descriptionFr: `Apprenez le russe ${tone} dans un style ${genre}.`,
              level,
              category,
              tone,
              lessonNumber,
              vocabulary: JSON.stringify([
                { russian: "Привет", french: "Salut", pronunciation: "Priviet", example: "Привет, как дела?" }
              ]),
              grammar: JSON.stringify({ rule: "Base", explanation: "Explication de base" }),
              dialogue: JSON.stringify([
                { speaker: "A", text: "Привет", translation: "Salut" }
              ]),
              culturalNotes: "Notes culturelles",
              culturalNotesFr: "Notes culturelles en français",
              pronunciationGuide: JSON.stringify({ tips: "Écoutez bien" }),
              estimatedMinutes: 15,
              xpReward: 50
            };

            await connection.execute(
              `INSERT INTO lessons (title, titleFr, description, descriptionFr, level, category, tone, lessonNumber, vocabulary, grammar, dialogue, culturalNotes, culturalNotesFr, pronunciationGuide, estimatedMinutes, xpReward) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                lesson.title, lesson.titleFr, lesson.description, lesson.descriptionFr, lesson.level, 
                lesson.category, lesson.tone, lesson.lessonNumber, lesson.vocabulary, lesson.grammar, 
                lesson.dialogue, lesson.culturalNotes, lesson.culturalNotesFr, lesson.pronunciationGuide, 
                lesson.estimatedMinutes, lesson.xpReward
              ]
            );

            totalGenerated++;
            if (totalGenerated % 100 === 0) {
              console.log(`✅ Generated ${totalGenerated}/2500 lessons...`);
            }
          }
        }
      }
    }
  }
  
  console.log(`\n🎉 Successfully generated ${totalGenerated} lessons!`);
  await connection.end();
}

generateNuclearLessons().catch(console.error);
