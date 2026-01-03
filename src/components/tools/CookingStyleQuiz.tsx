/**
 * Cooking Style Quiz Component
 *
 * Discover your cooking personality type.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
interface Question {
  id: string;
  question: string;
  options: {
    text: string;
    scores: Record<string, number>;
  }[];
}

interface CookingStyle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  growthAreas: string[];
  signatureDishes: string[];
  kitchenEssentials: string[];
  cookbooks: string[];
  color: string;
  icon: string;
}

// Cooking style types
const cookingStyles: CookingStyle[] = [
  {
    id: 'adventurous-chef',
    name: 'The Adventurous Chef',
    tagline: 'Every recipe is just a suggestion',
    description: 'You see cooking as a creative adventure. Recipes are starting points, not rules. You love experimenting with bold flavors, fusion cuisines, and techniques you\'ve never tried. Your kitchen is your laboratory.',
    strengths: ['Creative flavor combinations', 'Adapting on the fly', 'Trying new cuisines', 'Making do with what\'s available'],
    growthAreas: ['Following recipes precisely', 'Consistent results', 'Baking (where precision matters)'],
    signatureDishes: ['Fusion stir-fries', 'Creative pizzas', 'Improvised pasta dishes', 'Experimental tacos'],
    kitchenEssentials: ['Quality chef\'s knife', 'Cast iron pan', 'Spice collection', 'Mortar and pestle'],
    cookbooks: ['Salt, Fat, Acid, Heat', 'The Flavor Bible', 'Ottolenghi SIMPLE'],
    color: 'orange',
    icon: '🚀',
  },
  {
    id: 'comfort-cook',
    name: 'The Comfort Cook',
    tagline: 'Food is love made visible',
    description: 'For you, cooking is about nurturing and bringing joy to others. You\'re drawn to hearty, satisfying dishes that evoke warmth and nostalgia. Your kitchen smells like home, and your food hugs the soul.',
    strengths: ['Consistent comfort classics', 'Feeding a crowd', 'Making people feel loved', 'Hearty, satisfying portions'],
    growthAreas: ['Lighter, modern dishes', 'Quick weeknight meals', 'Presentation and plating'],
    signatureDishes: ['Mac and cheese', 'Pot roast', 'Homemade soup', 'Lasagna', 'Chocolate chip cookies'],
    kitchenEssentials: ['Dutch oven', 'Casserole dishes', 'Stand mixer', 'Large stockpot'],
    cookbooks: ['The Pioneer Woman Cooks', 'Magnolia Table', 'Joy of Cooking'],
    color: 'amber',
    icon: '🏠',
  },
  {
    id: 'health-conscious',
    name: 'The Wellness Warrior',
    tagline: 'Let food be thy medicine',
    description: 'You believe in the power of food to nourish body and mind. You\'re knowledgeable about nutrition, love whole foods, and enjoy creating dishes that are as healthy as they are delicious.',
    strengths: ['Nutritious meal planning', 'Ingredient substitutions', 'Balanced meals', 'Reading labels and sourcing'],
    growthAreas: ['Indulgent cooking', 'Rich, decadent dishes', 'Cooking for picky eaters'],
    signatureDishes: ['Buddha bowls', 'Smoothie bowls', 'Grain salads', 'Sheet pan vegetables', 'Energy balls'],
    kitchenEssentials: ['High-speed blender', 'Spiralizer', 'Quality cutting board', 'Glass storage containers'],
    cookbooks: ['How Not to Die Cookbook', 'Plenty', 'The Oh She Glows Cookbook'],
    color: 'green',
    icon: '🥗',
  },
  {
    id: 'efficient-cook',
    name: 'The Efficient Minimalist',
    tagline: 'Maximum flavor, minimum fuss',
    description: 'You value efficiency and practicality in the kitchen. You\'ve mastered the art of the 30-minute meal, meal prep like a pro, and believe that delicious food doesn\'t need to be complicated.',
    strengths: ['Quick weeknight dinners', 'Meal prepping', 'One-pot wonders', 'Streamlined cooking'],
    growthAreas: ['Elaborate multi-course meals', 'Time-intensive techniques', 'Decorative presentation'],
    signatureDishes: ['Sheet pan dinners', 'Instant Pot meals', 'Stir-fries', 'Make-ahead breakfast burritos'],
    kitchenEssentials: ['Instant Pot or pressure cooker', 'Sheet pans', 'Good meal prep containers', 'Sharp knives'],
    cookbooks: ['Dinner in an Instant', 'Sheet Pan Suppers', 'Cook Once, Eat All Week'],
    color: 'blue',
    icon: '⚡',
  },
  {
    id: 'precision-baker',
    name: 'The Precision Artist',
    tagline: 'Cooking is science, baking is chemistry',
    description: 'You approach cooking with precision and attention to detail. You measure ingredients exactly, follow techniques meticulously, and take pride in consistent, beautiful results. Baking is your sweet spot.',
    strengths: ['Baking and pastry', 'Following complex recipes', 'Consistent results', 'Beautiful presentation'],
    growthAreas: ['Improvising without recipes', 'Cooking by taste', 'Handling kitchen chaos'],
    signatureDishes: ['French macarons', 'Homemade bread', 'Layer cakes', 'Croissants', 'Perfect pie crust'],
    kitchenEssentials: ['Digital scale', 'Thermometer', 'Stand mixer', 'Quality baking sheets and pans'],
    cookbooks: ['Flour Water Salt Yeast', 'Bravetart', 'The Bread Baker\'s Apprentice'],
    color: 'purple',
    icon: '📐',
  },
  {
    id: 'social-chef',
    name: 'The Social Entertainer',
    tagline: 'The more the merrier',
    description: 'For you, cooking is a social experience. You love hosting dinner parties, cooking with friends, and creating dishes meant to be shared. Your happiest moments involve a table full of loved ones enjoying your food.',
    strengths: ['Large batch cooking', 'Dinner parties', 'Impressive presentations', 'Creating memorable experiences'],
    growthAreas: ['Cooking for one', 'Quick solo meals', 'Scaling down recipes'],
    signatureDishes: ['Paella', 'Build-your-own taco bars', 'Cheese boards', 'Slow-roasted meats', 'Signature cocktails'],
    kitchenEssentials: ['Large serving platters', 'Paella pan or large skillet', 'Cocktail set', 'Beautiful dinnerware'],
    cookbooks: ['The Art of Gathering', 'Sunday Suppers', 'Cook Beautiful'],
    color: 'pink',
    icon: '🎉',
  },
];

// Quiz questions
const questions: Question[] = [
  {
    id: 'q1',
    question: 'How do you typically approach a new recipe?',
    options: [
      { text: 'Read it once, then improvise based on what I have', scores: { 'adventurous-chef': 3, 'efficient-cook': 1 } },
      { text: 'Follow it exactly, measuring everything precisely', scores: { 'precision-baker': 3, 'comfort-cook': 1 } },
      { text: 'Think about how to make it healthier first', scores: { 'health-conscious': 3, 'efficient-cook': 1 } },
      { text: 'Plan it around when I\'m having guests over', scores: { 'social-chef': 3, 'comfort-cook': 1 } },
    ],
  },
  {
    id: 'q2',
    question: 'What\'s your ideal Sunday cooking activity?',
    options: [
      { text: 'Experimenting with a cuisine I\'ve never tried', scores: { 'adventurous-chef': 3, 'health-conscious': 1 } },
      { text: 'Making a big batch of comfort food for the week', scores: { 'comfort-cook': 3, 'efficient-cook': 2 } },
      { text: 'Attempting a challenging baking project', scores: { 'precision-baker': 3, 'adventurous-chef': 1 } },
      { text: 'Hosting brunch for friends and family', scores: { 'social-chef': 3, 'comfort-cook': 1 } },
    ],
  },
  {
    id: 'q3',
    question: 'You open your fridge and find random ingredients. You:',
    options: [
      { text: 'Get excited - time to create something unique!', scores: { 'adventurous-chef': 3, 'efficient-cook': 1 } },
      { text: 'Search for a recipe that uses what I have', scores: { 'precision-baker': 2, 'comfort-cook': 2 } },
      { text: 'Make a quick stir-fry or grain bowl', scores: { 'efficient-cook': 3, 'health-conscious': 2 } },
      { text: 'Think about who I could invite over for an impromptu dinner', scores: { 'social-chef': 3, 'adventurous-chef': 1 } },
    ],
  },
  {
    id: 'q4',
    question: 'What kitchen tool could you not live without?',
    options: [
      { text: 'My extensive spice collection', scores: { 'adventurous-chef': 3, 'health-conscious': 1 } },
      { text: 'My digital scale for precise measurements', scores: { 'precision-baker': 3, 'efficient-cook': 1 } },
      { text: 'My Instant Pot or slow cooker', scores: { 'efficient-cook': 3, 'comfort-cook': 2 } },
      { text: 'My beautiful serving platters', scores: { 'social-chef': 3, 'comfort-cook': 1 } },
    ],
  },
  {
    id: 'q5',
    question: 'How do you feel about following recipes exactly?',
    options: [
      { text: 'Recipes are more like guidelines to me', scores: { 'adventurous-chef': 3, 'efficient-cook': 1 } },
      { text: 'Essential! Especially for baking', scores: { 'precision-baker': 3, 'comfort-cook': 1 } },
      { text: 'I modify recipes to make them healthier', scores: { 'health-conscious': 3, 'efficient-cook': 1 } },
      { text: 'I follow them for special occasions, otherwise I keep it simple', scores: { 'social-chef': 2, 'efficient-cook': 2 } },
    ],
  },
  {
    id: 'q6',
    question: 'What describes your grocery shopping style?',
    options: [
      { text: 'I buy interesting ingredients that inspire me', scores: { 'adventurous-chef': 3, 'social-chef': 1 } },
      { text: 'Stick to tried-and-true staples', scores: { 'comfort-cook': 3, 'efficient-cook': 1 } },
      { text: 'Focus on whole foods and fresh produce', scores: { 'health-conscious': 3, 'precision-baker': 1 } },
      { text: 'Efficient trips with a strict list', scores: { 'efficient-cook': 3, 'precision-baker': 1 } },
    ],
  },
  {
    id: 'q7',
    question: 'What\'s your cooking philosophy?',
    options: [
      { text: 'Cooking should be an adventure', scores: { 'adventurous-chef': 3, 'social-chef': 1 } },
      { text: 'Food should nourish body and soul', scores: { 'health-conscious': 2, 'comfort-cook': 2 } },
      { text: 'Good food brings people together', scores: { 'social-chef': 3, 'comfort-cook': 2 } },
      { text: 'Delicious doesn\'t have to mean complicated', scores: { 'efficient-cook': 3, 'comfort-cook': 1 } },
    ],
  },
  {
    id: 'q8',
    question: 'What would you most like to master?',
    options: [
      { text: 'An obscure ethnic cuisine', scores: { 'adventurous-chef': 3, 'health-conscious': 1 } },
      { text: 'Perfect French pastry techniques', scores: { 'precision-baker': 3, 'social-chef': 1 } },
      { text: 'The art of hosting and entertaining', scores: { 'social-chef': 3, 'comfort-cook': 1 } },
      { text: 'Meal prep and batch cooking efficiency', scores: { 'efficient-cook': 3, 'health-conscious': 1 } },
    ],
  },
];

export default function CookingStyleQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Calculate result
  const result = useMemo(() => {
    if (!showResult) return null;

    const scores: Record<string, number> = {};
    cookingStyles.forEach((s) => (scores[s.id] = 0));

    answers.forEach((answerIndex, questionIndex) => {
      const question = questions[questionIndex];
      const option = question.options[answerIndex];
      Object.entries(option.scores).forEach(([style, score]) => {
        scores[style] = (scores[style] || 0) + score;
      });
    });

    const sortedStyles = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => cookingStyles.find((s) => s.id === id)!);

    return {
      primary: sortedStyles[0],
      secondary: sortedStyles[1],
      scores,
    };
  }, [answers, showResult]);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; light: string; border: string }> = {
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50', border: 'border-orange-500' },
      amber: { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-500' },
      green: { bg: 'bg-green-600', text: 'text-green-600', light: 'bg-green-50', border: 'border-green-500' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-500' },
      purple: { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-500' },
      pink: { bg: 'bg-pink-500', text: 'text-pink-600', light: 'bg-pink-50', border: 'border-pink-500' },
    };
    return colors[color] || colors.orange;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {!showResult ? (
        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-cream-dark)] p-6 md:p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-[var(--text-muted)] mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-[var(--color-cream)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-wine)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 className="font-display text-xl md:text-2xl font-semibold text-[var(--text-primary)] mb-6">
            {questions[currentQuestion].question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={cn(
                  'w-full text-left p-4 rounded-lg border-2 transition-all',
                  selectedAnswer === index
                    ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                    : 'border-[var(--color-cream-dark)] hover:border-[var(--color-wine)] hover:bg-[var(--color-cream)]'
                )}
              >
                <span className="text-[var(--text-primary)]">{option.text}</span>
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={cn(
              'w-full py-3 rounded-lg font-medium transition-colors',
              selectedAnswer !== null
                ? 'bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)]'
                : 'bg-[var(--color-cream)] text-[var(--text-muted)] cursor-not-allowed'
            )}
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'See My Result'}
          </button>
        </div>
      ) : result ? (
        <div>
          {/* Result Card */}
          <div className={cn('rounded-xl shadow-lg overflow-hidden mb-8', getColorClasses(result.primary.color).light)}>
            {/* Header */}
            <div className={cn('p-8 text-white text-center', getColorClasses(result.primary.color).bg)}>
              <span className="text-5xl mb-4 block">{result.primary.icon}</span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">
                You are {result.primary.name}!
              </h2>
              <p className="text-white/90 italic">&ldquo;{result.primary.tagline}&rdquo;</p>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <p className="text-[var(--text-secondary)] mb-6 text-lg leading-relaxed">
                {result.primary.description}
              </p>

              {/* Strengths */}
              <div className="mb-6">
                <h3 className="font-medium text-[var(--text-primary)] mb-3">Your Kitchen Strengths</h3>
                <div className="flex flex-wrap gap-2">
                  {result.primary.strengths.map((strength) => (
                    <span
                      key={strength}
                      className={cn('px-3 py-1 rounded-full text-sm font-medium', getColorClasses(result.primary.color).light, getColorClasses(result.primary.color).text)}
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              {/* Growth Areas */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-[var(--text-primary)] mb-2">Room to Grow</h3>
                <ul className="text-sm text-[var(--text-muted)] space-y-1">
                  {result.primary.growthAreas.map((area) => (
                    <li key={area}>* {area}</li>
                  ))}
                </ul>
              </div>

              {/* Signature Dishes */}
              <div className="mb-6">
                <h3 className="font-medium text-[var(--text-primary)] mb-3">Your Signature Dishes</h3>
                <div className="grid grid-cols-2 gap-2">
                  {result.primary.signatureDishes.map((dish) => (
                    <div
                      key={dish}
                      className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[var(--color-cream-dark)]"
                    >
                      <span className="text-[var(--color-wine)]">🍽️</span>
                      <span className="text-sm">{dish}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kitchen Essentials */}
              <div className="mb-6">
                <h3 className="font-medium text-[var(--text-primary)] mb-3">Your Kitchen Essentials</h3>
                <div className="flex flex-wrap gap-2">
                  {result.primary.kitchenEssentials.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 bg-white rounded-lg border border-[var(--color-cream-dark)] text-sm text-[var(--text-secondary)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cookbook Recommendations */}
              <div>
                <h3 className="font-medium text-[var(--text-primary)] mb-3">Cookbooks You\'ll Love</h3>
                <div className="space-y-2">
                  {result.primary.cookbooks.map((book) => (
                    <div
                      key={book}
                      className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[var(--color-cream-dark)]"
                    >
                      <span>📚</span>
                      <span className="text-sm font-medium text-[var(--text-primary)]">{book}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Result */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--color-cream-dark)] p-6 mb-8">
            <h3 className="font-medium text-[var(--text-muted)] mb-2">You also have traits of...</h3>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{result.secondary.icon}</span>
              <div>
                <h4 className={cn('font-semibold', getColorClasses(result.secondary.color).text)}>
                  {result.secondary.name}
                </h4>
                <p className="text-sm text-[var(--text-muted)]">{result.secondary.tagline}</p>
              </div>
            </div>
          </div>

          {/* Share & Restart */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `I'm ${result.primary.name}!`,
                    text: `I took the Cooking Style Quiz and I'm ${result.primary.name}! "${result.primary.tagline}"`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(
                    `I'm ${result.primary.name}! "${result.primary.tagline}" - Take the Cooking Style Quiz: ${window.location.href}`
                  );
                  alert('Result copied to clipboard!');
                }
              }}
              className="flex-1 py-3 rounded-lg font-medium bg-[var(--color-cream)] text-[var(--text-primary)] hover:bg-[var(--color-cream-dark)] transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" x2="12" y1="2" y2="15"/>
              </svg>
              Share Result
            </button>
            <button
              onClick={handleRestart}
              className="flex-1 py-3 rounded-lg font-medium bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)] transition-colors"
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
