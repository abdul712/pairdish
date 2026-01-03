# PairingPlates.com - Tools & Utilities Roadmap

> **Comprehensive development roadmap for 40+ interactive food pairing tools and kitchen utilities**
> *Version 1.1 | Last Updated: January 3, 2026*

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Tool Categories](#3-tool-categories)
4. [Phase 1: Core Pairing Tools](#4-phase-1-core-pairing-tools)
5. [Phase 2: Kitchen Calculators](#5-phase-2-kitchen-calculators)
6. [Phase 3: Party & Event Tools](#6-phase-3-party--event-tools)
7. [Phase 4: Meal Planning Utilities](#7-phase-4-meal-planning-utilities)
8. [Phase 5: Baking Calculators](#8-phase-5-baking-calculators)
9. [Phase 6: Specialty Pairing Tools](#9-phase-6-specialty-pairing-tools)
10. [Phase 7: Health & Dietary Tools](#10-phase-7-health--dietary-tools)
11. [Phase 8: Interactive Quizzes](#11-phase-8-interactive-quizzes)
12. [Data Architecture](#12-data-architecture)
13. [SEO Strategy](#13-seo-strategy)
14. [Monetization Plan](#14-monetization-plan)

---

## 1. Project Overview

### Mission
Build the most comprehensive suite of food pairing tools and kitchen utilities on the web, helping home cooks, food enthusiasts, and party planners make better culinary decisions.

### Brand Identity
- **Domain**: pairingplates.com
- **Tagline**: "Perfect Pairings, Every Plate"
- **Target Audience**: Home cooks, wine enthusiasts, party planners, meal preppers
- **Design Aesthetic**: Warm, appetizing, premium feel with rich colors (deep burgundy, forest green, warm gold accents)

### Success Metrics
| Metric | Target (6 months) | Target (12 months) |
|--------|-------------------|-------------------|
| Monthly Visitors | 50,000 | 200,000 |
| Tools Completed | 20 | 40 |
| Avg. Time on Site | 3+ minutes | 4+ minutes |
| Ad Revenue | $500/month | $2,000/month |

---

## 2. Technology Stack

### Frontend Framework
```
Framework: Astro 5.x
Interactive Components: React 19.x
Styling: Tailwind CSS 4.x
Deployment: Cloudflare Workers
```

### Component Architecture
```
src/
├── components/
│   ├── tools/              # React interactive components
│   │   ├── pairing/        # Food pairing tools
│   │   ├── calculators/    # Kitchen calculators
│   │   ├── planners/       # Party/meal planners
│   │   └── quizzes/        # Interactive quizzes
│   ├── ui/                 # Reusable UI components
│   └── layouts/            # Page layouts
├── data/                   # Static pairing data
│   ├── wine-pairings.ts
│   ├── cheese-pairings.ts
│   ├── flavor-profiles.ts
│   └── nutrition-data.ts
├── lib/                    # Utilities
│   ├── pairing-engine.ts   # Core pairing logic
│   ├── calculators.ts      # Calculation utilities
│   └── share-utils.ts      # Social sharing
└── pages/
    └── tools/              # Tool pages
```

---

## 3. Tool Categories

### Category Overview

| Category | Tool Count | Priority | Monetization Potential |
|----------|------------|----------|----------------------|
| 🍷 Pairing Tools | 8 | HIGH | Affiliate (wine shops) |
| 🧮 Calculators | 8 | HIGH | Ad revenue |
| 🎉 Party Planning | 5 | MEDIUM | Affiliate (party supplies) |
| 🥗 Meal Planning | 5 | MEDIUM | Recipe affiliate |
| 🍰 Baking | 5 | MEDIUM | Ad revenue |
| 🌿 Specialty | 5 | LOW | Niche affiliate |
| 💪 Health/Diet | 4 | MEDIUM | Health product affiliate |
| 🎯 Quizzes | 4 | HIGH | Viral/social sharing |

---

## 4. Phase 1: Core Pairing Tools

### Tool 1.1: Food & Flavor Pairing Finder
**Status**: 🟢 Completed (v1)
**Priority**: P0 - Critical
**Estimated Dev Time**: 8 hours
**Completed**: January 2026
**Live URL**: /tools/flavor-pairing

#### Description
Interactive tool that takes an ingredient and returns scientifically-backed flavor pairings based on shared aromatic compounds.

#### Technical Specification
```typescript
interface FlavorPairingRequest {
  ingredient: string;
  category?: 'protein' | 'vegetable' | 'fruit' | 'dairy' | 'grain' | 'spice';
  cuisineFilter?: string[];
}

interface FlavorPairingResult {
  ingredient: string;
  matchScore: number; // 0-100
  category: string;
  sharedAromas: string[];
  cuisineSuggestions: string[];
  preparationTips: string[];
}
```

#### UI Components
- Search autocomplete for ingredients (300+ items)
- Category filter tabs
- Visual pairing cards with match percentage
- "Unexpected Pairings" featured section
- Save/share functionality

#### Data Requirements
- 300+ ingredient flavor profiles
- Aromatic compound mappings
- Cuisine categorization data

#### SEO Keywords
- "what goes with [ingredient]"
- "flavor pairing guide"
- "food pairing chart"
- "[ingredient] recipe ideas"

---

### Tool 1.2: Wine & Food Pairing Matcher
**Status**: 🟢 Completed (v1)
**Priority**: P0 - Critical
**Estimated Dev Time**: 10 hours
**Completed**: January 3, 2026
**Live URL**: /tools/wine-pairing

#### Description
Bidirectional pairing tool: enter a dish to get wine recommendations, or enter a wine to get food suggestions.

#### Technical Specification
```typescript
interface WinePairingRequest {
  query: string;
  direction: 'food-to-wine' | 'wine-to-food';
  budget?: 'everyday' | 'mid-range' | 'premium';
  preferences?: {
    sweetness?: 'dry' | 'off-dry' | 'sweet';
    body?: 'light' | 'medium' | 'full';
    color?: 'red' | 'white' | 'rosé' | 'sparkling';
  };
}

interface WinePairing {
  wine: {
    type: string;
    region?: string;
    grapeVarietals: string[];
    flavor_profile: string[];
  };
  matchScore: number;
  reasoning: string;
  servingTemperature: string;
  glassType: string;
}
```

#### UI Components
- Toggle: "I have food" / "I have wine"
- Dish/wine search with autocomplete
- Budget tier selector
- Wine preference filters (body, sweetness)
- Results with pairing explanations
- Regional wine map visualization

#### Data Requirements
- 100+ wine varietals with profiles
- 200+ dish categories
- Regional wine data
- Pairing rules database

#### SEO Keywords
- "wine pairing for [dish]"
- "what wine goes with [food]"
- "best wine for dinner"
- "wine and food pairing guide"

#### Affiliate Potential
- Wine.com affiliate links
- Vivino recommendations
- Local wine shop finder

---

### Tool 1.3: Recipe Scaling Calculator
**Status**: 🟢 Completed (v1)
**Priority**: P0 - Critical
**Estimated Dev Time**: 6 hours
**Completed**: January 3, 2026
**Live URL**: /tools/recipe-scaler

#### Description
Universal recipe scaler that adjusts ingredient quantities intelligently with smart fraction display.

#### Technical Specification
```typescript
interface RecipeScalerInput {
  originalServings: number;
  desiredServings: number;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
}

interface ScaledIngredient {
  name: string;
  originalAmount: string;
  scaledAmount: string;
  displayFraction: string; // "1/3", "1/2", "2/3", etc.
  tips?: string; // "Consider rounding up for easier measuring"
}
```

#### UI Components
- Original/desired servings input (with +/- buttons)
- Dynamic ingredient list (add/remove rows)
- Ingredient autocomplete
- Unit selector dropdown
- One-click copy scaled recipe
- Print-friendly view

#### Features
- Smart fraction rounding (1.33 → "1⅓")
- Scaling tips for baking (yeast, eggs don't scale linearly)
- Unit conversion option
- Save recipes locally

#### SEO Keywords
- "recipe scaler"
- "recipe converter"
- "scale recipe up"
- "double recipe calculator"

---

### Tool 1.4: Party Food Calculator
**Status**: 🟢 Completed (v1)
**Priority**: P0 - Critical
**Estimated Dev Time**: 8 hours
**Completed**: January 3, 2026
**Live URL**: /tools/party-calculator

#### Description
Calculate exactly how much food to prepare for any gathering based on guest count, event type, and duration.

#### Technical Specification
```typescript
interface PartyFoodInput {
  guestCount: number;
  eventType: 'casual' | 'formal' | 'cocktail' | 'bbq' | 'buffet' | 'dinner';
  duration: number; // hours
  mealTime: 'lunch' | 'dinner' | 'appetizers-only';
  demographics?: {
    adults: number;
    children: number;
    heavyEaters?: number;
  };
  dietaryRestrictions?: string[];
}

interface PartyFoodResult {
  categories: Array<{
    category: string; // "Appetizers", "Main Course", etc.
    totalAmount: string;
    unit: string;
    itemSuggestions: string[];
    perPersonAmount: string;
  }>;
  shoppingList: Array<{
    item: string;
    quantity: string;
    notes?: string;
  }>;
  tips: string[];
  estimatedCost?: {
    budget: string;
    moderate: string;
    premium: string;
  };
}
```

#### UI Components
- Guest count slider (10-200)
- Event type visual selector (icons)
- Duration picker
- Adult/child split input
- Dietary restriction checkboxes
- Visual food breakdown chart
- Printable shopping list generator

#### SEO Keywords
- "party food calculator"
- "how much food for party"
- "catering calculator"
- "food quantity for guests"

---

### Tool 1.5: Drink/Cocktail Calculator
**Status**: 🟢 Completed (v1)
**Priority**: P0 - Critical
**Estimated Dev Time**: 6 hours
**Completed**: January 3, 2026
**Live URL**: /tools/drink-calculator

#### Description
Calculate alcohol and mixer quantities for parties, plus batch cocktail scaling.

#### Technical Specification
```typescript
interface DrinkCalculatorInput {
  guestCount: number;
  duration: number; // hours
  drinkTypes: {
    beer: boolean;
    wine: boolean;
    spirits: boolean;
    mixers: boolean;
    nonAlcoholic: boolean;
  };
  preferences?: {
    beerRatio: number; // 0-100%
    wineRatio: number;
    spiritsRatio: number;
  };
}

interface DrinkCalculatorResult {
  beer: { 
    quantity: number; 
    unit: 'bottles' | 'cans' | 'kegs';
    suggestions: string[];
  };
  wine: {
    red: number;
    white: number;
    sparkling: number;
    unit: 'bottles';
  };
  spirits: Array<{
    type: string;
    quantity: string;
    mixersNeeded: string[];
  }>;
  nonAlcoholic: Array<{
    type: string;
    quantity: string;
  }>;
  ice: string;
  garnishes: string[];
}
```

#### UI Components
- Guest/duration inputs
- Drink type toggles with ratios
- Visual drink breakdown (pie chart)
- Batch cocktail scaler (input recipe, output batch)
- Shopping list generator

#### SEO Keywords
- "drink calculator for party"
- "how much alcohol for wedding"
- "cocktail party calculator"
- "batch cocktail recipe"

---

## 5. Phase 2: Kitchen Calculators

### Tool 2.1: Cooking Unit Converter
**Status**: 🟢 Completed (v1)
**Priority**: P1 - High
**Estimated Dev Time**: 5 hours
**Completed**: January 3, 2026
**Live URL**: /tools/unit-converter

#### Description
Convert between all common cooking measurements with ingredient-specific density conversions.

#### Technical Specification
```typescript
interface UnitConversion {
  amount: number;
  fromUnit: CookingUnit;
  toUnit: CookingUnit;
  ingredient?: string; // For volume-to-weight (optional)
}

type CookingUnit = 
  | 'cup' | 'tablespoon' | 'teaspoon' | 'fluid_ounce'
  | 'milliliter' | 'liter' | 'gram' | 'kilogram'
  | 'ounce' | 'pound' | 'stick'; // butter sticks

interface ConversionResult {
  result: number;
  displayResult: string;
  formula: string;
  relatedConversions: Array<{unit: string; amount: string}>;
}
```

#### Features
- Bidirectional conversion
- 50+ common ingredients with density data
- US/UK/Metric toggle
- Common equivalents reference table
- Recent conversions history

---

### Tool 2.2: Nutrition Calculator
**Status**: 🟢 Completed (v1)
**Priority**: P1 - High
**Estimated Dev Time**: 10 hours
**Completed**: January 3, 2026
**Live URL**: /tools/nutrition-calculator

#### Features Implemented
- Paste recipe ingredients (one per line) to calculate nutrition
- Smart ingredient parsing (handles amounts, units, fractions)
- USDA-based nutrition database with 45+ common foods:
  - Proteins (chicken, beef, salmon, eggs, tofu, bacon)
  - Dairy (milk, butter, cheese, cream, yogurt)
  - Grains (rice, pasta, bread, flour, oats)
  - Vegetables (broccoli, spinach, onion, garlic, potato, carrot)
  - Fruits, oils, sweeteners, nuts, condiments
- Complete nutrition facts display (calories, fat, carbs, protein, fiber, sugar, sodium, cholesterol)
- Visual macro breakdown with color-coded bar chart
- Per-serving and total recipe calculations
- Adjustable serving count
- Dietary labels (High-Protein, Low-Carb, Low-Fat, High-Fiber, Low-Sodium)
- Ingredient matching status with warnings for unrecognized items

---

### Tool 2.3: Oven Temperature Converter
**Status**: 🟢 Completed (v1)
**Priority**: P1 - High
**Estimated Dev Time**: 3 hours
**Completed**: January 3, 2026
**Live URL**: /tools/oven-temperature

#### Features
- Fahrenheit ↔ Celsius ↔ Gas Mark
- Convection/fan oven adjustment
- Altitude adjustment calculator
- Common temperature reference chart

---

### Tool 2.4: Cooking Time Calculator
**Status**: 🟢 Completed (v1)
**Priority**: P1 - High
**Estimated Dev Time**: 6 hours
**Completed**: January 3, 2026
**Live URL**: /tools/cooking-time

#### Features
- Meat type selector (beef, pork, poultry, fish)
- Weight input
- Desired doneness
- Cooking method (oven, grill, smoke)
- Rest time recommendations
- Internal temperature targets (USDA safe temps)

---

### Tool 2.5: Substitution Finder
**Status**: 🟢 Completed (v1)
**Priority**: P1 - High
**Estimated Dev Time**: 8 hours
**Completed**: January 3, 2026
**Live URL**: /tools/substitution-finder

#### Features Implemented
- 12+ base ingredients with multiple substitutions each
- 7 dietary filter tags (vegan, dairy-free, gluten-free, nut-free, egg-free, low-sugar, keto)
- Ratio calculators (butter→oil, eggs→alternatives)
- Flavor and texture impact indicators
- Best use case recommendations for each substitute
- Baking and cooking tips sections

---

## 6. Phase 3: Party & Event Tools

### Tool 3.1: Cheese Board Calculator
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 6 hours
**Completed**: January 3, 2026
**Live URL**: /tools/cheese-board-calculator

#### Features Implemented
- Guest count slider (2-50 guests)
- Event type selection (appetizer, main event, wine party, casual)
- Cheese variety selector with 16 cheeses across 5 categories:
  - Soft (Brie, Camembert, Goat, Burrata)
  - Semi-soft (Havarti, Fontina, Muenster)
  - Firm (Cheddar, Gruyère, Gouda, Manchego)
  - Hard (Parmesan, Pecorino)
  - Blue (Gorgonzola, Roquefort, Stilton)
- Charcuterie toggle (prosciutto, salami)
- Per-variety quantity calculations in oz and lbs
- Accompaniment shopping list (crackers, fruit, nuts, honey, olives, etc.)
- Three-tier budget estimates (budget, recommended, premium)
- Print shopping list functionality
- Board building tips and serving recommendations

### Tool 3.2: Wine Bottle Calculator
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 3 hours
**Completed**: January 3, 2026
**Live URL**: /tools/wine-calculator

#### Features Implemented
- Guest count and event duration inputs
- Event type selection (dinner, reception, cocktail)
- Serving style options (with meal, cocktail hour, all evening)
- Wine ratio sliders (red/white/sparkling)
- Real-time bottle calculations with breakdown
- Three-tier budget estimates (budget, recommended, premium)
- Contextual wine selection tips

### Tool 3.3: Appetizer Quantity Planner
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 4 hours
**Completed**: January 3, 2026
**Live URL**: /tools/appetizer-planner

#### Features Implemented
- Guest count slider (5-100 guests)
- Event type selection with per-person calculations:
  - Cocktail Party (8-12 pieces/person)
  - Pre-Dinner (4-6 pieces/person)
  - Reception (6-10 pieces/person)
  - All-Evening Party (10-15 pieces/person)
  - Casual Gathering (5-8 pieces/person)
- Serving style options (passed, stationed, mixed)
- 24+ appetizer options across 4 categories:
  - Hot appetizers (meatballs, stuffed mushrooms, spring rolls, etc.)
  - Cold appetizers (deviled eggs, shrimp cocktail, caprese, etc.)
  - Dips & spreads (spinach dip, guacamole, hummus, etc.)
  - Finger foods (nuts, olives, pickles, chips)
- Dietary tags for each item (vegetarian, vegan, gluten-free)
- Per-appetizer quantity calculations
- Category balance checker
- Prep notes and timing guidelines

### Tool 3.4: Buffet Menu Planner
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 6 hours
**Completed**: January 3, 2026
**Live URL**: /tools/buffet-planner

#### Features Implemented
- Guest count slider (10-150 guests)
- Meal type selection (brunch, lunch, dinner, holiday)
- 35+ dish options across 6 categories:
  - Mains (beef, chicken, salmon, ham, turkey, vegetarian options)
  - Sides (green beans, glazed carrots, roasted vegetables, etc.)
  - Salads (garden, Caesar, coleslaw, pasta salad, etc.)
  - Starches (mashed potatoes, rice pilaf, roasted potatoes, mac & cheese)
  - Breads (dinner rolls, cornbread, biscuits, garlic bread)
  - Desserts (brownies, cookies, pie slices, cake slices)
- Dietary tags for each dish (vegetarian, vegan, gluten-free)
- Category balance checker with visual progress bars
- Per-dish quantity calculations (lbs and oz)
- Setup tips and timing guidelines
- Meal-type specific recommendations

### Tool 3.5: Potluck Coordinator
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 8 hours
**Completed**: January 3, 2026
**Live URL**: /tools/potluck-coordinator

#### Features Implemented
- Guest count slider with dynamic recommendations
- 5 dish categories (Appetizers, Mains, Sides, Desserts, Drinks)
- Balance checker with visual progress bars
- Dietary tag system (vegetarian, vegan, gluten-free, dairy-free, nut-free)
- Contributor tracking for each dish
- Automatic serving quantity recommendations
- Dietary coverage dashboard
- Print and share functionality (native share API + clipboard)

---

## 7. Phase 4: Meal Planning Utilities

### Tool 4.1: Leftover Ingredient Recipe Matcher
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 10 hours
**Completed**: January 3, 2026
**Live URL**: /tools/leftover-matcher

#### Features Implemented
- 50+ ingredient database across 7 categories (proteins, vegetables, fruits, dairy, grains, pantry, condiments)
- 20+ recipe database with full instructions
- Smart recipe matching by ingredient overlap percentage
- Visual match indicator (green/amber based on match %)
- Ingredient checklist with selected items shown/hidden
- Meal type filter (breakfast, lunch, dinner, snack)
- Cuisine filter (American, Italian, Mexican, Asian, Mediterranean)
- Missing ingredient indicators for each recipe
- Expandable recipe cards with full instructions
- Dietary tags (vegetarian, vegan, gluten-free, dairy-free)
- Prep time, cook time, difficulty, and servings info
- Tips section for using common leftovers

### Tool 4.2: Weekly Meal Prep Calculator
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 8 hours
**Completed**: January 3, 2026
**Live URL**: /tools/meal-prep

#### Features Implemented
- Interactive weekly calendar grid (7 days x 4 meal types)
- 20+ meal templates across breakfast, lunch, dinner, snack
- Click-to-add meal selection for each slot
- Servings per meal adjustment (1-8)
- Real-time total prep time calculation
- Batch cooking recommendations (number of batches needed)
- Automatic shopping list generation from selected meals
- Freezability indicators for each meal
- Shelf life information for food safety
- Dietary tags (vegetarian, vegan, gluten-free, dairy-free, low-carb)
- Print functionality for prep schedule and shopping list
- Clear all and individual slot removal
- Prep tips section

### Tool 4.3: Seasonal Ingredient Guide
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 6 hours
**Completed**: January 3, 2026
**Live URL**: /tools/seasonal-guide

#### Features Implemented
- 25+ seasonal produce items across vegetables, fruits, and herbs
- Interactive 12-month selector showing current month by default
- Season indicators (spring, summer, fall, winter)
- Peak vs. available month differentiation
- Visual availability chart per produce item
- Category filtering (vegetables, fruits, herbs)
- Search by produce name or pairings
- Detailed view panel with:
  - Description and selection tips
  - Peak and available months chart
  - Perfect pairings list
  - Storage recommendations
  - Pro tips for cooking/preparation

### Tool 4.4: Pantry Pairing Helper
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 8 hours
**Completed**: January 3, 2026
**Live URL**: /tools/pantry-helper

#### Features Implemented
- 25+ pantry items across 7 categories (grains, proteins, canned goods, sauces, spices, oils, baking)
- 8 meal idea templates with required pantry items and optional fresh additions
- Versatility ratings (essential, versatile, specialty) for each item
- Category filtering and search functionality
- Selected items tracking with visual indicators
- Matching meal ideas calculated based on selected pantry items
- Detailed item view panel with:
  - Shelf life information
  - Perfect pairings list
  - Quick meal suggestions
  - Pro tips for storage and usage
- Cuisine tags for each meal idea
- Prep time estimates

### Tool 4.5: Grocery List Generator
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 6 hours
**Completed**: January 3, 2026
**Live URL**: /tools/grocery-list

#### Features Implemented
- 5 sample recipes to demonstrate functionality
- Automatic ingredient consolidation from multiple recipes
- Smart store section categorization (10 sections):
  - Produce, Meat & Seafood, Dairy & Eggs, Bakery
  - Frozen, Pantry & Dry Goods, Spices & Seasonings
  - Canned & Jarred, Beverages, Other
- 100+ ingredient-to-section mappings
- Manual item addition with auto-categorization
- Interactive checklist with progress tracking
- Check/uncheck and remove individual items
- "Clear Checked" bulk action
- Print-friendly list generation
- Progress bar showing completion status
- Recipe source tracking for each item
- Quantity and unit display

---

## 8. Phase 5: Baking Calculators

### Tool 5.1: Pan Size Converter
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 5 hours
**Completed**: January 3, 2026
**Live URL**: /tools/pan-size-converter

#### Features Implemented
- 20 pan sizes across 6 shapes (round, square, rectangle, bundt, loaf, springform)
- Shape-based filtering
- Visual pan comparison with area and volume
- Automatic scale factor calculation
- Percentage size change display
- Recipe batch adjustment calculator
- Baking time adjustment recommendations
- Complete pan reference table
- Swap pans functionality
- Baking tips for different pan types

### Tool 5.2: Flour Substitution Calculator
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 4 hours
**Completed**: January 3, 2026
**Live URL**: /tools/flour-substitution

#### Features Implemented
- 8 flour types: All-Purpose, Bread, Cake, Pastry, Whole Wheat, Self-Rising, Almond, Coconut
- 18 substitution recipes with exact ratios
- Additional ingredients needed (cornstarch, vital wheat gluten, etc.)
- Quality ratings (excellent, good, acceptable) for each substitution
- Detailed notes on texture and flavor changes
- Visual amount display with additions
- Direct and reverse substitution lookups
- Educational content on protein content and gluten development
- Flour type information cards

### Tool 5.3: Sugar Substitution Calculator
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 4 hours
**Completed**: January 3, 2026
**Live URL**: /tools/sugar-substitution

#### Features Implemented
- 12 sweetener types: White Sugar, Brown Sugar, Honey, Maple Syrup, Coconut Sugar, Agave, Stevia, Monk Fruit, Erythritol, Xylitol, Date Sugar, Molasses
- 18+ substitution recipes with precise ratios
- Liquid adjustment recommendations
- Baking-specific notes for each substitution
- Quality ratings (excellent, good, acceptable)
- Sweetener comparison cards (sweetness, calories, glycemic index)
- Best uses and avoid lists per sweetener
- Interactive sweetener reference guide

### Tool 5.4: Yeast Conversion Calculator
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 3 hours
**Completed**: January 3, 2026
**Live URL**: /tools/yeast-converter

#### Features Implemented
- 4 yeast types: Active Dry, Instant, Fresh, Sourdough Starter
- Multiple input units (tsp, tbsp, packet, oz, g)
- Accurate conversion ratios between all yeast types
- Multi-format output (tsp, tbsp, packets, grams)
- Yeast type information cards with storage and activation tips
- Quick reference conversion chart
- Swap functionality for bidirectional conversion
- Detailed tips for each yeast type

### Tool 5.5: Sourdough Hydration Calculator
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 4 hours
**Completed**: January 3, 2026
**Live URL**: /tools/sourdough-calculator

#### Features Implemented
- Recipe input: flour, water, starter, starter hydration, salt
- True hydration calculation accounting for starter flour/water
- Baker's percentages display (starter %, salt %)
- Total dough weight calculation
- Common bread hydration presets (Sandwich 60%, Country 70%, Artisan 75%, Ciabatta 80%, Focaccia 85%)
- Target hydration adjustment with auto-calculated water
- Recipe scaling to target dough weight
- Hydration guide with difficulty levels and bread types
- Detailed sourdough tips

---

## 9. Phase 6: Specialty Pairing Tools

### Tool 6.1: Cheese & Accompaniment Matcher
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 8 hours
**Completed**: January 3, 2026
**Live URL**: /tools/cheese-pairing

#### Features Implemented
- 16 popular cheeses across 6 categories (soft, semi-soft, semi-hard, hard, blue, fresh)
- Comprehensive pairing database for each cheese:
  - Wine recommendations
  - Fruit pairings
  - Nut suggestions
  - Condiments and spreads
  - Bread and cracker options
  - Charcuterie matches
  - Other beverage options
- Cheese information cards with origin, milk type, flavor profile, texture, intensity
- Search and category filtering
- Interactive selection with pairing results
- Cheese board building tips

### Tool 6.2: Beer & Food Pairing Guide
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 6 hours
**Completed**: January 3, 2026
**Live URL**: /tools/beer-pairing

#### Features Implemented
- 14 beer styles across 6 categories (lager, ale, wheat, stout-porter, sour, specialty)
- Comprehensive pairing database for each beer:
  - Best proteins
  - Cuisine matches
  - Recommended dishes
  - Cheese pairings
  - Dessert suggestions
  - Foods to avoid
- Beer info cards with origin, ABV, IBU, color, flavor profile
- Category filtering
- Pairing tips for each beer style
- Beer pairing principles guide

### Tool 6.3: Coffee & Dessert Pairing
**Status**: 🟢 Completed (v1)
**Priority**: P3 - Low
**Estimated Dev Time**: 5 hours
**Completed**: January 3, 2026
**Live URL**: /tools/coffee-pairing

#### Features Implemented
- 13 coffee types across 3 categories (roast level, preparation, origin)
- Comprehensive pairing database for each coffee:
  - Pastries
  - Cakes & breads
  - Cookies
  - Chocolate pairings
  - Fruit matches
  - Other desserts
  - Foods to avoid
- Coffee info cards with roast level, flavor notes, acidity, body
- Category filtering
- Pairing tips for each coffee type
- Coffee pairing principles guide

### Tool 6.4: Herb & Spice Matrix
**Status**: 🟢 Completed (v1)
**Priority**: P2 - Medium
**Estimated Dev Time**: 6 hours
**Completed**: January 3, 2026
**Live URL**: /tools/herb-spice-matrix

#### Features Implemented
- 21 herbs, spices, and blends across 3 categories (herbs, spices, blends)
- Comprehensive information for each item:
  - Flavor profile description
  - Intensity rating (1-5)
  - Cuisine associations
  - Best pairing combinations
  - Foods it pairs well with
- Search and category filtering
- Interactive selection with detailed view panel
- Pairing tips and usage recommendations
- Quick pairing tips section

### Tool 6.5: Chocolate Pairing Guide
**Status**: 🔴 Not Started
**Priority**: P3 - Low
**Estimated Dev Time**: 5 hours

---

## 10. Phase 7: Health & Dietary Tools

### Tool 7.1: Dietary Restriction Meal Finder
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 8 hours

### Tool 7.2: Protein Calculator
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 5 hours

### Tool 7.3: Macro Balance Calculator
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 6 hours

### Tool 7.4: Glycemic Index Pairer
**Status**: 🔴 Not Started
**Priority**: P3 - Low
**Estimated Dev Time**: 6 hours

---

## 11. Phase 8: Interactive Quizzes

### Tool 8.1: "What Wine Are You?" Quiz
**Status**: 🔴 Not Started
**Priority**: P1 - High (viral potential)
**Estimated Dev Time**: 6 hours

### Tool 8.2: "What's Your Cooking Style?" Quiz
**Status**: 🔴 Not Started
**Priority**: P1 - High
**Estimated Dev Time**: 6 hours

### Tool 8.3: "Build Your Cheese Board" Interactive
**Status**: 🔴 Not Started
**Priority**: P1 - High
**Estimated Dev Time**: 10 hours

### Tool 8.4: "What Should I Cook?" Generator
**Status**: 🔴 Not Started
**Priority**: P1 - High
**Estimated Dev Time**: 8 hours

---

## 12. Data Architecture

### Core Data Files

```
src/data/
├── ingredients/
│   ├── flavor-profiles.ts      # 300+ ingredients with aromatic data
│   ├── nutrition-database.ts   # USDA nutrition data
│   └── seasonal-calendar.ts    # Produce seasonality
├── pairings/
│   ├── wine-pairings.ts        # Wine + food rules
│   ├── cheese-pairings.ts      # Cheese + accompaniments
│   ├── beer-pairings.ts        # Beer + food matches
│   └── herb-spice-matrix.ts    # Herb/spice combinations
├── conversions/
│   ├── units.ts                # Measurement conversions
│   ├── temperatures.ts         # Oven temp conversions
│   └── substitutions.ts        # Ingredient substitutes
└── party/
    ├── portion-guidelines.ts   # Per-person food amounts
    └── drink-calculations.ts   # Beverage formulas
```

### Data Sample: Flavor Profiles

```typescript
// src/data/ingredients/flavor-profiles.ts
export const flavorProfiles: FlavorProfile[] = [
  {
    id: 'salmon',
    name: 'Salmon',
    category: 'protein',
    subcategory: 'fish',
    aromaticCompounds: ['2-methylbutanal', 'hexanal', 'nonanal'],
    flavorNotes: ['rich', 'buttery', 'slightly sweet', 'oceanic'],
    bestPairings: ['dill', 'lemon', 'capers', 'cucumber', 'cream cheese'],
    unexpectedPairings: ['mango', 'miso', 'bourbon'],
    cuisineAffinities: ['Nordic', 'Japanese', 'American Northwest'],
    seasonality: 'year-round',
    cookingMethods: ['bake', 'grill', 'smoke', 'raw'],
  },
  // ... 300+ more ingredients
];
```

---

## 13. SEO Strategy

### Target Keywords by Category

| Category | Primary Keywords | Monthly Search Volume |
|----------|-----------------|----------------------|
| Wine Pairing | "wine pairing chart", "what wine with..." | 50,000+ |
| Recipe Scaling | "recipe scaler", "how to double a recipe" | 30,000+ |
| Party Planning | "party food calculator", "how much food for..." | 25,000+ |
| Cooking Conversion | "cups to grams", "cooking converter" | 100,000+ |
| Cheese Board | "cheese board ideas", "cheese pairing" | 40,000+ |

### On-Page SEO Requirements

Each tool page must include:
- Unique title tag with primary keyword
- Meta description with call-to-action
- H1 matching primary keyword
- FAQ schema markup
- HowTo schema for calculators
- Internal links to related tools
- 500+ words of supporting content

---

## 14. Monetization Plan

### Revenue Streams

| Stream | Implementation | Est. Monthly Revenue |
|--------|---------------|---------------------|
| **Display Ads** | Grow.me/Journey sidebar + in-content | $500-2,000 |
| **Wine Affiliates** | Wine.com, Vivino links | $200-500 |
| **Amazon Affiliates** | Kitchen tools, books | $100-300 |
| **Cheese/Food Boxes** | Subscription box affiliates | $100-200 |
| **Recipe E-books** | Generated PDF guides | $50-200 |

### Ad Placement Strategy

```
┌────────────────────────────────────────────────┐
│  Header Ad (728x90)                            │
├────────────────────────────────────────────────┤
│                                                │
│  ┌─────────────────────────┐  ┌─────────────┐ │
│  │                         │  │  Sidebar    │ │
│  │   TOOL INTERFACE        │  │  Ad 300x250 │ │
│  │                         │  │             │ │
│  │                         │  ├─────────────┤ │
│  │                         │  │  Related    │ │
│  └─────────────────────────┘  │  Tools      │ │
│                                └─────────────┘ │
│  ┌─────────────────────────────────────────┐   │
│  │  In-Content Ad (Responsive)             │   │
│  └─────────────────────────────────────────┘   │
│                                                │
│  ┌─────────────────────────────────────────┐   │
│  │  Supporting Content / FAQ               │   │
│  └─────────────────────────────────────────┘   │
│                                                │
└────────────────────────────────────────────────┘
```

---

## Development Status Tracker

### Overall Progress

| Metric | Current | Target |
|--------|---------|--------|
| **Tools Completed** | 29 | 40+ |
| **Live Tools** | 29 | - |
| **In Progress** | 0 | - |

### Phase 1 Progress (Core Pairing Tools)

| Tool | Status | Dev | Test | Deploy |
|------|--------|-----|------|--------|
| Food & Flavor Pairing Finder | 🟢 | ✅ | ✅ | ✅ |
| Wine & Food Pairing Matcher | 🟢 | ✅ | ✅ | ✅ |
| Recipe Scaling Calculator | 🟢 | ✅ | ✅ | ✅ |
| Party Food Calculator | 🟢 | ✅ | ✅ | ✅ |
| Drink/Cocktail Calculator | 🟢 | ✅ | ✅ | ✅ |

### Phase 3 Progress (Party & Event Tools)

| Tool | Status | Dev | Test | Deploy |
|------|--------|-----|------|--------|
| Cheese Board Calculator | 🟢 | ✅ | ✅ | ✅ |
| Wine Bottle Calculator | 🟢 | ✅ | ✅ | ✅ |
| Appetizer Quantity Planner | 🟢 | ✅ | ✅ | ✅ |
| Buffet Menu Planner | 🟢 | ✅ | ✅ | ✅ |
| Potluck Coordinator | 🟢 | ✅ | ✅ | ✅ |

### Phase 4 Progress (Meal Planning Utilities)

| Tool | Status | Dev | Test | Deploy |
|------|--------|-----|------|--------|
| Leftover Recipe Matcher | 🟢 | ✅ | ✅ | ✅ |
| Weekly Meal Prep Calculator | 🟢 | ✅ | ✅ | ✅ |
| Seasonal Ingredient Guide | 🟢 | ✅ | ✅ | ✅ |
| Pantry Pairing Helper | 🟢 | ✅ | ✅ | ✅ |
| Grocery List Generator | 🟢 | ✅ | ✅ | ✅ |

### Phase 5 Progress (Baking Calculators)

| Tool | Status | Dev | Test | Deploy |
|------|--------|-----|------|--------|
| Pan Size Converter | 🟢 | ✅ | ✅ | ✅ |
| Flour Substitution Calculator | 🟢 | ✅ | ✅ | ✅ |
| Sugar Substitution Calculator | 🟢 | ✅ | ✅ | ✅ |
| Yeast Conversion Calculator | 🟢 | ✅ | ✅ | ✅ |
| Sourdough Hydration Calculator | 🟢 | ✅ | ✅ | ✅ |

### Live Tools Summary

| Tool | URL | Category |
|------|-----|----------|
| Flavor Pairing Finder | `/tools/flavor-pairing` | Pairing Tools |
| Wine & Food Pairing | `/tools/wine-pairing` | Pairing Tools |
| Recipe Scaler | `/tools/recipe-scaler` | Kitchen Calculators |
| Wine Bottle Calculator | `/tools/wine-calculator` | Party Planning |
| Potluck Coordinator | `/tools/potluck-coordinator` | Party Planning |
| Party Food Calculator | `/tools/party-calculator` | Party Planning |
| Drink Calculator | `/tools/drink-calculator` | Party Planning |
| Unit Converter | `/tools/unit-converter` | Kitchen Calculators |
| Oven Temperature Converter | `/tools/oven-temperature` | Kitchen Calculators |
| Cooking Time Calculator | `/tools/cooking-time` | Kitchen Calculators |
| Substitution Finder | `/tools/substitution-finder` | Kitchen Calculators |
| Nutrition Calculator | `/tools/nutrition-calculator` | Kitchen Calculators |
| Cheese Board Calculator | `/tools/cheese-board-calculator` | Party Planning |
| Appetizer Planner | `/tools/appetizer-planner` | Party Planning |
| Buffet Menu Planner | `/tools/buffet-planner` | Party Planning |
| Leftover Recipe Matcher | `/tools/leftover-matcher` | Meal Planning |
| Weekly Meal Prep Calculator | `/tools/meal-prep` | Meal Planning |
| Seasonal Ingredient Guide | `/tools/seasonal-guide` | Meal Planning |
| Pantry Pairing Helper | `/tools/pantry-helper` | Meal Planning |
| Grocery List Generator | `/tools/grocery-list` | Meal Planning |
| Pan Size Converter | `/tools/pan-size-converter` | Baking Calculators |
| Yeast Conversion Calculator | `/tools/yeast-converter` | Baking Calculators |
| Sourdough Hydration Calculator | `/tools/sourdough-calculator` | Baking Calculators |
| Flour Substitution Calculator | `/tools/flour-substitution` | Baking Calculators |
| Sugar Substitution Calculator | `/tools/sugar-substitution` | Baking Calculators |
| Cheese & Accompaniment Matcher | `/tools/cheese-pairing` | Specialty Pairing |
| Beer & Food Pairing Guide | `/tools/beer-pairing` | Specialty Pairing |
| Coffee & Dessert Pairing | `/tools/coffee-pairing` | Specialty Pairing |
| Herb & Spice Matrix | `/tools/herb-spice-matrix` | Specialty Pairing |

### Phase 6 Progress (Specialty Pairing Tools)

| Tool | Status | Dev | Test | Deploy |
|------|--------|-----|------|--------|
| Cheese & Accompaniment Matcher | 🟢 | ✅ | ✅ | ✅ |
| Beer & Food Pairing Guide | 🟢 | ✅ | ✅ | ✅ |
| Coffee & Dessert Pairing | 🟢 | ✅ | ✅ | ✅ |
| Herb & Spice Matrix | 🟢 | ✅ | ✅ | ✅ |
| Chocolate Pairing Guide | 🔴 | ⬜ | ⬜ | ⬜ |

### Legend
- 🔴 Not Started
- 🟡 In Progress
- 🟢 Completed (v1)
- ⬜ Pending
- ✅ Complete

---

*This roadmap is a living document. Update status as tools are completed.*
*Last updated: January 3, 2026*
