import { Recipe } from '@/types';
import { formatCookingTime } from '@/lib/utils';

interface RecipeHeaderProps {
  recipe: Recipe;
}

export default function RecipeHeader({ recipe }: RecipeHeaderProps) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <nav className="text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-primary-600">Home</a>
              <span className="mx-2">/</span>
              <a href="/recipes" className="hover:text-primary-600">Recipes</a>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{recipe.title}</span>
            </nav>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {recipe.prepTime && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Prep: {formatCookingTime(recipe.prepTime)}</span>
                </div>
              )}
              {recipe.cookTime && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Cook: {formatCookingTime(recipe.cookTime)}</span>
                </div>
              )}
              {totalTime > 0 && (
                <div className="flex items-center font-medium">
                  <span>Total: {formatCookingTime(totalTime)}</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Servings: {recipe.servings}</span>
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex items-center">
                  <span className="capitalize px-2 py-1 bg-gray-200 rounded">
                    {recipe.difficulty}
                  </span>
                </div>
              )}
            </div>
          </div>
          {recipe.imageUrl && (
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}