import Link from 'next/link';
import pairDishAPI from '@/lib/api';
import DishCard from './DishCard';
import RecipeCard from './RecipeCard';
import Pagination from './Pagination';

interface SearchResultsProps {
  query: string;
  category?: string;
  cuisine?: string;
  page: number;
}

export default async function SearchResults({ query, category, cuisine, page }: SearchResultsProps) {
  const results = await pairDishAPI.search(query, page);

  if (results.totalResults === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">No results found for your search.</p>
        <p className="text-gray-500 mt-2">Try adjusting your search terms or filters.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-gray-600">
        Found {results.totalResults} results
      </div>

      {/* Dishes Section */}
      {results.dishes.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Dishes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.dishes.map((dish) => (
              <Link
                key={dish.id}
                href={`/dishes/${dish.slug}/pairings`}
                className="block"
              >
                <DishCard dish={dish} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recipes Section */}
      {results.recipes.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.recipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.slug}`}
                className="block"
              >
                <RecipeCard recipe={recipe} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={results.totalPages}
        baseUrl={`/search?q=${encodeURIComponent(query)}${category ? `&category=${category}` : ''}${cuisine ? `&cuisine=${cuisine}` : ''}`}
      />
    </div>
  );
}