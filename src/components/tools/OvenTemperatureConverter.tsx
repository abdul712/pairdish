/**
 * Oven Temperature Converter
 *
 * Convert between Fahrenheit, Celsius, and Gas Mark.
 * Features:
 * - F ↔ C ↔ Gas Mark conversions
 * - Convection/fan oven adjustment
 * - Common temperature reference chart
 * - Altitude adjustment suggestions
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
type TemperatureUnit = 'fahrenheit' | 'celsius' | 'gasmark';

interface CommonTemp {
  name: string;
  fahrenheit: number;
  celsius: number;
  gasmark: string;
  uses: string[];
}

// Common baking/cooking temperatures
const COMMON_TEMPS: CommonTemp[] = [
  { name: 'Very Low', fahrenheit: 250, celsius: 120, gasmark: '½', uses: ['Meringues', 'Slow-drying'] },
  { name: 'Low', fahrenheit: 275, celsius: 135, gasmark: '1', uses: ['Slow roasting', 'Drying herbs'] },
  { name: 'Slow', fahrenheit: 300, celsius: 150, gasmark: '2', uses: ['Slow cooking', 'Stews'] },
  { name: 'Moderately Slow', fahrenheit: 325, celsius: 165, gasmark: '3', uses: ['Cakes', 'Custards'] },
  { name: 'Moderate', fahrenheit: 350, celsius: 175, gasmark: '4', uses: ['Cookies', 'Cakes', 'General baking'] },
  { name: 'Moderately Hot', fahrenheit: 375, celsius: 190, gasmark: '5', uses: ['Pies', 'Pastries'] },
  { name: 'Hot', fahrenheit: 400, celsius: 200, gasmark: '6', uses: ['Roasting vegetables', 'Quick breads'] },
  { name: 'Very Hot', fahrenheit: 425, celsius: 220, gasmark: '7', uses: ['Roasting meat', 'Pizza (home oven)'] },
  { name: 'Very Hot', fahrenheit: 450, celsius: 230, gasmark: '8', uses: ['Bread crusts', 'Searing'] },
  { name: 'Extremely Hot', fahrenheit: 475, celsius: 245, gasmark: '9', uses: ['Pizza (high heat)', 'Naan bread'] },
  { name: 'Maximum', fahrenheit: 500, celsius: 260, gasmark: '10', uses: ['Pizza stone', 'Quick searing'] },
];

// Gas Mark to Fahrenheit mapping (for precise conversion)
const GAS_MARK_MAP: Record<string, number> = {
  '¼': 225,
  '½': 250,
  '1': 275,
  '2': 300,
  '3': 325,
  '4': 350,
  '5': 375,
  '6': 400,
  '7': 425,
  '8': 450,
  '9': 475,
  '10': 500,
};

// Icons
const ThermometerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
  </svg>
);

const FanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12c-1.5-2.5-3-3.5-5-4 2-1 3.5-2 4-4.5.5 2.5 2 3.5 4 4.5-2 .5-3.5 1.5-5 4z"/>
    <path d="M12 12c1.5 2.5 3 3.5 5 4-2 1-3.5 2-4 4.5-.5-2.5-2-3.5-4-4.5 2-.5 3.5-1.5 5-4z"/>
    <path d="M12 12c2.5-1.5 3.5-3 4-5 1 2 2 3.5 4.5 4-2.5.5-3.5 2-4.5 4-.5-2-1.5-3.5-4-3z"/>
    <path d="M12 12c-2.5 1.5-3.5 3-4 5-1-2-2-3.5-4.5-4 2.5-.5 3.5-2 4.5-4 .5 2 1.5 3.5 4 3z"/>
  </svg>
);

const MountainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
  </svg>
);

export default function OvenTemperatureConverter() {
  // State
  const [inputValue, setInputValue] = useState<string>('350');
  const [inputUnit, setInputUnit] = useState<TemperatureUnit>('fahrenheit');
  const [isConvection, setIsConvection] = useState(false);
  const [showAltitude, setShowAltitude] = useState(false);

  // Parse input
  const numericValue = useMemo(() => {
    if (inputUnit === 'gasmark') {
      // Look up gas mark
      const fahrenheit = GAS_MARK_MAP[inputValue];
      return fahrenheit || 0;
    }
    const parsed = parseFloat(inputValue);
    return isNaN(parsed) ? 0 : parsed;
  }, [inputValue, inputUnit]);

  // Convert to all units
  const conversions = useMemo(() => {
    let fahrenheit: number;

    if (inputUnit === 'fahrenheit') {
      fahrenheit = numericValue;
    } else if (inputUnit === 'celsius') {
      fahrenheit = (numericValue * 9/5) + 32;
    } else {
      // Gas mark - already converted to fahrenheit in numericValue
      fahrenheit = numericValue;
    }

    // Apply convection adjustment (reduce by 25°F)
    if (isConvection) {
      fahrenheit -= 25;
    }

    const celsius = (fahrenheit - 32) * 5/9;

    // Find closest gas mark
    let closestGasMark = '—';
    let minDiff = Infinity;
    Object.entries(GAS_MARK_MAP).forEach(([mark, temp]) => {
      const diff = Math.abs(temp - fahrenheit);
      if (diff < minDiff) {
        minDiff = diff;
        closestGasMark = mark;
      }
    });

    return {
      fahrenheit: Math.round(fahrenheit),
      celsius: Math.round(celsius),
      gasmark: closestGasMark,
    };
  }, [numericValue, inputUnit, isConvection]);

  // Get temperature category
  const getHeatLevel = (f: number): string => {
    if (f < 275) return 'Very Low';
    if (f < 325) return 'Low';
    if (f < 350) return 'Moderate Low';
    if (f < 375) return 'Moderate';
    if (f < 425) return 'Hot';
    if (f < 475) return 'Very Hot';
    return 'Extremely Hot';
  };

  // Get heat color
  const getHeatColor = (f: number): string => {
    if (f < 275) return 'bg-blue-100 text-blue-700';
    if (f < 325) return 'bg-cyan-100 text-cyan-700';
    if (f < 375) return 'bg-yellow-100 text-yellow-700';
    if (f < 425) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  // Quick select buttons
  const quickTemps = [325, 350, 375, 400, 425, 450];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Converter Card */}
      <div className="card bg-white p-6 md:p-8 mb-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-3xl text-[var(--color-wine)]">
            <ThermometerIcon />
          </span>
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            Oven Temperature Converter
          </h2>
        </div>

        {/* Input Section */}
        <div className="max-w-md mx-auto mb-8">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 text-center">
            Enter Temperature
          </label>
          <div className="flex gap-2">
            {inputUnit === 'gasmark' ? (
              <select
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-4 py-3 border border-[var(--color-cream-dark)] rounded-lg text-lg text-center focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
              >
                {Object.keys(GAS_MARK_MAP).map(mark => (
                  <option key={mark} value={mark}>Gas Mark {mark}</option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-4 py-3 border border-[var(--color-cream-dark)] rounded-lg text-lg text-center focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
                placeholder="Enter temperature"
              />
            )}
            <select
              value={inputUnit}
              onChange={(e) => {
                const newUnit = e.target.value as TemperatureUnit;
                setInputUnit(newUnit);
                if (newUnit === 'gasmark') {
                  setInputValue('4');
                } else if (inputUnit === 'gasmark') {
                  setInputValue('350');
                }
              }}
              className="px-4 py-3 border border-[var(--color-cream-dark)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
            >
              <option value="fahrenheit">°F</option>
              <option value="celsius">°C</option>
              <option value="gasmark">Gas Mark</option>
            </select>
          </div>

          {/* Quick Select */}
          <div className="flex justify-center gap-2 mt-4">
            {quickTemps.map(temp => (
              <button
                key={temp}
                onClick={() => {
                  setInputValue(temp.toString());
                  setInputUnit('fahrenheit');
                }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  parseInt(inputValue) === temp && inputUnit === 'fahrenheit'
                    ? "bg-[var(--color-wine)] text-white"
                    : "bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]"
                )}
              >
                {temp}°F
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={cn(
            "rounded-xl p-6 text-center",
            inputUnit === 'fahrenheit' ? "bg-[var(--color-wine)] text-white" : "bg-[var(--color-cream)]"
          )}>
            <div className="text-4xl font-display font-bold mb-1">
              {conversions.fahrenheit}°F
            </div>
            <div className={cn(
              "text-sm",
              inputUnit === 'fahrenheit' ? "opacity-80" : "text-[var(--text-muted)]"
            )}>
              Fahrenheit
            </div>
          </div>

          <div className={cn(
            "rounded-xl p-6 text-center",
            inputUnit === 'celsius' ? "bg-[var(--color-wine)] text-white" : "bg-[var(--color-cream)]"
          )}>
            <div className="text-4xl font-display font-bold mb-1">
              {conversions.celsius}°C
            </div>
            <div className={cn(
              "text-sm",
              inputUnit === 'celsius' ? "opacity-80" : "text-[var(--text-muted)]"
            )}>
              Celsius
            </div>
          </div>

          <div className={cn(
            "rounded-xl p-6 text-center",
            inputUnit === 'gasmark' ? "bg-[var(--color-wine)] text-white" : "bg-[var(--color-cream)]"
          )}>
            <div className="text-4xl font-display font-bold mb-1">
              {conversions.gasmark}
            </div>
            <div className={cn(
              "text-sm",
              inputUnit === 'gasmark' ? "opacity-80" : "text-[var(--text-muted)]"
            )}>
              Gas Mark
            </div>
          </div>
        </div>

        {/* Heat Level Indicator */}
        <div className="text-center mb-6">
          <span className={cn(
            "inline-block px-4 py-2 rounded-full text-sm font-medium",
            getHeatColor(conversions.fahrenheit)
          )}>
            {getHeatLevel(conversions.fahrenheit)} Heat
          </span>
        </div>

        {/* Convection Toggle */}
        <div className="flex items-center justify-center gap-4 p-4 bg-[var(--color-cream)] rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isConvection}
              onChange={(e) => setIsConvection(e.target.checked)}
              className="w-5 h-5 rounded accent-[var(--color-wine)]"
            />
            <span className="flex items-center gap-2">
              <FanIcon />
              <span className="font-medium text-[var(--text-primary)]">Convection/Fan Oven</span>
            </span>
          </label>
          {isConvection && (
            <span className="text-sm text-[var(--text-muted)]">
              (Temperature reduced by 25°F/15°C)
            </span>
          )}
        </div>
      </div>

      {/* Common Temperatures Reference */}
      <div className="card bg-white p-6 mb-8">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Common Oven Temperatures
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-cream-dark)]">
                <th className="text-left py-3 px-2 font-medium text-[var(--text-secondary)]">Description</th>
                <th className="text-center py-3 px-2 font-medium text-[var(--text-secondary)]">°F</th>
                <th className="text-center py-3 px-2 font-medium text-[var(--text-secondary)]">°C</th>
                <th className="text-center py-3 px-2 font-medium text-[var(--text-secondary)]">Gas</th>
                <th className="text-left py-3 px-2 font-medium text-[var(--text-secondary)]">Common Uses</th>
              </tr>
            </thead>
            <tbody>
              {COMMON_TEMPS.map((temp, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    "border-b border-[var(--color-cream)] hover:bg-[var(--color-cream)] cursor-pointer transition-colors",
                    conversions.fahrenheit === temp.fahrenheit && "bg-[var(--color-wine-glow)]"
                  )}
                  onClick={() => {
                    setInputValue(temp.fahrenheit.toString());
                    setInputUnit('fahrenheit');
                  }}
                >
                  <td className="py-3 px-2">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      getHeatColor(temp.fahrenheit)
                    )}>
                      {temp.name}
                    </span>
                  </td>
                  <td className="text-center py-3 px-2 font-semibold">{temp.fahrenheit}°</td>
                  <td className="text-center py-3 px-2">{temp.celsius}°</td>
                  <td className="text-center py-3 px-2">{temp.gasmark}</td>
                  <td className="py-3 px-2 text-[var(--text-muted)]">{temp.uses.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Convection Tips */}
        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <FanIcon />
            Convection Oven Tips
          </h3>
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Reduce temperature by 25°F (15°C) from conventional recipes</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Reduce cooking time by about 25% or check food earlier</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Use lower fan setting for delicate baked goods like cakes</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Great for roasting and getting crispy results</span>
            </li>
          </ul>
        </div>

        {/* Altitude Tips */}
        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <MountainIcon />
            High Altitude Adjustments
          </h3>
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Above 3,000 ft: Increase oven temp by 15-25°F</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Reduce baking powder/soda by ⅛ to ¼ tsp per teaspoon</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Increase liquids by 2-4 tablespoons per cup</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Reduce sugar by 1-3 tablespoons per cup</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
