CREATE TABLE `ai_provider_keys` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL DEFAULT 'local',
	`provider` text NOT NULL,
	`api_key` text NOT NULL,
	`model` text NOT NULL DEFAULT '',
	`created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX `ai_provider_keys_user_provider_unique`
	ON `ai_provider_keys` (`user_id`, `provider`);

-- Carry existing single-provider configurations over to the per-provider table.
INSERT INTO `ai_provider_keys` (`user_id`, `provider`, `api_key`, `model`, `created_at`, `updated_at`)
SELECT `user_id`, `provider`, `api_key`, `model`, `created_at`, `updated_at`
FROM `ai_settings`
WHERE `api_key` <> '';
