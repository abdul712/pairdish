/**
 * PairingPlates - Party Food Calculator
 *
 * Calculate exactly how much food to prepare for any gathering
 * based on guest count, event type, and duration.
 */

import { useState, useMemo, useCallback } from 'react';
import { cn, pluralize } from '../../lib/utils';

// Icons as inline SVGs
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const PrinterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect width="12" height="8" x="6" y="14" />
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

type EventType = 'casual' | 'formal' | 'cocktail' | 'bbq' | 'buffet' | 'dinner';
type MealTime = 'lunch' | 'dinner' | 'appetizers';

interface FoodCategory {
    id: string;
    name: string;
    icon: string;
    perPersonOz: number;
    perPersonPieces?: number;
    unit: string;
    suggestions: string[];
    tips: string;
}

interface DietaryCount {
    vegetarian: number;
    vegan: number;
    glutenFree: number;
}

const EVENT_TYPES: { value: EventType; label: string; desc: string; multiplier: number }[] = [
    { value: 'casual', label: 'Casual Party', desc: 'Relaxed gathering', multiplier: 1.0 },
    { value: 'formal', label: 'Formal Dinner', desc: 'Sit-down meal', multiplier: 1.2 },
    { value: 'cocktail', label: 'Cocktail Party', desc: 'Apps & drinks', multiplier: 0.8 },
    { value: 'bbq', label: 'BBQ/Cookout', desc: 'Grilled foods', multiplier: 1.3 },
    { value: 'buffet', label: 'Buffet Style', desc: 'Self-serve spread', multiplier: 1.15 },
    { value: 'dinner', label: 'Dinner Party', desc: 'Plated courses', multiplier: 1.1 },
];

const FOOD_CATEGORIES: FoodCategory[] = [
    {
        id: 'meat',
        name: 'Main Protein',
        icon: '🍖',
        perPersonOz: 6,
        unit: 'oz',
        suggestions: ['Chicken breast', 'Steak', 'Pork chops', 'Fish fillet', 'Lamb chops'],
        tips: 'Plan for 6-8 oz per adult for boneless meats, 8-10 oz for bone-in cuts.',
    },
    {
        id: 'sides',
        name: 'Side Dishes',
        icon: '🥗',
        perPersonOz: 4,
        unit: 'oz',
        suggestions: ['Roasted vegetables', 'Mashed potatoes', 'Rice pilaf', 'Coleslaw', 'Salad'],
        tips: 'Provide 2-3 side options. Guests typically take small portions of each.',
    },
    {
        id: 'appetizers',
        name: 'Appetizers',
        icon: '🧀',
        perPersonPieces: 5,
        perPersonOz: 2,
        unit: 'pieces',
        suggestions: ['Cheese & crackers', 'Veggie tray', 'Bruschetta', 'Meatballs', 'Shrimp cocktail'],
        tips: 'For cocktail parties, increase to 8-10 pieces per person.',
    },
    {
        id: 'bread',
        name: 'Bread/Rolls',
        icon: '🥖',
        perPersonPieces: 1.5,
        perPersonOz: 2,
        unit: 'rolls',
        suggestions: ['Dinner rolls', 'Baguette slices', 'Cornbread', 'Garlic bread'],
        tips: '1-2 rolls or 2-3 slices per person. Provide butter or dipping oil.',
    },
    {
        id: 'dessert',
        name: 'Desserts',
        icon: '🍰',
        perPersonOz: 4,
        perPersonPieces: 1,
        unit: 'serving',
        suggestions: ['Cake slices', 'Pie wedges', 'Cookies', 'Brownies', 'Fruit tart'],
        tips: 'Plan 1 serving per person, plus 10% extra. Mini desserts: 2-3 per person.',
    },
    {
        id: 'salad',
        name: 'Salad',
        icon: '🥬',
        perPersonOz: 3,
        unit: 'oz',
        suggestions: ['Garden salad', 'Caesar salad', 'Greek salad', 'Pasta salad', 'Fruit salad'],
        tips: 'About 1 cup (3 oz) per person. Dress salad just before serving.',
    },
];

export default function PartyFoodCalculator() {
    const [guestCount, setGuestCount] = useState(20);
    const [childCount, setChildCount] = useState(0);
    const [eventType, setEventType] = useState<EventType>('casual');
    const [mealTime, setMealTime] = useState<MealTime>('dinner');
    const [duration, setDuration] = useState(3);
    const [heavyEaters, setHeavyEaters] = useState(0);
    const [dietary, setDietary] = useState<DietaryCount>({
        vegetarian: 0,
        vegan: 0,
        glutenFree: 0,
    });

    // Get event multiplier
    const eventMultiplier = useMemo(() => {
        const event = EVENT_TYPES.find(e => e.value === eventType);
        let multiplier = event?.multiplier || 1.0;

        // Adjust for meal time
        if (mealTime === 'lunch') multiplier *= 0.85;
        if (mealTime === 'appetizers') multiplier *= 0.6;

        // Adjust for duration
        if (duration > 3) multiplier *= 1 + ((duration - 3) * 0.05);

        // Adjust for heavy eaters
        if (heavyEaters > 0) {
            multiplier *= 1 + (heavyEaters / guestCount * 0.2);
        }

        return multiplier;
    }, [eventType, mealTime, duration, heavyEaters, guestCount]);

    // Calculate adult equivalent (children eat ~60% of adult portions)
    const adultEquivalent = useMemo(() => {
        const adults = guestCount - childCount;
        return adults + (childCount * 0.6);
    }, [guestCount, childCount]);

    // Calculate food quantities
    const foodQuantities = useMemo(() => {
        return FOOD_CATEGORIES.map(category => {
            let totalOz = adultEquivalent * category.perPersonOz * eventMultiplier;
            let totalPieces = category.perPersonPieces
                ? Math.ceil(adultEquivalent * category.perPersonPieces * eventMultiplier)
                : undefined;

            // Convert to pounds if over 32 oz
            const pounds = totalOz >= 32 ? totalOz / 16 : undefined;

            // For cocktail parties, increase appetizers
            if (eventType === 'cocktail' && category.id === 'appetizers') {
                totalPieces = Math.ceil(totalPieces! * 1.8);
            }

            // For appetizers-only, reduce main dishes
            if (mealTime === 'appetizers' && (category.id === 'meat' || category.id === 'sides')) {
                totalOz *= 0.3;
            }

            return {
                ...category,
                totalOz: Math.ceil(totalOz),
                totalPounds: pounds ? Math.ceil(pounds * 10) / 10 : undefined,
                totalPieces,
                perPerson: category.perPersonPieces
                    ? `${category.perPersonPieces} ${category.unit}`
                    : `${category.perPersonOz} oz`,
            };
        });
    }, [adultEquivalent, eventMultiplier, eventType, mealTime]);

    // Calculate budget estimates
    const budgetEstimate = useMemo(() => {
        const pricePerPerson = {
            budget: 8,
            moderate: 15,
            premium: 25,
        };

        return {
            budget: Math.round(guestCount * pricePerPerson.budget),
            moderate: Math.round(guestCount * pricePerPerson.moderate * eventMultiplier),
            premium: Math.round(guestCount * pricePerPerson.premium * eventMultiplier),
        };
    }, [guestCount, eventMultiplier]);

    // Generate shopping list
    const generateShoppingList = useCallback(() => {
        let list = `PARTY FOOD SHOPPING LIST\n`;
        list += `========================\n\n`;
        list += `Event: ${EVENT_TYPES.find(e => e.value === eventType)?.label}\n`;
        list += `Guests: ${guestCount} (${guestCount - childCount} adults, ${childCount} children)\n`;
        list += `Duration: ${duration} hours\n\n`;

        list += `QUANTITIES NEEDED:\n`;
        list += `------------------\n`;

        foodQuantities.forEach(item => {
            if (item.totalPounds) {
                list += `${item.icon} ${item.name}: ${item.totalPounds} lbs\n`;
            } else if (item.totalPieces) {
                list += `${item.icon} ${item.name}: ${item.totalPieces} ${item.unit}\n`;
            } else {
                list += `${item.icon} ${item.name}: ${item.totalOz} oz\n`;
            }
        });

        if (dietary.vegetarian > 0 || dietary.vegan > 0 || dietary.glutenFree > 0) {
            list += `\nDIETARY NEEDS:\n`;
            list += `--------------\n`;
            if (dietary.vegetarian > 0) list += `Vegetarian options for ${dietary.vegetarian} guests\n`;
            if (dietary.vegan > 0) list += `Vegan options for ${dietary.vegan} guests\n`;
            if (dietary.glutenFree > 0) list += `Gluten-free options for ${dietary.glutenFree} guests\n`;
        }

        list += `\nESTIMATED BUDGET: $${budgetEstimate.moderate}\n`;

        return list;
    }, [foodQuantities, guestCount, childCount, eventType, duration, dietary, budgetEstimate]);

    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    const handleShare = useCallback(async () => {
        const summary = generateShoppingList();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Party Food Calculator',
                    text: summary,
                });
            } catch {
                // User cancelled
            }
        } else {
            await navigator.clipboard.writeText(summary);
            alert('Shopping list copied to clipboard!');
        }
    }, [generateShoppingList]);

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Input Section */}
            <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)] mb-8">
                <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">
                    Event Details
                </h2>

                {/* Guest Count Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-2">
                            <UsersIcon />
                            Total Guests
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="range"
                                min="5"
                                max="200"
                                value={guestCount}
                                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                                className="flex-1 h-2 bg-[var(--color-cream)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-wine)]"
                            />
                            <input
                                type="number"
                                min="5"
                                max="200"
                                value={guestCount}
                                onChange={(e) => setGuestCount(Math.max(5, parseInt(e.target.value) || 5))}
                                className="w-16 px-2 py-1 text-center border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                            Children (under 12)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max={guestCount - 1}
                            value={childCount}
                            onChange={(e) => setChildCount(Math.min(guestCount - 1, Math.max(0, parseInt(e.target.value) || 0)))}
                            className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-2">
                            <ClockIcon />
                            Duration (hours)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="8"
                            value={duration}
                            onChange={(e) => setDuration(Math.max(1, Math.min(8, parseInt(e.target.value) || 3)))}
                            className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none"
                        />
                    </div>
                </div>

                {/* Event Type */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-3 block">
                        Event Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                        {EVENT_TYPES.map(event => (
                            <button
                                key={event.value}
                                onClick={() => setEventType(event.value)}
                                className={cn(
                                    "p-3 rounded-lg border-2 text-left transition-all",
                                    eventType === event.value
                                        ? "border-[var(--color-wine)] bg-[var(--color-wine-glow)] shadow-md"
                                        : "border-[var(--color-cream-dark)] bg-white hover:border-[var(--color-wine)]"
                                )}
                            >
                                <div className="font-medium text-sm text-[var(--text-primary)]">{event.label}</div>
                                <div className="text-xs text-[var(--text-muted)]">{event.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Meal Time */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-3 block">
                        Meal Time
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { value: 'lunch' as const, label: 'Lunch', desc: 'Lighter portions' },
                            { value: 'dinner' as const, label: 'Dinner', desc: 'Full portions' },
                            { value: 'appetizers' as const, label: 'Apps Only', desc: 'No main course' },
                        ].map(time => (
                            <button
                                key={time.value}
                                onClick={() => setMealTime(time.value)}
                                className={cn(
                                    "px-4 py-2 rounded-lg border-2 transition-all",
                                    mealTime === time.value
                                        ? "border-[var(--color-wine)] bg-[var(--color-wine-glow)]"
                                        : "border-[var(--color-cream-dark)] hover:border-[var(--color-wine)]"
                                )}
                            >
                                <span className="font-medium text-[var(--text-primary)]">{time.label}</span>
                                <span className="text-xs text-[var(--text-muted)] ml-2">({time.desc})</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Advanced Options */}
                <details className="group">
                    <summary className="cursor-pointer text-sm font-medium text-[var(--text-secondary)] mb-3 list-none flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-open:rotate-180 transition-transform">
                            <path d="m6 9 6 6 6-6"/>
                        </svg>
                        Advanced Options
                    </summary>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-[var(--color-cream)] rounded-lg">
                        <div>
                            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                                Heavy Eaters
                            </label>
                            <input
                                type="number"
                                min="0"
                                max={guestCount}
                                value={heavyEaters}
                                onChange={(e) => setHeavyEaters(Math.min(guestCount, Math.max(0, parseInt(e.target.value) || 0)))}
                                className="w-full px-3 py-2 bg-white border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none"
                            />
                            <p className="text-xs text-[var(--text-muted)] mt-1">Guests who eat more than average</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                                Dietary Restrictions
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <input
                                        type="number"
                                        min="0"
                                        max={guestCount}
                                        value={dietary.vegetarian}
                                        onChange={(e) => setDietary(prev => ({ ...prev, vegetarian: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-2 py-1 text-center bg-white border border-[var(--color-cream-dark)] rounded-lg text-sm focus:border-[var(--color-wine)] focus:outline-none"
                                    />
                                    <p className="text-xs text-[var(--text-muted)] text-center mt-1">Vegetarian</p>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        min="0"
                                        max={guestCount}
                                        value={dietary.vegan}
                                        onChange={(e) => setDietary(prev => ({ ...prev, vegan: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-2 py-1 text-center bg-white border border-[var(--color-cream-dark)] rounded-lg text-sm focus:border-[var(--color-wine)] focus:outline-none"
                                    />
                                    <p className="text-xs text-[var(--text-muted)] text-center mt-1">Vegan</p>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        min="0"
                                        max={guestCount}
                                        value={dietary.glutenFree}
                                        onChange={(e) => setDietary(prev => ({ ...prev, glutenFree: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-2 py-1 text-center bg-white border border-[var(--color-cream-dark)] rounded-lg text-sm focus:border-[var(--color-wine)] focus:outline-none"
                                    />
                                    <p className="text-xs text-[var(--text-muted)] text-center mt-1">Gluten-Free</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </details>
            </div>

            {/* Results Section */}
            <div className="bg-gradient-to-br from-[var(--color-wine)] to-[var(--color-wine-deep)] rounded-2xl p-8 shadow-[var(--shadow-medium)] mb-8 text-white">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-2xl font-semibold">Food Quantities</h2>
                    <div className="text-right">
                        <div className="text-white/80 text-sm">For</div>
                        <div className="text-2xl font-display font-bold">{guestCount} {pluralize('Guest', guestCount)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {foodQuantities.map(item => (
                        <div key={item.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-white/70">{item.perPerson} per person</p>
                                </div>
                            </div>
                            <div className="text-3xl font-display font-bold mb-2">
                                {item.totalPounds
                                    ? `${item.totalPounds} lbs`
                                    : item.totalPieces
                                    ? `${item.totalPieces} ${item.unit}`
                                    : `${item.totalOz} oz`}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Suggestions & Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Food Suggestions */}
                <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)]">
                    <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
                        Food Suggestions
                    </h3>
                    <div className="space-y-4">
                        {foodQuantities.slice(0, 4).map(item => (
                            <div key={item.id}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span>{item.icon}</span>
                                    <span className="font-medium text-[var(--text-primary)]">{item.name}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {item.suggestions.map(suggestion => (
                                        <span
                                            key={suggestion}
                                            className="px-2 py-1 bg-[var(--color-cream)] rounded-md text-xs text-[var(--text-secondary)]"
                                        >
                                            {suggestion}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Budget Estimates */}
                <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)]">
                    <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
                        Budget Estimates
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-[var(--color-cream)] rounded-lg">
                            <div>
                                <div className="font-medium text-[var(--text-primary)]">Budget-Friendly</div>
                                <div className="text-xs text-[var(--text-muted)]">Simple ingredients, fewer options</div>
                            </div>
                            <div className="text-xl font-display font-bold text-[var(--color-wine)]">
                                ${budgetEstimate.budget}
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[var(--color-wine-glow)] rounded-lg ring-2 ring-[var(--color-wine)]">
                            <div>
                                <div className="font-medium text-[var(--text-primary)]">Moderate</div>
                                <div className="text-xs text-[var(--text-muted)]">Good variety, quality ingredients</div>
                            </div>
                            <div className="text-xl font-display font-bold text-[var(--color-wine)]">
                                ${budgetEstimate.moderate}
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[var(--color-cream)] rounded-lg">
                            <div>
                                <div className="font-medium text-[var(--text-primary)]">Premium</div>
                                <div className="text-xs text-[var(--text-muted)]">High-quality, specialty items</div>
                            </div>
                            <div className="text-xl font-display font-bold text-[var(--color-wine)]">
                                ${budgetEstimate.premium}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dietary Reminders */}
            {(dietary.vegetarian > 0 || dietary.vegan > 0 || dietary.glutenFree > 0) && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                    <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                        <CheckIcon />
                        Dietary Reminders
                    </h3>
                    <div className="space-y-2 text-sm text-amber-700">
                        {dietary.vegetarian > 0 && (
                            <p>Provide vegetarian main options for {dietary.vegetarian} {pluralize('guest', dietary.vegetarian)}</p>
                        )}
                        {dietary.vegan > 0 && (
                            <p>Ensure vegan options (no animal products) for {dietary.vegan} {pluralize('guest', dietary.vegan)}</p>
                        )}
                        {dietary.glutenFree > 0 && (
                            <p>Label gluten-free options for {dietary.glutenFree} {pluralize('guest', dietary.glutenFree)}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Planning Tips */}
            <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)] mb-8">
                <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
                    Party Planning Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--text-secondary)]">
                    {foodQuantities.slice(0, 4).map(item => (
                        <div key={item.id} className="p-4 bg-[var(--color-cream)] rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span>{item.icon}</span>
                                <h4 className="font-medium text-[var(--text-primary)]">{item.name}</h4>
                            </div>
                            <p>{item.tips}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-4">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-[var(--color-cream-dark)] rounded-lg font-medium text-[var(--text-secondary)] hover:border-[var(--color-wine)] hover:text-[var(--color-wine)] transition-colors"
                >
                    <PrinterIcon />
                    Print List
                </button>
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--color-wine)] text-white rounded-lg font-medium hover:bg-[var(--color-wine-deep)] transition-colors"
                >
                    <ShareIcon />
                    Share / Copy
                </button>
            </div>
        </div>
    );
}
