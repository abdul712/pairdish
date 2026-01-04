/**
 * PairDish - Potluck Coordinator
 *
 * Interactive React component for organizing potluck gatherings.
 * Features: Share link, export PDF, collaborative updates.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { cn, pluralize, generateId } from '../../lib/utils';
import {
  generateShareableUrl,
  parseSharedData,
  copyToClipboard,
  shareContent,
  generatePrintableHTML,
  printContent,
  downloadAsHTML,
  formatDate,
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
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
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

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
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

interface PotluckData {
  eventName: string;
  eventDate: string;
  guestCount: number;
  dishes: Dish[];
}

const defaultData: PotluckData = {
  eventName: '',
  eventDate: '',
  guestCount: 12,
  dishes: [],
};

export default function PotluckCoordinator() {
  // Try to load shared data from URL
  const initialData = parseSharedData<PotluckData>(defaultData);

  const [eventName, setEventName] = useState(initialData.eventName);
  const [eventDate, setEventDate] = useState(initialData.eventDate);
  const [guestCount, setGuestCount] = useState(initialData.guestCount);
  const [dishes, setDishes] = useState<Dish[]>(initialData.dishes);
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [newDishName, setNewDishName] = useState('');
  const [newContributor, setNewContributor] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isFromSharedLink, setIsFromSharedLink] = useState(false);

  // Check if loaded from shared link
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('data')) {
        setIsFromSharedLink(true);
      }
    }
  }, []);

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

  // Generate shareable URL
  const handleGenerateShareLink = useCallback(() => {
    const data: PotluckData = {
      eventName,
      eventDate,
      guestCount,
      dishes,
    };
    const url = generateShareableUrl('/tools/potluck-coordinator', data);
    setShareUrl(url);
    setShowShareModal(true);
  }, [eventName, eventDate, guestCount, dishes]);

  // Copy share link
  const handleCopyLink = useCallback(async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }, [shareUrl]);

  // Generate text summary
  const generateTextSummary = useCallback(() => {
    let text = `🎉 ${eventName || 'POTLUCK EVENT'}\n`;
    if (eventDate) text += `📅 ${eventDate}\n`;
    text += `👥 ${guestCount} Guests Expected\n`;
    text += `🍽️ ${dishes.length} Dishes Planned\n\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    DISH_CATEGORIES.forEach(cat => {
      const categoryDishes = dishes.filter(d => d.categoryId === cat.id);
      if (categoryDishes.length > 0) {
        text += `${cat.icon} ${cat.name.toUpperCase()}\n`;
        categoryDishes.forEach(dish => {
          const dietary = dish.dietaryFlags.length > 0
            ? ` [${dish.dietaryFlags.map(f => DIETARY_OPTIONS.find(o => o.id === f)?.label).join(', ')}]`
            : '';
          text += `   • ${dish.name}${dietary}\n`;
          text += `     By: ${dish.contributor} | ${dish.quantity} servings\n`;
        });
        text += '\n';
      }
    });

    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `\nCreated with PairDish.com\n`;

    return text;
  }, [eventName, eventDate, guestCount, dishes]);

  // Share via native share or clipboard
  const handleShare = useCallback(async () => {
    const summary = generateTextSummary();
    const result = await shareContent({
      title: eventName || 'Potluck Event',
      text: summary,
      url: shareUrl || undefined,
    });

    if (result.method === 'clipboard') {
      alert('Summary copied to clipboard!');
    }
  }, [generateTextSummary, eventName, shareUrl]);

  // Generate printable HTML content
  const generatePrintContent = useCallback(() => {
    let content = '';

    // Stats section
    content += `
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-value">${guestCount}</div>
          <div class="stat-label">Expected Guests</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${dishes.length}</div>
          <div class="stat-label">Dishes Planned</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${Math.round(balanceAnalysis.overall)}%</div>
          <div class="stat-label">Balance Score</div>
        </div>
      </div>
    `;

    // Dishes by category
    DISH_CATEGORIES.forEach(cat => {
      const categoryDishes = dishes.filter(d => d.categoryId === cat.id);
      if (categoryDishes.length > 0) {
        content += `
          <div class="section">
            <div class="section-title">${cat.icon} ${cat.name}</div>
        `;
        categoryDishes.forEach(dish => {
          const tags = dish.dietaryFlags.map(f => {
            const opt = DIETARY_OPTIONS.find(o => o.id === f);
            return opt ? `<span class="tag">${opt.icon} ${opt.label}</span>` : '';
          }).join('');

          content += `
            <div class="item">
              <div class="item-name">${dish.name}</div>
              <div class="item-detail">
                Brought by: ${dish.contributor} | ${dish.quantity} servings
              </div>
              ${tags ? `<div class="tags">${tags}</div>` : ''}
            </div>
          `;
        });
        content += '</div>';
      }
    });

    // Dietary coverage summary
    const covered = dietaryCoverage.filter(d => d.count > 0);
    if (covered.length > 0) {
      content += `
        <div class="section">
          <div class="section-title">🥗 Dietary Options Available</div>
          <p style="color: #666; font-size: 14px;">
            ${covered.map(d => `${d.icon} ${d.label} (${d.count} dishes)`).join(' • ')}
          </p>
        </div>
      `;
    }

    return content;
  }, [guestCount, dishes, balanceAnalysis.overall, dietaryCoverage]);

  // Print handler
  const handlePrint = useCallback(() => {
    const html = generatePrintableHTML({
      title: eventName || 'Potluck Event',
      subtitle: eventDate ? `${eventDate}` : undefined,
      content: generatePrintContent(),
    });
    printContent(html);
  }, [eventName, eventDate, generatePrintContent]);

  // Download as HTML (can be saved as PDF)
  const handleDownload = useCallback(() => {
    const filename = `${(eventName || 'potluck').toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.html`;
    downloadAsHTML({
      title: eventName || 'Potluck Event',
      subtitle: eventDate ? `${eventDate}` : undefined,
      content: generatePrintContent(),
      filename,
    });
  }, [eventName, eventDate, generatePrintContent]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Shared Link Banner */}
      {isFromSharedLink && (
        <div className="bg-gradient-to-r from-[var(--color-wine)] to-[var(--color-wine-deep)] text-white rounded-2xl p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <LinkIcon />
            </div>
            <div>
              <p className="font-medium">You're viewing a shared potluck!</p>
              <p className="text-sm text-white/80">Add your dish below to contribute</p>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Section */}
      <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)] mb-8">
        <h3 className="text-xl font-display font-semibold text-[var(--text-primary)] mb-4">
          Event Details
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Event Name
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g., Summer BBQ, Holiday Dinner"
              className="w-full px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Date
            </label>
            <input
              type="text"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              placeholder="e.g., Saturday, Dec 15"
              className="w-full px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none"
            />
          </div>
        </div>
      </div>

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
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={newContributor}
                        onChange={(e) => setNewContributor(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddDish(category.id)}
                        placeholder="Who's bringing it?"
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
        <div className="bg-white rounded-2xl border border-[var(--color-cream-dark)] p-6 shadow-[var(--shadow-soft)]">
          <h3 className="text-xl font-display font-semibold text-[var(--text-primary)] mb-4 text-center">
            Share & Export
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={handleGenerateShareLink}
              className="flex flex-col items-center gap-2 p-4 bg-[var(--color-cream)] hover:bg-[var(--color-wine)] hover:text-white rounded-xl transition-colors group"
            >
              <LinkIcon />
              <span className="text-sm font-medium">Get Share Link</span>
            </button>
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-2 p-4 bg-[var(--color-cream)] hover:bg-[var(--color-wine)] hover:text-white rounded-xl transition-colors group"
            >
              <ShareIcon />
              <span className="text-sm font-medium">Share Summary</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex flex-col items-center gap-2 p-4 bg-[var(--color-cream)] hover:bg-[var(--color-wine)] hover:text-white rounded-xl transition-colors group"
            >
              <DownloadIcon />
              <span className="text-sm font-medium">Download</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex flex-col items-center gap-2 p-4 bg-[var(--color-cream)] hover:bg-[var(--color-wine)] hover:text-white rounded-xl transition-colors group"
            >
              <PrinterIcon />
              <span className="text-sm font-medium">Print</span>
            </button>
          </div>
          <p className="text-xs text-center text-[var(--text-muted)] mt-4">
            Share the link with guests so they can add their dishes directly
          </p>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display font-semibold text-[var(--text-primary)]">
                Share Your Potluck
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-[var(--color-cream)] rounded-lg transition-colors"
              >
                <XIcon />
              </button>
            </div>

            <p className="text-[var(--text-secondary)] mb-4">
              Share this link with your guests. They can view the current dishes and add their own contributions!
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-[var(--color-cream)] border border-[var(--color-cream-dark)] rounded-lg text-sm"
              />
              <button
                onClick={handleCopyLink}
                className={cn(
                  "px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2",
                  copySuccess
                    ? "bg-green-500 text-white"
                    : "bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)]"
                )}
              >
                {copySuccess ? <CheckCircleIcon /> : <CopyIcon />}
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="border-t border-[var(--color-cream-dark)] pt-4">
              <p className="text-sm text-[var(--text-muted)] mb-3">Or share via:</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    window.open(`mailto:?subject=${encodeURIComponent(eventName || 'Potluck Invitation')}&body=${encodeURIComponent(`You're invited to our potluck!\n\nView and add your dish here: ${shareUrl}`)}`, '_blank');
                  }}
                  className="flex-1 px-4 py-2 bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] rounded-lg text-sm font-medium transition-colors"
                >
                  Email
                </button>
                <button
                  onClick={() => {
                    window.open(`https://wa.me/?text=${encodeURIComponent(`You're invited to our potluck! View and add your dish: ${shareUrl}`)}`, '_blank');
                  }}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => {
                    window.open(`sms:?body=${encodeURIComponent(`You're invited to our potluck! ${shareUrl}`)}`, '_blank');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  SMS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
