CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`nameFr` varchar(100) NOT NULL,
	`description` text,
	`descriptionFr` text,
	`icon` varchar(50),
	`xpReward` int DEFAULT 100,
	`requirement` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`role` enum('user','assistant','system') NOT NULL,
	`content` text NOT NULL,
	`vocabularyHighlights` json,
	`grammarTip` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tone` enum('dirty','slang','informal','formal','diplomatic') DEFAULT 'informal',
	`topic` varchar(255),
	`level` enum('A1','A2','B1','B2','C1') DEFAULT 'A1',
	`messagesCount` int DEFAULT 0,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chatSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exerciseResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`exerciseId` int NOT NULL,
	`userAnswer` text,
	`isCorrect` boolean DEFAULT false,
	`attemptNumber` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exerciseResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lessonId` int NOT NULL,
	`type` enum('fill_blank','multiple_choice','translation','listening','speaking','matching') NOT NULL,
	`questionRu` text NOT NULL,
	`questionFr` text NOT NULL,
	`options` json,
	`correctAnswer` text NOT NULL,
	`explanationFr` text,
	`audioUrl` varchar(500),
	`points` int DEFAULT 10,
	`difficulty` enum('easy','medium','hard') DEFAULT 'medium',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `generatedSongs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`lyrics` text NOT NULL,
	`lyricsFr` text,
	`style` varchar(100) DEFAULT 'rap',
	`level` enum('A1','A2','B1','B2','C1') DEFAULT 'A1',
	`tone` enum('dirty','slang','informal','formal','diplomatic') DEFAULT 'slang',
	`audioUrl` varchar(500),
	`sunoTaskId` varchar(100),
	`status` enum('pending','generating','completed','failed') DEFAULT 'pending',
	`vocabulary` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `generatedSongs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`titleFr` varchar(255) NOT NULL,
	`description` text,
	`descriptionFr` text,
	`level` enum('A1','A2','B1','B2','C1') NOT NULL,
	`category` varchar(100) NOT NULL,
	`tone` enum('dirty','slang','informal','formal','diplomatic') DEFAULT 'informal',
	`lessonNumber` int NOT NULL,
	`vocabulary` json,
	`grammar` json,
	`dialogue` json,
	`culturalNotes` text,
	`culturalNotesFr` text,
	`pronunciationGuide` json,
	`estimatedMinutes` int DEFAULT 15,
	`xpReward` int DEFAULT 50,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userAchievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementId` int NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userAchievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`lessonId` int NOT NULL,
	`status` enum('not_started','in_progress','completed') DEFAULT 'not_started',
	`score` int DEFAULT 0,
	`timeSpentMinutes` int DEFAULT 0,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `currentLevel` enum('A1','A2','B1','B2','C1') DEFAULT 'A1';--> statement-breakpoint
ALTER TABLE `users` ADD `preferredTone` enum('dirty','slang','informal','formal','diplomatic') DEFAULT 'informal';--> statement-breakpoint
ALTER TABLE `users` ADD `dailySongsUsed` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `lastSongResetDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `totalLessonsCompleted` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `totalXp` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `streak` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `lastActivityDate` timestamp;