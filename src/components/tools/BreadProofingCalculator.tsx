/**
 * Bread Proofing Calculator Component
 *
 * Estimate dough rise times based on temperature, yeast amount, and other conditions.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
interface ProofingConditions {
  temperature: number;
  tempUnit: 'F' | 'C';
  yeastType: 'instant' | 'active-dry' | 'fresh' | 'sourdough';
  yeastAmount: 'standard' | 'reduced' | 'minimal';
  hydration: 'low' | 'medium' | 'high';
  enriched: boolean;
  altitude: 'sea-level' | 'moderate' | 'high';
}

interface ProofingResult {
  bulkFerment: { min: number; max: number };
  finalProof: { min: number; max: number };
  tips: string[];
  readinessTests: string[];
}

// Base proofing times (in minutes) at 75°F with standard yeast
const BASE_TIMES = {
  bulkFerment: { min: 60, max: 90 },
  finalProof: { min: 45, max: 60 },
};

// Temperature reference data
const temperatureGuide = [
  { temp: '65-68°F (18-20°C)', label: 'Cool', time: '2-3x longer', notes: 'Great for overnight proofs, more flavor development' },
  { temp: '70-75°F (21-24°C)', label: 'Room Temp', time: 'Standard', notes: 'Ideal for most bread recipes' },
  { temp: '76-80°F (24-27°C)', label: 'Warm', time: '25-50% faster', notes: 'Watch carefully to avoid over-proofing' },
  { temp: '81-85°F (27-29°C)', label: 'Very Warm', time: '50-75% faster', notes: 'Risk of off-flavors, not recommended' },
];

// Yeast type multipliers
const yeastMultipliers: Record<string, number> = {
  'instant': 1.0,
  'active-dry': 1.1,
  'fresh': 0.95,
  'sourdough': 2.5, // Sourdough takes much longer
};

// Yeast amount multipliers
const yeastAmountMultipliers: Record<string, number> = {
  'standard': 1.0, // ~2.25 tsp per 3 cups flour
  'reduced': 1.5, // ~1 tsp per 3 cups flour
  'minimal': 2.5, // ~0.5 tsp per 3 cups flour
};

// Temperature factor calculation
const getTemperatureFactor = (temp: number, unit: 'F' | 'C'): number => {
  const tempF = unit === 'C' ? (temp * 9) / 5 + 32 : temp;

  if (tempF < 60) return 3.0; // Very cold
  if (tempF < 65) return 2.5;
  if (tempF < 70) return 1.8;
  if (tempF < 75) return 1.3;
  if (tempF < 78) return 1.0; // Baseline
  if (tempF < 82) return 0.75;
  if (tempF < 86) return 0.6;
  return 0.5; // Very warm
};

export default function BreadProofingCalculator() {
  const [conditions, setConditions] = useState<ProofingConditions>({
    temperature: 72,
    tempUnit: 'F',
    yeastType: 'instant',
    yeastAmount: 'standard',
    hydration: 'medium',
    enriched: false,
    altitude: 'sea-level',
  });

  // Calculate proofing times
  const result = useMemo((): ProofingResult => {
    let tempFactor = getTemperatureFactor(conditions.temperature, conditions.tempUnit);
    let yeastFactor = yeastMultipliers[conditions.yeastType];
    let amountFactor = yeastAmountMultipliers[conditions.yeastAmount];

    // Hydration adjustment
    let hydrationFactor = 1.0;
    if (conditions.hydration === 'low') hydrationFactor = 1.15;
    if (conditions.hydration === 'high') hydrationFactor = 0.9;

    // Enriched dough adjustment (butter, eggs, sugar slow fermentation)
    let enrichedFactor = conditions.enriched ? 1.3 : 1.0;

    // Altitude adjustment (dough rises faster at altitude)
    let altitudeFactor = 1.0;
    if (conditions.altitude === 'moderate') altitudeFactor = 0.85;
    if (conditions.altitude === 'high') altitudeFactor = 0.7;

    // Calculate total multiplier
    const totalMultiplier = tempFactor * yeastFactor * amountFactor * hydrationFactor * enrichedFactor * altitudeFactor;

    // Calculate times
    const bulkFerment = {
      min: Math.round(BASE_TIMES.bulkFerment.min * totalMultiplier),
      max: Math.round(BASE_TIMES.bulkFerment.max * totalMultiplier),
    };

    const finalProof = {
      min: Math.round(BASE_TIMES.finalProof.min * totalMultiplier),
      max: Math.round(BASE_TIMES.finalProof.max * totalMultiplier),
    };

    // Generate tips
    const tips: string[] = [];
    const tempF = conditions.tempUnit === 'C' ? (conditions.temperature * 9) / 5 + 32 : conditions.temperature;

    if (tempF < 65) {
      tips.push('Consider a warmer spot like near the oven or in the microwave with a cup of hot water.');
    }
    if (tempF > 82) {
      tips.push('Temperature is quite warm - watch for over-proofing and consider a cooler spot.');
    }
    if (conditions.yeastType === 'sourdough') {
      tips.push('Sourdough timing varies greatly based on starter strength. Use visual cues over time.');
    }
    if (conditions.yeastAmount === 'minimal') {
      tips.push('Low yeast amounts develop more flavor but require patience. Great for overnight rises.');
    }
    if (conditions.enriched) {
      tips.push('Enriched doughs proof slower due to fat and sugar. Be patient for best results.');
    }
    if (conditions.altitude === 'high') {
      tips.push('At high altitude, reduce yeast by 25% and watch carefully to prevent over-rising.');
    }
    if (conditions.hydration === 'high') {
      tips.push('High hydration doughs are stickier but develop beautiful open crumb structure.');
    }

    // Readiness tests
    const readinessTests = [
      'Poke Test: Press dough with floured finger. If it springs back slowly, it\'s ready.',
      'Volume Test: Dough should roughly double in size during bulk fermentation.',
      'Jiggle Test: Gently shake the container - properly proofed dough will jiggle like jello.',
      'Bubble Test: Look for bubbles on surface and around edges of the dough.',
    ];

    if (conditions.yeastType === 'sourdough') {
      readinessTests.push('Float Test: A piece of dough should float in water when fully fermented.');
    }

    return { bulkFerment, finalProof, tips, readinessTests };
  }, [conditions]);

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  };

  const handleChange = (key: keyof ProofingConditions, value: any) => {
    setConditions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Input Section */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 md:p-8 mb-8">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">
          Proofing Conditions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Temperature */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Room/Dough Temperature
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={conditions.temperature}
                onChange={(e) => handleChange('temperature', parseInt(e.target.value) || 70)}
                className="flex-1 px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]/20 focus:border-[var(--color-wine)]"
              />
              <div className="flex rounded-lg border border-[var(--color-cream-dark)] overflow-hidden">
                <button
                  onClick={() => handleChange('tempUnit', 'F')}
                  className={cn(
                    'px-3 py-2 text-sm font-medium transition-colors',
                    conditions.tempUnit === 'F'
                      ? 'bg-[var(--color-wine)] text-white'
                      : 'bg-white text-[var(--text-secondary)] hover:bg-[var(--color-cream)]'
                  )}
                >
                  °F
                </button>
                <button
                  onClick={() => handleChange('tempUnit', 'C')}
                  className={cn(
                    'px-3 py-2 text-sm font-medium transition-colors',
                    conditions.tempUnit === 'C'
                      ? 'bg-[var(--color-wine)] text-white'
                      : 'bg-white text-[var(--text-secondary)] hover:bg-[var(--color-cream)]'
                  )}
                >
                  °C
                </button>
              </div>
            </div>
          </div>

          {/* Yeast Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Yeast Type
            </label>
            <select
              value={conditions.yeastType}
              onChange={(e) => handleChange('yeastType', e.target.value)}
              className="w-full px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]/20 focus:border-[var(--color-wine)] bg-white"
            >
              <option value="instant">Instant Yeast</option>
              <option value="active-dry">Active Dry Yeast</option>
              <option value="fresh">Fresh Yeast</option>
              <option value="sourdough">Sourdough Starter</option>
            </select>
          </div>

          {/* Yeast Amount */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Yeast Amount
            </label>
            <select
              value={conditions.yeastAmount}
              onChange={(e) => handleChange('yeastAmount', e.target.value)}
              className="w-full px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]/20 focus:border-[var(--color-wine)] bg-white"
            >
              <option value="standard">Standard (~2¼ tsp per 3 cups flour)</option>
              <option value="reduced">Reduced (~1 tsp per 3 cups flour)</option>
              <option value="minimal">Minimal (~½ tsp per 3 cups flour)</option>
            </select>
          </div>

          {/* Hydration */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Dough Hydration
            </label>
            <select
              value={conditions.hydration}
              onChange={(e) => handleChange('hydration', e.target.value)}
              className="w-full px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]/20 focus:border-[var(--color-wine)] bg-white"
            >
              <option value="low">Low (55-62%)</option>
              <option value="medium">Medium (63-72%)</option>
              <option value="high">High (73%+)</option>
            </select>
          </div>

          {/* Altitude */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Altitude
            </label>
            <select
              value={conditions.altitude}
              onChange={(e) => handleChange('altitude', e.target.value)}
              className="w-full px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]/20 focus:border-[var(--color-wine)] bg-white"
            >
              <option value="sea-level">Sea Level (0-3,000 ft)</option>
              <option value="moderate">Moderate (3,000-6,000 ft)</option>
              <option value="high">High (6,000+ ft)</option>
            </select>
          </div>

          {/* Enriched Toggle */}
          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative',
                  conditions.enriched ? 'bg-[var(--color-wine)]' : 'bg-[var(--color-cream-dark)]'
                )}
                onClick={() => handleChange('enriched', !conditions.enriched)}
              >
                <div
                  className={cn(
                    'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                    conditions.enriched ? 'translate-x-7' : 'translate-x-1'
                  )}
                />
              </div>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                Enriched Dough (butter, eggs, sugar)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Bulk Fermentation */}
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-600"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-amber-800">Bulk Fermentation</h3>
              <p className="text-sm text-amber-600">First rise after mixing</p>
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-amber-800 mb-2">
            {formatTime(result.bulkFerment.min)} – {formatTime(result.bulkFerment.max)}
          </div>
          <p className="text-sm text-amber-700">
            Until dough doubles in size with visible bubbles
          </p>
        </div>

        {/* Final Proof */}
        <div className="bg-green-50 rounded-xl border border-green-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-green-800">Final Proof</h3>
              <p className="text-sm text-green-600">After shaping, before baking</p>
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-green-800 mb-2">
            {formatTime(result.finalProof.min)} – {formatTime(result.finalProof.max)}
          </div>
          <p className="text-sm text-green-700">
            Until dough passes the poke test
          </p>
        </div>
      </div>

      {/* Tips */}
      {result.tips.length > 0 && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-8">
          <h3 className="font-display text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
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
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            Tips for Your Conditions
          </h3>
          <ul className="space-y-2">
            {result.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-blue-700">
                <span className="text-blue-400 mt-1">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Readiness Tests */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-8">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          How to Tell When Dough is Ready
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.readinessTests.map((test, index) => (
            <div key={index} className="p-4 bg-[var(--color-cream)] rounded-lg">
              <p className="text-sm text-[var(--text-secondary)]">{test}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Temperature Reference */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Temperature Reference Guide
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-cream-dark)]">
                <th className="text-left py-3 px-4 font-medium text-[var(--text-primary)]">Temperature</th>
                <th className="text-left py-3 px-4 font-medium text-[var(--text-primary)]">Label</th>
                <th className="text-left py-3 px-4 font-medium text-[var(--text-primary)]">Time Effect</th>
                <th className="text-left py-3 px-4 font-medium text-[var(--text-primary)]">Notes</th>
              </tr>
            </thead>
            <tbody>
              {temperatureGuide.map((row, index) => (
                <tr key={index} className="border-b border-[var(--color-cream)]">
                  <td className="py-3 px-4 font-medium text-[var(--text-primary)]">{row.temp}</td>
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        row.label === 'Cool' && 'bg-blue-100 text-blue-700',
                        row.label === 'Room Temp' && 'bg-green-100 text-green-700',
                        row.label === 'Warm' && 'bg-amber-100 text-amber-700',
                        row.label === 'Very Warm' && 'bg-red-100 text-red-700'
                      )}
                    >
                      {row.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">{row.time}</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
