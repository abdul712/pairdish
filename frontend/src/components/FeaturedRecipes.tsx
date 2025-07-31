import Link from 'next/link';
import RecipeCard from './RecipeCard';
import { Recipe } from '@/types';

export default async function FeaturedRecipes() {
  let featuredRecipes: Recipe[] = [];
  
  try {
    // Use fetch directly with the new API endpoint
    const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof globalThis !== 'undefined' && globalThis.location ? globalThis.location.origin : 'https://pairdish.mabdulrahim.workers.dev');
    const response = await fetch(`${API_URL}/api/recipes/featured`, {
      cache: 'no-store', // Always get fresh data
    });
    
    if (!response.ok) {
      console.error('Failed to fetch featured recipes:', response.status, response.statusText);
      // Fallback to regular recipes endpoint
      const fallbackResponse = await fetch(`${API_URL}/api/recipes?limit=6`, {
        cache: 'no-store',
      });
      
      if (fallbackResponse.ok) {
        const allRecipes = await fallbackResponse.json();
        featuredRecipes = (allRecipes || []).slice(0, 6);
      }
    } else {
      featuredRecipes = await response.json();
    }
  } catch (error) {
    console.error('Error fetching featured recipes:', error);
    // Return empty array if all fails
    featuredRecipes = [];
  }

  // Don't render anything if no recipes to avoid empty section
  if (!featuredRecipes || featuredRecipes.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredRecipes.map((recipe) => (
        <Link
          key={recipe.id}
          href={`/recipe/${recipe.slug}`}
          className="block"
        >
          <RecipeCard recipe={recipe} />
        </Link>
      ))}
    </div>
  );
}