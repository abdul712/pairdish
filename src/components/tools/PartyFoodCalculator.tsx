/**
 * PairDish - Party Food Calculator
 *
 * Calculate exactly how much food to prepare for any gathering
 * based on guest count, event type, and duration.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { cn, pluralize } from '../../lib/utils';
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

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

type EventType = 'casual' | 'formal' | 'cocktail' | 'bbq' | 'buffet' | 'dinner';

// Shared data interface for URL-based sharing
interface SharedPartyData {
    eventName: string;
    guestCount: number;
    childCount: number;
    eventType: EventType;
    mealTime: MealTime;
    duration: number;
    heavyEaters: number;
    dietary: DietaryCount;
}
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
    const [eventName, setEventName] = useState('My Party');
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

    // Share/export state
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);
    const [isLoadedFromShare, setIsLoadedFromShare] = useState(false);

    // Load shared data from URL on mount
    useEffect(() => {
        const sharedData = parseSharedData<SharedPartyData | null>(null);
        if (sharedData) {
            if (sharedData.eventName) setEventName(sharedData.eventName);
            if (sharedData.guestCount) setGuestCount(sharedData.guestCount);
            if (sharedData.childCount !== undefined) setChildCount(sharedData.childCount);
            if (sharedData.eventType) setEventType(sharedData.eventType);
            if (sharedData.mealTime) setMealTime(sharedData.mealTime);
            if (sharedData.duration) setDuration(sharedData.duration);
            if (sharedData.heavyEaters !== undefined) setHeavyEaters(sharedData.heavyEaters);
            if (sharedData.dietary) setDietary(sharedData.dietary);
            setIsLoadedFromShare(true);
        }
    }, []);

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

    // Generate shopping list text
    const generateShoppingList = useCallback(() => {
        let list = `PARTY FOOD SHOPPING LIST\n`;
        list += `========================\n\n`;
        list += `Event: ${eventName} (${EVENT_TYPES.find(e => e.value === eventType)?.label})\n`;
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
        list += `\n---\nCalculated with ${BRAND.name} | ${BRAND.url}`;

        return list;
    }, [foodQuantities, eventName, guestCount, childCount, eventType, duration, dietary, budgetEstimate]);

    // Generate branded HTML for print/download
    const generatePartyHTML = useCallback(() => {
        const eventLabel = EVENT_TYPES.find(e => e.value === eventType)?.label || eventType;
        const mealLabel = mealTime === 'lunch' ? 'Lunch' : mealTime === 'dinner' ? 'Dinner' : 'Appetizers Only';

        let content = `
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-value">${guestCount}</div>
                    <div class="stat-label">${pluralize('Guest', guestCount)}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${duration}h</div>
                    <div class="stat-label">Duration</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">$${budgetEstimate.moderate}</div>
                    <div class="stat-label">Est. Budget</div>
                </div>
            </div>

            <div class="section">
                <h3 class="section-title">Event Details</h3>
                <div class="item">
                    <span class="item-name">Event Type:</span>
                    <span class="item-detail">${eventLabel}</span>
                </div>
                <div class="item">
                    <span class="item-name">Meal Time:</span>
                    <span class="item-detail">${mealLabel}</span>
                </div>
                ${childCount > 0 ? `
                <div class="item">
                    <span class="item-name">Children (under 12):</span>
                    <span class="item-detail">${childCount}</span>
                </div>` : ''}
                ${heavyEaters > 0 ? `
                <div class="item">
                    <span class="item-name">Heavy Eaters:</span>
                    <span class="item-detail">${heavyEaters}</span>
                </div>` : ''}
            </div>

            <div class="section">
                <h3 class="section-title">Food Quantities</h3>
                ${foodQuantities.map(item => `
                    <div class="item">
                        <span class="item-name">${item.icon} ${item.name}</span>
                        <span class="item-detail" style="font-weight: 600; color: ${BRAND.colors.wine};">
                            ${item.totalPounds
                                ? `${item.totalPounds} lbs`
                                : item.totalPieces
                                    ? `${item.totalPieces} ${item.unit}`
                                    : `${item.totalOz} oz`}
                        </span>
                        <div class="item-detail" style="font-size: 11px; margin-top: 2px;">
                            ${item.perPerson} per person
                        </div>
                    </div>
                `).join('')}
            </div>

            ${(dietary.vegetarian > 0 || dietary.vegan > 0 || dietary.glutenFree > 0) ? `
            <div class="section">
                <h3 class="section-title">Dietary Requirements</h3>
                ${dietary.vegetarian > 0 ? `
                <div class="item">
                    <span class="item-detail">Vegetarian options for ${dietary.vegetarian} ${pluralize('guest', dietary.vegetarian)}</span>
                </div>` : ''}
                ${dietary.vegan > 0 ? `
                <div class="item">
                    <span class="item-detail">Vegan options for ${dietary.vegan} ${pluralize('guest', dietary.vegan)}</span>
                </div>` : ''}
                ${dietary.glutenFree > 0 ? `
                <div class="item">
                    <span class="item-detail">Gluten-free options for ${dietary.glutenFree} ${pluralize('guest', dietary.glutenFree)}</span>
                </div>` : ''}
            </div>` : ''}

            <div class="section">
                <h3 class="section-title">Budget Estimates</h3>
                <div class="item">
                    <span class="item-name">Budget-Friendly:</span>
                    <span class="item-detail">$${budgetEstimate.budget}</span>
                </div>
                <div class="item">
                    <span class="item-name">Moderate (Recommended):</span>
                    <span class="item-detail" style="font-weight: 600; color: ${BRAND.colors.wine};">$${budgetEstimate.moderate}</span>
                </div>
                <div class="item">
                    <span class="item-name">Premium:</span>
                    <span class="item-detail">$${budgetEstimate.premium}</span>
                </div>
            </div>
        `;

        return generatePrintableHTML({
            title: eventName,
            subtitle: `${eventLabel} for ${guestCount} guests | ${duration} hours`,
            content,
        });
    }, [eventName, eventType, mealTime, guestCount, childCount, duration, heavyEaters, dietary, foodQuantities, budgetEstimate]);

    // Print with branded layout
    const handlePrint = useCallback(() => {
        const html = generatePartyHTML();
        printContent(html);
    }, [generatePartyHTML]);

    // Download as HTML file
    const handleDownload = useCallback(() => {
        const filename = `${eventName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-party-food-${new Date().toISOString().split('T')[0]}.html`;
        downloadAsHTML({
            title: eventName,
            subtitle: `${EVENT_TYPES.find(e => e.value === eventType)?.label} for ${guestCount} guests`,
            content: generatePartyHTML().split('<div class="content">')[1]?.split('</div>')[0] || '',
            filename,
        });
    }, [eventName, eventType, guestCount, generatePartyHTML]);

    // Generate shareable URL
    const handleShare = useCallback(() => {
        const data: SharedPartyData = {
            eventName,
            guestCount,
            childCount,
            eventType,
            mealTime,
            duration,
            heavyEaters,
            dietary,
        };
        const url = generateShareableUrl('/tools/party-food-calculator', data);
        setShareUrl(url);
        setShowShareModal(true);
        setLinkCopied(false);
    }, [eventName, guestCount, childCount, eventType, mealTime, duration, heavyEaters, dietary]);

    // Copy link to clipboard
    const handleCopyLink = useCallback(async () => {
        const success = await copyToClipboard(shareUrl);
        if (success) {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        }
    }, [shareUrl]);

    // Native share API
    const handleNativeShare = useCallback(async () => {
        await shareContent({
            title: `${eventName} - Party Food Calculator`,
            text: `Check out my party food calculations for ${guestCount} guests!`,
            url: shareUrl,
        });
    }, [eventName, guestCount, shareUrl]);

    // Copy text list to clipboard
    const handleCopyText = useCallback(async () => {
        const text = generateShoppingList();
        await copyToClipboard(text);
    }, [generateShoppingList]);

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Shared Content Banner */}
            {isLoadedFromShare && (
                <div className="mb-6 p-4 bg-gradient-to-r from-[var(--color-wine-glow)] to-amber-50 rounded-xl border border-[var(--color-wine)]/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-wine)] flex items-center justify-center text-white">
                            <ShareIcon />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[var(--text-primary)]">Shared Party Plan</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                You're viewing a shared party food calculation. Modify the values below to customize for your needs.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Input Section */}
            <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)] mb-8">
                <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-6">
                    Event Details
                </h2>

                {/* Event Name */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                        Event Name
                    </label>
                    <input
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        placeholder="e.g., Sarah's Birthday Party"
                        className="w-full md:w-1/2 px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]/20"
                    />
                </div>

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
            <div className="flex flex-wrap justify-center gap-3">
                <button
                    onClick={handleCopyText}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[var(--color-cream-dark)] rounded-lg font-medium text-[var(--text-secondary)] hover:border-[var(--color-wine)] hover:text-[var(--color-wine)] transition-colors"
                >
                    <LinkIcon />
                    Copy List
                </button>
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[var(--color-cream-dark)] rounded-lg font-medium text-[var(--text-secondary)] hover:border-[var(--color-wine)] hover:text-[var(--color-wine)] transition-colors"
                >
                    <DownloadIcon />
                    Download
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[var(--color-cream-dark)] rounded-lg font-medium text-[var(--text-secondary)] hover:border-[var(--color-wine)] hover:text-[var(--color-wine)] transition-colors"
                >
                    <PrinterIcon />
                    Print
                </button>
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-wine)] text-white rounded-lg font-medium hover:bg-[var(--color-wine-deep)] transition-colors"
                >
                    <ShareIcon />
                    Share
                </button>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowShareModal(false)}
                            className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--color-cream)] transition-colors"
                        >
                            <XIcon />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--color-wine-glow)] flex items-center justify-center text-[var(--color-wine)]">
                                <ShareIcon />
                            </div>
                            <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                                Share Party Plan
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                                Share your food calculations with others
                            </p>
                        </div>

                        {/* Copy Link */}
                        <div className="mb-4">
                            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                                Shareable Link
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={shareUrl}
                                    className="flex-1 px-3 py-2 text-sm bg-[var(--color-cream)] border border-[var(--color-cream-dark)] rounded-lg truncate"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className={cn(
                                        "px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
                                        linkCopied
                                            ? "bg-green-500 text-white"
                                            : "bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)]"
                                    )}
                                >
                                    {linkCopied ? (
                                        <>
                                            <CheckIcon />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <LinkIcon />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Share Options */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                                onClick={handleNativeShare}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-cream)] rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)] transition-colors"
                            >
                                <ShareIcon />
                                Share
                            </button>
                            <a
                                href={`mailto:?subject=${encodeURIComponent(`${eventName} - Party Food Plan`)}&body=${encodeURIComponent(`Check out my party food calculations!\n\n${shareUrl}`)}`}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-cream)] rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)] transition-colors"
                            >
                                <MailIcon />
                                Email
                            </a>
                        </div>

                        {/* WhatsApp Share */}
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(`${eventName} - Party Food Plan\n\n${shareUrl}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Share via WhatsApp
                        </a>

                        <p className="text-xs text-[var(--text-muted)] text-center mt-4">
                            Recipients can view and customize the calculations for their needs
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
