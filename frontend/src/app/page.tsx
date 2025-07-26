import { Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import PopularDishes from '@/components/PopularDishes';
import FeaturedRecipes from '@/components/FeaturedRecipes';
import CategoryGrid from '@/components/CategoryGrid';
import DishGridSkeleton from '@/components/skeletons/DishGridSkeleton';
import RecipeGridSkeleton from '@/components/skeletons/RecipeGridSkeleton';
import CategorySkeleton from '@/components/skeletons/CategorySkeleton';
import ErrorBoundary from '@/components/ErrorBoundary';
import { DishGridErrorFallback, RecipeGridErrorFallback, CategoryGridErrorFallback } from '@/components/ErrorFallback';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-12 md:py-16">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              Find the Perfect Side Dish for Any Meal
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
              Discover delicious pairings, side dishes, and recipes that complement your favorite meals perfectly.
            </p>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center sm:text-left">
            Popular Dishes
          </h2>
          <ErrorBoundary fallback={<DishGridErrorFallback />}>
            <Suspense fallback={<DishGridSkeleton count={8} />}>
              <PopularDishes />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center sm:text-left">
            Browse by Category
          </h2>
          <Suspense fallback={<div className="text-center text-gray-500 py-8">Loading categories...</div>}>
            <CategoryGrid />
          </Suspense>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center sm:text-left">
            Featured Recipes
          </h2>
          <Suspense fallback={<div className="text-center text-gray-500 py-8">Loading featured recipes...</div>}>
            <FeaturedRecipes />
          </Suspense>
        </div>
      </section>
    </div>
  );
}