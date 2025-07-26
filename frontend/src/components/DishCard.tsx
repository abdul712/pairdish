import { Dish } from '@/types';
import { truncateText } from '@/lib/utils';

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  return (
    <div className="card h-full transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 touch-manipulation">
      {dish.imageUrl && (
        <div className="relative aspect-w-16 aspect-h-9 bg-gray-200 overflow-hidden">
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-full h-48 sm:h-52 object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      )}
      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-lg sm:text-xl mb-2 line-clamp-2">{dish.name}</h3>
        {dish.description && (
          <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2">
            {truncateText(dish.description, 100)}
          </p>
        )}
        <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
          <span className="text-xs sm:text-sm text-gray-500 uppercase font-medium bg-gray-50 px-2 py-1 rounded-full">
            {dish.category}
          </span>
          <span className="text-xs sm:text-sm text-primary-600 font-medium">
            {dish.pairings?.length || 0} pairings
          </span>
        </div>
      </div>
    </div>
  );
}