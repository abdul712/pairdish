import Link from 'next/link';
import { Dish } from '@/types';
import pairDishAPI from '@/lib/api';

interface RelatedDishesProps {
  currentDish: Dish;
}

export default async function RelatedDishes({ currentDish }: RelatedDishesProps) {
  const allDishes = await pairDishAPI.getAllDishes();
  
  // Filter dishes by same category or cuisine, excluding current dish
  const relatedDishes = allDishes
    .filter(dish => 
      dish.id !== currentDish.id && 
      (dish.category === currentDish.category || dish.cuisine === currentDish.cuisine)
    )
    .slice(0, 5);

  if (relatedDishes.length === 0) return null;

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Related Dishes</h3>
      <ul className="space-y-3">
        {relatedDishes.map((dish) => (
          <li key={dish.id}>
            <Link
              href={`/what-to-serve-with/${dish.slug}`}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {dish.name}
            </Link>
            <p className="text-sm text-gray-500">{dish.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}