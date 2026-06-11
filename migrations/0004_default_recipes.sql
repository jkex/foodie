-- Insert default ingredients first (ignoring duplicates if they already exist)
INSERT OR IGNORE INTO ingredients (user_id, name, category) VALUES
('local', 'Rolled Oats', 'Dry goods'),
('local', 'Chia Seeds', 'Dry goods'),
('local', 'Almond Milk', 'Dairy'),
('local', 'Maple Syrup', 'Other'),
('local', 'Mixed Berries', 'Produce'),
('local', 'Firm Tofu', 'Meat'),
('local', 'Turmeric', 'Spices'),
('local', 'Tortilla Wraps', 'Other'),
('local', 'Spinach', 'Produce'),
('local', 'Black Beans', 'Canned'),
('local', 'Brown Lentils', 'Dry goods'),
('local', 'Potatoes', 'Produce'),
('local', 'Carrots', 'Produce'),
('local', 'Peas', 'Produce'),
('local', 'Vegetable Broth', 'Dry goods'),
('local', 'Canned Chickpeas', 'Canned'),
('local', 'Cucumber', 'Produce'),
('local', 'Cherry Tomatoes', 'Produce'),
('local', 'Kalamata Olives', 'Other'),
('local', 'Olive Oil', 'Other'),
('local', 'Lemon Juice', 'Other'),
('local', 'Canned Tomatoes', 'Canned'),
('local', 'Onion', 'Produce'),
('local', 'Chili Powder', 'Spices'),
('local', 'Sweet Potato', 'Produce'),
('local', 'Bell Pepper', 'Produce'),
('local', 'Coconut Milk', 'Dairy'),
('local', 'Curry Powder', 'Spices'),
('local', 'Brown Rice', 'Dry goods'),
('local', 'Pumpkin Seeds', 'Dry goods'),
('local', 'Tahini', 'Dry goods'),
('local', 'Cannellini Beans', 'Canned'),
('local', 'Kale', 'Produce'),
('local', 'Garlic', 'Produce'),
('local', 'Broccoli', 'Produce'),
('local', 'Soy Sauce', 'Other'),
('local', 'Ginger', 'Produce'),
('local', 'Jasmine Rice', 'Dry goods'),
('local', 'Sesame Oil', 'Other'),
('local', 'Spaghetti', 'Dry goods'),
('local', 'Oregano', 'Spices'),
('local', 'Tempeh', 'Meat'),
('local', 'Snap Peas', 'Produce'),
('local', 'Sesame Seeds', 'Other'),
('local', 'Sweet Corn', 'Canned'),
('local', 'Cilantro', 'Produce'),
('local', 'Lime Juice', 'Other'),
('local', 'Soba Noodles', 'Dry goods'),
('local', 'Peanut Butter', 'Other'),
('local', 'Red Lentils', 'Dry goods'),
('local', 'Red Onion', 'Produce'),
('local', 'Butternut Squash', 'Produce'),
('local', 'Cooked Quinoa', 'Dry goods'),
('local', 'Cumin', 'Spices'),
('local', 'Garlic Powder', 'Spices'),
('local', 'Burger Buns', 'Other'),
('local', 'Shelled Edamame', 'Produce'),
('local', 'Rice Vinegar', 'Other'),
('local', 'Red Kidney Beans', 'Canned'),
('local', 'Chili Flakes', 'Spices');

-- Insert default recipes
INSERT INTO recipes (user_id, name, description, instructions, base_servings, default_days, rotation_index) VALUES
('local', 'Overnight Oats with Chia and Berries', 'Fiber-rich, low-prep breakfast ready in the morning.', '1. Combine rolled oats, chia seeds, and almond milk in a jar.
2. Stir in maple syrup and mix well.
3. Cover and refrigerate overnight.
4. Top with fresh berries before serving.', 2, 1, 1),

('local', 'Tofu Scramble Breakfast Burrito', 'High-protein vegan breakfast wraps, perfect for meal prepping.', '1. Crumble tofu into a bowl and mix with turmeric and salt.
2. Saute spinach and black beans in a pan.
3. Add crumbled tofu and cook for 5 minutes.
4. Wrap mixture in tortilla wraps and store.', 2, 2, 2),

('local', 'Classic Lentil Shepherd''s Pie', 'Hearty, comforting protein-packed pie topped with mashed potatoes.', '1. Boil potatoes and mash with olive oil.
2. Cook lentils with carrots, onion, peas, and vegetable broth.
3. Transfer lentil mix to baking dish, top with mashed potatoes.
4. Bake at 200°C for 25 minutes.', 4, 2, 3),

('local', 'Mediterranean Chickpea Salad', 'Zesty, refreshing, and high-fiber meal-prep salad.', '1. Rinse chickpeas and toss in a large bowl.
2. Add diced cucumber, cherry tomatoes, and sliced kalamata olives.
3. Drizzle with olive oil and lemon juice.
4. Mix well and store in airtight containers.', 2, 1, 4),

('local', 'Spicy Black Bean Chili', 'Smoky, rich, and high-fiber chili that gets better the next day.', '1. Saute diced onion, sweet potato, and bell pepper in a pot.
2. Add black beans, canned tomatoes, and chili powder.
3. Simmer for 30 minutes until sweet potatoes are tender.
4. Serve or portion for prep.', 4, 2, 5),

('local', 'Coconut Chickpea Curry', 'Creamy, aromatic, and comforting beginner-friendly curry.', '1. Cook rice and set aside.
2. Cook onion and curry powder in a pan.
3. Add canned chickpeas, coconut milk, and simmer for 15 minutes.
4. Stir in spinach until wilted, serve with rice.', 4, 2, 6),

('local', 'Quinoa Salad with Sweet Potato', 'Nutrient-dense grain salad with sweet potatoes and tahini dressing.', '1. Roast diced sweet potato with olive oil.
2. Cook quinoa in vegetable broth.
3. Mix quinoa, roasted sweet potatoes, spinach, and pumpkin seeds.
4. Whisk tahini with lemon juice and toss.', 2, 2, 7),

('local', 'Creamy Tuscan White Bean Soup', 'Garlicky, warm, and highly nutritious white bean and kale soup.', '1. Saute garlic and onion in a large pot.
2. Add cannellini beans, canned tomatoes, and vegetable broth.
3. Simmer for 20 minutes, then mash some beans to thicken.
4. Stir in chopped kale and cook for 5 minutes.', 4, 2, 8),

('local', 'Stir-Fry Tofu with Broccoli', 'Easy protein-packed weekday stir-fry with broccoli and rice.', '1. Press and cube tofu, then pan-sear until crispy.
2. Cook broccoli florets with soy sauce, ginger, and sesame oil.
3. Add tofu back to the pan and toss.
4. Serve with cooked jasmine rice.', 2, 1, 9),

('local', 'Lentil Bolognese with Pasta', 'A wholesome, fiber-rich plant-based twist on traditional Bolognese.', '1. Cook spaghetti according to package directions.
2. Saute onion, garlic, and carrots in a pan.
3. Add brown lentils, canned tomatoes, oregano, and simmer for 20 minutes.
4. Mix with cooked pasta and serve.', 4, 2, 10),

('local', 'Roasted Veggie Buddah Bowl', 'Bright, colorful veggie bowl packed with fiber and protein.', '1. Roast broccoli and sweet potato on a baking sheet.
2. Prepare brown rice.
3. Assemble bowls with rice, chickpeas, broccoli, and sweet potato.
4. Drizzle with a simple tahini dressing.', 2, 1, 11),

('local', 'Tempeh Maple-Glazed Stir Fry', 'Nutty, sweet, and savory stir-fry featuring nutrient-dense tempeh.', '1. Slice tempeh and pan-fry in sesame oil until golden.
2. Toss in snap peas and bell pepper, stir-fry for 4 minutes.
3. Stir in soy sauce and maple syrup, cook until glazed.
4. Sprinkle with sesame seeds and serve.', 2, 1, 12),

('local', 'Mexican Quinoa Salad', 'Colorful, protein-packed quinoa salad with lime-cilantro dressing.', '1. Rinse and cook quinoa.
2. Toss cooked quinoa with black beans, sweet corn, and bell pepper.
3. Mix in chopped cilantro and lime juice.
4. Serve cold or store for lunches.', 2, 2, 13),

('local', 'Peanut Noodle Salad with Tofu', 'Flavorful noodle bowl with crispy tofu and a rich peanut dressing.', '1. Cook soba noodles, drain and rinse.
2. Saute cubed tofu until crispy.
3. Whisk peanut butter, soy sauce, and warm water to create dressing.
4. Toss noodles, carrots, cucumber, tofu, and peanut dressing.', 2, 1, 14),

('local', 'Red Lentil Dahl', 'Traditional, comforting, protein-rich dahl served over rice.', '1. Heat oil, saute onion, garlic, and ginger.
2. Add red lentils, canned tomatoes, turmeric, curry powder, and water.
3. Simmer for 25 minutes until lentils are creamy.
4. Serve with cooked rice.', 4, 2, 15),

('local', 'Tofu Souvlaki Salad Bowl', 'Mediterranean-inspired tofu bowl with fresh salads.', '1. Marinade cubed tofu in lemon juice, oregano, and olive oil.
2. Pan-sear tofu until crispy.
3. Combine cucumber, cherry tomatoes, and red onion in bowls.
4. Drizzle cooked tofu with lemon juice.', 2, 1, 16),

('local', 'Butternut Squash Soup', 'Silky, sweet, and highly nutritious butternut squash soup.', '1. Saute onion and garlic in a pot.
2. Add cubed butternut squash and vegetable broth.
3. Boil until soft, then blend until completely smooth.
4. Stir in coconut milk and top with pumpkin seeds.', 4, 2, 17),

('local', 'Black Bean Quinoa Burgers', 'Wholesome plant-based burger patties that hold together well.', '1. Mash black beans in a bowl.
2. Mix in cooked quinoa, oats, cumin, garlic powder, and mix well.
3. Shape into 4 patties.
4. Bake at 190°C for 20 minutes (flip halfway), serve on buns.', 4, 1, 18),

('local', 'Green Edamame Salad', 'Crisp, green, high-protein salad featuring edamame.', '1. Steam edamame and let cool.
2. Toss edamame, sliced cucumber, and spinach together in a bowl.
3. Whisk rice vinegar and sesame seeds, drizzle over salad.
4. Portion and store.', 2, 1, 19),

('local', 'Vegan Chili Sin Carne', 'A thick, protein-heavy chili containing lentils, kidney beans, and corn.', '1. Heat oil in a large pot and saute onion.
2. Add red lentils, kidney beans, canned tomatoes, corn, and chili flakes.
3. Simmer for 30 minutes until lentils are cooked.
4. Serve hot with cooked brown rice.', 4, 2, 20);

-- Link ingredients to recipes (using subqueries to find exact ids dynamically)
-- Recipe 1: Overnight Oats
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Overnight Oats with Chia and Berries' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Rolled Oats' LIMIT 1), 100, 'g', 'rolled'),
((SELECT id FROM recipes WHERE name = 'Overnight Oats with Chia and Berries' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Chia Seeds' LIMIT 1), 15, 'g', ''),
((SELECT id FROM recipes WHERE name = 'Overnight Oats with Chia and Berries' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Almond Milk' LIMIT 1), 250, 'ml', ''),
((SELECT id FROM recipes WHERE name = 'Overnight Oats with Chia and Berries' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Maple Syrup' LIMIT 1), 1, 'tbsp', ''),
((SELECT id FROM recipes WHERE name = 'Overnight Oats with Chia and Berries' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Mixed Berries' LIMIT 1), 100, 'g', 'fresh');

-- Recipe 2: Tofu Scramble Burrito
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Tofu Scramble Breakfast Burrito' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Firm Tofu' LIMIT 1), 250, 'g', 'crumbled'),
((SELECT id FROM recipes WHERE name = 'Tofu Scramble Breakfast Burrito' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Turmeric' LIMIT 1), 1, 'tsp', ''),
((SELECT id FROM recipes WHERE name = 'Tofu Scramble Breakfast Burrito' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Tortilla Wraps' LIMIT 1), 2, 'pcs', ''),
((SELECT id FROM recipes WHERE name = 'Tofu Scramble Breakfast Burrito' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Spinach' LIMIT 1), 50, 'g', 'fresh'),
((SELECT id FROM recipes WHERE name = 'Tofu Scramble Breakfast Burrito' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Black Beans' LIMIT 1), 100, 'g', 'rinsed');

-- Recipe 3: Classic Lentil Shepherd's Pie
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Classic Lentil Shepherd''s Pie' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Potatoes' LIMIT 1), 600, 'g', 'peeled & mashed'),
((SELECT id FROM recipes WHERE name = 'Classic Lentil Shepherd''s Pie' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Brown Lentils' LIMIT 1), 200, 'g', ''),
((SELECT id FROM recipes WHERE name = 'Classic Lentil Shepherd''s Pie' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Carrots' LIMIT 1), 150, 'g', 'diced'),
((SELECT id FROM recipes WHERE name = 'Classic Lentil Shepherd''s Pie' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Peas' LIMIT 1), 100, 'g', 'frozen'),
((SELECT id FROM recipes WHERE name = 'Classic Lentil Shepherd''s Pie' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Vegetable Broth' LIMIT 1), 400, 'ml', ''),
((SELECT id FROM recipes WHERE name = 'Classic Lentil Shepherd''s Pie' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Olive Oil' LIMIT 1), 2, 'tbsp', '');

-- Recipe 4: Mediterranean Chickpea Salad
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Mediterranean Chickpea Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Canned Chickpeas' LIMIT 1), 400, 'g', 'drained'),
((SELECT id FROM recipes WHERE name = 'Mediterranean Chickpea Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cucumber' LIMIT 1), 150, 'g', 'diced'),
((SELECT id FROM recipes WHERE name = 'Mediterranean Chickpea Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cherry Tomatoes' LIMIT 1), 150, 'g', 'halved'),
((SELECT id FROM recipes WHERE name = 'Mediterranean Chickpea Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Kalamata Olives' LIMIT 1), 50, 'g', 'pitted & sliced'),
((SELECT id FROM recipes WHERE name = 'Mediterranean Chickpea Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Olive Oil' LIMIT 1), 1, 'tbsp', ''),
((SELECT id FROM recipes WHERE name = 'Mediterranean Chickpea Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Lemon Juice' LIMIT 1), 1, 'tbsp', '');

-- Recipe 5: Spicy Black Bean Chili
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Spicy Black Bean Chili' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Black Beans' LIMIT 1), 800, 'g', 'drained'),
((SELECT id FROM recipes WHERE name = 'Spicy Black Bean Chili' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Sweet Potato' LIMIT 1), 300, 'g', 'diced'),
((SELECT id FROM recipes WHERE name = 'Spicy Black Bean Chili' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Bell Pepper' LIMIT 1), 150, 'g', 'chopped'),
((SELECT id FROM recipes WHERE name = 'Spicy Black Bean Chili' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Canned Tomatoes' LIMIT 1), 800, 'g', 'crushed'),
((SELECT id FROM recipes WHERE name = 'Spicy Black Bean Chili' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Chili Powder' LIMIT 1), 1, 'tbsp', ''),
((SELECT id FROM recipes WHERE name = 'Spicy Black Bean Chili' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Onion' LIMIT 1), 100, 'g', 'diced');

-- Recipe 6: Coconut Chickpea Curry
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Coconut Chickpea Curry' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Canned Chickpeas' LIMIT 1), 800, 'g', 'drained'),
((SELECT id FROM recipes WHERE name = 'Coconut Chickpea Curry' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Coconut Milk' LIMIT 1), 400, 'ml', 'canned'),
((SELECT id FROM recipes WHERE name = 'Coconut Chickpea Curry' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Spinach' LIMIT 1), 100, 'g', 'fresh'),
((SELECT id FROM recipes WHERE name = 'Coconut Chickpea Curry' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Curry Powder' LIMIT 1), 1.5, 'tbsp', ''),
((SELECT id FROM recipes WHERE name = 'Coconut Chickpea Curry' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Jasmine Rice' LIMIT 1), 200, 'g', 'raw'),
((SELECT id FROM recipes WHERE name = 'Coconut Chickpea Curry' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Onion' LIMIT 1), 100, 'g', 'sliced');

-- Recipe 7: Quinoa Salad with Sweet Potato
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Quinoa Salad with Sweet Potato' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cooked Quinoa' LIMIT 1), 200, 'g', ''),
((SELECT id FROM recipes WHERE name = 'Quinoa Salad with Sweet Potato' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Sweet Potato' LIMIT 1), 200, 'g', 'roasted'),
((SELECT id FROM recipes WHERE name = 'Quinoa Salad with Sweet Potato' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Spinach' LIMIT 1), 80, 'g', 'fresh'),
((SELECT id FROM recipes WHERE name = 'Quinoa Salad with Sweet Potato' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Pumpkin Seeds' LIMIT 1), 20, 'g', 'raw'),
((SELECT id FROM recipes WHERE name = 'Quinoa Salad with Sweet Potato' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Tahini' LIMIT 1), 2, 'tbsp', ''),
((SELECT id FROM recipes WHERE name = 'Quinoa Salad with Sweet Potato' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Lemon Juice' LIMIT 1), 1, 'tbsp', '');

-- Recipe 8: Creamy Tuscan White Bean Soup
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Creamy Tuscan White Bean Soup' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cannellini Beans' LIMIT 1), 800, 'g', 'drained'),
((SELECT id FROM recipes WHERE name = 'Creamy Tuscan White Bean Soup' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Kale' LIMIT 1), 150, 'g', 'chopped'),
((SELECT id FROM recipes WHERE name = 'Creamy Tuscan White Bean Soup' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Canned Tomatoes' LIMIT 1), 400, 'g', 'diced'),
((SELECT id FROM recipes WHERE name = 'Creamy Tuscan White Bean Soup' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Garlic' LIMIT 1), 15, 'g', 'minced'),
((SELECT id FROM recipes WHERE name = 'Creamy Tuscan White Bean Soup' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Vegetable Broth' LIMIT 1), 800, 'ml', ''),
((SELECT id FROM recipes WHERE name = 'Creamy Tuscan White Bean Soup' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Onion' LIMIT 1), 100, 'g', 'diced');

-- Recipe 9: Stir-Fry Tofu with Broccoli
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Stir-Fry Tofu with Broccoli' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Firm Tofu' LIMIT 1), 300, 'g', 'pressed & cubed'),
((SELECT id FROM recipes WHERE name = 'Stir-Fry Tofu with Broccoli' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Broccoli' LIMIT 1), 250, 'g', 'florets'),
((SELECT id FROM recipes WHERE name = 'Stir-Fry Tofu with Broccoli' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Soy Sauce' LIMIT 1), 2, 'tbsp', ''),
((SELECT id FROM recipes WHERE name = 'Stir-Fry Tofu with Broccoli' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Ginger' LIMIT 1), 10, 'g', 'grated'),
((SELECT id FROM recipes WHERE name = 'Stir-Fry Tofu with Broccoli' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Jasmine Rice' LIMIT 1), 150, 'g', 'raw'),
((SELECT id FROM recipes WHERE name = 'Stir-Fry Tofu with Broccoli' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Sesame Oil' LIMIT 1), 1, 'tbsp', '');

-- Recipe 10: Lentil Bolognese with Pasta
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Lentil Bolognese with Pasta' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Brown Lentils' LIMIT 1), 200, 'g', ''),
((SELECT id FROM recipes WHERE name = 'Lentil Bolognese with Pasta' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Canned Tomatoes' LIMIT 1), 800, 'g', 'crushed'),
((SELECT id FROM recipes WHERE name = 'Lentil Bolognese with Pasta' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Spaghetti' LIMIT 1), 300, 'g', 'raw'),
((SELECT id FROM recipes WHERE name = 'Lentil Bolognese with Pasta' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Onion' LIMIT 1), 100, 'g', 'chopped'),
((SELECT id FROM recipes WHERE name = 'Lentil Bolognese with Pasta' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Garlic' LIMIT 1), 10, 'g', 'minced'),
((SELECT id FROM recipes WHERE name = 'Lentil Bolognese with Pasta' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Carrots' LIMIT 1), 100, 'g', 'finely diced');

-- Recipe 11: Roasted Veggie Buddah Bowl
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Roasted Veggie Buddah Bowl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Brown Rice' LIMIT 1), 150, 'g', 'raw'),
((SELECT id FROM recipes WHERE name = 'Roasted Veggie Buddah Bowl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Canned Chickpeas' LIMIT 1), 400, 'g', 'drained'),
((SELECT id FROM recipes WHERE name = 'Roasted Veggie Buddah Bowl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Broccoli' LIMIT 1), 150, 'g', 'florets'),
((SELECT id FROM recipes WHERE name = 'Roasted Veggie Buddah Bowl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Sweet Potato' LIMIT 1), 150, 'g', 'diced'),
((SELECT id FROM recipes WHERE name = 'Roasted Veggie Buddah Bowl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Tahini' LIMIT 1), 2, 'tbsp', '');

-- Recipe 12: Tempeh Maple-Glazed Stir Fry
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Tempeh Maple-Glazed Stir Fry' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Tempeh' LIMIT 1), 200, 'g', 'sliced'),
((SELECT id FROM recipes WHERE name = 'Tempeh Maple-Glazed Stir Fry' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Snap Peas' LIMIT 1), 100, 'g', ''),
((SELECT id FROM recipes WHERE name = 'Tempeh Maple-Glazed Stir Fry' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Bell Pepper' LIMIT 1), 100, 'g', 'sliced'),
((SELECT id FROM recipes WHERE name = 'Tempeh Maple-Glazed Stir Fry' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Soy Sauce' LIMIT 1), 2, 'tbsp', ''),
((SELECT id FROM recipes WHERE name = 'Tempeh Maple-Glazed Stir Fry' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Maple Syrup' LIMIT 1), 1, 'tbsp', ''),
((SELECT id FROM recipes WHERE name = 'Tempeh Maple-Glazed Stir Fry' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Sesame Seeds' LIMIT 1), 5, 'g', ''),
((SELECT id FROM recipes WHERE name = 'Tempeh Maple-Glazed Stir Fry' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Sesame Oil' LIMIT 1), 1, 'tbsp', '');

-- Recipe 13: Mexican Quinoa Salad
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Mexican Quinoa Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cooked Quinoa' LIMIT 1), 200, 'g', ''),
((SELECT id FROM recipes WHERE name = 'Mexican Quinoa Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Black Beans' LIMIT 1), 400, 'g', 'drained'),
((SELECT id FROM recipes WHERE name = 'Mexican Quinoa Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Sweet Corn' LIMIT 1), 150, 'g', 'canned'),
((SELECT id FROM recipes WHERE name = 'Mexican Quinoa Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Bell Pepper' LIMIT 1), 100, 'g', 'diced'),
((SELECT id FROM recipes WHERE name = 'Mexican Quinoa Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cilantro' LIMIT 1), 15, 'g', 'chopped'),
((SELECT id FROM recipes WHERE name = 'Mexican Quinoa Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Lime Juice' LIMIT 1), 1.5, 'tbsp', '');

-- Recipe 14: Peanut Noodle Salad with Tofu
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Peanut Noodle Salad with Tofu' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Soba Noodles' LIMIT 1), 150, 'g', 'raw'),
((SELECT id FROM recipes WHERE name = 'Peanut Noodle Salad with Tofu' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Firm Tofu' LIMIT 1), 250, 'g', 'cubed & baked'),
((SELECT id FROM recipes WHERE name = 'Peanut Noodle Salad with Tofu' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Carrots' LIMIT 1), 80, 'g', 'shredded'),
((SELECT id FROM recipes WHERE name = 'Peanut Noodle Salad with Tofu' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cucumber' LIMIT 1), 100, 'g', 'sliced'),
((SELECT id FROM recipes WHERE name = 'Peanut Noodle Salad with Tofu' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Peanut Butter' LIMIT 1), 3, 'tbsp', ''),
((SELECT id FROM recipes WHERE name = 'Peanut Noodle Salad with Tofu' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Soy Sauce' LIMIT 1), 1.5, 'tbsp', '');

-- Recipe 15: Red Lentil Dahl
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Red Lentil Dahl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Red Lentils' LIMIT 1), 250, 'g', 'split'),
((SELECT id FROM recipes WHERE name = 'Red Lentil Dahl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Jasmine Rice' LIMIT 1), 200, 'g', 'raw'),
((SELECT id FROM recipes WHERE name = 'Red Lentil Dahl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Onion' LIMIT 1), 100, 'g', 'chopped'),
((SELECT id FROM recipes WHERE name = 'Red Lentil Dahl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Garlic' LIMIT 1), 10, 'g', 'minced'),
((SELECT id FROM recipes WHERE name = 'Red Lentil Dahl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Ginger' LIMIT 1), 10, 'g', 'minced'),
((SELECT id FROM recipes WHERE name = 'Red Lentil Dahl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Canned Tomatoes' LIMIT 1), 400, 'g', 'crushed'),
((SELECT id FROM recipes WHERE name = 'Red Lentil Dahl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Turmeric' LIMIT 1), 1, 'tsp', '');

-- Recipe 16: Tofu Souvlaki Salad Bowl
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Tofu Souvlaki Salad Bowl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Firm Tofu' LIMIT 1), 300, 'g', 'cubed'),
((SELECT id FROM recipes WHERE name = 'Tofu Souvlaki Salad Bowl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cucumber' LIMIT 1), 150, 'g', 'diced'),
((SELECT id FROM recipes WHERE name = 'Tofu Souvlaki Salad Bowl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cherry Tomatoes' LIMIT 1), 150, 'g', 'halved'),
((SELECT id FROM recipes WHERE name = 'Tofu Souvlaki Salad Bowl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Red Onion' LIMIT 1), 50, 'g', 'sliced'),
((SELECT id FROM recipes WHERE name = 'Tofu Souvlaki Salad Bowl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Lemon Juice' LIMIT 1), 2, 'tbsp', ''),
((SELECT id FROM recipes WHERE name = 'Tofu Souvlaki Salad Bowl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Oregano' LIMIT 1), 1, 'tsp', ''),
((SELECT id FROM recipes WHERE name = 'Tofu Souvlaki Salad Bowl' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Olive Oil' LIMIT 1), 1, 'tbsp', '');

-- Recipe 17: Butternut Squash Soup
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Butternut Squash' LIMIT 1), 800, 'g', 'cubed'),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Vegetable Broth' LIMIT 1), 800, 'ml', ''),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Coconut Milk' LIMIT 1), 200, 'ml', 'canned'),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Onion' LIMIT 1), 100, 'g', 'chopped'),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Garlic' LIMIT 1), 10, 'g', 'minced'),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Pumpkin Seeds' LIMIT 1), 20, 'g', 'toasted');

-- Recipe 18: Black Bean Quinoa Burgers
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Black Bean Quinoa Burgers' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Black Beans' LIMIT 1), 400, 'g', 'canned'),
((SELECT id FROM recipes WHERE name = 'Black Bean Quinoa Burgers' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cooked Quinoa' LIMIT 1), 100, 'g', ''),
((SELECT id FROM recipes WHERE name = 'Black Bean Quinoa Burgers' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Rolled Oats' LIMIT 1), 60, 'g', ''),
((SELECT id FROM recipes WHERE name = 'Black Bean Quinoa Burgers' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cumin' LIMIT 1), 1, 'tsp', ''),
((SELECT id FROM recipes WHERE name = 'Black Bean Quinoa Burgers' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Garlic Powder' LIMIT 1), 1, 'tsp', ''),
((SELECT id FROM recipes WHERE name = 'Black Bean Quinoa Burgers' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Burger Buns' LIMIT 1), 4, 'pcs', '');

-- Recipe 19: Green Edamame Salad
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Green Edamame Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Shelled Edamame' LIMIT 1), 200, 'g', 'steamed'),
((SELECT id FROM recipes WHERE name = 'Green Edamame Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Cucumber' LIMIT 1), 150, 'g', 'sliced'),
((SELECT id FROM recipes WHERE name = 'Green Edamame Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Spinach' LIMIT 1), 80, 'g', 'fresh'),
((SELECT id FROM recipes WHERE name = 'Green Edamame Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Sesame Seeds' LIMIT 1), 1, 'tbsp', ''),
((SELECT id FROM recipes WHERE name = 'Green Edamame Salad' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Rice Vinegar' LIMIT 1), 1.5, 'tbsp', '');

-- Recipe 20: Vegan Chili Sin Carne
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note) VALUES
((SELECT id FROM recipes WHERE name = 'Vegan Chili Sin Carne' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Red Lentils' LIMIT 1), 100, 'g', ''),
((SELECT id FROM recipes WHERE name = 'Vegan Chili Sin Carne' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Red Kidney Beans' LIMIT 1), 400, 'g', 'canned'),
((SELECT id FROM recipes WHERE name = 'Vegan Chili Sin Carne' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Canned Tomatoes' LIMIT 1), 400, 'g', 'crushed'),
((SELECT id FROM recipes WHERE name = 'Vegan Chili Sin Carne' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Sweet Corn' LIMIT 1), 150, 'g', 'canned'),
((SELECT id FROM recipes WHERE name = 'Vegan Chili Sin Carne' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Chili Flakes' LIMIT 1), 1, 'tsp', ''),
((SELECT id FROM recipes WHERE name = 'Vegan Chili Sin Carne' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Brown Rice' LIMIT 1), 200, 'g', 'raw'),
((SELECT id FROM recipes WHERE name = 'Vegan Chili Sin Carne' LIMIT 1), (SELECT id FROM ingredients WHERE name = 'Onion' LIMIT 1), 100, 'g', 'chopped');
