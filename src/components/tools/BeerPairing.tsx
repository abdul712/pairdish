/**
 * Beer & Food Pairing Guide
 *
 * Match beer styles with complementary dishes.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

interface BeerStyle {
  id: string;
  name: string;
  category: 'lager' | 'ale' | 'stout-porter' | 'wheat' | 'sour' | 'specialty';
  origin: string;
  abv: string;
  ibu: string;
  color: string;
  flavor: string;
  description: string;
  bgColor: string;
}

interface FoodPairing {
  category: string;
  items: string[];
}

interface BeerPairings {
  beerId: string;
  proteins: string[];
  cuisines: string[];
  dishes: string[];
  cheeses: string[];
  desserts: string[];
  avoid: string[];
  tips: string;
}

const beerStyles: BeerStyle[] = [
  {
    id: 'pilsner',
    name: 'Pilsner',
    category: 'lager',
    origin: 'Czech Republic/Germany',
    abv: '4-5.5%',
    ibu: '25-45',
    color: 'Pale Gold',
    flavor: 'Crisp, clean, mild hop bitterness, grainy',
    description: 'Light, refreshing lager with delicate hop character. Perfect for casual dining.',
    bgColor: 'bg-yellow-100',
  },
  {
    id: 'lager',
    name: 'American Lager',
    category: 'lager',
    origin: 'United States',
    abv: '4-5%',
    ibu: '8-18',
    color: 'Pale Straw',
    flavor: 'Light, mild, slightly sweet, minimal hops',
    description: 'Light, easy-drinking beer that pairs well with lighter fare.',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'pale-ale',
    name: 'Pale Ale',
    category: 'ale',
    origin: 'England/USA',
    abv: '4.5-6.5%',
    ibu: '30-50',
    color: 'Amber to Copper',
    flavor: 'Balanced malt and hops, citrus, pine notes',
    description: 'Medium-bodied with hoppy character balanced by malt sweetness.',
    bgColor: 'bg-amber-200',
  },
  {
    id: 'ipa',
    name: 'IPA (India Pale Ale)',
    category: 'ale',
    origin: 'England/USA',
    abv: '5.5-7.5%',
    ibu: '40-70',
    color: 'Golden to Amber',
    flavor: 'Strong hop bitterness, citrus, tropical, piney',
    description: 'Bold, hoppy ale with intense flavor that stands up to bold foods.',
    bgColor: 'bg-orange-200',
  },
  {
    id: 'belgian-witbier',
    name: 'Belgian Witbier',
    category: 'wheat',
    origin: 'Belgium',
    abv: '4.5-5.5%',
    ibu: '10-20',
    color: 'Hazy Pale',
    flavor: 'Citrusy, coriander, orange peel, wheat',
    description: 'Refreshing wheat beer with spice notes from coriander and orange peel.',
    bgColor: 'bg-amber-100',
  },
  {
    id: 'hefeweizen',
    name: 'Hefeweizen',
    category: 'wheat',
    origin: 'Germany',
    abv: '4.5-5.5%',
    ibu: '8-15',
    color: 'Pale, Cloudy',
    flavor: 'Banana, clove, wheat, slightly tart',
    description: 'German wheat beer with distinctive banana and clove yeast character.',
    bgColor: 'bg-yellow-200',
  },
  {
    id: 'stout',
    name: 'Stout',
    category: 'stout-porter',
    origin: 'Ireland/England',
    abv: '4-7%',
    ibu: '25-45',
    color: 'Black',
    flavor: 'Roasted, coffee, chocolate, creamy',
    description: 'Dark, rich beer with roasted flavors. Dry Irish stouts to sweet milk stouts.',
    bgColor: 'bg-stone-800',
  },
  {
    id: 'porter',
    name: 'Porter',
    category: 'stout-porter',
    origin: 'England',
    abv: '4.5-6.5%',
    ibu: '18-35',
    color: 'Dark Brown to Black',
    flavor: 'Chocolate, caramel, toffee, light roast',
    description: 'Dark ale with chocolate and caramel notes, lighter than stout.',
    bgColor: 'bg-stone-700',
  },
  {
    id: 'brown-ale',
    name: 'Brown Ale',
    category: 'ale',
    origin: 'England/USA',
    abv: '4-6%',
    ibu: '15-30',
    color: 'Amber to Brown',
    flavor: 'Nutty, caramel, toffee, mild',
    description: 'Malty, nutty ale with caramel sweetness and mild hop presence.',
    bgColor: 'bg-amber-600',
  },
  {
    id: 'belgian-dubbel',
    name: 'Belgian Dubbel',
    category: 'ale',
    origin: 'Belgium',
    abv: '6-7.5%',
    ibu: '15-25',
    color: 'Dark Amber to Brown',
    flavor: 'Dried fruit, caramel, spice, complex',
    description: 'Rich Belgian ale with dark fruit, caramel, and complex spice notes.',
    bgColor: 'bg-amber-700',
  },
  {
    id: 'belgian-tripel',
    name: 'Belgian Tripel',
    category: 'ale',
    origin: 'Belgium',
    abv: '7.5-9.5%',
    ibu: '20-40',
    color: 'Pale Gold',
    flavor: 'Fruity, spicy, honey, strong',
    description: 'Strong, pale Belgian ale with complex fruity and spicy character.',
    bgColor: 'bg-yellow-200',
  },
  {
    id: 'sour-ale',
    name: 'Sour Ale / Gose',
    category: 'sour',
    origin: 'Belgium/Germany',
    abv: '3-6%',
    ibu: '0-10',
    color: 'Varies',
    flavor: 'Tart, fruity, sometimes salty, funky',
    description: 'Tart, acidic beers ranging from mild to intensely sour.',
    bgColor: 'bg-pink-100',
  },
  {
    id: 'amber-ale',
    name: 'Amber Ale',
    category: 'ale',
    origin: 'USA',
    abv: '4.5-6%',
    ibu: '25-40',
    color: 'Amber to Copper',
    flavor: 'Caramel, toasty, balanced hops',
    description: 'American-style ale with caramel malt character and moderate hops.',
    bgColor: 'bg-orange-300',
  },
  {
    id: 'saison',
    name: 'Saison',
    category: 'specialty',
    origin: 'Belgium',
    abv: '5-8%',
    ibu: '20-35',
    color: 'Pale to Amber',
    flavor: 'Earthy, peppery, fruity, dry',
    description: 'Rustic Belgian farmhouse ale with earthy, spicy character.',
    bgColor: 'bg-amber-200',
  },
];

const pairings: BeerPairings[] = [
  {
    beerId: 'pilsner',
    proteins: ['Grilled chicken', 'Fish', 'Shellfish', 'Pork', 'Sausages'],
    cuisines: ['German', 'Czech', 'American', 'Mexican'],
    dishes: ['Fish tacos', 'Caesar salad', 'Hot dogs', 'Fried calamari', 'Light pasta'],
    cheeses: ['Havarti', 'Mild cheddar', 'Gruyère', 'Goat cheese'],
    desserts: ['Lemon tart', 'Shortbread', 'Fruit sorbet'],
    avoid: ['Very spicy dishes', 'Heavy stews', 'Rich chocolate desserts'],
    tips: 'Pilsner\'s clean, crisp character makes it perfect for lighter fare and outdoor dining.',
  },
  {
    beerId: 'lager',
    proteins: ['Burgers', 'Hot dogs', 'Grilled chicken', 'Fish'],
    cuisines: ['American', 'Mexican', 'Asian'],
    dishes: ['Pizza', 'Nachos', 'Wings', 'Fried foods', 'BBQ'],
    cheeses: ['American cheese', 'Mild cheddar', 'Monterey Jack'],
    desserts: ['Apple pie', 'Light fruit desserts'],
    avoid: ['Complex rich dishes', 'Strong blue cheeses', 'Intensely spicy food'],
    tips: 'The neutral profile of American lager makes it a versatile partner for casual food.',
  },
  {
    beerId: 'pale-ale',
    proteins: ['Grilled chicken', 'Pork chops', 'Salmon', 'Turkey'],
    cuisines: ['American', 'British', 'Mexican', 'Indian'],
    dishes: ['Burgers', 'Fish and chips', 'Fajitas', 'Tandoori chicken', 'Pizza'],
    cheeses: ['Cheddar', 'Gouda', 'Monterey Jack', 'Pepper Jack'],
    desserts: ['Carrot cake', 'Apple crisp', 'Pumpkin pie'],
    avoid: ['Very delicate dishes', 'Light salads', 'Subtle seafood'],
    tips: 'Pale ale\'s balanced character makes it one of the most food-friendly beer styles.',
  },
  {
    beerId: 'ipa',
    proteins: ['Spicy grilled meats', 'BBQ ribs', 'Buffalo wings', 'Curry'],
    cuisines: ['Indian', 'Thai', 'Mexican', 'American BBQ'],
    dishes: ['Pad Thai', 'Tacos al pastor', 'Jerk chicken', 'Spicy pizza', 'Nachos'],
    cheeses: ['Blue cheese', 'Sharp cheddar', 'Pepper Jack', 'Gorgonzola'],
    desserts: ['Carrot cake', 'Citrus desserts', 'Cheesecake with fruit'],
    avoid: ['Delicate fish', 'Light salads', 'Subtle flavored dishes'],
    tips: 'IPA\'s bold hops pair beautifully with spicy and bold flavored foods. The bitterness cuts through fat.',
  },
  {
    beerId: 'belgian-witbier',
    proteins: ['Mussels', 'Shrimp', 'Light fish', 'Chicken'],
    cuisines: ['Belgian', 'French', 'Mediterranean', 'Asian'],
    dishes: ['Moules frites', 'Sushi', 'Salads', 'Seafood pasta', 'Thai dishes'],
    cheeses: ['Goat cheese', 'Brie', 'Fresh mozzarella', 'Feta'],
    desserts: ['Orange cake', 'Lemon bars', 'Fruit tarts'],
    avoid: ['Heavy red meats', 'Very rich sauces', 'Strong blue cheese'],
    tips: 'The citrus and spice notes in witbier make it perfect for seafood and Asian cuisine.',
  },
  {
    beerId: 'hefeweizen',
    proteins: ['Weisswurst', 'Grilled chicken', 'Pork', 'Seafood'],
    cuisines: ['German', 'Mediterranean', 'Asian'],
    dishes: ['Pretzels', 'Eggs Benedict', 'Light salads', 'Fish tacos', 'Currywurst'],
    cheeses: ['Fresh cheeses', 'Chevre', 'Brie', 'Mascarpone'],
    desserts: ['Banana desserts', 'Fruit salad', 'Clove-spiced cake'],
    avoid: ['Heavy beef dishes', 'Very bitter greens', 'Strong aged cheese'],
    tips: 'Hefeweizen\'s banana and clove notes shine at brunch and with lighter Germanic fare.',
  },
  {
    beerId: 'stout',
    proteins: ['Oysters', 'Beef stew', 'Roast beef', 'BBQ ribs', 'Lamb'],
    cuisines: ['Irish', 'British', 'American BBQ', 'Mexican'],
    dishes: ['Shepherd\'s pie', 'Irish stew', 'Chocolate chili', 'Braised short ribs'],
    cheeses: ['Aged cheddar', 'Stilton', 'Aged Gouda', 'Parmesan'],
    desserts: ['Chocolate cake', 'Brownies', 'Coffee desserts', 'Cheesecake', 'Tiramisu'],
    avoid: ['Light fish', 'Delicate salads', 'Light citrus dishes'],
    tips: 'Stout\'s roasted character pairs brilliantly with oysters, chocolate, and roasted meats.',
  },
  {
    beerId: 'porter',
    proteins: ['Pork', 'Beef', 'Duck', 'Smoked meats'],
    cuisines: ['American', 'British', 'German', 'Mexican'],
    dishes: ['BBQ pulled pork', 'Smoked brisket', 'Mole', 'Grilled sausages'],
    cheeses: ['Smoked Gouda', 'Aged cheddar', 'Gruyère', 'Manchego'],
    desserts: ['Chocolate desserts', 'Pecan pie', 'Coffee cake', 'Bread pudding'],
    avoid: ['Very light fish', 'Delicate flavors', 'Light summer salads'],
    tips: 'Porter\'s chocolate and caramel notes complement smoky and sweet BBQ flavors.',
  },
  {
    beerId: 'brown-ale',
    proteins: ['Roast chicken', 'Pork', 'Turkey', 'Sausages'],
    cuisines: ['British', 'American', 'German'],
    dishes: ['Bangers and mash', 'Meat pies', 'Roast dinners', 'Grilled vegetables'],
    cheeses: ['Aged cheddar', 'Gruyère', 'Gouda', 'Nutty alpine cheeses'],
    desserts: ['Nut desserts', 'Caramel apple', 'Pecan pie', 'Toffee pudding'],
    avoid: ['Very spicy dishes', 'Light seafood', 'Strong blue cheese'],
    tips: 'Brown ale\'s nutty, caramel character is perfect for comfort food and fall dishes.',
  },
  {
    beerId: 'belgian-dubbel',
    proteins: ['Roast duck', 'Lamb', 'Pork tenderloin', 'Sausages'],
    cuisines: ['Belgian', 'French', 'German'],
    dishes: ['Carbonnade', 'Rabbit stew', 'Duck confit', 'Roasted root vegetables'],
    cheeses: ['Aged Gouda', 'Chimay', 'Époisses', 'Aged cheddar'],
    desserts: ['Bread pudding', 'Dried fruit desserts', 'Biscotti', 'Spiced cakes'],
    avoid: ['Very light dishes', 'Raw fish', 'Citrus-forward salads'],
    tips: 'Dubbel\'s rich maltiness and dried fruit notes pair wonderfully with Belgian cuisine.',
  },
  {
    beerId: 'belgian-tripel',
    proteins: ['Shellfish', 'Chicken', 'Pork', 'Rich fish'],
    cuisines: ['Belgian', 'French', 'Mediterranean'],
    dishes: ['Mussels', 'Lobster', 'Creamy pasta', 'Risotto', 'Roast chicken'],
    cheeses: ['Brie', 'Camembert', 'Aged Gouda', 'Gruyère'],
    desserts: ['Crème brûlée', 'Fruit tarts', 'White chocolate desserts'],
    avoid: ['Very spicy foods', 'Heavy beef stews', 'Dark chocolate'],
    tips: 'Tripel\'s complex fruity and spicy character elevates refined dishes.',
  },
  {
    beerId: 'sour-ale',
    proteins: ['Shellfish', 'Light fish', 'Pork belly', 'Duck'],
    cuisines: ['French', 'Belgian', 'Japanese', 'Mediterranean'],
    dishes: ['Ceviche', 'Salads with vinaigrette', 'Charcuterie', 'Sushi', 'Goat cheese salad'],
    cheeses: ['Goat cheese', 'Fresh cheeses', 'Brie', 'Aged cheeses'],
    desserts: ['Fruit tarts', 'Cheesecake', 'Sorbet', 'Berry desserts'],
    avoid: ['Sweet dishes', 'Heavy cream sauces', 'Very rich desserts'],
    tips: 'Sour beer\'s acidity works like wine—cutting through fat and complementing rich dishes.',
  },
  {
    beerId: 'amber-ale',
    proteins: ['Grilled meats', 'Roast chicken', 'Pork', 'BBQ'],
    cuisines: ['American', 'Mexican', 'British'],
    dishes: ['Burgers', 'Pizza', 'Tacos', 'Grilled vegetables', 'Mac and cheese'],
    cheeses: ['Cheddar', 'Gouda', 'Smoked cheeses', 'Colby'],
    desserts: ['Caramel desserts', 'Apple pie', 'Bread pudding'],
    avoid: ['Delicate seafood', 'Light salads', 'Subtle flavors'],
    tips: 'Amber ale\'s caramel maltiness is a crowd-pleaser with American classics.',
  },
  {
    beerId: 'saison',
    proteins: ['Chicken', 'Pork', 'Shellfish', 'Game birds'],
    cuisines: ['Belgian', 'French', 'Mediterranean', 'Farm-to-table'],
    dishes: ['Roast chicken', 'Mussels', 'Charcuterie', 'Grilled vegetables', 'Salads'],
    cheeses: ['Farmhouse cheeses', 'Aged Gouda', 'Taleggio', 'Raclette'],
    desserts: ['Fruit desserts', 'Honey cakes', 'Light pastries'],
    avoid: ['Very heavy dishes', 'Sweet BBQ', 'Rich chocolate'],
    tips: 'Saison\'s dry, earthy character makes it incredibly food-friendly, especially with rustic cuisine.',
  },
];

const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
  proteins: { bg: 'bg-rose-50', text: 'text-rose-700', icon: '🥩' },
  cuisines: { bg: 'bg-orange-50', text: 'text-orange-700', icon: '🌍' },
  dishes: { bg: 'bg-amber-50', text: 'text-amber-700', icon: '🍽️' },
  cheeses: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: '🧀' },
  desserts: { bg: 'bg-pink-50', text: 'text-pink-700', icon: '🍰' },
  avoid: { bg: 'bg-red-50', text: 'text-red-700', icon: '⚠️' },
};

const categoryLabels: Record<string, string> = {
  proteins: 'Best Proteins',
  cuisines: 'Best Cuisines',
  dishes: 'Recommended Dishes',
  cheeses: 'Cheese Pairings',
  desserts: 'Dessert Pairings',
  avoid: 'Best Avoided',
};

export default function BeerPairing() {
  const [selectedBeer, setSelectedBeer] = useState<string>('ipa');
  const [categoryFilter, setCategoryFilter] = useState<BeerStyle['category'] | 'all'>('all');

  const filteredBeers = useMemo(() => {
    if (categoryFilter === 'all') return beerStyles;
    return beerStyles.filter((beer) => beer.category === categoryFilter);
  }, [categoryFilter]);

  const selectedBeerData = beerStyles.find((b) => b.id === selectedBeer);
  const selectedPairings = pairings.find((p) => p.beerId === selectedBeer);

  const categories: { value: BeerStyle['category'] | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'lager', label: 'Lagers' },
    { value: 'ale', label: 'Ales' },
    { value: 'wheat', label: 'Wheat Beers' },
    { value: 'stout-porter', label: 'Stouts & Porters' },
    { value: 'sour', label: 'Sours' },
    { value: 'specialty', label: 'Specialty' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Beer Selection Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-[var(--shadow-medium)] p-5 sticky top-4">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
              Select a Beer Style
            </h2>

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

            {/* Beer List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredBeers.map((beer) => (
                <button
                  key={beer.id}
                  onClick={() => setSelectedBeer(beer.id)}
                  className={cn(
                    'w-full text-left p-3 rounded-xl transition-all',
                    selectedBeer === beer.id
                      ? 'bg-[var(--color-wine-glow)] border-2 border-[var(--color-wine)]'
                      : 'bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] border-2 border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', beer.bgColor)}>
                      🍺
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[var(--text-primary)] text-sm">
                        {beer.name}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {beer.abv} ABV • {beer.ibu} IBU
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pairing Results */}
        <div className="lg:col-span-2">
          {selectedBeerData && selectedPairings && (
            <>
              {/* Beer Info Card */}
              <div className="bg-white rounded-2xl shadow-[var(--shadow-medium)] p-6 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn('w-16 h-16 rounded-xl flex items-center justify-center text-3xl', selectedBeerData.bgColor)}>
                    🍺
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                      {selectedBeerData.name}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-[var(--color-cream)] rounded-full text-[var(--text-secondary)]">
                        📍 {selectedBeerData.origin}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-[var(--color-cream)] rounded-full text-[var(--text-secondary)]">
                        🎨 {selectedBeerData.color}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[var(--text-secondary)] mb-4">{selectedBeerData.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-[var(--color-cream)] rounded-lg">
                    <div className="text-lg font-bold text-[var(--color-wine)]">{selectedBeerData.abv}</div>
                    <div className="text-xs text-[var(--text-muted)]">ABV</div>
                  </div>
                  <div className="text-center p-3 bg-[var(--color-cream)] rounded-lg">
                    <div className="text-lg font-bold text-[var(--color-wine)]">{selectedBeerData.ibu}</div>
                    <div className="text-xs text-[var(--text-muted)]">IBU</div>
                  </div>
                  <div className="text-center p-3 bg-[var(--color-cream)] rounded-lg">
                    <div className="text-lg font-bold text-[var(--color-wine)]">{selectedBeerData.color}</div>
                    <div className="text-xs text-[var(--text-muted)]">Color</div>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium text-[var(--text-muted)]">Flavor Profile</span>
                  <p className="text-sm text-[var(--text-primary)]">{selectedBeerData.flavor}</p>
                </div>
              </div>

              {/* Pairings Grid */}
              <div className="bg-white rounded-2xl shadow-[var(--shadow-medium)] p-6">
                <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
                  Perfect Pairings for {selectedBeerData.name}
                </h3>

                {/* Pairing Tip */}
                <div className="bg-amber-50 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <p className="text-sm text-amber-800">{selectedPairings.tips}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.keys(categoryColors) as Array<keyof typeof categoryColors>).map((key) => {
                    const items = selectedPairings[key as keyof BeerPairings];
                    if (!items || !Array.isArray(items) || items.length === 0) return null;

                    const { bg, text, icon } = categoryColors[key];

                    return (
                      <div key={key} className={cn('rounded-xl p-4', bg)}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">{icon}</span>
                          <h4 className={cn('font-medium', text)}>
                            {categoryLabels[key]}
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(items as string[]).map((item) => (
                            <span
                              key={item}
                              className={cn(
                                'text-xs px-2 py-1 rounded-full',
                                key === 'avoid' ? 'bg-red-100 text-red-700' : 'bg-white/70 text-[var(--text-secondary)]'
                              )}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Pairing Tips */}
      <div className="mt-8 bg-amber-50 rounded-xl p-6">
        <h3 className="font-display font-semibold text-amber-800 mb-4">
          Beer & Food Pairing Principles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-amber-900">
          <div className="flex gap-3">
            <span className="text-xl">⚖️</span>
            <p>
              <strong>Match Intensity:</strong> Light beers with light foods, bold beers
              with bold foods. A delicate pilsner won't stand up to spicy BBQ.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">✂️</span>
            <p>
              <strong>Cut Through Fat:</strong> Hoppy, bitter, and carbonated beers cut
              through rich, fatty foods. IPA with buffalo wings is a classic combo.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">🔥</span>
            <p>
              <strong>Complement or Contrast:</strong> Either match flavors (chocolate stout
              with chocolate cake) or contrast them (sweet beer with salty food).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
