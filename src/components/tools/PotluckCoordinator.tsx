/**
 * PairDish - Potluck Coordinator
 *
 * Interactive React component for organizing potluck gatherings.
 * Editorial luxury aesthetic with warm, appetizing design.
 */

import { useState, useMemo, useCallback } from 'react';
import { cn, pluralize, generateId } from '../../lib/utils';

// Icons as inline SVGs to avoid lucide-react issues
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const AlertCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
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

const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
);

// Dish category configurations
const DISH_CATEGORIES = [
    { id: 'appetizers', name: 'Appetizers', icon: '🥗', color: 'from-green-500 to-green-600', recommended: 2 },
    { id: 'mains', name: 'Main Dishes', icon: '🍽️', color: 'from-[var(--color-wine)] to-[var(--color-wine-deep)]', recommended: 3 },
    { id: 'sides', name: 'Side Dishes', icon: '🥘', color: 'from-amber-500 to-amber-600', recommended: 3 },
    { id: 'desserts', name: 'Desserts', icon: '🍰', color: 'from-pink-500 to-pink-600', recommended: 2 },
    { id: 'drinks', name: 'Drinks', icon: '🥤', color: 'from-blue-500 to-blue-600', recommended: 2 },
] as const;

// Dietary restriction options
const DIETARY_OPTIONS = [
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥕' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
    { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛' },
    { id: 'nut-free', label: 'Nut-Free', icon: '🥜' },
] as const;

interface Dish {
    id: string;
    categoryId: string;
    name: string;
    contributor: string;
    quantity: number;
    dietaryFlags: string[];
}

export default function PotluckCoordinator() {
    const [guestCount, setGuestCount] = useState<number>(12);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [showAddForm, setShowAddForm] = useState<string | null>(null);
    const [newDishName, setNewDishName] = useState('');
    const [newContributor, setNewContributor] = useState('');
    const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

    // Calculate recommendations based on guest count
    const recommendations = useMemo(() => {
        return DISH_CATEGORIES.map(cat => ({
            ...cat,
            recommended: Math.max(2, Math.ceil((guestCount / 10) * cat.recommended)),
            current: dishes.filter(d => d.categoryId === cat.id).length,
        }));
    }, [guestCount, dishes]);

    // Balance analysis
    const balanceAnalysis = useMemo(() => {
        const total = dishes.length;
        const byCategory = recommendations.map(rec => ({
            ...rec,
            percentage: total > 0 ? (rec.current / rec.recommended) * 100 : 0,
        }));

        const overallBalance = total > 0
            ? byCategory.reduce((sum, cat) => sum + Math.min(cat.percentage, 100), 0) / byCategory.length
            : 0;

        return {
            overall: overallBalance,
            byCategory,
            isBalanced: overallBalance >= 80,
        };
    }, [recommendations, dishes.length]);

    // Dietary coverage analysis
    const dietaryCoverage = useMemo(() => {
        return DIETARY_OPTIONS.map(option => {
            const count = dishes.filter(d => d.dietaryFlags.includes(option.id)).length;
            return {
                ...option,
                count,
                coverage: dishes.length > 0 ? (count / dishes.length) * 100 : 0,
            };
        });
    }, [dishes]);

    const handleAddDish = useCallback((categoryId: string) => {
        if (!newDishName.trim()) return;

        const newDish: Dish = {
            id: generateId(),
            categoryId,
            name: newDishName.trim(),
            contributor: newContributor.trim() || 'Anonymous',
            quantity: Math.max(1, Math.ceil(guestCount / 6)),
            dietaryFlags: selectedDietary,
        };

        setDishes(prev => [...prev, newDish]);
        setNewDishName('');
        setNewContributor('');
        setSelectedDietary([]);
        setShowAddForm(null);
    }, [newDishName, newContributor, selectedDietary, guestCount]);

    const handleRemoveDish = useCallback((dishId: string) => {
        setDishes(prev => prev.filter(d => d.id !== dishId));
    }, []);

    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    const generateShareText = useCallback(() => {
        let text = `🎉 POTLUCK COORDINATOR\n\n`;
        text += `Guest Count: ${guestCount}\n`;
        text += `Total Dishes: ${dishes.length}\n\n`;

        DISH_CATEGORIES.forEach(cat => {
            const categoryDishes = dishes.filter(d => d.categoryId === cat.id);
            if (categoryDishes.length > 0) {
                text += `${cat.icon} ${cat.name}:\n`;
                categoryDishes.forEach(dish => {
                    text += `  • ${dish.name} (${dish.quantity} ${pluralize('serving', dish.quantity)}) - ${dish.contributor}\n`;
                });
                text += '\n';
            }
        });

        return text;
    }, [dishes, guestCount]);

    const handleShare = useCallback(async () => {
        const summary = generateShareText();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Potluck Coordinator Summary',
                    text: summary,
                });
            } catch {
                // User cancelled or share failed silently
            }
        } else {
            await navigator.clipboard.writeText(summary);
            alert('Summary copied to clipboard!');
        }
    }, [generateShareText]);

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Guest Count Section */}
            <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)] mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-wine)] to-[var(--color-wine-deep)] flex items-center justify-center text-white">
                        <UsersIcon />
                    </div>
                    <div>
                        <h3 className="text-xl font-display font-semibold text-[var(--text-primary)]">
                            Expected Guests
                        </h3>
                        <p className="text-sm text-[var(--text-muted)]">
                            How many people are you expecting?
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="4"
                        max="100"
                        value={guestCount}
                        onChange={(e) => setGuestCount(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-[var(--color-cream)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-wine)]"
                    />
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="4"
                            max="100"
                            value={guestCount}
                            onChange={(e) => setGuestCount(Math.max(4, Math.min(100, parseInt(e.target.value) || 4)))}
                            className="w-20 px-3 py-2 text-center border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none"
                        />
                        <span className="text-[var(--text-muted)]">{pluralize('guest', guestCount)}</span>
                    </div>
                </div>
            </div>

            {/* Balance Overview */}
            {dishes.length > 0 && (
                <div className={cn(
                    "bg-white rounded-2xl border-2 p-6 shadow-[var(--shadow-soft)] mb-8",
                    balanceAnalysis.isBalanced ? "border-[var(--color-sage)]" : "border-amber-400"
                )}>
                    <div className="flex items-start gap-4 mb-4">
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center text-white",
                            balanceAnalysis.isBalanced ? "bg-[var(--color-sage)]" : "bg-amber-500"
                        )}>
                            {balanceAnalysis.isBalanced ? <CheckCircleIcon /> : <AlertCircleIcon />}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-display font-semibold text-[var(--text-primary)] mb-1">
                                {balanceAnalysis.isBalanced ? 'Well Balanced!' : 'Needs More Variety'}
                            </h3>
                            <p className="text-sm text-[var(--text-muted)]">
                                {balanceAnalysis.isBalanced
                                    ? "Your potluck has a great variety of dishes across all categories."
                                    : "Consider adding more dishes to underrepresented categories."}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-display font-bold text-[var(--color-wine)]">
                                {Math.round(balanceAnalysis.overall)}%
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">balanced</div>
                        </div>
                    </div>

                    {/* Category Balance Bars */}
                    <div className="space-y-2">
                        {balanceAnalysis.byCategory.map(cat => (
                            <div key={cat.id} className="flex items-center gap-3">
                                <span className="text-xl w-6">{cat.icon}</span>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-[var(--text-secondary)]">{cat.name}</span>
                                        <span className="text-xs text-[var(--text-muted)]">
                                            {cat.current} / {cat.recommended}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-[var(--color-cream)] rounded-full overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full rounded-full transition-all duration-500",
                                                cat.percentage >= 100 && "bg-[var(--color-sage)]",
                                                cat.percentage >= 50 && cat.percentage < 100 && "bg-amber-500",
                                                cat.percentage < 50 && "bg-orange-500"
                                            )}
                                            style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Dish Categories */}
            <div className="space-y-6 mb-8">
                {DISH_CATEGORIES.map((category, idx) => {
                    const rec = recommendations.find(r => r.id === category.id);
                    const categoryDishes = dishes.filter(d => d.categoryId === category.id);
                    const isAddingToCategory = showAddForm === category.id;

                    return (
                        <div
                            key={category.id}
                            className="bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-[var(--shadow-soft)] overflow-hidden"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Category Header */}
                            <div className={cn(
                                "bg-gradient-to-r text-white p-5 flex items-center justify-between",
                                category.color
                            )}>
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{category.icon}</span>
                                    <div>
                                        <h3 className="text-xl font-display font-semibold">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-white/90">
                                            {categoryDishes.length} of {rec?.recommended} recommended
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAddForm(isAddingToCategory ? null : category.id)}
                                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                                    aria-label={`Add ${category.name}`}
                                >
                                    <PlusIcon />
                                </button>
                            </div>

                            {/* Add Dish Form */}
                            {isAddingToCategory && (
                                <div className="p-5 bg-[var(--color-cream)] border-b border-[var(--color-cream-dark)]">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                                Dish Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={newDishName}
                                                onChange={(e) => setNewDishName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddDish(category.id)}
                                                placeholder="e.g., Caesar Salad, BBQ Ribs, Chocolate Cake"
                                                className="w-full px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none"
                                                autoFocus
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                                Who's Bringing It?
                                            </label>
                                            <input
                                                type="text"
                                                value={newContributor}
                                                onChange={(e) => setNewContributor(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddDish(category.id)}
                                                placeholder="Name (optional)"
                                                className="w-full px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                                Dietary Tags
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {DIETARY_OPTIONS.map(option => (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => {
                                                            setSelectedDietary(prev =>
                                                                prev.includes(option.id)
                                                                    ? prev.filter(id => id !== option.id)
                                                                    : [...prev, option.id]
                                                            );
                                                        }}
                                                        className={cn(
                                                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5",
                                                            selectedDietary.includes(option.id)
                                                                ? "bg-[var(--color-wine)] text-white"
                                                                : "bg-white border border-[var(--color-cream-dark)] text-[var(--text-secondary)] hover:border-[var(--color-wine)]"
                                                        )}
                                                    >
                                                        <span>{option.icon}</span>
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAddDish(category.id)}
                                                disabled={!newDishName.trim()}
                                                className={cn(
                                                    "flex-1 px-4 py-2 rounded-lg font-medium transition-colors",
                                                    newDishName.trim()
                                                        ? "bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)]"
                                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                )}
                                            >
                                                Add Dish
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowAddForm(null);
                                                    setNewDishName('');
                                                    setNewContributor('');
                                                    setSelectedDietary([]);
                                                }}
                                                className="px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--color-cream)] transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Dish List */}
                            {categoryDishes.length > 0 ? (
                                <div className="p-5">
                                    <div className="space-y-3">
                                        {categoryDishes.map((dish, dishIdx) => (
                                            <div
                                                key={dish.id}
                                                className="flex items-start justify-between gap-4 p-4 bg-[var(--color-cream)] rounded-lg hover:shadow-[var(--shadow-soft)] transition-shadow"
                                                style={{ animationDelay: `${dishIdx * 50}ms` }}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <h4 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                                                            {dish.name}
                                                        </h4>
                                                        <span className="text-sm text-[var(--text-muted)] whitespace-nowrap ml-3">
                                                            {dish.quantity} {pluralize('serving', dish.quantity)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-[var(--text-secondary)] mb-2">
                                                        Brought by: {dish.contributor}
                                                    </p>
                                                    {dish.dietaryFlags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {dish.dietaryFlags.map(flag => {
                                                                const option = DIETARY_OPTIONS.find(o => o.id === flag);
                                                                return option ? (
                                                                    <span
                                                                        key={flag}
                                                                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded-md text-xs text-[var(--text-secondary)]"
                                                                    >
                                                                        <LeafIcon />
                                                                        {option.label}
                                                                    </span>
                                                                ) : null;
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveDish(dish.id)}
                                                    className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    aria-label="Remove dish"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                !isAddingToCategory && (
                                    <div className="p-8 text-center text-[var(--text-muted)]">
                                        <p>No dishes added yet. Click the + button to add one!</p>
                                    </div>
                                )
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Dietary Coverage */}
            {dishes.length > 0 && (
                <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)] mb-8">
                    <h3 className="text-xl font-display font-semibold text-[var(--text-primary)] mb-4">
                        Dietary Coverage
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {dietaryCoverage.map(option => (
                            <div key={option.id} className="text-center">
                                <div className="w-16 h-16 mx-auto mb-2 bg-[var(--color-cream)] rounded-full flex items-center justify-center text-2xl">
                                    {option.icon}
                                </div>
                                <div className="text-sm font-medium text-[var(--text-primary)]">
                                    {option.label}
                                </div>
                                <div className="text-xs text-[var(--text-muted)]">
                                    {option.count} {pluralize('dish', option.count)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            {dishes.length > 0 && (
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
                        Share Summary
                    </button>
                </div>
            )}
        </div>
    );
}
