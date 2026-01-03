/**
 * PairingPlates - Flavor Pairing Finder
 * 
 * Interactive React component for discovering food flavor pairings.
 * Editorial luxury aesthetic with warm, appetizing design.
 */

import { useState, useMemo, useCallback } from 'react';
import {
    flavorProfiles,
    searchIngredients,
    getCategories,
    type FlavorProfile
} from '../../data/flavor-profiles';
import { cn, capitalize, formatPercentage } from '../../lib/utils';

// Icons as inline SVGs to avoid lucide-react issues
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
    </svg>
);

const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
);

const ChefHatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
        <line x1="6" x2="18" y1="17" y2="17" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

interface PairingResult {
    ingredient: FlavorProfile;
    score: number;
    isUnexpected: boolean;
    sharedNotes: string[];
}

export default function FlavorPairingFinder() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIngredient, setSelectedIngredient] = useState<FlavorProfile | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const categories = useMemo(() => getCategories(), []);

    // Filter ingredients based on search query
    const filteredIngredients = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return searchIngredients(searchQuery).slice(0, 8);
    }, [searchQuery]);

    // Calculate pairings for selected ingredient
    const pairings = useMemo((): PairingResult[] => {
        if (!selectedIngredient) return [];

        const results: PairingResult[] = [];

        // Add best pairings
        selectedIngredient.bestPairings.forEach((pairingName, index) => {
            const matchedProfile = flavorProfiles.find(p =>
                p.name.toLowerCase() === pairingName.toLowerCase() ||
                p.id === pairingName.toLowerCase()
            );

            results.push({
                ingredient: matchedProfile || {
                    id: pairingName.toLowerCase().replace(/\s/g, '-'),
                    name: pairingName,
                    category: 'herb',
                    subcategory: 'general',
                    flavorNotes: [],
                    aromaticProfile: [],
                    intensity: 'medium',
                    bestPairings: [],
                    unexpectedPairings: [],
                    cuisineAffinities: [],
                    seasonality: 'year-round',
                    cookingMethods: [],
                },
                score: 95 - (index * 3), // Slightly decrease score for order
                isUnexpected: false,
                sharedNotes: matchedProfile?.flavorNotes.filter(note =>
                    selectedIngredient.flavorNotes.includes(note)
                ) || [],
            });
        });

        // Add unexpected pairings
        selectedIngredient.unexpectedPairings.forEach((pairingName, index) => {
            const matchedProfile = flavorProfiles.find(p =>
                p.name.toLowerCase() === pairingName.toLowerCase()
            );

            results.push({
                ingredient: matchedProfile || {
                    id: pairingName.toLowerCase().replace(/\s/g, '-'),
                    name: pairingName,
                    category: 'spice',
                    subcategory: 'general',
                    flavorNotes: [],
                    aromaticProfile: [],
                    intensity: 'medium',
                    bestPairings: [],
                    unexpectedPairings: [],
                    cuisineAffinities: [],
                    seasonality: 'year-round',
                    cookingMethods: [],
                },
                score: 82 - (index * 2),
                isUnexpected: true,
                sharedNotes: [],
            });
        });

        // Filter by category if not 'all'
        if (activeCategory !== 'all') {
            return results.filter(r => r.ingredient.category === activeCategory);
        }

        return results;
    }, [selectedIngredient, activeCategory]);

    const handleSelectIngredient = useCallback((ingredient: FlavorProfile) => {
        setSelectedIngredient(ingredient);
        setSearchQuery(ingredient.name);
        setShowSuggestions(false);
        setActiveCategory('all');
    }, []);

    const handleClear = useCallback(() => {
        setSelectedIngredient(null);
        setSearchQuery('');
        setActiveCategory('all');
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Search Section */}
            <div className="relative mb-8">
                {/* Search Input */}
                <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSuggestions(true);
                            if (!e.target.value.trim()) {
                                setSelectedIngredient(null);
                            }
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search for an ingredient... (e.g., salmon, basil, lemon)"
                        className={cn(
                            "w-full py-5 pl-14 pr-14 text-lg",
                            "bg-white border-2 border-[var(--color-cream-dark)]",
                            "rounded-xl shadow-[var(--shadow-soft)]",
                            "placeholder:text-[var(--text-muted)] placeholder:font-light",
                            "focus:border-[var(--color-wine)] focus:shadow-[0_0_0_4px_var(--color-wine-glow)]",
                            "focus:outline-none transition-all duration-200",
                            "font-[var(--font-body)]"
                        )}
                        data-testid="ingredient-search"
                    />
                    {searchQuery && (
                        <button
                            onClick={handleClear}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--color-wine)] transition-colors"
                            aria-label="Clear search"
                        >
                            <XIcon />
                        </button>
                    )}
                </div>

                {/* Autocomplete Suggestions */}
                {showSuggestions && filteredIngredients.length > 0 && !selectedIngredient && (
                    <div
                        className={cn(
                            "absolute top-full left-0 right-0 mt-2 z-20",
                            "bg-white border border-[var(--color-cream-dark)] rounded-xl",
                            "shadow-[var(--shadow-medium)] overflow-hidden",
                            "animate-[scaleIn_0.2s_ease-out]"
                        )}
                    >
                        {filteredIngredients.map((ingredient, index) => (
                            <button
                                key={ingredient.id}
                                onClick={() => handleSelectIngredient(ingredient)}
                                className={cn(
                                    "w-full px-5 py-3.5 text-left flex items-center gap-4",
                                    "hover:bg-[var(--color-cream)] transition-colors",
                                    "border-b border-[var(--color-cream-dark)] last:border-0",
                                    index === 0 && "rounded-t-xl",
                                    index === filteredIngredients.length - 1 && "rounded-b-xl"
                                )}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <span className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium",
                                    ingredient.category === 'protein' && "bg-[var(--color-wine)]",
                                    ingredient.category === 'vegetable' && "bg-[var(--color-sage)]",
                                    ingredient.category === 'fruit' && "bg-orange-500",
                                    ingredient.category === 'herb' && "bg-green-600",
                                    ingredient.category === 'spice' && "bg-amber-600",
                                    ingredient.category === 'dairy' && "bg-yellow-500",
                                    ingredient.category === 'grain' && "bg-amber-700",
                                    !['protein', 'vegetable', 'fruit', 'herb', 'spice', 'dairy', 'grain'].includes(ingredient.category) && "bg-gray-500"
                                )}>
                                    {ingredient.name.charAt(0)}
                                </span>
                                <div>
                                    <span className="font-medium text-[var(--text-primary)]">
                                        {ingredient.name}
                                    </span>
                                    <span className="ml-2 text-sm text-[var(--text-muted)]">
                                        {capitalize(ingredient.category)}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Ingredient Display */}
            {selectedIngredient && (
                <div className="mb-8 animate-[fadeInUp_0.4s_ease-out]">
                    {/* Ingredient Header */}
                    <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)] mb-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-display font-semibold",
                                    selectedIngredient.category === 'protein' && "bg-gradient-to-br from-[var(--color-wine)] to-[var(--color-wine-deep)]",
                                    selectedIngredient.category === 'vegetable' && "bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-sage-light)]",
                                    selectedIngredient.category === 'fruit' && "bg-gradient-to-br from-orange-500 to-orange-600",
                                    selectedIngredient.category === 'herb' && "bg-gradient-to-br from-green-500 to-green-600",
                                    selectedIngredient.category === 'spice' && "bg-gradient-to-br from-amber-500 to-amber-600",
                                    selectedIngredient.category === 'dairy' && "bg-gradient-to-br from-yellow-400 to-yellow-500",
                                    selectedIngredient.category === 'grain' && "bg-gradient-to-br from-amber-600 to-amber-700"
                                )}>
                                    {selectedIngredient.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-display font-semibold text-[var(--text-primary)]">
                                        {selectedIngredient.name}
                                    </h3>
                                    <p className="text-[var(--text-muted)] text-sm">
                                        {capitalize(selectedIngredient.category)} • {capitalize(selectedIngredient.subcategory)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClear}
                                className="text-[var(--text-muted)] hover:text-[var(--color-wine)] p-2 transition-colors"
                            >
                                <XIcon />
                            </button>
                        </div>

                        {/* Flavor Notes */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {selectedIngredient.flavorNotes.map(note => (
                                <span
                                    key={note}
                                    className="px-3 py-1 bg-[var(--color-cream)] rounded-full text-sm text-[var(--text-secondary)]"
                                >
                                    {note}
                                </span>
                            ))}
                        </div>

                        {/* Cuisine Affinities */}
                        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                            <ChefHatIcon />
                            <span>Best in: {selectedIngredient.cuisineAffinities.join(', ')}</span>
                        </div>
                    </div>

                    {/* Category Filter Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                activeCategory === 'all'
                                    ? "bg-[var(--color-wine)] text-white shadow-[var(--shadow-medium)]"
                                    : "bg-white border border-[var(--color-cream-dark)] text-[var(--text-secondary)] hover:border-[var(--color-wine)] hover:text-[var(--color-wine)]"
                            )}
                        >
                            All Pairings
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                    activeCategory === cat
                                        ? "bg-[var(--color-wine)] text-white shadow-[var(--shadow-medium)]"
                                        : "bg-white border border-[var(--color-cream-dark)] text-[var(--text-secondary)] hover:border-[var(--color-wine)] hover:text-[var(--color-wine)]"
                                )}
                            >
                                {capitalize(cat)}
                            </button>
                        ))}
                    </div>

                    {/* Pairings Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pairings.map((pairing, index) => (
                            <div
                                key={pairing.ingredient.id + index}
                                className={cn(
                                    "bg-white rounded-xl border border-[var(--color-cream-dark)] p-5",
                                    "shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)]",
                                    "hover:-translate-y-1 transition-all duration-300",
                                    "animate-[fadeInUp_0.4s_ease-out]",
                                    pairing.isUnexpected && "ring-2 ring-[var(--color-gold)] ring-opacity-50"
                                )}
                                style={{ animationDelay: `${index * 50}ms` }}
                                data-testid="pairing-card"
                            >
                                {/* Unexpected Badge */}
                                {pairing.isUnexpected && (
                                    <div className="flex items-center gap-1 text-[var(--color-gold)] text-xs font-semibold uppercase tracking-wide mb-2">
                                        <SparklesIcon />
                                        <span>Unexpected Pairing</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                                        {pairing.ingredient.name}
                                    </h4>
                                    <div className={cn(
                                        "flex items-center gap-1 font-semibold text-sm",
                                        pairing.score >= 85 && "text-[var(--color-sage)]",
                                        pairing.score >= 70 && pairing.score < 85 && "text-[var(--color-gold-muted)]",
                                        pairing.score < 70 && "text-[var(--text-muted)]"
                                    )}>
                                        <span>{formatPercentage(pairing.score)}</span>
                                        <span className="text-xs">match</span>
                                    </div>
                                </div>

                                {/* Match Indicator Bar */}
                                <div className="h-1.5 bg-[var(--color-cream-dark)] rounded-full overflow-hidden mb-3">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-500",
                                            pairing.score >= 85 && "bg-[var(--color-sage)]",
                                            pairing.score >= 70 && pairing.score < 85 && "bg-[var(--color-gold)]",
                                            pairing.score < 70 && "bg-[var(--text-muted)]"
                                        )}
                                        style={{ width: `${pairing.score}%` }}
                                    />
                                </div>

                                {/* Category Badge */}
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                                        pairing.ingredient.category === 'protein' && "bg-[var(--color-wine-glow)] text-[var(--color-wine)]",
                                        pairing.ingredient.category === 'vegetable' && "bg-green-50 text-green-700",
                                        pairing.ingredient.category === 'fruit' && "bg-orange-50 text-orange-700",
                                        pairing.ingredient.category === 'herb' && "bg-emerald-50 text-emerald-700",
                                        pairing.ingredient.category === 'spice' && "bg-amber-50 text-amber-700",
                                        pairing.ingredient.category === 'dairy' && "bg-yellow-50 text-yellow-700",
                                        pairing.ingredient.category === 'grain' && "bg-stone-100 text-stone-700"
                                    )}>
                                        <LeafIcon />
                                        {capitalize(pairing.ingredient.category)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {pairings.length === 0 && (
                        <div className="text-center py-12 text-[var(--text-muted)]">
                            <p>No pairings found for this category. Try selecting "All Pairings".</p>
                        </div>
                    )}
                </div>
            )}

            {/* Initial State - Popular Ingredients */}
            {!selectedIngredient && (
                <div className="animate-[fadeIn_0.5s_ease-out]">
                    <h3 className="text-lg font-display font-semibold text-[var(--text-secondary)] mb-4">
                        Popular Ingredients
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {flavorProfiles.slice(0, 12).map((ingredient, index) => (
                            <button
                                key={ingredient.id}
                                onClick={() => handleSelectIngredient(ingredient)}
                                className={cn(
                                    "flex items-center gap-3 p-4 bg-white rounded-xl",
                                    "border border-[var(--color-cream-dark)]",
                                    "hover:border-[var(--color-wine)] hover:shadow-[var(--shadow-medium)]",
                                    "hover:-translate-y-0.5 transition-all duration-200",
                                    "text-left group"
                                )}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <span className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium",
                                    "transition-transform group-hover:scale-110",
                                    ingredient.category === 'protein' && "bg-[var(--color-wine)]",
                                    ingredient.category === 'vegetable' && "bg-[var(--color-sage)]",
                                    ingredient.category === 'fruit' && "bg-orange-500",
                                    ingredient.category === 'herb' && "bg-green-600",
                                    ingredient.category === 'spice' && "bg-amber-600",
                                    ingredient.category === 'dairy' && "bg-yellow-500",
                                    ingredient.category === 'grain' && "bg-amber-700"
                                )}>
                                    {ingredient.name.charAt(0)}
                                </span>
                                <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--color-wine)]">
                                    {ingredient.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
