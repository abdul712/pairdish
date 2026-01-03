/**
 * Wine Personality Quiz Component
 *
 * Fun personality quiz to discover your wine personality type.
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

interface WinePersonality {
  id: string;
  name: string;
  tagline: string;
  description: string;
  wines: string[];
  foods: string[];
  traits: string[];
  color: string;
  icon: string;
}

// Wine personality types
const personalities: WinePersonality[] = [
  {
    id: 'bold-adventurer',
    name: 'The Bold Adventurer',
    tagline: 'Life is too short for boring wine',
    description: 'You crave intensity and excitement. Just like a powerful Cabernet or Barolo, you make a statement wherever you go. You appreciate depth, complexity, and experiences that leave a lasting impression.',
    wines: ['Cabernet Sauvignon', 'Barolo', 'Syrah/Shiraz', 'Malbec', 'Aged Bordeaux'],
    foods: ['Grilled steak', 'Lamb chops', 'Aged cheeses', 'Dark chocolate', 'Wild game'],
    traits: ['Confident', 'Decisive', 'Passionate', 'Natural leader'],
    color: 'wine',
    icon: '🦁',
  },
  {
    id: 'elegant-classic',
    name: 'The Elegant Classic',
    tagline: 'Timeless sophistication in every sip',
    description: 'You have refined taste and appreciate the finer things in life. Like a well-aged Burgundy or Champagne, you embody grace, tradition, and understated elegance. Quality over quantity, always.',
    wines: ['Burgundy (Pinot Noir)', 'Champagne', 'Vintage Champagne', 'Chablis', 'Sancerre'],
    foods: ['Duck confit', 'Brie and crackers', 'Oysters', 'Risotto', 'Foie gras'],
    traits: ['Sophisticated', 'Thoughtful', 'Patient', 'Detail-oriented'],
    color: 'purple',
    icon: '👑',
  },
  {
    id: 'social-sparkler',
    name: 'The Social Sparkler',
    tagline: 'Bringing the bubbles wherever you go',
    description: 'You are the life of the party! Like Prosecco or sparkling rosé, you bring joy and effervescence to every gathering. You are approachable, fun-loving, and always ready to celebrate.',
    wines: ['Prosecco', 'Cava', 'Sparkling Rosé', 'Crémant', 'Moscato d\'Asti'],
    foods: ['Appetizers', 'Brunch favorites', 'Light seafood', 'Fresh fruits', 'Festive desserts'],
    traits: ['Outgoing', 'Optimistic', 'Adaptable', 'Energetic'],
    color: 'pink',
    icon: '✨',
  },
  {
    id: 'laid-back-sipper',
    name: 'The Laid-Back Sipper',
    tagline: 'Good vibes and easy drinking',
    description: 'You value relaxation and simplicity. Like a crisp Sauvignon Blanc or easy-drinking Pinot Grigio, you go with the flow and enjoy life\'s simple pleasures without overthinking.',
    wines: ['Sauvignon Blanc', 'Pinot Grigio', 'Albariño', 'Vinho Verde', 'Light Rosé'],
    foods: ['Fresh salads', 'Grilled vegetables', 'Light fish', 'Goat cheese', 'Summer fruits'],
    traits: ['Easy-going', 'Approachable', 'Genuine', 'Balanced'],
    color: 'green',
    icon: '🌿',
  },
  {
    id: 'curious-explorer',
    name: 'The Curious Explorer',
    tagline: 'There is always something new to discover',
    description: 'You are always seeking new experiences and love to venture off the beaten path. Like a unique orange wine or obscure varietal, you embrace the unusual and find beauty in the unexpected.',
    wines: ['Orange Wine', 'Grüner Veltliner', 'Txakoli', 'Assyrtiko', 'Natural Wines'],
    foods: ['International cuisines', 'Fusion dishes', 'Unusual pairings', 'Street food', 'Experimental cooking'],
    traits: ['Adventurous', 'Open-minded', 'Creative', 'Independent'],
    color: 'orange',
    icon: '🧭',
  },
  {
    id: 'romantic-dreamer',
    name: 'The Romantic Dreamer',
    tagline: 'Every glass tells a story',
    description: 'You are sentimental and appreciate the emotional side of wine. Like a silky Pinot Noir or aromatic Gewürztraminer, you are drawn to wines that evoke memories and stir the soul.',
    wines: ['Pinot Noir', 'Gewürztraminer', 'Riesling', 'Vintage Port', 'Amarone'],
    foods: ['Romantic dinners', 'Cheese boards', 'Truffle dishes', 'Autumn comfort foods', 'Decadent desserts'],
    traits: ['Emotional', 'Imaginative', 'Nostalgic', 'Sensual'],
    color: 'red',
    icon: '🌹',
  },
];

// Quiz questions
const questions: Question[] = [
  {
    id: 'q1',
    question: 'It\'s Friday night. What are you most likely doing?',
    options: [
      { text: 'Hosting a dinner party with close friends', scores: { 'elegant-classic': 3, 'romantic-dreamer': 2 } },
      { text: 'Trying that new restaurant everyone\'s talking about', scores: { 'curious-explorer': 3, 'social-sparkler': 2 } },
      { text: 'Dancing the night away at a fun event', scores: { 'social-sparkler': 3, 'bold-adventurer': 1 } },
      { text: 'Relaxing at home with a good movie', scores: { 'laid-back-sipper': 3, 'romantic-dreamer': 1 } },
    ],
  },
  {
    id: 'q2',
    question: 'How do you approach trying new things?',
    options: [
      { text: 'I dive in headfirst - life\'s an adventure!', scores: { 'bold-adventurer': 3, 'curious-explorer': 2 } },
      { text: 'I research first, then commit fully', scores: { 'elegant-classic': 3, 'romantic-dreamer': 1 } },
      { text: 'I love trying new things with friends', scores: { 'social-sparkler': 3, 'curious-explorer': 1 } },
      { text: 'I prefer sticking to what I know and love', scores: { 'laid-back-sipper': 3, 'romantic-dreamer': 1 } },
    ],
  },
  {
    id: 'q3',
    question: 'Your ideal vacation destination would be:',
    options: [
      { text: 'A remote vineyard in an undiscovered wine region', scores: { 'curious-explorer': 3, 'romantic-dreamer': 2 } },
      { text: 'A vibrant city with amazing nightlife', scores: { 'social-sparkler': 3, 'bold-adventurer': 1 } },
      { text: 'A luxury resort with fine dining', scores: { 'elegant-classic': 3, 'bold-adventurer': 1 } },
      { text: 'A quiet beach with good books and simple pleasures', scores: { 'laid-back-sipper': 3, 'romantic-dreamer': 1 } },
    ],
  },
  {
    id: 'q4',
    question: 'When choosing food at a restaurant, you typically:',
    options: [
      { text: 'Go for the most adventurous dish on the menu', scores: { 'bold-adventurer': 3, 'curious-explorer': 2 } },
      { text: 'Ask the sommelier for the perfect wine pairing', scores: { 'elegant-classic': 3, 'romantic-dreamer': 1 } },
      { text: 'Order what your friends are having - sharing is caring!', scores: { 'social-sparkler': 3, 'laid-back-sipper': 1 } },
      { text: 'Pick something comforting and satisfying', scores: { 'laid-back-sipper': 2, 'romantic-dreamer': 2 } },
    ],
  },
  {
    id: 'q5',
    question: 'How would your friends describe you?',
    options: [
      { text: 'The confident one who takes charge', scores: { 'bold-adventurer': 3, 'elegant-classic': 1 } },
      { text: 'The refined one with impeccable taste', scores: { 'elegant-classic': 3, 'romantic-dreamer': 1 } },
      { text: 'The fun one who brings everyone together', scores: { 'social-sparkler': 3, 'laid-back-sipper': 1 } },
      { text: 'The thoughtful one who notices the little things', scores: { 'romantic-dreamer': 3, 'curious-explorer': 1 } },
    ],
  },
  {
    id: 'q6',
    question: 'Your favorite type of music is:',
    options: [
      { text: 'Rock, blues, or something with intensity', scores: { 'bold-adventurer': 3, 'curious-explorer': 1 } },
      { text: 'Classical, jazz, or smooth instrumentals', scores: { 'elegant-classic': 3, 'romantic-dreamer': 2 } },
      { text: 'Pop, dance, or anything upbeat', scores: { 'social-sparkler': 3, 'laid-back-sipper': 1 } },
      { text: 'Indie, folk, or world music', scores: { 'curious-explorer': 3, 'romantic-dreamer': 1 } },
    ],
  },
  {
    id: 'q7',
    question: 'When it comes to fashion, you prefer:',
    options: [
      { text: 'Bold statement pieces that turn heads', scores: { 'bold-adventurer': 3, 'social-sparkler': 1 } },
      { text: 'Timeless, elegant classics', scores: { 'elegant-classic': 3, 'romantic-dreamer': 1 } },
      { text: 'Fun, trendy, and colorful', scores: { 'social-sparkler': 3, 'curious-explorer': 1 } },
      { text: 'Comfortable and effortlessly cool', scores: { 'laid-back-sipper': 3, 'curious-explorer': 1 } },
    ],
  },
  {
    id: 'q8',
    question: 'Your ideal date involves:',
    options: [
      { text: 'An exciting activity like rock climbing or salsa dancing', scores: { 'bold-adventurer': 3, 'social-sparkler': 1 } },
      { text: 'A candlelit dinner at an exclusive restaurant', scores: { 'elegant-classic': 3, 'romantic-dreamer': 2 } },
      { text: 'A fun group outing with friends', scores: { 'social-sparkler': 3, 'laid-back-sipper': 1 } },
      { text: 'A cozy night in with home-cooked food', scores: { 'laid-back-sipper': 2, 'romantic-dreamer': 3 } },
    ],
  },
];

export default function WinePersonalityQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Calculate result
  const result = useMemo(() => {
    if (!showResult) return null;

    const scores: Record<string, number> = {};
    personalities.forEach((p) => (scores[p.id] = 0));

    answers.forEach((answerIndex, questionIndex) => {
      const question = questions[questionIndex];
      const option = question.options[answerIndex];
      Object.entries(option.scores).forEach(([personality, score]) => {
        scores[personality] = (scores[personality] || 0) + score;
      });
    });

    const sortedPersonalities = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => personalities.find((p) => p.id === id)!);

    return {
      primary: sortedPersonalities[0],
      secondary: sortedPersonalities[1],
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
      wine: { bg: 'bg-[var(--color-wine)]', text: 'text-[var(--color-wine)]', light: 'bg-[var(--color-wine-glow)]', border: 'border-[var(--color-wine)]' },
      purple: { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-500' },
      pink: { bg: 'bg-pink-500', text: 'text-pink-600', light: 'bg-pink-50', border: 'border-pink-500' },
      green: { bg: 'bg-green-600', text: 'text-green-600', light: 'bg-green-50', border: 'border-green-500' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50', border: 'border-orange-500' },
      red: { bg: 'bg-red-600', text: 'text-red-600', light: 'bg-red-50', border: 'border-red-500' },
    };
    return colors[color] || colors.wine;
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

              {/* Traits */}
              <div className="mb-6">
                <h3 className="font-medium text-[var(--text-primary)] mb-3">Your Key Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {result.primary.traits.map((trait) => (
                    <span
                      key={trait}
                      className={cn('px-3 py-1 rounded-full text-sm font-medium', getColorClasses(result.primary.color).light, getColorClasses(result.primary.color).text)}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Wine Recommendations */}
              <div className="mb-6">
                <h3 className="font-medium text-[var(--text-primary)] mb-3">Wines You&apos;ll Love</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {result.primary.wines.map((wine) => (
                    <div
                      key={wine}
                      className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[var(--color-cream-dark)]"
                    >
                      <span className="text-[var(--color-wine)]">🍷</span>
                      <span className="text-sm">{wine}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Food Pairings */}
              <div>
                <h3 className="font-medium text-[var(--text-primary)] mb-3">Perfect Food Pairings</h3>
                <div className="flex flex-wrap gap-2">
                  {result.primary.foods.map((food) => (
                    <span
                      key={food}
                      className="px-3 py-1.5 bg-white rounded-lg border border-[var(--color-cream-dark)] text-sm text-[var(--text-secondary)]"
                    >
                      {food}
                    </span>
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
                    text: `I just took the Wine Personality Quiz and I'm ${result.primary.name}! "${result.primary.tagline}"`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(
                    `I'm ${result.primary.name}! "${result.primary.tagline}" - Take the Wine Personality Quiz: ${window.location.href}`
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
