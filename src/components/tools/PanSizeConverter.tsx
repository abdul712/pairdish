/**
 * Pan Size Converter Component
 *
 * Convert recipes between different pan sizes and shapes.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

type PanShape = 'round' | 'square' | 'rectangle' | 'bundt' | 'loaf' | 'springform';

interface PanSize {
  id: string;
  name: string;
  shape: PanShape;
  dimensions: string;
  area: number; // square inches
  volume: number; // cups
  servings: string;
}

const PAN_SIZES: PanSize[] = [
  // Round pans
  { id: 'round-6', name: '6" Round', shape: 'round', dimensions: '6" x 2"', area: 28.3, volume: 4, servings: '6-8' },
  { id: 'round-8', name: '8" Round', shape: 'round', dimensions: '8" x 2"', area: 50.3, volume: 6, servings: '10-12' },
  { id: 'round-9', name: '9" Round', shape: 'round', dimensions: '9" x 2"', area: 63.6, volume: 8, servings: '12-14' },
  { id: 'round-10', name: '10" Round', shape: 'round', dimensions: '10" x 2"', area: 78.5, volume: 10, servings: '14-16' },
  { id: 'round-12', name: '12" Round', shape: 'round', dimensions: '12" x 2"', area: 113.1, volume: 14, servings: '20-24' },

  // Square pans
  { id: 'square-8', name: '8" Square', shape: 'square', dimensions: '8" x 8" x 2"', area: 64, volume: 8, servings: '9-12' },
  { id: 'square-9', name: '9" Square', shape: 'square', dimensions: '9" x 9" x 2"', area: 81, volume: 10, servings: '12-16' },
  { id: 'square-10', name: '10" Square', shape: 'square', dimensions: '10" x 10" x 2"', area: 100, volume: 12, servings: '16-20' },

  // Rectangle pans
  { id: 'rect-9x13', name: '9x13" Rectangle', shape: 'rectangle', dimensions: '9" x 13" x 2"', area: 117, volume: 14, servings: '18-24' },
  { id: 'rect-11x7', name: '11x7" Rectangle', shape: 'rectangle', dimensions: '11" x 7" x 2"', area: 77, volume: 10, servings: '12-15' },
  { id: 'rect-15x10', name: '15x10" Sheet', shape: 'rectangle', dimensions: '15" x 10" x 1"', area: 150, volume: 10, servings: '24-30' },
  { id: 'rect-18x13', name: '18x13" Half Sheet', shape: 'rectangle', dimensions: '18" x 13" x 1"', area: 234, volume: 15, servings: '30-40' },

  // Bundt pans
  { id: 'bundt-10', name: '10" Bundt', shape: 'bundt', dimensions: '10" x 3.5"', area: 78.5, volume: 12, servings: '12-16' },
  { id: 'bundt-12', name: '12" Bundt', shape: 'bundt', dimensions: '12" x 4"', area: 113.1, volume: 15, servings: '16-20' },

  // Loaf pans
  { id: 'loaf-8x4', name: '8x4" Loaf', shape: 'loaf', dimensions: '8" x 4" x 2.5"', area: 32, volume: 4, servings: '8-10' },
  { id: 'loaf-9x5', name: '9x5" Loaf', shape: 'loaf', dimensions: '9" x 5" x 2.5"', area: 45, volume: 6, servings: '10-12' },

  // Springform pans
  { id: 'spring-8', name: '8" Springform', shape: 'springform', dimensions: '8" x 3"', area: 50.3, volume: 9, servings: '10-12' },
  { id: 'spring-9', name: '9" Springform', shape: 'springform', dimensions: '9" x 3"', area: 63.6, volume: 11, servings: '12-14' },
  { id: 'spring-10', name: '10" Springform', shape: 'springform', dimensions: '10" x 3"', area: 78.5, volume: 14, servings: '14-16' },
];

const SHAPE_ICONS: Record<PanShape, string> = {
  round: '⭕',
  square: '⬜',
  rectangle: '📐',
  bundt: '🍩',
  loaf: '🍞',
  springform: '🎂',
};

const SHAPE_NAMES: Record<PanShape, string> = {
  round: 'Round',
  square: 'Square',
  rectangle: 'Rectangle',
  bundt: 'Bundt',
  loaf: 'Loaf',
  springform: 'Springform',
};

export default function PanSizeConverter() {
  const [fromPan, setFromPan] = useState<string>('round-9');
  const [toPan, setToPan] = useState<string>('square-8');
  const [originalAmount, setOriginalAmount] = useState<string>('1');
  const [shapeFilter, setShapeFilter] = useState<PanShape | 'all'>('all');

  const fromPanData = PAN_SIZES.find((p) => p.id === fromPan);
  const toPanData = PAN_SIZES.find((p) => p.id === toPan);

  // Calculate conversion ratio
  const conversion = useMemo(() => {
    if (!fromPanData || !toPanData) return null;

    const areaRatio = toPanData.area / fromPanData.area;
    const volumeRatio = toPanData.volume / fromPanData.volume;
    const amount = parseFloat(originalAmount) || 1;

    return {
      areaRatio,
      volumeRatio,
      scaleFactor: areaRatio,
      newBatches: amount * areaRatio,
      percentChange: Math.round((areaRatio - 1) * 100),
    };
  }, [fromPanData, toPanData, originalAmount]);

  // Filter pans by shape
  const filteredPans = useMemo(() => {
    if (shapeFilter === 'all') return PAN_SIZES;
    return PAN_SIZES.filter((p) => p.shape === shapeFilter);
  }, [shapeFilter]);

  // Group pans by shape for display
  const groupedPans = useMemo(() => {
    const groups: Record<PanShape, PanSize[]> = {
      round: [],
      square: [],
      rectangle: [],
      bundt: [],
      loaf: [],
      springform: [],
    };
    filteredPans.forEach((pan) => {
      groups[pan.shape].push(pan);
    });
    return groups;
  }, [filteredPans]);

  const swapPans = () => {
    const temp = fromPan;
    setFromPan(toPan);
    setToPan(temp);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Converter Section */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">
          Convert Pan Sizes
        </h2>

        {/* Shape Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setShapeFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              shapeFilter === 'all'
                ? 'bg-[var(--color-wine)] text-white'
                : 'bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-wine-glow)]'
            )}
          >
            All Shapes
          </button>
          {Object.entries(SHAPE_NAMES).map(([shape, name]) => (
            <button
              key={shape}
              onClick={() => setShapeFilter(shape as PanShape)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1',
                shapeFilter === shape
                  ? 'bg-[var(--color-wine)] text-white'
                  : 'bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-wine-glow)]'
              )}
            >
              <span>{SHAPE_ICONS[shape as PanShape]}</span>
              {name}
            </button>
          ))}
        </div>

        {/* Pan Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
          {/* From Pan */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              Original Pan
            </label>
            <select
              value={fromPan}
              onChange={(e) => setFromPan(e.target.value)}
              className="w-full px-4 py-3 border border-[var(--color-cream-dark)] rounded-lg bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
            >
              {Object.entries(groupedPans).map(
                ([shape, pans]) =>
                  pans.length > 0 && (
                    <optgroup key={shape} label={`${SHAPE_ICONS[shape as PanShape]} ${SHAPE_NAMES[shape as PanShape]}`}>
                      {pans.map((pan) => (
                        <option key={pan.id} value={pan.id}>
                          {pan.name} ({pan.dimensions})
                        </option>
                      ))}
                    </optgroup>
                  )
              )}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapPans}
              className="p-3 rounded-full bg-[var(--color-cream)] hover:bg-[var(--color-wine-glow)] transition-colors"
              title="Swap pans"
            >
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
              >
                <path d="M8 3L4 7l4 4" />
                <path d="M4 7h16" />
                <path d="M16 21l4-4-4-4" />
                <path d="M20 17H4" />
              </svg>
            </button>
          </div>

          {/* To Pan */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              New Pan
            </label>
            <select
              value={toPan}
              onChange={(e) => setToPan(e.target.value)}
              className="w-full px-4 py-3 border border-[var(--color-cream-dark)] rounded-lg bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
            >
              {Object.entries(groupedPans).map(
                ([shape, pans]) =>
                  pans.length > 0 && (
                    <optgroup key={shape} label={`${SHAPE_ICONS[shape as PanShape]} ${SHAPE_NAMES[shape as PanShape]}`}>
                      {pans.map((pan) => (
                        <option key={pan.id} value={pan.id}>
                          {pan.name} ({pan.dimensions})
                        </option>
                      ))}
                    </optgroup>
                  )
              )}
            </select>
          </div>
        </div>

        {/* Pan Comparison */}
        {fromPanData && toPanData && conversion && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Original Pan Info */}
            <div className="bg-[var(--color-cream)] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{SHAPE_ICONS[fromPanData.shape]}</span>
                <div>
                  <h3 className="font-display font-semibold text-[var(--text-primary)]">
                    {fromPanData.name}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">{fromPanData.dimensions}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <span className="block text-[var(--text-muted)]">Area</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {fromPanData.area.toFixed(1)} sq in
                  </span>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="block text-[var(--text-muted)]">Volume</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {fromPanData.volume} cups
                  </span>
                </div>
              </div>
            </div>

            {/* New Pan Info */}
            <div className="bg-[var(--color-wine-glow)] rounded-xl p-5 border-2 border-[var(--color-wine)]">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{SHAPE_ICONS[toPanData.shape]}</span>
                <div>
                  <h3 className="font-display font-semibold text-[var(--text-primary)]">
                    {toPanData.name}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">{toPanData.dimensions}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <span className="block text-[var(--text-muted)]">Area</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {toPanData.area.toFixed(1)} sq in
                  </span>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="block text-[var(--text-muted)]">Volume</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {toPanData.volume} cups
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conversion Results */}
        {conversion && (
          <div className="bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-wine-deep)] rounded-xl p-6 text-white">
            <h3 className="font-display text-lg font-semibold mb-4">Conversion Result</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <span className="block text-3xl font-display font-bold">
                  {conversion.scaleFactor.toFixed(2)}x
                </span>
                <span className="text-white/80 text-sm">Scale Factor</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-display font-bold">
                  {conversion.percentChange > 0 ? '+' : ''}{conversion.percentChange}%
                </span>
                <span className="text-white/80 text-sm">Size Change</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-display font-bold">
                  {conversion.newBatches.toFixed(2)}
                </span>
                <span className="text-white/80 text-sm">Recipe Batches</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-display font-bold">
                  {toPanData?.servings}
                </span>
                <span className="text-white/80 text-sm">Servings</span>
              </div>
            </div>

            {/* Adjustment Tips */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="text-white/90 text-sm">
                {conversion.scaleFactor < 1 ? (
                  <>
                    <strong>Smaller pan:</strong> Multiply all ingredients by {conversion.scaleFactor.toFixed(2)}.
                    Baking time may decrease by 10-15 minutes. Check for doneness early.
                  </>
                ) : conversion.scaleFactor > 1 ? (
                  <>
                    <strong>Larger pan:</strong> Multiply all ingredients by {conversion.scaleFactor.toFixed(2)}.
                    Batter will be thinner in pan. Baking time may increase by 10-15 minutes.
                  </>
                ) : (
                  <>
                    <strong>Same size:</strong> No adjustments needed! Both pans have equivalent baking area.
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recipe Adjustment Calculator */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 mb-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
          Recipe Adjustment Calculator
        </h2>
        <p className="text-[var(--text-secondary)] mb-4">
          Enter your original recipe amount to see how much you need for the new pan.
        </p>

        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
              Original Recipe Amount
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={originalAmount}
                onChange={(e) => setOriginalAmount(e.target.value)}
                min="0.1"
                step="0.1"
                className="w-24 px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
              />
              <span className="text-[var(--text-muted)]">batch(es)</span>
            </div>
          </div>

          {conversion && (
            <div className="flex items-center gap-3">
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
                className="text-[var(--color-wine)]"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              <div className="px-4 py-2 bg-[var(--color-wine-glow)] rounded-lg">
                <span className="text-2xl font-display font-bold text-[var(--color-wine)]">
                  {conversion.newBatches.toFixed(2)}
                </span>
                <span className="text-[var(--text-muted)] ml-2">batch(es) for new pan</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pan Reference Guide */}
      <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6">
        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-4">
          Pan Size Reference
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-cream-dark)]">
                <th className="text-left py-3 px-2 font-medium text-[var(--text-muted)]">Pan</th>
                <th className="text-left py-3 px-2 font-medium text-[var(--text-muted)]">Dimensions</th>
                <th className="text-right py-3 px-2 font-medium text-[var(--text-muted)]">Area (sq in)</th>
                <th className="text-right py-3 px-2 font-medium text-[var(--text-muted)]">Volume</th>
                <th className="text-right py-3 px-2 font-medium text-[var(--text-muted)]">Servings</th>
              </tr>
            </thead>
            <tbody>
              {PAN_SIZES.map((pan) => (
                <tr
                  key={pan.id}
                  className={cn(
                    'border-b border-[var(--color-cream)] hover:bg-[var(--color-cream)] transition-colors',
                    (pan.id === fromPan || pan.id === toPan) && 'bg-[var(--color-wine-glow)]'
                  )}
                >
                  <td className="py-3 px-2">
                    <span className="flex items-center gap-2">
                      <span>{SHAPE_ICONS[pan.shape]}</span>
                      <span className="font-medium text-[var(--text-primary)]">{pan.name}</span>
                      {pan.id === fromPan && (
                        <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">From</span>
                      )}
                      {pan.id === toPan && (
                        <span className="text-xs bg-[var(--color-wine)] text-white px-1.5 py-0.5 rounded">To</span>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-[var(--text-secondary)]">{pan.dimensions}</td>
                  <td className="py-3 px-2 text-right text-[var(--text-secondary)]">{pan.area.toFixed(1)}</td>
                  <td className="py-3 px-2 text-right text-[var(--text-secondary)]">{pan.volume} cups</td>
                  <td className="py-3 px-2 text-right text-[var(--text-secondary)]">{pan.servings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-[var(--color-cream)] rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
          Pan Conversion Tips
        </h3>
        <ul className="space-y-2 text-[var(--text-secondary)] text-sm">
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">🍰</span>
            <span><strong>Layer cakes:</strong> Fill pans 1/2 to 2/3 full for proper rise.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">⏱️</span>
            <span><strong>Baking time:</strong> Adjust by 5-10 min per inch of size difference.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">🌡️</span>
            <span><strong>Temperature:</strong> Larger pans may need 25°F lower temp to prevent burning edges.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[var(--color-wine)]">📏</span>
            <span><strong>Depth matters:</strong> A 3" deep pan holds more than a 2" pan of the same width.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
