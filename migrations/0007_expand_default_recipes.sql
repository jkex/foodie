-- Refresh the system recipe catalogue without replacing recipe IDs that may
-- already be referenced by meal plans.
--
-- Design targets:
-- - exactly 50 varied recipes, all written for two average adults
-- - two-day meal-prep blocks by default
-- - vegetables/fruit, whole grains and pulses as the foundation
-- - mostly unsaturated fats, no added free sugar, and low-sodium ingredients
-- - fish, poultry, eggs and dairy in a smaller supporting role

-- Correct one spelling and turn the second, near-identical chilli into a stew.
UPDATE recipes
SET name = 'Roasted Vegetable Buddha Bowl'
WHERE user_id = 'system' AND name = 'Roasted Veggie Buddah Bowl';

UPDATE recipes
SET name = 'Mushroom Barley Stew'
WHERE user_id = 'system' AND name = 'Vegan Chili Sin Carne';

UPDATE recipes
SET name = 'Tempeh Vegetable Stir-Fry'
WHERE user_id = 'system' AND name = 'Tempeh Maple-Glazed Stir Fry';

UPDATE recipes
SET name = 'Butternut Squash Lentil Soup'
WHERE user_id = 'system' AND name = 'Butternut Squash Soup';

UPDATE recipes
SET name = 'Green Edamame Barley Salad'
WHERE user_id = 'system' AND name = 'Green Edamame Salad';

CREATE TABLE _migration_0007_default_recipe_seed (
  name TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  rotation_index INTEGER NOT NULL
);

INSERT INTO _migration_0007_default_recipe_seed (name, description, instructions, rotation_index) VALUES
('Overnight Oats with Chia and Berries', 'Whole-grain breakfast with berries, seeds and no added sugar.', '1. Mix oats, chia seeds, milk and cinnamon in two jars.
2. Refrigerate overnight.
3. Add berries before eating; keep chilled for up to two days.', 1),
('Tofu Scramble Breakfast Burrito', 'Protein-rich whole-grain wraps with beans and vegetables.', '1. Saute mushrooms and spinach in oil, then add crumbled tofu, beans and turmeric.
2. Divide between whole-grain wraps and roll tightly.
3. Refrigerate and reheat in a dry pan or microwave.', 2),
('Classic Lentil Shepherd''s Pie', 'Lentil and vegetable bake under an olive-oil potato topping.', '1. Boil the potatoes and mash with milk and half the oil.
2. Simmer lentils, carrots, peas and onion in low-sodium broth.
3. Top the filling with mash and bake at 200 C for 25 minutes.', 3),
('Mediterranean Chickpea Salad', 'Fresh high-fibre salad with chickpeas, vegetables and whole-grain bulgur.', '1. Cover bulgur with boiling water and leave for 12 minutes.
2. Mix with chickpeas, cucumber, tomatoes and parsley.
3. Dress with lemon juice and olive oil; refrigerate.', 4),
('Spicy Black Bean Chili', 'Smoky bean, sweet-potato and pepper chilli that reheats well.', '1. Soften onion and pepper in oil.
2. Add beans, sweet potato, tomatoes, cumin and paprika.
3. Simmer for 25 minutes and portion with brown rice.', 5),
('Coconut Chickpea Curry', 'Vegetable-rich chickpea curry made with light coconut milk.', '1. Cook onion, cauliflower and curry powder in oil for 5 minutes.
2. Add chickpeas, tomatoes and light coconut milk; simmer for 18 minutes.
3. Fold in spinach and serve with brown rice.', 6),
('Quinoa Salad with Sweet Potato', 'Colourful quinoa salad with roasted vegetables and pumpkin seeds.', '1. Roast sweet potato and broccoli at 200 C for 25 minutes.
2. Cook quinoa and let it cool slightly.
3. Mix everything with spinach, lemon juice and pumpkin seeds.', 7),
('Creamy Tuscan White Bean Soup', 'Creamy without cream: white beans, tomatoes and kale.', '1. Soften onion, carrot and garlic in oil.
2. Add beans, tomatoes and low-sodium broth; simmer for 20 minutes.
3. Blend one quarter of the soup, return it to the pot and add kale.', 8),
('Stir-Fry Tofu with Broccoli', 'Quick tofu and vegetable stir-fry with whole-grain rice.', '1. Brown tofu in half the oil and remove.
2. Stir-fry broccoli, pepper, ginger and garlic.
3. Return tofu, add reduced-salt soy sauce and serve with brown rice.', 9),
('Lentil Bolognese with Pasta', 'Whole-wheat pasta with a vegetable-packed lentil tomato sauce.', '1. Soften onion, carrot, celery and garlic in oil.
2. Add lentils and tomatoes; simmer for 25 minutes.
3. Cook whole-wheat pasta and combine with the sauce.', 10),
('Roasted Vegetable Buddha Bowl', 'Roasted vegetables, chickpeas and brown rice with lemon tahini.', '1. Roast chickpeas, broccoli and sweet potato at 200 C for 25 minutes.
2. Cook the brown rice.
3. Divide into containers and add tahini thinned with lemon juice and water.', 11),
('Tempeh Vegetable Stir-Fry', 'Tempeh with three vegetables in a light ginger-sesame sauce.', '1. Brown tempeh in half the oil.
2. Add snap peas, pepper and cabbage and stir-fry until just tender.
3. Add ginger, reduced-salt soy sauce and the remaining sesame oil.', 12),
('Mexican Quinoa Salad', 'Quinoa, black beans and crunchy vegetables with lime.', '1. Cook quinoa and cool it.
2. Mix with beans, corn, pepper, tomatoes and coriander.
3. Dress with lime juice and olive oil and refrigerate.', 13),
('Peanut Noodle Salad with Tofu', 'Soba, tofu and crisp vegetables with a modest peanut dressing.', '1. Cook and rinse the soba noodles; bake or pan-sear the tofu.
2. Whisk peanut butter, lime juice, reduced-salt soy sauce and water.
3. Toss with cabbage, carrot and cucumber.', 14),
('Red Lentil Dahl', 'Red lentils, spinach and tomato with brown basmati rice.', '1. Soften onion, garlic and ginger in oil; add spices.
2. Add lentils, tomatoes and water and simmer for 22 minutes.
3. Fold in spinach and serve with brown basmati rice.', 15),
('Tofu Souvlaki Salad Bowl', 'Lemon-oregano tofu with vegetables and whole-grain couscous.', '1. Cover couscous with boiling water and leave for 8 minutes.
2. Brown tofu with oregano and half the oil.
3. Combine with cucumber, tomatoes, pepper, lemon juice and remaining oil.', 16),
('Butternut Squash Lentil Soup', 'Thick squash and red-lentil soup with seeds for texture.', '1. Soften onion and garlic in oil.
2. Add squash, lentils and low-sodium broth; simmer for 25 minutes.
3. Blend partly and top with pumpkin seeds.', 17),
('Black Bean Quinoa Burgers', 'Baked bean patties with whole-grain buns and crunchy slaw.', '1. Mash beans with cooked quinoa, oats, cumin and grated carrot.
2. Shape four small patties and bake at 200 C for 20 minutes.
3. Serve in whole-grain buns with cabbage and tomato.', 18),
('Green Edamame Barley Salad', 'Edamame, barley and green vegetables with a lemon dressing.', '1. Cook pearl barley until tender and cool it.
2. Steam edamame and broccoli for 4 minutes.
3. Mix with cucumber, spinach, lemon juice and olive oil.', 19),
('Mushroom Barley Stew', 'Earthy mushroom, barley and white-bean stew for cold days.', '1. Brown mushrooms, onion and carrot in oil.
2. Add barley, beans, thyme and low-sodium broth.
3. Simmer for 35 minutes, adding kale for the final 5 minutes.', 20),
('Apple Walnut Baked Oats', 'Batch-baked oats with apple, walnuts and naturally sweet spices.', '1. Mix oats, grated apple, milk, egg, walnuts and cinnamon.
2. Bake in a small dish at 180 C for 25 minutes.
3. Cool, divide and refrigerate.', 21),
('Spinach Mushroom Egg Muffins', 'Vegetable egg muffins with rye bread for an easy breakfast.', '1. Saute mushrooms and spinach briefly.
2. Mix with beaten eggs and spoon into six muffin cups.
3. Bake at 180 C for 18 minutes and serve with rye bread and tomatoes.', 22),
('Yogurt Oat Berry Pots', 'High-protein yogurt pots with oats, fruit and flaxseed.', '1. Divide yogurt, oats and ground flaxseed between two jars.
2. Add berries and chopped pear.
3. Refrigerate for up to two days.', 23),
('Minestrone with Beans and Whole-Wheat Pasta', 'Italian vegetable soup with beans and whole-wheat pasta.', '1. Soften onion, carrot, celery and courgette in oil.
2. Add tomatoes, beans and low-sodium broth; simmer for 15 minutes.
3. Add pasta and cook until tender, then stir in spinach.', 24),
('Split Pea Root Vegetable Soup', 'Economical split-pea soup with carrots, leek and celeriac.', '1. Rinse split peas and add them to a pot with all vegetables and broth.
2. Simmer for 40 minutes until soft.
3. Stir in olive oil and lemon juice before portioning.', 25),
('Tomato Lentil Soup with Rye Bread', 'Simple tomato and lentil soup with a whole-grain side.', '1. Soften onion, carrot and garlic in oil.
2. Add lentils, tomatoes and low-sodium broth and simmer for 25 minutes.
3. Add spinach and serve with rye bread.', 26),
('Chicken Vegetable Barley Soup', 'Lean chicken, barley and abundant vegetables in one pot.', '1. Soften leek, carrot and celery in oil.
2. Add chicken, barley and low-sodium broth; simmer for 30 minutes.
3. Stir in peas for the final 5 minutes.', 27),
('Ratatouille White Bean Bake', 'Oven-baked Mediterranean vegetables with white beans.', '1. Combine aubergine, courgette, pepper, onion, tomatoes, beans and oil.
2. Season with herbs and bake covered at 200 C for 25 minutes.
3. Uncover and bake for another 15 minutes; serve with whole-grain couscous.', 28),
('Cauliflower Chickpea Tray Bake', 'One-tray chickpeas and vegetables with a yogurt-tahini sauce.', '1. Roast cauliflower, chickpeas, carrots and onion with oil and cumin at 210 C for 25 minutes.
2. Mix yogurt, tahini and lemon juice.
3. Serve the tray bake with bulgur and the sauce.', 29),
('Lentil Quinoa Stuffed Peppers', 'Peppers filled with lentils, quinoa, spinach and tomato.', '1. Mix cooked quinoa, lentils, spinach and tomatoes.
2. Fill halved peppers and bake at 190 C for 30 minutes.
3. Cool slightly before portioning.', 30),
('Salmon Broccoli Potato Tray Bake', 'Omega-3-rich salmon with potatoes and two green vegetables.', '1. Roast potatoes with oil at 210 C for 20 minutes.
2. Add broccoli, green beans and salmon.
3. Bake for 14 minutes more and finish with lemon juice.', 31),
('Cod Tomato Olive Bake', 'Lean white fish baked with tomatoes, courgette and a few olives.', '1. Put courgette, tomatoes, onion and oil in a baking dish and bake at 200 C for 15 minutes.
2. Add cod, olives and oregano.
3. Bake for 12 minutes and serve with barley.', 32),
('Chicken Root Vegetable Tray Bake', 'Lean chicken with colourful root vegetables and chickpeas.', '1. Toss chicken, carrots, parsnip, beetroot, chickpeas and oil on a tray.
2. Season with paprika and bake at 200 C for 30 minutes.
3. Add spinach after reheating each portion.', 33),
('Turkey Spinach Meatballs with Couscous', 'Oven-baked lean turkey meatballs in vegetable tomato sauce.', '1. Mix turkey, oats and half the spinach; form small meatballs.
2. Bake at 200 C for 18 minutes.
3. Simmer tomatoes, courgette and remaining spinach, add meatballs and serve with whole-grain couscous.', 34),
('Spinach Potato Frittata', 'Egg, potato and vegetable slices that work hot or cold.', '1. Boil potato slices for 8 minutes.
2. Saute onion, pepper and spinach in an ovenproof pan; add potatoes and beaten eggs.
3. Bake at 190 C for 18 minutes and serve with tomato salad.', 35),
('Whole-Wheat Pasta Primavera', 'Whole-wheat pasta with beans and a broad mix of vegetables.', '1. Cook pasta and reserve a little cooking water.
2. Saute courgette, broccoli, peas and garlic in oil.
3. Add beans, tomatoes, pasta and enough cooking water to coat.', 36),
('Spinach Pea Barley Risotto', 'Creamy pearl barley with peas, spinach and mushrooms.', '1. Brown mushrooms, onion and garlic in oil.
2. Add barley and broth gradually; simmer for about 30 minutes.
3. Stir in peas, spinach and grated hard cheese.', 37),
('Buckwheat Mushroom Pilaf', 'Nutty buckwheat with mushrooms, cabbage and white beans.', '1. Brown mushrooms, onion and cabbage in oil.
2. Add buckwheat and low-sodium broth; cover and simmer for 18 minutes.
3. Fold in beans and parsley.', 38),
('Bulgur Tabbouleh with Lentils', 'Herby bulgur and lentil salad with plenty of fresh vegetables.', '1. Cover bulgur with boiling water for 12 minutes and cool.
2. Mix with lentils, tomatoes, cucumber, parsley and spring onion.
3. Dress with lemon juice and olive oil.', 39),
('Barley Roasted Vegetable Salad', 'Chewy barley, roasted vegetables and chickpeas for meal prep.', '1. Cook barley until tender.
2. Roast aubergine, pepper and courgette with oil at 210 C for 25 minutes.
3. Mix with chickpeas, spinach and lemon juice.', 40),
('Rainbow Slaw Tofu Rice Bowl', 'Crunchy cabbage, tofu and brown rice with a lime-peanut sauce.', '1. Cook rice and brown the tofu.
2. Shred cabbage and carrot and slice the pepper.
3. Whisk peanut butter, lime juice, soy sauce and water and divide everything into containers.', 41),
('Tuna White Bean Salad', 'No-cook tuna, bean and vegetable salad with whole-grain bread.', '1. Drain the tuna and beans.
2. Mix with tomatoes, cucumber, pepper, parsley, lemon juice and oil.
3. Refrigerate and serve with whole-grain bread.', 42),
('Hummus Roasted Vegetable Wraps', 'Whole-grain wraps packed with hummus and roasted vegetables.', '1. Roast courgette, pepper, carrot and chickpeas with oil at 210 C for 25 minutes.
2. Spread wraps with hummus and add spinach and roasted vegetables.
3. Roll tightly; store filling and wraps separately for best texture.', 43),
('Baked Falafel Salad Boxes', 'Baked chickpea patties with bulgur salad and yogurt sauce.', '1. Mash chickpeas with oats, parsley, onion and cumin; shape small patties.
2. Bake at 200 C for 22 minutes.
3. Pack with bulgur, cucumber, tomatoes and yogurt mixed with lemon.', 44),
('Lentil Aubergine Moussaka', 'Layered aubergine, lentils and potatoes with a yogurt topping.', '1. Roast aubergine and potato slices at 210 C for 20 minutes.
2. Simmer lentils, onion and tomatoes for 15 minutes.
3. Layer, top with yogurt and egg, and bake at 190 C for 25 minutes.', 45),
('Whole-Wheat Vegetable Lasagne', 'Vegetable and lentil lasagne with a moderate cheese topping.', '1. Simmer lentils, tomatoes, carrot, courgette and spinach for 20 minutes.
2. Layer with whole-wheat lasagne sheets and yogurt.
3. Top with cheese and bake at 190 C for 35 minutes.', 46),
('Cabbage White Bean Skillet', 'Fast cabbage, bean and potato skillet with mustard and herbs.', '1. Steam potato cubes for 8 minutes.
2. Brown onion, cabbage and potatoes in oil.
3. Add beans, mustard and a splash of water; cover for 8 minutes.', 47),
('Pumpkin Lentil Millet Curry', 'Pumpkin and lentil curry with millet instead of refined rice.', '1. Soften onion, garlic and ginger in oil and add curry powder.
2. Add pumpkin, lentils, tomatoes and water; simmer for 25 minutes.
3. Fold in spinach and serve with cooked millet.', 48),
('Sardine Tomato Whole-Wheat Pasta', 'Calcium- and omega-3-rich sardines with tomato vegetable pasta.', '1. Cook whole-wheat pasta.
2. Soften onion, courgette and garlic in oil; add tomatoes.
3. Fold in sardines and spinach, then combine with pasta.', 49),
('Chicken Chickpea Couscous Salad', 'Lean chicken, chickpeas and crisp vegetables in a lemon dressing.', '1. Cook chicken in a covered pan until done and slice it.
2. Prepare couscous and let it cool.
3. Mix with chickpeas, cucumber, tomatoes, spinach, lemon juice and oil.', 50);

UPDATE recipes
SET
  description = (SELECT description FROM _migration_0007_default_recipe_seed WHERE _migration_0007_default_recipe_seed.name = recipes.name),
  instructions = (SELECT instructions FROM _migration_0007_default_recipe_seed WHERE _migration_0007_default_recipe_seed.name = recipes.name),
  base_servings = 2,
  default_days = 2,
  rotation_index = (SELECT rotation_index FROM _migration_0007_default_recipe_seed WHERE _migration_0007_default_recipe_seed.name = recipes.name),
  updated_at = CURRENT_TIMESTAMP
WHERE user_id = 'system'
  AND EXISTS (SELECT 1 FROM _migration_0007_default_recipe_seed WHERE _migration_0007_default_recipe_seed.name = recipes.name);

INSERT INTO recipes (user_id, name, description, instructions, base_servings, default_days, rotation_index)
SELECT 'system', seed.name, seed.description, seed.instructions, 2, 2, seed.rotation_index
FROM _migration_0007_default_recipe_seed AS seed
WHERE NOT EXISTS (
  SELECT 1 FROM recipes WHERE recipes.user_id = 'system' AND recipes.name = seed.name
);

CREATE TABLE _migration_0007_default_recipe_ingredient_seed (
  recipe_name TEXT NOT NULL,
  ingredient_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT ''
);

INSERT INTO _migration_0007_default_recipe_ingredient_seed
  (recipe_name, ingredient_name, category, quantity, unit, note)
VALUES
('Overnight Oats with Chia and Berries', 'Rolled Oats', 'Dry goods', 100, 'g', 'whole-grain'),
('Overnight Oats with Chia and Berries', 'Chia Seeds', 'Dry goods', 20, 'g', ''),
('Overnight Oats with Chia and Berries', 'Unsweetened Low-Fat Milk', 'Dairy', 300, 'ml', 'or fortified soy drink'),
('Overnight Oats with Chia and Berries', 'Mixed Berries', 'Produce', 200, 'g', 'fresh or frozen'),
('Overnight Oats with Chia and Berries', 'Cinnamon', 'Spices', 1, 'tsp', ''),

('Tofu Scramble Breakfast Burrito', 'Firm Tofu', 'Protein', 250, 'g', 'crumbled'),
('Tofu Scramble Breakfast Burrito', 'Black Beans', 'Canned', 120, 'g', 'drained and rinsed'),
('Tofu Scramble Breakfast Burrito', 'Mushrooms', 'Produce', 150, 'g', 'sliced'),
('Tofu Scramble Breakfast Burrito', 'Spinach', 'Produce', 100, 'g', ''),
('Tofu Scramble Breakfast Burrito', 'Whole-Grain Wraps', 'Dry goods', 2, 'pcs', ''),
('Tofu Scramble Breakfast Burrito', 'Turmeric', 'Spices', 1, 'tsp', ''),
('Tofu Scramble Breakfast Burrito', 'Olive Oil', 'Other', 1, 'tsp', ''),

('Classic Lentil Shepherd''s Pie', 'Potatoes', 'Produce', 350, 'g', ''),
('Classic Lentil Shepherd''s Pie', 'Brown Lentils', 'Dry goods', 130, 'g', 'dry'),
('Classic Lentil Shepherd''s Pie', 'Carrots', 'Produce', 180, 'g', 'diced'),
('Classic Lentil Shepherd''s Pie', 'Peas', 'Frozen', 120, 'g', ''),
('Classic Lentil Shepherd''s Pie', 'Onion', 'Produce', 100, 'g', 'diced'),
('Classic Lentil Shepherd''s Pie', 'Low-Sodium Vegetable Broth', 'Dry goods', 350, 'ml', ''),
('Classic Lentil Shepherd''s Pie', 'Unsweetened Low-Fat Milk', 'Dairy', 80, 'ml', ''),
('Classic Lentil Shepherd''s Pie', 'Olive Oil', 'Other', 2, 'tsp', ''),

('Mediterranean Chickpea Salad', 'Canned Chickpeas', 'Canned', 240, 'g', 'drained and rinsed'),
('Mediterranean Chickpea Salad', 'Whole-Grain Bulgur', 'Dry goods', 100, 'g', 'dry'),
('Mediterranean Chickpea Salad', 'Cucumber', 'Produce', 180, 'g', 'diced'),
('Mediterranean Chickpea Salad', 'Cherry Tomatoes', 'Produce', 200, 'g', 'halved'),
('Mediterranean Chickpea Salad', 'Parsley', 'Produce', 20, 'g', 'chopped'),
('Mediterranean Chickpea Salad', 'Lemon Juice', 'Other', 2, 'tbsp', ''),
('Mediterranean Chickpea Salad', 'Olive Oil', 'Other', 1, 'tbsp', ''),

('Spicy Black Bean Chili', 'Black Beans', 'Canned', 240, 'g', 'drained and rinsed'),
('Spicy Black Bean Chili', 'Sweet Potato', 'Produce', 250, 'g', 'diced'),
('Spicy Black Bean Chili', 'Bell Pepper', 'Produce', 180, 'g', 'diced'),
('Spicy Black Bean Chili', 'Onion', 'Produce', 100, 'g', 'diced'),
('Spicy Black Bean Chili', 'No-Salt-Added Tomatoes', 'Canned', 400, 'g', ''),
('Spicy Black Bean Chili', 'Brown Rice', 'Dry goods', 120, 'g', 'dry'),
('Spicy Black Bean Chili', 'Olive Oil', 'Other', 1, 'tsp', ''),
('Spicy Black Bean Chili', 'Cumin', 'Spices', 1, 'tsp', ''),
('Spicy Black Bean Chili', 'Smoked Paprika', 'Spices', 1, 'tsp', ''),

('Coconut Chickpea Curry', 'Canned Chickpeas', 'Canned', 240, 'g', 'drained and rinsed'),
('Coconut Chickpea Curry', 'Cauliflower', 'Produce', 300, 'g', 'florets'),
('Coconut Chickpea Curry', 'Spinach', 'Produce', 120, 'g', ''),
('Coconut Chickpea Curry', 'Onion', 'Produce', 100, 'g', 'diced'),
('Coconut Chickpea Curry', 'No-Salt-Added Tomatoes', 'Canned', 200, 'g', ''),
('Coconut Chickpea Curry', 'Light Coconut Milk', 'Canned', 150, 'ml', ''),
('Coconut Chickpea Curry', 'Brown Rice', 'Dry goods', 120, 'g', 'dry'),
('Coconut Chickpea Curry', 'Curry Powder', 'Spices', 2, 'tsp', ''),
('Coconut Chickpea Curry', 'Olive Oil', 'Other', 1, 'tsp', ''),

('Quinoa Salad with Sweet Potato', 'Quinoa', 'Dry goods', 120, 'g', 'dry'),
('Quinoa Salad with Sweet Potato', 'Sweet Potato', 'Produce', 250, 'g', 'diced'),
('Quinoa Salad with Sweet Potato', 'Broccoli', 'Produce', 200, 'g', 'florets'),
('Quinoa Salad with Sweet Potato', 'Spinach', 'Produce', 80, 'g', ''),
('Quinoa Salad with Sweet Potato', 'Pumpkin Seeds', 'Dry goods', 20, 'g', 'unsalted'),
('Quinoa Salad with Sweet Potato', 'Lemon Juice', 'Other', 2, 'tbsp', ''),
('Quinoa Salad with Sweet Potato', 'Olive Oil', 'Other', 2, 'tsp', ''),

('Creamy Tuscan White Bean Soup', 'Cannellini Beans', 'Canned', 240, 'g', 'drained and rinsed'),
('Creamy Tuscan White Bean Soup', 'Kale', 'Produce', 150, 'g', 'chopped'),
('Creamy Tuscan White Bean Soup', 'Carrots', 'Produce', 150, 'g', 'diced'),
('Creamy Tuscan White Bean Soup', 'Onion', 'Produce', 100, 'g', 'diced'),
('Creamy Tuscan White Bean Soup', 'No-Salt-Added Tomatoes', 'Canned', 300, 'g', ''),
('Creamy Tuscan White Bean Soup', 'Low-Sodium Vegetable Broth', 'Dry goods', 500, 'ml', ''),
('Creamy Tuscan White Bean Soup', 'Garlic', 'Produce', 10, 'g', 'minced'),
('Creamy Tuscan White Bean Soup', 'Olive Oil', 'Other', 1, 'tsp', ''),

('Stir-Fry Tofu with Broccoli', 'Firm Tofu', 'Protein', 250, 'g', 'cubed'),
('Stir-Fry Tofu with Broccoli', 'Broccoli', 'Produce', 300, 'g', 'florets'),
('Stir-Fry Tofu with Broccoli', 'Bell Pepper', 'Produce', 180, 'g', 'sliced'),
('Stir-Fry Tofu with Broccoli', 'Brown Rice', 'Dry goods', 120, 'g', 'dry'),
('Stir-Fry Tofu with Broccoli', 'Reduced-Salt Soy Sauce', 'Other', 1, 'tbsp', ''),
('Stir-Fry Tofu with Broccoli', 'Ginger', 'Produce', 10, 'g', 'grated'),
('Stir-Fry Tofu with Broccoli', 'Garlic', 'Produce', 8, 'g', 'minced'),
('Stir-Fry Tofu with Broccoli', 'Sesame Oil', 'Other', 2, 'tsp', ''),

('Lentil Bolognese with Pasta', 'Whole-Wheat Pasta', 'Dry goods', 150, 'g', 'dry'),
('Lentil Bolognese with Pasta', 'Brown Lentils', 'Dry goods', 120, 'g', 'dry'),
('Lentil Bolognese with Pasta', 'No-Salt-Added Tomatoes', 'Canned', 400, 'g', ''),
('Lentil Bolognese with Pasta', 'Carrots', 'Produce', 150, 'g', 'finely diced'),
('Lentil Bolognese with Pasta', 'Celery', 'Produce', 100, 'g', 'finely diced'),
('Lentil Bolognese with Pasta', 'Onion', 'Produce', 100, 'g', 'diced'),
('Lentil Bolognese with Pasta', 'Garlic', 'Produce', 8, 'g', 'minced'),
('Lentil Bolognese with Pasta', 'Olive Oil', 'Other', 1, 'tsp', ''),

('Roasted Vegetable Buddha Bowl', 'Brown Rice', 'Dry goods', 120, 'g', 'dry'),
('Roasted Vegetable Buddha Bowl', 'Canned Chickpeas', 'Canned', 240, 'g', 'drained and rinsed'),
('Roasted Vegetable Buddha Bowl', 'Broccoli', 'Produce', 250, 'g', 'florets'),
('Roasted Vegetable Buddha Bowl', 'Sweet Potato', 'Produce', 250, 'g', 'diced'),
('Roasted Vegetable Buddha Bowl', 'Tahini', 'Dry goods', 25, 'g', ''),
('Roasted Vegetable Buddha Bowl', 'Lemon Juice', 'Other', 2, 'tbsp', ''),
('Roasted Vegetable Buddha Bowl', 'Olive Oil', 'Other', 2, 'tsp', ''),

('Tempeh Vegetable Stir-Fry', 'Tempeh', 'Protein', 220, 'g', 'sliced'),
('Tempeh Vegetable Stir-Fry', 'Snap Peas', 'Produce', 180, 'g', ''),
('Tempeh Vegetable Stir-Fry', 'Bell Pepper', 'Produce', 180, 'g', 'sliced'),
('Tempeh Vegetable Stir-Fry', 'Cabbage', 'Produce', 180, 'g', 'shredded'),
('Tempeh Vegetable Stir-Fry', 'Brown Rice', 'Dry goods', 120, 'g', 'dry'),
('Tempeh Vegetable Stir-Fry', 'Reduced-Salt Soy Sauce', 'Other', 1, 'tbsp', ''),
('Tempeh Vegetable Stir-Fry', 'Ginger', 'Produce', 10, 'g', 'grated'),
('Tempeh Vegetable Stir-Fry', 'Sesame Oil', 'Other', 2, 'tsp', ''),

('Mexican Quinoa Salad', 'Quinoa', 'Dry goods', 120, 'g', 'dry'),
('Mexican Quinoa Salad', 'Black Beans', 'Canned', 240, 'g', 'drained and rinsed'),
('Mexican Quinoa Salad', 'Sweet Corn', 'Canned', 120, 'g', 'no added salt'),
('Mexican Quinoa Salad', 'Bell Pepper', 'Produce', 180, 'g', 'diced'),
('Mexican Quinoa Salad', 'Cherry Tomatoes', 'Produce', 200, 'g', 'halved'),
('Mexican Quinoa Salad', 'Cilantro', 'Produce', 15, 'g', 'chopped'),
('Mexican Quinoa Salad', 'Lime Juice', 'Other', 2, 'tbsp', ''),
('Mexican Quinoa Salad', 'Olive Oil', 'Other', 2, 'tsp', ''),

('Peanut Noodle Salad with Tofu', 'Soba Noodles', 'Dry goods', 140, 'g', 'prefer 100% buckwheat'),
('Peanut Noodle Salad with Tofu', 'Firm Tofu', 'Protein', 220, 'g', 'cubed'),
('Peanut Noodle Salad with Tofu', 'Cabbage', 'Produce', 180, 'g', 'shredded'),
('Peanut Noodle Salad with Tofu', 'Carrots', 'Produce', 120, 'g', 'shredded'),
('Peanut Noodle Salad with Tofu', 'Cucumber', 'Produce', 150, 'g', 'sliced'),
('Peanut Noodle Salad with Tofu', 'Natural Peanut Butter', 'Other', 25, 'g', 'no added sugar'),
('Peanut Noodle Salad with Tofu', 'Reduced-Salt Soy Sauce', 'Other', 2, 'tsp', ''),
('Peanut Noodle Salad with Tofu', 'Lime Juice', 'Other', 2, 'tbsp', ''),

('Red Lentil Dahl', 'Red Lentils', 'Dry goods', 150, 'g', 'dry'),
('Red Lentil Dahl', 'Brown Basmati Rice', 'Dry goods', 110, 'g', 'dry'),
('Red Lentil Dahl', 'Spinach', 'Produce', 150, 'g', ''),
('Red Lentil Dahl', 'Onion', 'Produce', 100, 'g', 'diced'),
('Red Lentil Dahl', 'No-Salt-Added Tomatoes', 'Canned', 300, 'g', ''),
('Red Lentil Dahl', 'Garlic', 'Produce', 8, 'g', 'minced'),
('Red Lentil Dahl', 'Ginger', 'Produce', 10, 'g', 'grated'),
('Red Lentil Dahl', 'Curry Powder', 'Spices', 2, 'tsp', ''),
('Red Lentil Dahl', 'Olive Oil', 'Other', 1, 'tsp', ''),

('Tofu Souvlaki Salad Bowl', 'Firm Tofu', 'Protein', 250, 'g', 'cubed'),
('Tofu Souvlaki Salad Bowl', 'Whole-Grain Couscous', 'Dry goods', 120, 'g', 'dry'),
('Tofu Souvlaki Salad Bowl', 'Cucumber', 'Produce', 180, 'g', 'diced'),
('Tofu Souvlaki Salad Bowl', 'Cherry Tomatoes', 'Produce', 200, 'g', 'halved'),
('Tofu Souvlaki Salad Bowl', 'Bell Pepper', 'Produce', 180, 'g', 'diced'),
('Tofu Souvlaki Salad Bowl', 'Lemon Juice', 'Other', 2, 'tbsp', ''),
('Tofu Souvlaki Salad Bowl', 'Oregano', 'Spices', 1, 'tsp', ''),
('Tofu Souvlaki Salad Bowl', 'Olive Oil', 'Other', 1, 'tbsp', ''),

('Butternut Squash Lentil Soup', 'Butternut Squash', 'Produce', 600, 'g', 'cubed'),
('Butternut Squash Lentil Soup', 'Red Lentils', 'Dry goods', 120, 'g', 'dry'),
('Butternut Squash Lentil Soup', 'Onion', 'Produce', 100, 'g', 'diced'),
('Butternut Squash Lentil Soup', 'Low-Sodium Vegetable Broth', 'Dry goods', 600, 'ml', ''),
('Butternut Squash Lentil Soup', 'Garlic', 'Produce', 8, 'g', 'minced'),
('Butternut Squash Lentil Soup', 'Pumpkin Seeds', 'Dry goods', 20, 'g', 'unsalted'),
('Butternut Squash Lentil Soup', 'Olive Oil', 'Other', 1, 'tsp', ''),

('Black Bean Quinoa Burgers', 'Black Beans', 'Canned', 240, 'g', 'drained and rinsed'),
('Black Bean Quinoa Burgers', 'Cooked Quinoa', 'Dry goods', 120, 'g', ''),
('Black Bean Quinoa Burgers', 'Rolled Oats', 'Dry goods', 50, 'g', ''),
('Black Bean Quinoa Burgers', 'Carrots', 'Produce', 100, 'g', 'grated'),
('Black Bean Quinoa Burgers', 'Cabbage', 'Produce', 150, 'g', 'shredded'),
('Black Bean Quinoa Burgers', 'Tomatoes', 'Produce', 150, 'g', 'sliced'),
('Black Bean Quinoa Burgers', 'Whole-Grain Burger Buns', 'Dry goods', 2, 'pcs', ''),
('Black Bean Quinoa Burgers', 'Cumin', 'Spices', 1, 'tsp', ''),

('Green Edamame Barley Salad', 'Pearl Barley', 'Dry goods', 120, 'g', 'dry'),
('Green Edamame Barley Salad', 'Shelled Edamame', 'Frozen', 200, 'g', ''),
('Green Edamame Barley Salad', 'Broccoli', 'Produce', 200, 'g', 'small florets'),
('Green Edamame Barley Salad', 'Cucumber', 'Produce', 180, 'g', 'diced'),
('Green Edamame Barley Salad', 'Spinach', 'Produce', 80, 'g', ''),
('Green Edamame Barley Salad', 'Lemon Juice', 'Other', 2, 'tbsp', ''),
('Green Edamame Barley Salad', 'Olive Oil', 'Other', 2, 'tsp', ''),

('Mushroom Barley Stew', 'Mushrooms', 'Produce', 300, 'g', 'quartered'),
('Mushroom Barley Stew', 'Pearl Barley', 'Dry goods', 120, 'g', 'dry'),
('Mushroom Barley Stew', 'Cannellini Beans', 'Canned', 240, 'g', 'drained and rinsed'),
('Mushroom Barley Stew', 'Carrots', 'Produce', 180, 'g', 'diced'),
('Mushroom Barley Stew', 'Kale', 'Produce', 120, 'g', 'chopped'),
('Mushroom Barley Stew', 'Onion', 'Produce', 100, 'g', 'diced'),
('Mushroom Barley Stew', 'Low-Sodium Vegetable Broth', 'Dry goods', 600, 'ml', ''),
('Mushroom Barley Stew', 'Olive Oil', 'Other', 1, 'tsp', ''),
('Mushroom Barley Stew', 'Dried Thyme', 'Spices', 1, 'tsp', ''),

('Apple Walnut Baked Oats', 'Rolled Oats', 'Dry goods', 120, 'g', 'whole-grain'),
('Apple Walnut Baked Oats', 'Apples', 'Produce', 250, 'g', 'grated'),
('Apple Walnut Baked Oats', 'Unsweetened Low-Fat Milk', 'Dairy', 250, 'ml', ''),
('Apple Walnut Baked Oats', 'Eggs', 'Protein', 1, 'pcs', ''),
('Apple Walnut Baked Oats', 'Walnuts', 'Dry goods', 25, 'g', 'unsalted'),
('Apple Walnut Baked Oats', 'Cinnamon', 'Spices', 1, 'tsp', ''),

('Spinach Mushroom Egg Muffins', 'Eggs', 'Protein', 4, 'pcs', ''),
('Spinach Mushroom Egg Muffins', 'Mushrooms', 'Produce', 180, 'g', 'diced'),
('Spinach Mushroom Egg Muffins', 'Spinach', 'Produce', 120, 'g', 'chopped'),
('Spinach Mushroom Egg Muffins', 'Cherry Tomatoes', 'Produce', 200, 'g', ''),
('Spinach Mushroom Egg Muffins', 'Rye Bread', 'Dry goods', 4, 'slices', 'whole-grain'),
('Spinach Mushroom Egg Muffins', 'Olive Oil', 'Other', 1, 'tsp', ''),

('Yogurt Oat Berry Pots', 'Low-Fat Plain Yogurt', 'Dairy', 400, 'g', 'unsweetened'),
('Yogurt Oat Berry Pots', 'Rolled Oats', 'Dry goods', 80, 'g', ''),
('Yogurt Oat Berry Pots', 'Mixed Berries', 'Produce', 200, 'g', ''),
('Yogurt Oat Berry Pots', 'Pears', 'Produce', 180, 'g', 'diced'),
('Yogurt Oat Berry Pots', 'Ground Flaxseed', 'Dry goods', 20, 'g', ''),

('Minestrone with Beans and Whole-Wheat Pasta', 'Cannellini Beans', 'Canned', 240, 'g', 'drained and rinsed'),
('Minestrone with Beans and Whole-Wheat Pasta', 'Whole-Wheat Pasta', 'Dry goods', 100, 'g', 'small shapes'),
('Minestrone with Beans and Whole-Wheat Pasta', 'Carrots', 'Produce', 150, 'g', 'diced'),
('Minestrone with Beans and Whole-Wheat Pasta', 'Celery', 'Produce', 100, 'g', 'diced'),
('Minestrone with Beans and Whole-Wheat Pasta', 'Zucchini', 'Produce', 200, 'g', 'diced'),
('Minestrone with Beans and Whole-Wheat Pasta', 'Spinach', 'Produce', 100, 'g', ''),
('Minestrone with Beans and Whole-Wheat Pasta', 'Onion', 'Produce', 100, 'g', 'diced'),
('Minestrone with Beans and Whole-Wheat Pasta', 'No-Salt-Added Tomatoes', 'Canned', 300, 'g', ''),
('Minestrone with Beans and Whole-Wheat Pasta', 'Low-Sodium Vegetable Broth', 'Dry goods', 500, 'ml', ''),
('Minestrone with Beans and Whole-Wheat Pasta', 'Olive Oil', 'Other', 1, 'tsp', ''),

('Split Pea Root Vegetable Soup', 'Dried Split Peas', 'Dry goods', 160, 'g', ''),
('Split Pea Root Vegetable Soup', 'Carrots', 'Produce', 200, 'g', 'diced'),
('Split Pea Root Vegetable Soup', 'Leek', 'Produce', 180, 'g', 'sliced'),
('Split Pea Root Vegetable Soup', 'Celeriac', 'Produce', 200, 'g', 'diced'),
('Split Pea Root Vegetable Soup', 'Low-Sodium Vegetable Broth', 'Dry goods', 700, 'ml', ''),
('Split Pea Root Vegetable Soup', 'Lemon Juice', 'Other', 1, 'tbsp', ''),
('Split Pea Root Vegetable Soup', 'Olive Oil', 'Other', 2, 'tsp', ''),

('Tomato Lentil Soup with Rye Bread', 'Brown Lentils', 'Dry goods', 140, 'g', 'dry'),
('Tomato Lentil Soup with Rye Bread', 'No-Salt-Added Tomatoes', 'Canned', 400, 'g', ''),
('Tomato Lentil Soup with Rye Bread', 'Carrots', 'Produce', 180, 'g', 'diced'),
('Tomato Lentil Soup with Rye Bread', 'Spinach', 'Produce', 120, 'g', ''),
('Tomato Lentil Soup with Rye Bread', 'Onion', 'Produce', 100, 'g', 'diced'),
('Tomato Lentil Soup with Rye Bread', 'Low-Sodium Vegetable Broth', 'Dry goods', 500, 'ml', ''),
('Tomato Lentil Soup with Rye Bread', 'Rye Bread', 'Dry goods', 4, 'slices', 'whole-grain'),
('Tomato Lentil Soup with Rye Bread', 'Garlic', 'Produce', 8, 'g', 'minced'),
('Tomato Lentil Soup with Rye Bread', 'Olive Oil', 'Other', 1, 'tsp', ''),

('Chicken Vegetable Barley Soup', 'Chicken Breast', 'Protein', 220, 'g', 'diced'),
('Chicken Vegetable Barley Soup', 'Pearl Barley', 'Dry goods', 100, 'g', 'dry'),
('Chicken Vegetable Barley Soup', 'Carrots', 'Produce', 180, 'g', 'diced'),
('Chicken Vegetable Barley Soup', 'Leek', 'Produce', 160, 'g', 'sliced'),
('Chicken Vegetable Barley Soup', 'Celery', 'Produce', 120, 'g', 'diced'),
('Chicken Vegetable Barley Soup', 'Peas', 'Frozen', 120, 'g', ''),
('Chicken Vegetable Barley Soup', 'Low-Sodium Chicken Broth', 'Dry goods', 700, 'ml', ''),
('Chicken Vegetable Barley Soup', 'Olive Oil', 'Other', 1, 'tsp', ''),

('Ratatouille White Bean Bake', 'Aubergine', 'Produce', 300, 'g', 'diced'),
('Ratatouille White Bean Bake', 'Zucchini', 'Produce', 250, 'g', 'diced'),
('Ratatouille White Bean Bake', 'Bell Pepper', 'Produce', 180, 'g', 'diced'),
('Ratatouille White Bean Bake', 'Onion', 'Produce', 100, 'g', 'diced'),
('Ratatouille White Bean Bake', 'No-Salt-Added Tomatoes', 'Canned', 300, 'g', ''),
('Ratatouille White Bean Bake', 'Cannellini Beans', 'Canned', 240, 'g', 'drained and rinsed'),
('Ratatouille White Bean Bake', 'Whole-Grain Couscous', 'Dry goods', 110, 'g', 'dry'),
('Ratatouille White Bean Bake', 'Olive Oil', 'Other', 1, 'tbsp', ''),
('Ratatouille White Bean Bake', 'Dried Herbs', 'Spices', 2, 'tsp', ''),

('Cauliflower Chickpea Tray Bake', 'Cauliflower', 'Produce', 400, 'g', 'florets'),
('Cauliflower Chickpea Tray Bake', 'Canned Chickpeas', 'Canned', 240, 'g', 'drained and rinsed'),
('Cauliflower Chickpea Tray Bake', 'Carrots', 'Produce', 200, 'g', 'sliced'),
('Cauliflower Chickpea Tray Bake', 'Onion', 'Produce', 100, 'g', 'wedges'),
('Cauliflower Chickpea Tray Bake', 'Whole-Grain Bulgur', 'Dry goods', 110, 'g', 'dry'),
('Cauliflower Chickpea Tray Bake', 'Low-Fat Plain Yogurt', 'Dairy', 120, 'g', ''),
('Cauliflower Chickpea Tray Bake', 'Tahini', 'Dry goods', 20, 'g', ''),
('Cauliflower Chickpea Tray Bake', 'Lemon Juice', 'Other', 2, 'tbsp', ''),
('Cauliflower Chickpea Tray Bake', 'Olive Oil', 'Other', 2, 'tsp', ''),
('Cauliflower Chickpea Tray Bake', 'Cumin', 'Spices', 1, 'tsp', ''),

('Lentil Quinoa Stuffed Peppers', 'Bell Pepper', 'Produce', 500, 'g', 'about 3 large'),
('Lentil Quinoa Stuffed Peppers', 'Cooked Lentils', 'Canned', 240, 'g', 'drained and rinsed'),
('Lentil Quinoa Stuffed Peppers', 'Quinoa', 'Dry goods', 100, 'g', 'dry'),
('Lentil Quinoa Stuffed Peppers', 'Spinach', 'Produce', 120, 'g', 'chopped'),
('Lentil Quinoa Stuffed Peppers', 'No-Salt-Added Tomatoes', 'Canned', 200, 'g', ''),
('Lentil Quinoa Stuffed Peppers', 'Olive Oil', 'Other', 2, 'tsp', ''),

('Salmon Broccoli Potato Tray Bake', 'Salmon Fillets', 'Protein', 260, 'g', ''),
('Salmon Broccoli Potato Tray Bake', 'Potatoes', 'Produce', 400, 'g', 'small chunks'),
('Salmon Broccoli Potato Tray Bake', 'Broccoli', 'Produce', 300, 'g', 'florets'),
('Salmon Broccoli Potato Tray Bake', 'Green Beans', 'Produce', 180, 'g', ''),
('Salmon Broccoli Potato Tray Bake', 'Lemon Juice', 'Other', 2, 'tbsp', ''),
('Salmon Broccoli Potato Tray Bake', 'Olive Oil', 'Other', 2, 'tsp', ''),

('Cod Tomato Olive Bake', 'Cod Fillets', 'Protein', 300, 'g', ''),
('Cod Tomato Olive Bake', 'Zucchini', 'Produce', 300, 'g', 'sliced'),
('Cod Tomato Olive Bake', 'Cherry Tomatoes', 'Produce', 300, 'g', ''),
('Cod Tomato Olive Bake', 'Onion', 'Produce', 100, 'g', 'sliced'),
('Cod Tomato Olive Bake', 'Pearl Barley', 'Dry goods', 120, 'g', 'dry'),
('Cod Tomato Olive Bake', 'Kalamata Olives', 'Other', 25, 'g', 'sliced'),
('Cod Tomato Olive Bake', 'Olive Oil', 'Other', 2, 'tsp', ''),
('Cod Tomato Olive Bake', 'Oregano', 'Spices', 1, 'tsp', ''),

('Chicken Root Vegetable Tray Bake', 'Chicken Breast', 'Protein', 260, 'g', 'chunks'),
('Chicken Root Vegetable Tray Bake', 'Canned Chickpeas', 'Canned', 180, 'g', 'drained and rinsed'),
('Chicken Root Vegetable Tray Bake', 'Carrots', 'Produce', 220, 'g', 'chunks'),
('Chicken Root Vegetable Tray Bake', 'Parsnip', 'Produce', 200, 'g', 'chunks'),
('Chicken Root Vegetable Tray Bake', 'Beetroot', 'Produce', 200, 'g', 'chunks'),
('Chicken Root Vegetable Tray Bake', 'Spinach', 'Produce', 100, 'g', ''),
('Chicken Root Vegetable Tray Bake', 'Olive Oil', 'Other', 1, 'tbsp', ''),
('Chicken Root Vegetable Tray Bake', 'Smoked Paprika', 'Spices', 1, 'tsp', ''),

('Turkey Spinach Meatballs with Couscous', 'Lean Turkey Mince', 'Protein', 300, 'g', ''),
('Turkey Spinach Meatballs with Couscous', 'Rolled Oats', 'Dry goods', 35, 'g', ''),
('Turkey Spinach Meatballs with Couscous', 'Spinach', 'Produce', 180, 'g', 'chopped'),
('Turkey Spinach Meatballs with Couscous', 'Zucchini', 'Produce', 250, 'g', 'diced'),
('Turkey Spinach Meatballs with Couscous', 'No-Salt-Added Tomatoes', 'Canned', 300, 'g', ''),
('Turkey Spinach Meatballs with Couscous', 'Whole-Grain Couscous', 'Dry goods', 120, 'g', 'dry'),

('Spinach Potato Frittata', 'Eggs', 'Protein', 5, 'pcs', ''),
('Spinach Potato Frittata', 'Potatoes', 'Produce', 300, 'g', 'thinly sliced'),
('Spinach Potato Frittata', 'Spinach', 'Produce', 150, 'g', ''),
('Spinach Potato Frittata', 'Bell Pepper', 'Produce', 180, 'g', 'diced'),
('Spinach Potato Frittata', 'Onion', 'Produce', 100, 'g', 'diced'),
('Spinach Potato Frittata', 'Tomatoes', 'Produce', 250, 'g', 'for the side salad'),
('Spinach Potato Frittata', 'Olive Oil', 'Other', 2, 'tsp', ''),

('Whole-Wheat Pasta Primavera', 'Whole-Wheat Pasta', 'Dry goods', 150, 'g', 'dry'),
('Whole-Wheat Pasta Primavera', 'Cannellini Beans', 'Canned', 200, 'g', 'drained and rinsed'),
('Whole-Wheat Pasta Primavera', 'Zucchini', 'Produce', 200, 'g', 'diced'),
('Whole-Wheat Pasta Primavera', 'Broccoli', 'Produce', 200, 'g', 'small florets'),
('Whole-Wheat Pasta Primavera', 'Peas', 'Frozen', 120, 'g', ''),
('Whole-Wheat Pasta Primavera', 'Cherry Tomatoes', 'Produce', 200, 'g', 'halved'),
('Whole-Wheat Pasta Primavera', 'Garlic', 'Produce', 8, 'g', 'minced'),
('Whole-Wheat Pasta Primavera', 'Olive Oil', 'Other', 1, 'tbsp', ''),

('Spinach Pea Barley Risotto', 'Pearl Barley', 'Dry goods', 150, 'g', 'dry'),
('Spinach Pea Barley Risotto', 'Mushrooms', 'Produce', 250, 'g', 'sliced'),
('Spinach Pea Barley Risotto', 'Peas', 'Frozen', 150, 'g', ''),
('Spinach Pea Barley Risotto', 'Spinach', 'Produce', 150, 'g', ''),
('Spinach Pea Barley Risotto', 'Onion', 'Produce', 100, 'g', 'diced'),
('Spinach Pea Barley Risotto', 'Low-Sodium Vegetable Broth', 'Dry goods', 600, 'ml', ''),
('Spinach Pea Barley Risotto', 'Hard Cheese', 'Dairy', 25, 'g', 'finely grated'),
('Spinach Pea Barley Risotto', 'Olive Oil', 'Other', 1, 'tsp', ''),

('Buckwheat Mushroom Pilaf', 'Buckwheat Groats', 'Dry goods', 140, 'g', 'dry'),
('Buckwheat Mushroom Pilaf', 'Mushrooms', 'Produce', 300, 'g', 'sliced'),
('Buckwheat Mushroom Pilaf', 'Cabbage', 'Produce', 250, 'g', 'shredded'),
('Buckwheat Mushroom Pilaf', 'Cannellini Beans', 'Canned', 200, 'g', 'drained and rinsed'),
('Buckwheat Mushroom Pilaf', 'Onion', 'Produce', 100, 'g', 'diced'),
('Buckwheat Mushroom Pilaf', 'Low-Sodium Vegetable Broth', 'Dry goods', 350, 'ml', ''),
('Buckwheat Mushroom Pilaf', 'Parsley', 'Produce', 20, 'g', 'chopped'),
('Buckwheat Mushroom Pilaf', 'Olive Oil', 'Other', 2, 'tsp', ''),

('Bulgur Tabbouleh with Lentils', 'Whole-Grain Bulgur', 'Dry goods', 120, 'g', 'dry'),
('Bulgur Tabbouleh with Lentils', 'Cooked Lentils', 'Canned', 240, 'g', 'drained and rinsed'),
('Bulgur Tabbouleh with Lentils', 'Cherry Tomatoes', 'Produce', 250, 'g', 'diced'),
('Bulgur Tabbouleh with Lentils', 'Cucumber', 'Produce', 200, 'g', 'diced'),
('Bulgur Tabbouleh with Lentils', 'Parsley', 'Produce', 30, 'g', 'chopped'),
('Bulgur Tabbouleh with Lentils', 'Spring Onion', 'Produce', 60, 'g', 'sliced'),
('Bulgur Tabbouleh with Lentils', 'Lemon Juice', 'Other', 2, 'tbsp', ''),
('Bulgur Tabbouleh with Lentils', 'Olive Oil', 'Other', 1, 'tbsp', ''),

('Barley Roasted Vegetable Salad', 'Pearl Barley', 'Dry goods', 120, 'g', 'dry'),
('Barley Roasted Vegetable Salad', 'Canned Chickpeas', 'Canned', 200, 'g', 'drained and rinsed'),
('Barley Roasted Vegetable Salad', 'Aubergine', 'Produce', 250, 'g', 'diced'),
('Barley Roasted Vegetable Salad', 'Bell Pepper', 'Produce', 180, 'g', 'diced'),
('Barley Roasted Vegetable Salad', 'Zucchini', 'Produce', 220, 'g', 'diced'),
('Barley Roasted Vegetable Salad', 'Spinach', 'Produce', 80, 'g', ''),
('Barley Roasted Vegetable Salad', 'Lemon Juice', 'Other', 2, 'tbsp', ''),
('Barley Roasted Vegetable Salad', 'Olive Oil', 'Other', 1, 'tbsp', ''),

('Rainbow Slaw Tofu Rice Bowl', 'Firm Tofu', 'Protein', 250, 'g', 'cubed'),
('Rainbow Slaw Tofu Rice Bowl', 'Brown Rice', 'Dry goods', 120, 'g', 'dry'),
('Rainbow Slaw Tofu Rice Bowl', 'Red Cabbage', 'Produce', 200, 'g', 'shredded'),
('Rainbow Slaw Tofu Rice Bowl', 'Carrots', 'Produce', 150, 'g', 'shredded'),
('Rainbow Slaw Tofu Rice Bowl', 'Bell Pepper', 'Produce', 180, 'g', 'sliced'),
('Rainbow Slaw Tofu Rice Bowl', 'Natural Peanut Butter', 'Other', 20, 'g', 'no added sugar'),
('Rainbow Slaw Tofu Rice Bowl', 'Lime Juice', 'Other', 2, 'tbsp', ''),
('Rainbow Slaw Tofu Rice Bowl', 'Reduced-Salt Soy Sauce', 'Other', 2, 'tsp', ''),

('Tuna White Bean Salad', 'Tuna in Spring Water', 'Canned', 220, 'g', 'drained'),
('Tuna White Bean Salad', 'Cannellini Beans', 'Canned', 240, 'g', 'drained and rinsed'),
('Tuna White Bean Salad', 'Cherry Tomatoes', 'Produce', 220, 'g', 'halved'),
('Tuna White Bean Salad', 'Cucumber', 'Produce', 180, 'g', 'diced'),
('Tuna White Bean Salad', 'Bell Pepper', 'Produce', 160, 'g', 'diced'),
('Tuna White Bean Salad', 'Parsley', 'Produce', 20, 'g', 'chopped'),
('Tuna White Bean Salad', 'Whole-Grain Bread', 'Dry goods', 4, 'slices', ''),
('Tuna White Bean Salad', 'Lemon Juice', 'Other', 2, 'tbsp', ''),
('Tuna White Bean Salad', 'Olive Oil', 'Other', 2, 'tsp', ''),

('Hummus Roasted Vegetable Wraps', 'Whole-Grain Wraps', 'Dry goods', 2, 'pcs', ''),
('Hummus Roasted Vegetable Wraps', 'Hummus', 'Other', 100, 'g', 'reduced salt'),
('Hummus Roasted Vegetable Wraps', 'Canned Chickpeas', 'Canned', 160, 'g', 'drained and rinsed'),
('Hummus Roasted Vegetable Wraps', 'Zucchini', 'Produce', 200, 'g', 'sliced'),
('Hummus Roasted Vegetable Wraps', 'Bell Pepper', 'Produce', 180, 'g', 'sliced'),
('Hummus Roasted Vegetable Wraps', 'Carrots', 'Produce', 150, 'g', 'batons'),
('Hummus Roasted Vegetable Wraps', 'Spinach', 'Produce', 80, 'g', ''),
('Hummus Roasted Vegetable Wraps', 'Olive Oil', 'Other', 2, 'tsp', ''),

('Baked Falafel Salad Boxes', 'Canned Chickpeas', 'Canned', 300, 'g', 'drained and rinsed'),
('Baked Falafel Salad Boxes', 'Rolled Oats', 'Dry goods', 45, 'g', ''),
('Baked Falafel Salad Boxes', 'Whole-Grain Bulgur', 'Dry goods', 100, 'g', 'dry'),
('Baked Falafel Salad Boxes', 'Cucumber', 'Produce', 200, 'g', 'diced'),
('Baked Falafel Salad Boxes', 'Cherry Tomatoes', 'Produce', 220, 'g', 'halved'),
('Baked Falafel Salad Boxes', 'Onion', 'Produce', 70, 'g', 'chopped'),
('Baked Falafel Salad Boxes', 'Parsley', 'Produce', 25, 'g', 'chopped'),
('Baked Falafel Salad Boxes', 'Low-Fat Plain Yogurt', 'Dairy', 120, 'g', ''),
('Baked Falafel Salad Boxes', 'Lemon Juice', 'Other', 2, 'tbsp', ''),
('Baked Falafel Salad Boxes', 'Cumin', 'Spices', 1, 'tsp', ''),

('Lentil Aubergine Moussaka', 'Aubergine', 'Produce', 450, 'g', 'sliced'),
('Lentil Aubergine Moussaka', 'Potatoes', 'Produce', 300, 'g', 'sliced'),
('Lentil Aubergine Moussaka', 'Brown Lentils', 'Dry goods', 130, 'g', 'dry'),
('Lentil Aubergine Moussaka', 'No-Salt-Added Tomatoes', 'Canned', 350, 'g', ''),
('Lentil Aubergine Moussaka', 'Onion', 'Produce', 100, 'g', 'diced'),
('Lentil Aubergine Moussaka', 'Low-Fat Plain Yogurt', 'Dairy', 180, 'g', ''),
('Lentil Aubergine Moussaka', 'Eggs', 'Protein', 1, 'pcs', ''),
('Lentil Aubergine Moussaka', 'Olive Oil', 'Other', 2, 'tsp', ''),

('Whole-Wheat Vegetable Lasagne', 'Whole-Wheat Lasagne Sheets', 'Dry goods', 140, 'g', ''),
('Whole-Wheat Vegetable Lasagne', 'Red Lentils', 'Dry goods', 100, 'g', 'dry'),
('Whole-Wheat Vegetable Lasagne', 'No-Salt-Added Tomatoes', 'Canned', 400, 'g', ''),
('Whole-Wheat Vegetable Lasagne', 'Carrots', 'Produce', 150, 'g', 'grated'),
('Whole-Wheat Vegetable Lasagne', 'Zucchini', 'Produce', 200, 'g', 'grated'),
('Whole-Wheat Vegetable Lasagne', 'Spinach', 'Produce', 150, 'g', ''),
('Whole-Wheat Vegetable Lasagne', 'Low-Fat Plain Yogurt', 'Dairy', 200, 'g', ''),
('Whole-Wheat Vegetable Lasagne', 'Mozzarella', 'Dairy', 60, 'g', 'reduced fat'),

('Cabbage White Bean Skillet', 'Cabbage', 'Produce', 400, 'g', 'shredded'),
('Cabbage White Bean Skillet', 'Potatoes', 'Produce', 350, 'g', 'cubed'),
('Cabbage White Bean Skillet', 'Cannellini Beans', 'Canned', 240, 'g', 'drained and rinsed'),
('Cabbage White Bean Skillet', 'Onion', 'Produce', 100, 'g', 'sliced'),
('Cabbage White Bean Skillet', 'Whole-Grain Mustard', 'Other', 2, 'tsp', ''),
('Cabbage White Bean Skillet', 'Olive Oil', 'Other', 2, 'tsp', ''),

('Pumpkin Lentil Millet Curry', 'Pumpkin', 'Produce', 500, 'g', 'cubed'),
('Pumpkin Lentil Millet Curry', 'Red Lentils', 'Dry goods', 140, 'g', 'dry'),
('Pumpkin Lentil Millet Curry', 'Millet', 'Dry goods', 110, 'g', 'dry'),
('Pumpkin Lentil Millet Curry', 'Spinach', 'Produce', 120, 'g', ''),
('Pumpkin Lentil Millet Curry', 'Onion', 'Produce', 100, 'g', 'diced'),
('Pumpkin Lentil Millet Curry', 'No-Salt-Added Tomatoes', 'Canned', 250, 'g', ''),
('Pumpkin Lentil Millet Curry', 'Garlic', 'Produce', 8, 'g', 'minced'),
('Pumpkin Lentil Millet Curry', 'Ginger', 'Produce', 10, 'g', 'grated'),
('Pumpkin Lentil Millet Curry', 'Curry Powder', 'Spices', 2, 'tsp', ''),
('Pumpkin Lentil Millet Curry', 'Olive Oil', 'Other', 1, 'tsp', ''),

('Sardine Tomato Whole-Wheat Pasta', 'Whole-Wheat Pasta', 'Dry goods', 150, 'g', 'dry'),
('Sardine Tomato Whole-Wheat Pasta', 'Sardines in Olive Oil', 'Canned', 180, 'g', 'drained'),
('Sardine Tomato Whole-Wheat Pasta', 'No-Salt-Added Tomatoes', 'Canned', 300, 'g', ''),
('Sardine Tomato Whole-Wheat Pasta', 'Zucchini', 'Produce', 250, 'g', 'diced'),
('Sardine Tomato Whole-Wheat Pasta', 'Spinach', 'Produce', 120, 'g', ''),
('Sardine Tomato Whole-Wheat Pasta', 'Onion', 'Produce', 100, 'g', 'diced'),
('Sardine Tomato Whole-Wheat Pasta', 'Garlic', 'Produce', 8, 'g', 'minced'),

('Chicken Chickpea Couscous Salad', 'Chicken Breast', 'Protein', 240, 'g', ''),
('Chicken Chickpea Couscous Salad', 'Canned Chickpeas', 'Canned', 180, 'g', 'drained and rinsed'),
('Chicken Chickpea Couscous Salad', 'Whole-Grain Couscous', 'Dry goods', 110, 'g', 'dry'),
('Chicken Chickpea Couscous Salad', 'Cucumber', 'Produce', 180, 'g', 'diced'),
('Chicken Chickpea Couscous Salad', 'Cherry Tomatoes', 'Produce', 220, 'g', 'halved'),
('Chicken Chickpea Couscous Salad', 'Spinach', 'Produce', 100, 'g', ''),
('Chicken Chickpea Couscous Salad', 'Lemon Juice', 'Other', 2, 'tbsp', ''),
('Chicken Chickpea Couscous Salad', 'Olive Oil', 'Other', 2, 'tsp', '');

INSERT OR IGNORE INTO ingredients (user_id, name, category)
SELECT DISTINCT 'system', ingredient_name, category
FROM _migration_0007_default_recipe_ingredient_seed;

DELETE FROM recipe_ingredients
WHERE recipe_id IN (
  SELECT recipes.id
  FROM recipes
  INNER JOIN _migration_0007_default_recipe_seed ON _migration_0007_default_recipe_seed.name = recipes.name
  WHERE recipes.user_id = 'system'
);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note)
SELECT recipes.id, ingredients.id, seed.quantity, seed.unit, seed.note
FROM _migration_0007_default_recipe_ingredient_seed AS seed
INNER JOIN recipes
  ON recipes.user_id = 'system' AND recipes.name = seed.recipe_name
INNER JOIN ingredients
  ON ingredients.user_id = 'system' AND ingredients.name = seed.ingredient_name;

DROP TABLE _migration_0007_default_recipe_ingredient_seed;
DROP TABLE _migration_0007_default_recipe_seed;
