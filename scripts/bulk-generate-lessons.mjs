/**
 * Bulk Lesson Generator for Russian Mastery
 * Generates 500 lessons per batch across all CEFR levels and tone registers
 * 
 * Usage: node scripts/bulk-generate-lessons.mjs [batch_number]
 * Example: node scripts/bulk-generate-lessons.mjs 1
 */

import mysql from 'mysql2/promise';

// Lesson templates organized by level and category
const LESSON_TEMPLATES = {
  A1: {
    basics: [
      { titleRu: "Алфавит", titleFr: "L'Alphabet Russe", category: "basics", duration: 15 },
      { titleRu: "Приветствия", titleFr: "Les Salutations", category: "basics", duration: 15 },
      { titleRu: "Знакомство", titleFr: "Se Présenter", category: "basics", duration: 20 },
      { titleRu: "Числа 1-10", titleFr: "Les Nombres 1-10", category: "basics", duration: 20 },
      { titleRu: "Числа 11-100", titleFr: "Les Nombres 11-100", category: "basics", duration: 25 },
      { titleRu: "Дни недели", titleFr: "Les Jours de la Semaine", category: "basics", duration: 15 },
      { titleRu: "Месяцы", titleFr: "Les Mois", category: "basics", duration: 15 },
      { titleRu: "Цвета", titleFr: "Les Couleurs", category: "basics", duration: 20 },
      { titleRu: "Семья", titleFr: "La Famille", category: "basics", duration: 25 },
      { titleRu: "Профессии", titleFr: "Les Professions", category: "basics", duration: 25 },
    ],
    vocabulary: [
      { titleRu: "Еда и напитки", titleFr: "Nourriture et Boissons", category: "vocabulary", duration: 30 },
      { titleRu: "Одежда", titleFr: "Les Vêtements", category: "vocabulary", duration: 25 },
      { titleRu: "Дом и квартира", titleFr: "La Maison", category: "vocabulary", duration: 30 },
      { titleRu: "Город", titleFr: "La Ville", category: "vocabulary", duration: 25 },
      { titleRu: "Транспорт", titleFr: "Les Transports", category: "vocabulary", duration: 25 },
      { titleRu: "Погода", titleFr: "La Météo", category: "vocabulary", duration: 20 },
      { titleRu: "Время", titleFr: "L'Heure", category: "vocabulary", duration: 25 },
      { titleRu: "Тело человека", titleFr: "Le Corps Humain", category: "vocabulary", duration: 25 },
      { titleRu: "Животные", titleFr: "Les Animaux", category: "vocabulary", duration: 25 },
      { titleRu: "Фрукты и овощи", titleFr: "Fruits et Légumes", category: "vocabulary", duration: 25 },
    ],
    grammar: [
      { titleRu: "Род существительных", titleFr: "Le Genre des Noms", category: "grammar", duration: 30 },
      { titleRu: "Множественное число", titleFr: "Le Pluriel", category: "grammar", duration: 30 },
      { titleRu: "Личные местоимения", titleFr: "Pronoms Personnels", category: "grammar", duration: 25 },
      { titleRu: "Глагол быть", titleFr: "Le Verbe Être", category: "grammar", duration: 25 },
      { titleRu: "Настоящее время", titleFr: "Le Présent", category: "grammar", duration: 35 },
      { titleRu: "Притяжательные местоимения", titleFr: "Pronoms Possessifs", category: "grammar", duration: 30 },
      { titleRu: "Указательные местоимения", titleFr: "Pronoms Démonstratifs", category: "grammar", duration: 25 },
      { titleRu: "Вопросительные слова", titleFr: "Mots Interrogatifs", category: "grammar", duration: 25 },
      { titleRu: "Отрицание", titleFr: "La Négation", category: "grammar", duration: 25 },
      { titleRu: "Прилагательные", titleFr: "Les Adjectifs", category: "grammar", duration: 30 },
    ],
    conversation: [
      { titleRu: "В кафе", titleFr: "Au Café", category: "conversation", duration: 25 },
      { titleRu: "В магазине", titleFr: "Au Magasin", category: "conversation", duration: 25 },
      { titleRu: "На улице", titleFr: "Dans la Rue", category: "conversation", duration: 20 },
      { titleRu: "В ресторане", titleFr: "Au Restaurant", category: "conversation", duration: 30 },
      { titleRu: "В отеле", titleFr: "À l'Hôtel", category: "conversation", duration: 25 },
      { titleRu: "В аэропорту", titleFr: "À l'Aéroport", category: "conversation", duration: 30 },
      { titleRu: "У врача", titleFr: "Chez le Médecin", category: "conversation", duration: 30 },
      { titleRu: "По телефону", titleFr: "Au Téléphone", category: "conversation", duration: 25 },
      { titleRu: "В такси", titleFr: "En Taxi", category: "conversation", duration: 20 },
      { titleRu: "На вокзале", titleFr: "À la Gare", category: "conversation", duration: 25 },
    ],
    culture: [
      { titleRu: "Русские праздники", titleFr: "Fêtes Russes", category: "culture", duration: 30 },
      { titleRu: "Русская кухня", titleFr: "Cuisine Russe", category: "culture", duration: 25 },
      { titleRu: "Москва", titleFr: "Moscou", category: "culture", duration: 30 },
      { titleRu: "Санкт-Петербург", titleFr: "Saint-Pétersbourg", category: "culture", duration: 30 },
      { titleRu: "Русские традиции", titleFr: "Traditions Russes", category: "culture", duration: 25 },
    ],
  },
  A2: {
    basics: [
      { titleRu: "Расширенные приветствия", titleFr: "Salutations Avancées", category: "basics", duration: 20 },
      { titleRu: "Описание людей", titleFr: "Décrire les Personnes", category: "basics", duration: 25 },
      { titleRu: "Описание мест", titleFr: "Décrire les Lieux", category: "basics", duration: 25 },
      { titleRu: "Выражение мнения", titleFr: "Exprimer son Opinion", category: "basics", duration: 30 },
      { titleRu: "Планы на будущее", titleFr: "Projets Futurs", category: "basics", duration: 25 },
    ],
    vocabulary: [
      { titleRu: "Работа и офис", titleFr: "Travail et Bureau", category: "vocabulary", duration: 30 },
      { titleRu: "Хобби и увлечения", titleFr: "Loisirs et Hobbies", category: "vocabulary", duration: 25 },
      { titleRu: "Спорт", titleFr: "Le Sport", category: "vocabulary", duration: 25 },
      { titleRu: "Путешествия", titleFr: "Les Voyages", category: "vocabulary", duration: 30 },
      { titleRu: "Здоровье", titleFr: "La Santé", category: "vocabulary", duration: 30 },
      { titleRu: "Образование", titleFr: "L'Éducation", category: "vocabulary", duration: 25 },
      { titleRu: "Технологии", titleFr: "La Technologie", category: "vocabulary", duration: 25 },
      { titleRu: "Природа", titleFr: "La Nature", category: "vocabulary", duration: 25 },
      { titleRu: "Искусство", titleFr: "L'Art", category: "vocabulary", duration: 25 },
      { titleRu: "Музыка", titleFr: "La Musique", category: "vocabulary", duration: 25 },
    ],
    grammar: [
      { titleRu: "Падежи: Именительный", titleFr: "Cas: Nominatif", category: "grammar", duration: 35 },
      { titleRu: "Падежи: Родительный", titleFr: "Cas: Génitif", category: "grammar", duration: 40 },
      { titleRu: "Падежи: Дательный", titleFr: "Cas: Datif", category: "grammar", duration: 40 },
      { titleRu: "Падежи: Винительный", titleFr: "Cas: Accusatif", category: "grammar", duration: 40 },
      { titleRu: "Прошедшее время", titleFr: "Le Passé", category: "grammar", duration: 35 },
      { titleRu: "Будущее время", titleFr: "Le Futur", category: "grammar", duration: 35 },
      { titleRu: "Глаголы движения", titleFr: "Verbes de Mouvement", category: "grammar", duration: 40 },
      { titleRu: "Вид глагола", titleFr: "Aspect Verbal", category: "grammar", duration: 45 },
      { titleRu: "Сравнительная степень", titleFr: "Comparatif", category: "grammar", duration: 30 },
      { titleRu: "Превосходная степень", titleFr: "Superlatif", category: "grammar", duration: 30 },
    ],
    conversation: [
      { titleRu: "Собеседование", titleFr: "Entretien d'Embauche", category: "conversation", duration: 35 },
      { titleRu: "В банке", titleFr: "À la Banque", category: "conversation", duration: 30 },
      { titleRu: "Аренда квартиры", titleFr: "Louer un Appartement", category: "conversation", duration: 35 },
      { titleRu: "У парикмахера", titleFr: "Chez le Coiffeur", category: "conversation", duration: 25 },
      { titleRu: "В спортзале", titleFr: "À la Salle de Sport", category: "conversation", duration: 25 },
      { titleRu: "На почте", titleFr: "À la Poste", category: "conversation", duration: 25 },
      { titleRu: "В библиотеке", titleFr: "À la Bibliothèque", category: "conversation", duration: 25 },
      { titleRu: "На рынке", titleFr: "Au Marché", category: "conversation", duration: 30 },
      { titleRu: "В театре", titleFr: "Au Théâtre", category: "conversation", duration: 30 },
      { titleRu: "На концерте", titleFr: "Au Concert", category: "conversation", duration: 25 },
    ],
    culture: [
      { titleRu: "Русская литература", titleFr: "Littérature Russe", category: "culture", duration: 35 },
      { titleRu: "Русское кино", titleFr: "Cinéma Russe", category: "culture", duration: 30 },
      { titleRu: "Русский балет", titleFr: "Ballet Russe", category: "culture", duration: 30 },
      { titleRu: "Русская музыка", titleFr: "Musique Russe", category: "culture", duration: 30 },
      { titleRu: "Русское искусство", titleFr: "Art Russe", category: "culture", duration: 30 },
    ],
  },
  B1: {
    vocabulary: [
      { titleRu: "Политика", titleFr: "La Politique", category: "vocabulary", duration: 35 },
      { titleRu: "Экономика", titleFr: "L'Économie", category: "vocabulary", duration: 35 },
      { titleRu: "Экология", titleFr: "L'Écologie", category: "vocabulary", duration: 30 },
      { titleRu: "Медицина", titleFr: "La Médecine", category: "vocabulary", duration: 35 },
      { titleRu: "Юриспруденция", titleFr: "Le Droit", category: "vocabulary", duration: 35 },
      { titleRu: "Наука", titleFr: "La Science", category: "vocabulary", duration: 30 },
      { titleRu: "История", titleFr: "L'Histoire", category: "vocabulary", duration: 35 },
      { titleRu: "Философия", titleFr: "La Philosophie", category: "vocabulary", duration: 35 },
      { titleRu: "Психология", titleFr: "La Psychologie", category: "vocabulary", duration: 30 },
      { titleRu: "Социология", titleFr: "La Sociologie", category: "vocabulary", duration: 30 },
    ],
    grammar: [
      { titleRu: "Падежи: Творительный", titleFr: "Cas: Instrumental", category: "grammar", duration: 45 },
      { titleRu: "Падежи: Предложный", titleFr: "Cas: Prépositionnel", category: "grammar", duration: 45 },
      { titleRu: "Причастия", titleFr: "Participes", category: "grammar", duration: 50 },
      { titleRu: "Деепричастия", titleFr: "Gérondifs", category: "grammar", duration: 45 },
      { titleRu: "Условное наклонение", titleFr: "Conditionnel", category: "grammar", duration: 40 },
      { titleRu: "Повелительное наклонение", titleFr: "Impératif", category: "grammar", duration: 35 },
      { titleRu: "Пассивный залог", titleFr: "Voix Passive", category: "grammar", duration: 40 },
      { titleRu: "Сложные предложения", titleFr: "Phrases Complexes", category: "grammar", duration: 45 },
      { titleRu: "Косвенная речь", titleFr: "Discours Indirect", category: "grammar", duration: 40 },
      { titleRu: "Числительные", titleFr: "Numéraux", category: "grammar", duration: 35 },
    ],
    conversation: [
      { titleRu: "Деловые переговоры", titleFr: "Négociations d'Affaires", category: "conversation", duration: 45 },
      { titleRu: "Презентация проекта", titleFr: "Présentation de Projet", category: "conversation", duration: 40 },
      { titleRu: "Дебаты", titleFr: "Débats", category: "conversation", duration: 45 },
      { titleRu: "Интервью", titleFr: "Interview", category: "conversation", duration: 40 },
      { titleRu: "Конференция", titleFr: "Conférence", category: "conversation", duration: 45 },
      { titleRu: "Семинар", titleFr: "Séminaire", category: "conversation", duration: 40 },
      { titleRu: "Круглый стол", titleFr: "Table Ronde", category: "conversation", duration: 45 },
      { titleRu: "Пресс-конференция", titleFr: "Conférence de Presse", category: "conversation", duration: 45 },
    ],
    business: [
      { titleRu: "Деловая переписка", titleFr: "Correspondance Professionnelle", category: "business", duration: 40 },
      { titleRu: "Контракты", titleFr: "Les Contrats", category: "business", duration: 45 },
      { titleRu: "Маркетинг", titleFr: "Le Marketing", category: "business", duration: 40 },
      { titleRu: "Финансы", titleFr: "Les Finances", category: "business", duration: 45 },
      { titleRu: "Управление", titleFr: "Le Management", category: "business", duration: 40 },
    ],
    culture: [
      { titleRu: "Советская история", titleFr: "Histoire Soviétique", category: "culture", duration: 45 },
      { titleRu: "Современная Россия", titleFr: "Russie Contemporaine", category: "culture", duration: 40 },
      { titleRu: "Русская философия", titleFr: "Philosophie Russe", category: "culture", duration: 45 },
      { titleRu: "Русские учёные", titleFr: "Scientifiques Russes", category: "culture", duration: 40 },
    ],
  },
  B2: {
    vocabulary: [
      { titleRu: "Дипломатия", titleFr: "La Diplomatie", category: "vocabulary", duration: 45 },
      { titleRu: "Международные отношения", titleFr: "Relations Internationales", category: "vocabulary", duration: 45 },
      { titleRu: "Геополитика", titleFr: "Géopolitique", category: "vocabulary", duration: 45 },
      { titleRu: "Военная терминология", titleFr: "Terminologie Militaire", category: "vocabulary", duration: 40 },
      { titleRu: "Юридическая терминология", titleFr: "Terminologie Juridique", category: "vocabulary", duration: 45 },
      { titleRu: "Медицинская терминология", titleFr: "Terminologie Médicale", category: "vocabulary", duration: 45 },
      { titleRu: "Техническая терминология", titleFr: "Terminologie Technique", category: "vocabulary", duration: 40 },
      { titleRu: "Научная терминология", titleFr: "Terminologie Scientifique", category: "vocabulary", duration: 45 },
    ],
    grammar: [
      { titleRu: "Стилистика", titleFr: "Stylistique", category: "grammar", duration: 50 },
      { titleRu: "Риторика", titleFr: "Rhétorique", category: "grammar", duration: 50 },
      { titleRu: "Фразеология", titleFr: "Phraséologie", category: "grammar", duration: 45 },
      { titleRu: "Идиомы", titleFr: "Idiomes", category: "grammar", duration: 45 },
      { titleRu: "Архаизмы", titleFr: "Archaïsmes", category: "grammar", duration: 40 },
      { titleRu: "Неологизмы", titleFr: "Néologismes", category: "grammar", duration: 40 },
      { titleRu: "Синонимия", titleFr: "Synonymie", category: "grammar", duration: 45 },
      { titleRu: "Антонимия", titleFr: "Antonymie", category: "grammar", duration: 40 },
    ],
    conversation: [
      { titleRu: "Дипломатические переговоры", titleFr: "Négociations Diplomatiques", category: "conversation", duration: 55 },
      { titleRu: "Политические дебаты", titleFr: "Débats Politiques", category: "conversation", duration: 50 },
      { titleRu: "Академическая дискуссия", titleFr: "Discussion Académique", category: "conversation", duration: 50 },
      { titleRu: "Судебное заседание", titleFr: "Audience Judiciaire", category: "conversation", duration: 55 },
      { titleRu: "Медицинская консультация", titleFr: "Consultation Médicale", category: "conversation", duration: 45 },
    ],
    business: [
      { titleRu: "Международные контракты", titleFr: "Contrats Internationaux", category: "business", duration: 50 },
      { titleRu: "Корпоративное право", titleFr: "Droit des Sociétés", category: "business", duration: 50 },
      { titleRu: "Инвестиции", titleFr: "Investissements", category: "business", duration: 45 },
      { titleRu: "Слияния и поглощения", titleFr: "Fusions et Acquisitions", category: "business", duration: 50 },
    ],
  },
  C1: {
    vocabulary: [
      { titleRu: "Высокий стиль", titleFr: "Style Soutenu", category: "vocabulary", duration: 55 },
      { titleRu: "Литературный язык", titleFr: "Langue Littéraire", category: "vocabulary", duration: 55 },
      { titleRu: "Поэтический язык", titleFr: "Langue Poétique", category: "vocabulary", duration: 50 },
      { titleRu: "Церковнославянизмы", titleFr: "Slavon d'Église", category: "vocabulary", duration: 50 },
      { titleRu: "Канцелярский стиль", titleFr: "Style Administratif", category: "vocabulary", duration: 50 },
      { titleRu: "Научный стиль", titleFr: "Style Scientifique", category: "vocabulary", duration: 55 },
      { titleRu: "Публицистический стиль", titleFr: "Style Journalistique", category: "vocabulary", duration: 50 },
    ],
    grammar: [
      { titleRu: "Сложный синтаксис", titleFr: "Syntaxe Complexe", category: "grammar", duration: 60 },
      { titleRu: "Инверсия", titleFr: "Inversion", category: "grammar", duration: 50 },
      { titleRu: "Эллипсис", titleFr: "Ellipse", category: "grammar", duration: 45 },
      { titleRu: "Анафора", titleFr: "Anaphore", category: "grammar", duration: 45 },
      { titleRu: "Метафора", titleFr: "Métaphore", category: "grammar", duration: 50 },
      { titleRu: "Ирония", titleFr: "Ironie", category: "grammar", duration: 50 },
    ],
    conversation: [
      { titleRu: "Дипломатический протокол", titleFr: "Protocole Diplomatique", category: "conversation", duration: 60 },
      { titleRu: "Официальные речи", titleFr: "Discours Officiels", category: "conversation", duration: 55 },
      { titleRu: "Торжественные мероприятия", titleFr: "Cérémonies Officielles", category: "conversation", duration: 55 },
      { titleRu: "Международные саммиты", titleFr: "Sommets Internationaux", category: "conversation", duration: 60 },
    ],
    business: [
      { titleRu: "Высший менеджмент", titleFr: "Top Management", category: "business", duration: 55 },
      { titleRu: "Стратегическое планирование", titleFr: "Planification Stratégique", category: "business", duration: 55 },
      { titleRu: "Корпоративное управление", titleFr: "Gouvernance d'Entreprise", category: "business", duration: 55 },
    ],
  },
};

// Tone registers
const TONES = ['dirty', 'slang', 'informal', 'formal', 'diplomatic'];

// XP values by level
const XP_BY_LEVEL = {
  A1: { min: 30, max: 80 },
  A2: { min: 50, max: 120 },
  B1: { min: 80, max: 180 },
  B2: { min: 120, max: 250 },
  C1: { min: 180, max: 350 },
};

// Generate vocabulary items for a lesson
function generateVocabulary(level, tone, category) {
  const vocabSets = {
    dirty: {
      A1: [
        { russian: "Блин", french: "Merde (soft)", pronunciation: "bleen", example: "Блин, я опоздал!" },
        { russian: "Чёрт", french: "Putain", pronunciation: "chyort", example: "Чёрт возьми!" },
        { russian: "Фигня", french: "Conneries", pronunciation: "fign-ya", example: "Это полная фигня." },
        { russian: "Достал", french: "Tu me saoules", pronunciation: "dos-tal", example: "Ты меня достал!" },
        { russian: "Отвали", french: "Dégage", pronunciation: "ot-va-li", example: "Отвали от меня!" },
      ],
      A2: [
        { russian: "Задолбал", french: "Tu me fais chier", pronunciation: "za-dol-bal", example: "Он меня задолбал." },
        { russian: "Капец", french: "C'est la merde", pronunciation: "ka-pets", example: "Капец, что делать?" },
        { russian: "Офигеть", french: "Putain (surprise)", pronunciation: "o-fi-get", example: "Офигеть, это правда?" },
      ],
      B1: [
        { russian: "Охренеть", french: "Putain de merde", pronunciation: "o-khre-net", example: "Охренеть можно!" },
        { russian: "Пипец", french: "C'est foutu", pronunciation: "pi-pets", example: "Полный пипец." },
      ],
    },
    slang: {
      A1: [
        { russian: "Круто", french: "Trop cool", pronunciation: "kru-to", example: "Это круто!" },
        { russian: "Чувак", french: "Mec", pronunciation: "chu-vak", example: "Привет, чувак!" },
        { russian: "Тусить", french: "Faire la fête", pronunciation: "tu-sit", example: "Пойдём тусить?" },
        { russian: "Кайф", french: "Le pied", pronunciation: "kayf", example: "Это кайф!" },
        { russian: "Прикольно", french: "Sympa/Cool", pronunciation: "pri-kol-no", example: "Прикольно выглядит!" },
      ],
      A2: [
        { russian: "Чё?", french: "Quoi?", pronunciation: "cho", example: "Чё ты сказал?" },
        { russian: "Норм", french: "OK/Normal", pronunciation: "norm", example: "Всё норм." },
        { russian: "Зашибись", french: "Génial", pronunciation: "za-shi-bis", example: "Зашибись!" },
      ],
      B1: [
        { russian: "Рофлить", french: "Se marrer", pronunciation: "rof-lit", example: "Мы рофлили весь день." },
        { russian: "Хайп", french: "Hype", pronunciation: "khayp", example: "Это чистый хайп." },
      ],
    },
    informal: {
      A1: [
        { russian: "Привет", french: "Salut", pronunciation: "pri-vyet", example: "Привет! Как дела?" },
        { russian: "Пока", french: "Salut (au revoir)", pronunciation: "po-ka", example: "Пока, увидимся!" },
        { russian: "Как дела?", french: "Comment ça va?", pronunciation: "kak de-la", example: "Привет! Как дела?" },
        { russian: "Давай", french: "Allez/OK", pronunciation: "da-vay", example: "Давай пойдём!" },
        { russian: "Ладно", french: "D'accord", pronunciation: "lad-no", example: "Ладно, согласен." },
      ],
      A2: [
        { russian: "Классно", french: "Super", pronunciation: "klas-no", example: "Классно провели время!" },
        { russian: "Отлично", french: "Excellent", pronunciation: "ot-lich-no", example: "Отлично сделано!" },
        { russian: "Здорово", french: "Génial", pronunciation: "zdo-ro-vo", example: "Здорово, что ты пришёл!" },
      ],
      B1: [
        { russian: "По-моему", french: "À mon avis", pronunciation: "po-mo-ye-mu", example: "По-моему, это хорошая идея." },
        { russian: "Кстати", french: "Au fait", pronunciation: "ksta-ti", example: "Кстати, я забыл сказать..." },
      ],
    },
    formal: {
      A1: [
        { russian: "Здравствуйте", french: "Bonjour (formel)", pronunciation: "zdra-stvuy-te", example: "Здравствуйте, как ваши дела?" },
        { russian: "До свидания", french: "Au revoir", pronunciation: "do svi-da-ni-ya", example: "До свидания, было приятно." },
        { russian: "Спасибо", french: "Merci", pronunciation: "spa-si-bo", example: "Спасибо за помощь." },
        { russian: "Пожалуйста", french: "S'il vous plaît", pronunciation: "po-zha-luy-sta", example: "Пожалуйста, садитесь." },
        { russian: "Извините", french: "Excusez-moi", pronunciation: "iz-vi-ni-te", example: "Извините за опоздание." },
      ],
      A2: [
        { russian: "Благодарю", french: "Je vous remercie", pronunciation: "bla-go-da-ryu", example: "Благодарю вас за внимание." },
        { russian: "Разрешите", french: "Permettez-moi", pronunciation: "raz-re-shi-te", example: "Разрешите представиться." },
        { russian: "Будьте добры", french: "Soyez aimable", pronunciation: "bud-te dob-ry", example: "Будьте добры, подождите." },
      ],
      B1: [
        { russian: "Соблаговолите", french: "Veuillez", pronunciation: "sob-la-go-vo-li-te", example: "Соблаговолите ответить." },
        { russian: "Имею честь", french: "J'ai l'honneur", pronunciation: "i-me-yu chest", example: "Имею честь представить..." },
      ],
    },
    diplomatic: {
      A1: [
        { russian: "Уважаемый", french: "Cher/Honorable", pronunciation: "u-va-zha-ye-my", example: "Уважаемый господин посол..." },
        { russian: "С уважением", french: "Cordialement", pronunciation: "s u-va-zhe-ni-yem", example: "С уважением, Иван Петров." },
        { russian: "Позвольте", french: "Permettez-moi", pronunciation: "poz-vol-te", example: "Позвольте выразить..." },
      ],
      A2: [
        { russian: "Имею честь", french: "J'ai l'honneur", pronunciation: "i-me-yu chest", example: "Имею честь сообщить..." },
        { russian: "Ваше превосходительство", french: "Votre Excellence", pronunciation: "va-she pre-vos-kho-di-tel-stvo", example: "Ваше превосходительство..." },
      ],
      B1: [
        { russian: "Примите уверения", french: "Veuillez agréer", pronunciation: "pri-mi-te u-ve-re-ni-ya", example: "Примите уверения в моём уважении." },
        { russian: "Соблаговолите принять", french: "Daignez accepter", pronunciation: "sob-la-go-vo-li-te pri-nyat", example: "Соблаговолите принять мои извинения." },
      ],
      B2: [
        { russian: "Глубокоуважаемый", french: "Très honoré", pronunciation: "glu-bo-ko-u-va-zha-ye-my", example: "Глубокоуважаемый господин министр..." },
        { russian: "С глубочайшим почтением", french: "Avec le plus profond respect", pronunciation: "s glu-bo-chay-shim poch-te-ni-yem", example: "С глубочайшим почтением..." },
      ],
    },
  };
  
  const levelVocab = vocabSets[tone]?.[level] || vocabSets[tone]?.A1 || vocabSets.informal.A1;
  return levelVocab;
}

// Generate grammar points
function generateGrammar(level, category) {
  const grammarPoints = {
    A1: [
      { rule: "Le genre des noms russes", explanation: "Les noms russes sont masculins (consonnes), féminins (-а/-я) ou neutres (-о/-е). Ex: стол (m), книга (f), окно (n)." },
      { rule: "Les pronoms personnels", explanation: "Я (je), Ты (tu), Он/Она/Оно (il/elle), Мы (nous), Вы (vous), Они (ils/elles). Вы est aussi la forme de politesse." },
      { rule: "La conjugaison au présent", explanation: "Les verbes russes se conjuguent selon deux groupes. Groupe 1: -ю, -ешь, -ет, -ем, -ете, -ют. Groupe 2: -ю, -ишь, -ит, -им, -ите, -ят." },
    ],
    A2: [
      { rule: "Les cas en russe", explanation: "Le russe utilise 6 cas: nominatif (sujet), génitif (possession), datif (attribution), accusatif (COD), instrumental (moyen), prépositionnel (lieu)." },
      { rule: "L'aspect verbal", explanation: "Chaque verbe russe a deux aspects: imperfectif (action en cours/répétée) et perfectif (action complète/unique). Ex: читать/прочитать." },
      { rule: "Les verbes de mouvement", explanation: "Le russe distingue les verbes de mouvement unidirectionnels (идти) et multidirectionnels (ходить). Cette distinction est unique au russe." },
    ],
    B1: [
      { rule: "Les participes", explanation: "Les participes russes peuvent être actifs (présent -ущ-/-ющ-, passé -вш-) ou passifs (présent -ем-/-им-, passé -нн-/-т-). Ils s'accordent comme des adjectifs." },
      { rule: "Le conditionnel", explanation: "Formé avec la particule бы + passé du verbe. Ex: Я бы пошёл (J'irais). La particule peut être placée avant ou après le verbe." },
      { rule: "Le discours indirect", explanation: "En russe, le temps du verbe dans le discours indirect reste le même que dans le discours direct. Seuls les pronoms changent." },
    ],
    B2: [
      { rule: "La stylistique russe", explanation: "Le russe distingue plusieurs registres: разговорный (familier), нейтральный (neutre), книжный (littéraire), официальный (officiel). Chaque registre a son vocabulaire propre." },
      { rule: "Les idiomes russes", explanation: "Les expressions idiomatiques russes reflètent la culture. Ex: душа в душу (en parfaite harmonie), как рыба в воде (comme un poisson dans l'eau)." },
      { rule: "La phraséologie", explanation: "Les collocations russes sont fixes. Ex: принимать решение (prendre une décision), не играть роли (ne pas avoir d'importance)." },
    ],
    C1: [
      { rule: "Le style diplomatique", explanation: "Le langage diplomatique russe utilise des formules élaborées: Имею честь..., Примите уверения..., С глубоким уважением... Ces formules suivent un protocole strict." },
      { rule: "La rhétorique russe", explanation: "Les figures de style en russe: анафора (répétition en début), градация (progression), риторический вопрос. Maîtriser ces figures est essentiel pour le discours formel." },
      { rule: "L'inversion stylistique", explanation: "L'ordre des mots en russe est flexible mais significatif. L'information nouvelle vient généralement en fin de phrase. L'inversion crée des effets stylistiques." },
    ],
  };
  
  return grammarPoints[level] || grammarPoints.A1;
}

// Generate dialogue
function generateDialogue(level, tone, category) {
  const dialogues = {
    dirty: {
      A1: [
        { speaker: "A", russian: "Блин, опять дождь!", french: "Merde, encore la pluie!" },
        { speaker: "B", russian: "Да, достало уже.", french: "Ouais, ça fait chier." },
        { speaker: "A", russian: "Пойдём в бар?", french: "On va au bar?" },
        { speaker: "B", russian: "Давай, фигня вопрос!", french: "Allez, pas de problème!" },
      ],
    },
    slang: {
      A1: [
        { speaker: "A", russian: "Йо, чувак! Как сам?", french: "Yo, mec! Comment ça va?" },
        { speaker: "B", russian: "Норм, а ты?", french: "Ça va, et toi?" },
        { speaker: "A", russian: "Тоже круто! Тусить идём?", french: "Aussi cool! On sort?" },
        { speaker: "B", russian: "Кайф! Погнали!", french: "Génial! C'est parti!" },
      ],
    },
    informal: {
      A1: [
        { speaker: "A", russian: "Привет! Как дела?", french: "Salut! Comment ça va?" },
        { speaker: "B", russian: "Привет! Всё хорошо, а у тебя?", french: "Salut! Tout va bien, et toi?" },
        { speaker: "A", russian: "Тоже хорошо, спасибо!", french: "Bien aussi, merci!" },
        { speaker: "B", russian: "Что делаешь сегодня?", french: "Qu'est-ce que tu fais aujourd'hui?" },
        { speaker: "A", russian: "Ничего особенного. Хочешь погулять?", french: "Rien de spécial. Tu veux te promener?" },
      ],
    },
    formal: {
      A1: [
        { speaker: "A", russian: "Здравствуйте! Как ваши дела?", french: "Bonjour! Comment allez-vous?" },
        { speaker: "B", russian: "Здравствуйте! Спасибо, хорошо. А ваши?", french: "Bonjour! Merci, bien. Et vous?" },
        { speaker: "A", russian: "Благодарю, всё в порядке.", french: "Merci, tout va bien." },
        { speaker: "B", russian: "Очень приятно познакомиться.", french: "Enchanté de faire votre connaissance." },
        { speaker: "A", russian: "Мне тоже очень приятно.", french: "Moi aussi, enchanté." },
      ],
    },
    diplomatic: {
      B1: [
        { speaker: "A", russian: "Ваше Превосходительство, позвольте выразить глубокую благодарность.", french: "Votre Excellence, permettez-moi d'exprimer ma profonde gratitude." },
        { speaker: "B", russian: "Благодарю вас за тёплые слова.", french: "Je vous remercie pour ces mots chaleureux." },
        { speaker: "A", russian: "Имею честь представить делегацию нашей страны.", french: "J'ai l'honneur de présenter la délégation de notre pays." },
        { speaker: "B", russian: "Добро пожаловать. Мы рады приветствовать вас.", french: "Bienvenue. Nous sommes heureux de vous accueillir." },
      ],
    },
  };
  
  return dialogues[tone]?.[level] || dialogues[tone]?.A1 || dialogues.informal.A1;
}

// Main bulk generation function
async function generateBulkLessons(batchNumber = 1) {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in environment");
    process.exit(1);
  }

  console.log(`\n🚀 Starting Bulk Lesson Generation - Batch ${batchNumber}`);
  console.log(`📊 Target: 500 lessons per batch\n`);

  const connection = await mysql.createConnection(DATABASE_URL);
  
  const lessons = [];
  let lessonCount = 0;
  const targetCount = 500;
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
  
  // Calculate starting lesson number based on batch
  const startLessonNumber = (batchNumber - 1) * 500 + 1;
  
  // Generate lessons until we reach 500
  while (lessonCount < targetCount) {
    for (const level of levels) {
      if (lessonCount >= targetCount) break;
      
      const templates = LESSON_TEMPLATES[level];
      if (!templates) continue;
      
      for (const categoryKey of Object.keys(templates)) {
        if (lessonCount >= targetCount) break;
        
        for (const template of templates[categoryKey]) {
          if (lessonCount >= targetCount) break;
          
          for (const tone of TONES) {
            if (lessonCount >= targetCount) break;
            
            const xpRange = XP_BY_LEVEL[level];
            const xp = Math.floor(Math.random() * (xpRange.max - xpRange.min + 1)) + xpRange.min;
            
            const lessonNumber = startLessonNumber + lessonCount;
            
            // Match schema columns: title, titleFr, description, descriptionFr, level, category, tone, lessonNumber, vocabulary, grammar, dialogue, culturalNotes, culturalNotesFr, pronunciationGuide, estimatedMinutes, xpReward
            const lesson = {
              title: template.titleRu,
              titleFr: template.titleFr,
              description: `Leçon de russe: ${template.titleRu} - Niveau ${level}, Registre ${tone}`,
              descriptionFr: `Apprenez ${template.titleFr} en russe avec le registre ${tone === 'dirty' ? 'vulgaire' : tone === 'slang' ? 'argot' : tone === 'informal' ? 'informel' : tone === 'formal' ? 'formel' : 'diplomatique'}.`,
              level,
              category: template.category,
              tone,
              lessonNumber,
              vocabulary: JSON.stringify(generateVocabulary(level, tone, template.category)),
              grammar: JSON.stringify(generateGrammar(level, template.category)),
              dialogue: JSON.stringify(generateDialogue(level, tone, template.category)),
              culturalNotes: `Notes culturelles pour ${template.titleRu}`,
              culturalNotesFr: `Cette leçon vous enseigne ${template.titleFr} dans un contexte culturel russe authentique.`,
              pronunciationGuide: JSON.stringify({
                tips: "Conseils de prononciation pour cette leçon",
                audioGuide: "pronunciation_guide.mp3"
              }),
              estimatedMinutes: template.duration,
              xpReward: xp,
            };
            
            lessons.push(lesson);
            lessonCount++;
            
            if (lessonCount % 50 === 0) {
              console.log(`📝 Generated ${lessonCount}/${targetCount} lessons...`);
            }
          }
        }
      }
    }
    
    // If we haven't reached target, cycle through again with variations
    if (lessonCount < targetCount) {
      for (const level of levels) {
        if (lessonCount >= targetCount) break;
        
        const templates = LESSON_TEMPLATES[level];
        if (!templates) continue;
        
        for (const categoryKey of Object.keys(templates)) {
          if (lessonCount >= targetCount) break;
          
          for (const template of templates[categoryKey]) {
            if (lessonCount >= targetCount) break;
            
            // Create variation with different order
            const variationNum = Math.floor(lessonCount / 100) + 2;
            const tone = TONES[lessonCount % TONES.length];
            const xpRange = XP_BY_LEVEL[level];
            const xp = Math.floor(Math.random() * (xpRange.max - xpRange.min + 1)) + xpRange.min;
            
            const lessonNumber = startLessonNumber + lessonCount;
            
            const lesson = {
              title: `${template.titleRu} (Часть ${variationNum})`,
              titleFr: `${template.titleFr} (Partie ${variationNum})`,
              description: `Leçon avancée: ${template.titleRu} - Partie ${variationNum}`,
              descriptionFr: `Approfondissez ${template.titleFr} avec des exercices avancés.`,
              level,
              category: template.category,
              tone,
              lessonNumber,
              vocabulary: JSON.stringify(generateVocabulary(level, tone, template.category)),
              grammar: JSON.stringify(generateGrammar(level, template.category)),
              dialogue: JSON.stringify(generateDialogue(level, tone, template.category)),
              culturalNotes: `Notes culturelles avancées pour ${template.titleRu}`,
              culturalNotesFr: `Approfondissement culturel de ${template.titleFr}.`,
              pronunciationGuide: JSON.stringify({
                tips: "Conseils de prononciation avancés",
                audioGuide: "pronunciation_advanced.mp3"
              }),
              estimatedMinutes: template.duration + 5,
              xpReward: xp + 10,
            };
            
            lessons.push(lesson);
            lessonCount++;
            
            if (lessonCount % 50 === 0) {
              console.log(`📝 Generated ${lessonCount}/${targetCount} lessons...`);
            }
          }
        }
      }
    }
  }

  console.log(`\n✅ Generated ${lessons.length} lessons`);
  console.log(`📤 Inserting into database...\n`);

  // Insert in batches of 50
  const batchSize = 50;
  let inserted = 0;
  
  for (let i = 0; i < lessons.length; i += batchSize) {
    const batch = lessons.slice(i, i + batchSize);
    
    const values = batch.map(l => [
      l.title, l.titleFr, l.description, l.descriptionFr, l.level, l.category, l.tone,
      l.lessonNumber, l.vocabulary, l.grammar, l.dialogue, l.culturalNotes, 
      l.culturalNotesFr, l.pronunciationGuide, l.estimatedMinutes, l.xpReward
    ]);
    
    const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
    
    await connection.execute(
      `INSERT INTO lessons (title, titleFr, description, descriptionFr, level, category, tone, lessonNumber, vocabulary, grammar, dialogue, culturalNotes, culturalNotesFr, pronunciationGuide, estimatedMinutes, xpReward) VALUES ${placeholders}`,
      values.flat()
    );
    
    inserted += batch.length;
    console.log(`📥 Inserted ${inserted}/${lessons.length} lessons...`);
  }

  await connection.end();
  
  console.log(`\n🎉 Batch ${batchNumber} Complete!`);
  console.log(`📊 Total lessons inserted: ${lessons.length}`);
  console.log(`📈 Levels covered: ${levels.join(', ')}`);
  console.log(`🎭 Tones covered: ${TONES.join(', ')}`);
  console.log(`📚 Lesson numbers: ${startLessonNumber} - ${startLessonNumber + lessons.length - 1}`);
}

// Run the generator
const batchNumber = parseInt(process.argv[2]) || 1;
generateBulkLessons(batchNumber).catch(console.error);
