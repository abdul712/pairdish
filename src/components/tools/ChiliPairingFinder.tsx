/**
 * Chili Pairing Finder
 *
 * Pick a chili type, an occasion and a dietary preference, and get a
 * shortlist of sides grouped by the role they play on the plate —
 * dunkable / fresh & crunchy / hearty — plus a toppings bar and a
 * sweet or cold finish. Data lives in ../../data/chiliPairings.
 */

import { useMemo, useState } from 'react';
import { cn } from '../../lib/utils';
import {
  CATEGORY_IMAGES,
  CHILI_TYPE_LABELS,
  DIET_LABELS,
  OCCASION_LABELS,
  ROLE_LABELS,
  SIDES,
  TOPPINGS_BAR,
  type ChiliType,
  type Diet,
  type Occasion,
  type Role,
  type ChiliSide,
} from '../../data/chiliPairings';

const CHILI_TYPES: ChiliType[] = ['beef', 'white-chicken', 'turkey', 'vegetarian'];
const OCCASIONS: Occasion[] = ['family-dinner', 'game-day', 'chili-bar'];
const DIETS: Diet[] = ['any', 'vegetarian', 'vegan', 'gluten-free'];
const ROLE_ORDER: Role[] = ['dunkable', 'fresh', 'hearty', 'finish'];

function matchesDiet(side: ChiliSide, diet: Diet): boolean {
  if (diet === 'any') return true;
  return side.diets.includes(diet);
}

export default function ChiliPairingFinder() {
  const [chiliType, setChiliType] = useState<ChiliType>('beef');
  const [occasion, setOccasion] = useState<Occasion>('family-dinner');
  const [diet, setDiet] = useState<Diet>('any');

  const grouped = useMemo(() => {
    const out = {} as Record<Role, ChiliSide[]>;
    for (const role of ROLE_ORDER) {
      out[role] = SIDES.filter(
        (side) =>
          side.roles.includes(role) &&
          side.chiliTypes.includes(chiliType) &&
          side.occasions.includes(occasion) &&
          matchesDiet(side, diet),
      );
    }
    // Fallback: if an occasion filter empties a role, relax the occasion
    // so no group ever comes back blank.
    for (const role of ROLE_ORDER) {
      if (out[role].length === 0) {
        out[role] = SIDES.filter(
          (side) =>
            side.roles.includes(role) &&
            side.chiliTypes.includes(chiliType) &&
            matchesDiet(side, diet),
        );
      }
    }
    return out;
  }, [chiliType, occasion, diet]);

  const totalShown = ROLE_ORDER.reduce((n, role) => n + grouped[role].length, 0);
  const toppings = TOPPINGS_BAR[chiliType];

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="rounded-2xl border border-[var(--color-cream-dark)] bg-[var(--color-cream-soft)] p-6 shadow-[var(--shadow-soft)]">
        <div className="grid gap-6 md:grid-cols-3">
          <fieldset>
            <legend className="mb-2 block font-display text-lg font-semibold text-[var(--text-primary)]">
              1. What kind of chili?
            </legend>
            <div className="flex flex-wrap gap-2">
              {CHILI_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setChiliType(t)}
                  aria-pressed={chiliType === t}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                    chiliType === t
                      ? 'border-[var(--color-wine)] bg-[var(--color-wine)] text-white'
                      : 'border-[var(--color-cream-dark)] bg-white text-[var(--text-primary)] hover:border-[var(--color-wine)]',
                  )}
                >
                  {CHILI_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 block font-display text-lg font-semibold text-[var(--text-primary)]">
              2. What is the occasion?
            </legend>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOccasion(o)}
                  aria-pressed={occasion === o}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                    occasion === o
                      ? 'border-[var(--color-wine)] bg-[var(--color-wine)] text-white'
                      : 'border-[var(--color-cream-dark)] bg-white text-[var(--text-primary)] hover:border-[var(--color-wine)]',
                  )}
                >
                  {OCCASION_LABELS[o]}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 block font-display text-lg font-semibold text-[var(--text-primary)]">
              3. Any dietary preference?
            </legend>
            <div className="flex flex-wrap gap-2">
              {DIETS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDiet(d)}
                  aria-pressed={diet === d}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                    diet === d
                      ? 'border-[var(--color-wine)] bg-[var(--color-wine)] text-white'
                      : 'border-[var(--color-cream-dark)] bg-white text-[var(--text-primary)] hover:border-[var(--color-wine)]',
                  )}
                >
                  {DIET_LABELS[d]}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <p className="mt-5 text-sm text-[var(--text-muted)]">
          {totalShown} sides match {CHILI_TYPE_LABELS[chiliType].toLowerCase()} for{' '}
          {OCCASION_LABELS[occasion].toLowerCase()}
          {diet !== 'any' ? ` (${DIET_LABELS[diet].toLowerCase()})` : ''}. Pick one
          from each group and the plate is balanced.
        </p>
      </div>

      {/* Results, grouped by role */}
      {ROLE_ORDER.map((role) => (
        <section key={role} aria-label={ROLE_LABELS[role]}>
          <h2 className="mb-4 font-display text-2xl font-semibold text-[var(--text-primary)]">
            {ROLE_LABELS[role]}
          </h2>
          {grouped[role].length === 0 ? (
            <p className="text-[var(--text-secondary)]">
              No side in this group matches that combination — try a different
              dietary preference.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {grouped[role].map((side) => {
                const img = CATEGORY_IMAGES[side.category];
                return (
                  <article
                    key={side.name}
                    className="flex gap-4 overflow-hidden rounded-2xl border border-[var(--color-cream-dark)] bg-white p-4 shadow-[var(--shadow-soft)]"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      width="160"
                      height="120"
                      loading="lazy"
                      className="h-24 w-24 flex-none rounded-xl object-cover sm:h-28 sm:w-28"
                    />
                    <div>
                      <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                        {side.name}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {side.why}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      ))}

      {/* Toppings bar */}
      <section
        aria-label="Toppings bar"
        className="rounded-2xl bg-[var(--color-charcoal)] p-6 text-white sm:p-8"
      >
        <span className="badge badge-gold mb-4">Toppings bar</span>
        <h2 className="mb-3 font-display text-2xl font-semibold">
          Set out a toppings bar for {CHILI_TYPE_LABELS[chiliType].toLowerCase()}
        </h2>
        <p className="mb-5 text-white/80">
          Small bowls, guests build their own. About ¼ cup shredded cheese, 2
          tablespoons sour cream and 2 tablespoons pickles or jalapeños per guest.
        </p>
        <ul className="flex flex-wrap gap-2">
          {toppings.map((topping) => (
            <li
              key={topping}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium"
            >
              {topping}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-sm text-[var(--text-muted)]">
        Want the full list with every side grouped by category?{' '}
        <a href="#chili-sides-guide" className="text-[var(--color-wine)] underline">
          Read the guide below
        </a>{' '}
        — or see the full{' '}
        <a href="/articles/what-to-serve-with-chili" className="text-[var(--color-wine)] underline">
          chili pairing guide
        </a>{' '}
        for portions and food safety.
      </p>
    </div>
  );
}
