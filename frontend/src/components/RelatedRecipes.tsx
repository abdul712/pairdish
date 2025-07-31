import Link from 'next/link';
import { Recipe } from '@/types';
import pairDishAPI from '@/lib/api';

interface RelatedRecipesProps {
  currentRecipe: Recipe;
}

export default async function RelatedRecipes({ currentRecipe }: RelatedRecipesProps) {
  const allRecipes = await pairDishAPI.getAllRecipes();
  
  // Filter recipes by similar tags or difficulty, excluding current recipe
  const relatedRecipes = allRecipes
    .filter(recipe => {
      if (recipe.id === currentRecipe.id) return false;
      
      // Check for matching tags
      const hasMatchingTag = currentRecipe.tags?.some(tag => 
        recipe.tags?.includes(tag)
      );
      
      // Check for same difficulty
      const sameDifficulty = recipe.difficulty === currentRecipe.difficulty;
      
      return hasMatchingTag || sameDifficulty;
    })
    .slice(0, 5);

  if (relatedRecipes.length === 0) return null;

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">You Might Also Like</h3>
      <ul className="space-y-3">
        {relatedRecipes.map((recipe) => (
          <li key={recipe.id}>
            <Link
              href={`/recipe/${recipe.slug}`}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {recipe.title}
            </Link>
            {recipe.difficulty && (
              <p className="text-sm text-gray-500 capitalize">{recipe.difficulty}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}