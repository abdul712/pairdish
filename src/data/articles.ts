export interface ArticleTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface ArticleSection {
  heading: string;
  body: string[];
  bullets?: string[];
  callout?: string;
  table?: ArticleTable;
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

export interface ArticleSource {
  label: string;
  href: string;
  note?: string;
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
  photoCredit?: string;
  keywords: string[];
  summary: string;
  quickWins: string[];
  sections: ArticleSection[];
  faqs?: ArticleFaq[];
  sources?: ArticleSource[];
  primaryTool: {
    href: string;
    label: string;
  };
  relatedGuides?: {
    slug: string;
    label: string;
    teaser: string;
  }[];
}

const coreArticles: Article[] = [
  {
    slug: 'recipe-nutrition-calculator-guide',
    title: 'How to Use a Recipe Nutrition Calculator Without Guessing',
    eyebrow: 'Nutrition Basics',
    description: 'Learn how to calculate recipe calories, macros, and per-serving nutrition with cleaner ingredient entries, serving math, and practical accuracy checks.',
    datePublished: '2026-05-26',
    dateModified: '2026-09-23',
    readingTime: '11 min read',
    category: 'Recipe Nutrition',
    image: '/images/articles/recipe-nutrition-calculator-guide.webp',
    imageAlt: 'Flat lay of recipe ingredients, measuring spoons, and macro notes beside a nutrition calculator interface.',
    keywords: ['recipe nutrition calculator', 'recipe calories', 'macro calculator', 'per serving nutrition', 'nutrition facts for recipes', 'how to calculate calories in a recipe'],
    summary: 'The fastest way to estimate recipe nutrition is to clean up your ingredient list, set servings before you calculate, and sanity-check the biggest calorie sources first.',
    quickWins: [
      'Enter ingredients in plain measurable units: grams, ounces, cups, tablespoons, or whole items.',
      'Set the recipe yield before comparing calories or macros per serving.',
      'Check oils, nuts, dairy, sweeteners, and grains first because small measurement errors change totals quickly.',
      'Match the entry to the ingredient: raw weight with raw entries, cooked weight with cooked entries.',
    ],
    primaryTool: { href: '/tools/nutrition-calculator', label: 'Open the Recipe Nutrition Calculator' },
    relatedGuides: [
      { slug: 'what-to-serve-with-fried-fish', label: 'What to Serve with Fried Fish', teaser: 'Portion and calorie math for a fish dinner.' },
      { slug: 'what-to-serve-with-pesto-chicken', label: 'What to Serve with Pesto Chicken', teaser: 'Run a one-pan chicken dinner through the calculator.' }
    ],
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
        heading: 'What the Nutrition Facts label actually measures',
        body: [
          'A recipe calculator is doing the same job as a Nutrition Facts panel: describing a defined serving of a defined food. The FDA is explicit that a label serving size “reflects the amount that people typically eat or drink” and that it “is not a recommendation of how much you should eat or drink.” That one sentence explains most serving-size arguments.',
          'It also explains why every number moves together. On the FDA sample label for frozen lasagna, one cup is 280 calories; eat two cups and you have taken in 560 calories, and every other nutrient and percentage doubles with it. A recipe calculator behaves the same way — change the yield and every per-serving figure changes — which is why setting servings first is part of the measurement, not bookkeeping.',
          'Labels also standardize the unit: a familiar household measure first, the metric weight second. That is the format worth copying into your own recipes. “One scoop” does not travel between tools; “45 g” does.'
        ],
        table: {
          caption: 'Daily Values behind %DV on a 2,000-calorie diet (FDA)',
          headers: ['Nutrient', 'Daily Value', 'Goal'],
          rows: [
            ['Saturated fat', '20 g', 'Less than'],
            ['Sodium', '2,300 mg', 'Less than'],
            ['Added sugars', '50 g', 'Less than'],
            ['Dietary fiber', '28 g', 'At least'],
            ['Vitamin D', '20 mcg', 'At least'],
            ['Calcium', '1,300 mg', 'At least'],
            ['Iron', '18 mg', 'At least'],
            ['Potassium', '4,700 mg', 'At least']
          ]
        },
        bullets: [
          'The %DV column does not add up to 100% down the side of a label; each line is that nutrient’s share of its own daily value.',
          'Protein, total sugars, and trans fat normally carry no %DV — a protein %DV appears only when the label makes a protein claim.',
          'FDA’s reading rule: 5% DV or less of a nutrient per serving is low, 20% DV or more is high.'
        ],
        callout: 'The fastest sanity check on any recipe estimate is to ask what share of a day’s sodium, added sugar, or protein one serving carries. That question catches more errors than recalculating every ingredient.',
        toolLink: { href: '/tools/dietary-finder', label: 'Match a recipe to a dietary pattern', description: 'Filter meal ideas when sodium, added sugar, or protein targets are the deciding factor.' }
      },
      {
        heading: 'Added sugars versus total sugars: the label line that fools recipe math',
        body: [
          'Total sugars counts everything: sugars naturally present in milk, fruit, and vegetables plus anything added during processing or cooking. Added sugars counts only the sweeteners — sucrose, dextrose, syrups, honey, and concentrated fruit or vegetable juices. On the FDA example, a yogurt label reading “Total Sugars 15 g, Includes 7 g Added Sugars” means 7 g were added and 8 g occur naturally in the yogurt itself.',
          'For recipe math that distinction matters. A fruit-sweetened smoothie, a yogurt marinade, and a honey-glazed sheet pan can land on the same total sugar number with very different added sugar totals. If added sugar is what you are watching, enter the sweetener as its own line — honey, maple syrup, brown sugar — rather than relying on a combined ingredient entry that hides it.',
          'Percentages make the point faster than grams. Added sugars use 50 g per day as their 100% Daily Value, so a recipe contributing 12 g of added sugar per serving is already at 24% DV. By FDA’s own reading rule, that is a high-sugar serving.'
        ],
        bullets: [
          'Enter sweeteners separately: they are the only added-sugar source most home recipes contain.',
          'Natural sugars from milk, fruit, and vegetables still count toward total sugars, so a smoothie can read high while carrying no added sugar at all.',
          'When a packaged ingredient is doing heavy lifting in a recipe, use its label numbers rather than a generic database entry.'
        ]
      },
      {
        heading: 'The raw-versus-cooked check that fixes most calculator errors',
        body: [
          'Ingredient databases carry separate entries for raw, cooked, drained, and ready-to-eat versions of the same food, and the gaps are large. USDA FoodData Central lists 22.5 g of protein per 100 g for raw boneless skinless chicken breast and 32.1 g per 100 g for the same cut cooked and braised. Nothing was added; water cooked off, so every gram of the cooked food now carries more protein.',
          'That means the entry you pick has to match the food in front of you. A 200 g portion of cooked chicken read against a raw entry comes out near 45 g of protein; read against a cooked entry it is about 64 g. Choosing the wrong state moves the number by 30 to 40 percent without a single ingredient being wrong.',
          'The same logic covers cans and packages. Drained solids, solids and liquids, and rinsed items are different entries, and as-purchased weights include parts you do not eat. Select the entry that describes what actually lands on the plate.'
        ],
        table: {
          caption: 'USDA FoodData Central: protein per 100 g by entry state',
          headers: ['Food and entry state', 'Protein per 100 g'],
          rows: [
            ['Chicken breast, boneless, skinless — raw', '22.5 g'],
            ['Chicken breast, meat only — cooked, braised', '32.1 g'],
            ['Fish, tuna, light, canned in water — drained solids', '25.5 g'],
            ['Egg, whole — cooked, hard-boiled', '12.6 g'],
            ['Lentils, mature seeds — cooked, boiled', '9.02 g'],
            ['Yogurt, Greek, plain, lowfat — ready to eat', '9.95 g']
          ]
        },
        bullets: [
          'Type the weight in the same state as the entry: raw weight with raw entries, cooked weight with cooked entries.',
          'Batch cooking? Note the raw weight before the pan, because that is the number the database understands.',
          'When a recipe and a package label disagree, the label wins for that packaged product; the database entry wins for loose ingredients.'
        ],
        callout: 'Before trusting a total, write the raw weight next to what came off the pan. If the two are far apart, check that the entry matches the weight you typed.',
        toolLink: { href: '/tools/unit-converter', label: 'Convert weights and volumes first', description: 'Get grams, ounces, cups, and tablespoons onto one scale before comparing entries.' }
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
    ],
    sources: [
      {
        label: 'FDA — How to Understand and Use the Nutrition Facts Label',
        href: 'https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label',
        note: 'Source of the serving-size definition, the 5%/20% %DV reading guide, the Daily Value table, and the added-sugars example cited above.'
      },
      {
        label: 'USDA FoodData Central',
        href: 'https://fdc.nal.usda.gov/',
        note: 'Source of the protein values in the entry-state table (chicken breast raw FDC 2646170, cooked FDC 331960, and the other food-detail pages for each row).'
      },
      {
        label: 'USDA National Agricultural Library — DRI Calculator',
        href: 'https://www.nal.usda.gov/human-nutrition-and-food-safety/dri-calculator',
        note: 'Estimates daily calorie and nutrient needs from the Dietary Reference Intakes.'
      }
    ]
  },
  {
    slug: 'meal-planning-with-macros',
    title: 'Meal Planning With Macros: A Simple Weekly System',
    eyebrow: 'Macro Planning',
    description: 'Build a weekly meal plan around protein, carbs, fat, and calories without turning every dinner into spreadsheet work.',
    datePublished: '2026-05-26',
    dateModified: '2026-09-21',
    readingTime: '11 min read',
    category: 'Meal Planning',
    image: '/images/articles/meal-planning-with-macros.webp',
    imageAlt: 'Weekly meal planning board with macro charts, ingredient bowls, and measuring tools.',
    keywords: ['meal planning macros', 'weekly macro meal plan', 'macro meal planner', 'meal prep macros', 'balanced macro meals'],
    summary: 'Macro meal planning is easiest when you pick a protein anchor, add a reliable carbohydrate, choose a fat source intentionally, and repeat flexible meal templates.',
    quickWins: [
      'Plan meals around one protein anchor instead of starting with random recipes.',
      'Use repeatable breakfast, lunch, dinner, and snack templates.',
      'Balance the week rather than forcing every single meal to hit perfect numbers.',
      'Set the protein target from the current guidelines - 1.2 to 1.6 grams per kilogram of body weight per day.'
    ],
    primaryTool: { href: '/tools/macro-calculator', label: 'Open the Macro Calculator' },
    relatedGuides: [
      { slug: 'what-to-serve-with-pesto-chicken', label: 'What to Serve with Pesto Chicken', teaser: 'Protein anchor, starch, and greens in one pan.' },
      { slug: 'what-to-serve-with-roasted-potatoes', label: 'What to Serve with Roasted Potatoes', teaser: 'Starchy sides that slot into a macro template.' }
    ],
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
        heading: 'What the current U.S. guidelines actually say',
        body: [
          'Macro planning gets easier when the targets come from an official source instead of a viral template. The Dietary Guidelines for Americans, 2025-2030 - the joint HHS and USDA edition published in January 2026 - replaced the old "percentage of calories" framing with concrete daily serving and protein goals.',
          'The headline change for anyone building a macro plan is protein. The current edition sets a protein serving goal of 1.2 to 1.6 grams per kilogram of body weight per day and asks people to prioritize protein foods at every meal. That is a planning range, not a scoreboard: land inside it across the day and the rest of the plate gets much easier to arrange.'
        ],
        table: {
          caption: 'Dietary Guidelines for Americans, 2025-2030: the daily goals that shape a macro plan',
          headers: ['Guideline', 'Daily goal', 'How it lands in a plan'],
          rows: [
            ['Protein', '1.2-1.6 g per kg body weight', 'Anchors every meal; the first number to set'],
            ['Dairy', '3 servings (2,000-calorie pattern)', 'Breakfast and snacks, plus sauces'],
            ['Vegetables', '3 servings', 'Lunch and dinner volume, not an afterthought'],
            ['Fruits', '2 servings', 'Carb source with fiber built in'],
            ['Whole grains', '2-4 servings', 'Main carb lever; favor fiber-rich versions'],
            ['Saturated fat', 'Under 10% of daily calories', 'Caps butter, cheese, and fatty meat portions'],
            ['Added sugars', 'No more than 10 g in any one meal', 'Dessert and sweet drinks become occasional'],
            ['Sodium', 'Under 2,300 mg (ages 14 and up)', 'Favors home cooking over packaged food']
          ]
        },
        callout: 'Notice the shape of it: protein and produce have minimums, fats and sugars have ceilings, and grains sit in a range. A macro plan is mostly the work of hitting the minimums and staying under the ceilings.'
      },
      {
        heading: 'Turn the protein goal into grams per day',
        body: [
          'Protein is the one macro the current guidelines express in grams per kilogram of body weight, so it needs a single conversion step before it becomes a shopping list. Divide your weight in pounds by 2.205 to get kilograms, then multiply by 1.2 for the floor and 1.6 for the ceiling.',
          'Here is that arithmetic worked out for four common body weights, with the share each one implies if you eat three times a day:'
        ],
        table: {
          caption: 'Protein targets from the 1.2-1.6 g/kg/day guideline range',
          headers: ['Body weight', 'Kilograms', '1.2 g/kg per day', '1.6 g/kg per day', 'Per meal (3 meals)'],
          rows: [
            ['130 lb', '59.0 kg', '71 g', '94 g', '24-31 g'],
            ['150 lb', '68.0 kg', '82 g', '109 g', '27-36 g'],
            ['175 lb', '79.4 kg', '95 g', '127 g', '32-42 g'],
            ['200 lb', '90.7 kg', '109 g', '145 g', '36-48 g']
          ]
        },
        bullets: [
          'Round to the nearest 5 grams - no dinner plan needs a decimal.',
          'Use the lower end on rest days and the upper end on training or physically heavy days.',
          'Eating four smaller meals? Divide the daily number by four instead of three.'
        ],
        callout: 'A 175-pound cook lands between roughly 95 and 127 grams of protein a day, or 32 to 42 grams per meal. That is a real constraint on the plate, which is exactly why the protein anchor gets chosen first.',
        toolLink: { href: '/tools/protein-calculator', label: 'Get your own daily protein number', description: 'Enter weight and goal to see a daily protein target and how it splits across meals.' }
      },
      {
        heading: 'Hit the number without weighing every meal',
        body: [
          'Daily grams are a planning target, not a grade. The reliable shortcut is to build each meal around one protein anchor that is easy to judge by eye, then fill in the rest of the plate from the serving minimums.',
          'Anchors that fit a macro template: eggs at breakfast, Greek yogurt or cottage cheese for snacks, beans, lentils, or tofu in plant-forward meals, and poultry, fish, lean meat, or seafood at dinner. The guidelines also count frozen, dried, or canned produce as legitimate options, which matters when fresh prices move - and it keeps a plan from collapsing on a busy Tuesday.'
        ],
        bullets: [
          'One anchor per meal: choose it before anything else on the plate.',
          'Batch the anchor: cook two proteins at once and most of the week plans itself.',
          'Fill the rest from the minimums: 3 vegetables, 2 fruits, 2-4 whole grains.',
          'Cap rather than ban: saturated fat under 10 percent of calories, and no more than 10 grams of added sugar in a single meal.'
        ],
        toolLink: { href: '/tools/macro-calculator', label: 'Check the meal against your macros', description: 'Run a recipe through the macro calculator to see how far the plate moves your day.' }
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
    ],
    sources: [
      {
        label: 'Dietary Guidelines for Americans, 2025-2030 (HHS/USDA)',
        href: 'https://cdn.realfood.gov/DGA.pdf',
        note: 'Source of the protein serving goal (1.2-1.6 g/kg/day), the daily serving minimums, and the saturated-fat, added-sugar, and sodium limits used above.'
      },
      {
        label: 'DietaryGuidelines.gov - official Dietary Guidelines hub',
        href: 'https://www.dietaryguidelines.gov/',
        note: 'Federal landing page for the current edition and all previous editions.'
      },
      {
        label: 'USDA National Agricultural Library - DRI Calculator',
        href: 'https://www.nal.usda.gov/human-nutrition-and-food-safety/dri-calculator',
        note: 'Estimates daily calorie and macronutrient needs from the Dietary Reference Intakes.'
      },
      {
        label: 'USDA FoodData Central',
        href: 'https://fdc.nal.usda.gov/',
        note: 'Official food composition data for checking individual ingredients and portions.'
      }
    ]
  },
  {
    slug: 'pantry-meal-planning',
    title: 'Pantry Meal Planning: Turn Shelf Staples Into Real Dinners',
    eyebrow: 'Pantry Strategy',
    description: 'Use a pantry-first meal planning system to turn rice, beans, pasta, canned goods, spices, and freezer items into practical weekly meals.',
    datePublished: '2026-05-26',
    dateModified: '2026-09-21',
    readingTime: '10 min read',
    category: 'Pantry Planning',
    image: '/images/articles/pantry-meal-planning.webp',
    imageAlt: 'Organized pantry jars, canned goods, spices, and a meal planning checklist.',
    keywords: ['pantry meal planning', 'pantry meals', 'pantry staples', 'meal plan from pantry', 'pantry dinner ideas'],
    summary: 'A pantry meal plan starts by grouping staples into meal formulas: grain bowls, pasta dinners, soups, skillet meals, and snack plates.',
    quickWins: [
      'Inventory starches, proteins, sauces, and vegetables separately.',
      'Build meals from formulas instead of searching for exact recipes.',
      'Shop only for fresh items that complete two or more pantry meals.',
      'Write the open date on cans: an opened can of beans has days, not years.'
    ],
    primaryTool: { href: '/tools/pantry-helper', label: 'Open the Pantry Helper' },
    relatedGuides: [
      { slug: 'what-to-serve-with-roasted-potatoes', label: 'What to Serve with Roasted Potatoes', teaser: 'Potatoes are the ultimate pantry base.' },
      { slug: 'what-to-serve-with-pesto-chicken', label: 'What to Serve with Pesto Chicken', teaser: 'Jarred pesto turns pantry chicken into dinner.' }
    ],
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
        heading: 'How long the staples in your pantry actually keep',
        body: [
          'A pantry plan is only as good as its storage facts. The USDA Food Safety and Inspection Service publishes shelf-stable storage times for exactly the items a pantry plan leans on, and the spread is wide enough to change what you cook first.',
          'The pattern is worth memorizing: sealed low-acid cans keep for years, high-acid cans keep about a year, dry goods keep about two years - and the clock restarts the moment a can is opened. An opened can of beans or soup is a three-to-four-day refrigerator item, not a shelf item.'
        ],
        table: {
          caption: 'USDA FSIS shelf-stable storage times',
          headers: ['Pantry item', 'On the shelf', 'After opening'],
          rows: [
            ['Low-acid canned goods (beans, soups, stews, canned meat, potatoes, corn, carrots, peas, pumpkin)', '2 to 5 years', '3 to 4 days in the refrigerator'],
            ['High-acid canned goods (tomatoes, tomato and citrus juice, pineapple, peaches, pears, pickles, sauerkraut)', '12 to 18 months', '5 to 7 days in the refrigerator'],
            ['Rice and dried pasta', '2 years', '3 to 4 days in the refrigerator once cooked'],
            ['Commercially packaged jerky', '12 months', 'Not applicable'],
            ['Hard or dry sausage', '6 weeks in the pantry', '3 weeks refrigerated, or until it no longer smells or tastes right']
          ]
        },
        bullets: [
          'Anything labeled “Keep Refrigerated” is not pantry food - some canned hams and seafood fall into that group.',
          'Dented, leaking, bulging, or rusted can? Discard it instead of planning a meal around it.',
          'Rotate by window, not by shelf position: the item with the shortest remaining life goes into the next meal formula.'
        ],
        callout: 'The most useful habit in a pantry is a marker: write the open date on the container. Labels tell you how long food keeps sealed, never how long it keeps once you have used half of it.'
      },
      {
        heading: 'Sequence the week so nothing dies in the fridge',
        body: [
          'Pantry items are the backup; the refrigerator is where food actually gets lost. FSIS storage times give you the ordering rules for a week of pantry-led cooking.',
          'Cooked leftovers keep three to four days. Ground meat, raw poultry, and fresh fish keep one to two days. Eggs in the shell keep three to five weeks. Those three numbers explain why pantry planning works: dry and canned goods wait patiently while the perishables get eaten in order, and the pantry fills the gaps.'
        ],
        table: {
          caption: 'USDA FSIS refrigerator storage times (refrigerator held at 40 °F or below)',
          headers: ['Item', 'Refrigerator time'],
          rows: [
            ['Cooked leftovers: casseroles, soups, stews, cooked meat, poultry, fish', '3 to 4 days'],
            ['Ground meat, ground poultry, and stew meat', '1 to 2 days'],
            ['Fresh poultry, whole or in parts', '1 to 2 days'],
            ['Fresh fish and shellfish', '1 to 2 days'],
            ['Steaks, chops, roasts', '3 to 5 days'],
            ['Eggs, fresh in shell', '3 to 5 weeks'],
            ['Opened hot dogs / opened lunch meat', '1 week / 3 to 5 days'],
            ['Cooked rice, pasta, or beans', '3 to 4 days']
          ]
        },
        callout: 'Two refrigerator rules do most of the work: get leftovers into the fridge within two hours of cooking, and cool big batches fast by dividing them into shallow containers.'
      },
      {
        heading: 'Why storage windows are a waste fix, not a chore',
        body: [
          'The scale of avoidable loss is documented. The USDA Economic Research Service estimates that 133 billion pounds - 31 percent of the food available at the retail and consumer level - went uneaten in its most recent national estimate, worth roughly $162 billion at retail value, or about 1.2 pounds of food per person per day.',
          'Retail shrink shows the same pattern in fresh produce: ERS found supermarket loss averaged 11.6 percent across 31 fresh vegetables and ranged from 4.1 percent for bananas to 43.1 percent for papayas across 24 fresh fruits. Home kitchens are not the only place food disappears, but a pantry plan is one of the few fixes that costs nothing and needs no equipment.'
        ],
        bullets: [
          'Eat in window order: leftovers first, then short-life fresh items, then the pantry.',
          'Cook the perishable proteins you bought this week before opening another can.',
          'Keep one flexible “use-it-up” dinner per week - it is where the savings actually appear.'
        ]
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
    ],
    sources: [
      {
        label: 'USDA FSIS - Shelf-Stable Food Safety',
        href: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/shelf-stable-food',
        note: 'Source of the shelf, opening, and pantry storage times in the first table.'
      },
      {
        label: 'USDA FSIS - Refrigeration & Food Safety',
        href: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/refrigeration',
        note: 'Source of the refrigerator storage times in the second table (40 °F or below).'
      },
      {
        label: 'USDA FSIS - Leftovers and Food Safety',
        href: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety',
        note: 'Basis for the two-hour refrigeration rule and leftover storage guidance.'
      },
      {
        label: 'USDA Economic Research Service - Food Loss',
        href: 'https://www.ers.usda.gov/data-products/food-availability-per-capita-data-system/food-loss',
        note: 'Source of the retail and consumer food-loss estimates and the fresh produce shrink rates cited above.'
      }
    ]
  },
  {
    slug: 'grocery-budget-meal-planning',
    title: 'Grocery Budget Meal Planning: Build a Week Around Your Real Number',
    eyebrow: 'Budget Planning',
    description: 'Create a practical grocery budget meal plan using price anchors, pantry staples, flexible recipes, and a focused shopping list.',
    datePublished: '2026-05-26',
    dateModified: '2026-09-18',
    readingTime: '10 min read',
    category: 'Grocery Budget',
    image: '/images/articles/grocery-budget-meal-planning.webp',
    imageAlt: 'Grocery budget flat lay with calculator, receipt, produce bags, and affordable pantry ingredients.',
    keywords: ['grocery budget meal plan', 'budget meal planning', 'cheap meal plan', 'grocery list on a budget', 'affordable meal prep'],
    summary: 'A good budget meal plan starts with a weekly spending number, then uses price anchors like grains, legumes, eggs, frozen vegetables, and repeatable meals.',
    quickWins: [
      'Set the weekly grocery number before choosing recipes.',
      'Use two or three low-cost base ingredients across multiple meals.',
      'Plan one flexible “use-it-up” dinner to prevent waste.',
      'Check official average prices before trusting any “deal”; the unit price settles arguments fast.'
    ],
    primaryTool: { href: '/tools/grocery-list', label: 'Open the Grocery List Generator' },
    relatedGuides: [
      { slug: 'what-to-serve-with-roasted-potatoes', label: 'What to Serve with Roasted Potatoes', teaser: 'Twelve cheap mains and sauces, with per-person portion math.' },
      { slug: 'what-to-serve-with-fried-fish', label: 'What to Serve with Fried Fish', teaser: 'Budget fish night with sides that keep the plate light.' }
    ],
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
        heading: 'What food prices are doing right now',
        body: [
          'Budget math works better when it starts from the official picture instead of a headline. The USDA Economic Research Service tracks food prices every month. As of July 2026, food-at-home prices were 2.7 percent higher than a year earlier, and the agency expects a further rise of about 2.5 percent across 2026.',
          'The category detail is where it gets useful for planning. Egg prices are down sharply from their 2025 spike, dairy and cooking-oil prices are flat to falling, and the increases are concentrated in meat, produce, and sweets. That tells you where substitutions pay off this year and where they do not:'
        ],
        table: {
          caption: 'USDA ERS: food-at-home prices, change over the last 12 months (July 2025 to July 2026) and the 2026 forecast midpoint',
          headers: ['Category', 'Last 12 months', '2026 forecast'],
          rows: [
            ['Food at home (all)', '+2.7%', '+2.5%'],
            ['Meats, poultry, and fish', '+4.5%', '+4.8%'],
            ['Eggs', '-25.7%', '-30.8%'],
            ['Dairy products', '-0.5%', '0.0%'],
            ['Fats and oils', '-1.5%', '-2.2%'],
            ['Fruits and vegetables', '+5.1%', '+4.2%'],
            ['Cereals and bakery products', '+2.7%', '+2.8%'],
            ['Sugar and sweets', '+7.4%', '+7.1%'],
            ['Nonalcoholic beverages', '+4.1%', '+4.3%'],
            ['Other foods', '+2.1%', '+2.3%']
          ]
        },
        callout: 'Planning rule for the year: lean on eggs, dairy, and cooking fats while they are flat or falling, and make fresh produce and sweets the categories where substitutions earn their keep.'
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
        heading: 'Know the street price of your staples',
        body: [
          'Price anchors only work when you know what they normally cost. Every month the Bureau of Labor Statistics publishes average U.S. city prices for common foods, which makes a free reality check for any deal you see. Here is what the basics averaged in August 2026:'
        ],
        table: {
          caption: 'BLS average price data: U.S. city average, August 2026',
          headers: ['Staple', 'Average price'],
          rows: [
            ['Eggs, grade A large (per dozen)', '$2.27'],
            ['Milk, whole (per gallon)', '$4.23'],
            ['Bread, white pan (per pound)', '$1.82'],
            ['Chicken, whole (per pound)', '$2.01'],
            ['Ground beef, 100% beef (per pound)', '$6.92'],
            ['Spaghetti and macaroni (per pound)', '$1.37'],
            ['Rice, white long grain, uncooked (per pound)', '$1.11'],
            ['Beans, dried (per pound)', '$1.63'],
            ['Potatoes, white (per pound)', '$0.98'],
            ['Bananas (per pound)', '$0.65'],
            ['Tomatoes, field grown (per pound)', '$1.98'],
            ['Lettuce, iceberg (per pound)', '$1.47']
          ]
        },
        callout: 'Notice the spread: whole chicken near $2 a pound and dried beans at $1.63 give you very different dinner math than ground beef at $6.92. A price only beats these averages when it lands meaningfully under them.'
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
        heading: 'Unit price: the one number that beats every coupon',
        body: [
          'The unit price, or cost per ounce, pound, quart, or gram, is the single most honest number in the store. Most shelf tags print it; when they do not, it takes ten seconds to figure out: divide the price by the size of the package.',
          'A $6.49 jar holding 64 ounces comes to about 10.1 cents per ounce. A $3.99 jar holding 32 ounces is about 12.5 cents per ounce. The bigger jar can look like the expensive choice at checkout, yet per ounce it is roughly 19 percent cheaper. Two habits catch almost every mistake: convert both options to the same unit before comparing, and never let a sale tag on a small package beat a larger pack without the math to prove it.'
        ],
        bullets: [
          'Compare within one unit: convert pounds, ounces, and grams first, and the converter below handles the arithmetic.',
          'Recheck unit prices when packaging changes; sizes shrink quietly while shelf prices hold.',
          'On multipacks, compare the per-item price, not the bundle price.'
        ],
        toolLink: { href: '/tools/unit-converter', label: 'Convert the units before you compare', description: 'Turn any price into per-ounce, per-pound, or per-gram numbers so two packages compete fairly.' }
      },
      {
        heading: 'When bulk buying actually saves money',
        body: [
          'Bulk buying is a math problem with two variables: the unit price, and how much of the item you will realistically finish. Bigger is only cheaper when both work out. A warehouse pack loses money the moment it goes stale, expires, or crowds out food you would have eaten.',
          'A workable default for most kitchens: bulk-buy the shelf-stable items you use weekly, such as rice, oats, pasta, dried beans, and flour, and keep fresh items at the sizes you actually consume.'
        ],
        bullets: [
          'Run the unit-price comparison every time; a bigger pack is not automatically a lower unit price.',
          'Buy the size that finishes within its storage life: grains keep for months, oils and nuts go stale sooner, spices fade within about a year.',
          'Count the freezer math. If you will freeze half, containers and freezer space are real costs.',
          'Skip bulk deals on foods you do not normally eat; food you throw away is the most expensive food in the store.'
        ]
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
    ],
    sources: [
      {
        label: 'USDA Economic Research Service - Food Price Outlook',
        href: 'https://www.ers.usda.gov/data-products/food-price-outlook/',
        note: 'Source of the category price changes and 2026 forecast figures (data through July 2026).'
      },
      {
        label: 'BLS - CPI Average Price Data',
        href: 'https://www.bls.gov/cpi/factsheets/average-prices.htm',
        note: 'Documents the average-price series behind the staples table (U.S. city average, August 2026).'
      },
      {
        label: 'Iowa State University Extension - Spend Smart. Eat Smart.',
        href: 'https://spendsmart.extension.iastate.edu/',
        note: 'University extension resources for budget meal planning and home cooking.'
      }
    ]
  },
  {
    slug: 'high-protein-meal-prep',
    title: 'High-Protein Meal Prep Ideas That Still Feel Flexible',
    eyebrow: 'Protein Prep',
    description: 'Plan high-protein meal prep with flexible components, balanced macros, and repeatable formulas that do not require eating the same container all week.',
    datePublished: '2026-05-26',
    dateModified: '2026-09-23',
    readingTime: '11 min read',
    category: 'Meal Prep',
    image: '/images/articles/high-protein-meal-prep.webp',
    imageAlt: 'Neatly arranged meal prep containers with grains, roasted vegetables, protein foods, and macro cards.',
    keywords: ['high protein meal prep', 'protein meal prep ideas', 'meal prep protein', 'high protein lunches', 'macro meal prep'],
    summary: 'The most flexible high-protein meal prep uses components: a protein anchor, a base, vegetables, sauce, and a finishing texture you can mix through the week.',
    quickWins: [
      'Prep protein anchors separately from sauces so meals can change flavor.',
      'Cook one base and two vegetables to create several combinations.',
      'Add protein to snacks and breakfasts, not only lunch and dinner.',
      'Weigh protein raw and divide by containers: that number does not change when water cooks off.'
    ],
    primaryTool: { href: '/tools/protein-calculator', label: 'Open the Protein Calculator' },
    relatedGuides: [
      { slug: 'what-to-serve-with-pesto-chicken', label: 'What to Serve with Pesto Chicken', teaser: 'A fast protein anchor you can repeat all week.' },
      { slug: 'what-to-serve-with-fried-fish', label: 'What to Serve with Fried Fish', teaser: 'Lean protein with sides that fit a prep plan.' }
    ],
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
        heading: 'What the protein numbers actually look like per portion',
        body: [
          'Component prep gets easier once you know how much protein each anchor really delivers, because that number decides how many containers a batch fills. These are USDA FoodData Central values for protein per 100 g of the food as eaten; the portion column is the same figure multiplied out for a 150 g serving.',
          'The spread is the useful part. A 150 g portion of cooked poultry delivers more protein than three times that weight of cooked chickpeas, so “protein anchor” is really several tiers. Building a week from two tiers — one dense anchor plus one plant anchor — holds up better than trying to hit the top of the list at every meal.',
          'It also explains why portions look so different. Reaching 30 g of protein from cooked chickpeas means eating roughly 340 g of them; 100 g of cooked poultry already clears 30 g. Neither is better, but the container is not the same size.'
        ],
        table: {
          caption: 'USDA FoodData Central — protein per 100 g as eaten, with a 150 g portion worked out',
          headers: ['Protein anchor', 'Protein per 100 g', 'In a 150 g portion'],
          rows: [
            ['Chicken or turkey breast, meat only, cooked', '32.1 g', 'about 48 g'],
            ['Tuna, light, canned in water, drained solids', '25.5 g', 'about 38 g'],
            ['Eggs, whole, hard-boiled', '12.6 g', 'about 19 g'],
            ['Cottage cheese, lowfat (1% milkfat)', '12.4 g', 'about 19 g'],
            ['Tofu, extra firm, prepared with nigari', '9.98 g', 'about 15 g'],
            ['Yogurt, Greek, plain, lowfat', '9.95 g', 'about 15 g'],
            ['Lentils, cooked, boiled', '9.02 g', 'about 14 g'],
            ['Chickpeas, cooked, boiled', '8.86 g', 'about 13 g'],
            ['Black beans, cooked, boiled', '8.86 g', 'about 13 g']
          ]
        },
        bullets: [
          'Use the 100 g column to compare anchors; use the portion column to plan containers.',
          'Cheese, nuts, and seeds add protein but arrive with much more fat per gram, so they support a meal rather than anchor it.',
          'Protein powders and bars are label-driven: read the package rather than a database entry.'
        ],
        callout: 'If you track one number in meal prep, track grams of protein per container. It survives every cooking method, and it is the figure the plan is actually built on.',
        toolLink: { href: '/tools/protein-calculator', label: 'Set your daily protein target', description: 'Work out grams per day and per meal before dividing a batch into containers.' }
      },
      {
        heading: 'Do the batch math from raw weight',
        body: [
          'Protein is not lost when meat cooks; water is. That single fact makes batch math simple: multiply the raw weight of the protein by the protein density of the raw food, and you have the protein in the whole package no matter what the pan does to the scale.',
          'A 3 lb (1,361 g) pack of raw boneless skinless chicken breast at 22.5 g of protein per 100 g carries roughly 306 g of protein. Divided into five containers that is about 61 g each; six containers gives about 51 g. The container count sets the per-serving number, not the cooked weight on the day.',
          'The same approach covers plant anchors. A 250 g portion of cooked chickpeas at 8.86 g per 100 g comes to about 22 g of protein — roughly one plant-anchor serving. Write the batch number on the lid once and you never recalculate lunch again.'
        ],
        bullets: [
          'Weigh raw, note the batch total, then divide by the containers you actually filled.',
          'Sauces, marinades, and oils are their own lines: they change fat and sodium, not the protein math.',
          'Freezing half the batch? Split the protein figure before it goes in the freezer so both halves carry their own number.'
        ],
        callout: 'Cooked weight changes; protein content does not. Do the division from the raw package and the containers stay consistent from week to week.',
        toolLink: { href: '/tools/nutrition-calculator', label: 'Calculate the full batch', description: 'Turn a batch recipe into per-container calories, protein, and macros.' }
      },
      {
        heading: 'Keep the week inside the safe storage window',
        body: [
          'A prep plan is also a food-safety plan, and the USDA Food Safety and Inspection Service publishes the windows that apply. Cooked leftovers — casseroles, soups, stews, cooked meat, poultry, and fish — keep three to four days in a refrigerator held at 40 °F or below. Cooked rice, pasta, and beans follow the same three-to-four-day rule. Raw ground meat, raw poultry, and fresh fish are far shorter: one to two days.',
          'That is the argument for four containers instead of seven. Build the week in two batches, or freeze the back half in the containers you plan to eat later and thaw it in the refrigerator.',
          'Two habits protect the batch. Get cooked food into the refrigerator promptly — FSIS guidance for leftovers is within two hours — and cool large batches fast by dividing them into small portions in shallow containers instead of leaving a deep pot to shed heat slowly.'
        ],
        table: {
          caption: 'USDA FSIS refrigerator storage windows (40 °F or below)',
          headers: ['Prepped item', 'Refrigerator time'],
          rows: [
            ['Cooked leftovers: casseroles, soups, stews, cooked meat, poultry, fish', '3 to 4 days'],
            ['Cooked rice, pasta, or beans', '3 to 4 days'],
            ['Raw ground meat or poultry, fresh poultry, fresh fish', '1 to 2 days'],
            ['Eggs, fresh in shell', '3 to 5 weeks']
          ]
        },
        bullets: [
          'Write the cook date on each lid so day four is obvious at a glance.',
          'Cool in shallow containers first, then stack and cover once the food stops steaming.',
          'Freeze anything you will not eat inside the window — and label the container with the freeze date too.'
        ],
        callout: 'A four-day container is not a suggestion about freshness; it is the outer edge of the safe window for cooked food.'
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
    ],
    sources: [
      {
        label: 'USDA FoodData Central',
        href: 'https://fdc.nal.usda.gov/',
        note: 'Source of every protein value in the anchor table (for example chicken breast cooked, FDC 331960; raw, FDC 2646170).'
      },
      {
        label: 'USDA FSIS — Refrigeration & Food Safety',
        href: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/refrigeration',
        note: 'Source of the refrigerator storage windows and the shallow-container cooling guidance.'
      },
      {
        label: 'USDA FSIS — Leftovers and Food Safety',
        href: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety',
        note: 'Basis for the two-hour refrigeration rule for cooked food.'
      }
    ]
  }
];

// Batch A pairing guides — data lives in JSON files (resolveJsonModule is enabled).
import roastedPotatoes from './articles/what-to-serve-with-roasted-potatoes.json';
import friedFish from './articles/what-to-serve-with-fried-fish.json';
import pestoChicken from './articles/what-to-serve-with-pesto-chicken.json';

const pairingGuides: Article[] = [
  roastedPotatoes as unknown as Article,
  friedFish as unknown as Article,
  pestoChicken as unknown as Article
];

export const articles: Article[] = [...coreArticles, ...pairingGuides];

export function getArticle(slug: string): Article {
  const article = articles.find((item) => item.slug === slug);
  if (!article) {
    throw new Error(`Unknown article slug: ${slug}`);
  }
  return article;
}
