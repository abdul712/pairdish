import { Suspense } from 'react';
import { Metadata } from 'next';
import SearchResults from '@/components/SearchResults';
import SearchFilters from '@/components/SearchFilters';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Search Recipes and Dishes | PairDish',
  description: 'Search our extensive collection of recipes and dish pairings. Find the perfect side dishes for any meal.',
});

interface SearchPageProps {
  searchParams: {
    q?: string;
    category?: string;
    cuisine?: string;
    page?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const category = searchParams.category;
  const cuisine = searchParams.cuisine;
  const page = parseInt(searchParams.page || '1', 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">
          {query ? `Search results for "${query}"` : 'Search Recipes and Dishes'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <SearchFilters 
              currentCategory={category}
              currentCuisine={cuisine}
            />
          </aside>

          {/* Search Results */}
          <div className="lg:col-span-3">
            <Suspense 
              key={`${query}-${category}-${cuisine}-${page}`}
              fallback={<div>Loading search results...</div>}
            >
              <SearchResults
                query={query}
                category={category}
                cuisine={cuisine}
                page={page}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}