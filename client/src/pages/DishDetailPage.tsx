import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Star, ChefHat } from 'lucide-react';
import { apiService } from '@/services/api';
import type { MainDish, DishPairing } from '@/types';
import { SEOHead } from '@/components/SEOHead';

export function DishDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [dish, setDish] = useState<MainDish | null>(null);
  const [pairings, setPairings] = useState<DishPairing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // The slug parameter already contains just the dish slug (e.g., "chicken-biryani")
  const dishSlug = slug || '';

  useEffect(() => {
    if (dishSlug) {
      loadDishData();
    }
  }, [dishSlug]);

  const loadDishData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load dish details and pairings in parallel
      const [dishResponse, pairingsResponse] = await Promise.all([
        apiService.getMainDish(dishSlug),
        apiService.getDishPairings(dishSlug)
      ]);

      if (dishResponse.success && dishResponse.data) {
        setDish(dishResponse.data);
      } else {
        setError('Dish not found');
      }

      if (pairingsResponse.success && pairingsResponse.data) {
        setPairings(pairingsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load dish data:', error);
      setError('Failed to load dish information');
    } finally {
      setLoading(false);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Great';
    if (score >= 70) return 'Good';
    return 'Fair';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
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
      </div>
    );
  }

  if (error || !dish) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Dish Not Found</h1>
        <p className="text-muted-foreground mb-6">
          {error || 'The dish you\'re looking for doesn\'t exist.'}
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  // Generate SEO data
  const pageTitle = `What to Serve with ${dish.name} - ${pairings.length} Perfect Side Dish Pairings`;
  const pageDescription = `Discover ${pairings.length} expertly curated side dishes that perfectly complement ${dish.name}. Get match scores and detailed pairing explanations for the perfect meal.`;
  const keywords = `${dish.name}, side dishes, food pairing, ${dish.cuisine_type || 'cuisine'}, meal planning, what to serve with ${dish.name}`;
  const canonicalUrl = `https://pairdish.com/what-to-serve-with/${dish.slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": pageTitle,
    "description": pageDescription,
    "author": {
      "@type": "Organization",
      "name": "PairDish"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PairDish",
      "url": "https://pairdish.com"
    },
    "mainEntity": {
      "@type": "Recipe",
      "name": dish.name,
      "description": dish.description || `Learn what to serve with ${dish.name}`,
      "recipeCategory": dish.cuisine_type || "Main Dish",
      "recipeCuisine": dish.cuisine_type,
      "recipeIngredient": pairings.slice(0, 5).map(p => p.side_dish.name)
    },
    "about": {
      "@type": "Thing",
      "name": dish.name,
      "description": `Side dishes and pairings for ${dish.name}`
    }
  };

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={keywords}
        canonicalUrl={canonicalUrl}
        ogType="article"
        structuredData={structuredData}
      />
      <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        {dish.cuisine_type && (
          <>
            <span className="mx-2">&gt;</span>
            <Link to={`/cuisine/${dish.cuisine_type.toLowerCase()}`} className="hover:text-foreground">
              {dish.cuisine_type}
            </Link>
          </>
        )}
        <span className="mx-2">&gt;</span>
        <span className="text-foreground">{dish.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          What to Serve with {dish.name}
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          {dish.description || `Discover the perfect side dishes that complement ${dish.name}. Our expert-curated pairings will enhance your dining experience.`}
        </p>
        <div className="flex flex-wrap gap-3">
          {dish.cuisine_type && (
            <Badge variant="secondary" className="text-sm">
              <ChefHat className="h-3 w-3 mr-1" />
              {dish.cuisine_type}
            </Badge>
          )}
          <Badge variant="outline" className="text-sm">
            {pairings.length} Pairing{pairings.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Quick Summary */}
      {pairings.length > 0 && (
        <div className="bg-muted/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3">Top 3 Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pairings.slice(0, 3).map((pairing, index) => (
              <div key={pairing.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{pairing.side_dish.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-current" />
                    <span className={getMatchScoreColor(pairing.match_score)}>
                      {pairing.match_score}% {getMatchScoreLabel(pairing.match_score)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-8" />

      {/* All Pairings */}
      <section>
        <h2 className="text-3xl font-bold mb-6">
          All Side Dishes for {dish.name} ({pairings.length})
        </h2>
        
        {pairings.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground mb-4">
              We don't have pairing suggestions for this dish yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Check back soon as we're constantly adding new pairings!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pairings.map((pairing) => (
              <Card key={pairing.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">
                      {pairing.side_dish.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-current" />
                      <span className={`font-semibold ${getMatchScoreColor(pairing.match_score)}`}>
                        {pairing.match_score}
                      </span>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-3">
                    {pairing.pairing_reason || pairing.side_dish.description || 
                     `${pairing.side_dish.name} pairs beautifully with ${dish.name}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={pairing.match_score >= 80 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {getMatchScoreLabel(pairing.match_score)} Match
                      </Badge>
                      {pairing.side_dish.cuisine_type && (
                        <Badge variant="outline" className="text-xs">
                          {pairing.side_dish.cuisine_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* FAQ Section for SEO */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              What are the best side dishes for {dish.name}?
            </h3>
            <p className="text-muted-foreground">
              The best side dishes for {dish.name} are {pairings.slice(0, 3).map(p => p.side_dish.name).join(', ')}. 
              These pairings complement the flavors and textures of {dish.name} perfectly.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">
              How do you choose side dishes for {dish.name}?
            </h3>
            <p className="text-muted-foreground">
              We select side dishes based on flavor harmony, texture contrast, and cultural authenticity. 
              Each pairing is scored based on how well it complements the main dish.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Can I serve multiple side dishes with {dish.name}?
            </h3>
            <p className="text-muted-foreground">
              Absolutely! Many of our suggested pairings work well together. Consider combining 2-3 
              complementary sides for a complete meal experience.
            </p>
          </div>
        </div>
      </section>

      {/* Related Dishes */}
      {dish.cuisine_type && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-6">More {dish.cuisine_type} Dishes</h2>
          <div className="bg-muted/20 rounded-lg p-6">
            <p className="text-muted-foreground mb-4">
              Explore more dishes from {dish.cuisine_type} cuisine:
            </p>
            <Link 
              to={`/cuisine/${dish.cuisine_type.toLowerCase()}`}
              className="text-primary hover:underline font-medium"
            >
              Browse all {dish.cuisine_type} dishes →
            </Link>
          </div>
        </section>
      )}
      </div>
    </>
  );
}