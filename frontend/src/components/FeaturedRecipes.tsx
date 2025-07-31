import Link from 'next/link';
import pairDishAPI from '@/lib/api';
import RecipeCard from './RecipeCard';

export default async function FeaturedRecipes() {
  const recipes = await pairDishAPI.getAllRecipes();
  const featuredRecipes = recipes.slice(0, 6); // Get first 6 recipes

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