import { Recipe } from '@/types';
import { formatCookingTime, truncateText } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="card h-full transition-transform hover:scale-105">
      {recipe.imageUrl && (
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
        {recipe.description && (
          <p className="text-gray-600 text-sm mb-3">
            {truncateText(recipe.description, 80)}
          </p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          {totalTime > 0 && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatCookingTime(totalTime)}
            </span>
          )}
          {recipe.difficulty && (
            <span className="capitalize">{recipe.difficulty}</span>
          )}
        </div>
      </div>
    </div>
  );
}