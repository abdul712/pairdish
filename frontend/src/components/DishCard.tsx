import { Dish } from '@/types';
import { truncateText } from '@/lib/utils';

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  return (
    <div className="card h-full transition-transform hover:scale-105">
      {dish.imageUrl && (
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{dish.name}</h3>
        {dish.description && (
          <p className="text-gray-600 text-sm mb-2">
            {truncateText(dish.description, 100)}
          </p>
        )}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500 uppercase">{dish.category}</span>
          <span className="text-xs text-primary-600">
            {dish.pairings?.length || 0} pairings
          </span>
        </div>
      </div>
    </div>
  );
}