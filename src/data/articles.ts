export interface ArticleSection {
  heading: string;
  body: string[];
  bullets?: string[];
  callout?: string;
  toolLink?: {
    href: string;
    label: string;
    description: string;
  };
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface Article {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  datePublished: string;
  dateModified: string;
  readingTime: string;
  category: string;
  image: string;
  imageAlt: string;
  keywords: string[];
  summary: string;
  quickWins: string[];
  sections: ArticleSection[];
  faqs: ArticleFaq[];
  primaryTool: {
    href: string;
    label: string;
  };
}

export const articles: Article[] = [
  {
    slug: 'recipe-nutrition-calculator-guide',
    title: 'How to Use a Recipe Nutrition Calculator Without Guessing',
    eyebrow: 'Nutrition Basics',
    description: 'Learn how to calculate recipe calories, macros, and per-serving nutrition with cleaner ingredient entries, serving math, and practical accuracy checks.',
    datePublished: '2026-05-26',
    dateModified: '2026-05-26',
    readingTime: '7 min read',
    category: 'Recipe Nutrition',
    image: '/images/articles/recipe-nutrition-calculator-guide.webp',
    imageAlt: 'Flat lay of recipe ingredients, measuring spoons, and macro notes beside a nutrition calculator interface.',
    keywords: ['recipe nutrition calculator', 'recipe calories', 'macro calculator', 'per serving nutrition', 'nutrition facts for recipes'],
    summary: 'The fastest way to estimate recipe nutrition is to clean up your ingredient list, set servings before you calculate, and sanity-check the biggest calorie sources first.',
    quickWins: [
      'Enter ingredients in plain measurable units: grams, ounces, cups, tablespoons, or whole items.',
      'Set the recipe yield before comparing calories or macros per serving.',
      'Check oils, nuts, dairy, sweeteners, and grains first because small measurement errors change totals quickly.',
    ],
    primaryTool: { href: '/tools/nutrition-calculator', label: 'Open the Recipe Nutrition Calculator' },
    sections: [
      {
        heading: 'Start with a clean ingredient list',
        body: [
          'Nutrition calculators work best when every line contains one ingredient, one quantity, and one unit. Instead of pasting a full instruction like “saute one large onion in a generous drizzle of olive oil,” split it into “1 large onion” and “1 tablespoon olive oil.” That small cleanup step makes the final estimate much more useful.',
          'If a recipe uses vague words like handful, splash, knob, or drizzle, translate them into a practical kitchen estimate. A splash of milk might be one tablespoon, a drizzle of oil might be one or two teaspoons, and a handful of nuts might be about 28 grams. The goal is not laboratory precision; it is consistent recipe planning.'
        ],
        bullets: [
          'Use grams for flour, oats, rice, pasta, nuts, and cheese when possible.',
          'Use tablespoons or teaspoons for oils, sauces, syrups, and nut butters.',
          'Keep brand-specific packaged foods separate if the nutrition label is important.'
        ],
        toolLink: { href: '/tools/unit-converter', label: 'Convert tricky ingredient units', description: 'Use PairDish unit conversion when a recipe mixes cups, grams, ounces, and tablespoons.' }
      },
      {
        heading: 'Set servings before judging the result',
        body: [
          'Most recipe nutrition mistakes happen after the total is calculated. A pot of soup may look high in calories until it is divided into eight bowls. A loaf cake may look moderate until it is cut into ten slices instead of sixteen. Decide the realistic number of portions first, then compare per-serving nutrition.',
          'For meal prep, use the container count as the serving count. If a casserole fills six containers, the serving count is six. If you plan to eat half portions with a salad or side, create a note rather than forcing the calculator to guess.'
        ],
        callout: 'Serving math is the bridge between recipe data and real meal planning. Always calculate both total recipe nutrition and per-serving nutrition before changing ingredients.',
        toolLink: { href: '/tools/recipe-scaler', label: 'Scale the recipe before calculating', description: 'Resize recipes first so your nutrition estimate matches the batch you actually cook.' }
      },
      {
        heading: 'Find the ingredients that move the numbers most',
        body: [
          'When the result looks surprising, audit the high-impact ingredients first. Oil, butter, cheese, cream, nuts, seeds, flour, pasta, rice, sugar, and dried fruit can change a recipe by hundreds of calories if the measurement is off. Vegetables, herbs, broth, vinegar, and spices usually have a smaller impact.',
          'This is especially helpful when you are trying to adjust a recipe. Reducing one tablespoon of oil can matter more than removing an entire cup of spinach. Adding a cup of beans may increase calories but also improves fiber and protein. Look at the whole macro picture rather than calories alone.'
        ],
        bullets: [
          'Want fewer calories? Check oil, butter, cheese, nuts, and sugar first.',
          'Want more protein? Add beans, lentils, Greek yogurt, tofu, eggs, fish, poultry, or lean meat where appropriate.',
          'Want more fiber? Add legumes, vegetables, whole grains, berries, or seeds.'
        ]
      },
      {
        heading: 'Use the result as an estimate, not medical advice',
        body: [
          'A recipe calculator is a planning tool. Ingredient databases, brand differences, cooking loss, drained liquids, and serving sizes all affect the final numbers. For general home cooking, a thoughtful estimate is usually enough to plan meals, compare recipes, and build grocery lists.',
          'If you are managing a medical condition, allergy, eating disorder recovery, pregnancy nutrition, kidney disease, diabetes, or another specialized diet, use these numbers as a starting point and verify decisions with a qualified professional.'
        ]
      }
    ],
    faqs: [
      { question: 'Can I paste an entire recipe into a nutrition calculator?', answer: 'Yes, but the result is cleaner if each ingredient is on its own line with a clear quantity and unit.' },
      { question: 'Should I calculate raw or cooked ingredient weights?', answer: 'Use the measurement style from the recipe. If you weigh cooked portions after cooking, keep that method consistent across the whole recipe.' },
      { question: 'Why do recipe calorie estimates vary between tools?', answer: 'Different tools use different ingredient databases and assumptions for brands, preparation methods, and serving sizes.' }
    ]
  },
  {
    slug: 'meal-planning-with-macros',
    title: 'Meal Planning With Macros: A Simple Weekly System',
    eyebrow: 'Macro Planning',
    description: 'Build a weekly meal plan around protein, carbs, fat, and calories without turning every dinner into spreadsheet work.',
    datePublished: '2026-05-26',
    dateModified: '2026-05-26',
    readingTime: '8 min read',
    category: 'Meal Planning',
    image: '/images/articles/meal-planning-with-macros.webp',
    imageAlt: 'Weekly meal planning board with macro charts, ingredient bowls, and measuring tools.',
    keywords: ['meal planning macros', 'weekly macro meal plan', 'macro meal planner', 'meal prep macros', 'balanced macro meals'],
    summary: 'Macro meal planning is easiest when you pick a protein anchor, add a reliable carbohydrate, choose a fat source intentionally, and repeat flexible meal templates.',
    quickWins: [
      'Plan meals around one protein anchor instead of starting with random recipes.',
      'Use repeatable breakfast, lunch, dinner, and snack templates.',
      'Balance the week rather than forcing every single meal to hit perfect numbers.'
    ],
    primaryTool: { href: '/tools/macro-calculator', label: 'Open the Macro Calculator' },
    sections: [
      {
        heading: 'Think in templates before recipes',
        body: [
          'Macro planning gets overwhelming when every meal is a brand-new recipe. A simpler approach is to build templates: protein bowl, sheet-pan dinner, soup plus bread, yogurt bowl, egg plate, salad with grains, or pasta with a protein add-in. Once the template works, you can change flavors without changing the structure.',
          'For example, a protein bowl can become Mediterranean, taco-style, teriyaki, curry, or barbecue by changing sauce and vegetables. The macro structure stays predictable: protein, grain or starch, vegetables, and a measured fat or sauce.'
        ],
        bullets: [
          'Breakfast template: protein + fruit or grain + optional fat.',
          'Lunch template: leftovers, bowl, soup, or salad with a measured carb.',
          'Dinner template: protein + vegetable + starch + sauce.'
        ],
        toolLink: { href: '/tools/meal-prep', label: 'Build a meal-prep schedule', description: 'Plan containers, batch sizes, and prep timing before you shop.' }
      },
      {
        heading: 'Choose the protein anchor first',
        body: [
          'Protein is usually the macro people struggle to hit consistently. Pick the protein anchor first, then build the rest of the meal around it. Beans, lentils, tofu, eggs, Greek yogurt, cottage cheese, fish, poultry, lean beef, and protein-rich grains can all work depending on the recipe style.',
          'A protein anchor also makes shopping easier. Instead of buying random ingredients, decide which two or three proteins will carry the week. Then reuse them in different formats: bowls, wraps, pasta, soup, salads, and snack plates.'
        ],
        callout: 'If the meal already has a strong protein anchor, you can make smaller adjustments with carbs and fats instead of rebuilding the whole recipe.'
      },
      {
        heading: 'Use carbs and fats as levers',
        body: [
          'Carbs and fats are not problems to avoid. They are levers to adjust energy, satiety, texture, and flavor. If a day is too low in calories, add rice, potatoes, oats, bread, fruit, olive oil, avocado, nuts, or sauce. If a meal is too energy-dense, reduce the highest-impact fat or starch and add vegetables or broth-based volume.',
          'The best weekly plans usually include a mix: quick carbs for busy days, high-fiber carbs for fullness, and intentional fats for flavor. Planning this on purpose makes the final meals feel satisfying instead of restrictive.'
        ],
        toolLink: { href: '/tools/nutrition-calculator', label: 'Check recipe nutrition', description: 'Calculate calories and macros for a recipe before adding it to the weekly plan.' }
      },
      {
        heading: 'Plan a range, not perfection',
        body: [
          'You do not need every meal to land on exact numbers. Weekly consistency matters more than one perfect lunch. A practical approach is to create a target range for meals and snacks, then repeat combinations that land close enough.',
          'If one meal is higher in fat, choose a leaner dinner. If breakfast is low in protein, make lunch protein-forward. Macro planning should reduce decision fatigue, not create a new source of stress.'
        ]
      }
    ],
    faqs: [
      { question: 'Do I need to hit exact macros every day?', answer: 'Most home cooks do better with target ranges. Exact numbers are usually unnecessary unless you have a specific coached plan.' },
      { question: 'What is the easiest macro to plan first?', answer: 'Protein is usually the best starting point because it shapes the meal and helps with fullness.' },
      { question: 'Can macro planning work for family dinners?', answer: 'Yes. Keep the shared meal flexible, then adjust portions or sides for individual goals.' }
    ]
  },
  {
    slug: 'pantry-meal-planning',
    title: 'Pantry Meal Planning: Turn Shelf Staples Into Real Dinners',
    eyebrow: 'Pantry Strategy',
    description: 'Use a pantry-first meal planning system to turn rice, beans, pasta, canned goods, spices, and freezer items into practical weekly meals.',
    datePublished: '2026-05-26',
    dateModified: '2026-05-26',
    readingTime: '7 min read',
    category: 'Pantry Planning',
    image: '/images/articles/pantry-meal-planning.webp',
    imageAlt: 'Organized pantry jars, canned goods, spices, and a meal planning checklist.',
    keywords: ['pantry meal planning', 'pantry meals', 'pantry staples', 'meal plan from pantry', 'pantry dinner ideas'],
    summary: 'A pantry meal plan starts by grouping staples into meal formulas: grain bowls, pasta dinners, soups, skillet meals, and snack plates.',
    quickWins: [
      'Inventory starches, proteins, sauces, and vegetables separately.',
      'Build meals from formulas instead of searching for exact recipes.',
      'Shop only for fresh items that complete two or more pantry meals.'
    ],
    primaryTool: { href: '/tools/pantry-helper', label: 'Open the Pantry Helper' },
    sections: [
      {
        heading: 'Sort pantry staples by job',
        body: [
          'A shelf full of ingredients does not automatically become dinner. Sort pantry items by the job they can do in a meal: base, protein, sauce, texture, or flavor. Rice, pasta, tortillas, oats, potatoes, and noodles are bases. Beans, lentils, tuna, eggs, tofu, and protein pasta can be anchors. Canned tomatoes, coconut milk, broth, salsa, pesto, and curry paste become sauces.',
          'Once you see the jobs, combinations appear quickly. Rice plus black beans plus salsa becomes bowls. Pasta plus canned tomatoes plus lentils becomes a hearty sauce. Oats plus yogurt plus fruit becomes breakfast. This method prevents the common problem of buying more groceries while ignoring what is already available.'
        ],
        bullets: [
          'Bases: rice, pasta, potatoes, noodles, oats, tortillas, grains.',
          'Protein anchors: beans, lentils, eggs, fish, tofu, yogurt, protein pasta.',
          'Flavor builders: spices, vinegar, sauces, broth, canned tomatoes, coconut milk.'
        ]
      },
      {
        heading: 'Use five pantry meal formulas',
        body: [
          'Instead of memorizing hundreds of recipes, keep five formulas ready: bowl, soup, pasta, skillet, and toast or wrap. Each formula can absorb different leftovers and pantry items. This makes pantry cooking useful on busy nights when you do not want to follow a complicated recipe.',
          'A bowl needs a base, protein, vegetable, sauce, and topping. Soup needs broth, protein, vegetables, starch, and acid. Pasta needs noodles, sauce, protein or vegetables, and a finishing flavor. A skillet meal combines a starch, protein, sauce, and vegetables in one pan.'
        ],
        toolLink: { href: '/tools/leftover-matcher', label: 'Match leftovers into new meals', description: 'Turn small amounts of cooked ingredients into a new pantry-based dinner.' }
      },
      {
        heading: 'Create a “buy to complete” list',
        body: [
          'The best pantry grocery list is short. You are not shopping for full recipes; you are buying missing pieces that unlock several meals. Fresh greens, lemons, yogurt, eggs, frozen vegetables, herbs, tortillas, or one protein can complete multiple pantry formulas.',
          'Before shopping, choose three pantry meals and write only what each one is missing. If an item completes more than one meal, it moves to the top of the list. This lowers waste and keeps the plan flexible.'
        ],
        callout: 'Pantry meal planning works best when fresh groceries are treated as connectors, not the whole plan.',
        toolLink: { href: '/tools/grocery-list', label: 'Generate a smarter grocery list', description: 'Group fresh add-ons by section so the shopping trip stays focused.' }
      },
      {
        heading: 'Keep nutrition balanced without overthinking',
        body: [
          'Pantry meals can be balanced when you intentionally include protein, fiber, and flavor. Add beans or lentils to pasta sauce, use Greek yogurt in sauces, choose whole grains when they fit, and keep frozen vegetables ready. If a pantry meal is mostly starch, add a protein anchor. If it is heavy, add acid, herbs, and vegetables.',
          'You can also run a favorite pantry recipe through a nutrition calculator to see where it needs support. Sometimes the fix is simple: add a cup of lentils, reduce oil, or divide the recipe into a more realistic number of servings.'
        ],
        toolLink: { href: '/tools/nutrition-calculator', label: 'Estimate pantry meal nutrition', description: 'Check calories and macros for pantry dinners before adding them to the rotation.' }
      }
    ],
    faqs: [
      { question: 'What pantry staples should every meal planner keep?', answer: 'Start with a few bases, a few protein anchors, sauces, spices, broth, canned tomatoes, and frozen vegetables.' },
      { question: 'How do I avoid boring pantry meals?', answer: 'Change the sauce, acid, herbs, and crunchy toppings while keeping the same basic formula.' },
      { question: 'Can pantry meals be high protein?', answer: 'Yes. Beans, lentils, eggs, tofu, canned fish, Greek yogurt, and protein pasta can all raise protein.' }
    ]
  },
  {
    slug: 'grocery-budget-meal-planning',
    title: 'Grocery Budget Meal Planning: Build a Week Around Your Real Number',
    eyebrow: 'Budget Planning',
    description: 'Create a practical grocery budget meal plan using price anchors, pantry staples, flexible recipes, and a focused shopping list.',
    datePublished: '2026-05-26',
    dateModified: '2026-05-26',
    readingTime: '8 min read',
    category: 'Grocery Budget',
    image: '/images/articles/grocery-budget-meal-planning.webp',
    imageAlt: 'Grocery budget flat lay with calculator, receipt, produce bags, and affordable pantry ingredients.',
    keywords: ['grocery budget meal plan', 'budget meal planning', 'cheap meal plan', 'grocery list on a budget', 'affordable meal prep'],
    summary: 'A good budget meal plan starts with a weekly spending number, then uses price anchors like grains, legumes, eggs, frozen vegetables, and repeatable meals.',
    quickWins: [
      'Set the weekly grocery number before choosing recipes.',
      'Use two or three low-cost base ingredients across multiple meals.',
      'Plan one flexible “use-it-up” dinner to prevent waste.'
    ],
    primaryTool: { href: '/tools/grocery-list', label: 'Open the Grocery List Generator' },
    sections: [
      {
        heading: 'Start with the budget, not the recipes',
        body: [
          'Most grocery plans fail because recipes are chosen first and the total is discovered at checkout. Reverse the process. Write your target grocery number for the week, subtract any fixed household items, then plan meals with the remaining food budget.',
          'This does not mean eating the same thing every day. It means choosing recipes that share ingredients. A bag of rice can support bowls, fried rice, soup, and burritos. A carton of eggs can become breakfast, salad topping, quick dinner, or baking ingredient. Repetition at the ingredient level creates variety at the meal level.'
        ],
        bullets: [
          'Budget first: choose the weekly food number before browsing recipes.',
          'Ingredient overlap: use the same ingredient in at least two meals.',
          'Waste check: plan where leftovers go before buying more.'
        ]
      },
      {
        heading: 'Pick price anchors for the week',
        body: [
          'Price anchors are ingredients that reliably stretch meals without taking over the whole plate. Rice, oats, potatoes, pasta, beans, lentils, cabbage, carrots, frozen vegetables, eggs, and seasonal produce are common examples. The best anchors depend on your store prices and cooking style.',
          'Choose two or three anchors each week. Then build meals around them with different flavors. Rice can become a bean bowl, curry, soup, or skillet. Potatoes can become breakfast hash, sheet-pan dinner, soup, or loaded wedges. Beans can become tacos, salad, pasta sauce, or dip.'
        ],
        toolLink: { href: '/tools/meal-prep', label: 'Plan batch sizes', description: 'Use batch planning to turn budget anchors into lunches and dinners without overcooking.' }
      },
      {
        heading: 'Use one grocery list for multiple meals',
        body: [
          'A budget grocery list should be organized by overlap. If you buy cilantro, use it for tacos, bowls, and soup topping. If you buy Greek yogurt, use it for breakfast, sauce, and a creamy dressing. If you buy cabbage, use it for slaw, stir-fry, soup, and bowls.',
          'This is where budget planning becomes easier than strict coupon planning. You are not chasing every sale; you are making sure every item has a job. A smaller list with high-utility ingredients often beats a bigger list full of one-off items.'
        ],
        callout: 'Before an item goes on the list, ask: “Which two meals will use this?” If the answer is only one, consider a substitute you already have.'
      },
      {
        heading: 'Protect one flexible night',
        body: [
          'Budget plans need flexibility. Leave one dinner slot for leftovers, pantry meals, or a simple template like eggs and toast, rice bowls, soup, pasta, or loaded potatoes. This prevents the plan from breaking when schedules change.',
          'The flexible night is also where savings show up. You use open produce, half a can of beans, remaining cooked grains, or a sauce that would otherwise expire. Over a month, that one habit can reduce both food waste and extra grocery trips.'
        ],
        toolLink: { href: '/tools/pantry-helper', label: 'Find a pantry backup dinner', description: 'Use pantry staples to cover the flexible night without another shopping trip.' }
      }
    ],
    faqs: [
      { question: 'What is the cheapest meal planning method?', answer: 'Plan from your budget and pantry first, then buy only fresh ingredients that complete multiple meals.' },
      { question: 'How many recipes should I plan for a week?', answer: 'For many households, three dinners plus leftovers, one flexible night, and repeatable breakfasts/lunches is more realistic than seven unique dinners.' },
      { question: 'How can I keep budget meals from feeling repetitive?', answer: 'Repeat ingredients but change sauces, spices, textures, and formats.' }
    ]
  },
  {
    slug: 'high-protein-meal-prep',
    title: 'High-Protein Meal Prep Ideas That Still Feel Flexible',
    eyebrow: 'Protein Prep',
    description: 'Plan high-protein meal prep with flexible components, balanced macros, and repeatable formulas that do not require eating the same container all week.',
    datePublished: '2026-05-26',
    dateModified: '2026-05-26',
    readingTime: '7 min read',
    category: 'Meal Prep',
    image: '/images/articles/high-protein-meal-prep.webp',
    imageAlt: 'Neatly arranged meal prep containers with grains, roasted vegetables, protein foods, and macro cards.',
    keywords: ['high protein meal prep', 'protein meal prep ideas', 'meal prep protein', 'high protein lunches', 'macro meal prep'],
    summary: 'The most flexible high-protein meal prep uses components: a protein anchor, a base, vegetables, sauce, and a finishing texture you can mix through the week.',
    quickWins: [
      'Prep protein anchors separately from sauces so meals can change flavor.',
      'Cook one base and two vegetables to create several combinations.',
      'Add protein to snacks and breakfasts, not only lunch and dinner.'
    ],
    primaryTool: { href: '/tools/protein-calculator', label: 'Open the Protein Calculator' },
    sections: [
      {
        heading: 'Build components instead of identical boxes',
        body: [
          'Classic meal prep often fails because five identical containers become boring by Wednesday. Component prep is more flexible. Cook a protein anchor, a grain or starch, vegetables, and one or two sauces separately. Then assemble different meals during the week.',
          'For example, the same chickpeas, rice, roasted vegetables, and yogurt sauce can become a bowl, wrap, salad topper, or warm skillet. The same cooked eggs, potatoes, greens, and salsa can become breakfast, lunch, or dinner. Keeping components separate protects texture and variety.'
        ],
        bullets: [
          'Protein anchor: beans, lentils, tofu, eggs, yogurt, fish, poultry, lean meat, or tempeh.',
          'Base: rice, potatoes, quinoa, pasta, oats, tortillas, or bread.',
          'Flavor: salsa, yogurt sauce, vinaigrette, tahini, curry sauce, pesto, or herbs.'
        ],
        toolLink: { href: '/tools/meal-prep', label: 'Plan meal prep containers', description: 'Estimate batch sizes, portions, and prep timing before you start cooking.' }
      },
      {
        heading: 'Spread protein across the day',
        body: [
          'A high-protein plan is easier when protein appears in breakfast and snacks, not only dinner. Greek yogurt, cottage cheese, eggs, tofu scramble, overnight oats with protein-rich add-ins, bean dips, edamame, tuna, or lentil soup can help spread intake across the day.',
          'This also makes meals feel less extreme. If breakfast and snacks carry some protein, lunch and dinner do not need to do all the work. That makes the meal plan easier to follow and easier to cook for mixed households.'
        ],
        toolLink: { href: '/tools/macro-calculator', label: 'Balance protein with carbs and fat', description: 'Use macro planning to keep high-protein meals satisfying instead of dry or restrictive.' }
      },
      {
        heading: 'Use sauces to change the week',
        body: [
          'Sauces are the easiest way to make repeated ingredients taste different. A yogurt herb sauce, salsa, peanut-style sauce, vinaigrette, pesto, tahini lemon sauce, or curry sauce can completely change a bowl. Keep sauces separate until serving so the prep stays fresh.',
          'If you are tracking nutrition, measure calorie-dense sauces once, then portion them consistently. This keeps flavor high without guessing how much oil, nut butter, or cheese ended up in each serving.'
        ],
        callout: 'High-protein does not have to mean plain. Flavorful sauces make simple protein anchors easier to repeat.'
      },
      {
        heading: 'Check the recipe once, then repeat confidently',
        body: [
          'Once you have a meal prep combination you like, calculate it once and save the notes. Record the batch size, number of servings, protein per serving, and the sauce portion. The next time you cook it, you can adjust from a known baseline instead of starting over.',
          'This is especially helpful for repeat lunches. A saved high-protein bowl, soup, or wrap formula becomes a reliable building block for future weeks.'
        ],
        toolLink: { href: '/tools/nutrition-calculator', label: 'Calculate your prep recipe', description: 'Estimate per-serving calories and macros for a full meal prep batch.' }
      }
    ],
    faqs: [
      { question: 'What are easy high-protein meal prep foods?', answer: 'Beans, lentils, tofu, eggs, Greek yogurt, cottage cheese, edamame, fish, poultry, lean meat, tempeh, and protein-rich grains can all work.' },
      { question: 'How do I meal prep without getting bored?', answer: 'Prep components separately and change sauces, wraps, bowls, salads, and sides through the week.' },
      { question: 'Should every meal be high protein?', answer: 'Not necessarily. Many people do better by spreading protein across the day and balancing the week overall.' }
    ]
  }
];

export function getArticle(slug: string): Article {
  const article = articles.find((item) => item.slug === slug);
  if (!article) {
    throw new Error(`Unknown article slug: ${slug}`);
  }
  return article;
}
