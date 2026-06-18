CREATE TABLE `recipe_rotation_state` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`recipe_id` integer NOT NULL REFERENCES `recipes`(`id`) ON DELETE CASCADE,
	`last_cooked_at` text,
	`rotation_index` integer NOT NULL DEFAULT 0,
	`updated_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX `recipe_rotation_state_user_recipe_unique`
	ON `recipe_rotation_state` (`user_id`, `recipe_id`);

CREATE INDEX `idx_recipe_rotation_state_user`
	ON `recipe_rotation_state` (`user_id`, `last_cooked_at`, `rotation_index`);
