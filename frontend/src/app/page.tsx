import { Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import PopularDishes from '@/components/PopularDishes';
import FeaturedRecipes from '@/components/FeaturedRecipes';
import CategoryGrid from '@/components/CategoryGrid';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Find the Perfect Side Dish for Any Meal
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover delicious pairings, side dishes, and recipes that complement your favorite meals perfectly.
            </p>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Popular Dishes
          </h2>
          <Suspense fallback={<div>Loading popular dishes...</div>}>
            <PopularDishes />
          </Suspense>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Browse by Category
          </h2>
          <Suspense fallback={<div>Loading categories...</div>}>
            <CategoryGrid />
          </Suspense>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Recipes
          </h2>
          <Suspense fallback={<div>Loading featured recipes...</div>}>
            <FeaturedRecipes />
          </Suspense>
        </div>
      </section>
    </div>
  );
}