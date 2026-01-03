/**
 * Herb & Spice Matrix
 *
 * Interactive guide to herb and spice combinations.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

interface HerbSpice {
  id: string;
  name: string;
  category: 'herb' | 'spice' | 'blend';
  flavor: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  cuisines: string[];
  bestWith: string[];
  foods: string[];
  description: string;
  color: string;
}

const herbsSpices: HerbSpice[] = [
  // Fresh Herbs
  {
    id: 'basil',
    name: 'Basil',
    category: 'herb',
    flavor: 'Sweet, peppery, slightly anise',
    intensity: 2,
    cuisines: ['Italian', 'Thai', 'Mediterranean'],
    bestWith: ['Oregano', 'Garlic', 'Thyme', 'Parsley', 'Mint'],
    foods: ['Tomatoes', 'Pasta', 'Pizza', 'Chicken', 'Mozzarella'],
    description: 'Essential in Italian and Thai cuisines. Best added fresh at end of cooking.',
    color: 'bg-green-200',
  },
  {
    id: 'cilantro',
    name: 'Cilantro',
    category: 'herb',
    flavor: 'Bright, citrusy, slightly peppery',
    intensity: 3,
    cuisines: ['Mexican', 'Thai', 'Indian', 'Vietnamese'],
    bestWith: ['Cumin', 'Lime', 'Chili', 'Garlic', 'Ginger'],
    foods: ['Salsa', 'Curry', 'Tacos', 'Rice', 'Seafood'],
    description: 'Polarizing herb—some taste soap due to genetics. Use fresh only.',
    color: 'bg-green-300',
  },
  {
    id: 'parsley',
    name: 'Parsley',
    category: 'herb',
    flavor: 'Fresh, slightly bitter, clean',
    intensity: 1,
    cuisines: ['Mediterranean', 'Middle Eastern', 'European'],
    bestWith: ['Garlic', 'Lemon', 'Thyme', 'Oregano', 'Basil'],
    foods: ['Potatoes', 'Fish', 'Soup', 'Salads', 'Pasta'],
    description: 'Flat-leaf (Italian) has more flavor than curly. Brightens any dish.',
    color: 'bg-green-200',
  },
  {
    id: 'rosemary',
    name: 'Rosemary',
    category: 'herb',
    flavor: 'Piney, woody, lemony',
    intensity: 4,
    cuisines: ['Mediterranean', 'Italian', 'French'],
    bestWith: ['Thyme', 'Sage', 'Garlic', 'Oregano', 'Bay leaf'],
    foods: ['Lamb', 'Chicken', 'Potatoes', 'Bread', 'Pork'],
    description: 'Strong flavor—use sparingly. Withstands long cooking times.',
    color: 'bg-emerald-300',
  },
  {
    id: 'thyme',
    name: 'Thyme',
    category: 'herb',
    flavor: 'Earthy, slightly minty, floral',
    intensity: 2,
    cuisines: ['French', 'Mediterranean', 'Caribbean'],
    bestWith: ['Rosemary', 'Sage', 'Oregano', 'Bay leaf', 'Parsley'],
    foods: ['Soups', 'Stews', 'Roasts', 'Beans', 'Vegetables'],
    description: 'Workhouse herb in French cooking. Part of bouquet garni.',
    color: 'bg-green-200',
  },
  {
    id: 'sage',
    name: 'Sage',
    category: 'herb',
    flavor: 'Earthy, slightly peppery, musty',
    intensity: 4,
    cuisines: ['Italian', 'British', 'American'],
    bestWith: ['Thyme', 'Rosemary', 'Marjoram', 'Bay leaf'],
    foods: ['Pork', 'Sausage', 'Stuffing', 'Butter sauce', 'Squash'],
    description: 'Essential for Thanksgiving. Brown in butter for classic sauce.',
    color: 'bg-green-400',
  },
  {
    id: 'mint',
    name: 'Mint',
    category: 'herb',
    flavor: 'Cool, sweet, refreshing',
    intensity: 3,
    cuisines: ['Middle Eastern', 'Mediterranean', 'British', 'Southeast Asian'],
    bestWith: ['Cilantro', 'Basil', 'Lemon', 'Ginger'],
    foods: ['Lamb', 'Peas', 'Yogurt', 'Fruit', 'Cocktails'],
    description: 'Many varieties—spearmint for cooking, peppermint for desserts.',
    color: 'bg-teal-200',
  },
  {
    id: 'dill',
    name: 'Dill',
    category: 'herb',
    flavor: 'Fresh, grassy, slightly anise',
    intensity: 2,
    cuisines: ['Scandinavian', 'German', 'Eastern European', 'Greek'],
    bestWith: ['Lemon', 'Garlic', 'Parsley', 'Chives'],
    foods: ['Salmon', 'Pickles', 'Potatoes', 'Yogurt', 'Cucumbers'],
    description: 'Classic with fish and pickles. Seeds have stronger flavor than leaves.',
    color: 'bg-green-200',
  },
  {
    id: 'oregano',
    name: 'Oregano',
    category: 'herb',
    flavor: 'Earthy, peppery, slightly bitter',
    intensity: 3,
    cuisines: ['Italian', 'Greek', 'Mexican'],
    bestWith: ['Basil', 'Thyme', 'Rosemary', 'Marjoram', 'Garlic'],
    foods: ['Pizza', 'Tomato sauce', 'Grilled meats', 'Greek salad'],
    description: 'Greek oregano has stronger flavor. Dried is more intense than fresh.',
    color: 'bg-green-300',
  },
  // Spices
  {
    id: 'cumin',
    name: 'Cumin',
    category: 'spice',
    flavor: 'Earthy, warm, slightly nutty',
    intensity: 3,
    cuisines: ['Indian', 'Mexican', 'Middle Eastern', 'North African'],
    bestWith: ['Coriander', 'Chili', 'Turmeric', 'Ginger', 'Cinnamon'],
    foods: ['Curry', 'Chili', 'Tacos', 'Hummus', 'Rice'],
    description: 'Toast seeds before grinding for best flavor. Essential in many cuisines.',
    color: 'bg-amber-300',
  },
  {
    id: 'coriander',
    name: 'Coriander Seeds',
    category: 'spice',
    flavor: 'Citrusy, floral, slightly sweet',
    intensity: 2,
    cuisines: ['Indian', 'Middle Eastern', 'Mexican', 'Asian'],
    bestWith: ['Cumin', 'Ginger', 'Chili', 'Turmeric', 'Cardamom'],
    foods: ['Curry', 'Pickles', 'Sausage', 'Bread', 'Marinades'],
    description: 'Seeds taste different from cilantro leaves. Toast before grinding.',
    color: 'bg-yellow-200',
  },
  {
    id: 'cinnamon',
    name: 'Cinnamon',
    category: 'spice',
    flavor: 'Sweet, warm, woody',
    intensity: 3,
    cuisines: ['Middle Eastern', 'Indian', 'Mexican', 'American'],
    bestWith: ['Nutmeg', 'Cloves', 'Ginger', 'Cardamom', 'Allspice'],
    foods: ['Baked goods', 'Curry', 'Oatmeal', 'Coffee', 'Sweet potatoes'],
    description: 'Ceylon is sweeter; Cassia is more common. Essential in baking.',
    color: 'bg-orange-400',
  },
  {
    id: 'paprika',
    name: 'Paprika',
    category: 'spice',
    flavor: 'Sweet to hot, earthy, slightly smoky',
    intensity: 2,
    cuisines: ['Hungarian', 'Spanish', 'American'],
    bestWith: ['Garlic', 'Onion', 'Cumin', 'Oregano', 'Cayenne'],
    foods: ['Goulash', 'Chicken', 'Deviled eggs', 'Hummus', 'Rice'],
    description: 'Varieties: Sweet, Hot, Smoked. Spanish smoked paprika is smoky.',
    color: 'bg-red-400',
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    category: 'spice',
    flavor: 'Earthy, peppery, slightly bitter',
    intensity: 2,
    cuisines: ['Indian', 'Southeast Asian', 'Middle Eastern'],
    bestWith: ['Cumin', 'Coriander', 'Ginger', 'Black pepper', 'Cinnamon'],
    foods: ['Curry', 'Rice', 'Lentils', 'Smoothies', 'Vegetables'],
    description: 'Gives curry its yellow color. Always use with black pepper for absorption.',
    color: 'bg-yellow-400',
  },
  {
    id: 'ginger',
    name: 'Ginger',
    category: 'spice',
    flavor: 'Warm, spicy, slightly sweet',
    intensity: 4,
    cuisines: ['Asian', 'Indian', 'Caribbean', 'Middle Eastern'],
    bestWith: ['Garlic', 'Soy sauce', 'Sesame', 'Chili', 'Lemongrass'],
    foods: ['Stir-fry', 'Curry', 'Baked goods', 'Marinades', 'Tea'],
    description: 'Fresh is brighter; dried is more concentrated. Freeze fresh ginger.',
    color: 'bg-amber-200',
  },
  {
    id: 'cayenne',
    name: 'Cayenne Pepper',
    category: 'spice',
    flavor: 'Hot, sharp, slightly fruity',
    intensity: 5,
    cuisines: ['Cajun', 'Indian', 'Mexican', 'Asian'],
    bestWith: ['Paprika', 'Cumin', 'Garlic', 'Oregano', 'Thyme'],
    foods: ['Hot sauce', 'Chili', 'Marinades', 'Cajun dishes', 'Chocolate'],
    description: 'A little goes a long way. Add gradually to control heat.',
    color: 'bg-red-500',
  },
  {
    id: 'nutmeg',
    name: 'Nutmeg',
    category: 'spice',
    flavor: 'Warm, sweet, slightly nutty',
    intensity: 3,
    cuisines: ['Italian', 'French', 'Indian', 'Caribbean'],
    bestWith: ['Cinnamon', 'Cloves', 'Ginger', 'Allspice', 'Cardamom'],
    foods: ['Béchamel', 'Eggnog', 'Spinach', 'Pumpkin pie', 'Pasta'],
    description: 'Grate fresh—pre-ground loses flavor quickly. Use sparingly.',
    color: 'bg-amber-400',
  },
  {
    id: 'cardamom',
    name: 'Cardamom',
    category: 'spice',
    flavor: 'Floral, citrusy, slightly minty',
    intensity: 4,
    cuisines: ['Indian', 'Middle Eastern', 'Scandinavian'],
    bestWith: ['Cinnamon', 'Cloves', 'Ginger', 'Coriander', 'Cumin'],
    foods: ['Chai', 'Rice', 'Curry', 'Baked goods', 'Coffee'],
    description: 'Green is most common; black is smokier. Expensive but essential.',
    color: 'bg-green-300',
  },
  // Blends
  {
    id: 'garam-masala',
    name: 'Garam Masala',
    category: 'blend',
    flavor: 'Warm, complex, aromatic',
    intensity: 4,
    cuisines: ['Indian'],
    bestWith: ['Cumin', 'Coriander', 'Turmeric', 'Chili'],
    foods: ['Curry', 'Lentils', 'Vegetables', 'Rice', 'Meat'],
    description: 'North Indian blend. Add at end of cooking for best aroma.',
    color: 'bg-amber-400',
  },
  {
    id: 'italian-seasoning',
    name: 'Italian Seasoning',
    category: 'blend',
    flavor: 'Herby, savory, Mediterranean',
    intensity: 2,
    cuisines: ['Italian', 'Mediterranean'],
    bestWith: ['Garlic', 'Olive oil', 'Tomatoes', 'Parmesan'],
    foods: ['Pasta', 'Pizza', 'Bread', 'Chicken', 'Vegetables'],
    description: 'Blend of oregano, basil, thyme, rosemary, marjoram.',
    color: 'bg-green-300',
  },
  {
    id: 'zaatar',
    name: 'Za\'atar',
    category: 'blend',
    flavor: 'Herby, tangy, nutty',
    intensity: 3,
    cuisines: ['Middle Eastern', 'Mediterranean'],
    bestWith: ['Olive oil', 'Lemon', 'Garlic', 'Yogurt'],
    foods: ['Flatbread', 'Hummus', 'Eggs', 'Vegetables', 'Meat'],
    description: 'Blend of thyme, sumac, sesame seeds. Sprinkle on everything!',
    color: 'bg-green-400',
  },
];

export default function HerbSpiceMatrix() {
  const [selectedItem, setSelectedItem] = useState<string>('basil');
  const [categoryFilter, setCategoryFilter] = useState<HerbSpice['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return herbsSpices.filter((item) => {
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.flavor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cuisines.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  const selectedData = herbsSpices.find((h) => h.id === selectedItem);

  const categories: { value: HerbSpice['category'] | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'herb', label: 'Fresh Herbs' },
    { value: 'spice', label: 'Spices' },
    { value: 'blend', label: 'Blends' },
  ];

  const getIntensityBars = (intensity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={cn(
          'w-4 h-2 rounded-full',
          i < intensity ? 'bg-[var(--color-wine)]' : 'bg-gray-200'
        )}
      />
    ));
  };

  // Find items that pair well with selected
  const pairingSuggestions = useMemo(() => {
    if (!selectedData) return [];
    return herbsSpices.filter(
      (h) => selectedData.bestWith.includes(h.name) && h.id !== selectedItem
    );
  }, [selectedData, selectedItem]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selection Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-[var(--shadow-medium)] p-5 sticky top-4">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
              Herbs & Spices
            </h2>

            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search herbs, spices, cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:ring-2 focus:ring-[var(--color-wine)] focus:border-transparent text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategoryFilter(cat.value)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                    categoryFilter === cat.value
                      ? 'bg-[var(--color-wine)] text-white'
                      : 'bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Item List */}
            <div className="space-y-2 max-h-[450px] overflow-y-auto">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className={cn(
                    'w-full text-left p-3 rounded-xl transition-all',
                    selectedItem === item.id
                      ? 'bg-[var(--color-wine-glow)] border-2 border-[var(--color-wine)]'
                      : 'bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] border-2 border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-full', item.color)} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[var(--text-primary)] text-sm">
                        {item.name}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] capitalize">
                        {item.category}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {selectedData && (
            <>
              {/* Item Info Card */}
              <div className="bg-white rounded-2xl shadow-[var(--shadow-medium)] p-6 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn('w-16 h-16 rounded-xl', selectedData.color)} />
                  <div className="flex-1">
                    <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                      {selectedData.name}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-[var(--color-cream)] rounded-full text-[var(--text-secondary)] capitalize">
                        {selectedData.category}
                      </span>
                      {selectedData.cuisines.slice(0, 3).map((c) => (
                        <span key={c} className="text-xs px-2 py-0.5 bg-amber-100 rounded-full text-amber-700">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[var(--text-secondary)] mb-4">{selectedData.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-xs font-medium text-[var(--text-muted)]">Flavor Profile</span>
                    <p className="text-sm text-[var(--text-primary)]">{selectedData.flavor}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[var(--text-muted)]">Intensity</span>
                    <div className="flex items-center gap-1 mt-1">
                      {getIntensityBars(selectedData.intensity)}
                    </div>
                  </div>
                </div>

                {/* Foods */}
                <div>
                  <span className="text-xs font-medium text-[var(--text-muted)]">Best With Foods</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedData.foods.map((f) => (
                      <span key={f} className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pairing Suggestions */}
              <div className="bg-white rounded-2xl shadow-[var(--shadow-medium)] p-6 mb-6">
                <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
                  Best Paired With
                </h3>

                {pairingSuggestions.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {pairingSuggestions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(item.id)}
                        className="text-left p-3 rounded-xl bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn('w-6 h-6 rounded-full', item.color)} />
                          <span className="font-medium text-sm text-[var(--text-primary)]">
                            {item.name}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">
                          {item.flavor}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedData.bestWith.map((name) => (
                      <div key={name} className="text-sm px-3 py-2 bg-green-50 text-green-700 rounded-lg text-center">
                        {name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cuisines */}
              <div className="bg-white rounded-2xl shadow-[var(--shadow-medium)] p-6">
                <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
                  Common in These Cuisines
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedData.cuisines.map((cuisine) => (
                    <span
                      key={cuisine}
                      className="px-4 py-2 bg-[var(--color-wine-glow)] text-[var(--color-wine)] rounded-lg text-sm font-medium"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Reference */}
      <div className="mt-8 bg-green-50 rounded-xl p-6">
        <h3 className="font-display font-semibold text-green-800 mb-4">
          Quick Pairing Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-900">
          <div className="flex gap-3">
            <span className="text-xl">🌿</span>
            <p>
              <strong>Fresh Herbs:</strong> Add at the end of cooking to preserve flavor.
              Woody herbs (rosemary, thyme) can cook longer than tender herbs (basil, cilantro).
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">🔥</span>
            <p>
              <strong>Toast Spices:</strong> Dry-toast whole spices before grinding to
              release essential oils and deepen flavor.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">⚖️</span>
            <p>
              <strong>Balance Intensity:</strong> Pair herbs and spices of similar
              intensity. Strong flavors can overpower delicate ones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
