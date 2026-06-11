-- Update pre-seeded ingredients to belong to 'system'
UPDATE ingredients SET user_id = 'system' WHERE user_id = 'local';

-- Update pre-seeded recipes to belong to 'system'
UPDATE recipes SET user_id = 'system' WHERE user_id = 'local';
