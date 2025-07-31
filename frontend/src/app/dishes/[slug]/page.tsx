import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import pairDishAPI from '@/lib/api';
import { generateMetadata as generateSEOMetadata, generateDishMetadata } from '@/lib/seo';
import DishHeader from '@/components/DishHeader';
import RelatedDishes from '@/components/RelatedDishes';

interface DishPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: DishPageProps): Promise<Metadata> {
  try {
    const dish = await pairDishAPI.getDish(params.slug);
    const seoMetadata = generateDishMetadata(dish.name, dish.description);
    
    return generateSEOMetadata({
      ...seoMetadata,
      openGraph: {
        ...seoMetadata.openGraph,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/dishes/${params.slug}`,
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

export default async function DishPage({ params }: DishPageProps) {
  let dish;

  try {
    dish = await pairDishAPI.getDish(params.slug);
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
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">About {dish.name}</h2>
            {dish.description && (
              <p className="text-gray-700 mb-6">{dish.description}</p>
            )}
            
            <Link
              href={`/dishes/${dish.slug}/pairings`}
              className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              View Pairing Suggestions
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
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
                {dish.dietaryTags && dish.dietaryTags.length > 0 && (
                  <div>
                    <dt className="text-sm text-gray-600">Dietary Tags</dt>
                    <dd className="flex flex-wrap gap-1 mt-1">
                      {dish.dietaryTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
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