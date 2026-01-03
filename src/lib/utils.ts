import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Formats a number as a percentage string
 */
export function formatPercentage(value: number): string {
    return `${Math.round(value)}%`;
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a string to title case
 */
export function toTitleCase(str: string): string {
    return str
        .split(' ')
        .map(word => capitalize(word))
        .join(' ');
}

/**
 * Generates a random ID
 */
export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

/**
 * Formats a fraction nicely (e.g., 0.5 -> "½", 0.33 -> "⅓")
 */
export function formatFraction(value: number): string {
    const fractions: Record<string, string> = {
        '0.125': '⅛',
        '0.25': '¼',
        '0.333': '⅓',
        '0.375': '⅜',
        '0.5': '½',
        '0.625': '⅝',
        '0.666': '⅔',
        '0.75': '¾',
        '0.875': '⅞',
    };

    const whole = Math.floor(value);
    const decimal = value - whole;

    // Find closest fraction
    let closestKey = '';
    let closestDiff = Infinity;

    for (const key of Object.keys(fractions)) {
        const diff = Math.abs(parseFloat(key) - decimal);
        if (diff < closestDiff && diff < 0.05) {
            closestDiff = diff;
            closestKey = key;
        }
    }

    if (decimal < 0.05) {
        return whole.toString();
    }

    if (closestKey) {
        return whole > 0 ? `${whole}${fractions[closestKey]}` : fractions[closestKey];
    }

    return value.toFixed(2);
}

/**
 * Pluralizes a word based on count
 */
export function pluralize(word: string, count: number): string {
    if (count === 1) return word;

    // Simple pluralization rules
    if (word.endsWith('y')) {
        return word.slice(0, -1) + 'ies';
    }
    if (word.endsWith('s') || word.endsWith('sh') || word.endsWith('ch') || word.endsWith('x')) {
        return word + 'es';
    }
    return word + 's';
}

/**
 * Truncates text to a specified length
 */
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
}

/**
 * Gets match quality label based on score
 */
export function getMatchQuality(score: number): {
    label: string;
    color: 'high' | 'medium' | 'low' | 'unexpected';
} {
    if (score >= 90) return { label: 'Excellent Match', color: 'high' };
    if (score >= 75) return { label: 'Great Match', color: 'high' };
    if (score >= 60) return { label: 'Good Match', color: 'medium' };
    if (score >= 40) return { label: 'Worth Trying', color: 'low' };
    return { label: 'Experimental', color: 'unexpected' };
}
