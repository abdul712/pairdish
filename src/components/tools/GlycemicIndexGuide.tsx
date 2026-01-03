/**
 * Glycemic Index Guide Component
 *
 * Find low-GI food alternatives and pairings to manage blood sugar.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
interface Food {
  id: string;
  name: string;
  category: 'grains' | 'fruits' | 'vegetables' | 'legumes' | 'dairy' | 'proteins' | 'snacks' | 'beverages';
  gi: number;
  gl: number; // per serving
  serving: string;
  carbs: number; // grams per serving
  fiber: number; // grams per serving
  notes?: string;
}

interface Alternative {
  fromId: string;
  toId: string;
  giReduction: number;
  tips: string;
}

// GI classification
const getGILevel = (gi: number): 'low' | 'medium' | 'high' => {
  if (gi <= 55) return 'low';
  if (gi <= 69) return 'medium';
  return 'high';
};

const getGLLevel = (gl: number): 'low' | 'medium' | 'high' => {
  if (gl <= 10) return 'low';
  if (gl <= 19) return 'medium';
  return 'high';
};

// Food database with GI values
const foods: Food[] = [
  // Grains & Breads
  { id: 'white-rice', name: 'White Rice', category: 'grains', gi: 73, gl: 30, serving: '1 cup cooked', carbs: 45, fiber: 0.6, notes: 'Jasmine rice is higher (89)' },
  { id: 'brown-rice', name: 'Brown Rice', category: 'grains', gi: 50, gl: 16, serving: '1 cup cooked', carbs: 45, fiber: 3.5, notes: 'Fiber slows digestion' },
  { id: 'basmati-rice', name: 'Basmati Rice', category: 'grains', gi: 52, gl: 22, serving: '1 cup cooked', carbs: 45, fiber: 0.6, notes: 'Lower GI than other white rice' },
  { id: 'white-bread', name: 'White Bread', category: 'grains', gi: 75, gl: 11, serving: '1 slice', carbs: 15, fiber: 0.6 },
  { id: 'whole-wheat-bread', name: 'Whole Wheat Bread', category: 'grains', gi: 74, gl: 9, serving: '1 slice', carbs: 13, fiber: 1.9 },
  { id: 'sourdough', name: 'Sourdough Bread', category: 'grains', gi: 54, gl: 8, serving: '1 slice', carbs: 15, fiber: 0.9, notes: 'Fermentation lowers GI' },
  { id: 'oatmeal', name: 'Oatmeal (rolled)', category: 'grains', gi: 55, gl: 13, serving: '1 cup cooked', carbs: 27, fiber: 4 },
  { id: 'steel-cut-oats', name: 'Steel-Cut Oats', category: 'grains', gi: 42, gl: 11, serving: '1 cup cooked', carbs: 27, fiber: 5, notes: 'Less processed = lower GI' },
  { id: 'quinoa', name: 'Quinoa', category: 'grains', gi: 53, gl: 13, serving: '1 cup cooked', carbs: 39, fiber: 5, notes: 'Complete protein source' },
  { id: 'pasta', name: 'White Pasta', category: 'grains', gi: 49, gl: 24, serving: '1 cup cooked', carbs: 43, fiber: 2.5, notes: 'Al dente has lower GI' },
  { id: 'whole-wheat-pasta', name: 'Whole Wheat Pasta', category: 'grains', gi: 42, gl: 17, serving: '1 cup cooked', carbs: 37, fiber: 6.3 },
  { id: 'corn-tortilla', name: 'Corn Tortilla', category: 'grains', gi: 52, gl: 12, serving: '2 tortillas', carbs: 24, fiber: 3 },
  { id: 'flour-tortilla', name: 'Flour Tortilla', category: 'grains', gi: 30, gl: 8, serving: '1 medium', carbs: 27, fiber: 1.6 },

  // Fruits
  { id: 'banana-ripe', name: 'Banana (ripe)', category: 'fruits', gi: 62, gl: 16, serving: '1 medium', carbs: 27, fiber: 3.1 },
  { id: 'banana-green', name: 'Banana (unripe)', category: 'fruits', gi: 42, gl: 11, serving: '1 medium', carbs: 27, fiber: 3.1, notes: 'Resistant starch lowers GI' },
  { id: 'apple', name: 'Apple', category: 'fruits', gi: 36, gl: 5, serving: '1 medium', carbs: 21, fiber: 4.4 },
  { id: 'orange', name: 'Orange', category: 'fruits', gi: 43, gl: 5, serving: '1 medium', carbs: 15, fiber: 3.1 },
  { id: 'grapes', name: 'Grapes', category: 'fruits', gi: 59, gl: 11, serving: '1 cup', carbs: 27, fiber: 1.4 },
  { id: 'watermelon', name: 'Watermelon', category: 'fruits', gi: 76, gl: 8, serving: '1 cup', carbs: 11, fiber: 0.6, notes: 'High GI but low GL due to water content' },
  { id: 'mango', name: 'Mango', category: 'fruits', gi: 51, gl: 8, serving: '1/2 fruit', carbs: 17, fiber: 1.8 },
  { id: 'blueberries', name: 'Blueberries', category: 'fruits', gi: 53, gl: 5, serving: '1 cup', carbs: 21, fiber: 3.6 },
  { id: 'strawberries', name: 'Strawberries', category: 'fruits', gi: 40, gl: 3, serving: '1 cup', carbs: 11, fiber: 3 },
  { id: 'cherries', name: 'Cherries', category: 'fruits', gi: 22, gl: 3, serving: '1 cup', carbs: 22, fiber: 3, notes: 'Among lowest GI fruits' },
  { id: 'pineapple', name: 'Pineapple', category: 'fruits', gi: 66, gl: 6, serving: '1 cup', carbs: 22, fiber: 2.3 },
  { id: 'dried-dates', name: 'Dates (dried)', category: 'fruits', gi: 42, gl: 18, serving: '2 dates', carbs: 36, fiber: 3.2 },

  // Vegetables
  { id: 'potato-baked', name: 'Baked Potato', category: 'vegetables', gi: 85, gl: 26, serving: '1 medium', carbs: 37, fiber: 4, notes: 'One of the highest GI foods' },
  { id: 'sweet-potato', name: 'Sweet Potato', category: 'vegetables', gi: 63, gl: 17, serving: '1 medium', carbs: 27, fiber: 4 },
  { id: 'carrots', name: 'Carrots', category: 'vegetables', gi: 39, gl: 2, serving: '1 cup raw', carbs: 12, fiber: 3.6 },
  { id: 'corn', name: 'Sweet Corn', category: 'vegetables', gi: 52, gl: 15, serving: '1 cup', carbs: 31, fiber: 4.2 },
  { id: 'peas', name: 'Green Peas', category: 'vegetables', gi: 51, gl: 4, serving: '1/2 cup', carbs: 12, fiber: 4.4 },
  { id: 'butternut-squash', name: 'Butternut Squash', category: 'vegetables', gi: 51, gl: 3, serving: '1 cup', carbs: 16, fiber: 3 },
  { id: 'broccoli', name: 'Broccoli', category: 'vegetables', gi: 10, gl: 1, serving: '1 cup', carbs: 6, fiber: 2.4, notes: 'Very low GI' },
  { id: 'spinach', name: 'Spinach', category: 'vegetables', gi: 15, gl: 1, serving: '2 cups raw', carbs: 2, fiber: 1.3 },
  { id: 'cauliflower', name: 'Cauliflower', category: 'vegetables', gi: 15, gl: 1, serving: '1 cup', carbs: 5, fiber: 2 },
  { id: 'zucchini', name: 'Zucchini', category: 'vegetables', gi: 15, gl: 1, serving: '1 cup', carbs: 4, fiber: 1.2 },

  // Legumes
  { id: 'lentils', name: 'Lentils', category: 'legumes', gi: 32, gl: 5, serving: '1/2 cup cooked', carbs: 20, fiber: 8, notes: 'Excellent low-GI protein source' },
  { id: 'chickpeas', name: 'Chickpeas', category: 'legumes', gi: 28, gl: 8, serving: '1/2 cup', carbs: 22, fiber: 6.3 },
  { id: 'black-beans', name: 'Black Beans', category: 'legumes', gi: 30, gl: 7, serving: '1/2 cup', carbs: 20, fiber: 7.5 },
  { id: 'kidney-beans', name: 'Kidney Beans', category: 'legumes', gi: 24, gl: 6, serving: '1/2 cup', carbs: 20, fiber: 6.4, notes: 'Very low GI legume' },
  { id: 'hummus', name: 'Hummus', category: 'legumes', gi: 6, gl: 0, serving: '2 tbsp', carbs: 4, fiber: 1, notes: 'Great low-GI dip' },

  // Dairy
  { id: 'milk-whole', name: 'Whole Milk', category: 'dairy', gi: 27, gl: 3, serving: '1 cup', carbs: 12, fiber: 0 },
  { id: 'milk-skim', name: 'Skim Milk', category: 'dairy', gi: 32, gl: 4, serving: '1 cup', carbs: 12, fiber: 0, notes: 'Fat slows absorption' },
  { id: 'yogurt-plain', name: 'Plain Yogurt', category: 'dairy', gi: 14, gl: 1, serving: '1 cup', carbs: 8, fiber: 0, notes: 'Very low GI dairy' },
  { id: 'yogurt-fruit', name: 'Fruit Yogurt', category: 'dairy', gi: 41, gl: 9, serving: '1 cup', carbs: 32, fiber: 0, notes: 'Added sugar raises GI' },
  { id: 'ice-cream', name: 'Ice Cream', category: 'dairy', gi: 51, gl: 8, serving: '1/2 cup', carbs: 16, fiber: 0, notes: 'Fat content lowers GI somewhat' },

  // Proteins (mostly very low GI)
  { id: 'eggs', name: 'Eggs', category: 'proteins', gi: 0, gl: 0, serving: '2 large', carbs: 1, fiber: 0, notes: 'No carbs = no GI impact' },
  { id: 'chicken', name: 'Chicken Breast', category: 'proteins', gi: 0, gl: 0, serving: '4 oz', carbs: 0, fiber: 0 },
  { id: 'fish', name: 'Fish (most)', category: 'proteins', gi: 0, gl: 0, serving: '4 oz', carbs: 0, fiber: 0 },
  { id: 'tofu', name: 'Tofu', category: 'proteins', gi: 15, gl: 1, serving: '1/2 cup', carbs: 2, fiber: 0.3 },
  { id: 'nuts-almonds', name: 'Almonds', category: 'proteins', gi: 0, gl: 0, serving: '1 oz', carbs: 6, fiber: 3.5, notes: 'Great blood sugar stabilizer' },
  { id: 'nuts-peanuts', name: 'Peanuts', category: 'proteins', gi: 14, gl: 1, serving: '1 oz', carbs: 5, fiber: 2.4 },

  // Snacks & Sweets
  { id: 'popcorn', name: 'Popcorn', category: 'snacks', gi: 65, gl: 7, serving: '3 cups', carbs: 18, fiber: 3.5 },
  { id: 'rice-cakes', name: 'Rice Cakes', category: 'snacks', gi: 82, gl: 17, serving: '2 cakes', carbs: 14, fiber: 0.4, notes: 'Very high GI snack' },
  { id: 'potato-chips', name: 'Potato Chips', category: 'snacks', gi: 56, gl: 12, serving: '1 oz', carbs: 15, fiber: 1.2 },
  { id: 'dark-chocolate', name: 'Dark Chocolate (70%)', category: 'snacks', gi: 23, gl: 4, serving: '1 oz', carbs: 13, fiber: 3.1, notes: 'Low GI treat' },
  { id: 'pretzels', name: 'Pretzels', category: 'snacks', gi: 83, gl: 16, serving: '1 oz', carbs: 23, fiber: 1 },
  { id: 'crackers', name: 'Saltine Crackers', category: 'snacks', gi: 74, gl: 12, serving: '5 crackers', carbs: 11, fiber: 0.4 },

  // Beverages
  { id: 'orange-juice', name: 'Orange Juice', category: 'beverages', gi: 50, gl: 12, serving: '1 cup', carbs: 26, fiber: 0.5, notes: 'Higher GI than whole orange' },
  { id: 'apple-juice', name: 'Apple Juice', category: 'beverages', gi: 41, gl: 12, serving: '1 cup', carbs: 28, fiber: 0.2 },
  { id: 'soda', name: 'Cola', category: 'beverages', gi: 63, gl: 16, serving: '12 oz', carbs: 39, fiber: 0 },
  { id: 'sports-drink', name: 'Sports Drink', category: 'beverages', gi: 78, gl: 12, serving: '12 oz', carbs: 21, fiber: 0 },
  { id: 'beer', name: 'Beer', category: 'beverages', gi: 66, gl: 7, serving: '12 oz', carbs: 13, fiber: 0 },
];

// Smart alternatives database
const alternatives: Alternative[] = [
  { fromId: 'white-rice', toId: 'brown-rice', giReduction: 23, tips: 'Brown rice has more fiber and nutrients. Try mixing half and half to transition.' },
  { fromId: 'white-rice', toId: 'quinoa', giReduction: 20, tips: 'Quinoa is a complete protein and works great in similar dishes.' },
  { fromId: 'white-rice', toId: 'cauliflower', giReduction: 58, tips: 'Riced cauliflower is extremely low GI and works well in stir-fries.' },
  { fromId: 'white-bread', toId: 'sourdough', giReduction: 21, tips: 'Sourdough fermentation creates acids that lower blood sugar response.' },
  { fromId: 'white-bread', toId: 'whole-wheat-bread', giReduction: 1, tips: 'Look for "100% whole grain" - many wheat breads are mostly white flour.' },
  { fromId: 'potato-baked', toId: 'sweet-potato', giReduction: 22, tips: 'Sweet potatoes have more fiber and nutrients. Try roasted or mashed.' },
  { fromId: 'potato-baked', toId: 'butternut-squash', giReduction: 34, tips: 'Butternut squash makes excellent mashed sides and soups.' },
  { fromId: 'banana-ripe', toId: 'banana-green', giReduction: 20, tips: 'Less ripe bananas have resistant starch that lowers GI.' },
  { fromId: 'banana-ripe', toId: 'apple', giReduction: 26, tips: 'Apples are one of the lowest GI fruits available.' },
  { fromId: 'oatmeal', toId: 'steel-cut-oats', giReduction: 13, tips: 'Steel-cut oats digest slower. Cook a batch and reheat through the week.' },
  { fromId: 'pasta', toId: 'whole-wheat-pasta', giReduction: 7, tips: 'Cook al dente for even lower GI. Cold pasta has resistant starch.' },
  { fromId: 'pasta', toId: 'lentils', giReduction: 17, tips: 'Lentil pasta or just lentils provide more protein and fiber.' },
  { fromId: 'rice-cakes', toId: 'nuts-almonds', giReduction: 82, tips: 'Almonds provide protein and healthy fats with minimal GI impact.' },
  { fromId: 'rice-cakes', toId: 'dark-chocolate', giReduction: 59, tips: 'A small piece of dark chocolate is surprisingly low GI.' },
  { fromId: 'pretzels', toId: 'nuts-peanuts', giReduction: 69, tips: 'Peanuts have protein and fat that stabilize blood sugar.' },
  { fromId: 'crackers', toId: 'hummus', giReduction: 68, tips: 'Use vegetables to dip in hummus instead of crackers.' },
  { fromId: 'yogurt-fruit', toId: 'yogurt-plain', giReduction: 27, tips: 'Add your own berries to plain yogurt for lower sugar.' },
  { fromId: 'corn', toId: 'peas', giReduction: 1, tips: 'Green peas have similar taste and texture with more protein.' },
  { fromId: 'soda', toId: 'orange-juice', giReduction: 13, tips: 'Still sugary, but natural OJ has some nutrients. Water is best!' },
  { fromId: 'watermelon', toId: 'strawberries', giReduction: 36, tips: 'Berries are among the lowest GI fruits with more fiber.' },
  { fromId: 'pineapple', toId: 'cherries', giReduction: 44, tips: 'Cherries are surprisingly low GI and anti-inflammatory.' },
  { fromId: 'grapes', toId: 'blueberries', giReduction: 6, tips: 'Blueberries have similar sweetness with more antioxidants.' },
  { fromId: 'ice-cream', toId: 'yogurt-plain', giReduction: 37, tips: 'Greek yogurt with berries makes a great dessert swap.' },
];

// Categories with colors
const categories = [
  { id: 'grains', name: 'Grains & Breads', icon: '🍞', color: 'amber' },
  { id: 'fruits', name: 'Fruits', icon: '🍎', color: 'red' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥕', color: 'green' },
  { id: 'legumes', name: 'Legumes', icon: '🫘', color: 'orange' },
  { id: 'dairy', name: 'Dairy', icon: '🥛', color: 'blue' },
  { id: 'proteins', name: 'Proteins & Nuts', icon: '🥩', color: 'purple' },
  { id: 'snacks', name: 'Snacks', icon: '🍿', color: 'pink' },
  { id: 'beverages', name: 'Beverages', icon: '🥤', color: 'cyan' },
];

export default function GlycemicIndexGuide() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyLowGI, setShowOnlyLowGI] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'gi' | 'gl'>('gi');

  // Filter and sort foods
  const filteredFoods = useMemo(() => {
    let result = foods.filter((food) => {
      const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
      const matchesSearch =
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLowGI = !showOnlyLowGI || getGILevel(food.gi) === 'low';

      return matchesCategory && matchesSearch && matchesLowGI;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'gi') return a.gi - b.gi;
      return a.gl - b.gl;
    });

    return result;
  }, [selectedCategory, searchQuery, showOnlyLowGI, sortBy]);

  // Get alternatives for selected food
  const foodAlternatives = useMemo(() => {
    if (!selectedFood) return [];
    return alternatives
      .filter((alt) => alt.fromId === selectedFood.id)
      .map((alt) => ({
        ...alt,
        toFood: foods.find((f) => f.id === alt.toId)!,
      }))
      .filter((alt) => alt.toFood);
  }, [selectedFood]);

  // Get color classes
  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    const colorMap: Record<string, string> = {
      amber: 'bg-amber-100 text-amber-700',
      red: 'bg-red-100 text-red-700',
      green: 'bg-green-100 text-green-700',
      orange: 'bg-orange-100 text-orange-700',
      blue: 'bg-blue-100 text-blue-700',
      purple: 'bg-purple-100 text-purple-700',
      pink: 'bg-pink-100 text-pink-700',
      cyan: 'bg-cyan-100 text-cyan-700',
    };
    return colorMap[cat?.color || 'gray'] || 'bg-gray-100 text-gray-700';
  };

  const getGIColor = (gi: number) => {
    const level = getGILevel(gi);
    if (level === 'low') return 'bg-green-500';
    if (level === 'medium') return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getGIBgColor = (gi: number) => {
    const level = getGILevel(gi);
    if (level === 'low') return 'bg-green-50 border-green-200';
    if (level === 'medium') return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const getGITextColor = (gi: number) => {
    const level = getGILevel(gi);
    if (level === 'low') return 'text-green-700';
    if (level === 'medium') return 'text-amber-700';
    return 'text-red-700';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* GI Scale Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-cream-dark)] p-6 mb-8">
        <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Understanding Glycemic Index
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="font-semibold text-green-700">Low GI (0-55)</span>
            </div>
            <p className="text-sm text-green-600">Slow, steady blood sugar rise. Best for blood sugar control.</p>
          </div>
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
              <span className="font-semibold text-amber-700">Medium GI (56-69)</span>
            </div>
            <p className="text-sm text-amber-600">Moderate blood sugar impact. Consume in moderation.</p>
          </div>
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="font-semibold text-red-700">High GI (70+)</span>
            </div>
            <p className="text-sm text-red-600">Rapid blood sugar spike. Limit or pair with protein/fat.</p>
          </div>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          <strong>Glycemic Load (GL)</strong> accounts for serving size. A high-GI food in small portions may have low GL.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Food Browser */}
        <div className="lg:col-span-2">
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--color-cream-dark)] p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search foods..."
                    className="w-full pl-10 pr-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
              >
                <option value="gi">Sort by GI</option>
                <option value="gl">Sort by GL</option>
                <option value="name">Sort by Name</option>
              </select>

              {/* Low GI Filter */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyLowGI}
                  onChange={(e) => setShowOnlyLowGI(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--color-cream-dark)] text-[var(--color-wine)] focus:ring-[var(--color-wine)]"
                />
                <span className="text-sm whitespace-nowrap">Low GI only</span>
              </label>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                selectedCategory === 'all'
                  ? 'bg-[var(--color-wine)] text-white'
                  : 'bg-white text-[var(--text-secondary)] hover:bg-[var(--color-cream)]'
              )}
            >
              All Foods
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1',
                  selectedCategory === cat.id
                    ? 'bg-[var(--color-wine)] text-white'
                    : 'bg-white text-[var(--text-secondary)] hover:bg-[var(--color-cream)]'
                )}
              >
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Food Grid */}
          <div className="space-y-2">
            {filteredFoods.map((food) => (
              <button
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className={cn(
                  'w-full text-left p-4 rounded-lg border transition-all',
                  selectedFood?.id === food.id
                    ? 'bg-[var(--color-wine-glow)] border-[var(--color-wine)]'
                    : 'bg-white border-[var(--color-cream-dark)] hover:border-[var(--color-wine)]'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={cn('px-2 py-1 rounded text-xs font-medium', getCategoryColor(food.category))}>
                      {categories.find((c) => c.id === food.category)?.icon}
                    </span>
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">{food.name}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{food.serving}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded', getGIBgColor(food.gi), getGITextColor(food.gi))}>
                          GI: {food.gi}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          GL: {food.gl}
                        </span>
                      </div>
                    </div>
                    <div className={cn('w-3 h-3 rounded-full', getGIColor(food.gi))}></div>
                  </div>
                </div>
                {food.notes && (
                  <p className="text-xs text-[var(--text-muted)] mt-2 italic">{food.notes}</p>
                )}
              </button>
            ))}
            {filteredFoods.length === 0 && (
              <div className="text-center py-8 text-[var(--text-muted)]">
                No foods found. Try adjusting your filters.
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            {selectedFood ? (
              <div className="bg-white rounded-xl shadow-sm border border-[var(--color-cream-dark)] p-6">
                {/* Food Header */}
                <div className="mb-6">
                  <span className={cn('inline-block px-2 py-1 rounded text-xs font-medium mb-2', getCategoryColor(selectedFood.category))}>
                    {categories.find((c) => c.id === selectedFood.category)?.name}
                  </span>
                  <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                    {selectedFood.name}
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">Per {selectedFood.serving}</p>
                </div>

                {/* GI/GL Display */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className={cn('p-4 rounded-lg border', getGIBgColor(selectedFood.gi))}>
                    <p className="text-xs text-[var(--text-muted)] mb-1">Glycemic Index</p>
                    <p className={cn('text-2xl font-bold', getGITextColor(selectedFood.gi))}>
                      {selectedFood.gi}
                    </p>
                    <p className={cn('text-xs font-medium', getGITextColor(selectedFood.gi))}>
                      {getGILevel(selectedFood.gi).toUpperCase()} GI
                    </p>
                  </div>
                  <div className={cn('p-4 rounded-lg border', getGIBgColor(selectedFood.gl * 5))}>
                    <p className="text-xs text-[var(--text-muted)] mb-1">Glycemic Load</p>
                    <p className={cn('text-2xl font-bold', getGITextColor(selectedFood.gl * 5))}>
                      {selectedFood.gl}
                    </p>
                    <p className={cn('text-xs font-medium', getGITextColor(selectedFood.gl * 5))}>
                      {getGLLevel(selectedFood.gl).toUpperCase()} GL
                    </p>
                  </div>
                </div>

                {/* Nutrition Info */}
                <div className="mb-6">
                  <h3 className="font-medium text-[var(--text-primary)] mb-2">Nutrition</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between p-2 bg-[var(--color-cream)] rounded">
                      <span className="text-[var(--text-muted)]">Carbs</span>
                      <span className="font-medium">{selectedFood.carbs}g</span>
                    </div>
                    <div className="flex justify-between p-2 bg-[var(--color-cream)] rounded">
                      <span className="text-[var(--text-muted)]">Fiber</span>
                      <span className="font-medium">{selectedFood.fiber}g</span>
                    </div>
                  </div>
                </div>

                {selectedFood.notes && (
                  <div className="p-3 bg-blue-50 rounded-lg mb-6">
                    <p className="text-sm text-blue-700">{selectedFood.notes}</p>
                  </div>
                )}

                {/* Alternatives */}
                {foodAlternatives.length > 0 && (
                  <div>
                    <h3 className="font-medium text-[var(--text-primary)] mb-3">
                      Lower GI Alternatives
                    </h3>
                    <div className="space-y-3">
                      {foodAlternatives.map((alt) => (
                        <div
                          key={alt.toId}
                          className="p-3 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                          onClick={() => setSelectedFood(alt.toFood)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-green-700">{alt.toFood.name}</span>
                            <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                              -{alt.giReduction} GI
                            </span>
                          </div>
                          <p className="text-xs text-green-600">{alt.tips}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-[var(--color-cream-dark)] p-6">
                <div className="text-center text-[var(--text-muted)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-4 opacity-50"
                  >
                    <path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7z" />
                    <path d="M22 9s-1.33-2-3.5-2C16.86 7 15 9 15 9s1.33 2 3.5 2S22 9 22 9z" />
                  </svg>
                  <p className="font-medium mb-2">Select a food</p>
                  <p className="text-sm">Click on any food to see detailed GI information and lower-GI alternatives.</p>
                </div>
              </div>
            )}

            {/* Tips Card */}
            <div className="mt-4 bg-[var(--color-cream)] rounded-xl p-4">
              <h3 className="font-medium text-[var(--text-primary)] mb-2">Quick Tips</h3>
              <ul className="text-sm text-[var(--text-secondary)] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">*</span>
                  Pair high-GI foods with protein or fat to lower blood sugar impact
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">*</span>
                  Cook pasta al dente for lower GI than soft-cooked
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">*</span>
                  Less ripe fruits generally have lower GI
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">*</span>
                  Whole, intact grains are better than ground
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
