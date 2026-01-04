/**
 * PairDish Export Utilities
 *
 * Shared utilities for exporting, sharing, and downloading content
 * with PairDish branding across all tools.
 */

// Brand colors and styling for exports
export const BRAND = {
  name: 'PairDish',
  tagline: 'Perfect Pairings, Every Plate',
  url: 'https://pairdish.com',
  colors: {
    wine: '#722F37',
    wineDeep: '#5A252C',
    gold: '#C9A227',
    cream: '#FAF7F2',
    charcoal: '#2D2D2D',
  },
};

/**
 * Generate a shareable URL with encoded state data
 */
export function generateShareableUrl(
  basePath: string,
  data: Record<string, unknown>
): string {
  const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
  const url = new URL(basePath, window.location.origin);
  url.searchParams.set('data', encoded);
  return url.toString();
}

/**
 * Parse shared data from URL
 */
export function parseSharedData<T>(defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const url = new URL(window.location.href);
    const encoded = url.searchParams.get('data');
    if (!encoded) return defaultValue;

    const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
    return decoded as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch {
    return false;
  }
}

/**
 * Native share API with fallback to clipboard
 */
export async function shareContent(options: {
  title: string;
  text: string;
  url?: string;
}): Promise<{ method: 'native' | 'clipboard' | 'failed' }> {
  if (navigator.share) {
    try {
      await navigator.share(options);
      return { method: 'native' };
    } catch {
      // User cancelled or share failed
    }
  }

  // Fallback to clipboard
  const textToShare = options.url
    ? `${options.text}\n\n${options.url}`
    : options.text;

  const success = await copyToClipboard(textToShare);
  return { method: success ? 'clipboard' : 'failed' };
}

/**
 * Generate printable HTML content with PairDish branding
 */
export function generatePrintableHTML(options: {
  title: string;
  subtitle?: string;
  content: string;
  footer?: string;
}): string {
  const { title, subtitle, content, footer } = options;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title} - ${BRAND.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    @page {
      margin: 0.75in;
      size: letter;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: ${BRAND.colors.charcoal};
      line-height: 1.5;
      padding: 20px;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid ${BRAND.colors.wine};
      padding-bottom: 16px;
      margin-bottom: 24px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      background: ${BRAND.colors.wine};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: Georgia, serif;
      font-size: 24px;
      font-weight: 600;
    }

    .brand-text {
      font-family: Georgia, serif;
    }

    .brand-name {
      font-size: 20px;
      font-weight: 600;
      color: ${BRAND.colors.wine};
    }

    .brand-tagline {
      font-size: 11px;
      color: #666;
    }

    .header-right {
      text-align: right;
      font-size: 12px;
      color: #666;
    }

    .title {
      font-family: Georgia, serif;
      font-size: 28px;
      font-weight: 600;
      color: ${BRAND.colors.charcoal};
      margin-bottom: 8px;
    }

    .subtitle {
      font-size: 14px;
      color: #666;
      margin-bottom: 24px;
    }

    .content {
      min-height: 400px;
    }

    .section {
      margin-bottom: 24px;
    }

    .section-title {
      font-family: Georgia, serif;
      font-size: 18px;
      font-weight: 600;
      color: ${BRAND.colors.wine};
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }

    .item {
      padding: 8px 0;
      border-bottom: 1px dotted #ddd;
    }

    .item:last-child {
      border-bottom: none;
    }

    .item-name {
      font-weight: 600;
    }

    .item-detail {
      font-size: 13px;
      color: #666;
    }

    .tags {
      display: inline-flex;
      gap: 6px;
      margin-top: 4px;
    }

    .tag {
      font-size: 10px;
      padding: 2px 8px;
      background: ${BRAND.colors.cream};
      border-radius: 10px;
      color: #666;
    }

    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #eee;
      font-size: 11px;
      color: #999;
      text-align: center;
    }

    .footer a {
      color: ${BRAND.colors.wine};
      text-decoration: none;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-box {
      text-align: center;
      padding: 16px;
      background: ${BRAND.colors.cream};
      border-radius: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: ${BRAND.colors.wine};
    }

    .stat-label {
      font-size: 12px;
      color: #666;
    }

    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="brand-logo">P</div>
      <div class="brand-text">
        <div class="brand-name">${BRAND.name}</div>
        <div class="brand-tagline">${BRAND.tagline}</div>
      </div>
    </div>
    <div class="header-right">
      Generated on ${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </div>
  </div>

  <h1 class="title">${title}</h1>
  ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}

  <div class="content">
    ${content}
  </div>

  <div class="footer">
    ${footer || `Created with ${BRAND.name} | <a href="${BRAND.url}">${BRAND.url}</a>`}
  </div>
</body>
</html>
`;
}

/**
 * Open print dialog with custom content
 */
export function printContent(html: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print this content.');
    return;
  }

  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

/**
 * Download content as a file
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download HTML as a self-contained file (can be opened in browser and printed to PDF)
 */
export function downloadAsHTML(options: {
  title: string;
  subtitle?: string;
  content: string;
  filename: string;
}): void {
  const html = generatePrintableHTML(options);
  downloadFile(html, options.filename, 'text/html');
}

/**
 * Format date for display
 */
export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generate a unique share ID
 */
export function generateShareId(): string {
  return Math.random().toString(36).substring(2, 10);
}
