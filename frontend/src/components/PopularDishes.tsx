import Link from 'next/link';
import DishCard from './DishCard';
import { Dish } from '@/types';

export default async function PopularDishes() {
  let dishes: Dish[] = [];
  
  try {
    // Use fetch directly with the same origin for better reliability
    const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof globalThis !== 'undefined' && globalThis.location ? globalThis.location.origin : 'https://pairdish.mabdulrahim.workers.dev');
    const response = await fetch(`${API_URL}/dishes/popular?limit=8`, {
      cache: 'no-store', // Always get fresh data
    });
    
    if (!response.ok) {
      console.error('Failed to fetch popular dishes:', response.status, response.statusText);
      // Fallback to regular dishes endpoint
      const fallbackResponse = await fetch(`${API_URL}/api/dishes?limit=8`, {
        cache: 'no-store',
      });
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        dishes = fallbackData.dishes || fallbackData || [];
      }
    } else {
      dishes = await response.json();
    }
  } catch (error) {
    console.error('Error fetching popular dishes:', error);
    // Return empty array if all fails - component will render empty grid
    dishes = [];
  }

  // Don't render anything if no dishes to avoid empty section
  if (!dishes || dishes.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dishes.map((dish) => (
        <Link
          key={dish.id}
          href={`/what-to-serve-with-${dish.slug}`}
          className="block"
        >
          <DishCard dish={dish} />
        </Link>
      ))}
    </div>
  );
}