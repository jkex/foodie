CREATE TABLE `ai_usage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`window_started_at` text NOT NULL,
	`request_count` integer DEFAULT 0 NOT NULL
);
CREATE UNIQUE INDEX `ai_usage_user_window_unique` ON `ai_usage` (`user_id`,`window_started_at`);
