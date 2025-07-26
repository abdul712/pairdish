import { Recipe } from '@/types';
import { formatCookingTime } from '@/lib/utils';

interface RecipeInfoProps {
  recipe: Recipe;
}

export default function RecipeInfo({ recipe }: RecipeInfoProps) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Recipe Details</h3>
      <dl className="space-y-3">
        {recipe.prepTime && (
          <div>
            <dt className="text-sm text-gray-600">Prep Time</dt>
            <dd className="font-medium">{formatCookingTime(recipe.prepTime)}</dd>
          </div>
        )}
        {recipe.cookTime && (
          <div>
            <dt className="text-sm text-gray-600">Cook Time</dt>
            <dd className="font-medium">{formatCookingTime(recipe.cookTime)}</dd>
          </div>
        )}
        {totalTime > 0 && (
          <div>
            <dt className="text-sm text-gray-600">Total Time</dt>
            <dd className="font-medium">{formatCookingTime(totalTime)}</dd>
          </div>
        )}
        {recipe.servings && (
          <div>
            <dt className="text-sm text-gray-600">Servings</dt>
            <dd className="font-medium">{recipe.servings}</dd>
          </div>
        )}
        {recipe.difficulty && (
          <div>
            <dt className="text-sm text-gray-600">Difficulty</dt>
            <dd className="font-medium capitalize">{recipe.difficulty}</dd>
          </div>
        )}
        {recipe.tags && recipe.tags.length > 0 && (
          <div>
            <dt className="text-sm text-gray-600 mb-2">Tags</dt>
            <dd className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}