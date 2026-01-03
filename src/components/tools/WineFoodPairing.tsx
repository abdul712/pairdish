/**
 * PairDish - Wine & Food Pairing Matcher
 *
 * Interactive React component for finding wine and food pairings.
 * Bidirectional: enter a dish to get wine recommendations, or enter a wine to get food suggestions.
 */

import { useState, useMemo, useCallback } from 'react';
import {
    wineProfiles,
    dishCategories,
    searchWines,
    searchDishes,
    getWinesForDish,
    getDishesForWine,
    type WineProfile,
    type DishCategory,
} from '../../data/wine-pairings';
import { cn, capitalize } from '../../lib/utils';

// Icons as inline SVGs
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

const WineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22h8" />
        <path d="M12 15v7" />
        <path d="M12 15c-2.5 0-5-2.5-5-5V4h10v6c0 2.5-2.5 5-5 5Z" />
    </svg>
);

const UtensilsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const ThermometerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
);

const GlassIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 22h8" />
        <path d="M12 15v7" />
        <path d="M12 15c-2.5 0-5-2.5-5-5V4h10v6c0 2.5-2.5 5-5 5Z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
    </svg>
);

const ArrowsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 3 4 4-4 4" />
        <path d="M20 7H4" />
        <path d="m8 21-4-4 4-4" />
        <path d="M4 17h16" />
    </svg>
);

type Direction = 'food-to-wine' | 'wine-to-food';
type BudgetFilter = 'all' | 'budget' | 'mid-range' | 'premium';
type WineTypeFilter = 'all' | 'red' | 'white' | 'rose' | 'sparkling' | 'dessert' | 'fortified';

export default function WineFoodPairing() {
    const [direction, setDirection] = useState<Direction>('food-to-wine');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedWine, setSelectedWine] = useState<WineProfile | null>(null);
    const [selectedDish, setSelectedDish] = useState<string | null>(null);
    const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('all');
    const [wineTypeFilter, setWineTypeFilter] = useState<WineTypeFilter>('all');

    // Search suggestions based on direction
    const suggestions = useMemo(() => {
        if (!searchQuery.trim()) return [];

        if (direction === 'food-to-wine') {
            // Search for dishes
            const matchedCategories = searchDishes(searchQuery);
            const dishes: string[] = [];
            matchedCategories.forEach(cat => {
                cat.dishes.forEach(dish => {
                    if (dish.toLowerCase().includes(searchQuery.toLowerCase())) {
                        dishes.push(dish);
                    }
                });
                if (cat.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                    dishes.push(cat.name);
                }
            });
            return [...new Set(dishes)].slice(0, 8);
        } else {
            // Search for wines
            return searchWines(searchQuery).slice(0, 8);
        }
    }, [searchQuery, direction]);

    // Get pairing results
    const pairingResults = useMemo(() => {
        if (direction === 'food-to-wine' && selectedDish) {
            const results = getWinesForDish(selectedDish);
            if (results.length === 0) return null;

            // Flatten and filter wines
            let wines = results.flatMap(r => r.wines);

            // Apply filters
            if (budgetFilter !== 'all') {
                wines = wines.filter(w => w.priceRange === budgetFilter);
            }
            if (wineTypeFilter !== 'all') {
                wines = wines.filter(w => w.type === wineTypeFilter);
            }

            // Remove duplicates
            wines = [...new Map(wines.map(w => [w.id, w])).values()];

            return {
                type: 'wines' as const,
                wines,
                reasoning: results[0]?.reasoning || '',
            };
        } else if (direction === 'wine-to-food' && selectedWine) {
            const categories = getDishesForWine(selectedWine.id);
            const foods = selectedWine.foodPairings;
            const avoidFoods = selectedWine.avoidPairings;

            return {
                type: 'foods' as const,
                categories,
                foods,
                avoidFoods,
            };
        }
        return null;
    }, [direction, selectedDish, selectedWine, budgetFilter, wineTypeFilter]);

    const handleSelectSuggestion = useCallback((suggestion: string | WineProfile) => {
        if (direction === 'food-to-wine') {
            setSelectedDish(suggestion as string);
            setSearchQuery(suggestion as string);
        } else {
            const wine = suggestion as WineProfile;
            setSelectedWine(wine);
            setSearchQuery(wine.name);
        }
        setShowSuggestions(false);
    }, [direction]);

    const handleClear = useCallback(() => {
        setSearchQuery('');
        setSelectedDish(null);
        setSelectedWine(null);
        setBudgetFilter('all');
        setWineTypeFilter('all');
    }, []);

    const handleToggleDirection = useCallback(() => {
        setDirection(prev => prev === 'food-to-wine' ? 'wine-to-food' : 'food-to-wine');
        handleClear();
    }, [handleClear]);

    const getWineTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            red: 'bg-[var(--color-wine)] text-white',
            white: 'bg-amber-100 text-amber-800',
            rose: 'bg-pink-100 text-pink-800',
            sparkling: 'bg-yellow-100 text-yellow-800',
            dessert: 'bg-orange-100 text-orange-800',
            fortified: 'bg-purple-100 text-purple-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const getBodyLabel = (body: string) => {
        const labels: Record<string, string> = {
            light: 'Light-bodied',
            medium: 'Medium-bodied',
            full: 'Full-bodied',
        };
        return labels[body] || body;
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Direction Toggle */}
            <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)] mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => { setDirection('food-to-wine'); handleClear(); }}
                        className={cn(
                            "flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all w-full sm:w-auto",
                            direction === 'food-to-wine'
                                ? "border-[var(--color-wine)] bg-[var(--color-wine-glow)] shadow-[var(--shadow-medium)]"
                                : "border-[var(--color-cream-dark)] bg-white hover:border-[var(--color-wine)]"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            direction === 'food-to-wine' ? "bg-[var(--color-wine)] text-white" : "bg-[var(--color-cream)] text-[var(--text-muted)]"
                        )}>
                            <UtensilsIcon />
                        </div>
                        <div className="text-left">
                            <div className="font-medium text-[var(--text-primary)]">I have food</div>
                            <div className="text-sm text-[var(--text-muted)]">Find matching wines</div>
                        </div>
                    </button>

                    <button
                        onClick={handleToggleDirection}
                        className="p-2 rounded-full bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] transition-colors text-[var(--text-muted)]"
                    >
                        <ArrowsIcon />
                    </button>

                    <button
                        onClick={() => { setDirection('wine-to-food'); handleClear(); }}
                        className={cn(
                            "flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all w-full sm:w-auto",
                            direction === 'wine-to-food'
                                ? "border-[var(--color-wine)] bg-[var(--color-wine-glow)] shadow-[var(--shadow-medium)]"
                                : "border-[var(--color-cream-dark)] bg-white hover:border-[var(--color-wine)]"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            direction === 'wine-to-food' ? "bg-[var(--color-wine)] text-white" : "bg-[var(--color-cream)] text-[var(--text-muted)]"
                        )}>
                            <WineIcon />
                        </div>
                        <div className="text-left">
                            <div className="font-medium text-[var(--text-primary)]">I have wine</div>
                            <div className="text-sm text-[var(--text-muted)]">Find matching dishes</div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Search Section */}
            <div className="relative mb-8">
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
                                setSelectedDish(null);
                                setSelectedWine(null);
                            }
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder={direction === 'food-to-wine'
                            ? "Search for a dish... (e.g., steak, salmon, pasta)"
                            : "Search for a wine... (e.g., Cabernet, Chardonnay)"
                        }
                        className={cn(
                            "w-full py-5 pl-14 pr-14 text-lg",
                            "bg-white border-2 border-[var(--color-cream-dark)]",
                            "rounded-xl shadow-[var(--shadow-soft)]",
                            "placeholder:text-[var(--text-muted)] placeholder:font-light",
                            "focus:border-[var(--color-wine)] focus:shadow-[0_0_0_4px_var(--color-wine-glow)]",
                            "focus:outline-none transition-all duration-200"
                        )}
                    />
                    {searchQuery && (
                        <button
                            onClick={handleClear}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--color-wine)] transition-colors"
                        >
                            <XIcon />
                        </button>
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && !selectedDish && !selectedWine && (
                    <div className={cn(
                        "absolute top-full left-0 right-0 mt-2 z-20",
                        "bg-white border border-[var(--color-cream-dark)] rounded-xl",
                        "shadow-[var(--shadow-medium)] overflow-hidden"
                    )}>
                        {suggestions.map((suggestion, index) => {
                            const isWine = typeof suggestion !== 'string';
                            const displayName = isWine ? (suggestion as WineProfile).name : suggestion as string;

                            return (
                                <button
                                    key={`${displayName}-${index}`}
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                    className={cn(
                                        "w-full px-5 py-3.5 text-left flex items-center gap-4",
                                        "hover:bg-[var(--color-cream)] transition-colors",
                                        "border-b border-[var(--color-cream-dark)] last:border-0"
                                    )}
                                >
                                    <span className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center text-white",
                                        direction === 'food-to-wine' ? "bg-amber-500" : "bg-[var(--color-wine)]"
                                    )}>
                                        {direction === 'food-to-wine' ? <UtensilsIcon /> : <WineIcon />}
                                    </span>
                                    <div>
                                        <span className="font-medium text-[var(--text-primary)]">
                                            {displayName}
                                        </span>
                                        {isWine && (
                                            <span className="ml-2 text-sm text-[var(--text-muted)]">
                                                {capitalize((suggestion as WineProfile).type)}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Filters (only for food-to-wine) */}
            {direction === 'food-to-wine' && selectedDish && (
                <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-[var(--text-muted)]">Budget:</span>
                        {(['all', 'budget', 'mid-range', 'premium'] as BudgetFilter[]).map(budget => (
                            <button
                                key={budget}
                                onClick={() => setBudgetFilter(budget)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                                    budgetFilter === budget
                                        ? "bg-[var(--color-wine)] text-white"
                                        : "bg-white border border-[var(--color-cream-dark)] text-[var(--text-secondary)] hover:border-[var(--color-wine)]"
                                )}
                            >
                                {budget === 'all' ? 'All' : capitalize(budget)}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-[var(--text-muted)]">Type:</span>
                        {(['all', 'red', 'white', 'sparkling'] as WineTypeFilter[]).map(type => (
                            <button
                                key={type}
                                onClick={() => setWineTypeFilter(type)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                                    wineTypeFilter === type
                                        ? "bg-[var(--color-wine)] text-white"
                                        : "bg-white border border-[var(--color-cream-dark)] text-[var(--text-secondary)] hover:border-[var(--color-wine)]"
                                )}
                            >
                                {capitalize(type)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Results */}
            {pairingResults && (
                <div className="animate-[fadeInUp_0.4s_ease-out]">
                    {/* Food to Wine Results */}
                    {pairingResults.type === 'wines' && (
                        <>
                            {/* Reasoning Header */}
                            <div className="bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-wine-deep)] rounded-xl p-6 mb-6 text-white">
                                <h3 className="font-display text-xl font-semibold mb-2">
                                    Wine Pairings for "{selectedDish}"
                                </h3>
                                <p className="text-white/90">{pairingResults.reasoning}</p>
                            </div>

                            {/* Wine Cards */}
                            {pairingResults.wines.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pairingResults.wines.map((wine, index) => (
                                        <div
                                            key={wine.id}
                                            className={cn(
                                                "bg-white rounded-xl border border-[var(--color-cream-dark)] p-6",
                                                "shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)]",
                                                "hover:-translate-y-1 transition-all duration-300"
                                            )}
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h4 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                                                        {wine.name}
                                                    </h4>
                                                    <p className="text-sm text-[var(--text-muted)]">
                                                        {wine.grapeVarietals.join(', ')}
                                                    </p>
                                                </div>
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-xs font-medium",
                                                    getWineTypeColor(wine.type)
                                                )}>
                                                    {capitalize(wine.type)}
                                                </span>
                                            </div>

                                            {/* Flavor Notes */}
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {wine.flavorNotes.slice(0, 4).map(note => (
                                                    <span
                                                        key={note}
                                                        className="px-2 py-0.5 bg-[var(--color-cream)] rounded-md text-xs text-[var(--text-secondary)]"
                                                    >
                                                        {note}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Wine Details */}
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                                    <span className="font-medium">Body:</span>
                                                    <span>{getBodyLabel(wine.body)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                                    <span className="font-medium">Sweetness:</span>
                                                    <span>{capitalize(wine.sweetness)}</span>
                                                </div>
                                            </div>

                                            {/* Serving Info */}
                                            <div className="mt-4 pt-4 border-t border-[var(--color-cream-dark)] flex items-center gap-4 text-sm text-[var(--text-muted)]">
                                                <div className="flex items-center gap-1.5">
                                                    <ThermometerIcon />
                                                    <span>{wine.servingTemp}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <GlassIcon />
                                                    <span>{wine.glassType}</span>
                                                </div>
                                            </div>

                                            {/* Regions */}
                                            <div className="mt-3 text-xs text-[var(--text-muted)]">
                                                Regions: {wine.regions.slice(0, 3).join(', ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-[var(--text-muted)]">
                                    <p>No wines match your current filters. Try adjusting them.</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Wine to Food Results */}
                    {pairingResults.type === 'foods' && selectedWine && (
                        <>
                            {/* Selected Wine Header */}
                            <div className="bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-wine-deep)] rounded-xl p-6 mb-6 text-white">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className={cn(
                                            "inline-block px-3 py-1 rounded-full text-xs font-medium mb-2",
                                            "bg-white/20"
                                        )}>
                                            {capitalize(selectedWine.type)} Wine
                                        </span>
                                        <h3 className="font-display text-2xl font-semibold">
                                            {selectedWine.name}
                                        </h3>
                                        <p className="text-white/80 mt-1">
                                            {selectedWine.grapeVarietals.join(', ')} | {selectedWine.regions[0]}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {selectedWine.flavorNotes.map(note => (
                                        <span
                                            key={note}
                                            className="px-3 py-1 bg-white/15 rounded-full text-sm"
                                        >
                                            {note}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-6 mt-4 pt-4 border-t border-white/20 text-sm">
                                    <div>
                                        <span className="text-white/60">Body:</span>{' '}
                                        <span>{getBodyLabel(selectedWine.body)}</span>
                                    </div>
                                    <div>
                                        <span className="text-white/60">Sweetness:</span>{' '}
                                        <span>{capitalize(selectedWine.sweetness)}</span>
                                    </div>
                                    <div>
                                        <span className="text-white/60">Tannins:</span>{' '}
                                        <span>{capitalize(selectedWine.tannins)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Perfect Pairings */}
                            <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)] mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckIcon />
                                    <h4 className="font-display text-lg font-semibold text-[var(--color-sage)]">
                                        Perfect Pairings
                                    </h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {pairingResults.foods.map(food => (
                                        <span
                                            key={food}
                                            className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm"
                                        >
                                            {food}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Foods to Avoid */}
                            <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)] mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <XCircleIcon />
                                    <h4 className="font-display text-lg font-semibold text-red-600">
                                        Best to Avoid
                                    </h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {pairingResults.avoidFoods.map(food => (
                                        <span
                                            key={food}
                                            className="px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                                        >
                                            {food}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Related Categories */}
                            {pairingResults.categories.length > 0 && (
                                <div className="bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)]">
                                    <h4 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
                                        Food Categories
                                    </h4>
                                    <div className="space-y-4">
                                        {pairingResults.categories.map(category => (
                                            <div key={category.id} className="p-4 bg-[var(--color-cream)] rounded-lg">
                                                <h5 className="font-medium text-[var(--text-primary)] mb-2">
                                                    {category.name}
                                                </h5>
                                                <p className="text-sm text-[var(--text-secondary)] mb-3">
                                                    {category.reasoning}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {category.dishes.slice(0, 6).map(dish => (
                                                        <span
                                                            key={dish}
                                                            className="px-2 py-1 bg-white rounded-md text-xs text-[var(--text-secondary)]"
                                                        >
                                                            {dish}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Serving Tips */}
                            <div className="mt-6 p-5 bg-[var(--color-cream)] rounded-xl border-l-4 border-[var(--color-wine)]">
                                <h4 className="font-medium text-[var(--text-primary)] mb-2">Serving Tips</h4>
                                <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                                    <div className="flex items-center gap-2">
                                        <ThermometerIcon />
                                        <span>Serve at {selectedWine.servingTemp}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GlassIcon />
                                        <span>Use a {selectedWine.glassType}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Initial State - Popular Options */}
            {!selectedDish && !selectedWine && (
                <div className="animate-[fadeIn_0.5s_ease-out]">
                    <h3 className="text-lg font-display font-semibold text-[var(--text-secondary)] mb-4">
                        {direction === 'food-to-wine' ? 'Popular Dishes' : 'Popular Wines'}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {direction === 'food-to-wine' ? (
                            // Popular dishes
                            ['Steak', 'Salmon', 'Pasta', 'Pizza', 'Chicken', 'Sushi', 'BBQ', 'Cheese Board'].map((dish, index) => (
                                <button
                                    key={dish}
                                    onClick={() => {
                                        setSelectedDish(dish.toLowerCase());
                                        setSearchQuery(dish);
                                    }}
                                    className={cn(
                                        "flex items-center gap-3 p-4 bg-white rounded-xl",
                                        "border border-[var(--color-cream-dark)]",
                                        "hover:border-[var(--color-wine)] hover:shadow-[var(--shadow-medium)]",
                                        "hover:-translate-y-0.5 transition-all duration-200",
                                        "text-left group"
                                    )}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <span className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center transition-transform group-hover:scale-110">
                                        <UtensilsIcon />
                                    </span>
                                    <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--color-wine)]">
                                        {dish}
                                    </span>
                                </button>
                            ))
                        ) : (
                            // Popular wines
                            wineProfiles.slice(0, 8).map((wine, index) => (
                                <button
                                    key={wine.id}
                                    onClick={() => {
                                        setSelectedWine(wine);
                                        setSearchQuery(wine.name);
                                    }}
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
                                        "w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",
                                        wine.type === 'red' && "bg-[var(--color-wine-glow)] text-[var(--color-wine)]",
                                        wine.type === 'white' && "bg-amber-100 text-amber-600",
                                        wine.type === 'sparkling' && "bg-yellow-100 text-yellow-600",
                                        wine.type === 'rose' && "bg-pink-100 text-pink-600"
                                    )}>
                                        <WineIcon />
                                    </span>
                                    <div>
                                        <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--color-wine)]">
                                            {wine.name}
                                        </span>
                                        <span className="block text-xs text-[var(--text-muted)]">
                                            {capitalize(wine.type)}
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
