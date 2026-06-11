CREATE TABLE recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  instructions TEXT NOT NULL DEFAULT '',
  base_servings REAL NOT NULL DEFAULT 2 CHECK (base_servings > 0),
  default_days INTEGER NOT NULL DEFAULT 1 CHECK (default_days > 0),
  last_cooked_at TEXT,
  rotation_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL COLLATE NOCASE,
  category TEXT NOT NULL DEFAULT 'Other',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (name)
);

CREATE TABLE recipe_ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id INTEGER NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity REAL NOT NULL CHECK (quantity >= 0),
  unit TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meal_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_date TEXT NOT NULL,
  planned_day_count INTEGER NOT NULL DEFAULT 7 CHECK (planned_day_count > 0),
  people_count INTEGER NOT NULL DEFAULT 2 CHECK (people_count > 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'accepted')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meal_plan_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  meal_plan_id INTEGER NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  start_day_index INTEGER NOT NULL CHECK (start_day_index >= 0),
  day_count INTEGER NOT NULL CHECK (day_count > 0),
  people_count INTEGER NOT NULL CHECK (people_count > 0),
  serving_multiplier REAL NOT NULL CHECK (serving_multiplier > 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recipes_rotation ON recipes(last_cooked_at, rotation_index, id);
CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX idx_meal_plans_created ON meal_plans(created_at DESC);
CREATE INDEX idx_meal_plan_items_plan ON meal_plan_items(meal_plan_id, start_day_index);
