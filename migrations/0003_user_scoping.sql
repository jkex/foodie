ALTER TABLE `recipes` ADD COLUMN `user_id` text DEFAULT 'local' NOT NULL;
ALTER TABLE `ingredients` ADD COLUMN `user_id` text DEFAULT 'local' NOT NULL;
ALTER TABLE `meal_plans` ADD COLUMN `user_id` text DEFAULT 'local' NOT NULL;
ALTER TABLE `ai_settings` ADD COLUMN `user_id` text DEFAULT 'local' NOT NULL;
DROP INDEX IF EXISTS `ingredients_name_unique`;
CREATE UNIQUE INDEX `ingredients_user_name_unique` ON `ingredients` (`user_id`,`name`);
CREATE INDEX `idx_recipes_user` ON `recipes` (`user_id`);
CREATE INDEX `idx_meal_plans_user` ON `meal_plans` (`user_id`);
CREATE UNIQUE INDEX `ai_settings_user_unique` ON `ai_settings` (`user_id`);
