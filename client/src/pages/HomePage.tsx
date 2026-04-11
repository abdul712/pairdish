import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, TrendingUp, Star, Heart, Clock, ChefHat, Sparkles } from 'lucide-react';
import { apiService } from '@/services/api';
import { ImageService } from '@/services/imageService';
import type { MainDish } from '@/types';
import { SEOHead } from '@/components/SEOHead';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [popularDishes, setPopularDishes] = useState<MainDish[]>([]);
  const [dishImages, setDishImages] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadPopularDishes();
    setHeroImage(ImageService.getHeroBackground());
  }, []);

  const loadPopularDishes = async () => {
    try {
      const response = await apiService.getPopularDishes(8);
      if (response.success && response.data) {
        setPopularDishes(response.data);
        
        // Load images for each dish with enhanced loading
        const imagePromises = response.data.map(async (dish) => {
          const imageUrl = await ImageService.getFoodImage(dish.name, 400, 300);
          return { [dish.id]: imageUrl };
        });
        
        const images = await Promise.all(imagePromises);
        const imageMap = Object.assign({}, ...images);
        setDishImages(imageMap);
      }
    } catch (error) {
      console.error('Failed to load popular dishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const featuredCuisines = [
    { name: 'Indian', slug: 'indian', color: 'from-orange-500 to-red-600', emoji: '🍛', count: 45 },
    { name: 'Italian', slug: 'italian', color: 'from-green-500 to-emerald-600', emoji: '🍝', count: 38 },
    { name: 'Mexican', slug: 'mexican', color: 'from-red-500 to-pink-600', emoji: '🌮', count: 32 },
    { name: 'American', slug: 'american', color: 'from-blue-500 to-indigo-600', emoji: '🍔', count: 41 },
    { name: 'Chinese', slug: 'chinese', color: 'from-yellow-500 to-orange-600', emoji: '🥢', count: 29 },
    { name: 'Thai', slug: 'thai', color: 'from-purple-500 to-pink-600', emoji: '🍜', count: 25 },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PairDish",
    "description": "Find perfect food pairings and side dish suggestions for thousands of main dishes",
    "url": "https://pairdish.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://pairdish.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PairDish",
      "url": "https://pairdish.com"
    }
  };

  return (
    <>
      <SEOHead
        title="PairDish - Find Perfect Food Pairings for Your Meals"
        description="Discover the perfect side dishes and food pairings for over 5,000 main dishes. Get expert pairing suggestions with match scores to enhance your culinary experience."
        keywords="food pairing, side dishes, meal planning, cooking tips, culinary pairings, dish combinations, recipe suggestions"
        canonicalUrl="https://pairdish.com"
        structuredData={structuredData}
      />

      {/* Enhanced Hero Section */}
      <section 
        className="relative min-h-[70vh] flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🍽️</div>
          <div className="absolute top-20 right-16 text-4xl opacity-30 animate-pulse">🥗</div>
          <div className="absolute bottom-20 left-16 text-4xl opacity-25 animate-bounce" style={{animationDelay: '1s'}}>🍝</div>
          <div className="absolute bottom-10 right-20 text-6xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}>🍷</div>
          <div className="absolute top-1/2 left-1/4 text-3xl opacity-15 animate-float">🌶️</div>
          <div className="absolute bottom-1/3 right-1/3 text-3xl opacity-20 animate-float" style={{animationDelay: '1.5s'}}>🧄</div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-8 animate-in">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <span className="text-white font-semibold">Trusted by 50,000+ food lovers</span>
            </div>

            {/* Hero Title */}
            <h1 className="hero-title mb-6">
              Discover Perfect
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                Food Pairings
              </span>
            </h1>

            <p className="hero-subtitle mb-12 max-w-2xl mx-auto">
              Transform every meal into a culinary masterpiece with expertly curated side dish suggestions 
              and perfect pairings for thousands of main dishes.
            </p>

            {/* Enhanced Search */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="What are you cooking today? (e.g., grilled salmon, chicken tikka, beef tacos)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input w-full"
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-0 shadow-lg rounded-full px-6"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Find Pairings
                </Button>
              </div>
            </form>

            {/* Quick Searches */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="text-white/80 text-sm">Popular searches:</span>
              {['🍛 chicken biryani', '🍝 pasta carbonara', '🥩 grilled steak', '🌮 fish tacos', '🍕 margherita'].map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const cleanExample = example.split(' ').slice(1).join(' ');
                    setSearchQuery(cleanExample);
                    navigate(`/search?q=${encodeURIComponent(cleanExample)}`);
                  }}
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200 rounded-full"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">

        {/* Enhanced Popular Dishes Section */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-12">
            <div className="section-header">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-gradient">Trending Dishes</h2>
                  <p className="text-muted-foreground text-lg">Most loved pairings this week</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-pink-500" />
              <span className="text-muted-foreground">50K+ favorites</span>
            </div>
          </div>

          <div className="dishes-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="food-card">
                  <div className="food-image">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : (
              popularDishes.map((dish, index) => (
                <Card key={dish.id} className="food-card group animate-in stagger-1" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="food-image">
                    <img
                      src={dishImages[dish.id] || dish.featured_image || '/images/dish-placeholder.svg'}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        ImageService.getFoodImage(dish.name, 400, 300).then(url => {
                          target.src = url;
                        });
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-medium">{(4.5 + Math.random() * 0.5).toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      <Link to={`/what-to-serve-with/${dish.slug}`} className="hover:text-primary transition-colors">
                        {dish.name}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                      {dish.description || `Discover perfect side dishes for ${dish.name}`}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {dish.cuisine_type && (
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            {dish.cuisine_type}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          5 min
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Heart className="h-4 w-4 text-pink-500" />
                        <span className="text-xs">{Math.floor(Math.random() * 1000) + 100}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Enhanced Cuisine Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gradient mb-4">Explore Global Cuisines</h2>
            <p className="text-muted-foreground text-lg">Discover authentic pairings from around the world</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredCuisines.map((cuisine, index) => (
              <Link
                key={cuisine.slug}
                to={`/cuisine/${cuisine.slug}`}
                className="cuisine-card group animate-in stagger-2"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <Card className="text-center h-full">
                  <CardContent className="p-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${cuisine.color} rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {cuisine.emoji}
                    </div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      {cuisine.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {cuisine.count}+ dishes
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gradient mb-4">Why Food Lovers Choose PairDish</h2>
              <p className="text-muted-foreground text-lg">Everything you need for perfect meal planning</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center animate-in stagger-3">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ChefHat className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Expert Curation</h3>
                <p className="text-muted-foreground">
                  Every pairing is carefully selected by culinary experts based on flavor profiles, textures, and traditional combinations.
                </p>
              </div>
              
              <div className="text-center animate-in stagger-3" style={{animationDelay: '0.2s'}}>
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Smart Matching</h3>
                <p className="text-muted-foreground">
                  Our AI-powered system analyzes thousands of dishes to suggest the most compatible side dishes for your meal.
                </p>
              </div>
              
              <div className="text-center animate-in stagger-3" style={{animationDelay: '0.4s'}}>
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Always Fresh</h3>
                <p className="text-muted-foreground">
                  Discover new combinations daily with our constantly updated database of global cuisines and trending dishes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-gradient mb-6">
              Ready to Elevate Your Cooking?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of home cooks who trust PairDish for perfect meal planning
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full px-8 py-6 text-lg"
              onClick={() => document.querySelector('input')?.focus()}
            >
              <Search className="h-5 w-5 mr-2" />
              Start Exploring
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
