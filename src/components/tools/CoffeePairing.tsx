/**
 * Coffee & Dessert Pairing Guide
 *
 * Match coffee roasts with desserts and pastries.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

interface Coffee {
  id: string;
  name: string;
  category: 'roast' | 'origin' | 'preparation';
  roastLevel: 'light' | 'medium' | 'medium-dark' | 'dark';
  flavor: string[];
  acidity: 'high' | 'medium' | 'low';
  body: 'light' | 'medium' | 'full';
  description: string;
  bgColor: string;
}

interface CoffeePairings {
  coffeeId: string;
  pastries: string[];
  cakes: string[];
  cookies: string[];
  chocolate: string[];
  fruits: string[];
  other: string[];
  avoid: string[];
  tips: string;
}

const coffees: Coffee[] = [
  {
    id: 'light-roast',
    name: 'Light Roast',
    category: 'roast',
    roastLevel: 'light',
    flavor: ['Bright', 'Fruity', 'Floral', 'Tea-like'],
    acidity: 'high',
    body: 'light',
    description: 'Retains most origin characteristics with bright, complex flavors.',
    bgColor: 'bg-amber-100',
  },
  {
    id: 'medium-roast',
    name: 'Medium Roast',
    category: 'roast',
    roastLevel: 'medium',
    flavor: ['Balanced', 'Sweet', 'Caramel', 'Nutty'],
    acidity: 'medium',
    body: 'medium',
    description: 'Balanced flavor between origin and roast characteristics.',
    bgColor: 'bg-amber-200',
  },
  {
    id: 'dark-roast',
    name: 'Dark Roast',
    category: 'roast',
    roastLevel: 'dark',
    flavor: ['Bold', 'Smoky', 'Bittersweet', 'Chocolate'],
    acidity: 'low',
    body: 'full',
    description: 'Rich, bold flavors with prominent roast characteristics.',
    bgColor: 'bg-amber-700',
  },
  {
    id: 'espresso',
    name: 'Espresso',
    category: 'preparation',
    roastLevel: 'medium-dark',
    flavor: ['Intense', 'Crema', 'Caramel', 'Bittersweet'],
    acidity: 'medium',
    body: 'full',
    description: 'Concentrated coffee with rich crema and intense flavor.',
    bgColor: 'bg-stone-600',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'preparation',
    roastLevel: 'medium-dark',
    flavor: ['Creamy', 'Balanced', 'Mild', 'Sweet'],
    acidity: 'low',
    body: 'medium',
    description: 'Equal parts espresso, steamed milk, and foam.',
    bgColor: 'bg-orange-200',
  },
  {
    id: 'latte',
    name: 'Caffè Latte',
    category: 'preparation',
    roastLevel: 'medium',
    flavor: ['Milky', 'Smooth', 'Subtle', 'Sweet'],
    acidity: 'low',
    body: 'light',
    description: 'Espresso with lots of steamed milk for a smooth taste.',
    bgColor: 'bg-orange-100',
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    category: 'preparation',
    roastLevel: 'medium',
    flavor: ['Smooth', 'Sweet', 'Chocolate', 'Low acidity'],
    acidity: 'low',
    body: 'medium',
    description: 'Coffee steeped in cold water for 12-24 hours.',
    bgColor: 'bg-stone-400',
  },
  {
    id: 'pour-over',
    name: 'Pour Over',
    category: 'preparation',
    roastLevel: 'light',
    flavor: ['Clean', 'Complex', 'Origin-forward', 'Bright'],
    acidity: 'high',
    body: 'light',
    description: 'Manually brewed coffee highlighting origin flavors.',
    bgColor: 'bg-amber-100',
  },
  {
    id: 'french-press',
    name: 'French Press',
    category: 'preparation',
    roastLevel: 'medium-dark',
    flavor: ['Full-bodied', 'Rich', 'Oily', 'Bold'],
    acidity: 'low',
    body: 'full',
    description: 'Immersion brewing for rich, full-bodied coffee.',
    bgColor: 'bg-amber-400',
  },
  {
    id: 'mocha',
    name: 'Caffè Mocha',
    category: 'preparation',
    roastLevel: 'medium-dark',
    flavor: ['Chocolate', 'Sweet', 'Creamy', 'Indulgent'],
    acidity: 'low',
    body: 'full',
    description: 'Espresso with chocolate, steamed milk, and whipped cream.',
    bgColor: 'bg-stone-500',
  },
  {
    id: 'ethiopian',
    name: 'Ethiopian (Origin)',
    category: 'origin',
    roastLevel: 'light',
    flavor: ['Fruity', 'Floral', 'Berry', 'Wine-like'],
    acidity: 'high',
    body: 'light',
    description: 'Complex fruity and floral notes from coffee\'s birthplace.',
    bgColor: 'bg-pink-100',
  },
  {
    id: 'colombian',
    name: 'Colombian (Origin)',
    category: 'origin',
    roastLevel: 'medium',
    flavor: ['Balanced', 'Nutty', 'Caramel', 'Mild'],
    acidity: 'medium',
    body: 'medium',
    description: 'Smooth, balanced coffee with mild sweetness.',
    bgColor: 'bg-green-100',
  },
  {
    id: 'sumatra',
    name: 'Sumatran (Origin)',
    category: 'origin',
    roastLevel: 'dark',
    flavor: ['Earthy', 'Herbal', 'Spicy', 'Low acidity'],
    acidity: 'low',
    body: 'full',
    description: 'Full-bodied with earthy, complex flavor profile.',
    bgColor: 'bg-emerald-200',
  },
];

const pairings: CoffeePairings[] = [
  {
    coffeeId: 'light-roast',
    pastries: ['Croissants', 'Danish pastries', 'Scones', 'Fruit tarts'],
    cakes: ['Angel food cake', 'Lemon pound cake', 'Fruit sponge', 'Chiffon cake'],
    cookies: ['Shortbread', 'Madeleines', 'Vanilla cookies', 'Biscotti'],
    chocolate: ['White chocolate', 'Milk chocolate truffles'],
    fruits: ['Fresh berries', 'Stone fruits', 'Citrus', 'Light fruit salad'],
    other: ['Yogurt parfait', 'Light cheese danish', 'Fruit crepes'],
    avoid: ['Heavy chocolate cakes', 'Rich caramel desserts', 'Dense brownies'],
    tips: 'Light roasts have delicate flavors—pair with lighter desserts that won\'t overwhelm the coffee\'s nuances.',
  },
  {
    coffeeId: 'medium-roast',
    pastries: ['Cinnamon rolls', 'Almond croissants', 'Coffee cake', 'Brioche'],
    cakes: ['Carrot cake', 'Banana bread', 'Apple cake', 'Pumpkin bread'],
    cookies: ['Oatmeal raisin', 'Snickerdoodles', 'Almond cookies', 'Biscotti'],
    chocolate: ['Milk chocolate', 'Caramel chocolates', 'Chocolate chip'],
    fruits: ['Baked apples', 'Poached pears', 'Dried fruits'],
    other: ['Crème brûlée', 'Flan', 'Rice pudding', 'Bread pudding'],
    avoid: ['Very tart citrus desserts', 'Overly complex flavor profiles'],
    tips: 'The most versatile roast level—pairs well with a wide range of classic desserts.',
  },
  {
    coffeeId: 'dark-roast',
    pastries: ['Chocolate croissants', 'Pain au chocolat', 'Maple pecan danish'],
    cakes: ['Chocolate cake', 'Flourless chocolate cake', 'German chocolate cake'],
    cookies: ['Double chocolate cookies', 'Chocolate chunk', 'Espresso cookies'],
    chocolate: ['Dark chocolate', 'Bittersweet chocolate', 'Chocolate ganache'],
    fruits: ['Dark cherries', 'Figs', 'Dates', 'Chocolate-covered fruits'],
    other: ['Tiramisu', 'Chocolate mousse', 'Affogato', 'Pots de crème'],
    avoid: ['Delicate fruit desserts', 'Light citrus flavors', 'Subtle desserts'],
    tips: 'Dark roast\'s bold flavors stand up to rich chocolate desserts beautifully.',
  },
  {
    coffeeId: 'espresso',
    pastries: ['Italian biscotti', 'Cannoli', 'Sfogliatella', 'Cornetti'],
    cakes: ['Tiramisu', 'Opera cake', 'Espresso cheesecake', 'Coffee genoise'],
    cookies: ['Amaretti', 'Pizzelle', 'Hazelnut biscotti', 'Chocolate-dipped'],
    chocolate: ['Dark chocolate', 'Chocolate truffles', 'Espresso chocolates'],
    fruits: ['Orange segments', 'Candied citrus', 'Dried figs'],
    other: ['Affogato (espresso over gelato)', 'Panna cotta', 'Gelato'],
    avoid: ['Light fruit desserts', 'Overly sweet treats', 'Mild flavored desserts'],
    tips: 'Espresso\'s intensity pairs perfectly with Italian classics and bold chocolate.',
  },
  {
    coffeeId: 'cappuccino',
    pastries: ['Croissants', 'Pain au chocolat', 'Cornetti', 'Brioche'],
    cakes: ['Coffee cake', 'Light chocolate cake', 'Cheesecake'],
    cookies: ['Biscotti', 'Shortbread', 'Amaretti'],
    chocolate: ['Milk chocolate', 'Chocolate-covered espresso beans'],
    fruits: ['Fresh berries', 'Sliced bananas'],
    other: ['Muffins', 'Crepes', 'Belgian waffles'],
    avoid: ['Heavy dense desserts', 'Overly rich chocolate cakes'],
    tips: 'The milk softens the espresso, making cappuccino great for breakfast pastries.',
  },
  {
    coffeeId: 'latte',
    pastries: ['Muffins', 'Scones', 'Light croissants', 'Coffee cake'],
    cakes: ['Vanilla cake', 'Pound cake', 'Light cheesecake'],
    cookies: ['Sugar cookies', 'Vanilla biscotti', 'Butter cookies'],
    chocolate: ['White chocolate', 'Milk chocolate chips'],
    fruits: ['Fresh berries', 'Banana bread'],
    other: ['French toast', 'Pancakes', 'Waffles', 'Oatmeal with toppings'],
    avoid: ['Intense dark chocolate', 'Bitter desserts', 'Strong flavors'],
    tips: 'Lattes are mild and milky—perfect for breakfast or with subtle desserts.',
  },
  {
    coffeeId: 'cold-brew',
    pastries: ['Croissants', 'Danish', 'Light muffins'],
    cakes: ['Cheesecake', 'Coffee cake', 'Pound cake'],
    cookies: ['Chocolate chip', 'Oatmeal', 'Butter cookies'],
    chocolate: ['Chocolate brownies', 'Chocolate mousse', 'Chocolate bark'],
    fruits: ['Fresh berries', 'Stone fruits', 'Tropical fruits'],
    other: ['Ice cream', 'Iced desserts', 'Parfaits', 'Mousse'],
    avoid: ['Hot desserts', 'Very heavy or dense cakes'],
    tips: 'Cold brew\'s smooth, sweet character pairs well with both light and chocolate desserts.',
  },
  {
    coffeeId: 'pour-over',
    pastries: ['Fruit danish', 'Light croissants', 'Scones'],
    cakes: ['Lemon cake', 'Angel food', 'Fruit cake'],
    cookies: ['Shortbread', 'Tea biscuits', 'Madeleines'],
    chocolate: ['White chocolate', 'Light milk chocolate'],
    fruits: ['Fresh berries', 'Citrus segments', 'Stone fruits'],
    other: ['Fruit tarts', 'Light custards', 'Panna cotta'],
    avoid: ['Heavy chocolate desserts', 'Strong flavored sweets'],
    tips: 'Pour over highlights subtle flavors—pair with delicate desserts.',
  },
  {
    coffeeId: 'french-press',
    pastries: ['Chocolate croissants', 'Nut-filled pastries', 'Coffee cake'],
    cakes: ['Chocolate cake', 'Walnut cake', 'Spice cake'],
    cookies: ['Chocolate chunk', 'Nut cookies', 'Gingerbread'],
    chocolate: ['Dark chocolate', 'Chocolate-covered nuts'],
    fruits: ['Dried fruits', 'Figs', 'Dates'],
    other: ['Brownies', 'Bread pudding', 'Sticky toffee pudding'],
    avoid: ['Delicate fruit desserts', 'Light citrus desserts'],
    tips: 'The rich, oily body of French press matches well with hearty desserts.',
  },
  {
    coffeeId: 'mocha',
    pastries: ['Chocolate croissants', 'Chocolate danish', 'Pain au chocolat'],
    cakes: ['Chocolate cake', 'Brownie cake', 'Chocolate cheesecake'],
    cookies: ['Double chocolate', 'Chocolate chip', 'Chocolate sandwich'],
    chocolate: ['Any chocolate!', 'Truffles', 'Chocolate-covered strawberries'],
    fruits: ['Chocolate-dipped fruits', 'Cherries', 'Raspberries'],
    other: ['Chocolate lava cake', 'Chocolate soufflé', 'Brownies'],
    avoid: ['Light citrus desserts', 'Plain fruit', 'Subtle vanilla desserts'],
    tips: 'Mocha is already chocolatey—double down on chocolate for the ultimate indulgence!',
  },
  {
    coffeeId: 'ethiopian',
    pastries: ['Berry scones', 'Fruit danish', 'Light croissants'],
    cakes: ['Berry cake', 'Lemon cake', 'Lavender cake'],
    cookies: ['Shortbread', 'Fruit-filled cookies', 'Earl Grey cookies'],
    chocolate: ['White chocolate with fruit', 'Milk chocolate with berries'],
    fruits: ['Fresh berries', 'Stone fruits', 'Citrus'],
    other: ['Fruit tarts', 'Light crepes', 'Yogurt parfait'],
    avoid: ['Heavy chocolate', 'Rich caramel', 'Dense desserts'],
    tips: 'Ethiopian coffee\'s fruity, floral notes pair beautifully with berry desserts.',
  },
  {
    coffeeId: 'colombian',
    pastries: ['Cinnamon rolls', 'Coffee cake', 'Almond pastries'],
    cakes: ['Carrot cake', 'Banana cake', 'Nut cakes'],
    cookies: ['Oatmeal', 'Snickerdoodles', 'Almond cookies'],
    chocolate: ['Milk chocolate', 'Caramel chocolate'],
    fruits: ['Baked fruits', 'Dried fruits', 'Banana'],
    other: ['Flan', 'Tres leches', 'Churros'],
    avoid: ['Very tart or sour desserts'],
    tips: 'Colombian\'s balanced sweetness works with traditional Latin American desserts.',
  },
  {
    coffeeId: 'sumatra',
    pastries: ['Spiced danish', 'Gingerbread', 'Maple pecan'],
    cakes: ['Gingerbread', 'Spice cake', 'Molasses cake'],
    cookies: ['Ginger snaps', 'Molasses cookies', 'Spiced shortbread'],
    chocolate: ['Dark chocolate', 'Chocolate with chili', 'Earthy chocolates'],
    fruits: ['Figs', 'Dates', 'Prunes'],
    other: ['Bread pudding', 'Dark caramel desserts', 'Sticky toffee'],
    avoid: ['Light citrus', 'Delicate floral desserts', 'Fresh berries'],
    tips: 'Sumatra\'s earthy, spicy notes complement warm spices and dark caramel.',
  },
];

const categoryColors: Record<string, { bg: string; text: string; icon: string }> = {
  pastries: { bg: 'bg-amber-50', text: 'text-amber-700', icon: '🥐' },
  cakes: { bg: 'bg-pink-50', text: 'text-pink-700', icon: '🎂' },
  cookies: { bg: 'bg-orange-50', text: 'text-orange-700', icon: '🍪' },
  chocolate: { bg: 'bg-stone-100', text: 'text-stone-700', icon: '🍫' },
  fruits: { bg: 'bg-red-50', text: 'text-red-700', icon: '🍓' },
  other: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: '🍮' },
  avoid: { bg: 'bg-red-100', text: 'text-red-700', icon: '⚠️' },
};

const categoryLabels: Record<string, string> = {
  pastries: 'Pastries',
  cakes: 'Cakes & Breads',
  cookies: 'Cookies',
  chocolate: 'Chocolate',
  fruits: 'Fruits',
  other: 'Other Desserts',
  avoid: 'Best Avoided',
};

export default function CoffeePairing() {
  const [selectedCoffee, setSelectedCoffee] = useState<string>('espresso');
  const [categoryFilter, setCategoryFilter] = useState<Coffee['category'] | 'all'>('all');

  const filteredCoffees = useMemo(() => {
    if (categoryFilter === 'all') return coffees;
    return coffees.filter((c) => c.category === categoryFilter);
  }, [categoryFilter]);

  const selectedCoffeeData = coffees.find((c) => c.id === selectedCoffee);
  const selectedPairings = pairings.find((p) => p.coffeeId === selectedCoffee);

  const categories: { value: Coffee['category'] | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'roast', label: 'By Roast' },
    { value: 'preparation', label: 'By Preparation' },
    { value: 'origin', label: 'By Origin' },
  ];

  const getRoastLabel = (level: Coffee['roastLevel']) => {
    switch (level) {
      case 'light': return 'Light Roast';
      case 'medium': return 'Medium Roast';
      case 'medium-dark': return 'Med-Dark';
      case 'dark': return 'Dark Roast';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coffee Selection Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-[var(--shadow-medium)] p-5 sticky top-4">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
              Select a Coffee
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

            {/* Coffee List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredCoffees.map((coffee) => (
                <button
                  key={coffee.id}
                  onClick={() => setSelectedCoffee(coffee.id)}
                  className={cn(
                    'w-full text-left p-3 rounded-xl transition-all',
                    selectedCoffee === coffee.id
                      ? 'bg-[var(--color-wine-glow)] border-2 border-[var(--color-wine)]'
                      : 'bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] border-2 border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center', coffee.bgColor)}>
                      ☕
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[var(--text-primary)] text-sm">
                        {coffee.name}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {getRoastLabel(coffee.roastLevel)}
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
          {selectedCoffeeData && selectedPairings && (
            <>
              {/* Coffee Info Card */}
              <div className="bg-white rounded-2xl shadow-[var(--shadow-medium)] p-6 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn('w-16 h-16 rounded-xl flex items-center justify-center text-3xl', selectedCoffeeData.bgColor)}>
                    ☕
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
                      {selectedCoffeeData.name}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-[var(--color-cream)] rounded-full text-[var(--text-secondary)]">
                        {getRoastLabel(selectedCoffeeData.roastLevel)}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-[var(--color-cream)] rounded-full text-[var(--text-secondary)]">
                        {selectedCoffeeData.body.charAt(0).toUpperCase() + selectedCoffeeData.body.slice(1)} body
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[var(--text-secondary)] mb-4">{selectedCoffeeData.description}</p>

                {/* Flavor Tags */}
                <div className="mb-4">
                  <span className="text-xs font-medium text-[var(--text-muted)]">Flavor Notes</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedCoffeeData.flavor.map((f) => (
                      <span key={f} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-[var(--color-cream)] rounded-lg">
                    <div className="text-sm font-medium text-[var(--text-primary)]">
                      {selectedCoffeeData.acidity.charAt(0).toUpperCase() + selectedCoffeeData.acidity.slice(1)}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">Acidity</div>
                  </div>
                  <div className="text-center p-3 bg-[var(--color-cream)] rounded-lg">
                    <div className="text-sm font-medium text-[var(--text-primary)]">
                      {selectedCoffeeData.body.charAt(0).toUpperCase() + selectedCoffeeData.body.slice(1)}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">Body</div>
                  </div>
                </div>
              </div>

              {/* Pairings Grid */}
              <div className="bg-white rounded-2xl shadow-[var(--shadow-medium)] p-6">
                <h3 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
                  Perfect Desserts for {selectedCoffeeData.name}
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
                    const items = selectedPairings[key as keyof CoffeePairings];
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
                                key === 'avoid' ? 'bg-red-200 text-red-700' : 'bg-white/70 text-[var(--text-secondary)]'
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
          Coffee & Dessert Pairing Principles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-amber-900">
          <div className="flex gap-3">
            <span className="text-xl">⚖️</span>
            <p>
              <strong>Match Intensity:</strong> Light roasts with delicate desserts,
              dark roasts with rich chocolate. Don't let one overwhelm the other.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">🍫</span>
            <p>
              <strong>Chocolate Connection:</strong> Coffee and chocolate are natural
              partners—they share many flavor compounds. The darker the chocolate,
              the darker the roast.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">🌡️</span>
            <p>
              <strong>Temperature Play:</strong> Hot coffee with cold desserts (affogato!)
              or cold brew with rich brownies creates exciting contrasts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
