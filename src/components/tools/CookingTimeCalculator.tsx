/**
 * Cooking Time Calculator
 *
 * Calculate safe cooking times for meats based on weight, method, and doneness.
 * Features:
 * - Meat type and cut selection
 * - Weight input
 * - Cooking method (oven, grill, smoke)
 * - Desired doneness
 * - USDA safe internal temperatures
 * - Rest time recommendations
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Types
type MeatType = 'beef' | 'pork' | 'poultry' | 'lamb' | 'fish';
type CookingMethod = 'roast' | 'grill' | 'smoke' | 'braise';
type Doneness = 'rare' | 'medium-rare' | 'medium' | 'medium-well' | 'well-done';

interface MeatCut {
  id: string;
  name: string;
  type: MeatType;
  methods: CookingMethod[];
  minutesPerPound: Record<CookingMethod, Record<Doneness, number> | number>;
  tempRange?: Record<Doneness, { internal: number; pullAt: number }>;
  notes?: string;
}

interface InternalTemp {
  meatType: MeatType;
  usda: number;
  description: string;
}

// USDA Safe Internal Temperatures
const USDA_TEMPS: InternalTemp[] = [
  { meatType: 'beef', usda: 145, description: 'Steaks, roasts, and chops (with 3-min rest)' },
  { meatType: 'pork', usda: 145, description: 'Chops, roasts, tenderloin (with 3-min rest)' },
  { meatType: 'poultry', usda: 165, description: 'All poultry (chicken, turkey, duck)' },
  { meatType: 'lamb', usda: 145, description: 'Chops, roasts (with 3-min rest)' },
  { meatType: 'fish', usda: 145, description: 'Fish and shellfish' },
];

// Doneness temperatures (internal temp to pull meat at)
const DONENESS_TEMPS: Record<Doneness, { label: string; tempF: number; color: string }> = {
  'rare': { label: 'Rare', tempF: 125, color: 'bg-red-500' },
  'medium-rare': { label: 'Medium-Rare', tempF: 130, color: 'bg-red-400' },
  'medium': { label: 'Medium', tempF: 140, color: 'bg-orange-400' },
  'medium-well': { label: 'Medium-Well', tempF: 150, color: 'bg-orange-300' },
  'well-done': { label: 'Well-Done', tempF: 160, color: 'bg-amber-200' },
};

// Meat cuts database
const MEAT_CUTS: MeatCut[] = [
  // Beef
  {
    id: 'beef-ribeye-roast',
    name: 'Ribeye Roast / Prime Rib',
    type: 'beef',
    methods: ['roast'],
    minutesPerPound: {
      roast: { 'rare': 15, 'medium-rare': 17, 'medium': 20, 'medium-well': 23, 'well-done': 27 },
      grill: 0, smoke: 0, braise: 0,
    },
    tempRange: {
      'rare': { internal: 120, pullAt: 115 },
      'medium-rare': { internal: 130, pullAt: 125 },
      'medium': { internal: 140, pullAt: 135 },
      'medium-well': { internal: 150, pullAt: 145 },
      'well-done': { internal: 160, pullAt: 155 },
    },
    notes: 'Roast at 450°F for first 15 min, then reduce to 325°F.',
  },
  {
    id: 'beef-tenderloin',
    name: 'Beef Tenderloin',
    type: 'beef',
    methods: ['roast', 'grill'],
    minutesPerPound: {
      roast: { 'rare': 12, 'medium-rare': 14, 'medium': 16, 'medium-well': 18, 'well-done': 22 },
      grill: { 'rare': 10, 'medium-rare': 12, 'medium': 14, 'medium-well': 16, 'well-done': 20 },
      smoke: 0, braise: 0,
    },
    notes: 'Very lean cut - easy to overcook. Rest 10-15 min before slicing.',
  },
  {
    id: 'beef-brisket',
    name: 'Beef Brisket',
    type: 'beef',
    methods: ['smoke', 'braise'],
    minutesPerPound: {
      roast: 0, grill: 0,
      smoke: 60, // 1 hour per pound at 225-250°F
      braise: 50,
    },
    notes: 'Low and slow. Cook until internal temp reaches 195-205°F for tender slicing.',
  },
  {
    id: 'beef-chuck-roast',
    name: 'Chuck Roast',
    type: 'beef',
    methods: ['braise', 'smoke'],
    minutesPerPound: {
      roast: 0, grill: 0,
      smoke: 55,
      braise: 45,
    },
    notes: 'Best braised or smoked. Target 200-205°F internal for pull-apart tender.',
  },

  // Pork
  {
    id: 'pork-loin',
    name: 'Pork Loin Roast',
    type: 'pork',
    methods: ['roast', 'grill'],
    minutesPerPound: {
      roast: { 'rare': 0, 'medium-rare': 0, 'medium': 20, 'medium-well': 22, 'well-done': 25 },
      grill: { 'rare': 0, 'medium-rare': 0, 'medium': 18, 'medium-well': 20, 'well-done': 23 },
      smoke: 0, braise: 0,
    },
    notes: 'Cook to 145°F internal. Very lean - don\'t overcook!',
  },
  {
    id: 'pork-tenderloin',
    name: 'Pork Tenderloin',
    type: 'pork',
    methods: ['roast', 'grill'],
    minutesPerPound: {
      roast: { 'rare': 0, 'medium-rare': 0, 'medium': 18, 'medium-well': 20, 'well-done': 22 },
      grill: { 'rare': 0, 'medium-rare': 0, 'medium': 15, 'medium-well': 18, 'well-done': 20 },
      smoke: 0, braise: 0,
    },
    notes: 'Quick-cooking. Usually 20-25 min total at 425°F for a 1-1.5 lb tenderloin.',
  },
  {
    id: 'pork-shoulder',
    name: 'Pork Shoulder / Butt',
    type: 'pork',
    methods: ['smoke', 'braise'],
    minutesPerPound: {
      roast: 0, grill: 0,
      smoke: 90, // 1.5 hours per pound at 225°F
      braise: 60,
    },
    notes: 'For pulled pork: cook to 195-203°F internal. Rest 30+ min before pulling.',
  },
  {
    id: 'pork-ribs',
    name: 'Pork Spare Ribs',
    type: 'pork',
    methods: ['smoke', 'roast'],
    minutesPerPound: {
      roast: 45, // Wrapped in foil at 300°F
      grill: 0,
      smoke: 90,
      braise: 0,
    },
    notes: 'Baby backs: 4-5 hrs at 225°F. Spare ribs: 5-6 hrs. Use the bend test.',
  },

  // Poultry
  {
    id: 'whole-chicken',
    name: 'Whole Chicken',
    type: 'poultry',
    methods: ['roast'],
    minutesPerPound: {
      roast: 20, // Unstuffed at 350°F
      grill: 0, smoke: 0, braise: 0,
    },
    notes: 'Unstuffed at 350°F. Add 15-30 min if stuffed. Thigh should reach 165°F.',
  },
  {
    id: 'chicken-breast',
    name: 'Chicken Breast (bone-in)',
    type: 'poultry',
    methods: ['roast', 'grill'],
    minutesPerPound: {
      roast: 25,
      grill: 20,
      smoke: 0, braise: 0,
    },
    notes: 'Bone-in at 375°F. Boneless cooks faster (15-20 min at 400°F).',
  },
  {
    id: 'whole-turkey',
    name: 'Whole Turkey',
    type: 'poultry',
    methods: ['roast', 'smoke'],
    minutesPerPound: {
      roast: 15, // Unstuffed at 325°F
      grill: 0,
      smoke: 30, // At 275°F
      braise: 0,
    },
    notes: 'Unstuffed at 325°F. Let rest 20-30 min before carving.',
  },

  // Lamb
  {
    id: 'lamb-leg',
    name: 'Leg of Lamb',
    type: 'lamb',
    methods: ['roast'],
    minutesPerPound: {
      roast: { 'rare': 15, 'medium-rare': 18, 'medium': 20, 'medium-well': 22, 'well-done': 25 },
      grill: 0, smoke: 0, braise: 0,
    },
    notes: 'Roast at 325°F. Rest 15-20 min before carving.',
  },
  {
    id: 'lamb-rack',
    name: 'Rack of Lamb',
    type: 'lamb',
    methods: ['roast', 'grill'],
    minutesPerPound: {
      roast: { 'rare': 12, 'medium-rare': 15, 'medium': 18, 'medium-well': 20, 'well-done': 22 },
      grill: { 'rare': 10, 'medium-rare': 12, 'medium': 15, 'medium-well': 18, 'well-done': 20 },
      smoke: 0, braise: 0,
    },
    notes: 'Sear first, then roast at 375°F. Total cook time usually 20-30 min.',
  },

  // Fish
  {
    id: 'salmon-fillet',
    name: 'Salmon Fillet',
    type: 'fish',
    methods: ['roast', 'grill'],
    minutesPerPound: {
      roast: 12, // at 400°F
      grill: 10,
      smoke: 0, braise: 0,
    },
    notes: 'Cook to 125°F for medium (translucent center), 140°F for well-done.',
  },
  {
    id: 'whole-fish',
    name: 'Whole Fish',
    type: 'fish',
    methods: ['roast', 'grill'],
    minutesPerPound: {
      roast: 15,
      grill: 12,
      smoke: 0, braise: 0,
    },
    notes: 'Rule of thumb: 10 min per inch of thickness at thickest part.',
  },
];

// Icons
const TimerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ThermometerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>
);

export default function CookingTimeCalculator() {
  // State
  const [meatType, setMeatType] = useState<MeatType>('beef');
  const [selectedCut, setSelectedCut] = useState<MeatCut | null>(null);
  const [weight, setWeight] = useState<string>('4');
  const [method, setMethod] = useState<CookingMethod>('roast');
  const [doneness, setDoneness] = useState<Doneness>('medium');

  // Filter cuts by meat type
  const availableCuts = useMemo(() => {
    return MEAT_CUTS.filter(cut => cut.type === meatType);
  }, [meatType]);

  // Get available methods for selected cut
  const availableMethods = useMemo(() => {
    if (!selectedCut) return [];
    return selectedCut.methods;
  }, [selectedCut]);

  // Get available doneness options
  const availableDoneness = useMemo((): Doneness[] => {
    if (!selectedCut || !method) return [];

    const mpp = selectedCut.minutesPerPound[method];
    if (typeof mpp === 'number') {
      // No doneness options (poultry, fish, braised meats)
      return [];
    }

    return Object.entries(mpp)
      .filter(([, minutes]) => minutes > 0)
      .map(([d]) => d as Doneness);
  }, [selectedCut, method]);

  // Calculate cooking time
  const calculation = useMemo(() => {
    if (!selectedCut || !weight) return null;

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) return null;

    const mpp = selectedCut.minutesPerPound[method];
    let minutesPerPound: number;

    if (typeof mpp === 'number') {
      minutesPerPound = mpp;
    } else if (mpp[doneness]) {
      minutesPerPound = mpp[doneness];
    } else {
      return null;
    }

    const totalMinutes = Math.round(weightNum * minutesPerPound);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Get internal temp targets
    let targetTemp: number | undefined;
    let pullTemp: number | undefined;

    if (selectedCut.tempRange && selectedCut.tempRange[doneness]) {
      targetTemp = selectedCut.tempRange[doneness].internal;
      pullTemp = selectedCut.tempRange[doneness].pullAt;
    } else if (meatType === 'poultry') {
      targetTemp = 165;
      pullTemp = 160;
    } else if (meatType === 'fish') {
      targetTemp = 145;
      pullTemp = 140;
    } else if (availableDoneness.length === 0) {
      // Braised meats
      targetTemp = 200;
      pullTemp = 195;
    } else {
      targetTemp = DONENESS_TEMPS[doneness]?.tempF;
      pullTemp = targetTemp ? targetTemp - 5 : undefined;
    }

    // Rest time
    let restMinutes: number;
    if (weightNum >= 10) {
      restMinutes = 30;
    } else if (weightNum >= 5) {
      restMinutes = 20;
    } else if (weightNum >= 2) {
      restMinutes = 10;
    } else {
      restMinutes = 5;
    }

    return {
      totalMinutes,
      hours,
      minutes,
      targetTemp,
      pullTemp,
      restMinutes,
      formatted: hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`,
    };
  }, [selectedCut, weight, method, doneness, meatType, availableDoneness]);

  // Get meat type icon/emoji
  const getMeatEmoji = (type: MeatType): string => {
    const emojis: Record<MeatType, string> = {
      beef: '🥩',
      pork: '🐷',
      poultry: '🍗',
      lamb: '🐑',
      fish: '🐟',
    };
    return emojis[type];
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Calculator Card */}
      <div className="card bg-white p-6 md:p-8 mb-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-3xl text-[var(--color-wine)]">
            <TimerIcon />
          </span>
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            Cooking Time Calculator
          </h2>
        </div>

        {/* Step 1: Select Meat Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
            1. Select Meat Type
          </label>
          <div className="flex flex-wrap gap-2">
            {(['beef', 'pork', 'poultry', 'lamb', 'fish'] as MeatType[]).map(type => (
              <button
                key={type}
                onClick={() => {
                  setMeatType(type);
                  setSelectedCut(null);
                  setMethod('roast');
                  setDoneness('medium');
                }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  meatType === type
                    ? "bg-[var(--color-wine)] text-white"
                    : "bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]"
                )}
              >
                <span>{getMeatEmoji(type)}</span>
                <span className="capitalize">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Cut */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
            2. Select Cut
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableCuts.map(cut => (
              <button
                key={cut.id}
                onClick={() => {
                  setSelectedCut(cut);
                  if (!cut.methods.includes(method)) {
                    setMethod(cut.methods[0]);
                  }
                }}
                className={cn(
                  "p-3 rounded-lg text-sm font-medium transition-all text-left",
                  selectedCut?.id === cut.id
                    ? "bg-[var(--color-wine)] text-white"
                    : "bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]"
                )}
              >
                {cut.name}
              </button>
            ))}
          </div>
        </div>

        {selectedCut && (
          <>
            {/* Step 3: Weight & Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  3. Weight (pounds)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--color-cream-dark)] rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]"
                  placeholder="Enter weight in lbs"
                  min="0.5"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  4. Cooking Method
                </label>
                <div className="flex gap-2">
                  {availableMethods.map(m => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all capitalize",
                        method === m
                          ? "bg-[var(--color-wine)] text-white"
                          : "bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Doneness (if applicable) */}
            {availableDoneness.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                  5. Desired Doneness
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableDoneness.map(d => (
                    <button
                      key={d}
                      onClick={() => setDoneness(d)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                        doneness === d
                          ? "bg-[var(--color-wine)] text-white"
                          : "bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]"
                      )}
                    >
                      <span className={cn(
                        "w-3 h-3 rounded-full",
                        DONENESS_TEMPS[d].color
                      )}></span>
                      {DONENESS_TEMPS[d].label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Results */}
        {calculation && (
          <div className="bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-wine-deep)] rounded-xl p-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-display font-bold mb-2">
                  {calculation.formatted}
                </div>
                <div className="text-sm opacity-80">Estimated Cook Time</div>
              </div>

              {calculation.targetTemp && (
                <div>
                  <div className="text-4xl font-display font-bold mb-2 flex items-center justify-center gap-2">
                    <ThermometerIcon />
                    {calculation.targetTemp}°F
                  </div>
                  <div className="text-sm opacity-80">
                    Target Internal Temp
                    {calculation.pullTemp && calculation.pullTemp !== calculation.targetTemp && (
                      <span className="block text-xs">(Pull at {calculation.pullTemp}°F)</span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <div className="text-4xl font-display font-bold mb-2">
                  {calculation.restMinutes} min
                </div>
                <div className="text-sm opacity-80">Rest Before Carving</div>
              </div>
            </div>

            {selectedCut?.notes && (
              <div className="mt-6 p-4 bg-white/10 rounded-lg flex gap-3">
                <InfoIcon />
                <p className="text-sm">{selectedCut.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* USDA Safe Temps Reference */}
      <div className="card bg-white p-6 mb-8">
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <ThermometerIcon />
          USDA Safe Internal Temperatures
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {USDA_TEMPS.map(temp => (
            <div
              key={temp.meatType}
              className={cn(
                "p-4 rounded-lg",
                temp.meatType === meatType ? "bg-[var(--color-wine-glow)] border-2 border-[var(--color-wine)]" : "bg-[var(--color-cream)]"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{getMeatEmoji(temp.meatType)}</span>
                <span className="font-semibold capitalize">{temp.meatType}</span>
              </div>
              <div className="text-2xl font-bold text-[var(--color-wine)]">{temp.usda}°F</div>
              <div className="text-xs text-[var(--text-muted)]">{temp.description}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-4 flex items-center gap-2">
          <InfoIcon />
          Note: Ground meats (beef, pork, lamb) should reach 160°F. Ground poultry should reach 165°F.
        </p>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Thermometer Tips
          </h3>
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Insert thermometer into thickest part, avoiding bone</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Pull meat 5-10°F below target (carryover cooking)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Instant-read thermometers are more accurate than dial types</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Check multiple spots on large cuts for even cooking</span>
            </li>
          </ul>
        </div>

        <div className="card bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
            Resting Is Essential
          </h3>
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Resting allows juices to redistribute throughout the meat</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Temperature continues to rise during rest (carryover)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Tent loosely with foil to keep warm without steaming</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--color-wine)]">•</span>
              <span>Larger cuts need longer rest times (up to 30 min)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
