/**
 * Cheese Board Builder Component
 *
 * Interactive step-by-step cheese board builder.
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

// Icons
const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
);

const PrinterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect width="12" height="8" x="6" y="14" />
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

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

// Types
interface Cheese {
  id: string;
  name: string;
  type: 'soft' | 'semi-soft' | 'firm' | 'hard' | 'blue';
  milk: 'cow' | 'goat' | 'sheep' | 'mixed';
  flavor: string;
  texture: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  pairings: string[];
}

interface Accompaniment {
  id: string;
  name: string;
  category: 'fruit' | 'meat' | 'cracker' | 'nut' | 'condiment' | 'vegetable';
  pairsWith: string[];
  tip?: string;
}

// Cheese database
const cheeses: Cheese[] = [
  // Soft
  { id: 'brie', name: 'Brie', type: 'soft', milk: 'cow', flavor: 'Buttery, earthy, mushroomy', texture: 'Creamy, spreadable', intensity: 2, pairings: ['fruit', 'honey', 'crackers', 'nuts'] },
  { id: 'camembert', name: 'Camembert', type: 'soft', milk: 'cow', flavor: 'Rich, earthy, garlicky', texture: 'Oozy, creamy', intensity: 3, pairings: ['fruit', 'bread', 'nuts', 'charcuterie'] },
  { id: 'burrata', name: 'Burrata', type: 'soft', milk: 'cow', flavor: 'Fresh, milky, delicate', texture: 'Creamy center', intensity: 1, pairings: ['tomatoes', 'olive oil', 'basil', 'prosciutto'] },
  { id: 'goat-cheese', name: 'Chèvre (Goat)', type: 'soft', milk: 'goat', flavor: 'Tangy, citrusy, bright', texture: 'Creamy, crumbly', intensity: 3, pairings: ['honey', 'fruit', 'nuts', 'herbs'] },

  // Semi-soft
  { id: 'havarti', name: 'Havarti', type: 'semi-soft', milk: 'cow', flavor: 'Buttery, mild, tangy', texture: 'Supple, creamy', intensity: 2, pairings: ['fruit', 'crackers', 'sandwiches'] },
  { id: 'fontina', name: 'Fontina', type: 'semi-soft', milk: 'cow', flavor: 'Nutty, earthy, fruity', texture: 'Semi-soft, melty', intensity: 3, pairings: ['bread', 'fruit', 'charcuterie'] },
  { id: 'taleggio', name: 'Taleggio', type: 'semi-soft', milk: 'cow', flavor: 'Pungent, tangy, fruity', texture: 'Soft, sticky rind', intensity: 4, pairings: ['fruit', 'honey', 'walnuts', 'risotto'] },

  // Firm
  { id: 'cheddar', name: 'Aged Cheddar', type: 'firm', milk: 'cow', flavor: 'Sharp, nutty, complex', texture: 'Firm, crumbly', intensity: 4, pairings: ['apple', 'crackers', 'chutney', 'ale'] },
  { id: 'gruyere', name: 'Gruyère', type: 'firm', milk: 'cow', flavor: 'Nutty, sweet, slightly salty', texture: 'Firm, smooth', intensity: 3, pairings: ['fruit', 'bread', 'nuts', 'wine'] },
  { id: 'manchego', name: 'Manchego', type: 'firm', milk: 'sheep', flavor: 'Nutty, tangy, caramel notes', texture: 'Firm, oily', intensity: 3, pairings: ['quince paste', 'olives', 'almonds', 'jamón'] },
  { id: 'gouda', name: 'Aged Gouda', type: 'firm', milk: 'cow', flavor: 'Caramel, butterscotch, nutty', texture: 'Crystalline, firm', intensity: 4, pairings: ['fruit', 'dark chocolate', 'beer', 'walnuts'] },
  { id: 'comte', name: 'Comté', type: 'firm', milk: 'cow', flavor: 'Nutty, fruity, floral', texture: 'Firm, smooth', intensity: 3, pairings: ['bread', 'fruit', 'nuts', 'wine'] },

  // Hard
  { id: 'parmesan', name: 'Parmigiano-Reggiano', type: 'hard', milk: 'cow', flavor: 'Sharp, nutty, umami', texture: 'Granular, crystalline', intensity: 5, pairings: ['balsamic', 'pear', 'honey', 'prosciutto'] },
  { id: 'pecorino', name: 'Pecorino Romano', type: 'hard', milk: 'sheep', flavor: 'Salty, tangy, sharp', texture: 'Hard, crumbly', intensity: 5, pairings: ['honey', 'pear', 'figs', 'walnuts'] },

  // Blue
  { id: 'gorgonzola', name: 'Gorgonzola', type: 'blue', milk: 'cow', flavor: 'Creamy, tangy, piquant', texture: 'Creamy with blue veins', intensity: 4, pairings: ['honey', 'pear', 'walnuts', 'port'] },
  { id: 'roquefort', name: 'Roquefort', type: 'blue', milk: 'sheep', flavor: 'Intense, tangy, salty', texture: 'Creamy, crumbly', intensity: 5, pairings: ['honey', 'figs', 'walnuts', 'sauternes'] },
  { id: 'stilton', name: 'Stilton', type: 'blue', milk: 'cow', flavor: 'Rich, complex, slightly sweet', texture: 'Crumbly, creamy', intensity: 4, pairings: ['port', 'pear', 'walnuts', 'honey'] },
];

// Accompaniments database
const accompaniments: Accompaniment[] = [
  // Fruits
  { id: 'grapes', name: 'Grapes', category: 'fruit', pairsWith: ['all'], tip: 'Red and green for variety' },
  { id: 'apple', name: 'Apple Slices', category: 'fruit', pairsWith: ['cheddar', 'brie', 'gouda'], tip: 'Toss with lemon to prevent browning' },
  { id: 'pear', name: 'Pear Slices', category: 'fruit', pairsWith: ['gorgonzola', 'parmesan', 'stilton'], tip: 'Slightly firm pears work best' },
  { id: 'figs', name: 'Fresh or Dried Figs', category: 'fruit', pairsWith: ['goat-cheese', 'blue', 'brie'], tip: 'Fresh when in season, dried otherwise' },
  { id: 'berries', name: 'Fresh Berries', category: 'fruit', pairsWith: ['brie', 'goat-cheese', 'soft'], tip: 'Blackberries and raspberries pair best' },
  { id: 'quince-paste', name: 'Quince Paste (Membrillo)', category: 'fruit', pairsWith: ['manchego', 'aged-cheeses'], tip: 'Cut into small cubes' },
  { id: 'apricots', name: 'Dried Apricots', category: 'fruit', pairsWith: ['goat-cheese', 'brie', 'blue'], tip: 'Great for sweetness contrast' },

  // Meats
  { id: 'prosciutto', name: 'Prosciutto', category: 'meat', pairsWith: ['parmesan', 'burrata', 'melon'], tip: 'Drape loosely for visual appeal' },
  { id: 'salami', name: 'Salami', category: 'meat', pairsWith: ['cheddar', 'gouda', 'manchego'], tip: 'Mix spicy and mild varieties' },
  { id: 'soppressata', name: 'Soppressata', category: 'meat', pairsWith: ['provolone', 'fontina', 'firm'], tip: 'Slice thin for best texture' },
  { id: 'coppa', name: 'Coppa', category: 'meat', pairsWith: ['gruyere', 'comte', 'firm'], tip: 'Rich flavor, pairs with nutty cheeses' },
  { id: 'jamon', name: 'Jamón Serrano', category: 'meat', pairsWith: ['manchego', 'spanish-cheeses'], tip: 'The classic Spanish pairing' },

  // Crackers & Bread
  { id: 'water-crackers', name: 'Water Crackers', category: 'cracker', pairsWith: ['all'], tip: 'Neutral, lets cheese shine' },
  { id: 'crostini', name: 'Crostini', category: 'cracker', pairsWith: ['soft', 'spreadable'], tip: 'Toast lightly, rub with garlic' },
  { id: 'baguette', name: 'Baguette Slices', category: 'cracker', pairsWith: ['brie', 'camembert', 'soft'], tip: 'Day-old works great toasted' },
  { id: 'fig-crackers', name: 'Fig & Olive Crackers', category: 'cracker', pairsWith: ['blue', 'goat-cheese'], tip: 'Adds sweetness and texture' },
  { id: 'seeded-crackers', name: 'Seeded Crackers', category: 'cracker', pairsWith: ['cheddar', 'gouda', 'firm'], tip: 'Adds crunch and nutrition' },

  // Nuts
  { id: 'almonds', name: 'Marcona Almonds', category: 'nut', pairsWith: ['manchego', 'spanish-cheeses', 'firm'], tip: 'Lightly salted, roasted' },
  { id: 'walnuts', name: 'Walnuts', category: 'nut', pairsWith: ['blue', 'gorgonzola', 'brie'], tip: 'Toast lightly to enhance flavor' },
  { id: 'pecans', name: 'Candied Pecans', category: 'nut', pairsWith: ['goat-cheese', 'brie', 'soft'], tip: 'Sweet contrast to tangy cheese' },
  { id: 'pistachios', name: 'Pistachios', category: 'nut', pairsWith: ['parmesan', 'aged-cheeses'], tip: 'Shelled for easy snacking' },

  // Condiments
  { id: 'honey', name: 'Raw Honey', category: 'condiment', pairsWith: ['blue', 'goat-cheese', 'brie'], tip: 'Drizzle or serve in small pot' },
  { id: 'fig-jam', name: 'Fig Jam', category: 'condiment', pairsWith: ['brie', 'goat-cheese', 'blue'], tip: 'Sweet, pairs with any cheese' },
  { id: 'mustard', name: 'Whole Grain Mustard', category: 'condiment', pairsWith: ['cheddar', 'gruyere', 'firm'], tip: 'Tangy, balances rich cheeses' },
  { id: 'chutney', name: 'Mango Chutney', category: 'condiment', pairsWith: ['cheddar', 'firm-cheeses'], tip: 'Sweet-spicy combination' },
  { id: 'balsamic', name: 'Balsamic Glaze', category: 'condiment', pairsWith: ['parmesan', 'burrata', 'fresh'], tip: 'Drizzle sparingly' },

  // Vegetables
  { id: 'olives', name: 'Mixed Olives', category: 'vegetable', pairsWith: ['manchego', 'feta', 'mediterranean'], tip: 'Mix colors and sizes' },
  { id: 'cornichons', name: 'Cornichons', category: 'vegetable', pairsWith: ['pate', 'cheddar', 'firm'], tip: 'Tangy, cuts richness' },
  { id: 'peppers', name: 'Roasted Peppers', category: 'vegetable', pairsWith: ['goat-cheese', 'feta', 'soft'], tip: 'Jarred or homemade' },
  { id: 'artichokes', name: 'Marinated Artichokes', category: 'vegetable', pairsWith: ['firm', 'italian-cheeses'], tip: 'Mediterranean boards' },
];

// Board styles
const boardStyles = [
  { id: 'classic', name: 'Classic Elegance', description: 'Traditional mix of textures and flavors', cheesesCount: 4, accompanimentCount: 8 },
  { id: 'minimal', name: 'Minimalist', description: 'Focused selection for intimate gatherings', cheesesCount: 3, accompanimentCount: 5 },
  { id: 'abundant', name: 'Abundant Feast', description: 'Generous spread for larger parties', cheesesCount: 6, accompanimentCount: 12 },
];

// Shared data interface for URL-based sharing
interface SharedBoardData {
    boardName: string;
    boardStyle: string;
    guestCount: number;
    selectedCheeses: string[];
    selectedAccompaniments: string[];
}

export default function CheeseBoardBuilder() {
  const [step, setStep] = useState(1);
  const [boardName, setBoardName] = useState('My Cheese Board');
  const [boardStyle, setBoardStyle] = useState<string>('classic');
  const [selectedCheeses, setSelectedCheeses] = useState<string[]>([]);
  const [selectedAccompaniments, setSelectedAccompaniments] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState(6);

  // Share/export state
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [isLoadedFromShare, setIsLoadedFromShare] = useState(false);

  // Load shared data from URL on mount
  useEffect(() => {
    const sharedData = parseSharedData<SharedBoardData | null>(null);
    if (sharedData) {
      if (sharedData.boardName) setBoardName(sharedData.boardName);
      if (sharedData.boardStyle) setBoardStyle(sharedData.boardStyle);
      if (sharedData.guestCount) setGuestCount(sharedData.guestCount);
      if (sharedData.selectedCheeses?.length) setSelectedCheeses(sharedData.selectedCheeses);
      if (sharedData.selectedAccompaniments?.length) setSelectedAccompaniments(sharedData.selectedAccompaniments);
      // Jump to final step if board is complete
      if (sharedData.selectedCheeses?.length && sharedData.selectedAccompaniments?.length) {
        setStep(4);
      }
      setIsLoadedFromShare(true);
    }
  }, []);

  const currentStyle = boardStyles.find((s) => s.id === boardStyle)!;

  // Get cheese types for variety check
  const selectedCheeseTypes = useMemo(() => {
    return selectedCheeses.map((id) => cheeses.find((c) => c.id === id)?.type).filter(Boolean);
  }, [selectedCheeses]);

  // Get accompaniment categories for variety check
  const selectedAccompanimentCategories = useMemo(() => {
    return selectedAccompaniments.map((id) => accompaniments.find((a) => a.id === id)?.category).filter(Boolean);
  }, [selectedAccompaniments]);

  const handleCheeseToggle = (id: string) => {
    if (selectedCheeses.includes(id)) {
      setSelectedCheeses(selectedCheeses.filter((c) => c !== id));
    } else if (selectedCheeses.length < currentStyle.cheesesCount) {
      setSelectedCheeses([...selectedCheeses, id]);
    }
  };

  const handleAccompanimentToggle = (id: string) => {
    if (selectedAccompaniments.includes(id)) {
      setSelectedAccompaniments(selectedAccompaniments.filter((a) => a !== id));
    } else if (selectedAccompaniments.length < currentStyle.accompanimentCount) {
      setSelectedAccompaniments([...selectedAccompaniments, id]);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setBoardName('My Cheese Board');
    setBoardStyle('classic');
    setSelectedCheeses([]);
    setSelectedAccompaniments([]);
    setGuestCount(6);
    setIsLoadedFromShare(false);
  };

  // Generate branded HTML for print/download
  const generateBoardHTML = useCallback(() => {
    const style = boardStyles.find((s) => s.id === boardStyle);
    const quantities = {
      cheeseOz: guestCount * 2,
      meatOz: guestCount * 1,
      crackers: guestCount * 5,
      fruitServings: Math.ceil(guestCount * 0.5),
    };

    let content = `
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-value">${guestCount}</div>
          <div class="stat-label">${pluralize('Guest', guestCount)}</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${quantities.cheeseOz} oz</div>
          <div class="stat-label">Total Cheese</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${quantities.meatOz} oz</div>
          <div class="stat-label">Charcuterie</div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">Your Cheeses (${selectedCheeses.length})</h3>
        ${selectedCheeses.map((id) => {
          const cheese = cheeses.find((c) => c.id === id);
          if (!cheese) return '';
          return `
            <div class="item">
              <div class="item-name">${cheese.name}</div>
              <div class="item-detail">${cheese.flavor}</div>
              <div class="tags">
                <span class="tag">${cheese.type}</span>
                <span class="tag">${cheese.milk} milk</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="section">
        <h3 class="section-title">Accompaniments (${selectedAccompaniments.length})</h3>
        ${['fruit', 'meat', 'cracker', 'nut', 'condiment', 'vegetable'].map((category) => {
          const items = selectedAccompaniments
            .map((id) => accompaniments.find((a) => a.id === id))
            .filter((a) => a?.category === category);
          if (items.length === 0) return '';
          return `
            <div style="margin-bottom: 12px;">
              <strong style="text-transform: capitalize; color: ${BRAND.colors.wine};">${category}s:</strong>
              <div style="margin-left: 16px;">
                ${items.map((item) => `<div class="item-detail">${item?.name}${item?.tip ? ` - ${item.tip}` : ''}</div>`).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="section">
        <h3 class="section-title">Shopping List</h3>
        <div class="item">
          <span class="item-name">Total Cheese:</span>
          <span class="item-detail">${quantities.cheeseOz} oz (about ${Math.ceil(quantities.cheeseOz / 16 * 10) / 10} lb)</span>
        </div>
        <div class="item">
          <span class="item-name">Charcuterie:</span>
          <span class="item-detail">${quantities.meatOz} oz</span>
        </div>
        <div class="item">
          <span class="item-name">Crackers/Bread:</span>
          <span class="item-detail">${quantities.crackers}+ pieces</span>
        </div>
        <div class="item">
          <span class="item-name">Fresh Fruit:</span>
          <span class="item-detail">${quantities.fruitServings} cups</span>
        </div>
      </div>

      <div class="section" style="background: ${BRAND.colors.cream}; padding: 16px; border-radius: 8px;">
        <h3 class="section-title" style="border: none; margin-bottom: 8px;">Assembly Tips</h3>
        <ul style="font-size: 13px; color: #666; padding-left: 20px; margin: 0;">
          <li>Take cheese out 30-60 minutes before serving</li>
          <li>Place soft cheeses away from edge to prevent mess</li>
          <li>Cut a few slices to encourage guests to dig in</li>
          <li>Add fresh herbs or edible flowers for color</li>
        </ul>
      </div>
    `;

    return generatePrintableHTML({
      title: boardName,
      subtitle: `${style?.name || 'Custom'} for ${guestCount} guests`,
      content,
    });
  }, [boardName, boardStyle, guestCount, selectedCheeses, selectedAccompaniments]);

  // Print with branded layout
  const handlePrint = useCallback(() => {
    const html = generateBoardHTML();
    printContent(html);
  }, [generateBoardHTML]);

  // Download as HTML file
  const handleDownload = useCallback(() => {
    const filename = `${boardName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-cheese-board-${new Date().toISOString().split('T')[0]}.html`;
    downloadAsHTML({
      title: boardName,
      subtitle: `${currentStyle.name} for ${guestCount} guests`,
      content: generateBoardHTML().split('<div class="content">')[1]?.split('</div>')[0] || '',
      filename,
    });
  }, [boardName, currentStyle, guestCount, generateBoardHTML]);

  // Generate shareable URL
  const handleShare = useCallback(() => {
    const data: SharedBoardData = {
      boardName,
      boardStyle,
      guestCount,
      selectedCheeses,
      selectedAccompaniments,
    };
    const url = generateShareableUrl('/tools/cheese-board-builder', data);
    setShareUrl(url);
    setShowShareModal(true);
    setLinkCopied(false);
  }, [boardName, boardStyle, guestCount, selectedCheeses, selectedAccompaniments]);

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
      title: `${boardName} - Cheese Board`,
      text: `Check out my cheese board for ${guestCount} guests!`,
      url: shareUrl,
    });
  }, [boardName, guestCount, shareUrl]);

  // Copy text summary to clipboard
  const handleCopyText = useCallback(async () => {
    let text = `${boardName}\n${'='.repeat(boardName.length)}\n\n`;
    text += `${currentStyle.name} for ${guestCount} guests\n\n`;
    text += `CHEESES:\n`;
    selectedCheeses.forEach((id) => {
      const cheese = cheeses.find((c) => c.id === id);
      if (cheese) text += `- ${cheese.name} (${cheese.type})\n`;
    });
    text += `\nACCOMPANIMENTS:\n`;
    selectedAccompaniments.forEach((id) => {
      const acc = accompaniments.find((a) => a.id === id);
      if (acc) text += `- ${acc.name}\n`;
    });
    text += `\n---\nCreated with ${BRAND.name} | ${BRAND.url}`;
    await copyToClipboard(text);
  }, [boardName, currentStyle, guestCount, selectedCheeses, selectedAccompaniments]);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      soft: 'bg-yellow-100 text-yellow-700',
      'semi-soft': 'bg-orange-100 text-orange-700',
      firm: 'bg-amber-100 text-amber-700',
      hard: 'bg-red-100 text-red-700',
      blue: 'bg-blue-100 text-blue-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      fruit: 'bg-pink-100 text-pink-700',
      meat: 'bg-red-100 text-red-700',
      cracker: 'bg-amber-100 text-amber-700',
      nut: 'bg-orange-100 text-orange-700',
      condiment: 'bg-yellow-100 text-yellow-700',
      vegetable: 'bg-green-100 text-green-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  // Calculate quantities per person
  const calculateQuantities = () => {
    const cheeseOz = guestCount * 2; // 2oz per person
    const meatOz = guestCount * 1; // 1oz per person
    const crackers = guestCount * 5; // 5 crackers per person
    const fruitServings = guestCount * 0.5; // shared

    return { cheeseOz, meatOz, crackers, fruitServings };
  };

  const quantities = calculateQuantities();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Shared Content Banner */}
      {isLoadedFromShare && (
        <div className="mb-6 p-4 bg-gradient-to-r from-[var(--color-wine-glow)] to-amber-50 rounded-xl border border-[var(--color-wine)]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-wine)] flex items-center justify-center text-white text-xl">
              🧀
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Shared Cheese Board</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                You're viewing a shared cheese board. Modify or build your own!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => s < step && setStep(s)}
                className={cn(
                  'w-10 h-10 rounded-full font-medium transition-colors',
                  step === s
                    ? 'bg-[var(--color-wine)] text-white'
                    : step > s
                      ? 'bg-green-500 text-white cursor-pointer'
                      : 'bg-[var(--color-cream)] text-[var(--text-muted)]'
                )}
              >
                {step > s ? '✓' : s}
              </button>
              {s < 4 && (
                <div
                  className={cn(
                    'w-16 md:w-24 h-1 mx-2',
                    step > s ? 'bg-green-500' : 'bg-[var(--color-cream)]'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-md mx-auto mt-2 text-xs text-[var(--text-muted)]">
          <span>Style</span>
          <span>Cheeses</span>
          <span>Pairings</span>
          <span>Build</span>
        </div>
      </div>

      {/* Step 1: Choose Style */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-cream-dark)] p-6 md:p-8">
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] mb-2">
            Choose Your Board Style
          </h2>
          <p className="text-[var(--text-muted)] mb-6">How grand should your cheese board be?</p>

          {/* Board Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Name Your Board
            </label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="e.g., Holiday Party Board"
              className="w-full md:w-1/2 px-4 py-2 border border-[var(--color-cream-dark)] rounded-lg focus:border-[var(--color-wine)] focus:outline-none focus:ring-2 focus:ring-[var(--color-wine)]/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {boardStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setBoardStyle(style.id)}
                className={cn(
                  'p-4 rounded-lg border-2 text-left transition-all',
                  boardStyle === style.id
                    ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                    : 'border-[var(--color-cream-dark)] hover:border-[var(--color-wine)]'
                )}
              >
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">{style.name}</h3>
                <p className="text-sm text-[var(--text-muted)] mb-2">{style.description}</p>
                <div className="text-xs text-[var(--text-muted)]">
                  {style.cheesesCount} cheeses • {style.accompanimentCount} accompaniments
                </div>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              How many guests?
            </label>
            <input
              type="range"
              min="2"
              max="20"
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-lg font-semibold text-[var(--color-wine)]">{guestCount} guests</div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3 bg-[var(--color-wine)] text-white rounded-lg font-medium hover:bg-[var(--color-wine-deep)] transition-colors"
          >
            Next: Choose Cheeses
          </button>
        </div>
      )}

      {/* Step 2: Choose Cheeses */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-cream-dark)] p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                Select Your Cheeses
              </h2>
              <p className="text-[var(--text-muted)]">Choose {currentStyle.cheesesCount} cheeses for variety</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[var(--color-wine)]">{selectedCheeses.length}</span>
              <span className="text-[var(--text-muted)]">/{currentStyle.cheesesCount}</span>
            </div>
          </div>

          {/* Variety Tips */}
          <div className="mb-4 p-3 bg-[var(--color-cream)] rounded-lg text-sm">
            <span className="font-medium">Pro tip:</span> Include a mix of soft, firm, and bold cheeses for the best variety.
            {selectedCheeseTypes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                Selected types: {[...new Set(selectedCheeseTypes)].map((type) => (
                  <span key={type} className={cn('px-2 py-0.5 rounded text-xs', getTypeColor(type as string))}>
                    {type}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cheese Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 max-h-[400px] overflow-y-auto">
            {cheeses.map((cheese) => (
              <button
                key={cheese.id}
                onClick={() => handleCheeseToggle(cheese.id)}
                disabled={!selectedCheeses.includes(cheese.id) && selectedCheeses.length >= currentStyle.cheesesCount}
                className={cn(
                  'p-3 rounded-lg border text-left transition-all',
                  selectedCheeses.includes(cheese.id)
                    ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                    : selectedCheeses.length >= currentStyle.cheesesCount
                      ? 'border-[var(--color-cream-dark)] opacity-50 cursor-not-allowed'
                      : 'border-[var(--color-cream-dark)] hover:border-[var(--color-wine)]'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-[var(--text-primary)]">{cheese.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{cheese.flavor}</p>
                  </div>
                  <span className={cn('px-2 py-0.5 rounded text-xs', getTypeColor(cheese.type))}>
                    {cheese.type}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-[var(--color-cream)] text-[var(--text-primary)] rounded-lg font-medium hover:bg-[var(--color-cream-dark)] transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={selectedCheeses.length < currentStyle.cheesesCount}
              className={cn(
                'flex-1 py-3 rounded-lg font-medium transition-colors',
                selectedCheeses.length >= currentStyle.cheesesCount
                  ? 'bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)]'
                  : 'bg-[var(--color-cream)] text-[var(--text-muted)] cursor-not-allowed'
              )}
            >
              Next: Add Pairings
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Choose Accompaniments */}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-cream-dark)] p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                Add Accompaniments
              </h2>
              <p className="text-[var(--text-muted)]">Choose {currentStyle.accompanimentCount} items to complement your cheeses</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[var(--color-wine)]">{selectedAccompaniments.length}</span>
              <span className="text-[var(--text-muted)]">/{currentStyle.accompanimentCount}</span>
            </div>
          </div>

          {/* Category variety */}
          <div className="mb-4 p-3 bg-[var(--color-cream)] rounded-lg text-sm">
            <span className="font-medium">Aim for variety:</span> Include items from different categories.
            {selectedAccompanimentCategories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {[...new Set(selectedAccompanimentCategories)].map((cat) => (
                  <span key={cat} className={cn('px-2 py-0.5 rounded text-xs', getCategoryColor(cat as string))}>
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Accompaniments by category */}
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
            {['fruit', 'meat', 'cracker', 'nut', 'condiment', 'vegetable'].map((category) => (
              <div key={category}>
                <h3 className={cn('text-sm font-medium mb-2 px-2 py-1 rounded inline-block', getCategoryColor(category))}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}s
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {accompaniments
                    .filter((a) => a.category === category)
                    .map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => handleAccompanimentToggle(acc.id)}
                        disabled={!selectedAccompaniments.includes(acc.id) && selectedAccompaniments.length >= currentStyle.accompanimentCount}
                        className={cn(
                          'p-2 rounded-lg border text-left text-sm transition-all',
                          selectedAccompaniments.includes(acc.id)
                            ? 'border-[var(--color-wine)] bg-[var(--color-wine-glow)]'
                            : selectedAccompaniments.length >= currentStyle.accompanimentCount
                              ? 'border-[var(--color-cream-dark)] opacity-50 cursor-not-allowed'
                              : 'border-[var(--color-cream-dark)] hover:border-[var(--color-wine)]'
                        )}
                      >
                        {acc.name}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 bg-[var(--color-cream)] text-[var(--text-primary)] rounded-lg font-medium hover:bg-[var(--color-cream-dark)] transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={selectedAccompaniments.length < currentStyle.accompanimentCount}
              className={cn(
                'flex-1 py-3 rounded-lg font-medium transition-colors',
                selectedAccompaniments.length >= currentStyle.accompanimentCount
                  ? 'bg-[var(--color-wine)] text-white hover:bg-[var(--color-wine-deep)]'
                  : 'bg-[var(--color-cream)] text-[var(--text-muted)] cursor-not-allowed'
              )}
            >
              Build My Board
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Final Board */}
      {step === 4 && (
        <div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="bg-[var(--color-wine)] text-white p-6 text-center">
              <span className="text-4xl mb-2 block">🧀</span>
              <h2 className="font-display text-2xl font-semibold">{boardName}</h2>
              <p className="text-white/80">{currentStyle.name} for {guestCount} guests</p>
            </div>

            <div className="p-6">
              {/* Quantities */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-[var(--color-cream)] rounded-lg">
                  <div className="text-xl font-bold text-[var(--color-wine)]">{quantities.cheeseOz} oz</div>
                  <div className="text-xs text-[var(--text-muted)]">Total Cheese</div>
                </div>
                <div className="text-center p-3 bg-[var(--color-cream)] rounded-lg">
                  <div className="text-xl font-bold text-[var(--color-wine)]">{quantities.meatOz} oz</div>
                  <div className="text-xs text-[var(--text-muted)]">Charcuterie</div>
                </div>
                <div className="text-center p-3 bg-[var(--color-cream)] rounded-lg">
                  <div className="text-xl font-bold text-[var(--color-wine)]">{quantities.crackers}+</div>
                  <div className="text-xs text-[var(--text-muted)]">Crackers</div>
                </div>
                <div className="text-center p-3 bg-[var(--color-cream)] rounded-lg">
                  <div className="text-xl font-bold text-[var(--color-wine)]">{Math.ceil(quantities.fruitServings)}</div>
                  <div className="text-xs text-[var(--text-muted)]">Cups Fruit</div>
                </div>
              </div>

              {/* Selected Cheeses */}
              <h3 className="font-semibold text-[var(--text-primary)] mb-3">Your Cheeses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {selectedCheeses.map((id) => {
                  const cheese = cheeses.find((c) => c.id === id)!;
                  return (
                    <div key={id} className="p-3 border border-[var(--color-cream-dark)] rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{cheese.name}</span>
                        <span className={cn('text-xs px-2 py-0.5 rounded', getTypeColor(cheese.type))}>
                          {cheese.type}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">{cheese.flavor}</p>
                    </div>
                  );
                })}
              </div>

              {/* Selected Accompaniments */}
              <h3 className="font-semibold text-[var(--text-primary)] mb-3">Your Accompaniments</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedAccompaniments.map((id) => {
                  const acc = accompaniments.find((a) => a.id === id)!;
                  return (
                    <span
                      key={id}
                      className={cn('px-3 py-1.5 rounded-lg text-sm', getCategoryColor(acc.category))}
                    >
                      {acc.name}
                    </span>
                  );
                })}
              </div>

              {/* Tips */}
              <div className="p-4 bg-[var(--color-cream)] rounded-lg">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">Assembly Tips</h4>
                <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                  <li>* Take cheese out 30-60 minutes before serving</li>
                  <li>* Place soft cheeses away from edge to prevent mess</li>
                  <li>* Cut a few slices to encourage guests to dig in</li>
                  <li>* Add fresh herbs or edible flowers for color</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
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

          <div className="flex justify-center">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-lg font-medium bg-[var(--color-cream)] text-[var(--text-primary)] hover:bg-[var(--color-cream-dark)] transition-colors"
            >
              Build Another Board
            </button>
          </div>
        </div>
      )}

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
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--color-wine-glow)] flex items-center justify-center text-2xl">
                🧀
              </div>
              <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">
                Share Cheese Board
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Share your perfect cheese board with friends
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
                href={`mailto:?subject=${encodeURIComponent(`${boardName} - Cheese Board`)}&body=${encodeURIComponent(`Check out my cheese board!\n\n${shareUrl}`)}`}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-cream)] rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--color-cream-dark)] transition-colors"
              >
                <MailIcon />
                Email
              </a>
            </div>

            {/* WhatsApp Share */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${boardName} - Cheese Board\n\n${shareUrl}`)}`}
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
              Recipients can view and customize the board for their needs
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
