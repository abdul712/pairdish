/**
 * Buffet Menu Planner
 *
 * Plan a balanced buffet menu with quantity calculations and setup tips.
 * Features:
 * - Guest count and meal type inputs
 * - Menu category balance
 * - Dish selection with quantities
 * - Setup and flow recommendations
 * - Timing guide
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
type MealType = 'brunch' | 'lunch' | 'dinner' | 'holiday';
type DishCategory = 'mains' | 'sides' | 'salads' | 'starches' | 'breads' | 'desserts';

interface DishOption {
  id: string;
  name: string;
  category: DishCategory;
  servingSize: string;
  ouncesPerPerson: number;
  prepTip: string;
  dietary?: string[];
  crowd: 'standard' | 'crowd-pleaser' | 'elevated';
}

// Dish database
const DISH_OPTIONS: DishOption[] = [
  // Mains
  { id: 'roast-beef', name: 'Roast Beef', category: 'mains', servingSize: '4-5 oz/person', ouncesPerPerson: 4.5, prepTip: 'Slice thin, serve with au jus', dietary: ['gluten-free'], crowd: 'crowd-pleaser' },
  { id: 'roast-chicken', name: 'Roast Chicken', category: 'mains', servingSize: '5-6 oz/person', ouncesPerPerson: 5.5, prepTip: 'Quarter for easy serving', dietary: ['gluten-free'], crowd: 'standard' },
  { id: 'baked-ham', name: 'Baked Ham', category: 'mains', servingSize: '4-5 oz/person', ouncesPerPerson: 4.5, prepTip: 'Spiral sliced is easiest', dietary: ['gluten-free'], crowd: 'holiday' },
  { id: 'salmon', name: 'Roasted Salmon', category: 'mains', servingSize: '5 oz/person', ouncesPerPerson: 5, prepTip: 'Serve at room temp or warm', dietary: ['gluten-free'], crowd: 'elevated' },
  { id: 'lasagna', name: 'Lasagna', category: 'mains', servingSize: '1 piece (4x4")', ouncesPerPerson: 8, prepTip: 'Make ahead, reheat covered', dietary: [], crowd: 'crowd-pleaser' },
  { id: 'meatballs', name: 'Italian Meatballs', category: 'mains', servingSize: '3-4 meatballs', ouncesPerPerson: 5, prepTip: 'Keep in sauce, warm in chafing dish', dietary: [], crowd: 'crowd-pleaser' },
  { id: 'bbq-pulled-pork', name: 'BBQ Pulled Pork', category: 'mains', servingSize: '4-5 oz/person', ouncesPerPerson: 4.5, prepTip: 'Keep warm with extra sauce', dietary: ['gluten-free'], crowd: 'crowd-pleaser' },
  { id: 'grilled-chicken-breast', name: 'Grilled Chicken Breast', category: 'mains', servingSize: '5-6 oz/person', ouncesPerPerson: 5.5, prepTip: 'Slice for easier serving', dietary: ['gluten-free'], crowd: 'standard' },
  { id: 'vegetable-stir-fry', name: 'Vegetable Stir Fry', category: 'mains', servingSize: '6 oz/person', ouncesPerPerson: 6, prepTip: 'Serve with tofu as protein', dietary: ['vegan', 'gluten-free'], crowd: 'standard' },
  { id: 'quiche', name: 'Quiche Assortment', category: 'mains', servingSize: '1 slice', ouncesPerPerson: 4, prepTip: 'Great for brunch, serve at room temp', dietary: ['vegetarian'], crowd: 'elevated' },

  // Sides
  { id: 'green-beans', name: 'Green Beans Almondine', category: 'sides', servingSize: '3-4 oz/person', ouncesPerPerson: 3.5, prepTip: 'Blanch ahead, sauté before serving', dietary: ['vegetarian', 'gluten-free'], crowd: 'standard' },
  { id: 'roasted-vegetables', name: 'Roasted Vegetables', category: 'sides', servingSize: '4 oz/person', ouncesPerPerson: 4, prepTip: 'Mix of seasonal veggies', dietary: ['vegan', 'gluten-free'], crowd: 'crowd-pleaser' },
  { id: 'glazed-carrots', name: 'Glazed Carrots', category: 'sides', servingSize: '3-4 oz/person', ouncesPerPerson: 3.5, prepTip: 'Honey butter glaze', dietary: ['vegetarian', 'gluten-free'], crowd: 'standard' },
  { id: 'sauteed-spinach', name: 'Sautéed Spinach', category: 'sides', servingSize: '2-3 oz/person', ouncesPerPerson: 2.5, prepTip: 'Cook just before serving', dietary: ['vegan', 'gluten-free'], crowd: 'standard' },
  { id: 'asparagus', name: 'Roasted Asparagus', category: 'sides', servingSize: '4-5 spears', ouncesPerPerson: 3, prepTip: 'Lemon and parmesan finish', dietary: ['vegetarian', 'gluten-free'], crowd: 'elevated' },

  // Salads
  { id: 'garden-salad', name: 'Garden Salad', category: 'salads', servingSize: '2-3 oz/person', ouncesPerPerson: 2.5, prepTip: 'Dress lightly or serve on side', dietary: ['vegan', 'gluten-free'], crowd: 'standard' },
  { id: 'caesar-salad', name: 'Caesar Salad', category: 'salads', servingSize: '3-4 oz/person', ouncesPerPerson: 3.5, prepTip: 'Add dressing just before serving', dietary: ['vegetarian'], crowd: 'crowd-pleaser' },
  { id: 'greek-salad', name: 'Greek Salad', category: 'salads', servingSize: '3-4 oz/person', ouncesPerPerson: 3.5, prepTip: 'Feta on top, dress lightly', dietary: ['vegetarian', 'gluten-free'], crowd: 'standard' },
  { id: 'pasta-salad', name: 'Pasta Salad', category: 'salads', servingSize: '4 oz/person', ouncesPerPerson: 4, prepTip: 'Make a day ahead', dietary: ['vegetarian'], crowd: 'crowd-pleaser' },
  { id: 'coleslaw', name: 'Coleslaw', category: 'salads', servingSize: '3 oz/person', ouncesPerPerson: 3, prepTip: 'Mix dressing morning of', dietary: ['vegetarian', 'gluten-free'], crowd: 'standard' },

  // Starches
  { id: 'mashed-potatoes', name: 'Mashed Potatoes', category: 'starches', servingSize: '4-5 oz/person', ouncesPerPerson: 4.5, prepTip: 'Keep warm, add butter before serving', dietary: ['vegetarian', 'gluten-free'], crowd: 'crowd-pleaser' },
  { id: 'roasted-potatoes', name: 'Roasted Potatoes', category: 'starches', servingSize: '4 oz/person', ouncesPerPerson: 4, prepTip: 'Crispy and herbed', dietary: ['vegan', 'gluten-free'], crowd: 'standard' },
  { id: 'rice-pilaf', name: 'Rice Pilaf', category: 'starches', servingSize: '4 oz/person', ouncesPerPerson: 4, prepTip: 'Keep covered and warm', dietary: ['vegan', 'gluten-free'], crowd: 'standard' },
  { id: 'mac-cheese', name: 'Mac and Cheese', category: 'starches', servingSize: '5-6 oz/person', ouncesPerPerson: 5.5, prepTip: 'Bake in portions or large pan', dietary: ['vegetarian'], crowd: 'crowd-pleaser' },
  { id: 'scalloped-potatoes', name: 'Scalloped Potatoes', category: 'starches', servingSize: '4-5 oz/person', ouncesPerPerson: 4.5, prepTip: 'Make ahead, reheat covered', dietary: ['vegetarian', 'gluten-free'], crowd: 'elevated' },

  // Breads
  { id: 'dinner-rolls', name: 'Dinner Rolls', category: 'breads', servingSize: '1-2 rolls/person', ouncesPerPerson: 2, prepTip: 'Warm before serving', dietary: ['vegetarian'], crowd: 'standard' },
  { id: 'garlic-bread', name: 'Garlic Bread', category: 'breads', servingSize: '2 slices/person', ouncesPerPerson: 2, prepTip: 'Toast just before serving', dietary: ['vegetarian'], crowd: 'crowd-pleaser' },
  { id: 'cornbread', name: 'Cornbread', category: 'breads', servingSize: '1 piece', ouncesPerPerson: 2.5, prepTip: 'Serve with honey butter', dietary: ['vegetarian'], crowd: 'standard' },
  { id: 'biscuits', name: 'Buttermilk Biscuits', category: 'breads', servingSize: '1-2 biscuits/person', ouncesPerPerson: 2, prepTip: 'Best served warm', dietary: ['vegetarian'], crowd: 'crowd-pleaser' },

  // Desserts
  { id: 'cake', name: 'Cake (sheet or layer)', category: 'desserts', servingSize: '1 slice', ouncesPerPerson: 3, prepTip: 'Pre-slice for easier serving', dietary: ['vegetarian'], crowd: 'crowd-pleaser' },
  { id: 'brownies', name: 'Brownies', category: 'desserts', servingSize: '1-2 pieces', ouncesPerPerson: 2.5, prepTip: 'Cut into small squares', dietary: ['vegetarian'], crowd: 'crowd-pleaser' },
  { id: 'cookies', name: 'Cookie Assortment', category: 'desserts', servingSize: '2-3 cookies', ouncesPerPerson: 2, prepTip: 'Variety of types', dietary: ['vegetarian'], crowd: 'standard' },
  { id: 'fruit-tart', name: 'Fruit Tart', category: 'desserts', servingSize: '1 slice', ouncesPerPerson: 3, prepTip: 'Pre-slice, refrigerate', dietary: ['vegetarian'], crowd: 'elevated' },
  { id: 'pie', name: 'Pie Assortment', category: 'desserts', servingSize: '1 slice', ouncesPerPerson: 4, prepTip: 'Apple and pumpkin classics', dietary: ['vegetarian'], crowd: 'crowd-pleaser' },
];

// Recommended counts per category by meal type
const CATEGORY_RECOMMENDATIONS: Record<MealType, Record<DishCategory, { min: number; max: number }>> = {
  brunch: { mains: { min: 1, max: 2 }, sides: { min: 1, max: 2 }, salads: { min: 1, max: 2 }, starches: { min: 1, max: 2 }, breads: { min: 1, max: 2 }, desserts: { min: 1, max: 2 } },
  lunch: { mains: { min: 1, max: 2 }, sides: { min: 2, max: 3 }, salads: { min: 1, max: 2 }, starches: { min: 1, max: 2 }, breads: { min: 1, max: 1 }, desserts: { min: 1, max: 2 } },
  dinner: { mains: { min: 2, max: 3 }, sides: { min: 2, max: 4 }, salads: { min: 1, max: 2 }, starches: { min: 1, max: 2 }, breads: { min: 1, max: 1 }, desserts: { min: 1, max: 3 } },
  holiday: { mains: { min: 2, max: 4 }, sides: { min: 3, max: 5 }, salads: { min: 2, max: 3 }, starches: { min: 2, max: 3 }, breads: { min: 1, max: 2 }, desserts: { min: 2, max: 4 } },
};

const CATEGORY_INFO: Record<DishCategory, { label: string; icon: string }> = {
  mains: { label: 'Main Dishes', icon: '🍖' },
  sides: { label: 'Side Dishes', icon: '🥦' },
  salads: { label: 'Salads', icon: '🥗' },
  starches: { label: 'Starches', icon: '🥔' },
  breads: { label: 'Breads', icon: '🍞' },
  desserts: { label: 'Desserts', icon: '🍰' },
};

const MEAL_TYPES: { id: MealType; label: string }[] = [
  { id: 'brunch', label: 'Brunch' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'holiday', label: 'Holiday Feast' },
];

// Icons
const BuffetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h20"/>
    <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/>
    <path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/>
    <path d="M12 4v8"/>
    <path d="M8 4v8"/>
    <path d="M16 4v8"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function BuffetPlanner() {
  const [guestCount, setGuestCount] = useState(30);
  const [mealType, setMealType] = useState<MealType>('dinner');
  const [selectedDishes, setSelectedDishes] = useState<string[]>([
    'roast-chicken', 'baked-ham', 'green-beans', 'roasted-vegetables',
    'caesar-salad', 'mashed-potatoes', 'dinner-rolls', 'cake'
  ]);

  // Group dishes by category
  const dishesByCategory = useMemo(() => {
    const groups: Record<DishCategory, DishOption[]> = {
      mains: [], sides: [], salads: [], starches: [], breads: [], desserts: []
    };
    DISH_OPTIONS.forEach(dish => {
      groups[dish.category].push(dish);
    });
    return groups;
  }, []);

  // Calculate quantities and balance
  const calculations = useMemo(() => {
    const recommendations = CATEGORY_RECOMMENDATIONS[mealType];

    // Count selected per category
    const categoryCount: Record<DishCategory, number> = {
      mains: 0, sides: 0, salads: 0, starches: 0, breads: 0, desserts: 0
    };

    selectedDishes.forEach(id => {
      const dish = DISH_OPTIONS.find(d => d.id === id);
      if (dish) categoryCount[dish.category]++;
    });

    // Calculate balance scores
    const balance: Record<DishCategory, 'low' | 'good' | 'high'> = {} as any;
    Object.keys(recommendations).forEach(cat => {
      const count = categoryCount[cat as DishCategory];
      const rec = recommendations[cat as DishCategory];
      if (count < rec.min) balance[cat as DishCategory] = 'low';
      else if (count > rec.max) balance[cat as DishCategory] = 'high';
      else balance[cat as DishCategory] = 'good';
    });

    // Calculate quantities for selected dishes
    const dishes = selectedDishes.map(id => {
      const dish = DISH_OPTIONS.find(d => d.id === id);
      if (!dish) return null;
      const totalOunces = Math.round(dish.ouncesPerPerson * guestCount);
      const pounds = (totalOunces / 16).toFixed(1);
      return {
        ...dish,
        totalOunces,
        pounds,
      };
    }).filter(Boolean);

    return {
      categoryCount,
      balance,
      dishes,
      recommendations,
    };
  }, [selectedDishes, guestCount, mealType]);

  // Toggle dish
  const toggleDish = (id: string) => {
    setSelectedDishes(prev =>
      prev.includes(id)
        ? prev.filter(d => d !== id)
        : [...prev, id]
    );
  };

  const getBalanceColor = (status: 'low' | 'good' | 'high') => {
    switch (status) {
      case 'low': return 'text-red-600';
      case 'good': return 'text-green-600';
      case 'high': return 'text-amber-600';
    }
  };

  const getBalanceIcon = (status: 'low' | 'good' | 'high') => {
    switch (status) {
      case 'low': return '↓';
      case 'good': return '✓';
      case 'high': return '↑';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Input Section */}
      <div className="card bg-white p-6 md:p-8 mb-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-3xl text-[var(--color-wine)]">
            <BuffetIcon />
          </span>
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            Buffet Menu Planner
          </h2>
        </div>

        {/* Guest Count & Meal Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Number of Guests
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                className="flex-1 h-2 bg-[var(--color-cream-dark)] rounded-lg appearance-none cursor-pointer accent-[var(--color-wine)]"
              />
              <div className="w-16 h-12 flex items-center justify-center bg-[var(--color-wine-glow)] rounded-lg">
                <span className="text-xl font-bold text-[var(--color-wine)]">{guestCount}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Meal Type
            </label>
            <div className="flex gap-2">
              {MEAL_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setMealType(type.id)}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-lg font-medium transition-all",
                    mealType === type.id
                      ? "bg-[var(--color-wine)] text-white"
                      : "bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Balance */}
        <div className="bg-[var(--color-cream)] rounded-xl p-4 mb-8">
          <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Menu Balance</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {Object.entries(CATEGORY_INFO).map(([cat, info]) => {
              const count = calculations.categoryCount[cat as DishCategory];
              const rec = calculations.recommendations[cat as DishCategory];
              const balance = calculations.balance[cat as DishCategory];
              return (
                <div key={cat} className="text-center p-2 bg-white rounded-lg">
                  <div className="text-lg">{info.icon}</div>
                  <div className="text-xs text-[var(--text-muted)]">{info.label}</div>
                  <div className={cn("font-bold text-lg", getBalanceColor(balance))}>
                    {count} <span className="text-xs">{getBalanceIcon(balance)}</span>
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    rec: {rec.min}-{rec.max}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dish Selection */}
        {Object.entries(dishesByCategory).map(([cat, dishes]) => (
          <div key={cat} className="mb-6">
            <h4 className="text-sm font-semibold text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <span>{CATEGORY_INFO[cat as DishCategory].icon}</span>
              <span>{CATEGORY_INFO[cat as DishCategory].label}</span>
              <span className="text-xs font-normal">
                ({calculations.categoryCount[cat as DishCategory]} selected)
              </span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {dishes.map(dish => (
                <button
                  key={dish.id}
                  onClick={() => toggleDish(dish.id)}
                  className={cn(
                    "p-3 rounded-lg text-left text-sm transition-all border",
                    selectedDishes.includes(dish.id)
                      ? "bg-[var(--color-wine)] text-white border-[var(--color-wine)]"
                      : "bg-white text-[var(--text-secondary)] border-[var(--color-cream-dark)] hover:border-[var(--color-wine)]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dish.name}</span>
                    {selectedDishes.includes(dish.id) && <CheckIcon />}
                  </div>
                  <div className={cn(
                    "text-xs mt-1",
                    selectedDishes.includes(dish.id) ? "text-white/70" : "text-[var(--text-muted)]"
                  )}>
                    {dish.servingSize}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      {selectedDishes.length > 0 && (
        <div className="card bg-white p-6 md:p-8 mb-8">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-6">
            Your Buffet Menu ({guestCount} guests)
          </h3>

          <div className="space-y-4">
            {Object.entries(CATEGORY_INFO).map(([cat, info]) => {
              const catDishes = calculations.dishes.filter((d: any) => d?.category === cat);
              if (catDishes.length === 0) return null;

              return (
                <div key={cat}>
                  <h4 className="text-sm font-semibold text-[var(--text-muted)] mb-2 flex items-center gap-2">
                    <span>{info.icon}</span>
                    <span>{info.label}</span>
                  </h4>
                  <div className="space-y-2">
                    {catDishes.map((dish: any) => (
                      <div key={dish?.id} className="flex items-start justify-between p-3 bg-[var(--color-cream)] rounded-lg">
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{dish?.name}</div>
                          <div className="text-xs text-[var(--text-muted)]">{dish?.prepTip}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[var(--color-wine)]">{dish?.pounds} lbs</div>
                          <div className="text-xs text-[var(--text-muted)]">({dish?.totalOunces} oz)</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Buffet Setup Tips
          </h3>
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Plates at the front, utensils and napkins at the end</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Double-sided lines for groups over 50</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Place heavier items (mains, starches) first</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Salads and cold items can be set out early</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Use chafing dishes for hot items</span>
            </li>
          </ul>
        </div>

        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Timing Guide
          </h3>
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span><strong>2 days ahead:</strong> Prep desserts, marinades</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span><strong>1 day ahead:</strong> Prep salads (undressed), sides</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span><strong>Morning of:</strong> Cook mains, prep starches</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span><strong>1 hour before:</strong> Set up buffet table</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span><strong>15 min before:</strong> Light chafing dish flames</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
