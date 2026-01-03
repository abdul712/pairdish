/**
 * PairDish - Wine Bottle Calculator
 *
 * Interactive React component for calculating wine quantities for events.
 * Editorial luxury aesthetic with warm, appetizing design.
 */

import { useState, useMemo, useCallback } from 'react';
import { cn, pluralize } from '../../lib/utils';

// Icons as inline SVGs to avoid lucide-react issues
const WineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22h8" />
        <path d="M12 15v7" />
        <path d="M12 15c-2.5 0-5-2.5-5-5V4h10v6c0 2.5-2.5 5-5 5Z" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
    </svg>
);

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
    </svg>
);

const DollarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

type EventType = 'dinner' | 'reception' | 'cocktail';
type ServingStyle = 'with-meal' | 'cocktail-hour' | 'all-evening';

interface WineRatio {
    red: number;
    white: number;
    sparkling: number;
}

interface CalculationResult {
    totalBottles: number;
    redBottles: number;
    whiteBottles: number;
    sparklingBottles: number;
    totalGlasses: number;
    glassesPerPerson: number;
}

interface BudgetEstimate {
    low: number;
    mid: number;
    high: number;
}

export default function WineBottleCalculator() {
    const [guestCount, setGuestCount] = useState<string>('20');
    const [duration, setDuration] = useState<string>('4');
    const [eventType, setEventType] = useState<EventType>('dinner');
    const [servingStyle, setServingStyle] = useState<ServingStyle>('with-meal');
    const [wineRatio, setWineRatio] = useState<WineRatio>({
        red: 40,
        white: 40,
        sparkling: 20,
    });

    // Calculate wine bottles needed
    const calculation = useMemo((): CalculationResult | null => {
        const guests = parseInt(guestCount);
        const hours = parseFloat(duration);

        if (!guests || guests < 1 || !hours || hours < 0.5) return null;

        // Base glasses per person per hour
        let glassesPerHour = 1.0;

        // Adjust based on event type
        switch (eventType) {
            case 'dinner':
                glassesPerHour = 0.8; // More food, slower drinking
                break;
            case 'reception':
                glassesPerHour = 1.2; // Standing, social, more drinking
                break;
            case 'cocktail':
                glassesPerHour = 1.0; // Moderate pace
                break;
        }

        // Adjust based on serving style
        switch (servingStyle) {
            case 'with-meal':
                glassesPerHour *= 0.85; // Food slows consumption
                break;
            case 'cocktail-hour':
                glassesPerHour *= 1.1; // Higher consumption during cocktail hour
                break;
            case 'all-evening':
                glassesPerHour *= 0.95; // Standard rate
                break;
        }

        // Total glasses needed
        const totalGlasses = Math.ceil(guests * hours * glassesPerHour);
        const glassesPerPerson = totalGlasses / guests;

        // Convert to bottles (5 glasses per 750ml bottle)
        const glassesPerBottle = 5;
        const totalBottles = Math.ceil(totalGlasses / glassesPerBottle);

        // Calculate ratio split (ensure total is 100)
        const totalRatio = wineRatio.red + wineRatio.white + wineRatio.sparkling;
        const redBottles = Math.ceil((totalBottles * wineRatio.red) / totalRatio);
        const whiteBottles = Math.ceil((totalBottles * wineRatio.white) / totalRatio);
        const sparklingBottles = Math.ceil((totalBottles * wineRatio.sparkling) / totalRatio);

        return {
            totalBottles: redBottles + whiteBottles + sparklingBottles,
            redBottles,
            whiteBottles,
            sparklingBottles,
            totalGlasses,
            glassesPerPerson,
        };
    }, [guestCount, duration, eventType, servingStyle, wineRatio]);

    // Calculate budget estimates
    const budgetEstimate = useMemo((): BudgetEstimate | null => {
        if (!calculation) return null;

        // Average bottle prices (in USD)
        const prices = {
            red: { low: 12, mid: 25, high: 50 },
            white: { low: 10, mid: 22, high: 45 },
            sparkling: { low: 15, mid: 30, high: 60 },
        };

        const lowBudget =
            calculation.redBottles * prices.red.low +
            calculation.whiteBottles * prices.white.low +
            calculation.sparklingBottles * prices.sparkling.low;

        const midBudget =
            calculation.redBottles * prices.red.mid +
            calculation.whiteBottles * prices.white.mid +
            calculation.sparklingBottles * prices.sparkling.mid;

        const highBudget =
            calculation.redBottles * prices.red.high +
            calculation.whiteBottles * prices.white.high +
            calculation.sparklingBottles * prices.sparkling.high;

        return { low: lowBudget, mid: midBudget, high: highBudget };
    }, [calculation]);

    // Update ratio while maintaining total of 100
    const handleRatioChange = useCallback((type: keyof WineRatio, value: number) => {
        setWineRatio(prev => {
            const newRatio = { ...prev, [type]: Math.max(0, Math.min(100, value)) };

            // Ensure total doesn't exceed 100
            const total = newRatio.red + newRatio.white + newRatio.sparkling;
            if (total > 100) {
                const excess = total - 100;
                const otherKeys = (['red', 'white', 'sparkling'] as const).filter(k => k !== type);

                // Distribute excess reduction proportionally to others
                otherKeys.forEach(key => {
                    const reduction = Math.ceil((newRatio[key] / (total - newRatio[type])) * excess);
                    newRatio[key] = Math.max(0, newRatio[key] - reduction);
                });
            }

            return newRatio;
        });
    }, []);

    const totalRatio = wineRatio.red + wineRatio.white + wineRatio.sparkling;

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Input Section */}
            <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] p-8 shadow-[var(--shadow-soft)] mb-8">
                <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">
                    Event Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Guest Count */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-2">
                            <UsersIcon />
                            Number of Guests
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="1000"
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            className={cn(
                                "w-full px-4 py-3 rounded-lg",
                                "bg-[var(--color-cream)] border-2 border-transparent",
                                "focus:bg-white focus:border-[var(--color-wine)] focus:outline-none",
                                "transition-all duration-200 text-lg"
                            )}
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] mb-2">
                            <ClockIcon />
                            Event Duration (hours)
                        </label>
                        <input
                            type="number"
                            min="0.5"
                            max="12"
                            step="0.5"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className={cn(
                                "w-full px-4 py-3 rounded-lg",
                                "bg-[var(--color-cream)] border-2 border-transparent",
                                "focus:bg-white focus:border-[var(--color-wine)] focus:outline-none",
                                "transition-all duration-200 text-lg"
                            )}
                        />
                    </div>
                </div>

                {/* Event Type */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                        Event Type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { value: 'dinner' as const, label: 'Dinner Party', desc: 'Seated meal' },
                            { value: 'reception' as const, label: 'Reception', desc: 'Standing event' },
                            { value: 'cocktail' as const, label: 'Cocktail Party', desc: 'Casual gathering' },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setEventType(option.value)}
                                className={cn(
                                    "p-4 rounded-lg border-2 text-left transition-all",
                                    eventType === option.value
                                        ? "border-[var(--color-wine)] bg-[var(--color-wine-glow)] shadow-[var(--shadow-medium)]"
                                        : "border-[var(--color-cream-dark)] hover:border-[var(--color-wine)] bg-white"
                                )}
                            >
                                <div className="font-medium text-[var(--text-primary)]">{option.label}</div>
                                <div className="text-sm text-[var(--text-muted)] mt-1">{option.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Serving Style */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                        Serving Style
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { value: 'with-meal' as const, label: 'With Meal', desc: 'Wine during dinner' },
                            { value: 'cocktail-hour' as const, label: 'Cocktail Hour', desc: 'Pre-dinner drinks' },
                            { value: 'all-evening' as const, label: 'All Evening', desc: 'Throughout event' },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setServingStyle(option.value)}
                                className={cn(
                                    "p-4 rounded-lg border-2 text-left transition-all",
                                    servingStyle === option.value
                                        ? "border-[var(--color-wine)] bg-[var(--color-wine-glow)] shadow-[var(--shadow-medium)]"
                                        : "border-[var(--color-cream-dark)] hover:border-[var(--color-wine)] bg-white"
                                )}
                            >
                                <div className="font-medium text-[var(--text-primary)]">{option.label}</div>
                                <div className="text-sm text-[var(--text-muted)] mt-1">{option.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Wine Ratio Sliders */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                        Wine Type Preferences
                    </label>

                    <div className="space-y-4">
                        {/* Red Wine */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-[var(--text-primary)]">Red Wine</span>
                                <span className="text-sm font-semibold text-[var(--color-wine)]">{wineRatio.red}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={wineRatio.red}
                                onChange={(e) => handleRatioChange('red', parseInt(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--color-cream-dark)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-wine)]"
                            />
                        </div>

                        {/* White Wine */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-[var(--text-primary)]">White Wine</span>
                                <span className="text-sm font-semibold text-amber-600">{wineRatio.white}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={wineRatio.white}
                                onChange={(e) => handleRatioChange('white', parseInt(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--color-cream-dark)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600"
                            />
                        </div>

                        {/* Sparkling Wine */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-[var(--text-primary)]">Sparkling Wine</span>
                                <span className="text-sm font-semibold text-[var(--color-gold)]">{wineRatio.sparkling}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={wineRatio.sparkling}
                                onChange={(e) => handleRatioChange('sparkling', parseInt(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--color-cream-dark)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-gold)]"
                            />
                        </div>
                    </div>

                    {/* Total indicator */}
                    <div className="mt-3 text-right">
                        <span className={cn(
                            "text-sm font-medium",
                            totalRatio === 100 ? "text-[var(--color-sage)]" : "text-orange-600"
                        )}>
                            Total: {totalRatio}% {totalRatio !== 100 && '(adjust to 100%)'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {calculation && (
                <div className="animate-[fadeInUp_0.4s_ease-out]">
                    {/* Main Results */}
                    <div className="bg-gradient-to-br from-[var(--color-wine)] to-[var(--color-wine-deep)] rounded-2xl p-8 shadow-[var(--shadow-medium)] mb-6 text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <WineIcon />
                            <h2 className="font-display text-2xl font-semibold">Wine Recommendations</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="text-white/80 text-sm mb-2">Total Bottles Needed</div>
                                <div className="text-4xl font-display font-bold">
                                    {calculation.totalBottles}
                                </div>
                                <div className="text-white/70 text-sm mt-1">
                                    ({calculation.totalGlasses} {pluralize('glass', calculation.totalGlasses)})
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="text-white/80 text-sm mb-2">Per Person</div>
                                <div className="text-4xl font-display font-bold">
                                    {calculation.glassesPerPerson.toFixed(1)}
                                </div>
                                <div className="text-white/70 text-sm mt-1">
                                    {pluralize('glass', Math.round(calculation.glassesPerPerson))} per guest
                                </div>
                            </div>
                        </div>

                        {/* Wine Type Breakdown */}
                        <div className="mt-6 space-y-3">
                            {calculation.redBottles > 0 && (
                                <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                                    <span className="font-medium">Red Wine</span>
                                    <span className="text-xl font-display font-semibold">{calculation.redBottles} {pluralize('bottle', calculation.redBottles)}</span>
                                </div>
                            )}
                            {calculation.whiteBottles > 0 && (
                                <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                                    <span className="font-medium">White Wine</span>
                                    <span className="text-xl font-display font-semibold">{calculation.whiteBottles} {pluralize('bottle', calculation.whiteBottles)}</span>
                                </div>
                            )}
                            {calculation.sparklingBottles > 0 && (
                                <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                                    <span className="font-medium">Sparkling Wine</span>
                                    <span className="text-xl font-display font-semibold">{calculation.sparklingBottles} {pluralize('bottle', calculation.sparklingBottles)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Budget Estimates */}
                    {budgetEstimate && (
                        <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] p-8 shadow-[var(--shadow-soft)] mb-6">
                            <div className="flex items-center gap-3 mb-6">
                                <DollarIcon />
                                <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                                    Budget Estimates
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-[var(--color-cream)] rounded-xl p-5 text-center">
                                    <div className="text-sm text-[var(--text-muted)] mb-2">Budget-Friendly</div>
                                    <div className="text-2xl font-display font-bold text-[var(--color-wine)]">
                                        ${budgetEstimate.low}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)] mt-1">$10-15 per bottle</div>
                                </div>

                                <div className="bg-gradient-to-br from-[var(--color-wine-glow)] to-[var(--color-cream)] rounded-xl p-5 text-center ring-2 ring-[var(--color-wine)]">
                                    <div className="text-sm text-[var(--text-secondary)] font-medium mb-2">Recommended</div>
                                    <div className="text-2xl font-display font-bold text-[var(--color-wine)]">
                                        ${budgetEstimate.mid}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)] mt-1">$22-30 per bottle</div>
                                </div>

                                <div className="bg-[var(--color-cream)] rounded-xl p-5 text-center">
                                    <div className="text-sm text-[var(--text-muted)] mb-2">Premium</div>
                                    <div className="text-2xl font-display font-bold text-[var(--color-wine)]">
                                        ${budgetEstimate.high}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)] mt-1">$45-60 per bottle</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Wine Selection Tips */}
                    <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] p-8 shadow-[var(--shadow-soft)]">
                        <div className="flex items-center gap-3 mb-6">
                            <LightbulbIcon />
                            <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                                Wine Selection Tips
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-wine-glow)] text-[var(--color-wine)] flex items-center justify-center font-semibold text-sm">
                                    1
                                </div>
                                <div>
                                    <h4 className="font-medium text-[var(--text-primary)] mb-1">Variety is Key</h4>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        Offer at least 2-3 different wines per category to accommodate different preferences.
                                        Include a lighter and fuller-bodied option in each color.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-wine-glow)] text-[var(--color-wine)] flex items-center justify-center font-semibold text-sm">
                                    2
                                </div>
                                <div>
                                    <h4 className="font-medium text-[var(--text-primary)] mb-1">Temperature Matters</h4>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        Red: 60-65°F, White & Rosé: 45-50°F, Sparkling: 40-45°F.
                                        Chill wine for 2-3 hours before serving, or 30 minutes in an ice bath.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-wine-glow)] text-[var(--color-wine)] flex items-center justify-center font-semibold text-sm">
                                    3
                                </div>
                                <div>
                                    <h4 className="font-medium text-[var(--text-primary)] mb-1">Buy Extra for Safety</h4>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        Consider adding 10-20% more bottles than calculated. Most stores accept unopened returns,
                                        and it's better to have too much than run out mid-event.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-wine-glow)] text-[var(--color-wine)] flex items-center justify-center font-semibold text-sm">
                                    4
                                </div>
                                <div>
                                    <h4 className="font-medium text-[var(--text-primary)] mb-1">Consider the Menu</h4>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        Red wines pair well with red meats and rich sauces. Whites complement seafood,
                                        chicken, and lighter dishes. Sparkling works for appetizers and celebrations.
                                    </p>
                                </div>
                            </div>

                            {eventType === 'reception' && (
                                <div className="mt-6 p-4 bg-[var(--color-cream)] rounded-lg border-l-4 border-[var(--color-wine)]">
                                    <div className="flex items-center gap-2 text-[var(--color-wine)] font-medium mb-1">
                                        <SparklesIcon />
                                        Reception Tip
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        For standing receptions, guests typically consume more wine. Consider adding an extra 15-20%
                                        to your calculated amount, especially for longer events.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
