/**
 * Side-Dish Pairing Generator
 *
 * The hub tool for "what to serve with X": pick a main dish, set the
 * occasion, diet and guest count, and get a ranked side list grouped by the
 * four jobs a side dish can do — cut richness, add contrast, carry savoury
 * depth, supply starch — with per-person portions scaled to the table.
 *
 * Data lives in ../../data/sideDishPairings (23 mains, one profile each).
 * A dish not in the database falls back to the generic four-jobs sides.
 */

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';
import {
  DISHES,
  GENERIC_SIDES,
  JOB_LABELS,
  JOB_ORDER,
  OCCASION_LABELS,
  DIET_LABELS,
  findDish,
  searchDishes,
  type DishProfile,
  type DishSide,
  type Diet,
  type Occasion,
  type SideJob,
} from '../../data/sideDishPairings';

// --- helpers ---------------------------------------------------------------

const FRACTIONS: Record<string, string> = {
  '0.25': '¼',
  '0.5': '½',
  '0.75': '¾',
};

const PLURALS: Record<string, string> = {
  cup: 'cups',
  slice: 'slices',
  piece: 'pieces',
  roll: 'rolls',
  ear: 'ears',
  potato: 'potatoes',
  tortilla: 'tortillas',
  pita: 'pitas',
  head: 'heads',
  wedge: 'wedges',
};

function formatAmount(amount: number, unit: string): string {
  const rounded = Math.round(amount * 4) / 4;
  const whole = Math.floor(rounded);
  const frac = rounded - whole;
  const fracStr = frac > 0 ? FRACTIONS[frac.toFixed(2)] ?? '' : '';
  const num = whole > 0 ? `${whole}${fracStr}` : fracStr || '0';
  // Units already plural in the data (spears, links, wings…) stay as-is;
  // singular units pluralise via the map; oz / whole / tsp / shrimp never change.
  const label = rounded !== 1 && PLURALS[unit] ? PLURALS[unit] : unit;
  return `${num} ${label}`;
}

function sideKey(job: SideJob, side: DishSide): string {
  return `${job}:${side.name}`;
}

// --- component -------------------------------------------------------------

const OCCASIONS: Occasion[] = ['weeknight', 'game-day', 'bbq', 'potluck', 'holiday', 'formal'];
const DIETS: Diet[] = ['vegetarian', 'vegan', 'glutenFree', 'dairyFree', 'lowCarb'];
const PREP_CAPS = [
  { label: 'Any prep time', value: 999 },
  { label: 'Under 15 min', value: 15 },
  { label: 'Under 30 min', value: 30 },
  { label: 'Under 45 min', value: 45 },
];

export default function SideDishPairingGenerator({
  presetDish,
}: {
  presetDish?: string;
}) {
  const initialDish = presetDish ? findDish(presetDish) : undefined;
  const [query, setQuery] = useState(initialDish ? initialDish.name : '');
  const [dish, setDish] = useState<DishProfile | undefined>(initialDish);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [method, setMethod] = useState<string>('Any');
  const [occasion, setOccasion] = useState<Occasion | 'Any'>('Any');
  const [diets, setDiets] = useState<Diet[]>([]);
  const [guests, setGuests] = useState(4);
  const [prepCap, setPrepCap] = useState(999);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const suggestions = useMemo(() => searchDishes(query), [query]);
  const isGeneric = !dish && query.trim().length > 0;

  const sidesByJob = useMemo(() => {
    const source = dish ? dish.sides : GENERIC_SIDES;
    const out = {} as Record<SideJob, DishSide[]>;
    for (const job of JOB_ORDER) {
      out[job] = source[job].filter((side) => {
        if (prepCap !== 999 && side.prepMinutes > prepCap) return false;
        if (method !== 'Any' && side.methods && !side.methods.includes(method)) return false;
        if (occasion !== 'Any' && side.occasions && !side.occasions.includes(occasion)) return false;
        if (diets.length > 0 && !diets.every((d) => side.diets.includes(d))) return false;
        return true;
      });
    }
    return out;
  }, [dish, method, occasion, diets, prepCap]);

  const totalShown = JOB_ORDER.reduce((n, job) => n + sidesByJob[job].length, 0);

  const selectedSides = useMemo(() => {
    const list: Array<{ job: SideJob; side: DishSide }> = [];
    for (const job of JOB_ORDER) {
      const source = dish ? dish.sides : GENERIC_SIDES;
      for (const side of source[job]) {
        if (selected.has(sideKey(job, side))) list.push({ job, side });
      }
    }
    return list;
  }, [selected, dish]);

  function pickDish(d: DishProfile) {
    setDish(d);
    setQuery(d.name);
    setMethod('Any');
    setShowSuggestions(false);
    setSelected(new Set());
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setShowSuggestions(true);
    const exact = findDish(value);
    if (exact) {
      setDish(exact);
    } else if (dish && value.trim().toLowerCase() !== dish.name.toLowerCase()) {
      setDish(undefined);
    }
  }

  function toggleDiet(d: Diet) {
    setDiets((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  function toggleSide(job: SideJob, side: DishSide) {
    setSelected((prev) => {
      const next = new Set(prev);
      const key = sideKey(job, side);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function suggestMenu() {
    const next = new Set<string>();
    for (const job of JOB_ORDER) {
      const first = sidesByJob[job][0];
      if (first) next.add(sideKey(job, first));
    }
    setSelected(next);
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="rounded-2xl border border-[var(--color-cream-dark)] bg-[var(--color-cream-soft)] p-6 shadow-[var(--shadow-soft)]">
        <label htmlFor="dish-search" className="mb-2 block font-display text-lg font-semibold text-[var(--text-primary)]">
          What is the main dish?
        </label>
        <div className="relative">
          <input
            id="dish-search"
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="Try chili, salmon, mac and cheese, tacos…"
            className="w-full rounded-xl border border-[var(--color-cream-dark)] bg-white px-4 py-3 text-lg text-[var(--text-primary)] outline-none focus:border-[var(--color-wine)]"
            autoComplete="off"
          />
          {showSuggestions && query.trim().length > 0 && suggestions.length > 0 && (
            <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-[var(--color-cream-dark)] bg-white shadow-[var(--shadow-heavy)]">
              {suggestions.slice(0, 8).map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onMouseDown={() => pickDish(d)}
                    className="block w-full px-4 py-3 text-left hover:bg-[var(--color-cream)]"
                  >
                    <span className="font-medium text-[var(--text-primary)]">{d.name}</span>
                    <span className="ml-2 text-sm text-[var(--text-muted)]">{d.aliases.slice(0, 2).join(', ')}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {DISHES.length} mains in the database — or type any dish and the generator falls back to the four-jobs framework.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <span className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Occasion</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOccasion('Any')}
                className={cn('rounded-full px-4 py-2 text-sm font-medium', occasion === 'Any' ? 'bg-[var(--color-wine)] text-white' : 'bg-white text-[var(--text-secondary)] border border-[var(--color-cream-dark)]')}
              >
                Any occasion
              </button>
              {OCCASIONS.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOccasion(o)}
                  className={cn('rounded-full px-4 py-2 text-sm font-medium', occasion === o ? 'bg-[var(--color-wine)] text-white' : 'bg-white text-[var(--text-secondary)] border border-[var(--color-cream-dark)]')}
                >
                  {OCCASION_LABELS[o]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Diet &amp; allergies</span>
            <div className="flex flex-wrap gap-2">
              {DIETS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDiet(d)}
                  aria-pressed={diets.includes(d)}
                  className={cn('rounded-full px-4 py-2 text-sm font-medium', diets.includes(d) ? 'bg-[var(--color-sage)] text-white' : 'bg-white text-[var(--text-secondary)] border border-[var(--color-cream-dark)]')}
                >
                  {DIET_LABELS[d]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Guests</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Fewer guests"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="h-10 w-10 rounded-full border border-[var(--color-cream-dark)] bg-white text-xl font-semibold text-[var(--text-primary)]"
              >
                −
              </button>
              <span className="min-w-24 text-center text-lg font-semibold text-[var(--text-primary)]">
                {guests} {guests === 1 ? 'guest' : 'guests'}
              </span>
              <button
                type="button"
                aria-label="More guests"
                onClick={() => setGuests((g) => Math.min(50, g + 1))}
                className="h-10 w-10 rounded-full border border-[var(--color-cream-dark)] bg-white text-xl font-semibold text-[var(--text-primary)]"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Prep time</span>
            <div className="flex flex-wrap gap-2">
              {PREP_CAPS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setPrepCap(c.value)}
                  className={cn('rounded-full px-4 py-2 text-sm font-medium', prepCap === c.value ? 'bg-[var(--color-wine)] text-white' : 'bg-white text-[var(--text-secondary)] border border-[var(--color-cream-dark)]')}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {dish && dish.methods && (
          <div className="mt-6">
            <span className="mb-2 block text-sm font-semibold uppercase tracking-wide text-[var(--text-muted)]">Cooking method</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMethod('Any')}
                className={cn('rounded-full px-4 py-2 text-sm font-medium', method === 'Any' ? 'bg-[var(--color-wine)] text-white' : 'bg-white text-[var(--text-secondary)] border border-[var(--color-cream-dark)]')}
              >
                Any method
              </button>
              {dish.methods.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={cn('rounded-full px-4 py-2 text-sm font-medium', method === m ? 'bg-[var(--color-wine)] text-white' : 'bg-white text-[var(--text-secondary)] border border-[var(--color-cream-dark)]')}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dish intro */}
      {dish && (
        <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-display text-2xl font-semibold text-[var(--text-primary)]">
            What to serve with {dish.name}
          </h2>
          <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">{dish.blurb}</p>
          {dish.pageSlug && (
            <a href={`/articles/${dish.pageSlug}`} className="mt-3 inline-block font-medium text-[var(--color-wine)] underline">
              Read the full {dish.name} pairing guide →
            </a>
          )}
        </div>
      )}
      {isGeneric && (
        <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-display text-2xl font-semibold text-[var(--text-primary)]">
            What to serve with {query.trim()}
          </h2>
          <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">
            This dish is not in the database yet, so here is the four-jobs framework applied generically:
            one side that cuts richness, one that adds contrast, one that carries savoury depth, and one
            starch. Pick one from each group and the plate works.
          </p>
        </div>
      )}
      {!dish && !isGeneric && (
        <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-display text-2xl font-semibold text-[var(--text-primary)]">Pick a main dish to start</h2>
          <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">
            Popular mains: chili, mac and cheese, salmon, tacos, steak, ribs, lasagna, hummus, prime rib.
            Or type any dish — the generator will apply the four-jobs framework to it.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Chili', 'Mac and Cheese', 'Salmon', 'Tacos', 'Steak'].map((name) => {
              const d = findDish(name);
              return d ? (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => pickDish(d)}
                  className="rounded-full border border-[var(--color-wine)]/30 bg-[var(--color-cream)] px-4 py-2 text-sm font-medium text-[var(--color-wine)]"
                >
                  {d.name}
                </button>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Results */}
      {(dish || isGeneric) && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">{totalShown} sides</strong> match your filters
              {guests > 1 ? ` — portions shown for ${guests} guests` : ' — portions per person'}.
              Tick sides to build your menu.
            </p>
            <button
              type="button"
              onClick={suggestMenu}
              className="rounded-full bg-[var(--color-wine)] px-5 py-2 text-sm font-semibold text-white"
            >
              Suggest a menu (one per group)
            </button>
          </div>

          {totalShown === 0 && (
            <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-soft)]">
              <p className="text-[var(--text-secondary)]">
                No sides match all of those filters. Try widening the prep time, clearing a diet filter,
                or choosing “Any method”.
              </p>
            </div>
          )}

          <div className="space-y-8">
            {JOB_ORDER.map((job) => {
              const sides = sidesByJob[job];
              if (sides.length === 0) return null;
              return (
                <section key={job}>
                  <h3 className="text-display text-xl font-semibold text-[var(--text-primary)]">
                    {JOB_LABELS[job].title}
                  </h3>
                  <p className="mb-4 text-sm text-[var(--text-muted)]">{JOB_LABELS[job].blurb}</p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {sides.map((side) => {
                      const key = sideKey(job, side);
                      const checked = selected.has(key);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleSide(job, side)}
                          aria-pressed={checked}
                          className={cn(
                            'rounded-2xl border p-5 text-left shadow-[var(--shadow-soft)] transition',
                            checked ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]' : 'border-[var(--color-cream-dark)] bg-white hover:border-[var(--color-wine)]/40',
                          )}
                        >
                          <span className="flex items-start justify-between gap-3">
                            <span className="font-display text-lg font-semibold text-[var(--text-primary)]">{side.name}</span>
                            <span className={cn('mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full border', checked ? 'border-[var(--color-wine)] bg-[var(--color-wine)] text-white' : 'border-[var(--color-cream-dark)] bg-white text-transparent')}>
                              ✓
                            </span>
                          </span>
                          <span className="mt-2 block text-[var(--text-secondary)] leading-relaxed">{side.why}</span>
                          <span className="mt-3 block text-sm font-medium text-[var(--text-primary)]">
                            {formatAmount(side.amount * guests, side.unit)} total for {guests} {guests === 1 ? 'guest' : 'guests'}
                            <span className="font-normal text-[var(--text-muted)]"> · {side.prepMinutes === 0 ? 'no prep' : `~${side.prepMinutes} min prep`}</span>
                          </span>
                          <span className="mt-2 flex flex-wrap gap-1">
                            {side.diets.map((d) => (
                              <span key={d} className="rounded-full bg-[var(--color-cream)] px-2 py-0.5 text-xs text-[var(--text-muted)]">{DIET_LABELS[d]}</span>
                            ))}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {/* Menu plan */}
      {selectedSides.length > 0 && (
        <div className="rounded-2xl border border-[var(--color-wine)]/20 bg-white p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-display text-2xl font-semibold text-[var(--text-primary)]">
            Your menu{dish ? ` — ${dish.name}` : ''} ({guests} {guests === 1 ? 'guest' : 'guests'})
          </h2>
          <ul className="mt-4 space-y-3">
            {selectedSides.map(({ job, side }) => (
              <li key={sideKey(job, side)} className="flex items-start justify-between gap-4 border-b border-[var(--color-cream-dark)] pb-3 last:border-0">
                <span>
                  <span className="block font-medium text-[var(--text-primary)]">{side.name}</span>
                  <span className="text-sm text-[var(--text-muted)]">{JOB_LABELS[job].title}</span>
                </span>
                <span className="flex-none font-semibold text-[var(--text-primary)]">
                  {formatAmount(side.amount * guests, side.unit)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-[var(--color-wine)] px-6 py-3 font-semibold text-white"
            >
              Print menu plan
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="rounded-full border border-[var(--color-cream-dark)] bg-white px-6 py-3 font-semibold text-[var(--text-secondary)]"
            >
              Clear menu
            </button>
          </div>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Portions are planning estimates per person, scaled to your guest count. Round up for big
            eaters and teenagers; round down when the menu has more than four sides.
          </p>
        </div>
      )}
    </div>
  );
}
