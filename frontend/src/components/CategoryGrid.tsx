import Link from 'next/link';
import pairDishAPI from '@/lib/api';

const categoryColors: Record<string, string> = {
  'main-course': 'bg-blue-100 text-blue-800',
  'appetizer': 'bg-green-100 text-green-800',
  'dessert': 'bg-pink-100 text-pink-800',
  'beverage': 'bg-purple-100 text-purple-800',
  'side-dish': 'bg-yellow-100 text-yellow-800',
  'sauce': 'bg-red-100 text-red-800',
};

export default async function CategoryGrid() {
  const categories = await pairDishAPI.getCategories();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
      {categories.map((category) => {
        const colorClasses = categoryColors[category.toLowerCase().replace(' ', '-')] || 'bg-gray-100 text-gray-800';
        
        return (
          <Link
            key={category}
            href={`/search?category=${encodeURIComponent(category)}`}
            className={`rounded-lg p-4 sm:p-6 text-center font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 touch-manipulation ${colorClasses}`}
          >
            <span className="text-sm sm:text-base">{category}</span>
          </Link>
        );
      })}
    </div>
  );
}