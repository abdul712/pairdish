import { Dish } from '@/types';

interface DishHeaderProps {
  dish: Dish;
}

export default function DishHeader({ dish }: DishHeaderProps) {
  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <nav className="text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-primary-600">Home</a>
              <span className="mx-2">/</span>
              <a href={`/search?category=${encodeURIComponent(dish.category)}`} className="hover:text-primary-600">
                {dish.category}
              </a>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{dish.name}</span>
            </nav>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{dish.name}</h1>
            {dish.description && (
              <p className="text-lg text-gray-700">{dish.description}</p>
            )}
            {dish.cuisine && (
              <p className="mt-4 text-sm text-gray-600">
                <span className="font-medium">Cuisine:</span> {dish.cuisine}
              </p>
            )}
          </div>
          {dish.imageUrl && (
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}