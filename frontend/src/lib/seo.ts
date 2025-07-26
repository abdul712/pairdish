import { Metadata } from 'next';
import { SEOMetadata } from '@/types';

const defaultMetadata: SEOMetadata = {
  title: 'PairDish - Perfect Side Dishes for Every Meal',
  description: 'Discover the perfect side dishes, sauces, and pairings for any meal. Find recipes and pairing suggestions for your favorite dishes.',
  keywords: ['side dishes', 'food pairing', 'recipes', 'meal planning', 'cooking'],
};

export function generateMetadata(customMetadata: Partial<SEOMetadata>): Metadata {
  const metadata = { ...defaultMetadata, ...customMetadata };
  
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'PairDish';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pairdish.com';

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.openGraph?.title || metadata.title,
      description: metadata.openGraph?.description || metadata.description,
      url: metadata.openGraph?.url || siteUrl,
      siteName,
      images: metadata.openGraph?.image ? [
        {
          url: metadata.openGraph.image,
          width: 1200,
          height: 630,
          alt: metadata.openGraph?.title || metadata.title,
        }
      ] : [],
      type: 'website',
    },
    twitter: {
      card: metadata.twitter?.card || 'summary_large_image',
      title: metadata.twitter?.title || metadata.title,
      description: metadata.twitter?.description || metadata.description,
      images: metadata.twitter?.image ? [metadata.twitter.image] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: metadata.openGraph?.url || siteUrl,
    },
  };
}

export function generateDishMetadata(dishName: string, description?: string): SEOMetadata {
  return {
    title: `What to Serve with ${dishName} - Best Side Dishes | PairDish`,
    description: description || `Discover the perfect side dishes and pairings for ${dishName}. Find recipes, sauces, and beverages that complement ${dishName} perfectly.`,
    keywords: [dishName, `${dishName} side dishes`, `what to serve with ${dishName}`, 'food pairing', 'recipes'],
  };
}

export function generateRecipeMetadata(recipeName: string, description?: string): SEOMetadata {
  return {
    title: `${recipeName} Recipe | PairDish`,
    description: description || `Learn how to make ${recipeName} with our easy-to-follow recipe. Perfect as a side dish or main course.`,
    keywords: [recipeName, `${recipeName} recipe`, 'cooking', 'recipes', 'side dishes'],
  };
}