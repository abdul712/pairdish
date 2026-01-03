/**
 * Pantry Pairing Helper
 *
 * Build meals from common pantry staples.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
type PantryCategory = 'grain' | 'protein' | 'canned' | 'sauce' | 'spice' | 'oil' | 'baking';

interface PantryItem {
  id: string;
  name: string;
  category: PantryCategory;
  shelfLife: string;
  versatility: 'essential' | 'versatile' | 'specialty';
  pairsWellWith: string[];
  quickMeals: string[];
  tips: string;
}

interface MealIdea {
  id: string;
  name: string;
  requiredPantry: string[];
  optionalFresh: string[];
  description: string;
  prepTime: string;
  cuisine: string;
}

// Pantry items database
const pantryItems: PantryItem[] = [
  // Grains
  {
    id: 'rice',
    name: 'Rice (White/Brown)',
    category: 'grain',
    shelfLife: '1-2 years',
    versatility: 'essential',
    pairsWellWith: ['soy sauce', 'beans', 'vegetables', 'eggs', 'garlic', 'chicken broth'],
    quickMeals: ['Fried rice', 'Rice and beans', 'Rice bowls', 'Stuffed peppers', 'Congee'],
    tips: 'Toast dry rice before adding water for nuttier flavor. Brown rice has more fiber but takes longer to cook.',
  },
  {
    id: 'pasta',
    name: 'Pasta',
    category: 'grain',
    shelfLife: '2 years',
    versatility: 'essential',
    pairsWellWith: ['olive oil', 'tomatoes', 'garlic', 'parmesan', 'butter', 'cream'],
    quickMeals: ['Aglio e olio', 'Pasta primavera', 'Mac and cheese', 'Pasta salad', 'Carbonara'],
    tips: 'Save pasta water—the starch helps sauces cling. Different shapes suit different sauces.',
  },
  {
    id: 'oats',
    name: 'Oats (Rolled)',
    category: 'grain',
    shelfLife: '1-2 years',
    versatility: 'versatile',
    pairsWellWith: ['honey', 'cinnamon', 'banana', 'milk', 'peanut butter', 'berries'],
    quickMeals: ['Oatmeal', 'Overnight oats', 'Granola', 'Energy balls', 'Oat pancakes'],
    tips: 'Steel cut, rolled, and instant all work differently. Blend into flour for baking.',
  },
  {
    id: 'quinoa',
    name: 'Quinoa',
    category: 'grain',
    shelfLife: '2-3 years',
    versatility: 'versatile',
    pairsWellWith: ['lemon', 'olive oil', 'vegetables', 'feta', 'herbs', 'beans'],
    quickMeals: ['Quinoa salad', 'Quinoa bowl', 'Stuffed vegetables', 'Breakfast quinoa'],
    tips: 'Rinse before cooking to remove bitter coating. Fluffy when cooked correctly—1:2 ratio.',
  },
  {
    id: 'flour',
    name: 'All-Purpose Flour',
    category: 'grain',
    shelfLife: '6-8 months',
    versatility: 'essential',
    pairsWellWith: ['butter', 'sugar', 'eggs', 'milk', 'yeast', 'baking powder'],
    quickMeals: ['Pancakes', 'Pizza dough', 'Bread', 'Cookies', 'Roux for sauces'],
    tips: 'Store in airtight container. Measure by weight for accurate baking. Whole wheat adds nutrition.',
  },

  // Proteins
  {
    id: 'canned-beans',
    name: 'Canned Beans',
    category: 'protein',
    shelfLife: '2-5 years',
    versatility: 'essential',
    pairsWellWith: ['garlic', 'cumin', 'tomatoes', 'rice', 'onions', 'cilantro'],
    quickMeals: ['Bean soup', 'Tacos', 'Rice and beans', 'Bean salad', 'Hummus'],
    tips: 'Rinse to reduce sodium. Black, pinto, chickpeas, and white beans are most versatile.',
  },
  {
    id: 'canned-tuna',
    name: 'Canned Tuna',
    category: 'protein',
    shelfLife: '3-5 years',
    versatility: 'versatile',
    pairsWellWith: ['mayo', 'lemon', 'olive oil', 'pasta', 'crackers', 'capers'],
    quickMeals: ['Tuna salad', 'Tuna pasta', 'Tuna melt', 'Niçoise salad', 'Tuna patties'],
    tips: 'Water-packed is leaner; oil-packed has more flavor. Albacore is milder than skipjack.',
  },
  {
    id: 'dried-lentils',
    name: 'Lentils (Dried)',
    category: 'protein',
    shelfLife: '1-2 years',
    versatility: 'versatile',
    pairsWellWith: ['onion', 'garlic', 'cumin', 'tomatoes', 'carrots', 'bay leaves'],
    quickMeals: ['Lentil soup', 'Dal', 'Lentil salad', 'Lentil tacos', 'Lentil curry'],
    tips: 'Red lentils cook fastest (15 min) and get mushy—great for dal. Green/brown hold shape.',
  },
  {
    id: 'eggs',
    name: 'Eggs',
    category: 'protein',
    shelfLife: '3-5 weeks',
    versatility: 'essential',
    pairsWellWith: ['butter', 'cheese', 'bacon', 'vegetables', 'bread', 'soy sauce'],
    quickMeals: ['Scrambled eggs', 'Omelette', 'Fried rice', 'Shakshuka', 'Egg sandwich'],
    tips: 'Room temp eggs incorporate better in baking. Test freshness: fresh eggs sink in water.',
  },
  {
    id: 'peanut-butter',
    name: 'Peanut Butter',
    category: 'protein',
    shelfLife: '3-4 months',
    versatility: 'versatile',
    pairsWellWith: ['jelly', 'banana', 'chocolate', 'oats', 'honey', 'soy sauce'],
    quickMeals: ['PB&J', 'Smoothies', 'Peanut noodles', 'Energy balls', 'Satay sauce'],
    tips: 'Natural separates—stir and refrigerate. Use in savory Asian-inspired sauces.',
  },

  // Canned Goods
  {
    id: 'canned-tomatoes',
    name: 'Canned Tomatoes',
    category: 'canned',
    shelfLife: '2 years',
    versatility: 'essential',
    pairsWellWith: ['garlic', 'basil', 'olive oil', 'onion', 'oregano', 'red pepper'],
    quickMeals: ['Marinara sauce', 'Shakshuka', 'Soup', 'Stewed dishes', 'Chili'],
    tips: 'San Marzano are premium. Crushed for rustic, pureed for smooth sauces.',
  },
  {
    id: 'chicken-broth',
    name: 'Chicken/Vegetable Broth',
    category: 'canned',
    shelfLife: '2-3 years',
    versatility: 'essential',
    pairsWellWith: ['rice', 'noodles', 'vegetables', 'beans', 'garlic', 'herbs'],
    quickMeals: ['Soup', 'Rice pilaf', 'Risotto', 'Gravy', 'Braising liquid'],
    tips: 'Low-sodium gives more control. Better Than Bouillon is concentrated and convenient.',
  },
  {
    id: 'coconut-milk',
    name: 'Coconut Milk',
    category: 'canned',
    shelfLife: '2-3 years',
    versatility: 'versatile',
    pairsWellWith: ['curry', 'ginger', 'lime', 'rice', 'fish', 'brown sugar'],
    quickMeals: ['Curry', 'Coconut rice', 'Smoothies', 'Thai soup', 'Dairy-free desserts'],
    tips: 'Full-fat for cooking, lite for drinking. Shake or stir before using.',
  },

  // Sauces & Condiments
  {
    id: 'soy-sauce',
    name: 'Soy Sauce',
    category: 'sauce',
    shelfLife: '2-3 years',
    versatility: 'essential',
    pairsWellWith: ['ginger', 'garlic', 'rice', 'sesame', 'honey', 'scallions'],
    quickMeals: ['Stir fry', 'Fried rice', 'Marinades', 'Ramen', 'Dipping sauce'],
    tips: 'Low-sodium for control. Dark soy adds color; light soy adds flavor. Tamari is gluten-free.',
  },
  {
    id: 'olive-oil',
    name: 'Olive Oil',
    category: 'oil',
    shelfLife: '18-24 months',
    versatility: 'essential',
    pairsWellWith: ['garlic', 'lemon', 'herbs', 'bread', 'pasta', 'vegetables'],
    quickMeals: ['Salad dressing', 'Pasta', 'Roasted vegetables', 'Bruschetta', 'Marinades'],
    tips: 'Extra virgin for finishing, regular for cooking. Store away from heat and light.',
  },
  {
    id: 'vinegar',
    name: 'Vinegar (Various)',
    category: 'sauce',
    shelfLife: 'Indefinite',
    versatility: 'essential',
    pairsWellWith: ['oil', 'sugar', 'mustard', 'herbs', 'garlic', 'honey'],
    quickMeals: ['Salad dressing', 'Pickling', 'Marinades', 'Pan sauces', 'Shrubs'],
    tips: 'Balsamic for salads, rice vinegar for Asian, apple cider for all-purpose. Never expires.',
  },
  {
    id: 'hot-sauce',
    name: 'Hot Sauce',
    category: 'sauce',
    shelfLife: '2-3 years',
    versatility: 'versatile',
    pairsWellWith: ['eggs', 'tacos', 'pizza', 'soup', 'wings', 'rice'],
    quickMeals: ['Buffalo anything', 'Spicy mayo', 'Egg dishes', 'Tacos', 'Soup boost'],
    tips: 'Sriracha, Frank\'s, and Cholula each have distinct flavors. Mix with mayo for quick aioli.',
  },
  {
    id: 'honey',
    name: 'Honey',
    category: 'sauce',
    shelfLife: 'Indefinite',
    versatility: 'versatile',
    pairsWellWith: ['lemon', 'ginger', 'mustard', 'soy sauce', 'cheese', 'oats'],
    quickMeals: ['Honey mustard', 'Tea', 'Oatmeal', 'Baking', 'Marinades'],
    tips: 'Never expires. If crystallized, warm gently to liquify. Raw honey has more health benefits.',
  },

  // Spices
  {
    id: 'salt',
    name: 'Salt (Kosher/Sea)',
    category: 'spice',
    shelfLife: 'Indefinite',
    versatility: 'essential',
    pairsWellWith: ['everything'],
    quickMeals: ['All cooking', 'Baking', 'Seasoning', 'Brining'],
    tips: 'Kosher salt is easier to pinch. Table salt is finer—use less. Finish with flaky sea salt.',
  },
  {
    id: 'black-pepper',
    name: 'Black Pepper',
    category: 'spice',
    shelfLife: '3-4 years',
    versatility: 'essential',
    pairsWellWith: ['salt', 'eggs', 'pasta', 'steak', 'cream sauces', 'vegetables'],
    quickMeals: ['Cacio e pepe', 'Seasoning', 'Salads', 'Marinades'],
    tips: 'Pre-ground loses flavor fast. Invest in a pepper mill—worth it.',
  },
  {
    id: 'garlic-powder',
    name: 'Garlic Powder',
    category: 'spice',
    shelfLife: '2-3 years',
    versatility: 'essential',
    pairsWellWith: ['onion powder', 'paprika', 'italian herbs', 'meat', 'vegetables'],
    quickMeals: ['Seasoning blends', 'Roasted vegetables', 'Marinades', 'Garlic bread'],
    tips: 'Not a replacement for fresh, but great for dry rubs. Granulated has better texture.',
  },
  {
    id: 'cumin',
    name: 'Cumin',
    category: 'spice',
    shelfLife: '3-4 years',
    versatility: 'versatile',
    pairsWellWith: ['chili', 'beans', 'lime', 'coriander', 'lamb', 'chickpeas'],
    quickMeals: ['Tacos', 'Chili', 'Hummus', 'Curry', 'Middle Eastern dishes'],
    tips: 'Toast whole seeds before grinding for deeper flavor. Essential for Mexican and Indian.',
  },
  {
    id: 'paprika',
    name: 'Paprika (Sweet/Smoked)',
    category: 'spice',
    shelfLife: '2-3 years',
    versatility: 'versatile',
    pairsWellWith: ['garlic', 'onion', 'chicken', 'eggs', 'potatoes', 'beans'],
    quickMeals: ['Seasoning', 'Deviled eggs', 'Hungarian dishes', 'BBQ rubs', 'Paella'],
    tips: 'Smoked paprika (pimentón) adds depth without actual smoke. Sweet is most versatile.',
  },
  {
    id: 'cinnamon',
    name: 'Cinnamon',
    category: 'spice',
    shelfLife: '2-3 years',
    versatility: 'versatile',
    pairsWellWith: ['sugar', 'apples', 'oats', 'coffee', 'chocolate', 'nutmeg'],
    quickMeals: ['Oatmeal', 'Baked goods', 'Coffee', 'Apple desserts', 'Moroccan dishes'],
    tips: 'Ceylon is more delicate; Cassia is stronger. Also works in savory dishes—try in chili.',
  },
  {
    id: 'italian-seasoning',
    name: 'Italian Seasoning',
    category: 'spice',
    shelfLife: '2-3 years',
    versatility: 'versatile',
    pairsWellWith: ['tomatoes', 'olive oil', 'garlic', 'pasta', 'bread', 'cheese'],
    quickMeals: ['Pasta sauce', 'Pizza', 'Roasted vegetables', 'Marinades', 'Bread dipping oil'],
    tips: 'Blend of oregano, basil, thyme, rosemary. Make your own for freshest flavor.',
  },

  // Baking
  {
    id: 'baking-powder',
    name: 'Baking Powder',
    category: 'baking',
    shelfLife: '6-12 months',
    versatility: 'essential',
    pairsWellWith: ['flour', 'sugar', 'eggs', 'milk', 'butter'],
    quickMeals: ['Pancakes', 'Muffins', 'Quick breads', 'Biscuits', 'Cakes'],
    tips: 'Test freshness: add to hot water—should bubble vigorously. Double-acting is most common.',
  },
  {
    id: 'sugar',
    name: 'Sugar (White/Brown)',
    category: 'baking',
    shelfLife: 'Indefinite',
    versatility: 'essential',
    pairsWellWith: ['butter', 'flour', 'eggs', 'cinnamon', 'vanilla', 'chocolate'],
    quickMeals: ['Baked goods', 'Caramel', 'Sweetening', 'Marinades', 'Coffee'],
    tips: 'Brown sugar adds moisture and molasses flavor. Pack it when measuring.',
  },
  {
    id: 'vanilla',
    name: 'Vanilla Extract',
    category: 'baking',
    shelfLife: 'Indefinite',
    versatility: 'versatile',
    pairsWellWith: ['sugar', 'chocolate', 'cream', 'butter', 'fruits', 'coffee'],
    quickMeals: ['Baked goods', 'Whipped cream', 'Ice cream', 'Smoothies', 'Oatmeal'],
    tips: 'Pure extract is worth the price over imitation. Vanilla paste has visible seeds.',
  },
];

// Meal ideas based on pantry combinations
const mealIdeas: MealIdea[] = [
  {
    id: 'pasta-aglio-olio',
    name: 'Pasta Aglio e Olio',
    requiredPantry: ['pasta', 'olive-oil', 'garlic-powder'],
    optionalFresh: ['fresh garlic', 'parsley', 'parmesan', 'red pepper flakes'],
    description: 'Classic Roman pasta with garlic and oil. Ready in 15 minutes.',
    prepTime: '15 min',
    cuisine: 'Italian',
  },
  {
    id: 'rice-beans',
    name: 'Rice and Beans',
    requiredPantry: ['rice', 'canned-beans', 'cumin'],
    optionalFresh: ['onion', 'cilantro', 'lime', 'avocado'],
    description: 'Complete protein from pantry staples. Customize with your favorite beans.',
    prepTime: '25 min',
    cuisine: 'Latin American',
  },
  {
    id: 'lentil-soup',
    name: 'Lentil Soup',
    requiredPantry: ['dried-lentils', 'canned-tomatoes', 'chicken-broth', 'cumin'],
    optionalFresh: ['carrots', 'celery', 'onion', 'lemon'],
    description: 'Hearty, healthy soup that comes together from the pantry.',
    prepTime: '40 min',
    cuisine: 'Mediterranean',
  },
  {
    id: 'coconut-curry',
    name: 'Quick Coconut Curry',
    requiredPantry: ['coconut-milk', 'rice', 'canned-beans', 'cumin'],
    optionalFresh: ['vegetables', 'chicken', 'ginger', 'lime'],
    description: 'Creamy, comforting curry that works with whatever protein you have.',
    prepTime: '30 min',
    cuisine: 'Thai',
  },
  {
    id: 'shakshuka',
    name: 'Shakshuka',
    requiredPantry: ['canned-tomatoes', 'eggs', 'cumin', 'paprika'],
    optionalFresh: ['onion', 'bell pepper', 'feta', 'bread'],
    description: 'North African poached eggs in spiced tomato sauce. Any meal, any time.',
    prepTime: '25 min',
    cuisine: 'Middle Eastern',
  },
  {
    id: 'peanut-noodles',
    name: 'Peanut Noodles',
    requiredPantry: ['pasta', 'peanut-butter', 'soy-sauce', 'honey'],
    optionalFresh: ['cucumber', 'scallions', 'chicken', 'lime'],
    description: 'Creamy peanut sauce over noodles. Hot or cold.',
    prepTime: '20 min',
    cuisine: 'Asian Fusion',
  },
  {
    id: 'tuna-pasta',
    name: 'Mediterranean Tuna Pasta',
    requiredPantry: ['pasta', 'canned-tuna', 'olive-oil', 'canned-tomatoes'],
    optionalFresh: ['olives', 'capers', 'lemon', 'parsley'],
    description: 'Pantry pasta with Mediterranean flavors. Ready in 20 minutes.',
    prepTime: '20 min',
    cuisine: 'Italian',
  },
  {
    id: 'fried-rice',
    name: 'Pantry Fried Rice',
    requiredPantry: ['rice', 'eggs', 'soy-sauce'],
    optionalFresh: ['vegetables', 'scallions', 'garlic', 'ginger'],
    description: 'Use leftover rice and any vegetables on hand. Better than takeout.',
    prepTime: '15 min',
    cuisine: 'Chinese',
  },
];

// Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ChefHatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"/>
    <path d="M6 17h12"/>
  </svg>
);

const categoryLabels: Record<PantryCategory, string> = {
  grain: 'Grains & Pasta',
  protein: 'Proteins',
  canned: 'Canned Goods',
  sauce: 'Sauces & Condiments',
  spice: 'Spices',
  oil: 'Oils',
  baking: 'Baking Essentials',
};

const categoryColors: Record<PantryCategory, string> = {
  grain: 'bg-amber-100 text-amber-700',
  protein: 'bg-red-100 text-red-700',
  canned: 'bg-blue-100 text-blue-700',
  sauce: 'bg-purple-100 text-purple-700',
  spice: 'bg-orange-100 text-orange-700',
  oil: 'bg-yellow-100 text-yellow-700',
  baking: 'bg-pink-100 text-pink-700',
};

export default function PantryHelper() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PantryCategory | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);

  // Filter pantry items
  const filteredItems = useMemo(() => {
    return pantryItems.filter(item => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(query) ||
               item.pairsWellWith.some(p => p.toLowerCase().includes(query));
      }
      return true;
    });
  }, [categoryFilter, searchQuery]);

  // Group by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, PantryItem[]> = {};
    filteredItems.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  // Find matching meal ideas
  const matchingMeals = useMemo(() => {
    if (selectedItems.length === 0) return [];

    return mealIdeas
      .map(meal => {
        const matchedRequired = meal.requiredPantry.filter(id => selectedItems.includes(id));
        const matchPercent = (matchedRequired.length / meal.requiredPantry.length) * 100;
        const missingItems = meal.requiredPantry.filter(id => !selectedItems.includes(id));

        return {
          meal,
          matchPercent,
          matchedCount: matchedRequired.length,
          missingItems,
        };
      })
      .filter(m => m.matchPercent >= 50)
      .sort((a, b) => b.matchPercent - a.matchPercent);
  }, [selectedItems]);

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getItemById = (id: string) => pantryItems.find(i => i.id === id);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pantry Items List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search & Filters */}
          <div className="card bg-white">
            <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
              What's in Your Pantry?
            </h2>

            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pantry items..."
                className="w-full pl-10 pr-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {(['all', ...Object.keys(categoryLabels)] as (PantryCategory | 'all')[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    "px-3 py-1 text-sm rounded-full transition-colors",
                    categoryFilter === cat
                      ? "bg-[var(--color-wine)] text-white"
                      : "bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]"
                  )}
                >
                  {cat === 'all' ? 'All' : categoryLabels[cat]}
                </button>
              ))}
            </div>

            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg">
                <CheckCircleIcon />
                <span className="text-sm text-green-700">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => setSelectedItems([])}
                  className="ml-auto text-xs text-green-700 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Items by Category */}
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="card bg-white">
                <h3 className={cn(
                  "inline-block px-3 py-1 rounded-full text-sm font-medium mb-4",
                  categoryColors[category as PantryCategory]
                )}>
                  {categoryLabels[category as PantryCategory]}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      onDoubleClick={() => setSelectedItem(item)}
                      className={cn(
                        "text-left p-3 rounded-lg border-2 transition-all text-sm",
                        selectedItems.includes(item.id)
                          ? "border-[var(--color-wine)] bg-[var(--color-wine-glow)]"
                          : "border-transparent bg-[var(--color-cream)] hover:border-[var(--color-wine)]"
                      )}
                    >
                      <div className="font-medium text-[var(--text-primary)]">{item.name}</div>
                      <div className="text-xs text-[var(--text-muted)] mt-1">
                        {item.versatility === 'essential' && '⭐ Essential'}
                        {item.versatility === 'versatile' && '✨ Versatile'}
                        {item.versatility === 'specialty' && '🎯 Specialty'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Meal Ideas & Item Details */}
        <div className="space-y-6">
          {/* Meal Ideas */}
          <div className="card bg-white sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <ChefHatIcon />
              <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                Meal Ideas
              </h3>
            </div>

            {selectedItems.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-muted)]">
                <p className="text-sm">Select items from your pantry to see meal suggestions</p>
              </div>
            ) : matchingMeals.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-muted)]">
                <p className="text-sm">Add more items to see meal ideas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {matchingMeals.map(({ meal, matchPercent, missingItems }) => (
                  <div
                    key={meal.id}
                    className="p-3 rounded-lg bg-[var(--color-cream)]"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-[var(--text-primary)]">{meal.name}</h4>
                      <span className={cn(
                        "px-2 py-0.5 text-xs rounded-full",
                        matchPercent === 100
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      )}>
                        {Math.round(matchPercent)}%
                      </span>
                    </div>

                    <p className="text-sm text-[var(--text-muted)] mb-2">
                      {meal.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1">
                        <ClockIcon />
                        {meal.prepTime}
                      </span>
                      <span className="px-2 py-0.5 bg-white rounded">{meal.cuisine}</span>
                    </div>

                    {missingItems.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-[var(--color-cream-dark)] text-xs">
                        <span className="text-[var(--text-muted)]">Missing: </span>
                        <span className="text-amber-600">
                          {missingItems.map(id => getItemById(id)?.name).join(', ')}
                        </span>
                      </div>
                    )}

                    {meal.optionalFresh.length > 0 && (
                      <div className="mt-2 text-xs text-[var(--text-muted)]">
                        <span>Fresh additions: </span>
                        <span className="text-green-600">{meal.optionalFresh.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Item Details */}
          {selectedItem && (
            <div className="card bg-white">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                  {selectedItem.name}
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-[var(--text-muted)]">Shelf Life: </span>
                  <span className="text-[var(--text-primary)]">{selectedItem.shelfLife}</span>
                </div>

                <div>
                  <span className="text-[var(--text-muted)] block mb-1">Pairs well with:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.pairsWellWith.map(item => (
                      <span key={item} className="px-2 py-0.5 bg-[var(--color-cream)] rounded text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[var(--text-muted)] block mb-1">Quick meals:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.quickMeals.map(meal => (
                      <span key={meal} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs">
                        {meal}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-800 text-xs font-medium">Pro Tip: </span>
                  <span className="text-blue-700 text-xs">{selectedItem.tips}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 card bg-[var(--color-cream)]">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Pantry Organization Tips
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-[var(--text-primary)] mb-2">FIFO Method</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              First In, First Out. When restocking, put new items behind old ones to ensure you
              use the oldest items first and reduce waste.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-[var(--text-primary)] mb-2">Label Everything</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Date items when you open them. Transfer bulk items to clear containers so you can
              see what you have at a glance.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-[var(--text-primary)] mb-2">The Essentials</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Stock items marked "Essential" first—they're the foundation for countless meals.
              With rice, beans, pasta, oil, and a few spices, you can always make dinner.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
