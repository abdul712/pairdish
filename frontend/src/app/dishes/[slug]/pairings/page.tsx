import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import pairDishAPI from '@/lib/api';
import { generateMetadata as generateSEOMetadata, generateDishMetadata } from '@/lib/seo';
import DishHeader from '@/components/DishHeader';
import PairingsList from '@/components/PairingsList';
import RelatedDishes from '@/components/RelatedDishes';

interface DishPairingsPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: DishPairingsPageProps): Promise<Metadata> {
  try {
    const dish = await pairDishAPI.getDish(params.slug);
    const seoMetadata = generateDishMetadata(dish.name, dish.description);
    
    return generateSEOMetadata({
      ...seoMetadata,
      openGraph: {
        ...seoMetadata.openGraph,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/dishes/${params.slug}/pairings`,
        image: dish.imageUrl,
      },
    });
  } catch (error) {
    return generateSEOMetadata({
      title: 'Dish Not Found | PairDish',
      description: 'The dish you are looking for could not be found.',
    });
  }
}

export default async function DishPairingsPage({ params }: DishPairingsPageProps) {
  let dish;
  let pairings;

  try {
    [dish, pairings] = await Promise.all([
      pairDishAPI.getDish(params.slug),
      pairDishAPI.getDishPairings(params.slug),
    ]);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Dish Header */}
      <DishHeader dish={dish} />

      {/* Main Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Pairings List - Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">
              What to Serve with {dish.name}
            </h2>
            <PairingsList pairings={pairings} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Quick Info */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-600">Category</dt>
                  <dd className="font-medium">{dish.category}</dd>
                </div>
                {dish.cuisine && (
                  <div>
                    <dt className="text-sm text-gray-600">Cuisine</dt>
                    <dd className="font-medium">{dish.cuisine}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-gray-600">Total Pairings</dt>
                  <dd className="font-medium">{pairings.length}</dd>
                </div>
              </dl>
            </div>

            {/* Related Dishes */}
            <RelatedDishes currentDish={dish} />
          </aside>
        </div>
      </div>
    </div>
  );
}