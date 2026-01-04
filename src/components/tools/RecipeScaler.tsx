/**
 * PairDish - Recipe Scaling Calculator
 *
 * Universal recipe scaler that adjusts ingredient quantities intelligently
 * with smart fraction display and scaling tips.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { cn, formatFraction, pluralize } from '../../lib/utils';
import {
    generateShareableUrl,
    parseSharedData,
    shareContent,
    generatePrintableHTML,
    printContent,
    downloadAsHTML,
    copyToClipboard,
    BRAND,
} from '../../lib/export-utils';

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

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
);

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
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

interface SharedRecipeData {
    recipeName: string;
    originalServings: number;
    desiredServings: number;
    ingredients: Ingredient[];
}

const DEFAULT_INGREDIENTS: Ingredient[] = [
    { id: '1', name: 'All-purpose flour', amount: 2, unit: 'cup' },
    { id: '2', name: 'Sugar', amount: 1, unit: 'cup' },
    { id: '3', name: 'Eggs', amount: 2, unit: 'piece' },
    { id: '4', name: 'Butter', amount: 0.5, unit: 'cup' },
    { id: '5', name: 'Vanilla extract', amount: 1, unit: 'tsp' },
];

export default function RecipeScaler() {
    const [recipeName, setRecipeName] = useState<string>('My Recipe');
    const [originalServings, setOriginalServings] = useState<number>(4);
    const [desiredServings, setDesiredServings] = useState<number>(8);
    const [ingredients, setIngredients] = useState<Ingredient[]>(DEFAULT_INGREDIENTS);
    const [newIngredient, setNewIngredient] = useState({ name: '', amount: '', unit: 'cup' });
    const [copied, setCopied] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);
    const [isLoadedFromShare, setIsLoadedFromShare] = useState(false);

    // Load from shared URL on mount
    useEffect(() => {
        const sharedData = parseSharedData<SharedRecipeData | null>(null);
        if (sharedData) {
            setRecipeName(sharedData.recipeName || 'Shared Recipe');
            setOriginalServings(sharedData.originalServings || 4);
            setDesiredServings(sharedData.desiredServings || 8);
            if (sharedData.ingredients && sharedData.ingredients.length > 0) {
                setIngredients(sharedData.ingredients);
            }
            setIsLoadedFromShare(true);
        }
    }, []);

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

        const fullText = `${recipeName} - Scaled Recipe (${desiredServings} servings)\n\n${text}\n\nScaled with ${BRAND.name} - ${BRAND.url}`;

        const success = await copyToClipboard(fullText);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [scaledIngredients, desiredServings, recipeName]);

    // Generate HTML content for print/download
    const generateRecipeHTML = useCallback(() => {
        const ingredientsHTML = scaledIngredients
            .map(ing => `
                <div class="item">
                    <span class="item-name">${ing.displayAmount} ${ing.unit}</span>
                    <span class="item-detail">${ing.name}</span>
                    ${ing.warning ? `<div style="color: #d97706; font-size: 11px; margin-top: 4px;">⚠️ ${ing.warning}</div>` : ''}
                </div>
            `)
            .join('');

        return `
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-value">${originalServings}</div>
                    <div class="stat-label">Original Servings</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${desiredServings}</div>
                    <div class="stat-label">Scaled Servings</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${scaleFactor.toFixed(2)}×</div>
                    <div class="stat-label">Scale Factor</div>
                </div>
            </div>
            <div class="section">
                <h3 class="section-title">Scaled Ingredients</h3>
                ${ingredientsHTML}
            </div>
            ${hasWarnings ? `
                <div class="section" style="background: #fffbeb; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin-top: 20px;">
                    <h3 style="color: #92400e; font-size: 14px; margin-bottom: 8px;">⚠️ Scaling Tips</h3>
                    <ul style="font-size: 12px; color: #92400e; padding-left: 16px;">
                        ${scaledIngredients.filter(ing => ing.warning).map(ing =>
                            `<li><strong>${ing.name}:</strong> ${ing.warning}</li>`
                        ).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
    }, [scaledIngredients, originalServings, desiredServings, scaleFactor, hasWarnings]);

    // Print recipe with branding
    const handlePrint = useCallback(() => {
        const html = generatePrintableHTML({
            title: recipeName,
            subtitle: `Scaled from ${originalServings} to ${desiredServings} servings`,
            content: generateRecipeHTML(),
        });
        printContent(html);
    }, [recipeName, originalServings, desiredServings, generateRecipeHTML]);

    // Download as HTML
    const handleDownload = useCallback(() => {
        downloadAsHTML({
            title: recipeName,
            subtitle: `Scaled from ${originalServings} to ${desiredServings} servings`,
            content: generateRecipeHTML(),
            filename: `${recipeName.toLowerCase().replace(/\s+/g, '-')}-scaled.html`,
        });
    }, [recipeName, originalServings, desiredServings, generateRecipeHTML]);

    // Generate shareable URL
    const handleShare = useCallback(() => {
        const data: SharedRecipeData = {
            recipeName,
            originalServings,
            desiredServings,
            ingredients,
        };
        const url = generateShareableUrl('/tools/recipe-scaler', data);
        setShareUrl(url);
        setShowShareModal(true);
        setLinkCopied(false);
    }, [recipeName, originalServings, desiredServings, ingredients]);

    // Copy share link
    const handleCopyLink = useCallback(async () => {
        const success = await copyToClipboard(shareUrl);
        if (success) {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 3000);
        }
    }, [shareUrl]);

    // Share via native share API
    const handleNativeShare = useCallback(async () => {
        await shareContent({
            title: `${recipeName} - Scaled Recipe`,
            text: `Check out this scaled recipe for ${desiredServings} servings!`,
            url: shareUrl,
        });
    }, [recipeName, desiredServings, shareUrl]);

    // Reset to sample recipe
    const handleReset = useCallback(() => {
        setRecipeName('My Recipe');
        setOriginalServings(4);
        setDesiredServings(8);
        setIngredients(DEFAULT_INGREDIENTS);
        setIsLoadedFromShare(false);
        // Clear URL params
        if (typeof window !== 'undefined') {
            window.history.replaceState({}, '', window.location.pathname);
        }
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
            {/* Shared Recipe Banner */}
            {isLoadedFromShare && (
                <div className="bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-wine-deep)] text-white rounded-xl p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <LinkIcon />
                        <div>
                            <p className="font-medium">You're viewing a shared recipe!</p>
                            <p className="text-sm text-white/80">Make any adjustments you'd like to personalize it.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleReset}
                        className="text-sm px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                        Start Fresh
                    </button>
                </div>
            )}

            {/* Servings Input */}
            <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)] mb-8">
                <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">
                    Scale Your Recipe
                </h2>

                {/* Recipe Name */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Recipe Name
                    </label>
                    <input
                        type="text"
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        placeholder="Enter recipe name..."
                        className="w-full px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none"
                    />
                </div>

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
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-[var(--color-cream-dark)] rounded-lg font-medium text-[var(--text-secondary)] hover:border-[var(--color-wine)] hover:text-[var(--color-wine)] transition-colors"
                >
                    <ShareIcon />
                    Share Recipe
                </button>
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-[var(--color-cream-dark)] rounded-lg font-medium text-[var(--text-secondary)] hover:border-[var(--color-wine)] hover:text-[var(--color-wine)] transition-colors"
                >
                    <DownloadIcon />
                    Download
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--color-wine)] text-white rounded-lg font-medium hover:bg-[var(--color-wine-deep)] transition-colors"
                >
                    <PrinterIcon />
                    Print Recipe
                </button>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
                    <div
                        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                                Share Recipe
                            </h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="p-1 hover:bg-[var(--color-cream)] rounded-lg transition-colors"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        <p className="text-[var(--text-secondary)] mb-4">
                            Share this link so others can view and use your scaled recipe:
                        </p>

                        {/* Share URL */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={shareUrl}
                                readOnly
                                className="flex-1 px-3 py-2 bg-[var(--color-cream)] border border-[var(--color-cream-dark)] rounded-lg text-sm truncate"
                            />
                            <button
                                onClick={handleCopyLink}
                                className={cn(
                                    "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
                                    linkCopied
                                        ? "bg-green-500 text-white"
                                        : "bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)]"
                                )}
                            >
                                {linkCopied ? <CheckCircleIcon /> : <CopyIcon />}
                                {linkCopied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>

                        {/* Share Options */}
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={handleNativeShare}
                                className="flex flex-col items-center gap-2 p-3 bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] rounded-lg transition-colors"
                            >
                                <ShareIcon />
                                <span className="text-xs text-[var(--text-secondary)]">Share</span>
                            </button>
                            <a
                                href={`mailto:?subject=${encodeURIComponent(`${recipeName} - Scaled Recipe`)}&body=${encodeURIComponent(`Check out this scaled recipe!\n\n${shareUrl}`)}`}
                                className="flex flex-col items-center gap-2 p-3 bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                <span className="text-xs text-[var(--text-secondary)]">Email</span>
                            </a>
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(`Check out this scaled recipe for ${recipeName}!\n\n${shareUrl}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 p-3 bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                                <span className="text-xs text-[var(--text-secondary)]">WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

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
