/**
 * Substitution Finder
 *
 * Find ingredient substitutes for allergies, dietary restrictions, and availability.
 * Features:
 * - 200+ ingredient substitutions
 * - Allergy-aware filters
 * - Ratio calculators
 * - Flavor impact warnings
 * - Baking vs cooking context
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
type Category = 'dairy' | 'eggs' | 'flour' | 'sugar' | 'oil' | 'leavening' | 'spices' | 'protein' | 'misc';
type DietaryTag = 'vegan' | 'dairy-free' | 'gluten-free' | 'nut-free' | 'egg-free' | 'low-sugar' | 'keto';
type Context = 'baking' | 'cooking' | 'both';

interface Substitution {
  id: string;
  name: string;
  ratio: string;
  notes: string;
  dietaryTags: DietaryTag[];
  flavorImpact: 'none' | 'slight' | 'noticeable' | 'significant';
  textureImpact: 'none' | 'slight' | 'noticeable' | 'significant';
  bestFor: string[];
}

interface Ingredient {
  id: string;
  name: string;
  category: Category;
  commonUses: string[];
  substitutions: Substitution[];
  context: Context;
}

// Substitution database
const INGREDIENTS: Ingredient[] = [
  // Dairy
  {
    id: 'butter',
    name: 'Butter',
    category: 'dairy',
    commonUses: ['Baking', 'Sautéing', 'Spreading', 'Sauces'],
    context: 'both',
    substitutions: [
      {
        id: 'butter-coconut-oil',
        name: 'Coconut Oil',
        ratio: '1:1',
        notes: 'Use refined for neutral flavor. Solidifies when cold.',
        dietaryTags: ['vegan', 'dairy-free'],
        flavorImpact: 'slight',
        textureImpact: 'slight',
        bestFor: ['Cookies', 'Pie crusts', 'Sautéing'],
      },
      {
        id: 'butter-olive-oil',
        name: 'Olive Oil',
        ratio: '3/4 cup oil per 1 cup butter',
        notes: 'Best for savory dishes. Use light olive oil for milder flavor.',
        dietaryTags: ['vegan', 'dairy-free'],
        flavorImpact: 'noticeable',
        textureImpact: 'noticeable',
        bestFor: ['Savory baking', 'Sautéing', 'Marinades'],
      },
      {
        id: 'butter-applesauce',
        name: 'Unsweetened Applesauce',
        ratio: '1/2 cup per 1 cup butter',
        notes: 'Reduces fat. Best combined with a little oil for moisture.',
        dietaryTags: ['vegan', 'dairy-free', 'low-sugar'],
        flavorImpact: 'slight',
        textureImpact: 'noticeable',
        bestFor: ['Muffins', 'Quick breads', 'Cakes'],
      },
      {
        id: 'butter-greek-yogurt',
        name: 'Greek Yogurt',
        ratio: '1/2 cup per 1 cup butter',
        notes: 'Adds protein and tang. Best for moist baked goods.',
        dietaryTags: [],
        flavorImpact: 'slight',
        textureImpact: 'slight',
        bestFor: ['Muffins', 'Cakes', 'Pancakes'],
      },
      {
        id: 'butter-vegan-butter',
        name: 'Vegan Butter',
        ratio: '1:1',
        notes: 'Works in most applications. Check brand for baking performance.',
        dietaryTags: ['vegan', 'dairy-free'],
        flavorImpact: 'slight',
        textureImpact: 'none',
        bestFor: ['Any recipe calling for butter'],
      },
    ],
  },
  {
    id: 'milk',
    name: 'Milk',
    category: 'dairy',
    commonUses: ['Baking', 'Sauces', 'Smoothies', 'Cereals'],
    context: 'both',
    substitutions: [
      {
        id: 'milk-oat',
        name: 'Oat Milk',
        ratio: '1:1',
        notes: 'Creamy texture, slightly sweet. Great for baking.',
        dietaryTags: ['vegan', 'dairy-free', 'nut-free'],
        flavorImpact: 'slight',
        textureImpact: 'none',
        bestFor: ['Baking', 'Coffee', 'Smoothies'],
      },
      {
        id: 'milk-almond',
        name: 'Almond Milk',
        ratio: '1:1',
        notes: 'Lighter texture than dairy milk. Unsweetened for cooking.',
        dietaryTags: ['vegan', 'dairy-free'],
        flavorImpact: 'slight',
        textureImpact: 'slight',
        bestFor: ['Smoothies', 'Cereals', 'Light baking'],
      },
      {
        id: 'milk-coconut',
        name: 'Coconut Milk (carton)',
        ratio: '1:1',
        notes: 'Creamy with coconut flavor. Use canned for richer results.',
        dietaryTags: ['vegan', 'dairy-free', 'nut-free'],
        flavorImpact: 'noticeable',
        textureImpact: 'none',
        bestFor: ['Curries', 'Tropical desserts', 'Smoothies'],
      },
      {
        id: 'milk-soy',
        name: 'Soy Milk',
        ratio: '1:1',
        notes: 'Protein-rich, closest to dairy in baking performance.',
        dietaryTags: ['vegan', 'dairy-free', 'nut-free'],
        flavorImpact: 'slight',
        textureImpact: 'none',
        bestFor: ['Baking', 'Savory dishes', 'Custards'],
      },
    ],
  },
  {
    id: 'heavy-cream',
    name: 'Heavy Cream',
    category: 'dairy',
    commonUses: ['Whipping', 'Sauces', 'Soups', 'Desserts'],
    context: 'both',
    substitutions: [
      {
        id: 'cream-coconut',
        name: 'Full-fat Coconut Cream',
        ratio: '1:1',
        notes: 'Refrigerate can, use solid part. Whips well when chilled.',
        dietaryTags: ['vegan', 'dairy-free'],
        flavorImpact: 'noticeable',
        textureImpact: 'slight',
        bestFor: ['Whipped cream', 'Curries', 'Ice cream'],
      },
      {
        id: 'cream-cashew',
        name: 'Cashew Cream',
        ratio: '1:1',
        notes: 'Blend soaked cashews with water. Very creamy.',
        dietaryTags: ['vegan', 'dairy-free'],
        flavorImpact: 'slight',
        textureImpact: 'slight',
        bestFor: ['Sauces', 'Soups', 'Pasta dishes'],
      },
      {
        id: 'cream-silken-tofu',
        name: 'Silken Tofu (blended)',
        ratio: '1:1',
        notes: 'Blend until smooth. Neutral flavor, high protein.',
        dietaryTags: ['vegan', 'dairy-free', 'nut-free'],
        flavorImpact: 'none',
        textureImpact: 'slight',
        bestFor: ['Puddings', 'Smoothies', 'Dips'],
      },
    ],
  },
  // Eggs
  {
    id: 'egg-baking',
    name: 'Eggs (in baking)',
    category: 'eggs',
    commonUses: ['Cakes', 'Cookies', 'Muffins', 'Quick breads'],
    context: 'baking',
    substitutions: [
      {
        id: 'egg-flax',
        name: 'Flax Egg',
        ratio: '1 tbsp ground flax + 3 tbsp water per egg',
        notes: 'Let sit 5 min to gel. Adds fiber, slight nutty flavor.',
        dietaryTags: ['vegan', 'egg-free'],
        flavorImpact: 'slight',
        textureImpact: 'slight',
        bestFor: ['Muffins', 'Pancakes', 'Quick breads'],
      },
      {
        id: 'egg-chia',
        name: 'Chia Egg',
        ratio: '1 tbsp chia seeds + 3 tbsp water per egg',
        notes: 'Let sit 5 min to gel. Similar to flax egg.',
        dietaryTags: ['vegan', 'egg-free'],
        flavorImpact: 'none',
        textureImpact: 'slight',
        bestFor: ['Muffins', 'Cookies', 'Pancakes'],
      },
      {
        id: 'egg-banana',
        name: 'Mashed Banana',
        ratio: '1/4 cup per egg',
        notes: 'Adds sweetness and moisture. Best for sweet recipes.',
        dietaryTags: ['vegan', 'egg-free'],
        flavorImpact: 'noticeable',
        textureImpact: 'slight',
        bestFor: ['Pancakes', 'Muffins', 'Quick breads'],
      },
      {
        id: 'egg-applesauce',
        name: 'Unsweetened Applesauce',
        ratio: '1/4 cup per egg',
        notes: 'Adds moisture, mild sweetness. Good for reducing fat.',
        dietaryTags: ['vegan', 'egg-free'],
        flavorImpact: 'slight',
        textureImpact: 'slight',
        bestFor: ['Cakes', 'Muffins', 'Quick breads'],
      },
      {
        id: 'egg-aquafaba',
        name: 'Aquafaba (chickpea water)',
        ratio: '3 tbsp per egg',
        notes: 'Whips like egg whites! Use liquid from canned chickpeas.',
        dietaryTags: ['vegan', 'egg-free', 'nut-free'],
        flavorImpact: 'none',
        textureImpact: 'none',
        bestFor: ['Meringues', 'Mousse', 'Macarons'],
      },
      {
        id: 'egg-commercial',
        name: 'Commercial Egg Replacer',
        ratio: 'Follow package directions',
        notes: 'Bob\'s Red Mill, JUST Egg, etc. Reliable for most baking.',
        dietaryTags: ['vegan', 'egg-free'],
        flavorImpact: 'none',
        textureImpact: 'none',
        bestFor: ['Cakes', 'Cookies', 'Muffins'],
      },
    ],
  },
  // Flour
  {
    id: 'all-purpose-flour',
    name: 'All-Purpose Flour',
    category: 'flour',
    commonUses: ['Baking', 'Thickening', 'Breading', 'Pasta'],
    context: 'both',
    substitutions: [
      {
        id: 'flour-gf-blend',
        name: 'Gluten-Free 1:1 Flour Blend',
        ratio: '1:1',
        notes: 'Bob\'s Red Mill, King Arthur, etc. Contains xanthan gum.',
        dietaryTags: ['gluten-free'],
        flavorImpact: 'slight',
        textureImpact: 'slight',
        bestFor: ['Most baking applications'],
      },
      {
        id: 'flour-almond',
        name: 'Almond Flour',
        ratio: '1 cup almond = 1 cup AP flour (add 1/4 tsp xanthan)',
        notes: 'Dense, moist, nutty. Doesn\'t rise like wheat flour.',
        dietaryTags: ['gluten-free', 'keto'],
        flavorImpact: 'noticeable',
        textureImpact: 'significant',
        bestFor: ['Cookies', 'Cakes', 'Macarons'],
      },
      {
        id: 'flour-oat',
        name: 'Oat Flour',
        ratio: '1 1/3 cup oat = 1 cup AP flour',
        notes: 'Make by blending oats. Denser texture, slightly sweet.',
        dietaryTags: ['gluten-free'],
        flavorImpact: 'slight',
        textureImpact: 'noticeable',
        bestFor: ['Pancakes', 'Muffins', 'Cookies'],
      },
      {
        id: 'flour-coconut',
        name: 'Coconut Flour',
        ratio: '1/4 cup coconut = 1 cup AP flour (add extra eggs/liquid)',
        notes: 'Very absorbent! Requires more liquid and eggs.',
        dietaryTags: ['gluten-free', 'nut-free', 'keto'],
        flavorImpact: 'noticeable',
        textureImpact: 'significant',
        bestFor: ['Pancakes', 'Some cakes', 'Coating'],
      },
    ],
  },
  // Sugar
  {
    id: 'white-sugar',
    name: 'White Sugar',
    category: 'sugar',
    commonUses: ['Baking', 'Sweetening', 'Caramelizing'],
    context: 'both',
    substitutions: [
      {
        id: 'sugar-coconut',
        name: 'Coconut Sugar',
        ratio: '1:1',
        notes: 'Lower glycemic index. Darker color, caramel flavor.',
        dietaryTags: ['vegan'],
        flavorImpact: 'noticeable',
        textureImpact: 'slight',
        bestFor: ['Cookies', 'Sauces', 'Marinades'],
      },
      {
        id: 'sugar-honey',
        name: 'Honey',
        ratio: '3/4 cup honey = 1 cup sugar (reduce other liquids)',
        notes: 'Reduce oven temp by 25°F. Adds moisture and browns faster.',
        dietaryTags: [],
        flavorImpact: 'noticeable',
        textureImpact: 'slight',
        bestFor: ['Cakes', 'Dressings', 'Marinades'],
      },
      {
        id: 'sugar-maple',
        name: 'Maple Syrup',
        ratio: '3/4 cup maple = 1 cup sugar (reduce liquids by 3 tbsp)',
        notes: 'Distinct maple flavor. Works well in fall-themed baking.',
        dietaryTags: ['vegan'],
        flavorImpact: 'noticeable',
        textureImpact: 'slight',
        bestFor: ['Pancakes', 'Muffins', 'Glazes'],
      },
      {
        id: 'sugar-stevia',
        name: 'Stevia/Monk Fruit',
        ratio: 'Follow package (much sweeter than sugar)',
        notes: 'Zero calories. May have aftertaste. Not for caramelizing.',
        dietaryTags: ['keto', 'low-sugar'],
        flavorImpact: 'slight',
        textureImpact: 'noticeable',
        bestFor: ['Beverages', 'Light sweetening'],
      },
    ],
  },
  // Leavening
  {
    id: 'baking-powder',
    name: 'Baking Powder',
    category: 'leavening',
    commonUses: ['Cakes', 'Muffins', 'Quick breads', 'Pancakes'],
    context: 'baking',
    substitutions: [
      {
        id: 'bp-homemade',
        name: 'Baking Soda + Cream of Tartar',
        ratio: '1/4 tsp baking soda + 1/2 tsp cream of tartar = 1 tsp BP',
        notes: 'Mix fresh for each use. Use immediately.',
        dietaryTags: ['gluten-free', 'vegan'],
        flavorImpact: 'none',
        textureImpact: 'none',
        bestFor: ['Any baking powder recipe'],
      },
      {
        id: 'bp-buttermilk',
        name: 'Buttermilk + Baking Soda',
        ratio: '1/2 cup buttermilk + 1/4 tsp baking soda = 1 tsp BP',
        notes: 'Reduce other liquids. Adds tangy flavor.',
        dietaryTags: [],
        flavorImpact: 'slight',
        textureImpact: 'none',
        bestFor: ['Pancakes', 'Biscuits'],
      },
    ],
  },
  {
    id: 'baking-soda',
    name: 'Baking Soda',
    category: 'leavening',
    commonUses: ['Cookies', 'Quick breads', 'Cakes with acidic ingredients'],
    context: 'baking',
    substitutions: [
      {
        id: 'bs-bp',
        name: 'Baking Powder',
        ratio: '3 tsp baking powder = 1 tsp baking soda',
        notes: 'Results may be slightly different. Less browning.',
        dietaryTags: ['gluten-free', 'vegan'],
        flavorImpact: 'none',
        textureImpact: 'slight',
        bestFor: ['When you\'re out of baking soda'],
      },
    ],
  },
  // Oils
  {
    id: 'vegetable-oil',
    name: 'Vegetable Oil',
    category: 'oil',
    commonUses: ['Baking', 'Frying', 'Dressings'],
    context: 'both',
    substitutions: [
      {
        id: 'oil-applesauce',
        name: 'Unsweetened Applesauce',
        ratio: '1:1',
        notes: 'Great for reducing fat in baking. Adds moisture.',
        dietaryTags: ['vegan'],
        flavorImpact: 'slight',
        textureImpact: 'slight',
        bestFor: ['Muffins', 'Cakes', 'Quick breads'],
      },
      {
        id: 'oil-avocado',
        name: 'Avocado Oil',
        ratio: '1:1',
        notes: 'Neutral flavor, high smoke point. Great for frying.',
        dietaryTags: ['vegan', 'keto'],
        flavorImpact: 'none',
        textureImpact: 'none',
        bestFor: ['High-heat cooking', 'Baking', 'Dressings'],
      },
      {
        id: 'oil-coconut',
        name: 'Melted Coconut Oil',
        ratio: '1:1',
        notes: 'Use refined for neutral flavor. Solidifies when cold.',
        dietaryTags: ['vegan', 'keto'],
        flavorImpact: 'slight',
        textureImpact: 'slight',
        bestFor: ['Baking', 'Sautéing'],
      },
    ],
  },
  // Misc
  {
    id: 'sour-cream',
    name: 'Sour Cream',
    category: 'dairy',
    commonUses: ['Dips', 'Baking', 'Toppings', 'Sauces'],
    context: 'both',
    substitutions: [
      {
        id: 'sc-greek-yogurt',
        name: 'Plain Greek Yogurt',
        ratio: '1:1',
        notes: 'Slightly tangier. Higher protein.',
        dietaryTags: [],
        flavorImpact: 'slight',
        textureImpact: 'none',
        bestFor: ['Dips', 'Baking', 'Toppings'],
      },
      {
        id: 'sc-cashew',
        name: 'Cashew Sour Cream',
        ratio: '1:1',
        notes: 'Blend soaked cashews with lemon juice and salt.',
        dietaryTags: ['vegan', 'dairy-free'],
        flavorImpact: 'slight',
        textureImpact: 'slight',
        bestFor: ['Dips', 'Tacos', 'Baked potatoes'],
      },
      {
        id: 'sc-coconut-cream',
        name: 'Coconut Cream + Lemon',
        ratio: '1 cup coconut cream + 1 tbsp lemon juice',
        notes: 'Slight coconut flavor. Let sit to thicken.',
        dietaryTags: ['vegan', 'dairy-free', 'nut-free'],
        flavorImpact: 'noticeable',
        textureImpact: 'slight',
        bestFor: ['Desserts', 'Tropical dishes'],
      },
    ],
  },
  {
    id: 'buttermilk',
    name: 'Buttermilk',
    category: 'dairy',
    commonUses: ['Baking', 'Marinades', 'Pancakes', 'Fried chicken'],
    context: 'both',
    substitutions: [
      {
        id: 'bm-milk-vinegar',
        name: 'Milk + Vinegar/Lemon',
        ratio: '1 cup milk + 1 tbsp vinegar or lemon juice',
        notes: 'Let sit 5-10 min to curdle. Works great!',
        dietaryTags: [],
        flavorImpact: 'none',
        textureImpact: 'none',
        bestFor: ['Any buttermilk recipe'],
      },
      {
        id: 'bm-yogurt',
        name: 'Yogurt + Milk',
        ratio: '3/4 cup yogurt + 1/4 cup milk',
        notes: 'Thin to buttermilk consistency.',
        dietaryTags: [],
        flavorImpact: 'none',
        textureImpact: 'none',
        bestFor: ['Baking', 'Dressings'],
      },
      {
        id: 'bm-vegan',
        name: 'Non-dairy Milk + Vinegar',
        ratio: '1 cup non-dairy milk + 1 tbsp vinegar',
        notes: 'Use soy or oat milk for best results.',
        dietaryTags: ['vegan', 'dairy-free'],
        flavorImpact: 'slight',
        textureImpact: 'slight',
        bestFor: ['Vegan baking'],
      },
    ],
  },
];

// All dietary tags for filtering
const ALL_DIETARY_TAGS: { id: DietaryTag; label: string; icon: string }[] = [
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'nut-free', label: 'Nut-Free', icon: '🥜' },
  { id: 'egg-free', label: 'Egg-Free', icon: '🥚' },
  { id: 'low-sugar', label: 'Low Sugar', icon: '🍬' },
  { id: 'keto', label: 'Keto', icon: '🥑' },
];

// Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const SwapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 3 21 8 16 13"/>
    <path d="M21 8H9"/>
    <path d="M8 21 3 16 8 11"/>
    <path d="M3 16h12"/>
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4"/>
    <path d="M12 17h.01"/>
  </svg>
);

export default function SubstitutionFinder() {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [dietaryFilters, setDietaryFilters] = useState<DietaryTag[]>([]);

  // Filter ingredients by search
  const filteredIngredients = useMemo(() => {
    if (!searchQuery.trim()) return INGREDIENTS;
    const query = searchQuery.toLowerCase();
    return INGREDIENTS.filter(ing =>
      ing.name.toLowerCase().includes(query) ||
      ing.commonUses.some(use => use.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Filter substitutions by dietary preferences
  const filteredSubstitutions = useMemo(() => {
    if (!selectedIngredient) return [];
    if (dietaryFilters.length === 0) return selectedIngredient.substitutions;

    return selectedIngredient.substitutions.filter(sub =>
      dietaryFilters.every(filter => sub.dietaryTags.includes(filter))
    );
  }, [selectedIngredient, dietaryFilters]);

  // Toggle dietary filter
  const toggleDietaryFilter = (tag: DietaryTag) => {
    setDietaryFilters(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Get impact color
  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'none': return 'bg-green-100 text-green-700';
      case 'slight': return 'bg-yellow-100 text-yellow-700';
      case 'noticeable': return 'bg-orange-100 text-orange-700';
      case 'significant': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Section */}
      <div className="card bg-white p-6 md:p-8 mb-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-3xl text-[var(--color-wine)]">
            <SwapIcon />
          </span>
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            Ingredient Substitution Finder
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-muted)]">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIngredient(null);
            }}
            placeholder="Search for an ingredient (butter, eggs, flour...)"
            className="w-full pl-12 pr-4 py-4 border border-[var(--color-cream-dark)] rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)] focus:border-transparent"
          />
        </div>

        {/* Dietary Filters */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
            Filter by dietary needs:
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_DIETARY_TAGS.map(tag => (
              <button
                key={tag.id}
                onClick={() => toggleDietaryFilter(tag.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1",
                  dietaryFilters.includes(tag.id)
                    ? "bg-[var(--color-wine)] text-white"
                    : "bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]"
                )}
              >
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ingredient Selection */}
        {!selectedIngredient && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredIngredients.map(ing => (
              <button
                key={ing.id}
                onClick={() => setSelectedIngredient(ing)}
                className="p-4 bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] rounded-lg text-left transition-all"
              >
                <div className="font-semibold text-[var(--text-primary)]">{ing.name}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  {ing.substitutions.length} substitutes
                </div>
              </button>
            ))}
            {filteredIngredients.length === 0 && (
              <div className="col-span-full text-center py-8 text-[var(--text-muted)]">
                No ingredients found. Try a different search term.
              </div>
            )}
          </div>
        )}

        {/* Selected Ingredient */}
        {selectedIngredient && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-xl font-semibold text-[var(--color-wine)]">
                  {selectedIngredient.name}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Common uses: {selectedIngredient.commonUses.join(', ')}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedIngredient(null);
                  setSearchQuery('');
                }}
                className="text-sm text-[var(--color-wine)] hover:underline"
              >
                ← Back to search
              </button>
            </div>

            {/* Substitutions */}
            <div className="space-y-4">
              {filteredSubstitutions.map(sub => (
                <div
                  key={sub.id}
                  className="border border-[var(--color-cream-dark)] rounded-xl p-5 hover:border-[var(--color-wine)] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-[var(--text-primary)] text-lg">
                        {sub.name}
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {sub.dietaryTags.map(tag => {
                          const tagInfo = ALL_DIETARY_TAGS.find(t => t.id === tag);
                          return (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full"
                            >
                              {tagInfo?.icon} {tagInfo?.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-semibold text-[var(--color-wine)] bg-[var(--color-wine-glow)] px-3 py-1 rounded">
                        {sub.ratio}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] mb-3">
                    {sub.notes}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-[var(--text-muted)]">Flavor impact:</span>
                      <span className={cn("px-2 py-0.5 rounded", getImpactColor(sub.flavorImpact))}>
                        {sub.flavorImpact}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[var(--text-muted)]">Texture impact:</span>
                      <span className={cn("px-2 py-0.5 rounded", getImpactColor(sub.textureImpact))}>
                        {sub.textureImpact}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[var(--color-cream)]">
                    <span className="text-xs text-[var(--text-muted)]">Best for: </span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {sub.bestFor.join(', ')}
                    </span>
                  </div>
                </div>
              ))}

              {filteredSubstitutions.length === 0 && (
                <div className="text-center py-8 bg-amber-50 rounded-xl">
                  <AlertIcon />
                  <p className="text-amber-700 mt-2">
                    No substitutes match your dietary filters.
                  </p>
                  <button
                    onClick={() => setDietaryFilters([])}
                    className="text-sm text-[var(--color-wine)] hover:underline mt-2"
                  >
                    Clear filters to see all options
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Baking Substitution Tips
          </h3>
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Don't substitute more than 2 ingredients at once in a recipe</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Liquid sweeteners require reducing other liquids</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Gluten-free flours often need extra binding (xanthan gum)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Test substitutions in a small batch first</span>
            </li>
          </ul>
        </div>

        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Cooking Substitution Tips
          </h3>
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Oil substitutes work better in cooking than baking</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>For thickening: cornstarch, arrowroot, or potato starch</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Acid balance matters (vinegar, citrus, tomato)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Taste as you go and adjust seasonings</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
