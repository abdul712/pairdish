import Link from 'next/link';
import pairDishAPI from '@/lib/api';
import DishCard from './DishCard';

export default async function PopularDishes() {
  const dishes = await pairDishAPI.getPopularDishes(8);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dishes.map((dish) => (
        <Link
          key={dish.id}
          href={`/what-to-serve-with/${dish.slug}`}
          className="block"
        >
          <DishCard dish={dish} />
        </Link>
      ))}
    </div>
  );
}