// Food image service for high-quality food photos
export class ImageService {
  private static cache = new Map<string, string>();
  
  // Get food image from various APIs with fallback
  static async getFoodImage(dishName: string, width = 400, height = 300): Promise<string> {
    const cacheKey = `${dishName}-${width}x${height}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Try multiple sources for the best image quality
      const sources = [
        () => this.getUnsplashImage(dishName, width, height),
        () => this.getFoodishImage(),
        () => this.getPlaceholderFood(width, height)
      ];

      for (const source of sources) {
        try {
          const imageUrl = await source();
          if (imageUrl) {
            this.cache.set(cacheKey, imageUrl);
            return imageUrl;
          }
        } catch (error) {
          console.warn('Failed to load from source:', error);
          continue;
        }
      }

      // Final fallback
      return this.getPlaceholderFood(width, height);
    } catch (error) {
      console.error('Failed to get food image:', error);
      return this.getPlaceholderFood(width, height);
    }
  }

  // Unsplash Source API for high-quality food photos
  private static async getUnsplashImage(query: string, width: number, height: number): Promise<string> {
    const cleanQuery = this.cleanDishName(query);
    const foodTerms = ['food', 'dish', 'cuisine', 'meal'];
    const searchTerm = `${cleanQuery} ${foodTerms[Math.floor(Math.random() * foodTerms.length)]}`;
    
    return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(searchTerm)}`;
  }

  // Foodish API for random food images
  private static async getFoodishImage(): Promise<string> {
    try {
      const response = await fetch('https://foodish-api.herokuapp.com/api/');
      const data = await response.json();
      return data.image;
    } catch (error) {
      throw new Error('Foodish API failed');
    }
  }

  // Placeholder with food styling
  private static getPlaceholderFood(width: number, height: number): string {
    const gradients = [
      'linear-gradient(135deg, #ff6b35, #f7931e)',
      'linear-gradient(135deg, #f7931e, #ffd23f)', 
      'linear-gradient(135deg, #ee2a7b, #ff6b35)',
      'linear-gradient(135deg, #c73e1d, #ee2a7b)',
      'linear-gradient(135deg, #ffd23f, #ff6b35)'
    ];
    const gradient = gradients[Math.floor(Math.random() * gradients.length)];
    
    // Create a data URL with SVG for better-looking placeholders
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff6b35;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f7931e;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#grad)" />
        <text x="${width/2}" y="${height/2}" text-anchor="middle" dy="0.35em" 
              style="font-family:Arial;font-size:${Math.min(width, height)/4}px;fill:white;">
          🍽️
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  // Clean dish name for better search results
  private static cleanDishName(dishName: string): string {
    return dishName
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .slice(0, 2) // Take first 2 words for better results
      .join(' ');
  }

  // Get cuisine-specific image
  static async getCuisineImage(cuisine: string, width = 300, height = 200): Promise<string> {
    const cuisineImages = {
      indian: 'https://source.unsplash.com/400x300/?indian,food,curry,spices',
      italian: 'https://source.unsplash.com/400x300/?italian,pasta,pizza,food',
      mexican: 'https://source.unsplash.com/400x300/?mexican,tacos,food,avocado',
      american: 'https://source.unsplash.com/400x300/?american,burger,food,bbq',
      chinese: 'https://source.unsplash.com/400x300/?chinese,food,noodles,dimsum',
      thai: 'https://source.unsplash.com/400x300/?thai,food,curry,pad-thai'
    };

    return cuisineImages[cuisine.toLowerCase() as keyof typeof cuisineImages] || 
           `https://source.unsplash.com/${width}x${height}/?${cuisine},food,cuisine`;
  }

  // Get hero background image
  static getHeroBackground(): string {
    const heroImages = [
      'https://source.unsplash.com/1920x1080/?food,cooking,kitchen,chef',
      'https://source.unsplash.com/1920x1080/?restaurant,dining,food,elegant',
      'https://source.unsplash.com/1920x1080/?ingredients,fresh,food,colorful'
    ];
    
    return heroImages[Math.floor(Math.random() * heroImages.length)];
  }

  // Preload images for better performance
  static preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  }
}
