import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

// Sample lessons for each level and tone
const SAMPLE_LESSONS = [
  // A1 - Beginners
  {
    title: "Приветствия",
    titleFr: "Les Salutations",
    description: "Научитесь здороваться по-русски",
    descriptionFr: "Apprenez à saluer en russe",
    level: "A1",
    category: "basics",
    tone: "informal",
    lessonNumber: 1,
    vocabulary: JSON.stringify([
      { russian: "Привет", french: "Salut", pronunciation: "Privét", example: "Привет, как дела?" },
      { russian: "Здравствуйте", french: "Bonjour (formel)", pronunciation: "Zdrástvuyte", example: "Здравствуйте, меня зовут..." },
      { russian: "Пока", french: "Au revoir (informel)", pronunciation: "Paká", example: "Пока, до завтра!" },
      { russian: "До свидания", french: "Au revoir (formel)", pronunciation: "Da svidániya", example: "До свидания, было приятно познакомиться" },
      { russian: "Доброе утро", french: "Bonjour (matin)", pronunciation: "Dóbraye útra", example: "Доброе утро! Как спалось?" }
    ]),
    grammar: JSON.stringify({
      title: "Le tutoiement et le vouvoiement",
      titleFr: "Tu vs Vous en russe",
      explanation: "En russe, 'ты' (ty) est informel et 'вы' (vy) est formel. Utilisez 'вы' avec les inconnus et les personnes plus âgées.",
      examples: [
        { russian: "Ты как?", french: "Comment ça va? (informel)" },
        { russian: "Как вы?", french: "Comment allez-vous? (formel)" }
      ]
    }),
    dialogue: JSON.stringify([
      { speaker: "A", russian: "Привет! Как тебя зовут?", french: "Salut! Comment tu t'appelles?" },
      { speaker: "B", russian: "Привет! Меня зовут Анна. А тебя?", french: "Salut! Je m'appelle Anna. Et toi?" },
      { speaker: "A", russian: "Меня зовут Пьер. Очень приятно!", french: "Je m'appelle Pierre. Enchanté!" },
      { speaker: "B", russian: "Мне тоже приятно! Ты говоришь по-русски?", french: "Moi aussi! Tu parles russe?" }
    ]),
    culturalNotes: "В России принято пожимать руки при знакомстве. Мужчины обычно пожимают руки друг другу, а женщинам целуют руку или просто кивают.",
    culturalNotesFr: "En Russie, il est courant de se serrer la main lors des présentations. Les hommes se serrent généralement la main, tandis qu'avec les femmes, ils peuvent faire un baise-main ou simplement hocher la tête.",
    estimatedMinutes: 20,
    xpReward: 50
  },
  {
    title: "Числа от 1 до 20",
    titleFr: "Les Nombres de 1 à 20",
    description: "Выучите числа от одного до двадцати",
    descriptionFr: "Apprenez les nombres de un à vingt",
    level: "A1",
    category: "numbers",
    tone: "informal",
    lessonNumber: 2,
    vocabulary: JSON.stringify([
      { russian: "один", french: "un", pronunciation: "adín", example: "У меня один брат" },
      { russian: "два", french: "deux", pronunciation: "dva", example: "Два кофе, пожалуйста" },
      { russian: "три", french: "trois", pronunciation: "tri", example: "Три дня" },
      { russian: "пять", french: "cinq", pronunciation: "pyat'", example: "Пять минут" },
      { russian: "десять", french: "dix", pronunciation: "désyat'", example: "Десять рублей" },
      { russian: "двадцать", french: "vingt", pronunciation: "dvádtsat'", example: "Мне двадцать лет" }
    ]),
    grammar: JSON.stringify({
      title: "Числительные и падежи",
      titleFr: "Nombres et cas grammaticaux",
      explanation: "Les nombres en russe affectent le cas du nom qui suit. Après 1, le nom est au nominatif singulier. Après 2-4, au génitif singulier. Après 5-20, au génitif pluriel.",
      examples: [
        { russian: "один рубль", french: "un rouble" },
        { russian: "два рубля", french: "deux roubles" },
        { russian: "пять рублей", french: "cinq roubles" }
      ]
    }),
    dialogue: JSON.stringify([
      { speaker: "A", russian: "Сколько тебе лет?", french: "Quel âge as-tu?" },
      { speaker: "B", russian: "Мне двадцать лет. А тебе?", french: "J'ai vingt ans. Et toi?" },
      { speaker: "A", russian: "Мне восемнадцать.", french: "J'ai dix-huit ans." }
    ]),
    culturalNotes: "Русские часто спрашивают возраст при знакомстве. Это не считается невежливым.",
    culturalNotesFr: "Les Russes demandent souvent l'âge lors des présentations. Ce n'est pas considéré comme impoli.",
    estimatedMinutes: 25,
    xpReward: 60
  },
  // A1 - Slang
  {
    title: "Молодёжный сленг",
    titleFr: "L'Argot des Jeunes",
    description: "Современный сленг молодёжи",
    descriptionFr: "L'argot moderne des jeunes Russes",
    level: "A1",
    category: "slang",
    tone: "slang",
    lessonNumber: 3,
    vocabulary: JSON.stringify([
      { russian: "Чё?", french: "Quoi? (très familier)", pronunciation: "Cho?", example: "Чё делаешь?" },
      { russian: "Круто!", french: "Cool! Génial!", pronunciation: "Krúta!", example: "Это круто!" },
      { russian: "Прикольно", french: "Sympa, marrant", pronunciation: "Prikól'na", example: "Прикольно выглядишь!" },
      { russian: "Чувак", french: "Mec, gars", pronunciation: "Chuván", example: "Эй, чувак!" },
      { russian: "Тусить", french: "Faire la fête, traîner", pronunciation: "Tusít'", example: "Пойдём тусить?" }
    ]),
    grammar: JSON.stringify({
      title: "Сокращения в разговорной речи",
      titleFr: "Abréviations dans le langage parlé",
      explanation: "En russe familier, beaucoup de mots sont raccourcis. 'Что' devient 'чё', 'сейчас' devient 'щас'.",
      examples: [
        { russian: "Чё делаешь?", french: "Tu fais quoi? (au lieu de 'Что делаешь?')" },
        { russian: "Щас приду", french: "J'arrive tout de suite (au lieu de 'Сейчас приду')" }
      ]
    }),
    dialogue: JSON.stringify([
      { speaker: "A", russian: "Чувак, чё делаешь вечером?", french: "Mec, tu fais quoi ce soir?" },
      { speaker: "B", russian: "Да ничё, может потусим?", french: "Rien de spécial, on sort?" },
      { speaker: "A", russian: "Круто! Давай в восемь?", french: "Cool! À huit heures?" }
    ]),
    culturalNotes: "Молодёжный сленг быстро меняется. Многие слова приходят из английского языка.",
    culturalNotesFr: "L'argot des jeunes évolue rapidement. Beaucoup de mots viennent de l'anglais.",
    estimatedMinutes: 20,
    xpReward: 55
  },
  // A1 - Formal
  {
    title: "Формальное общение",
    titleFr: "Communication Formelle",
    description: "Вежливые формы обращения",
    descriptionFr: "Les formes polies de communication",
    level: "A1",
    category: "formal",
    tone: "formal",
    lessonNumber: 4,
    vocabulary: JSON.stringify([
      { russian: "Здравствуйте", french: "Bonjour (formel)", pronunciation: "Zdrástvuyte", example: "Здравствуйте, господин директор" },
      { russian: "Извините", french: "Excusez-moi", pronunciation: "Izvinítye", example: "Извините за беспокойство" },
      { russian: "Пожалуйста", french: "S'il vous plaît", pronunciation: "Pazhálusta", example: "Будьте добры, пожалуйста" },
      { russian: "Благодарю вас", french: "Je vous remercie", pronunciation: "Blagadarjú vas", example: "Благодарю вас за помощь" },
      { russian: "Позвольте", french: "Permettez-moi", pronunciation: "Pazvól'tye", example: "Позвольте представиться" }
    ]),
    grammar: JSON.stringify({
      title: "Вежливые формы глаголов",
      titleFr: "Formes polies des verbes",
      explanation: "En russe formel, on utilise l'impératif avec 'пожалуйста' et des constructions comme 'Будьте добры' (Soyez aimable).",
      examples: [
        { russian: "Будьте добры, подождите", french: "Soyez aimable d'attendre" },
        { russian: "Не могли бы вы...", french: "Pourriez-vous..." }
      ]
    }),
    dialogue: JSON.stringify([
      { speaker: "A", russian: "Здравствуйте! Позвольте представиться.", french: "Bonjour! Permettez-moi de me présenter." },
      { speaker: "B", russian: "Здравствуйте! Слушаю вас.", french: "Bonjour! Je vous écoute." },
      { speaker: "A", russian: "Меня зовут Иван Петров. Я ваш новый коллега.", french: "Je m'appelle Ivan Petrov. Je suis votre nouveau collègue." }
    ]),
    culturalNotes: "В деловой среде России очень важно соблюдать формальности и использовать отчество.",
    culturalNotesFr: "Dans le milieu professionnel russe, il est très important de respecter les formalités et d'utiliser le patronyme.",
    estimatedMinutes: 25,
    xpReward: 60
  },
  // A1 - Diplomatic
  {
    title: "Дипломатический этикет",
    titleFr: "L'Étiquette Diplomatique",
    description: "Высокий стиль общения",
    descriptionFr: "Le style de communication de haut niveau",
    level: "A1",
    category: "diplomatic",
    tone: "diplomatic",
    lessonNumber: 5,
    vocabulary: JSON.stringify([
      { russian: "Ваше превосходительство", french: "Votre Excellence", pronunciation: "Váshe prevaskhadítel'stva", example: "Ваше превосходительство, позвольте..." },
      { russian: "Имею честь", french: "J'ai l'honneur", pronunciation: "Iméyu chest'", example: "Имею честь представить..." },
      { russian: "Соблаговолите", french: "Veuillez bien", pronunciation: "Sablagavalítye", example: "Соблаговолите принять..." },
      { russian: "Примите уверения", french: "Veuillez agréer", pronunciation: "Primítye uveréniya", example: "Примите уверения в моём глубочайшем уважении" },
      { russian: "С глубоким почтением", french: "Avec mes respects les plus profonds", pronunciation: "S glubókim pachtényem", example: "С глубоким почтением, Ваш покорный слуга" }
    ]),
    grammar: JSON.stringify({
      title: "Архаичные формы вежливости",
      titleFr: "Formes archaïques de politesse",
      explanation: "Le langage diplomatique russe utilise des formes archaïques et très élaborées qui ne sont plus utilisées dans la vie quotidienne.",
      examples: [
        { russian: "Соблаговолите принять", french: "Veuillez bien accepter" },
        { russian: "Имею честь довести до Вашего сведения", french: "J'ai l'honneur de porter à votre connaissance" }
      ]
    }),
    dialogue: JSON.stringify([
      { speaker: "A", russian: "Ваше превосходительство, имею честь представить делегацию.", french: "Votre Excellence, j'ai l'honneur de présenter la délégation." },
      { speaker: "B", russian: "Благодарю вас. Прошу, присаживайтесь.", french: "Je vous remercie. Je vous en prie, asseyez-vous." }
    ]),
    culturalNotes: "Дипломатический русский язык сохраняет много архаичных форм из XIX века.",
    culturalNotesFr: "Le russe diplomatique conserve de nombreuses formes archaïques du XIXe siècle.",
    estimatedMinutes: 30,
    xpReward: 80
  },
  // A2 - Intermediate basics
  {
    title: "В ресторане",
    titleFr: "Au Restaurant",
    description: "Заказ еды и напитков",
    descriptionFr: "Commander de la nourriture et des boissons",
    level: "A2",
    category: "food",
    tone: "informal",
    lessonNumber: 6,
    vocabulary: JSON.stringify([
      { russian: "Меню", french: "Menu", pronunciation: "Menyú", example: "Можно меню, пожалуйста?" },
      { russian: "Счёт", french: "L'addition", pronunciation: "Shchyot", example: "Принесите счёт, пожалуйста" },
      { russian: "Официант", french: "Serveur", pronunciation: "Afitsiánt", example: "Официант!" },
      { russian: "Вкусно", french: "Délicieux", pronunciation: "Fkúsna", example: "Очень вкусно!" },
      { russian: "Чаевые", french: "Pourboire", pronunciation: "Chayevýye", example: "Чаевые включены?" }
    ]),
    grammar: JSON.stringify({
      title: "Винительный падеж",
      titleFr: "Le cas accusatif",
      explanation: "Pour commander de la nourriture, on utilise le cas accusatif. Les noms féminins changent leur terminaison de -а/-я à -у/-ю.",
      examples: [
        { russian: "Я хочу пиццу", french: "Je veux une pizza (пицца → пиццу)" },
        { russian: "Дайте воду", french: "Donnez-moi de l'eau (вода → воду)" }
      ]
    }),
    dialogue: JSON.stringify([
      { speaker: "A", russian: "Здравствуйте! Столик на двоих, пожалуйста.", french: "Bonjour! Une table pour deux, s'il vous plaît." },
      { speaker: "B", russian: "Конечно! Вот меню. Что будете заказывать?", french: "Bien sûr! Voici le menu. Qu'est-ce que vous commandez?" },
      { speaker: "A", russian: "Мне борщ и котлеты, пожалуйста.", french: "Pour moi, du bortsch et des côtelettes, s'il vous plaît." }
    ]),
    culturalNotes: "В России чаевые обычно составляют 10-15% от счёта, но это не обязательно.",
    culturalNotesFr: "En Russie, les pourboires sont généralement de 10-15% de l'addition, mais ce n'est pas obligatoire.",
    estimatedMinutes: 25,
    xpReward: 70
  },
  // B1 - Intermediate
  {
    title: "Выражение мнения",
    titleFr: "Exprimer son Opinion",
    description: "Как выразить своё мнение по-русски",
    descriptionFr: "Comment exprimer son opinion en russe",
    level: "B1",
    category: "conversation",
    tone: "informal",
    lessonNumber: 7,
    vocabulary: JSON.stringify([
      { russian: "Я думаю, что...", french: "Je pense que...", pronunciation: "Ya dúmayu, shto...", example: "Я думаю, что это хорошая идея" },
      { russian: "По-моему", french: "À mon avis", pronunciation: "Pa-móyemu", example: "По-моему, это неправильно" },
      { russian: "Мне кажется", french: "Il me semble", pronunciation: "Mne kázhetsya", example: "Мне кажется, он прав" },
      { russian: "Согласен/Согласна", french: "D'accord (m/f)", pronunciation: "Saglásyen/Saglásna", example: "Я полностью согласен!" },
      { russian: "Не согласен", french: "Pas d'accord", pronunciation: "Nye saglásyen", example: "Я категорически не согласен" }
    ]),
    grammar: JSON.stringify({
      title: "Сослагательное наклонение",
      titleFr: "Le conditionnel",
      explanation: "Pour exprimer des opinions hypothétiques, on utilise la particule 'бы' avec le passé du verbe.",
      examples: [
        { russian: "Я бы сказал, что...", french: "Je dirais que..." },
        { russian: "Было бы лучше, если бы...", french: "Ce serait mieux si..." }
      ]
    }),
    dialogue: JSON.stringify([
      { speaker: "A", russian: "Что ты думаешь о новом фильме?", french: "Qu'est-ce que tu penses du nouveau film?" },
      { speaker: "B", russian: "По-моему, он скучный. А тебе понравился?", french: "À mon avis, il est ennuyeux. Tu l'as aimé?" },
      { speaker: "A", russian: "Не согласен! Мне кажется, он очень интересный.", french: "Pas d'accord! Je trouve qu'il est très intéressant." }
    ]),
    culturalNotes: "Русские часто выражают своё мнение прямо и открыто, что может показаться грубым иностранцам.",
    culturalNotesFr: "Les Russes expriment souvent leur opinion de manière directe et ouverte, ce qui peut sembler impoli aux étrangers.",
    estimatedMinutes: 30,
    xpReward: 80
  },
  // B2 - Upper Intermediate
  {
    title: "Деловая переписка",
    titleFr: "Correspondance Professionnelle",
    description: "Написание деловых писем",
    descriptionFr: "Rédaction de lettres professionnelles",
    level: "B2",
    category: "business",
    tone: "formal",
    lessonNumber: 8,
    vocabulary: JSON.stringify([
      { russian: "Уважаемый/ая", french: "Cher/Chère (formel)", pronunciation: "Uvazhályemyy/aya", example: "Уважаемый Иван Иванович" },
      { russian: "В связи с", french: "En raison de", pronunciation: "V svyazí s", example: "В связи с вашим запросом..." },
      { russian: "Прошу рассмотреть", french: "Je vous prie d'examiner", pronunciation: "Prashú rasmatrét'", example: "Прошу рассмотреть моё предложение" },
      { russian: "С уважением", french: "Cordialement", pronunciation: "S uvazhényem", example: "С уважением, Петров А.И." },
      { russian: "Приложение", french: "Pièce jointe", pronunciation: "Prilazényye", example: "Смотрите приложение" }
    ]),
    grammar: JSON.stringify({
      title: "Деепричастные обороты",
      titleFr: "Les gérondifs",
      explanation: "Dans la correspondance formelle, on utilise souvent des gérondifs pour rendre le texte plus concis et professionnel.",
      examples: [
        { russian: "Рассмотрев ваше предложение, мы решили...", french: "Ayant examiné votre proposition, nous avons décidé..." },
        { russian: "Учитывая обстоятельства...", french: "Compte tenu des circonstances..." }
      ]
    }),
    dialogue: JSON.stringify([
      { speaker: "Email", russian: "Уважаемый Александр Петрович! В связи с нашей встречей прошу рассмотреть прилагаемое предложение. С уважением, Мария Иванова", french: "Cher Alexandre Petrovitch! Suite à notre réunion, je vous prie d'examiner la proposition ci-jointe. Cordialement, Maria Ivanova" }
    ]),
    culturalNotes: "В российской деловой переписке обязательно используется отчество и формальные обращения.",
    culturalNotesFr: "Dans la correspondance professionnelle russe, l'utilisation du patronyme et des formules formelles est obligatoire.",
    estimatedMinutes: 35,
    xpReward: 100
  },
  // C1 - Advanced
  {
    title: "Политический дискурс",
    titleFr: "Le Discours Politique",
    description: "Язык политики и дипломатии",
    descriptionFr: "Le langage de la politique et de la diplomatie",
    level: "C1",
    category: "politics",
    tone: "diplomatic",
    lessonNumber: 9,
    vocabulary: JSON.stringify([
      { russian: "Двусторонние отношения", french: "Relations bilatérales", pronunciation: "Dvustarónniye atnashéniya", example: "Развитие двусторонних отношений" },
      { russian: "Меморандум о взаимопонимании", french: "Mémorandum d'entente", pronunciation: "Memorándum a vzaimaponimánii", example: "Подписание меморандума о взаимопонимании" },
      { russian: "Суверенитет", french: "Souveraineté", pronunciation: "Suverenityét", example: "Уважение государственного суверенитета" },
      { russian: "Санкции", french: "Sanctions", pronunciation: "Sánktsii", example: "Введение экономических санкций" },
      { russian: "Переговоры", french: "Négociations", pronunciation: "Peregovóry", example: "Многосторонние переговоры" }
    ]),
    grammar: JSON.stringify({
      title: "Официально-деловой стиль",
      titleFr: "Le style officiel",
      explanation: "Le style officiel russe utilise des constructions passives, des nominalisations et un vocabulaire spécialisé.",
      examples: [
        { russian: "Было принято решение о...", french: "La décision a été prise de..." },
        { russian: "В целях обеспечения...", french: "Afin d'assurer..." }
      ]
    }),
    dialogue: JSON.stringify([
      { speaker: "Diplomat", russian: "Российская сторона выражает глубокую озабоченность в связи с последними событиями и призывает к диалогу.", french: "La partie russe exprime sa profonde préoccupation concernant les derniers événements et appelle au dialogue." }
    ]),
    culturalNotes: "Дипломатический язык России имеет свои особенности и отличается от западного дипломатического стиля.",
    culturalNotesFr: "Le langage diplomatique russe a ses particularités et diffère du style diplomatique occidental.",
    estimatedMinutes: 45,
    xpReward: 150
  },
  // A1 - Dirty/Vulgar (with warning)
  {
    title: "Ругательства (осторожно!)",
    titleFr: "Les Gros Mots (attention!)",
    description: "Вульгарные выражения - только для понимания",
    descriptionFr: "Expressions vulgaires - uniquement pour la compréhension",
    level: "A1",
    category: "vulgar",
    tone: "dirty",
    lessonNumber: 10,
    vocabulary: JSON.stringify([
      { russian: "Блин!", french: "Mince! (euphémisme)", pronunciation: "Blin!", example: "Блин, я опоздал!", warning: "Euphémisme courant, acceptable" },
      { russian: "Чёрт!", french: "Zut! Merde!", pronunciation: "Chyort!", example: "Чёрт, забыл ключи!", warning: "Légèrement vulgaire" },
      { russian: "Фигня", french: "N'importe quoi, conneries", pronunciation: "Fignyá", example: "Это полная фигня!", warning: "Familier, peut être offensant" }
    ]),
    grammar: JSON.stringify({
      title: "Интонация в ругательствах",
      titleFr: "L'intonation dans les jurons",
      explanation: "L'intonation est cruciale pour les expressions vulgaires. Le même mot peut être amusant ou très offensant selon l'intonation.",
      examples: [
        { russian: "Блин! (surprise)", french: "Mince! (surprise)" },
        { russian: "Блин... (déception)", french: "Mince... (déception)" }
      ]
    }),
    dialogue: JSON.stringify([
      { speaker: "Warning", russian: "⚠️ Ces expressions ne doivent PAS être utilisées dans un contexte formel ou avec des inconnus.", french: "⚠️ Ces expressions ne doivent PAS être utilisées dans un contexte formel ou avec des inconnus." }
    ]),
    culturalNotes: "⚠️ ВНИМАНИЕ: Эти выражения могут быть очень оскорбительными. Используйте с осторожностью!",
    culturalNotesFr: "⚠️ ATTENTION: Ces expressions peuvent être très offensantes. À utiliser avec précaution!",
    estimatedMinutes: 15,
    xpReward: 40
  }
];

// Sample achievements
const SAMPLE_ACHIEVEMENTS = [
  { name: "Первый шаг", nameFr: "Premier Pas", description: "Complete your first lesson", descriptionFr: "Complétez votre première leçon", icon: "🎯", xpReward: 50, requirement: JSON.stringify({ type: "lessons_completed", value: 1 }) },
  { name: "Полиглот", nameFr: "Polyglotte", description: "Learn 100 vocabulary words", descriptionFr: "Apprenez 100 mots de vocabulaire", icon: "📚", xpReward: 100, requirement: JSON.stringify({ type: "words_learned", value: 100 }) },
  { name: "Музыкант", nameFr: "Musicien", description: "Generate your first song", descriptionFr: "Générez votre première chanson", icon: "🎵", xpReward: 75, requirement: JSON.stringify({ type: "songs_generated", value: 1 }) },
  { name: "Болтун", nameFr: "Bavard", description: "Send 50 chat messages", descriptionFr: "Envoyez 50 messages dans le chat", icon: "💬", xpReward: 100, requirement: JSON.stringify({ type: "chat_messages", value: 50 }) },
  { name: "Серия 7", nameFr: "Série de 7", description: "Maintain a 7-day streak", descriptionFr: "Maintenez une série de 7 jours", icon: "🔥", xpReward: 150, requirement: JSON.stringify({ type: "streak", value: 7 }) },
  { name: "Мастер A1", nameFr: "Maître A1", description: "Complete all A1 lessons", descriptionFr: "Complétez toutes les leçons A1", icon: "🏆", xpReward: 500, requirement: JSON.stringify({ type: "level_completed", value: "A1" }) },
  { name: "Дипломат", nameFr: "Diplomate", description: "Master the diplomatic register", descriptionFr: "Maîtrisez le registre diplomatique", icon: "🎩", xpReward: 300, requirement: JSON.stringify({ type: "tone_mastered", value: "diplomatic" }) },
  { name: "Рэпер", nameFr: "Rappeur", description: "Generate 10 rap songs", descriptionFr: "Générez 10 chansons rap", icon: "🎤", xpReward: 200, requirement: JSON.stringify({ type: "songs_generated", value: 10 }) }
];

async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    // Insert lessons
    console.log("📚 Inserting lessons...");
    for (const lesson of SAMPLE_LESSONS) {
      await connection.execute(
        `INSERT INTO lessons (title, titleFr, description, descriptionFr, level, category, tone, lessonNumber, vocabulary, grammar, dialogue, culturalNotes, culturalNotesFr, estimatedMinutes, xpReward, isActive)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true)
         ON DUPLICATE KEY UPDATE title = VALUES(title)`,
        [
          lesson.title,
          lesson.titleFr,
          lesson.description,
          lesson.descriptionFr,
          lesson.level,
          lesson.category,
          lesson.tone,
          lesson.lessonNumber,
          lesson.vocabulary,
          lesson.grammar,
          lesson.dialogue,
          lesson.culturalNotes,
          lesson.culturalNotesFr,
          lesson.estimatedMinutes,
          lesson.xpReward
        ]
      );
    }
    console.log(`✅ Inserted ${SAMPLE_LESSONS.length} lessons`);

    // Insert achievements
    console.log("🏆 Inserting achievements...");
    for (const achievement of SAMPLE_ACHIEVEMENTS) {
      await connection.execute(
        `INSERT INTO achievements (name, nameFr, description, descriptionFr, icon, xpReward, requirement)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [
          achievement.name,
          achievement.nameFr,
          achievement.description,
          achievement.descriptionFr,
          achievement.icon,
          achievement.xpReward,
          achievement.requirement
        ]
      );
    }
    console.log(`✅ Inserted ${SAMPLE_ACHIEVEMENTS.length} achievements`);

    console.log("🎉 Database seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await connection.end();
  }
}

seedDatabase();
