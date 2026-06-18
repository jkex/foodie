export type Locale = 'en' | 'de';
export type ThemePreference = 'system' | 'light' | 'dark';

export const LOCALE_COOKIE = 'foodie.locale';

export const INGREDIENT_CATEGORIES = ['Produce', 'Dairy', 'Meat', 'Dry goods', 'Spices', 'Canned', 'Frozen', 'Other'] as const;

export const translations = {
	en: {
		appTitle: 'Recipe rotation and shopping list',
		databaseSetupNeeded: 'Database setup needed',
		databaseSetupHelp: 'Apply the D1 migration and bind the database as',
		beforeUsingApp: 'before using the app.',
		generatePlan: 'Generate plan',
		generateNewPlan: 'Generate a new plan',
		startDate: 'Start date',
		cookedFoodDays: 'Cooked-food days',
		people: 'People',
		generateDraft: 'Generate draft',
		latestPlan: 'Latest plan',
		cookedFoodDaysFor: 'cooked-food days for',
		peopleStarting: 'people, starting',
		day: 'Day',
		daySingular: 'day',
		dayPlural: 'days',
		ingredientsMultiplier: 'ingredients',
		acceptPlan: 'Accept plan and rotate recipes',
		adjustPlan: 'Adjust plan',
		regeneratePlan: 'Regenerate draft',
		draftBadge: 'Draft',
		acceptedBadge: 'Accepted',
		noPlan: 'No plan yet',
		planEmptyHelp: 'Generate a draft plan to fill your week with recipes that have waited longest.',
		addRecipesFirst: 'Add a recipe before generating a plan.',
		planHeroTitle: 'Your next two weeks',
		planHeroSubtitle: 'Freshly planned the moment you arrived — tweak anything you like.',
		planAutoBadge: 'Auto-planned',
		weekLabel: 'Week',
		thisWeek: 'This week',
		nextWeek: 'Next week',
		statCookingDays: 'cooking days',
		statForPeople: 'people',
		statInRotation: 'recipes',
		leftoversBadge: 'Leftovers',
		freeDay: 'Open day',
		customizePlan: 'Customize these two weeks',
		planAutoHelp: 'Add a few recipes and we’ll keep your next two weeks planned automatically.',
		smartMix: 'Smarter mix',
		smartMixHint: 'Add an AI key in Settings for an AI-curated mix',
		moreInfo: 'More info',
		infoAutoPlanned: 'We planned your next two weeks automatically. It stays a draft until you accept it — so nothing is locked in yet.',
		infoAcceptPlan:
			'Locks in this plan and marks its recipes as just cooked, so they drop to the back of the rotation and other recipes come up next time.',
		infoSmartMix: 'Uses your AI key to re-order your existing recipes for more variety across the two weeks. Costs one AI request.',
		infoServingMultiplier:
			'How much this recipe’s ingredients are scaled on your shopping list, based on people and days covered. 1.00x matches the recipe’s base servings.',
		infoCookedFoodDays: 'How many days you’ll actually cook. One recipe can stretch over several days as leftovers.',
		noDraftPlan: 'No draft plan to adjust',
		noDraftPlanHelp: 'Generate a draft plan first, then adjust days or swap recipes here.',
		replaceWith: 'Replace with',
		replace: 'Replace',
		update: 'Update',
		days: 'Days',
		recipes: 'Recipes',
		newRecipe: 'New recipe',
		editRecipe: 'Edit recipe',
		searchRecipes: 'Search recipes',
		noSearchResults: 'No recipes match your search.',
		noRecipes: 'No recipes yet',
		recipesEmptyHelp: 'Add your first recipe to start planning meals.',
		lastCooked: 'Last cooked',
		neverCooked: 'Never cooked',
		addRecipe: 'Add recipe',
		name: 'Name',
		baseServings: 'Base servings',
		defaultDays: 'Default days',
		description: 'Description',
		instructions: 'Instructions',
		ingredients: 'Ingredients',
		ingredient: 'Ingredient',
		addIngredient: 'Add ingredient',
		remove: 'Remove',
		quantity: 'Quantity',
		unit: 'Unit',
		category: 'Category',
		note: 'Note',
		recipeNamePlaceholder: 'Pasta with tomato sauce',
		descriptionPlaceholder: 'Quick weekday dinner',
		instructionsPlaceholder: 'Cook, combine, season.',
		ingredientNamePlaceholder: 'Pasta',
		notePlaceholder: 'optional',
		saveRecipe: 'Save recipe',
		saveChanges: 'Save changes',
		deleteRecipe: 'Delete recipe',
		delete: 'Delete',
		back: 'Back',
		noDescription: 'No description yet.',
		recipeNotFound: 'Recipe not found.',
		shoppingList: 'Shopping list',
		generatePlanForShopping: 'Generate a plan to see the shopping list.',
		itemsChecked: 'checked',
		categoryProduce: 'Produce',
		categoryDairy: 'Dairy',
		categoryMeat: 'Meat',
		categoryProtein: 'Protein',
		categoryDryGoods: 'Dry goods',
		categorySpices: 'Spices',
		categoryCanned: 'Canned',
		categoryFrozen: 'Frozen',
		categoryOther: 'Other',
		aiSection: 'AI assistant',
		aiSectionHelp: 'Add your own API key to generate and edit recipes with an AI model. The key is stored in the app database.',
		aiProvider: 'Provider',
		aiModel: 'Model',
		aiApiKey: 'API key',
		aiApiKeyKeepHelp: 'Leave empty to keep the saved key.',
		aiConfigured: 'Configured',
		aiNotConfigured: 'Not configured',
		aiSave: 'Save AI settings',
		aiRemoveKey: 'Remove key',
		aiSettingsHint: 'Add your AI API key in Settings to generate recipes.',
		generateWithAi: 'Generate with AI',
		aiPromptPlaceholder: 'e.g. A quick vegetarian pasta for weekdays',
		aiGenerateButton: 'Generate recipe',
		editWithAi: 'Edit with AI',
		aiEditPlaceholder: 'e.g. Make it vegetarian and scale to 4 servings',
		aiApplyButton: 'Apply change',
		aiErrorTitle: 'AI request failed',
		aiChatTitle: 'AI Recipe Assistant',
		aiChatPlaceholder: 'Ask AI to modify the recipe (e.g. scale to 4 servings, make it spicy...)',
		aiSend: 'Send',
		aiApplying: 'Applying...',
		aiApplyToForm: 'Apply changes to recipe form',
		aiPreviewTitle: 'AI Proposed Changes Preview',
		aiThinking: 'AI is thinking...',
		language: 'Language',
		english: 'English',
		german: 'German',
		theme: 'Theme',
		system: 'System',
		light: 'Light',
		dark: 'Dark',
		planNav: 'Plan',
		recipesNav: 'Recipes',
		shoppingNav: 'Shopping',
		settingsNav: 'Settings',
		signInTitle: 'Sign in',
		signInHelp: 'Sign in with Google or Apple to manage your recipes.',
		continueWithGoogle: 'Continue with Google',
		continueWithApple: 'Continue with Apple',
		workosMissing: 'WorkOS is not configured.',
		workosMissingHelp: 'Set WORKOS_API_KEY, WORKOS_CLIENT_ID, and WORKOS_COOKIE_PASSWORD as Cloudflare Worker secrets.',
		signOut: 'Sign out',
	},
	de: {
		appTitle: 'Rezeptrotation und Einkaufsliste',
		databaseSetupNeeded: 'Datenbankeinrichtung erforderlich',
		databaseSetupHelp: 'Wende die D1-Migration an und binde die Datenbank als',
		beforeUsingApp: 'bevor du die App verwendest.',
		generatePlan: 'Plan erstellen',
		generateNewPlan: 'Neuen Plan erstellen',
		startDate: 'Startdatum',
		cookedFoodDays: 'Tage mit gekochtem Essen',
		people: 'Personen',
		generateDraft: 'Entwurf erstellen',
		latestPlan: 'Aktueller Plan',
		cookedFoodDaysFor: 'Tage mit gekochtem Essen für',
		peopleStarting: 'Personen, ab',
		day: 'Tag',
		daySingular: 'Tag',
		dayPlural: 'Tage',
		ingredientsMultiplier: 'Zutaten',
		acceptPlan: 'Plan annehmen und Rezepte rotieren',
		adjustPlan: 'Plan anpassen',
		regeneratePlan: 'Entwurf neu erstellen',
		draftBadge: 'Entwurf',
		acceptedBadge: 'Angenommen',
		noPlan: 'Noch kein Plan',
		planEmptyHelp: 'Erstelle einen Planentwurf mit den Rezepten, die am längsten warten.',
		addRecipesFirst: 'Füge zuerst ein Rezept hinzu, bevor du einen Plan erstellst.',
		planHeroTitle: 'Deine nächsten zwei Wochen',
		planHeroSubtitle: 'Schon fertig geplant – pass alles nach Lust und Laune an.',
		planAutoBadge: 'Automatisch geplant',
		weekLabel: 'Woche',
		thisWeek: 'Diese Woche',
		nextWeek: 'Nächste Woche',
		statCookingDays: 'Kochtage',
		statForPeople: 'Personen',
		statInRotation: 'Rezepte',
		leftoversBadge: 'Reste',
		freeDay: 'Freier Tag',
		customizePlan: 'Diese zwei Wochen anpassen',
		planAutoHelp: 'Leg ein paar Rezepte an, dann planen wir deine nächsten zwei Wochen automatisch.',
		smartMix: 'Clever mischen',
		smartMixHint: 'Hinterleg in den Einstellungen einen KI-Schlüssel für mehr Abwechslung',
		moreInfo: 'Mehr Infos',
		infoAutoPlanned:
			'Wir haben deine nächsten zwei Wochen automatisch geplant. Es bleibt ein Entwurf, bis du ihn annimmst – noch ist nichts festgelegt.',
		infoAcceptPlan:
			'Bestätigt den Plan und markiert seine Rezepte als gerade gekocht. So rutschen sie in der Rotation nach hinten und beim nächsten Mal kommen andere Rezepte dran.',
		infoSmartMix:
			'Nutzt deinen KI-Schlüssel, um deine vorhandenen Rezepte für mehr Abwechslung über die zwei Wochen neu zu sortieren. Kostet eine KI-Anfrage.',
		infoServingMultiplier:
			'Wie stark die Zutaten dieses Rezepts für die Einkaufsliste hochgerechnet werden – nach Personen und Tagen. 1,00x entspricht den Grundportionen des Rezepts.',
		infoCookedFoodDays: 'An wie vielen Tagen du tatsächlich kochst. Ein Rezept kann sich über Reste auf mehrere Tage strecken.',
		noDraftPlan: 'Kein Entwurf zum Anpassen',
		noDraftPlanHelp: 'Erstelle zuerst einen Planentwurf, dann kannst du hier Tage ändern oder Rezepte tauschen.',
		replaceWith: 'Ersetzen durch',
		replace: 'Ersetzen',
		update: 'Aktualisieren',
		days: 'Tage',
		recipes: 'Rezepte',
		newRecipe: 'Neues Rezept',
		editRecipe: 'Rezept bearbeiten',
		searchRecipes: 'Rezepte suchen',
		noSearchResults: 'Keine Rezepte gefunden.',
		noRecipes: 'Noch keine Rezepte',
		recipesEmptyHelp: 'Füge dein erstes Rezept hinzu, um mit der Planung zu starten.',
		lastCooked: 'Zuletzt gekocht',
		neverCooked: 'Noch nie gekocht',
		addRecipe: 'Rezept hinzufügen',
		name: 'Name',
		baseServings: 'Basisportionen',
		defaultDays: 'Standardtage',
		description: 'Beschreibung',
		instructions: 'Zubereitung',
		ingredients: 'Zutaten',
		ingredient: 'Zutat',
		addIngredient: 'Zutat hinzufügen',
		remove: 'Entfernen',
		quantity: 'Menge',
		unit: 'Einheit',
		category: 'Kategorie',
		note: 'Notiz',
		recipeNamePlaceholder: 'Pasta mit Tomatensauce',
		descriptionPlaceholder: 'Schnelles Abendessen unter der Woche',
		instructionsPlaceholder: 'Kochen, vermengen, abschmecken.',
		ingredientNamePlaceholder: 'Pasta',
		notePlaceholder: 'optional',
		saveRecipe: 'Rezept speichern',
		saveChanges: 'Änderungen speichern',
		deleteRecipe: 'Rezept löschen',
		delete: 'Löschen',
		back: 'Zurück',
		noDescription: 'Noch keine Beschreibung.',
		recipeNotFound: 'Rezept nicht gefunden.',
		shoppingList: 'Einkaufsliste',
		generatePlanForShopping: 'Erstelle einen Plan, um die Einkaufsliste zu sehen.',
		itemsChecked: 'erledigt',
		categoryProduce: 'Obst & Gemüse',
		categoryDairy: 'Milchprodukte',
		categoryMeat: 'Fleisch',
		categoryProtein: 'Protein',
		categoryDryGoods: 'Trockenware',
		categorySpices: 'Gewürze',
		categoryCanned: 'Konserven',
		categoryFrozen: 'Tiefkühl',
		categoryOther: 'Sonstiges',
		aiSection: 'KI-Assistent',
		aiSectionHelp:
			'Hinterlege deinen eigenen API-Schlüssel, um Rezepte mit einem KI-Modell zu erstellen und zu bearbeiten. Der Schlüssel wird in der App-Datenbank gespeichert.',
		aiProvider: 'Anbieter',
		aiModel: 'Modell',
		aiApiKey: 'API-Schlüssel',
		aiApiKeyKeepHelp: 'Leer lassen, um den gespeicherten Schlüssel zu behalten.',
		aiConfigured: 'Eingerichtet',
		aiNotConfigured: 'Nicht eingerichtet',
		aiSave: 'KI-Einstellungen speichern',
		aiRemoveKey: 'Schlüssel entfernen',
		aiSettingsHint: 'Hinterlege deinen KI-API-Schlüssel in den Einstellungen, um Rezepte zu generieren.',
		generateWithAi: 'Mit KI erstellen',
		aiPromptPlaceholder: 'z. B. Schnelle vegetarische Pasta für unter der Woche',
		aiGenerateButton: 'Rezept erstellen',
		editWithAi: 'Mit KI bearbeiten',
		aiEditPlaceholder: 'z. B. Mach es vegetarisch und skaliere auf 4 Portionen',
		aiApplyButton: 'Änderung anwenden',
		aiErrorTitle: 'KI-Anfrage fehlgeschlagen',
		aiChatTitle: 'KI-Rezeptassistent',
		aiChatPlaceholder: 'KI bitten, das Rezept anzupassen (z. B. auf 4 Portionen skalieren, schärfer machen...)',
		aiSend: 'Senden',
		aiApplying: 'Wird angewendet...',
		aiApplyToForm: 'Änderungen in Rezeptformular übernehmen',
		aiPreviewTitle: 'Vorschau der vorgeschlagenen KI-Änderungen',
		aiThinking: 'KI überlegt...',
		language: 'Sprache',
		english: 'Englisch',
		german: 'Deutsch',
		theme: 'Design',
		system: 'System',
		light: 'Hell',
		dark: 'Dunkel',
		planNav: 'Plan',
		recipesNav: 'Rezepte',
		shoppingNav: 'Einkauf',
		settingsNav: 'Einstellungen',
		signInTitle: 'Anmelden',
		signInHelp: 'Melde dich mit Google oder Apple an, um deine Rezepte zu verwalten.',
		continueWithGoogle: 'Mit Google fortfahren',
		continueWithApple: 'Mit Apple fortfahren',
		workosMissing: 'WorkOS ist nicht konfiguriert.',
		workosMissingHelp: 'Setze WORKOS_API_KEY, WORKOS_CLIENT_ID und WORKOS_COOKIE_PASSWORD als Cloudflare Worker Secrets.',
		signOut: 'Abmelden',
	},
} as const;

export type TranslationKey = keyof typeof translations.en;

export function detectLocale(acceptLanguage: string | null): Locale {
	return acceptLanguage?.toLowerCase().startsWith('de') ? 'de' : 'en';
}

const CATEGORY_KEYS: Record<string, TranslationKey> = {
	produce: 'categoryProduce',
	dairy: 'categoryDairy',
	meat: 'categoryMeat',
	protein: 'categoryProtein',
	'dry goods': 'categoryDryGoods',
	spices: 'categorySpices',
	canned: 'categoryCanned',
	frozen: 'categoryFrozen',
	other: 'categoryOther',
};

export function translateCategory(locale: Locale, category: string): string {
	const key = CATEGORY_KEYS[category.trim().toLowerCase()];
	return key ? translations[locale][key] : category;
}

const INGREDIENT_TRANSLATIONS: Record<string, Record<Locale, string>> = {
	'rolled oats': { en: 'Rolled Oats', de: 'Haferflocken' },
	'chia seeds': { en: 'Chia Seeds', de: 'Chiasamen' },
	'almond milk': { en: 'Almond Milk', de: 'Mandelmilch' },
	'maple syrup': { en: 'Maple Syrup', de: 'Ahornsirup' },
	'mixed berries': { en: 'Mixed Berries', de: 'Gemischte Beeren' },
	'firm tofu': { en: 'Firm Tofu', de: 'Fester Tofu' },
	turmeric: { en: 'Turmeric', de: 'Kurkuma' },
	'tortilla wraps': { en: 'Tortilla Wraps', de: 'Tortilla-Wraps' },
	spinach: { en: 'Spinach', de: 'Spinat' },
	'black beans': { en: 'Black Beans', de: 'Schwarze Bohnen' },
	'brown lentils': { en: 'Brown Lentils', de: 'Braune Linsen' },
	potatoes: { en: 'Potatoes', de: 'Kartoffeln' },
	carrots: { en: 'Carrots', de: 'Karotten' },
	peas: { en: 'Peas', de: 'Erbsen' },
	'vegetable broth': { en: 'Vegetable Broth', de: 'Gemüsebrühe' },
	'canned chickpeas': { en: 'Canned Chickpeas', de: 'Kichererbsen (Dose)' },
	cucumber: { en: 'Cucumber', de: 'Gurke' },
	'cherry tomatoes': { en: 'Cherry Tomatoes', de: 'Kirschtomaten' },
	'kalamata olives': { en: 'Kalamata Olives', de: 'Kalamata-Oliven' },
	'olive oil': { en: 'Olive Oil', de: 'Olivenöl' },
	'lemon juice': { en: 'Lemon Juice', de: 'Zitronensaft' },
	'canned tomatoes': { en: 'Canned Tomatoes', de: 'Tomaten (Dose)' },
	onion: { en: 'Onion', de: 'Zwiebel' },
	'chili powder': { en: 'Chili Powder', de: 'Chilipulver' },
	'sweet potato': { en: 'Sweet Potato', de: 'Süßkartoffel' },
	'bell pepper': { en: 'Bell Pepper', de: 'Paprika' },
	'coconut milk': { en: 'Coconut Milk', de: 'Kokosmilch' },
	'curry powder': { en: 'Curry Powder', de: 'Currypulver' },
	'brown rice': { en: 'Brown Rice', de: 'Brauner Reis' },
	'pumpkin seeds': { en: 'Pumpkin Seeds', de: 'Kürbiskerne' },
	tahini: { en: 'Tahini', de: 'Tahini' },
	'cannellini beans': { en: 'Cannellini Beans', de: 'Cannellini-Bohnen' },
	kale: { en: 'Kale', de: 'Grünkohl' },
	garlic: { en: 'Garlic', de: 'Knoblauch' },
	broccoli: { en: 'Broccoli', de: 'Brokkoli' },
	'soy sauce': { en: 'Soy Sauce', de: 'Sojasauce' },
	ginger: { en: 'Ginger', de: 'Ingwer' },
	'jasmine rice': { en: 'Jasmine Rice', de: 'Jasminreis' },
	'sesame oil': { en: 'Sesame Oil', de: 'Sesamöl' },
	spaghetti: { en: 'Spaghetti', de: 'Spaghetti' },
	oregano: { en: 'Oregano', de: 'Oregano' },
	tempeh: { en: 'Tempeh', de: 'Tempeh' },
	'snap peas': { en: 'Snap Peas', de: 'Zuckerschoten' },
	'sesame seeds': { en: 'Sesame Seeds', de: 'Sesamsamen' },
	'sweet corn': { en: 'Sweet Corn', de: 'Mais' },
	cilantro: { en: 'Cilantro', de: 'Koriander' },
	'lime juice': { en: 'Lime Juice', de: 'Limettensaft' },
	'soba noodles': { en: 'Soba Noodles', de: 'Sobanudeln' },
	'peanut butter': { en: 'Peanut Butter', de: 'Erdnussbutter' },
	'red lentils': { en: 'Red Lentils', de: 'Rote Linsen' },
	'red onion': { en: 'Red Onion', de: 'Rote Zwiebel' },
	'butternut squash': { en: 'Butternut Squash', de: 'Butternusskürbis' },
	'cooked quinoa': { en: 'Cooked Quinoa', de: 'Gekochte Quinoa' },
	cumin: { en: 'Cumin', de: 'Kreuzkümmel' },
	'garlic powder': { en: 'Garlic Powder', de: 'Knoblauchpulver' },
	'burger buns': { en: 'Burger Buns', de: 'Burger-Brötchen' },
	'shelled edamame': { en: 'Shelled Edamame', de: 'Edamame (geschält)' },
	'rice vinegar': { en: 'Rice Vinegar', de: 'Reisessig' },
	'red kidney beans': { en: 'Red Kidney Beans', de: 'Kidneybohnen' },
	'chili flakes': { en: 'Chili Flakes', de: 'Chiliflocken' },
	'unsweetened low-fat milk': { en: 'Unsweetened Low-Fat Milk', de: 'Ungesüßte fettarme Milch' },
	cinnamon: { en: 'Cinnamon', de: 'Zimt' },
	mushrooms: { en: 'Mushrooms', de: 'Pilze' },
	'whole-grain wraps': { en: 'Whole-Grain Wraps', de: 'Vollkorn-Wraps' },
	'low-sodium vegetable broth': { en: 'Low-Sodium Vegetable Broth', de: 'Salzarme Gemüsebrühe' },
	'whole-grain bulgur': { en: 'Whole-Grain Bulgur', de: 'Vollkornbulgur' },
	parsley: { en: 'Parsley', de: 'Petersilie' },
	'no-salt-added tomatoes': { en: 'No-Salt-Added Tomatoes', de: 'Tomaten ohne Salzzusatz' },
	'smoked paprika': { en: 'Smoked Paprika', de: 'Geräuchertes Paprikapulver' },
	cauliflower: { en: 'Cauliflower', de: 'Blumenkohl' },
	'light coconut milk': { en: 'Light Coconut Milk', de: 'Fettreduzierte Kokosmilch' },
	quinoa: { en: 'Quinoa', de: 'Quinoa' },
	'reduced-salt soy sauce': { en: 'Reduced-Salt Soy Sauce', de: 'Salzreduzierte Sojasauce' },
	'whole-wheat pasta': { en: 'Whole-Wheat Pasta', de: 'Vollkornnudeln' },
	celery: { en: 'Celery', de: 'Staudensellerie' },
	cabbage: { en: 'Cabbage', de: 'Weißkohl' },
	'natural peanut butter': { en: 'Natural Peanut Butter', de: 'Erdnussmus ohne Zusätze' },
	'brown basmati rice': { en: 'Brown Basmati Rice', de: 'Vollkorn-Basmatireis' },
	'whole-grain couscous': { en: 'Whole-Grain Couscous', de: 'Vollkorncouscous' },
	'whole-grain burger buns': { en: 'Whole-Grain Burger Buns', de: 'Vollkorn-Burgerbrötchen' },
	tomatoes: { en: 'Tomatoes', de: 'Tomaten' },
	'pearl barley': { en: 'Pearl Barley', de: 'Graupen' },
	'dried thyme': { en: 'Dried Thyme', de: 'Getrockneter Thymian' },
	apples: { en: 'Apples', de: 'Äpfel' },
	eggs: { en: 'Eggs', de: 'Eier' },
	walnuts: { en: 'Walnuts', de: 'Walnüsse' },
	'rye bread': { en: 'Rye Bread', de: 'Vollkorn-Roggenbrot' },
	'low-fat plain yogurt': { en: 'Low-Fat Plain Yogurt', de: 'Fettarmer Naturjoghurt' },
	pears: { en: 'Pears', de: 'Birnen' },
	'ground flaxseed': { en: 'Ground Flaxseed', de: 'Geschrotete Leinsamen' },
	zucchini: { en: 'Zucchini', de: 'Zucchini' },
	'dried split peas': { en: 'Dried Split Peas', de: 'Getrocknete Schälerbsen' },
	leek: { en: 'Leek', de: 'Lauch' },
	celeriac: { en: 'Celeriac', de: 'Knollensellerie' },
	'chicken breast': { en: 'Chicken Breast', de: 'Hähnchenbrust' },
	'low-sodium chicken broth': { en: 'Low-Sodium Chicken Broth', de: 'Salzarme Hühnerbrühe' },
	aubergine: { en: 'Aubergine', de: 'Aubergine' },
	'dried herbs': { en: 'Dried Herbs', de: 'Getrocknete Kräuter' },
	'cooked lentils': { en: 'Cooked Lentils', de: 'Gekochte Linsen' },
	'salmon fillets': { en: 'Salmon Fillets', de: 'Lachsfilets' },
	'green beans': { en: 'Green Beans', de: 'Grüne Bohnen' },
	'cod fillets': { en: 'Cod Fillets', de: 'Kabeljaufilets' },
	parsnip: { en: 'Parsnip', de: 'Pastinake' },
	beetroot: { en: 'Beetroot', de: 'Rote Bete' },
	'lean turkey mince': { en: 'Lean Turkey Mince', de: 'Mageres Putenhackfleisch' },
	'hard cheese': { en: 'Hard Cheese', de: 'Hartkäse' },
	'buckwheat groats': { en: 'Buckwheat Groats', de: 'Buchweizen' },
	'spring onion': { en: 'Spring Onion', de: 'Frühlingszwiebel' },
	'red cabbage': { en: 'Red Cabbage', de: 'Rotkohl' },
	'tuna in spring water': { en: 'Tuna in Spring Water', de: 'Thunfisch im eigenen Saft' },
	'whole-grain bread': { en: 'Whole-Grain Bread', de: 'Vollkornbrot' },
	hummus: { en: 'Hummus', de: 'Hummus' },
	'whole-grain lasagne sheets': { en: 'Whole-Wheat Lasagne Sheets', de: 'Vollkorn-Lasagneblätter' },
	mozzarella: { en: 'Mozzarella', de: 'Mozzarella' },
	'whole-grain mustard': { en: 'Whole-Grain Mustard', de: 'Körniger Senf' },
	pumpkin: { en: 'Pumpkin', de: 'Kürbis' },
	millet: { en: 'Millet', de: 'Hirse' },
	'sardines in olive oil': { en: 'Sardines in Olive Oil', de: 'Sardinen in Olivenöl' },
};

export function translateIngredient(locale: Locale, name: string): string {
	const normalized = name.trim().toLowerCase();
	const match = INGREDIENT_TRANSLATIONS[normalized];
	return match ? match[locale] : name;
}

export type TranslatedRecipeData = {
	name: string;
	description: string;
	instructions: string;
};

const RECIPE_TRANSLATIONS: Record<string, Record<Locale, TranslatedRecipeData>> = {
	'Overnight Oats with Chia and Berries': {
		en: {
			name: 'Overnight Oats with Chia and Berries',
			description: 'Fiber-rich, low-prep breakfast ready in the morning.',
			instructions:
				'1. Combine rolled oats, chia seeds, and almond milk in a jar.\n2. Stir in maple syrup and mix well.\n3. Cover and refrigerate overnight.\n4. Top with fresh berries before eating.',
		},
		de: {
			name: 'Overnight Oats mit Chia und Beeren',
			description: 'Ballaststoffreiches, einfaches Frühstück, das morgens fertig ist.',
			instructions:
				'1. Haferflocken, Chiasamen und Mandelmilch in einem Glas vermengen.\n2. Ahornsirup hinzufügen und gut umrühren.\n3. Abdecken und über Nacht in den Kühlschrank stellen.\n4. Vor dem Servieren mit frischen Beeren garnieren.',
		},
	},
	'Tofu Scramble Breakfast Burrito': {
		en: {
			name: 'Tofu Scramble Breakfast Burrito',
			description: 'High-protein vegan breakfast wraps, perfect for meal prepping.',
			instructions:
				'1. Crumble tofu into a bowl and mix with turmeric and salt.\n2. Saute spinach and black beans in a pan.\n3. Add crumbled tofu and cook for 5 minutes.\n4. Wrap mixture in tortilla wraps and store.',
		},
		de: {
			name: 'Tofu-Rührei-Frühstücksburrito',
			description: 'Proteinreiche vegane Frühstückswraps, perfekt zum Vorkochen.',
			instructions:
				'1. Tofu in eine Schüssel krümeln und mit Kurkuma und Salz vermischen.\n2. Spinat und schwarze Bohnen in einer Pfanne anbraten.\n3. Gekrümelten Tofu hinzufügen und 5 Minuten garen.\n4. Die Mischung in Tortilla-Wraps wickeln und lagern.',
		},
	},
	"Classic Lentil Shepherd's Pie": {
		en: {
			name: "Classic Lentil Shepherd's Pie",
			description: 'Hearty, comforting protein-packed pie topped with mashed potatoes.',
			instructions:
				'1. Boil potatoes and mash with olive oil.\n2. Cook lentils with carrots, onion, peas, and vegetable broth.\n3. Transfer lentil mix to baking dish, top with mashed potatoes.\n4. Bake at 200°C for 25 minutes.',
		},
		de: {
			name: "Klassischer Linsen-Shepherd's-Pie",
			description: 'Herzhafter, wärmender Auflauf mit Linsen und Kartoffelpüree.',
			instructions:
				'1. Kartoffeln kochen und mit Olivenöl zerstampfen.\n2. Linsen mit Karotten, Zwiebel, Erbsen und Gemüsebrühe kochen.\n3. Linsenmischung in eine Auflaufform füllen, mit Kartoffelpüree bestreichen.\n4. Bei 200°C 25 Minuten backen.',
		},
	},
	'Mediterranean Chickpea Salad': {
		en: {
			name: 'Mediterranean Chickpea Salad',
			description: 'Zesty, refreshing, and high-fiber meal-prep salad.',
			instructions:
				'1. Rinse chickpeas and toss in a large bowl.\n2. Add diced cucumber, cherry tomatoes, and sliced kalamata olives.\n3. Drizzle with olive oil and lemon juice.\n4. Mix well and store in airtight containers.',
		},
		de: {
			name: 'Mediterraner Kichererbsensalat',
			description: 'Würziger, erfrischender und ballaststoffreicher Salat zum Vorkochen.',
			instructions:
				'1. Kichererbsen abspülen und in eine große Schüssel geben.\n2. Gewürfelte Gurke, Kirschtomaten und geschnittene Kalamata-Oliven hinzufügen.\n3. Mit Olivenöl und Zitronensaft beträufeln.\n4. Gut mischen und in luftdichten Behältern lagern.',
		},
	},
	'Spicy Black Bean Chili': {
		en: {
			name: 'Spicy Black Bean Chili',
			description: 'Smoky, rich, and high-fiber chili that gets better the next day.',
			instructions:
				'1. Saute diced onion, sweet potato, and bell pepper in a pot.\n2. Add black beans, canned tomatoes, and chili powder.\n3. Simmer for 30 minutes until sweet potatoes are tender.\n4. Serve or portion for prep.',
		},
		de: {
			name: 'Scharfes schwarzes Bohnen-Chili',
			description: 'Würziges, reichhaltiges und ballaststoffreiches Chili, das am nächsten Tag noch besser schmeckt.',
			instructions:
				'1. Gewürfelte Zwiebel, Süßkartoffel und Paprika in einem Topf anbraten.\n2. Schwarze Bohnen, Tomatendose und Chilipulver hinzufügen.\n3. 30 Minuten köcheln lassen, bis die Süßkartoffeln weich sind.\n4. Servieren oder portionieren.',
		},
	},
	'Coconut Chickpea Curry': {
		en: {
			name: 'Coconut Chickpea Curry',
			description: 'Creamy, aromatic, and comforting beginner-friendly curry.',
			instructions:
				'1. Cook rice and set aside.\n2. Cook onion and curry powder in a pan.\n3. Add canned chickpeas, coconut milk, and simmer for 15 minutes.\n4. Stir in spinach until wilted, serve with rice.',
		},
		de: {
			name: 'Kokos-Kichererbsen-Curry',
			description: 'Cremiges, aromatisches und wärmendes Curry für Anfänger.',
			instructions:
				'1. Reis kochen und beiseite stellen.\n2. Zwiebel und Currypulver in einer Pfanne anbraten.\n3. Kichererbsen und Kokosmilch hinzufügen und 15 Minuten köcheln lassen.\n4. Spinat unterrühren, bis er zusammenfällt, mit Reis servieren.',
		},
	},
	'Quinoa Salad with Sweet Potato': {
		en: {
			name: 'Quinoa Salad with Sweet Potato',
			description: 'Nutrient-dense grain salad with sweet potatoes and tahini dressing.',
			instructions:
				'1. Roast diced sweet potato with olive oil.\n2. Cook quinoa in vegetable broth.\n3. Mix quinoa, roasted sweet potatoes, spinach, and pumpkin seeds.\n4. Whisk tahini with lemon juice and toss.',
		},
		de: {
			name: 'Quinoasalat mit Süßkartoffel',
			description: 'Nährstoffreicher Getreidesalat mit Süßkartoffeln und Tahini-Dressing.',
			instructions:
				'1. Gewürfelte Süßkartoffel mit Olivenöl im Ofen rösten.\n2. Quinoa in Gemüsebrühe kochen.\n3. Quinoa, geröstete Süßkartoffeln, Spinat und Kürbiskerne vermischen.\n4. Tahini mit Zitronensaft verrühren und unterheben.',
		},
	},
	'Creamy Tuscan White Bean Soup': {
		en: {
			name: 'Creamy Tuscan White Bean Soup',
			description: 'Garlicky, warm, and highly nutritious white bean and kale soup.',
			instructions:
				'1. Saute garlic and onion in a large pot.\n2. Add cannellini beans, canned tomatoes, and vegetable broth.\n3. Simmer for 20 minutes, then mash some beans to thicken.\n4. Stir in chopped kale and cook for 5 minutes.',
		},
		de: {
			name: 'Cremige toskanische weiße Bohnensuppe',
			description: 'Knoblauchige, warme und nahrhafte Suppe mit weißen Bohnen und Grünkohl.',
			instructions:
				'1. Knoblauch und Zwiebel in einem großen Topf anbraten.\n2. Cannellini-Bohnen, Tomatendose und Gemüsebrühe hinzufügen.\n3. 20 Minuten köcheln lassen, dann einige Bohnen zerdrücken, um die Suppe einzudicken.\n4. Gehackten Grünkohl unterrühren und 5 Minuten garen.',
		},
	},
	'Stir-Fry Tofu with Broccoli': {
		en: {
			name: 'Stir-Fry Tofu with Broccoli',
			description: 'Easy protein-packed weekday stir-fry with broccoli and rice.',
			instructions:
				'1. Press and cube tofu, then pan-sear until crispy.\n2. Cook broccoli florets with soy sauce, ginger, and sesame oil.\n3. Add tofu back to the pan and toss.\n4. Serve with cooked jasmine rice.',
		},
		de: {
			name: 'Tofu-Brokkoli-Pfanne',
			description: 'Einfaches, proteinreiches Wokgericht mit Brokkoli und Jasminreis.',
			instructions:
				'1. Tofu pressen, würfeln und in der Pfanne knusprig anbraten.\n2. Brokkoliröschen mit Sojasauce, Ingwer und Sesamöl garen.\n3. Tofu zurück in die Pfanne geben und schwenken.\n4. Mit gekochtem Jasminreis servieren.',
		},
	},
	'Lentil Bolognese with Pasta': {
		en: {
			name: 'Lentil Bolognese with Pasta',
			description: 'A wholesome, fiber-rich plant-based twist on traditional Bolognese.',
			instructions:
				'1. Cook spaghetti according to package directions.\n2. Saute onion, garlic, and carrots in a pan.\n3. Add brown lentils, canned tomatoes, oregano, and simmer for 20 minutes.\n4. Mix with cooked pasta and serve.',
		},
		de: {
			name: 'Linsenbolognese mit Nudeln',
			description: 'Gesunde, ballaststoffreiche pflanzliche Variante der klassischen Bolognese.',
			instructions:
				'1. Spaghetti nach Packungsanleitung kochen.\n2. Zwiebel, Knoblauch und Karotten in einer Pfanne anbraten.\n3. Braune Linsen, Tomatendose, Oregano hinzufügen und 20 Minuten köcheln lassen.\n4. Mit gekochten Nudeln mischen und servieren.',
		},
	},
	'Roasted Veggie Buddah Bowl': {
		en: {
			name: 'Roasted Veggie Buddah Bowl',
			description: 'Bright, colorful veggie bowl packed with fiber and protein.',
			instructions:
				'1. Roast broccoli and sweet potato on a baking sheet.\n2. Prepare brown rice.\n3. Assemble bowls with rice, chickpeas, broccoli, and sweet potato.\n4. Drizzle with a simple tahini dressing.',
		},
		de: {
			name: 'Buddha-Bowl mit geröstetem Gemüse',
			description: 'Bunte, vitaminreiche Gemüse-Bowl voller Ballaststoffe und Proteine.',
			instructions:
				'1. Brokkoli und Süßkartoffel auf einem Backblech rösten.\n2. Naturreis kochen.\n3. Bowls mit Reis, Kichererbsen, Brokkoli und Süßkartoffel anrichten.\n4. Mit einem einfachen Tahini-Dressing beträufeln.',
		},
	},
	'Tempeh Maple-Glazed Stir Fry': {
		en: {
			name: 'Tempeh Maple-Glazed Stir Fry',
			description: 'Nutty, sweet, and savory stir-fry featuring nutrient-dense tempeh.',
			instructions:
				'1. Slice tempeh and pan-fry in sesame oil until golden.\n2. Toss in snap peas and bell pepper, stir-fry for 4 minutes.\n3. Stir in soy sauce and maple syrup, cook until glazed.\n4. Sprinkle with sesame seeds and serve.',
		},
		de: {
			name: 'Ahorn-glasierte Tempeh-Pfanne',
			description: 'Nussiges, süß-saures Wokgericht mit nährstoffreichem Tempeh.',
			instructions:
				'1. Tempeh in Scheiben schneiden und in Sesamöl goldbraun anbraten.\n2. Zuckerschoten und Paprika hinzufügen und 4 Minuten pfannenrühren.\n3. Sojasauce und Ahornsirup einrühren, einkochen lassen, bis es glasiert ist.\n4. Mit Sesamsamen bestreuen und servieren.',
		},
	},
	'Mexican Quinoa Salad': {
		en: {
			name: 'Mexican Quinoa Salad',
			description: 'Colorful, protein-packed quinoa salad with lime-cilantro dressing.',
			instructions:
				'1. Rinse and cook quinoa.\n2. Toss cooked quinoa with black beans, sweet corn, and bell pepper.\n3. Mix in chopped cilantro and lime juice.\n4. Serve cold or store for lunches.',
		},
		de: {
			name: 'Mexikanischer Quinoasalat',
			description: 'Bunter, proteinreicher Quinoasalat mit Limetten-Koriander-Dressing.',
			instructions:
				'1. Quinoa abspülen und kochen.\n2. Gekochte Quinoa mit schwarzen Bohnen, Mais und Paprika vermengen.\n3. Gehackten Koriander und Limettensaft unterrühren.\n4. Kalt servieren oder für das Mittagessen lagern.',
		},
	},
	'Peanut Noodle Salad with Tofu': {
		en: {
			name: 'Peanut Noodle Salad with Tofu',
			description: 'Flavorful noodle bowl with crispy tofu and a rich peanut dressing.',
			instructions:
				'1. Cook soba noodles, drain and rinse.\n2. Saute cubed tofu until crispy.\n3. Whisk peanut butter, soy sauce, and warm water to create dressing.\n4. Toss noodles, carrots, cucumber, tofu, and peanut dressing.',
		},
		de: {
			name: 'Erdnuss-Nudelsalat mit Tofu',
			description: 'Würzige Nudelschale mit knusprigem Tofu und cremigem Erdnuss-Dressing.',
			instructions:
				'1. Sobanudeln kochen, abgießen und abschrecken.\n2. Gewürfelten Tofu knusprig anbraten.\n3. Erdnussbutter, Sojasauce und warmes Wasser zu einem Dressing verrühren.\n4. Nudeln, Karotten, Gurke, Tofu und Erdnuss-Dressing vermengen.',
		},
	},
	'Red Lentil Dahl': {
		en: {
			name: 'Red Lentil Dahl',
			description: 'Traditional, comforting, protein-rich dahl served over rice.',
			instructions:
				'1. Heat oil, saute onion, garlic, and ginger.\n2. Add red lentils, canned tomatoes, turmeric, curry powder, and water.\n3. Simmer for 25 minutes until lentils are creamy.\n4. Serve with cooked rice.',
		},
		de: {
			name: 'Rotes Linsen-Dahl',
			description: 'Traditionelles, wärmendes und proteinreiches Dahl serviert mit Jasminreis.',
			instructions:
				'1. Öl erhitzen, Zwiebel, Knoblauch und Ingwer anbraten.\n2. Rote Linsen, Tomatendose, Kurkuma, Currypulver und Wasser hinzufügen.\n3. 25 Minuten köcheln lassen, bis die Linsen cremig sind.\n4. Mit gekochtem Reis servieren.',
		},
	},
	'Tofu Souvlaki Salad Bowl': {
		en: {
			name: 'Tofu Souvlaki Salad Bowl',
			description: 'Mediterranean-inspired tofu bowl with fresh salads.',
			instructions:
				'1. Marinade cubed tofu in lemon juice, oregano, and olive oil.\n2. Pan-sear tofu until crispy.\n3. Combine cucumber, cherry tomatoes, and red onion in bowls.\n4. Drizzle cooked tofu with lemon juice.',
		},
		de: {
			name: 'Tofu-Souvlaki-Salatschale',
			description: 'Mediterran inspirierte Tofu-Schale mit frischen Salaten.',
			instructions:
				'1. Gewürfelten Tofu in Zitronensaft, Oregano und Olivenöl marinieren.\n2. Tofu in der Pfanne knusprig anbraten.\n3. Gurke, Kirschtomaten und rote Zwiebel in Schüsseln anrichten.\n4. Den warmen Tofu hinzufügen und mit Zitronensaft beträufeln.',
		},
	},
	'Butternut Squash Soup': {
		en: {
			name: 'Butternut Squash Soup',
			description: 'Silky, sweet, and highly nutritious butternut squash soup.',
			instructions:
				'1. Saute onion and garlic in a pot.\n2. Add cubed butternut squash and vegetable broth.\n3. Boil until soft, then blend until completely smooth.\n4. Stir in coconut milk and top with pumpkin seeds.',
		},
		de: {
			name: 'Butternusskürbis-Suppe',
			description: 'Samtige, süßliche und nahrhafte Kürbissuppe.',
			instructions:
				'1. Zwiebel und Knoblauch in einem Topf anbraten.\n2. Gewürfelten Butternusskürbis und Gemüsebrühe hinzufügen.\n3. Weich kochen, dann cremig pürieren.\n4. Kokosmilch unterrühren und mit Kürbiskernen bestreuen.',
		},
	},
	'Black Bean Quinoa Burgers': {
		en: {
			name: 'Black Bean Quinoa Burgers',
			description: 'Wholesome plant-based burger patties that hold together well.',
			instructions:
				'1. Mash black beans in a bowl.\n2. Mix in cooked quinoa, oats, cumin, garlic powder, and mix well.\n3. Shape into 4 patties.\n4. Bake at 190°C for 20 minutes (flip halfway), serve on buns.',
		},
		de: {
			name: 'Quinoa-Bohnen-Burger',
			description: 'Gesunde, pflanzliche Burger-Patties, die gut zusammenhalten.',
			instructions:
				'1. Schwarze Bohnen in einer Schüssel zerdrücken.\n2. Gekochte Quinoa, Haferflocken, Kreuzkümmel und Knoblauchpulver unterischen.\n3. Zu 4 Bratlingen formen.\n4. Bei 190°C 20 Minuten backen (nach der Hälfte wenden), auf Brötchen servieren.',
		},
	},
	'Green Edamame Salad': {
		en: {
			name: 'Green Edamame Salad',
			description: 'Crisp, green, high-protein salad featuring edamame.',
			instructions:
				'1. Steam edamame and let cool.\n2. Toss edamame, sliced cucumber, and spinach together in a bowl.\n3. Whisk rice vinegar and sesame seeds, drizzle over salad.\n4. Portion and store.',
		},
		de: {
			name: 'Grüner Edamame-Salat',
			description: 'Knackiger, grüner und proteinreicher Salat mit Edamame.',
			instructions:
				'1. Edamame dämpfen und abkühlen lassen.\n2. Edamame, Gurkenscheiben und Spinat in einer Schüssel vermengen.\n3. Reisessig und Sesamsamen verrühren und über den Salat geben.\n4. Portionieren und lagern.',
		},
	},
	'Vegan Chili Sin Carne': {
		en: {
			name: 'Vegan Chili Sin Carne',
			description: 'A thick, protein-heavy chili containing lentils, kidney beans, and corn.',
			instructions:
				'1. Heat oil in a large pot and saute onion.\n2. Add red lentils, kidney beans, canned tomatoes, corn, and chili flakes.\n3. Simmer for 30 minutes until lentils are cooked.\n4. Serve hot with cooked brown rice.',
		},
		de: {
			name: 'Veganes Chili sin Carne',
			description: 'Ein dickflüssiges, proteinreiches Chili mit roten Linsen, Kidneybohnen und Mais.',
			instructions:
				'1. Öl in einem großen Topf erhitzen und Zwiebel anbraten.\n2. Rote Linsen, Kidneybohnen, Tomatendose, Mais und Chiliflocken hinzufügen.\n3. 30 Minuten köcheln lassen, bis die Linsen gar sind.\n4. Mit gekochtem Naturreis servieren.',
		},
	},
};

const GERMAN_RECIPE_NAMES: Record<string, string> = {
	'Overnight Oats with Chia and Berries': 'Overnight Oats mit Chia und Beeren',
	'Tofu Scramble Breakfast Burrito': 'Frühstücksburrito mit Tofu-Rührei',
	"Classic Lentil Shepherd's Pie": "Klassischer Linsen-Shepherd's-Pie",
	'Mediterranean Chickpea Salad': 'Mediterraner Kichererbsensalat',
	'Spicy Black Bean Chili': 'Scharfes Chili mit schwarzen Bohnen',
	'Coconut Chickpea Curry': 'Kokos-Kichererbsen-Curry',
	'Quinoa Salad with Sweet Potato': 'Quinoasalat mit Süßkartoffel',
	'Creamy Tuscan White Bean Soup': 'Cremige toskanische Bohnensuppe',
	'Stir-Fry Tofu with Broccoli': 'Tofu-Brokkoli-Pfanne',
	'Lentil Bolognese with Pasta': 'Linsenbolognese mit Vollkornnudeln',
	'Roasted Vegetable Buddha Bowl': 'Buddha-Bowl mit Ofengemüse',
	'Tempeh Vegetable Stir-Fry': 'Tempeh-Gemüse-Pfanne',
	'Mexican Quinoa Salad': 'Mexikanischer Quinoasalat',
	'Peanut Noodle Salad with Tofu': 'Erdnuss-Nudelsalat mit Tofu',
	'Red Lentil Dahl': 'Rotes Linsen-Dal',
	'Tofu Souvlaki Salad Bowl': 'Tofu-Souvlaki-Salat-Bowl',
	'Butternut Squash Lentil Soup': 'Butternusskürbis-Linsen-Suppe',
	'Black Bean Quinoa Burgers': 'Quinoa-Burger mit schwarzen Bohnen',
	'Green Edamame Barley Salad': 'Grüner Edamame-Graupen-Salat',
	'Mushroom Barley Stew': 'Pilz-Graupen-Eintopf',
	'Apple Walnut Baked Oats': 'Gebackene Haferflocken mit Apfel und Walnuss',
	'Spinach Mushroom Egg Muffins': 'Eiermuffins mit Spinat und Pilzen',
	'Yogurt Oat Berry Pots': 'Joghurt-Hafer-Beeren-Gläser',
	'Minestrone with Beans and Whole-Wheat Pasta': 'Minestrone mit Bohnen und Vollkornnudeln',
	'Split Pea Root Vegetable Soup': 'Schälerbsensuppe mit Wurzelgemüse',
	'Tomato Lentil Soup with Rye Bread': 'Tomaten-Linsen-Suppe mit Roggenbrot',
	'Chicken Vegetable Barley Soup': 'Hähnchen-Gemüse-Suppe mit Graupen',
	'Ratatouille White Bean Bake': 'Ratatouille-Auflauf mit weißen Bohnen',
	'Cauliflower Chickpea Tray Bake': 'Ofenblumenkohl mit Kichererbsen',
	'Lentil Quinoa Stuffed Peppers': 'Paprika mit Linsen-Quinoa-Füllung',
	'Salmon Broccoli Potato Tray Bake': 'Ofenlachs mit Brokkoli und Kartoffeln',
	'Cod Tomato Olive Bake': 'Ofenkabeljau mit Tomaten und Oliven',
	'Chicken Root Vegetable Tray Bake': 'Ofenhähnchen mit Wurzelgemüse',
	'Turkey Spinach Meatballs with Couscous': 'Puten-Spinat-Bällchen mit Couscous',
	'Spinach Potato Frittata': 'Spinat-Kartoffel-Frittata',
	'Whole-Wheat Pasta Primavera': 'Vollkorn-Pasta Primavera',
	'Spinach Pea Barley Risotto': 'Graupenrisotto mit Spinat und Erbsen',
	'Buckwheat Mushroom Pilaf': 'Buchweizen-Pilaw mit Pilzen',
	'Bulgur Tabbouleh with Lentils': 'Bulgur-Taboulé mit Linsen',
	'Barley Roasted Vegetable Salad': 'Graupensalat mit Ofengemüse',
	'Rainbow Slaw Tofu Rice Bowl': 'Bunte Krautsalat-Tofu-Reis-Bowl',
	'Tuna White Bean Salad': 'Thunfischsalat mit weißen Bohnen',
	'Hummus Roasted Vegetable Wraps': 'Vollkorn-Wraps mit Hummus und Ofengemüse',
	'Baked Falafel Salad Boxes': 'Salatboxen mit Ofenfalafel',
	'Lentil Aubergine Moussaka': 'Linsen-Auberginen-Moussaka',
	'Whole-Wheat Vegetable Lasagne': 'Vollkorn-Gemüselasagne',
	'Cabbage White Bean Skillet': 'Kohlpfanne mit weißen Bohnen',
	'Pumpkin Lentil Millet Curry': 'Kürbis-Linsen-Curry mit Hirse',
	'Sardine Tomato Whole-Wheat Pasta': 'Vollkornnudeln mit Sardinen und Tomaten',
	'Chicken Chickpea Couscous Salad': 'Couscoussalat mit Hähnchen und Kichererbsen',
};

export function translateRecipe<T extends { name: string; description: string; instructions: string }>(locale: Locale, recipe: T): T {
	const match = RECIPE_TRANSLATIONS[recipe.name.trim()];
	const fullTranslationMatchesSource = match?.en.description === recipe.description && match.en.instructions === recipe.instructions;
	if (locale === 'de' && match && fullTranslationMatchesSource) {
		return {
			...recipe,
			name: match.de.name,
			description: match.de.description,
			instructions: match.de.instructions,
		};
	}
	const translatedName = locale === 'de' ? GERMAN_RECIPE_NAMES[recipe.name.trim()] : undefined;
	return translatedName ? { ...recipe, name: translatedName } : recipe;
}

export function translateRecipeName(locale: Locale, name: string): string {
	if (locale === 'de') {
		const translatedName = GERMAN_RECIPE_NAMES[name.trim()];
		if (translatedName) return translatedName;
	}
	const match = RECIPE_TRANSLATIONS[name.trim()];
	return match ? match[locale].name : name;
}
