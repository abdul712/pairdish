/**
 * PairDish - Recipe Scaling Calculator
 *
 * Universal recipe scaler that adjusts ingredient quantities intelligently
 * with smart fraction display and scaling tips.
 */

import { useState, useMemo, useCallback } from 'react';
import { cn, formatFraction, pluralize } from '../../lib/utils';

// Icons as inline SVGs
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

const PrinterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect width="12" height="8" x="6" y="14" />
    </svg>
);

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
    </svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
    </svg>
);

// Common cooking units
const UNITS = [
    // Volume
    { value: 'cup', label: 'cup', category: 'volume' },
    { value: 'tbsp', label: 'tablespoon', category: 'volume' },
    { value: 'tsp', label: 'teaspoon', category: 'volume' },
    { value: 'ml', label: 'milliliter', category: 'volume' },
    { value: 'l', label: 'liter', category: 'volume' },
    { value: 'fl oz', label: 'fluid ounce', category: 'volume' },
    // Weight
    { value: 'g', label: 'gram', category: 'weight' },
    { value: 'kg', label: 'kilogram', category: 'weight' },
    { value: 'oz', label: 'ounce', category: 'weight' },
    { value: 'lb', label: 'pound', category: 'weight' },
    // Count
    { value: 'piece', label: 'piece', category: 'count' },
    { value: 'clove', label: 'clove', category: 'count' },
    { value: 'slice', label: 'slice', category: 'count' },
    { value: 'can', label: 'can', category: 'count' },
    { value: 'package', label: 'package', category: 'count' },
    { value: 'bunch', label: 'bunch', category: 'count' },
    { value: 'pinch', label: 'pinch', category: 'count' },
    { value: 'dash', label: 'dash', category: 'count' },
];

// Ingredients that don't scale linearly
const SPECIAL_INGREDIENTS = {
    eggs: { note: 'Use whole eggs only. Consider medium eggs for fractions.' },
    yeast: { note: 'Increase slightly less than proportionally for large batches.' },
    salt: { note: 'Scale to 80% when doubling+ to avoid over-salting.' },
    'baking powder': { note: 'Scale to 80-90% when doubling to prevent metallic taste.' },
    'baking soda': { note: 'Scale to 80-90% when doubling.' },
    garlic: { note: 'Scale to 75% when doubling+ as flavor intensifies.' },
    vanilla: { note: 'Scale to 75% when doubling as flavor intensifies.' },
    leavening: { note: 'Scale to 80-90% when doubling for best results.' },
    spices: { note: 'Add gradually and taste - spices can become overpowering.' },
};

interface Ingredient {
    id: string;
    name: string;
    amount: number;
    unit: string;
}

interface ScaledIngredient extends Ingredient {
    scaledAmount: number;
    displayAmount: string;
    warning?: string;
}

export default function RecipeScaler() {
    const [originalServings, setOriginalServings] = useState<number>(4);
    const [desiredServings, setDesiredServings] = useState<number>(8);
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { id: '1', name: 'All-purpose flour', amount: 2, unit: 'cup' },
        { id: '2', name: 'Sugar', amount: 1, unit: 'cup' },
        { id: '3', name: 'Eggs', amount: 2, unit: 'piece' },
        { id: '4', name: 'Butter', amount: 0.5, unit: 'cup' },
        { id: '5', name: 'Vanilla extract', amount: 1, unit: 'tsp' },
    ]);
    const [newIngredient, setNewIngredient] = useState({ name: '', amount: '', unit: 'cup' });
    const [copied, setCopied] = useState(false);

    // Calculate scale factor
    const scaleFactor = useMemo(() => {
        if (originalServings <= 0) return 1;
        return desiredServings / originalServings;
    }, [originalServings, desiredServings]);

    // Calculate scaled ingredients
    const scaledIngredients = useMemo((): ScaledIngredient[] => {
        return ingredients.map(ing => {
            let scaledAmount = ing.amount * scaleFactor;
            let warning: string | undefined;

            // Check for special scaling rules
            const lowerName = ing.name.toLowerCase();
            for (const [key, value] of Object.entries(SPECIAL_INGREDIENTS)) {
                if (lowerName.includes(key) && scaleFactor > 1.5) {
                    warning = value.note;
                    // Apply reduced scaling for certain ingredients
                    if (['salt', 'baking powder', 'baking soda'].some(s => lowerName.includes(s))) {
                        scaledAmount = ing.amount * (1 + (scaleFactor - 1) * 0.85);
                    }
                    break;
                }
            }

            // Handle eggs specially
            if (lowerName.includes('egg') && ing.unit === 'piece') {
                const rounded = Math.round(scaledAmount);
                if (Math.abs(scaledAmount - rounded) > 0.1) {
                    warning = 'Eggs can\'t be fractioned. Consider using a different batch size.';
                }
                scaledAmount = rounded;
            }

            return {
                ...ing,
                scaledAmount,
                displayAmount: formatFraction(scaledAmount),
                warning,
            };
        });
    }, [ingredients, scaleFactor]);

    // Check if there are scaling warnings
    const hasWarnings = scaledIngredients.some(ing => ing.warning);

    // Add new ingredient
    const handleAddIngredient = useCallback(() => {
        if (!newIngredient.name.trim() || !newIngredient.amount) return;

        const amount = parseFloat(newIngredient.amount);
        if (isNaN(amount) || amount <= 0) return;

        setIngredients(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                name: newIngredient.name.trim(),
                amount,
                unit: newIngredient.unit,
            },
        ]);
        setNewIngredient({ name: '', amount: '', unit: 'cup' });
    }, [newIngredient]);

    // Remove ingredient
    const handleRemoveIngredient = useCallback((id: string) => {
        setIngredients(prev => prev.filter(ing => ing.id !== id));
    }, []);

    // Update ingredient
    const handleUpdateIngredient = useCallback((id: string, field: keyof Ingredient, value: string | number) => {
        setIngredients(prev => prev.map(ing => {
            if (ing.id !== id) return ing;
            if (field === 'amount') {
                const num = parseFloat(value as string);
                return { ...ing, amount: isNaN(num) ? 0 : num };
            }
            return { ...ing, [field]: value };
        }));
    }, []);

    // Copy scaled recipe
    const handleCopy = useCallback(async () => {
        const text = scaledIngredients
            .map(ing => `${ing.displayAmount} ${ing.unit} ${ing.name}`)
            .join('\n');

        const fullText = `Scaled Recipe (${desiredServings} servings)\n\n${text}`;

        try {
            await navigator.clipboard.writeText(fullText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            alert('Could not copy to clipboard');
        }
    }, [scaledIngredients, desiredServings]);

    // Print recipe
    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    // Reset to sample recipe
    const handleReset = useCallback(() => {
        setOriginalServings(4);
        setDesiredServings(8);
        setIngredients([
            { id: '1', name: 'All-purpose flour', amount: 2, unit: 'cup' },
            { id: '2', name: 'Sugar', amount: 1, unit: 'cup' },
            { id: '3', name: 'Eggs', amount: 2, unit: 'piece' },
            { id: '4', name: 'Butter', amount: 0.5, unit: 'cup' },
            { id: '5', name: 'Vanilla extract', amount: 1, unit: 'tsp' },
        ]);
    }, []);

    // Quick scale buttons
    const quickScales = [
        { label: '½×', factor: 0.5 },
        { label: '1×', factor: 1 },
        { label: '2×', factor: 2 },
        { label: '3×', factor: 3 },
        { label: '4×', factor: 4 },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Servings Input */}
            <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)] mb-8">
                <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">
                    Scale Your Recipe
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Original Servings */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Original Recipe Serves
                        </label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setOriginalServings(Math.max(1, originalServings - 1))}
                                className="w-10 h-10 rounded-lg bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] flex items-center justify-center text-[var(--text-secondary)] transition-colors"
                            >
                                <MinusIcon />
                            </button>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={originalServings}
                                onChange={(e) => setOriginalServings(Math.max(1, parseInt(e.target.value) || 1))}
                                className="flex-1 px-4 py-2 text-center text-xl font-semibold border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none"
                            />
                            <button
                                onClick={() => setOriginalServings(Math.min(100, originalServings + 1))}
                                className="w-10 h-10 rounded-lg bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] flex items-center justify-center text-[var(--text-secondary)] transition-colors"
                            >
                                <PlusIcon />
                            </button>
                        </div>
                    </div>

                    {/* Desired Servings */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            You Want to Make
                        </label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setDesiredServings(Math.max(1, desiredServings - 1))}
                                className="w-10 h-10 rounded-lg bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] flex items-center justify-center text-[var(--text-secondary)] transition-colors"
                            >
                                <MinusIcon />
                            </button>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={desiredServings}
                                onChange={(e) => setDesiredServings(Math.max(1, parseInt(e.target.value) || 1))}
                                className="flex-1 px-4 py-2 text-center text-xl font-semibold border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none"
                            />
                            <button
                                onClick={() => setDesiredServings(Math.min(100, desiredServings + 1))}
                                className="w-10 h-10 rounded-lg bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] flex items-center justify-center text-[var(--text-secondary)] transition-colors"
                            >
                                <PlusIcon />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Scale Buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {quickScales.map(scale => (
                        <button
                            key={scale.label}
                            onClick={() => setDesiredServings(Math.round(originalServings * scale.factor))}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                Math.abs(scaleFactor - scale.factor) < 0.01
                                    ? "bg-[var(--color-wine)] text-white"
                                    : "bg-[var(--color-cream)] text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)]"
                            )}
                        >
                            {scale.label}
                        </button>
                    ))}
                </div>

                {/* Scale Factor Display */}
                <div className="mt-4 text-center">
                    <span className="text-sm text-[var(--text-muted)]">Scale Factor: </span>
                    <span className="font-semibold text-[var(--color-wine)]">
                        {scaleFactor.toFixed(2)}×
                    </span>
                </div>
            </div>

            {/* Ingredients Table */}
            <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] shadow-[var(--shadow-soft)] overflow-hidden mb-8">
                <div className="p-6 border-b border-[var(--color-cream-dark)]">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                            Ingredients
                        </h2>
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--color-wine)] transition-colors"
                        >
                            <RefreshIcon />
                            Reset
                        </button>
                    </div>
                </div>

                {/* Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--color-cream)] text-sm font-medium text-[var(--text-secondary)]">
                    <div className="col-span-4">Ingredient</div>
                    <div className="col-span-2 text-center">Original</div>
                    <div className="col-span-2 text-center">Unit</div>
                    <div className="col-span-3 text-center">Scaled ({scaleFactor.toFixed(1)}×)</div>
                    <div className="col-span-1"></div>
                </div>

                {/* Ingredient Rows */}
                <div className="divide-y divide-[var(--color-cream-dark)]">
                    {scaledIngredients.map((ing, index) => (
                        <div
                            key={ing.id}
                            className={cn(
                                "grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center",
                                index % 2 === 1 && "bg-[var(--color-cream)]"
                            )}
                        >
                            {/* Ingredient Name */}
                            <div className="md:col-span-4">
                                <input
                                    type="text"
                                    value={ing.name}
                                    onChange={(e) => handleUpdateIngredient(ing.id, 'name', e.target.value)}
                                    className="w-full px-3 py-2 bg-transparent border border-transparent hover:border-[var(--color-cream-dark)] focus:border-[var(--color-wine)] rounded-lg focus:outline-none transition-colors"
                                    placeholder="Ingredient name"
                                />
                            </div>

                            {/* Original Amount */}
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-2 md:justify-center">
                                    <span className="md:hidden text-sm text-[var(--text-muted)]">Amount:</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={ing.amount}
                                        onChange={(e) => handleUpdateIngredient(ing.id, 'amount', e.target.value)}
                                        className="w-20 px-3 py-2 text-center bg-transparent border border-transparent hover:border-[var(--color-cream-dark)] focus:border-[var(--color-wine)] rounded-lg focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Unit */}
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-2 md:justify-center">
                                    <span className="md:hidden text-sm text-[var(--text-muted)]">Unit:</span>
                                    <select
                                        value={ing.unit}
                                        onChange={(e) => handleUpdateIngredient(ing.id, 'unit', e.target.value)}
                                        className="px-3 py-2 bg-transparent border border-transparent hover:border-[var(--color-cream-dark)] focus:border-[var(--color-wine)] rounded-lg focus:outline-none transition-colors cursor-pointer"
                                    >
                                        {UNITS.map(unit => (
                                            <option key={unit.value} value={unit.value}>
                                                {unit.value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Scaled Amount */}
                            <div className="md:col-span-3">
                                <div className="flex items-center gap-2 md:justify-center">
                                    <span className="md:hidden text-sm text-[var(--text-muted)]">Scaled:</span>
                                    <span className={cn(
                                        "text-lg font-semibold",
                                        ing.warning ? "text-amber-600" : "text-[var(--color-wine)]"
                                    )}>
                                        {ing.displayAmount} {ing.unit}
                                    </span>
                                    {ing.warning && (
                                        <span className="text-amber-500" title={ing.warning}>
                                            <AlertIcon />
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Delete */}
                            <div className="md:col-span-1 flex justify-end">
                                <button
                                    onClick={() => handleRemoveIngredient(ing.id)}
                                    className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove ingredient"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Ingredient Row */}
                <div className="p-6 border-t border-[var(--color-cream-dark)] bg-[var(--color-cream)]">
                    <div className="flex flex-wrap gap-3 items-end">
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-xs text-[var(--text-muted)] mb-1">Ingredient</label>
                            <input
                                type="text"
                                value={newIngredient.name}
                                onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
                                placeholder="e.g., Butter"
                                className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none"
                            />
                        </div>
                        <div className="w-20">
                            <label className="block text-xs text-[var(--text-muted)] mb-1">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={newIngredient.amount}
                                onChange={(e) => setNewIngredient(prev => ({ ...prev, amount: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddIngredient()}
                                placeholder="1"
                                className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none"
                            />
                        </div>
                        <div className="w-24">
                            <label className="block text-xs text-[var(--text-muted)] mb-1">Unit</label>
                            <select
                                value={newIngredient.unit}
                                onChange={(e) => setNewIngredient(prev => ({ ...prev, unit: e.target.value }))}
                                className="w-full px-3 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none cursor-pointer"
                            >
                                {UNITS.map(unit => (
                                    <option key={unit.value} value={unit.value}>
                                        {unit.value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleAddIngredient}
                            disabled={!newIngredient.name.trim() || !newIngredient.amount}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                                newIngredient.name.trim() && newIngredient.amount
                                    ? "bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)]"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            <PlusIcon />
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {/* Warnings Section */}
            {hasWarnings && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                    <div className="flex items-start gap-3">
                        <div className="text-amber-500 mt-0.5">
                            <AlertIcon />
                        </div>
                        <div>
                            <h3 className="font-semibold text-amber-800 mb-2">Scaling Tips</h3>
                            <ul className="space-y-1 text-sm text-amber-700">
                                {scaledIngredients
                                    .filter(ing => ing.warning)
                                    .map(ing => (
                                        <li key={ing.id}>
                                            <strong>{ing.name}:</strong> {ing.warning}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-4">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-[var(--color-cream-dark)] rounded-lg font-medium text-[var(--text-secondary)] hover:border-[var(--color-wine)] hover:text-[var(--color-wine)] transition-colors"
                >
                    <CopyIcon />
                    {copied ? 'Copied!' : 'Copy Recipe'}
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--color-wine)] text-white rounded-lg font-medium hover:bg-[var(--color-wine-deep)] transition-colors"
                >
                    <PrinterIcon />
                    Print Recipe
                </button>
            </div>

            {/* Scaling Tips Card */}
            <div className="mt-8 bg-white rounded-xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)]">
                <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-4">
                    Recipe Scaling Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--text-secondary)]">
                    <div className="p-4 bg-[var(--color-cream)] rounded-lg">
                        <h4 className="font-medium text-[var(--text-primary)] mb-2">Baking Adjustments</h4>
                        <p>When scaling baked goods, leavening agents (baking powder, soda) should be reduced slightly for larger batches. Oven times may also need adjustment.</p>
                    </div>
                    <div className="p-4 bg-[var(--color-cream)] rounded-lg">
                        <h4 className="font-medium text-[var(--text-primary)] mb-2">Pan Size Matters</h4>
                        <p>If you're scaling to fit a different pan size, calculate the pan volume ratio. A 9" round pan has about 50% more volume than an 8" pan.</p>
                    </div>
                    <div className="p-4 bg-[var(--color-cream)] rounded-lg">
                        <h4 className="font-medium text-[var(--text-primary)] mb-2">Cooking Time</h4>
                        <p>Larger batches may need more time. For stovetop cooking, consider using a larger pan rather than cooking longer to maintain quality.</p>
                    </div>
                    <div className="p-4 bg-[var(--color-cream)] rounded-lg">
                        <h4 className="font-medium text-[var(--text-primary)] mb-2">Seasonings & Spices</h4>
                        <p>Start with 75% of the scaled amount for strong spices and herbs, then adjust to taste. Flavors can become overpowering in larger batches.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
