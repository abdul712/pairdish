/**
 * What Should I Cook? Generator Component
 *
 * Interactive recipe suggestion generator based on mood, time, and preferences.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
interface Recipe {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  time: number; // minutes
  difficulty: 'easy' | 'medium' | 'challenging';
  mood: ('cozy' | 'energetic' | 'romantic' | 'adventurous' | 'lazy' | 'healthy')[];
  dietary: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'low-carb' | 'none')[];
  ingredients: string[];
  tips: string;
  pairWith?: string;
}

interface Preference {
  mood: string | null;
  time: string | null;
  cuisine: string | null;
  dietary: string[];
  effort: string | null;
}

// Recipe database
const recipes: Recipe[] = [
  // Cozy recipes
  {
    id: 'tomato-soup',
    name: 'Creamy Tomato Soup with Grilled Cheese',
    description: 'Classic comfort food pairing. Rich tomato soup with a perfectly crispy grilled cheese for dipping.',
    cuisine: 'american',
    time: 30,
    difficulty: 'easy',
    mood: ['cozy', 'lazy'],
    dietary: ['vegetarian'],
    ingredients: ['tomatoes', 'cream', 'bread', 'cheese', 'butter'],
    tips: 'Add a pinch of sugar to balance the tomato acidity.',
    pairWith: 'A light Pinot Noir or sparkling water with lemon',
  },
  {
    id: 'beef-stew',
    name: 'Hearty Beef Stew',
    description: 'Fall-apart tender beef with root vegetables in a rich, savory broth. Pure comfort in a bowl.',
    cuisine: 'american',
    time: 120,
    difficulty: 'medium',
    mood: ['cozy'],
    dietary: ['gluten-free', 'dairy-free', 'none'],
    ingredients: ['beef', 'potatoes', 'carrots', 'onion', 'beef broth'],
    tips: 'Sear the beef in batches for maximum flavor.',
    pairWith: 'Crusty bread and a robust Cabernet Sauvignon',
  },
  {
    id: 'mac-cheese',
    name: 'Stovetop Mac and Cheese',
    description: 'Creamy, cheesy, and ready in under 30 minutes. The ultimate comfort food.',
    cuisine: 'american',
    time: 25,
    difficulty: 'easy',
    mood: ['cozy', 'lazy'],
    dietary: ['vegetarian'],
    ingredients: ['pasta', 'cheese', 'milk', 'butter'],
    tips: 'Use a mix of cheeses: sharp cheddar for flavor, gruyere for creaminess.',
  },
  {
    id: 'chicken-noodle',
    name: 'Classic Chicken Noodle Soup',
    description: 'The cure for everything. Tender chicken, vegetables, and egg noodles in golden broth.',
    cuisine: 'american',
    time: 45,
    difficulty: 'easy',
    mood: ['cozy', 'healthy'],
    dietary: ['dairy-free', 'none'],
    ingredients: ['chicken', 'egg noodles', 'carrots', 'celery', 'onion'],
    tips: 'Use bone-in chicken for the most flavorful broth.',
  },

  // Energetic/Healthy recipes
  {
    id: 'poke-bowl',
    name: 'Fresh Tuna Poke Bowl',
    description: 'Vibrant and refreshing with marinated tuna, rice, and all the fresh toppings.',
    cuisine: 'hawaiian',
    time: 20,
    difficulty: 'easy',
    mood: ['energetic', 'healthy'],
    dietary: ['gluten-free', 'dairy-free', 'none'],
    ingredients: ['tuna', 'rice', 'avocado', 'cucumber', 'soy sauce'],
    tips: 'Use sushi-grade tuna and prep all toppings before assembling.',
    pairWith: 'Crisp Sauvignon Blanc or green tea',
  },
  {
    id: 'grain-bowl',
    name: 'Mediterranean Grain Bowl',
    description: 'Packed with quinoa, roasted vegetables, chickpeas, and tangy feta.',
    cuisine: 'mediterranean',
    time: 35,
    difficulty: 'easy',
    mood: ['energetic', 'healthy'],
    dietary: ['vegetarian', 'gluten-free'],
    ingredients: ['quinoa', 'chickpeas', 'cucumber', 'tomato', 'feta'],
    tips: 'Make extra roasted vegetables for meal prep throughout the week.',
    pairWith: 'Refreshing rosé or sparkling water with mint',
  },
  {
    id: 'stir-fry',
    name: 'Rainbow Vegetable Stir-Fry',
    description: 'Quick, colorful, and packed with nutrients. Ready faster than takeout.',
    cuisine: 'asian',
    time: 20,
    difficulty: 'easy',
    mood: ['energetic', 'healthy', 'lazy'],
    dietary: ['vegan', 'vegetarian', 'dairy-free'],
    ingredients: ['mixed vegetables', 'tofu', 'soy sauce', 'ginger', 'garlic'],
    tips: 'Have all ingredients prepped before you start cooking - stir-fry moves fast!',
  },
  {
    id: 'salmon-sheet',
    name: 'Lemon Herb Sheet Pan Salmon',
    description: 'Flaky salmon with roasted vegetables, all on one pan. Healthy eating made easy.',
    cuisine: 'mediterranean',
    time: 30,
    difficulty: 'easy',
    mood: ['healthy', 'lazy'],
    dietary: ['gluten-free', 'dairy-free', 'low-carb', 'none'],
    ingredients: ['salmon', 'asparagus', 'lemon', 'olive oil', 'herbs'],
    tips: 'Don\'t overcook the salmon - it should be slightly pink in the center.',
    pairWith: 'Chardonnay or Pinot Grigio',
  },

  // Romantic recipes
  {
    id: 'risotto',
    name: 'Creamy Mushroom Risotto',
    description: 'Luxuriously creamy and elegant. Worth every stir.',
    cuisine: 'italian',
    time: 45,
    difficulty: 'medium',
    mood: ['romantic'],
    dietary: ['vegetarian', 'gluten-free'],
    ingredients: ['arborio rice', 'mushrooms', 'white wine', 'parmesan', 'shallots'],
    tips: 'Keep the broth warm and add it gradually for the creamiest texture.',
    pairWith: 'A nice Pinot Noir or aged Burgundy',
  },
  {
    id: 'steak-dinner',
    name: 'Pan-Seared Steak with Red Wine Reduction',
    description: 'Restaurant-quality steak at home with an elegant wine sauce.',
    cuisine: 'french',
    time: 40,
    difficulty: 'medium',
    mood: ['romantic', 'adventurous'],
    dietary: ['gluten-free', 'low-carb', 'none'],
    ingredients: ['ribeye steak', 'butter', 'red wine', 'shallots', 'thyme'],
    tips: 'Let the steak rest for 5 minutes after cooking for maximum juiciness.',
    pairWith: 'A bold Malbec or Cabernet Sauvignon',
  },
  {
    id: 'pasta-aglio',
    name: 'Spaghetti Aglio e Olio',
    description: 'Simple Italian elegance. Garlic, olive oil, and perfectly cooked pasta.',
    cuisine: 'italian',
    time: 20,
    difficulty: 'easy',
    mood: ['romantic', 'lazy'],
    dietary: ['vegan', 'vegetarian', 'dairy-free'],
    ingredients: ['spaghetti', 'garlic', 'olive oil', 'red pepper flakes', 'parsley'],
    tips: 'Save pasta water - it\'s the secret to a silky sauce.',
    pairWith: 'Pinot Grigio or a light Italian white',
  },
  {
    id: 'scallops',
    name: 'Pan-Seared Scallops with Brown Butter',
    description: 'Golden-crusted scallops in nutty brown butter. Impressive yet surprisingly easy.',
    cuisine: 'french',
    time: 15,
    difficulty: 'medium',
    mood: ['romantic', 'adventurous'],
    dietary: ['gluten-free', 'low-carb', 'none'],
    ingredients: ['scallops', 'butter', 'lemon', 'capers', 'parsley'],
    tips: 'Pat scallops completely dry for the best sear.',
    pairWith: 'Champagne or Chablis',
  },

  // Adventurous recipes
  {
    id: 'pad-thai',
    name: 'Authentic Pad Thai',
    description: 'Sweet, sour, salty, and a little spicy. Transport yourself to Bangkok.',
    cuisine: 'thai',
    time: 35,
    difficulty: 'medium',
    mood: ['adventurous', 'energetic'],
    dietary: ['gluten-free', 'dairy-free', 'none'],
    ingredients: ['rice noodles', 'shrimp', 'eggs', 'tamarind', 'peanuts'],
    tips: 'Have all ingredients measured and ready - pad thai comes together quickly.',
    pairWith: 'Thai iced tea or Riesling',
  },
  {
    id: 'tacos-carnitas',
    name: 'Slow-Cooked Carnitas Tacos',
    description: 'Melt-in-your-mouth pork with crispy edges. Taco Tuesday elevated.',
    cuisine: 'mexican',
    time: 180,
    difficulty: 'easy',
    mood: ['adventurous', 'cozy'],
    dietary: ['gluten-free', 'dairy-free', 'none'],
    ingredients: ['pork shoulder', 'orange', 'lime', 'cumin', 'corn tortillas'],
    tips: 'Broil the shredded pork for 5 minutes at the end for crispy bits.',
    pairWith: 'Mexican beer or a citrusy Margarita',
  },
  {
    id: 'curry',
    name: 'Thai Green Curry',
    description: 'Aromatic, creamy, and customizable with your favorite proteins and vegetables.',
    cuisine: 'thai',
    time: 30,
    difficulty: 'easy',
    mood: ['adventurous', 'cozy'],
    dietary: ['gluten-free', 'dairy-free', 'none'],
    ingredients: ['coconut milk', 'green curry paste', 'chicken', 'basil', 'vegetables'],
    tips: 'Add vegetables in order of cooking time - hard vegetables first.',
    pairWith: 'Jasmine rice and Gewürztraminer',
  },
  {
    id: 'ramen',
    name: 'Homemade Ramen',
    description: 'Rich, slurpable noodles in a savory broth with all the fixings.',
    cuisine: 'japanese',
    time: 45,
    difficulty: 'medium',
    mood: ['adventurous', 'cozy'],
    dietary: ['dairy-free', 'none'],
    ingredients: ['ramen noodles', 'pork', 'eggs', 'miso', 'green onions'],
    tips: 'Soft-boil eggs 6.5 minutes for the perfect jammy yolk.',
    pairWith: 'Japanese beer or hot sake',
  },
  {
    id: 'bibimbap',
    name: 'Korean Bibimbap',
    description: 'Beautiful bowl of rice topped with vegetables, beef, and a fried egg.',
    cuisine: 'korean',
    time: 40,
    difficulty: 'medium',
    mood: ['adventurous', 'healthy'],
    dietary: ['gluten-free', 'dairy-free', 'none'],
    ingredients: ['rice', 'beef', 'vegetables', 'gochujang', 'sesame oil'],
    tips: 'Mix everything together before eating for the full experience.',
    pairWith: 'Korean soju or light beer',
  },

  // Lazy day recipes
  {
    id: 'quesadilla',
    name: 'Loaded Quesadillas',
    description: 'Crispy, cheesy, and endlessly customizable. Dinner in 15 minutes.',
    cuisine: 'mexican',
    time: 15,
    difficulty: 'easy',
    mood: ['lazy'],
    dietary: ['vegetarian'],
    ingredients: ['tortillas', 'cheese', 'beans', 'peppers', 'sour cream'],
    tips: 'Use two pans to cook multiple quesadillas at once.',
  },
  {
    id: 'fried-rice',
    name: 'Easy Egg Fried Rice',
    description: 'The ultimate fridge-cleaner. Use whatever vegetables you have on hand.',
    cuisine: 'asian',
    time: 15,
    difficulty: 'easy',
    mood: ['lazy', 'energetic'],
    dietary: ['vegetarian', 'dairy-free'],
    ingredients: ['rice', 'eggs', 'vegetables', 'soy sauce', 'sesame oil'],
    tips: 'Day-old rice works best - it fries up crispier.',
  },
  {
    id: 'blt',
    name: 'The Perfect BLT',
    description: 'Sometimes simple is best. Crispy bacon, fresh tomato, and crunchy lettuce.',
    cuisine: 'american',
    time: 15,
    difficulty: 'easy',
    mood: ['lazy'],
    dietary: ['none'],
    ingredients: ['bacon', 'lettuce', 'tomato', 'bread', 'mayo'],
    tips: 'Toast the bread and use quality tomatoes - they make all the difference.',
  },
  {
    id: 'shakshuka',
    name: 'Shakshuka',
    description: 'Eggs poached in spiced tomato sauce. Perfect for breakfast, lunch, or dinner.',
    cuisine: 'mediterranean',
    time: 25,
    difficulty: 'easy',
    mood: ['lazy', 'cozy'],
    dietary: ['vegetarian', 'gluten-free'],
    ingredients: ['eggs', 'tomatoes', 'peppers', 'cumin', 'feta'],
    tips: 'Serve with crusty bread for dipping in the sauce.',
    pairWith: 'Orange juice or a light rosé',
  },
  {
    id: 'carbonara',
    name: 'Spaghetti Carbonara',
    description: 'Silky pasta with crispy guanciale and a creamy egg sauce. Pure Roman perfection.',
    cuisine: 'italian',
    time: 25,
    difficulty: 'medium',
    mood: ['lazy', 'romantic'],
    dietary: ['none'],
    ingredients: ['spaghetti', 'guanciale', 'eggs', 'pecorino', 'black pepper'],
    tips: 'Remove pan from heat before adding eggs to prevent scrambling.',
    pairWith: 'Dry Italian white wine',
  },

  // Vegan options
  {
    id: 'buddha-bowl',
    name: 'Nourishing Buddha Bowl',
    description: 'A colorful bowl packed with grains, roasted vegetables, and creamy tahini dressing.',
    cuisine: 'mediterranean',
    time: 40,
    difficulty: 'easy',
    mood: ['healthy', 'energetic'],
    dietary: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free'],
    ingredients: ['quinoa', 'sweet potato', 'chickpeas', 'kale', 'tahini'],
    tips: 'Roast vegetables at high heat for caramelized edges.',
  },
  {
    id: 'dal',
    name: 'Comforting Red Lentil Dal',
    description: 'Warming spiced lentils that\'s healthy, affordable, and deeply satisfying.',
    cuisine: 'indian',
    time: 35,
    difficulty: 'easy',
    mood: ['cozy', 'healthy'],
    dietary: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free'],
    ingredients: ['red lentils', 'coconut milk', 'ginger', 'turmeric', 'cumin'],
    tips: 'Finish with a tadka of sizzling spices for authentic flavor.',
    pairWith: 'Basmati rice and naan bread',
  },
  {
    id: 'veggie-tacos',
    name: 'Crispy Cauliflower Tacos',
    description: 'Roasted cauliflower with tangy slaw and creamy avocado crema.',
    cuisine: 'mexican',
    time: 35,
    difficulty: 'easy',
    mood: ['healthy', 'adventurous'],
    dietary: ['vegan', 'vegetarian', 'gluten-free', 'dairy-free'],
    ingredients: ['cauliflower', 'spices', 'cabbage', 'avocado', 'lime'],
    tips: 'Get the cauliflower really crispy - don\'t crowd the pan.',
  },
];

// Preference options
const moodOptions = [
  { id: 'cozy', label: 'Cozy & Comforting', emoji: '🛋️', description: 'Warm, soul-hugging food' },
  { id: 'energetic', label: 'Light & Energizing', emoji: '⚡', description: 'Fresh and vibrant' },
  { id: 'romantic', label: 'Date Night', emoji: '❤️', description: 'Impressive and elegant' },
  { id: 'adventurous', label: 'Adventurous', emoji: '🌍', description: 'Try something new' },
  { id: 'lazy', label: 'Low-Effort', emoji: '😌', description: 'Quick and easy wins' },
  { id: 'healthy', label: 'Health-Focused', emoji: '🥗', description: 'Nutritious and balanced' },
];

const timeOptions = [
  { id: 'quick', label: 'Under 20 minutes', emoji: '⏱️' },
  { id: 'medium', label: '20-45 minutes', emoji: '🕐' },
  { id: 'leisurely', label: '45+ minutes', emoji: '👨‍🍳' },
  { id: 'any', label: 'No time limit', emoji: '♾️' },
];

const cuisineOptions = [
  { id: 'any', label: 'Surprise Me!', emoji: '🎲' },
  { id: 'italian', label: 'Italian', emoji: '🇮🇹' },
  { id: 'asian', label: 'Asian', emoji: '🥢' },
  { id: 'mexican', label: 'Mexican', emoji: '🌮' },
  { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
  { id: 'american', label: 'American', emoji: '🍔' },
];

const dietaryOptions = [
  { id: 'none', label: 'No Restrictions', emoji: '✅' },
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥕' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱' },
  { id: 'gluten-free', label: 'Gluten-Free', emoji: '🌾' },
  { id: 'dairy-free', label: 'Dairy-Free', emoji: '🥛' },
  { id: 'low-carb', label: 'Low-Carb', emoji: '🥩' },
];

const effortOptions = [
  { id: 'easy', label: 'Keep It Simple', emoji: '👶', description: 'Beginner-friendly' },
  { id: 'medium', label: 'I\'ll Put In Effort', emoji: '💪', description: 'Some skill required' },
  { id: 'any', label: 'Challenge Me', emoji: '🏆', description: 'Any difficulty' },
];

export default function RecipeGenerator() {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<Preference>({
    mood: null,
    time: null,
    cuisine: null,
    dietary: [],
    effort: null,
  });
  const [showResults, setShowResults] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Filter recipes based on preferences
  const matchingRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Mood filter
      if (preferences.mood && !recipe.mood.includes(preferences.mood as any)) {
        return false;
      }

      // Time filter
      if (preferences.time) {
        if (preferences.time === 'quick' && recipe.time > 20) return false;
        if (preferences.time === 'medium' && (recipe.time < 20 || recipe.time > 45)) return false;
        if (preferences.time === 'leisurely' && recipe.time < 45) return false;
      }

      // Cuisine filter
      if (preferences.cuisine && preferences.cuisine !== 'any') {
        const cuisineMap: Record<string, string[]> = {
          italian: ['italian'],
          asian: ['asian', 'thai', 'japanese', 'korean', 'chinese'],
          mexican: ['mexican'],
          mediterranean: ['mediterranean', 'greek'],
          american: ['american'],
        };
        const cuisines = cuisineMap[preferences.cuisine] || [preferences.cuisine];
        if (!cuisines.includes(recipe.cuisine)) return false;
      }

      // Dietary filter
      if (preferences.dietary.length > 0 && !preferences.dietary.includes('none')) {
        const hasMatchingDietary = preferences.dietary.every(
          (diet) => recipe.dietary.includes(diet as any) || recipe.dietary.includes('none')
        );
        if (!hasMatchingDietary) return false;
      }

      // Effort filter
      if (preferences.effort && preferences.effort !== 'any') {
        if (preferences.effort === 'easy' && recipe.difficulty !== 'easy') return false;
        if (preferences.effort === 'medium' && recipe.difficulty === 'challenging') return false;
      }

      return true;
    });
  }, [preferences]);

  // Get top recommendations (randomized selection of matching recipes)
  const recommendations = useMemo(() => {
    const shuffled = [...matchingRecipes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [matchingRecipes, showResults]);

  const handlePreferenceSelect = (key: keyof Preference, value: string) => {
    if (key === 'dietary') {
      setPreferences((prev) => {
        if (value === 'none') {
          return { ...prev, dietary: ['none'] };
        }
        const newDietary = prev.dietary.includes(value)
          ? prev.dietary.filter((d) => d !== value)
          : [...prev.dietary.filter((d) => d !== 'none'), value];
        return { ...prev, dietary: newDietary };
      });
    } else {
      setPreferences((prev) => ({ ...prev, [key]: value }));
      // Auto-advance to next step
      setTimeout(() => {
        if (step < 4) {
          setStep(step + 1);
        }
      }, 300);
    }
  };

  const handleGetRecipes = () => {
    setShowResults(true);
  };

  const handleStartOver = () => {
    setStep(0);
    setPreferences({
      mood: null,
      time: null,
      cuisine: null,
      dietary: [],
      effort: null,
    });
    setShowResults(false);
    setSelectedRecipe(null);
  };

  const handleShuffle = () => {
    // Force re-render with new random selection
    setShowResults(false);
    setTimeout(() => setShowResults(true), 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'challenging':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Render step content
  const renderStep = () => {
    if (showResults) {
      return (
        <div className="space-y-8">
          {/* Results Header */}
          <div className="text-center">
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-2">
              Tonight's Recommendations
            </h2>
            <p className="text-[var(--text-muted)]">
              {matchingRecipes.length > 0
                ? `Found ${matchingRecipes.length} recipes matching your mood!`
                : 'No exact matches, but here are some suggestions'}
            </p>
          </div>

          {/* Recipe Cards */}
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((recipe, index) => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={cn(
                    'text-left p-6 bg-white rounded-xl border-2 transition-all hover:shadow-lg',
                    selectedRecipe?.id === recipe.id
                      ? 'border-[var(--color-wine)] shadow-lg'
                      : 'border-[var(--color-cream-dark)] hover:border-[var(--color-wine)]/50'
                  )}
                >
                  {index === 0 && (
                    <span className="inline-block px-3 py-1 bg-[var(--color-wine)] text-white text-xs font-medium rounded-full mb-3">
                      Top Pick
                    </span>
                  )}
                  <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {recipe.name}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                    {recipe.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-[var(--color-cream)] rounded-full text-[var(--text-muted)]">
                      {recipe.time} min
                    </span>
                    <span
                      className={cn('text-xs px-2 py-1 rounded-full', getDifficultyColor(recipe.difficulty))}
                    >
                      {recipe.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 bg-[var(--color-cream)] rounded-full text-[var(--text-muted)]">
                      {recipe.cuisine}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[var(--color-cream)] rounded-xl">
              <p className="text-[var(--text-secondary)] mb-4">
                No recipes match your exact criteria. Try adjusting your preferences!
              </p>
              <button
                onClick={handleStartOver}
                className="px-6 py-2 bg-[var(--color-wine)] text-white rounded-lg hover:bg-[var(--color-wine-deep)] transition-colors"
              >
                Start Over
              </button>
            </div>
          )}

          {/* Selected Recipe Detail */}
          {selectedRecipe && (
            <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-1">
                    {selectedRecipe.name}
                  </h3>
                  <p className="text-[var(--text-secondary)]">{selectedRecipe.description}</p>
                </div>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="p-2 hover:bg-[var(--color-cream)] rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="font-medium text-[var(--text-primary)] mb-3">Key Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.ingredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="px-3 py-1 bg-[var(--color-cream)] rounded-full text-sm text-[var(--text-secondary)]"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-[var(--text-primary)] mb-3">Quick Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{selectedRecipe.time} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                        <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                        <path d="M12 2v2" />
                        <path d="M12 22v-2" />
                        <path d="m17 20.66-1-1.73" />
                        <path d="M11 10.27 7 3.34" />
                        <path d="m20.66 17-1.73-1" />
                        <path d="m3.34 7 1.73 1" />
                        <path d="M14 12h8" />
                        <path d="M2 12h2" />
                        <path d="m20.66 7-1.73 1" />
                        <path d="m3.34 17 1.73-1" />
                        <path d="m17 3.34-1 1.73" />
                        <path d="m11 13.73-4 6.93" />
                      </svg>
                      <span className="capitalize">{selectedRecipe.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                        <path d="M7 2v20" />
                        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                      </svg>
                      <span className="capitalize">{selectedRecipe.cuisine}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-medium text-amber-800 mb-1 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  Pro Tip
                </h4>
                <p className="text-sm text-amber-700">{selectedRecipe.tips}</p>
              </div>

              {selectedRecipe.pairWith && (
                <div className="mt-4 p-4 bg-[var(--color-wine-glow)] rounded-lg">
                  <h4 className="font-medium text-[var(--color-wine)] mb-1">Pair With</h4>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedRecipe.pairWith}</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleShuffle}
              className="px-6 py-3 bg-[var(--color-cream)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--color-cream-dark)] transition-colors flex items-center gap-2"
            >
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
              >
                <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
                <path d="m18 2 4 4-4 4" />
                <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
                <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
                <path d="m18 14 4 4-4 4" />
              </svg>
              Shuffle Recipes
            </button>
            <button
              onClick={handleStartOver}
              className="px-6 py-3 bg-[var(--color-wine)] text-white rounded-lg hover:bg-[var(--color-wine-deep)] transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      );
    }

    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-2">
                What's your mood tonight?
              </h2>
              <p className="text-[var(--text-muted)]">Select the vibe that matches how you feel</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {moodOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handlePreferenceSelect('mood', option.id)}
                  className={cn(
                    'p-5 rounded-xl border-2 transition-all text-left hover:shadow-md',
                    preferences.mood === option.id
                      ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                      : 'border-[var(--color-cream-dark)] bg-white hover:border-[var(--color-wine)]/50'
                  )}
                >
                  <span className="text-3xl block mb-2">{option.emoji}</span>
                  <span className="font-medium text-[var(--text-primary)] block">{option.label}</span>
                  <span className="text-sm text-[var(--text-muted)]">{option.description}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-2">
                How much time do you have?
              </h2>
              <p className="text-[var(--text-muted)]">From lightning fast to slow and leisurely</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {timeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handlePreferenceSelect('time', option.id)}
                  className={cn(
                    'p-5 rounded-xl border-2 transition-all text-center hover:shadow-md',
                    preferences.time === option.id
                      ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                      : 'border-[var(--color-cream-dark)] bg-white hover:border-[var(--color-wine)]/50'
                  )}
                >
                  <span className="text-3xl block mb-2">{option.emoji}</span>
                  <span className="font-medium text-[var(--text-primary)]">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-2">
                Any cuisine preference?
              </h2>
              <p className="text-[var(--text-muted)]">Pick a direction or let us surprise you</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {cuisineOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handlePreferenceSelect('cuisine', option.id)}
                  className={cn(
                    'p-5 rounded-xl border-2 transition-all text-center hover:shadow-md',
                    preferences.cuisine === option.id
                      ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                      : 'border-[var(--color-cream-dark)] bg-white hover:border-[var(--color-wine)]/50'
                  )}
                >
                  <span className="text-3xl block mb-2">{option.emoji}</span>
                  <span className="font-medium text-[var(--text-primary)]">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-2">
                Any dietary preferences?
              </h2>
              <p className="text-[var(--text-muted)]">Select all that apply</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {dietaryOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handlePreferenceSelect('dietary', option.id)}
                  className={cn(
                    'p-5 rounded-xl border-2 transition-all text-center hover:shadow-md',
                    preferences.dietary.includes(option.id)
                      ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                      : 'border-[var(--color-cream-dark)] bg-white hover:border-[var(--color-wine)]/50'
                  )}
                >
                  <span className="text-3xl block mb-2">{option.emoji}</span>
                  <span className="font-medium text-[var(--text-primary)]">{option.label}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setStep(4)}
                className="px-8 py-3 bg-[var(--color-wine)] text-white rounded-lg hover:bg-[var(--color-wine-deep)] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-2">
                How much effort do you want to put in?
              </h2>
              <p className="text-[var(--text-muted)]">Be honest - we won't judge!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {effortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    handlePreferenceSelect('effort', option.id);
                    setTimeout(() => handleGetRecipes(), 300);
                  }}
                  className={cn(
                    'p-6 rounded-xl border-2 transition-all text-center hover:shadow-md',
                    preferences.effort === option.id
                      ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                      : 'border-[var(--color-cream-dark)] bg-white hover:border-[var(--color-wine)]/50'
                  )}
                >
                  <span className="text-4xl block mb-3">{option.emoji}</span>
                  <span className="font-medium text-[var(--text-primary)] block text-lg">{option.label}</span>
                  <span className="text-sm text-[var(--text-muted)]">{option.description}</span>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      {!showResults && (
        <div className="mb-10">
          <div className="flex justify-between items-center max-w-md mx-auto">
            {[0, 1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => s < step && setStep(s)}
                disabled={s > step}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all',
                  s === step
                    ? 'bg-[var(--color-wine)] text-white'
                    : s < step
                      ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                      : 'bg-[var(--color-cream-dark)] text-[var(--text-muted)]'
                )}
              >
                {s < step ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  s + 1
                )}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-[var(--text-muted)] max-w-md mx-auto mt-2 px-1">
            <span>Mood</span>
            <span>Time</span>
            <span>Cuisine</span>
            <span>Diet</span>
            <span>Effort</span>
          </div>
        </div>
      )}

      {/* Step Content */}
      {renderStep()}

      {/* Back Button */}
      {!showResults && step > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setStep(step - 1)}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </button>
        </div>
      )}
    </div>
  );
}
