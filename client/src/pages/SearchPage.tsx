import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '@/services/api';
import type { MainDish } from '@/types';
import { SEOHead } from '@/components/SEOHead';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<MainDish[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query, page);
    }
  }, [query, page]);

  const performSearch = async (searchTerm: string, currentPage: number) => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.searchDishes(searchTerm, currentPage, 20);
      
      if (response.success) {
        setResults(response.data);
        setTotalResults(response.pagination.total);
        setTotalPages(response.pagination.totalPages);
      } else {
        setError('Search failed. Please try again.');
        setResults([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim(), page: '1' });
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ q: query, page: newPage.toString() });
  };

  const highlightSearchTerm = (text: string, term: string) => {
    if (!term.trim()) return text;
    
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Generate SEO data based on search state
  const getPageTitle = () => {
    if (query) {
      return `Search Results for "${query}" - Find Side Dish Pairings | PairDish`;
    }
    return 'Search Food Pairings - Find Perfect Side Dishes | PairDish';
  };

  const getPageDescription = () => {
    if (query && totalResults > 0) {
      return `Found ${totalResults} dishes matching "${query}". Discover perfect side dish pairings and meal combinations for your favorite foods.`;
    } else if (query) {
      return `Search results for "${query}". Find perfect side dish pairings and meal combinations at PairDish.`;
    }
    return 'Search our database of over 5,000 dishes to find perfect side dish pairings. Get expert pairing suggestions with detailed explanations.';
  };

  const getKeywords = () => {
    if (query) {
      return `${query}, search food pairing, side dishes for ${query}, meal planning, cooking tips`;
    }
    return 'search food pairing, side dishes, meal search, cooking tips, culinary pairings, recipe search';
  };

  const canonicalUrl = query 
    ? `https://pairdish.com/search?q=${encodeURIComponent(query)}`
    : 'https://pairdish.com/search';

  return (
    <>
      <SEOHead
        title={getPageTitle()}
        description={getPageDescription()}
        keywords={getKeywords()}
        canonicalUrl={canonicalUrl}
      />
      <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Search Results</h1>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-2xl mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12"
            />
            <Button 
              type="submit" 
              size="sm" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Results Summary */}
        {!loading && query && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-muted-foreground">
              {totalResults > 0 ? (
                <>
                  Showing <span className="font-medium">{(page - 1) * 20 + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(page * 20, totalResults)}</span> of{' '}
                  <span className="font-medium">{totalResults}</span> results for{' '}
                  <span className="font-medium">"{query}"</span>
                </>
              ) : (
                <>No results found for <span className="font-medium">"{query}"</span></>
              )}
            </p>

            {/* Filter placeholder - can be expanded later */}
            <Button variant="outline" size="sm" className="w-fit">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12 bg-destructive/10 rounded-lg">
          <p className="text-destructive font-medium mb-2">{error}</p>
          <p className="text-muted-foreground text-sm">
            Please check your search term and try again.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && query && results.length === 0 && (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No dishes found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any dishes matching "{query}". Try:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 mb-6">
            <li>• Checking your spelling</li>
            <li>• Using more general terms</li>
            <li>• Trying different keywords</li>
          </ul>
          
          {/* Suggestions */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Popular searches:</span>
            {['chicken', 'pasta', 'rice', 'steak', 'fish', 'vegetables'].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery(suggestion);
                  setSearchParams({ q: suggestion, page: '1' });
                }}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Results Grid */}
      {!loading && !error && results.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {results.map((dish) => (
              <Card key={dish.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    <Link 
                      to={`/what-to-serve-with/${dish.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {highlightSearchTerm(dish.name, query)}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {dish.description ? 
                      highlightSearchTerm(dish.description, query) :
                      `Discover perfect side dishes for ${dish.name}`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {dish.cuisine_type && (
                      <Badge variant="secondary" className="text-xs">
                        {dish.cuisine_type}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      View Pairings
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = index + 1;
                  } else {
                    const start = Math.max(1, page - 2);
                    const end = Math.min(totalPages, start + 4);
                    pageNumber = start + index;
                    if (pageNumber > end) return null;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={page === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      className="w-10"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* No query state */}
      {!query && !loading && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">What would you like to search for?</h3>
          <p className="text-muted-foreground mb-6">
            Enter a dish name to find perfect side dish pairings.
          </p>
          
          {/* Popular searches */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Try:</span>
            {['chicken biryani', 'pasta carbonara', 'grilled salmon', 'beef stir fry'].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery(suggestion);
                  setSearchParams({ q: suggestion, page: '1' });
                }}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  );
}