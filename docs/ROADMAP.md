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
**Status**: 🔴 Not Started
**Priority**: P0 - Critical
**Estimated Dev Time**: 6 hours

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
**Status**: 🔴 Not Started
**Priority**: P1 - High
**Estimated Dev Time**: 5 hours

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
**Status**: 🔴 Not Started
**Priority**: P1 - High
**Estimated Dev Time**: 10 hours

#### Description
Paste recipe ingredients, get complete nutritional breakdown.

#### Technical Specification
```typescript
interface NutritionInput {
  ingredients: string; // Free text or structured
  servings: number;
}

interface NutritionResult {
  perServing: NutritionFacts;
  total: NutritionFacts;
  ingredientBreakdown: Array<{
    ingredient: string;
    parsed: {
      amount: number;
      unit: string;
      food: string;
    };
    nutrition: NutritionFacts;
  }>;
  dietaryLabels: string[]; // "Low-Carb", "High-Protein", etc.
}

interface NutritionFacts {
  calories: number;
  fat: { total: number; saturated: number; trans: number };
  cholesterol: number;
  sodium: number;
  carbohydrates: { total: number; fiber: number; sugar: number };
  protein: number;
  vitamins: Record<string, number>; // % daily value
}
```

---

### Tool 2.3: Oven Temperature Converter
**Status**: 🔴 Not Started
**Priority**: P1 - High
**Estimated Dev Time**: 3 hours

#### Features
- Fahrenheit ↔ Celsius ↔ Gas Mark
- Convection/fan oven adjustment
- Altitude adjustment calculator
- Common temperature reference chart

---

### Tool 2.4: Cooking Time Calculator
**Status**: 🔴 Not Started
**Priority**: P1 - High
**Estimated Dev Time**: 6 hours

#### Features
- Meat type selector (beef, pork, poultry, fish)
- Weight input
- Desired doneness
- Cooking method (oven, grill, smoke)
- Rest time recommendations
- Internal temperature targets (USDA safe temps)

---

### Tool 2.5: Substitution Finder
**Status**: 🔴 Not Started
**Priority**: P1 - High
**Estimated Dev Time**: 8 hours

#### Features
- 200+ ingredient substitutions
- Allergy-aware filters
- Ratio calculators (butter→oil, eggs→alternatives)
- Flavor impact warnings
- Baking vs cooking context

---

## 6. Phase 3: Party & Event Tools

### Tool 3.1: Cheese Board Calculator
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 6 hours

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
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 4 hours

### Tool 3.4: Buffet Menu Planner
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 6 hours

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
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 10 hours

### Tool 4.2: Weekly Meal Prep Calculator
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 8 hours

### Tool 4.3: Seasonal Ingredient Guide
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 6 hours

### Tool 4.4: Pantry Pairing Helper
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 8 hours

### Tool 4.5: Grocery List Generator
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 6 hours

---

## 8. Phase 5: Baking Calculators

### Tool 5.1: Pan Size Converter
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 5 hours

### Tool 5.2: Flour Substitution Calculator
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 4 hours

### Tool 5.3: Sugar Substitution Calculator
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 4 hours

### Tool 5.4: Yeast Conversion Calculator
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 3 hours

### Tool 5.5: Sourdough Hydration Calculator
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 4 hours

---

## 9. Phase 6: Specialty Pairing Tools

### Tool 6.1: Cheese & Accompaniment Matcher
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 8 hours

### Tool 6.2: Beer & Food Pairing Guide
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 6 hours

### Tool 6.3: Coffee & Dessert Pairing
**Status**: 🔴 Not Started
**Priority**: P3 - Low
**Estimated Dev Time**: 5 hours

### Tool 6.4: Herb & Spice Matrix
**Status**: 🔴 Not Started
**Priority**: P2 - Medium
**Estimated Dev Time**: 6 hours

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
| **Tools Completed** | 6 | 40+ |
| **Live Tools** | 6 | - |
| **In Progress** | 0 | - |

### Phase 1 Progress (Core Pairing Tools)

| Tool | Status | Dev | Test | Deploy |
|------|--------|-----|------|--------|
| Food & Flavor Pairing Finder | 🟢 | ✅ | ✅ | ✅ |
| Wine & Food Pairing Matcher | 🟢 | ✅ | ✅ | ✅ |
| Recipe Scaling Calculator | 🟢 | ✅ | ✅ | ✅ |
| Party Food Calculator | 🟢 | ✅ | ✅ | ✅ |
| Drink/Cocktail Calculator | 🔴 | ⬜ | ⬜ | ⬜ |

### Phase 3 Progress (Party & Event Tools)

| Tool | Status | Dev | Test | Deploy |
|------|--------|-----|------|--------|
| Cheese Board Calculator | 🔴 | ⬜ | ⬜ | ⬜ |
| Wine Bottle Calculator | 🟢 | ✅ | ✅ | ✅ |
| Appetizer Quantity Planner | 🔴 | ⬜ | ⬜ | ⬜ |
| Buffet Menu Planner | 🔴 | ⬜ | ⬜ | ⬜ |
| Potluck Coordinator | 🟢 | ✅ | ✅ | ✅ |

### Live Tools Summary

| Tool | URL | Category |
|------|-----|----------|
| Flavor Pairing Finder | `/tools/flavor-pairing` | Pairing Tools |
| Wine & Food Pairing | `/tools/wine-pairing` | Pairing Tools |
| Recipe Scaler | `/tools/recipe-scaler` | Kitchen Calculators |
| Wine Bottle Calculator | `/tools/wine-calculator` | Party Planning |
| Potluck Coordinator | `/tools/potluck-coordinator` | Party Planning |
| Party Food Calculator | `/tools/party-calculator` | Party Planning |

### Legend
- 🔴 Not Started
- 🟡 In Progress
- 🟢 Completed (v1)
- ⬜ Pending
- ✅ Complete

---

*This roadmap is a living document. Update status as tools are completed.*
*Last updated: January 3, 2026*
