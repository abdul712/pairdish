import { MainDishModel } from '../models/MainDish';

export class SitemapGenerator {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://pairdish.com') {
    this.baseUrl = baseUrl;
  }

  async generateSitemap(): Promise<string> {
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'weekly', lastmod: undefined },
      { url: '/search', priority: '0.8', changefreq: 'daily', lastmod: undefined },
    ];

    // Get all dishes for dynamic pages
    const { dishes } = await MainDishModel.findAll(1, 10000); // Get all dishes

    const dishPages = dishes.map((dish: any) => ({
      url: `/what-to-serve-with-${dish.slug}`,
      priority: '0.9',
      changefreq: 'monthly',
      lastmod: dish.updated_at || dish.created_at
    }));

    const allPages = [...staticPages, ...dishPages];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    for (const page of allPages) {
      sitemap += `
  <url>
    <loc>${this.baseUrl}${page.url}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>${page.lastmod ? `
    <lastmod>${new Date(page.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
  </url>`;
    }

    sitemap += `
</urlset>`;

    return sitemap;
  }

  async generateRobotsTxt(): Promise<string> {
    return `User-agent: *
Allow: /

Sitemap: ${this.baseUrl}/sitemap.xml

# Disallow search result pagination to avoid duplicate content
Disallow: /search?*page=
`;
  }
}