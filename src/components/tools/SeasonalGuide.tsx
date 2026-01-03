/**
 * Seasonal Ingredient Guide
 *
 * Interactive guide showing what produce is in season and pairing suggestions.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
type Season = 'spring' | 'summer' | 'fall' | 'winter';
type ProduceCategory = 'vegetable' | 'fruit' | 'herb';
type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface SeasonalProduce {
  id: string;
  name: string;
  category: ProduceCategory;
  peakMonths: Month[];
  availableMonths: Month[];
  description: string;
  pairings: string[];
  storage: string;
  tips: string;
  image?: string;
}

// Seasonal produce database
const produceDatabase: SeasonalProduce[] = [
  // SPRING (March-May)
  {
    id: 'asparagus',
    name: 'Asparagus',
    category: 'vegetable',
    peakMonths: [3, 4, 5],
    availableMonths: [2, 3, 4, 5, 6],
    description: 'Tender, grassy spears that signal spring\'s arrival. Look for firm tips and bright green color.',
    pairings: ['lemon', 'parmesan', 'hollandaise', 'eggs', 'prosciutto', 'salmon', 'garlic'],
    storage: 'Stand upright in a jar with 1" of water, cover with plastic bag. Use within 3-4 days.',
    tips: 'Snap off woody ends naturally—they break where tender meets tough. Thick spears are just as tender as thin.',
  },
  {
    id: 'artichoke',
    name: 'Artichokes',
    category: 'vegetable',
    peakMonths: [3, 4, 5],
    availableMonths: [3, 4, 5, 10, 11],
    description: 'Thistle buds with delicate, nutty hearts. Heavy for their size with tight leaves is best.',
    pairings: ['lemon', 'garlic', 'olive oil', 'butter', 'aioli', 'white wine', 'parmesan'],
    storage: 'Refrigerate unwashed in plastic bag up to 1 week. Sprinkle with water to keep fresh.',
    tips: 'Rub cut surfaces with lemon to prevent browning. The heart and tender inner leaves are the prize.',
  },
  {
    id: 'peas',
    name: 'Green Peas',
    category: 'vegetable',
    peakMonths: [4, 5, 6],
    availableMonths: [4, 5, 6, 7],
    description: 'Sweet, tender peas at their best fresh from the pod. A fleeting spring treat.',
    pairings: ['mint', 'butter', 'bacon', 'pearl onions', 'cream', 'pasta', 'risotto'],
    storage: 'Use within 1-2 days of purchase. Sweetness fades quickly as sugars convert to starch.',
    tips: 'Fresh peas need only 2-3 minutes of cooking. Taste for sweetness—older peas can be pureed into soup.',
  },
  {
    id: 'radish',
    name: 'Radishes',
    category: 'vegetable',
    peakMonths: [3, 4, 5],
    availableMonths: [3, 4, 5, 6, 9, 10],
    description: 'Peppery, crunchy roots perfect for adding bite to dishes. Greens are edible too.',
    pairings: ['butter', 'salt', 'cream cheese', 'cucumber', 'chives', 'dill', 'tacos'],
    storage: 'Remove greens, store roots in plastic bag up to 2 weeks. Greens last 2-3 days.',
    tips: 'Roasting radishes mellows their bite and brings out sweetness. Don\'t discard the greens—sauté them!',
  },
  {
    id: 'rhubarb',
    name: 'Rhubarb',
    category: 'fruit',
    peakMonths: [4, 5, 6],
    availableMonths: [4, 5, 6],
    description: 'Tart, pink stalks technically a vegetable but used as fruit. Leaves are toxic—discard them.',
    pairings: ['strawberry', 'ginger', 'vanilla', 'orange', 'apple', 'oats', 'cream'],
    storage: 'Refrigerate unwashed up to 2 weeks. Freezes well for year-round use.',
    tips: 'Always add sugar—raw rhubarb is extremely tart. Pairs beautifully with strawberries in pies and crisps.',
  },

  // SUMMER (June-August)
  {
    id: 'tomato',
    name: 'Tomatoes',
    category: 'vegetable',
    peakMonths: [7, 8, 9],
    availableMonths: [6, 7, 8, 9, 10],
    description: 'Sun-ripened summer tomatoes are incomparably sweet and flavorful. Worth waiting for.',
    pairings: ['basil', 'mozzarella', 'olive oil', 'garlic', 'burrata', 'balsamic', 'salt'],
    storage: 'Never refrigerate! Store at room temperature, stem-side down. Use within a week.',
    tips: 'Let cold tomatoes come to room temp before serving for best flavor. Salt brings out sweetness.',
  },
  {
    id: 'corn',
    name: 'Sweet Corn',
    category: 'vegetable',
    peakMonths: [7, 8],
    availableMonths: [6, 7, 8, 9],
    description: 'Peak sweetness lasts just 24 hours after harvest. Fresh corn is worth seeking out.',
    pairings: ['butter', 'lime', 'chili', 'cilantro', 'cotija', 'mayo', 'bacon'],
    storage: 'Best eaten same day. Refrigerate in husks up to 2 days max.',
    tips: 'Don\'t boil—grill or roast for deeper flavor. Sugar converts to starch quickly after picking.',
  },
  {
    id: 'zucchini',
    name: 'Zucchini',
    category: 'vegetable',
    peakMonths: [6, 7, 8],
    availableMonths: [5, 6, 7, 8, 9],
    description: 'Versatile summer squash that\'s mild enough to take on any flavor. Smaller is better.',
    pairings: ['garlic', 'parmesan', 'tomato', 'basil', 'lemon', 'mint', 'feta'],
    storage: 'Refrigerate unwashed in plastic bag up to 1 week.',
    tips: 'Salt and drain slices before cooking to remove excess moisture. Great raw in salads or as noodles.',
  },
  {
    id: 'peach',
    name: 'Peaches',
    category: 'fruit',
    peakMonths: [7, 8],
    availableMonths: [6, 7, 8, 9],
    description: 'Fragrant, juicy stone fruit at its peak in midsummer. Should smell sweet even uncut.',
    pairings: ['vanilla', 'bourbon', 'cream', 'almonds', 'brown sugar', 'balsamic', 'prosciutto'],
    storage: 'Ripen at room temperature until fragrant and slightly soft. Then refrigerate up to 5 days.',
    tips: 'Yellow peaches are more traditional sweet; white peaches are lower acid and more delicate.',
  },
  {
    id: 'berries',
    name: 'Summer Berries',
    category: 'fruit',
    peakMonths: [6, 7, 8],
    availableMonths: [5, 6, 7, 8, 9],
    description: 'Strawberries, blueberries, blackberries, and raspberries at their sweetest.',
    pairings: ['cream', 'lemon', 'mint', 'chocolate', 'basil', 'balsamic', 'mascarpone'],
    storage: 'Don\'t wash until ready to use. Refrigerate in single layer up to 3 days.',
    tips: 'Bring to room temp before serving for best flavor. A splash of balsamic enhances sweetness.',
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    category: 'fruit',
    peakMonths: [7, 8],
    availableMonths: [6, 7, 8, 9],
    description: 'Nothing says summer like cold, juicy watermelon. Look for yellow field spot.',
    pairings: ['feta', 'mint', 'lime', 'basil', 'prosciutto', 'jalapeño', 'salt'],
    storage: 'Whole at room temp up to 2 weeks. Cut watermelon refrigerate up to 5 days.',
    tips: 'Hollow sound when tapped means it\'s ripe. Salt actually enhances sweetness.',
  },
  {
    id: 'basil',
    name: 'Basil',
    category: 'herb',
    peakMonths: [6, 7, 8],
    availableMonths: [5, 6, 7, 8, 9],
    description: 'Aromatic herb essential for summer cooking. Thai, purple, and sweet varieties each unique.',
    pairings: ['tomato', 'mozzarella', 'garlic', 'olive oil', 'lemon', 'strawberry', 'peach'],
    storage: 'Store like flowers in water at room temp, not fridge. Use within a week.',
    tips: 'Tear rather than chop to prevent bruising. Add at end of cooking to preserve flavor.',
  },

  // FALL (September-November)
  {
    id: 'apple',
    name: 'Apples',
    category: 'fruit',
    peakMonths: [9, 10, 11],
    availableMonths: [8, 9, 10, 11, 12],
    description: 'Crisp fall apples offer incredible variety—over 7,500 types exist worldwide.',
    pairings: ['cinnamon', 'caramel', 'cheddar', 'pork', 'walnut', 'brown butter', 'ginger'],
    storage: 'Refrigerate in crisper drawer up to 2 months. One bad apple does spoil the bunch!',
    tips: 'Different varieties shine for different uses: Granny Smith for pies, Honeycrisp for eating, Pink Lady for both.',
  },
  {
    id: 'pumpkin',
    name: 'Pumpkin',
    category: 'vegetable',
    peakMonths: [9, 10, 11],
    availableMonths: [9, 10, 11],
    description: 'Sugar pumpkins and pie pumpkins are for eating—carving pumpkins are stringy and bland.',
    pairings: ['cinnamon', 'nutmeg', 'sage', 'brown butter', 'cream', 'maple', 'pecans'],
    storage: 'Whole, uncut pumpkins last 2-3 months in cool, dry place.',
    tips: 'Roast halves cut-side down for easy puree. Fresh pumpkin puree is life-changing in pies.',
  },
  {
    id: 'butternut-squash',
    name: 'Butternut Squash',
    category: 'vegetable',
    peakMonths: [10, 11],
    availableMonths: [9, 10, 11, 12, 1, 2],
    description: 'Sweet, nutty winter squash that\'s versatile from soups to desserts.',
    pairings: ['sage', 'brown butter', 'maple', 'cinnamon', 'nutmeg', 'apple', 'bacon'],
    storage: 'Whole squash keeps 1-3 months in cool, dry place. Cut squash refrigerate 4-5 days.',
    tips: 'Microwave whole for 2 minutes to soften skin for easier peeling. Seeds are edible when roasted.',
  },
  {
    id: 'brussels-sprouts',
    name: 'Brussels Sprouts',
    category: 'vegetable',
    peakMonths: [10, 11, 12],
    availableMonths: [9, 10, 11, 12, 1, 2],
    description: 'Miniature cabbages that turn sweet and nutty when roasted. Frost improves flavor.',
    pairings: ['bacon', 'balsamic', 'parmesan', 'apple', 'chestnuts', 'maple', 'lemon'],
    storage: 'Refrigerate in plastic bag up to 10 days. On the stalk, even longer.',
    tips: 'High heat is key—roast at 425°F or higher until charred edges form. Steam is the enemy of good sprouts.',
  },
  {
    id: 'cranberries',
    name: 'Cranberries',
    category: 'fruit',
    peakMonths: [10, 11, 12],
    availableMonths: [10, 11, 12],
    description: 'Tart, festive berries that bounce when fresh. Essential for holiday cooking.',
    pairings: ['orange', 'apple', 'ginger', 'cinnamon', 'port wine', 'walnut', 'turkey'],
    storage: 'Refrigerate up to 2 months. Freeze for year-round use—use directly from frozen.',
    tips: 'Fresh cranberries should bounce—a traditional quality test. Balance tartness with enough sugar.',
  },
  {
    id: 'pear',
    name: 'Pears',
    category: 'fruit',
    peakMonths: [9, 10, 11],
    availableMonths: [8, 9, 10, 11, 12, 1],
    description: 'Pears ripen from the inside out—check the neck for ripeness, not the body.',
    pairings: ['blue cheese', 'walnut', 'honey', 'ginger', 'vanilla', 'chocolate', 'prosciutto'],
    storage: 'Ripen at room temp, then refrigerate. Use within a few days of ripening.',
    tips: 'Bartlett for eating and canning, Bosc for poaching and baking, Anjou for all-purpose.',
  },

  // WINTER (December-February)
  {
    id: 'citrus',
    name: 'Citrus Fruits',
    category: 'fruit',
    peakMonths: [12, 1, 2],
    availableMonths: [11, 12, 1, 2, 3],
    description: 'Oranges, grapefruits, lemons, and limes brighten winter with sunshine flavor.',
    pairings: ['fennel', 'olive oil', 'chocolate', 'vanilla', 'avocado', 'fish', 'rosemary'],
    storage: 'Room temp for a week, refrigerate up to 3 weeks for longer storage.',
    tips: 'Roll citrus firmly before juicing to release more juice. Zest before cutting for easiest use.',
  },
  {
    id: 'kale',
    name: 'Kale',
    category: 'vegetable',
    peakMonths: [11, 12, 1, 2],
    availableMonths: [9, 10, 11, 12, 1, 2, 3, 4],
    description: 'Cold-hardy green that gets sweeter after frost. Dark leaves = more nutrients.',
    pairings: ['garlic', 'lemon', 'parmesan', 'red pepper flakes', 'bacon', 'white beans', 'tahini'],
    storage: 'Refrigerate unwashed in plastic bag up to 1 week. Wash just before using.',
    tips: 'Massage raw kale with olive oil and salt to tenderize for salads. Lacinato/dinosaur kale is most tender.',
  },
  {
    id: 'sweet-potato',
    name: 'Sweet Potatoes',
    category: 'vegetable',
    peakMonths: [10, 11, 12],
    availableMonths: [9, 10, 11, 12, 1, 2, 3],
    description: 'Not true potatoes—this tuber is sweeter and more nutritious. Orange flesh is most common.',
    pairings: ['cinnamon', 'maple', 'brown butter', 'pecans', 'black beans', 'chipotle', 'marshmallow'],
    storage: 'Cool, dark place (not refrigerator) up to 2 weeks. Cold storage converts starch to sugar.',
    tips: 'Pierce and slow-roast whole for caramelized sweetness. Purple and Japanese varieties offer unique flavors.',
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    category: 'vegetable',
    peakMonths: [10, 11, 12],
    availableMonths: [9, 10, 11, 12, 1, 2, 3, 4],
    description: 'Mild, versatile vegetable that takes on bold flavors. Now comes in orange and purple too.',
    pairings: ['curry', 'turmeric', 'parmesan', 'tahini', 'anchovy', 'capers', 'brown butter'],
    storage: 'Refrigerate in plastic bag up to 1 week. Brown spots indicate age.',
    tips: 'High-heat roasting creates incredible caramelization. Can sub for rice, pizza crust, and more.',
  },
  {
    id: 'pomegranate',
    name: 'Pomegranate',
    category: 'fruit',
    peakMonths: [10, 11, 12],
    availableMonths: [10, 11, 12, 1],
    description: 'Jewel-like seeds (arils) burst with sweet-tart juice. Worth the effort to extract.',
    pairings: ['walnut', 'feta', 'mint', 'lamb', 'chocolate', 'orange', 'yogurt'],
    storage: 'Whole at room temp up to 1 month, refrigerate up to 2 months. Seeds keep 5 days.',
    tips: 'To seed: score quarters, submerge in water, break apart. Seeds sink, pith floats.',
  },
  {
    id: 'parsnip',
    name: 'Parsnips',
    category: 'vegetable',
    peakMonths: [11, 12, 1, 2],
    availableMonths: [10, 11, 12, 1, 2, 3],
    description: 'Sweet, earthy root vegetable that improves with frost. Like carrots but more complex.',
    pairings: ['maple', 'brown butter', 'thyme', 'apple', 'nutmeg', 'cream', 'bacon'],
    storage: 'Refrigerate in plastic bag up to 3 weeks. Trim greens if attached.',
    tips: 'Roast to caramelize natural sugars. Large parsnips may have woody cores to remove.',
  },
];

// Month names
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const monthAbbrev = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Season configuration
const seasons: { name: Season; months: Month[]; color: string; icon: string }[] = [
  { name: 'spring', months: [3, 4, 5], color: 'bg-green-100 text-green-800', icon: '🌷' },
  { name: 'summer', months: [6, 7, 8], color: 'bg-yellow-100 text-yellow-800', icon: '☀️' },
  { name: 'fall', months: [9, 10, 11], color: 'bg-orange-100 text-orange-800', icon: '🍂' },
  { name: 'winter', months: [12, 1, 2], color: 'bg-blue-100 text-blue-800', icon: '❄️' },
];

// Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

export default function SeasonalGuide() {
  const currentMonth = new Date().getMonth() + 1 as Month;
  const [selectedMonth, setSelectedMonth] = useState<Month>(currentMonth);
  const [categoryFilter, setCategoryFilter] = useState<ProduceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduce, setSelectedProduce] = useState<SeasonalProduce | null>(null);

  // Get current season
  const currentSeason = useMemo(() => {
    return seasons.find(s => s.months.includes(selectedMonth)) || seasons[0];
  }, [selectedMonth]);

  // Filter produce
  const filteredProduce = useMemo(() => {
    return produceDatabase.filter(produce => {
      // Month filter
      const inSeason = produce.peakMonths.includes(selectedMonth) ||
                       produce.availableMonths.includes(selectedMonth);
      if (!inSeason) return false;

      // Category filter
      if (categoryFilter !== 'all' && produce.category !== categoryFilter) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return produce.name.toLowerCase().includes(query) ||
               produce.pairings.some(p => p.toLowerCase().includes(query));
      }

      return true;
    }).sort((a, b) => {
      // Sort: peak month items first
      const aIsPeak = a.peakMonths.includes(selectedMonth);
      const bIsPeak = b.peakMonths.includes(selectedMonth);
      if (aIsPeak && !bIsPeak) return -1;
      if (!aIsPeak && bIsPeak) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [selectedMonth, categoryFilter, searchQuery]);

  // Group by peak vs available
  const peakProduce = filteredProduce.filter(p => p.peakMonths.includes(selectedMonth));
  const availableProduce = filteredProduce.filter(p => !p.peakMonths.includes(selectedMonth));

  const categoryColors: Record<ProduceCategory, string> = {
    vegetable: 'bg-green-100 text-green-700',
    fruit: 'bg-red-100 text-red-700',
    herb: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Month Selector */}
      <div className="card bg-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentSeason.icon}</span>
            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] capitalize">
                {monthNames[selectedMonth - 1]} Produce
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                {peakProduce.length} at peak, {availableProduce.length} available
              </p>
            </div>
          </div>

          <div className={cn("px-3 py-1 rounded-full text-sm font-medium capitalize", currentSeason.color)}>
            {currentSeason.name}
          </div>
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-6 md:grid-cols-12 gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
            const season = seasons.find(s => s.months.includes(month as Month));
            const isSelected = month === selectedMonth;
            const isCurrent = month === currentMonth;

            return (
              <button
                key={month}
                onClick={() => setSelectedMonth(month as Month)}
                className={cn(
                  "py-2 px-1 rounded-lg text-sm font-medium transition-all",
                  isSelected
                    ? "bg-[var(--color-wine)] text-white"
                    : "hover:bg-[var(--color-cream)]",
                  isCurrent && !isSelected && "ring-2 ring-[var(--color-wine)] ring-offset-1"
                )}
              >
                {monthAbbrev[month - 1]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-white mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search produce or pairings..."
                className="w-full pl-10 pr-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {(['all', 'vegetable', 'fruit', 'herb'] as const).map(category => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize",
                  categoryFilter === category
                    ? "bg-[var(--color-wine)] text-white"
                    : "bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]"
                )}
              >
                {category === 'all' ? 'All' : category + 's'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Produce List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Peak Season */}
          {peakProduce.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
                <LeafIcon />
                At Peak Season
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {peakProduce.map(produce => (
                  <button
                    key={produce.id}
                    onClick={() => setSelectedProduce(produce)}
                    className={cn(
                      "text-left p-4 rounded-xl border-2 transition-all hover:shadow-md",
                      selectedProduce?.id === produce.id
                        ? "border-[var(--color-wine)] bg-[var(--color-wine-glow)]"
                        : "border-[var(--color-cream-dark)] hover:border-[var(--color-wine)]"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-[var(--text-primary)]">{produce.name}</h4>
                      <span className={cn("px-2 py-0.5 text-xs rounded-full", categoryColors[produce.category])}>
                        {produce.category}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-2">
                      {produce.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {produce.pairings.slice(0, 4).map(pairing => (
                        <span key={pairing} className="px-2 py-0.5 text-xs bg-[var(--color-cream)] rounded text-[var(--text-muted)]">
                          {pairing}
                        </span>
                      ))}
                      {produce.pairings.length > 4 && (
                        <span className="text-xs text-[var(--text-muted)]">+{produce.pairings.length - 4} more</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Available */}
          {availableProduce.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-[var(--text-secondary)] mb-3">
                <CalendarIcon />
                Also Available
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableProduce.map(produce => (
                  <button
                    key={produce.id}
                    onClick={() => setSelectedProduce(produce)}
                    className={cn(
                      "text-left p-4 rounded-xl border transition-all hover:shadow-md",
                      selectedProduce?.id === produce.id
                        ? "border-[var(--color-wine)] bg-[var(--color-wine-glow)]"
                        : "border-[var(--color-cream-dark)] hover:border-[var(--color-wine)]"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-[var(--text-primary)]">{produce.name}</h4>
                      <span className={cn("px-2 py-0.5 text-xs rounded-full", categoryColors[produce.category])}>
                        {produce.category}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                      {produce.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredProduce.length === 0 && (
            <div className="text-center py-12 text-[var(--text-muted)]">
              <p>No produce found matching your criteria</p>
              <button
                onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
                className="mt-2 text-[var(--color-wine)] hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div>
          <div className="card bg-white sticky top-4">
            {selectedProduce ? (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                      {selectedProduce.name}
                    </h3>
                    <span className={cn("inline-block mt-1 px-2 py-0.5 text-xs rounded-full capitalize", categoryColors[selectedProduce.category])}>
                      {selectedProduce.category}
                    </span>
                  </div>
                </div>

                <p className="text-[var(--text-secondary)] mb-4">
                  {selectedProduce.description}
                </p>

                {/* Availability chart */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Availability</h4>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => {
                      const isPeak = selectedProduce.peakMonths.includes(month as Month);
                      const isAvailable = selectedProduce.availableMonths.includes(month as Month);
                      return (
                        <div
                          key={month}
                          className={cn(
                            "flex-1 h-6 rounded text-[9px] flex items-center justify-center font-medium",
                            isPeak ? "bg-[var(--color-wine)] text-white" :
                            isAvailable ? "bg-green-200 text-green-800" :
                            "bg-gray-100 text-gray-400"
                          )}
                          title={`${monthAbbrev[month - 1]}: ${isPeak ? 'Peak' : isAvailable ? 'Available' : 'Out of season'}`}
                        >
                          {monthAbbrev[month - 1].charAt(0)}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-[var(--color-wine)]" /> Peak
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-green-200" /> Available
                    </span>
                  </div>
                </div>

                {/* Pairings */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Pairs Well With</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedProduce.pairings.map(pairing => (
                      <span key={pairing} className="px-2 py-1 text-sm bg-[var(--color-cream)] rounded-lg text-[var(--text-secondary)]">
                        {pairing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Storage */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">Storage</h4>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedProduce.storage}</p>
                </div>

                {/* Tips */}
                <div className="p-3 bg-amber-50 rounded-lg">
                  <h4 className="text-sm font-medium text-amber-800 mb-1">Pro Tip</h4>
                  <p className="text-sm text-amber-700">{selectedProduce.tips}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--text-muted)]">
                <LeafIcon />
                <p className="mt-2">Select a produce item to see details, pairings, and storage tips</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
