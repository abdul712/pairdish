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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => {
        const colorClasses = categoryColors[category.toLowerCase().replace(' ', '-')] || 'bg-gray-100 text-gray-800';
        
        return (
          <Link
            key={category}
            href={`/search?category=${encodeURIComponent(category)}`}
            className={`rounded-lg p-6 text-center font-medium transition-transform hover:scale-105 ${colorClasses}`}
          >
            {category}
          </Link>
        );
      })}
    </div>
  );
}