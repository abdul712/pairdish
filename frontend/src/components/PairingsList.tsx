import Link from 'next/link';
import { Pairing } from '@/types';
import { capitalizeFirst } from '@/lib/utils';

interface PairingsListProps {
  pairings: Pairing[];
}

export default function PairingsList({ pairings }: PairingsListProps) {
  const groupedPairings = pairings.reduce((acc, pairing) => {
    const type = pairing.pairingType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(pairing);
    return acc;
  }, {} as Record<string, Pairing[]>);

  const pairingTypeOrder = ['side', 'sauce', 'beverage', 'dessert'];
  const sortedTypes = Object.keys(groupedPairings).sort(
    (a, b) => pairingTypeOrder.indexOf(a) - pairingTypeOrder.indexOf(b)
  );

  return (
    <div className="space-y-8">
      {sortedTypes.map((type) => (
        <div key={type}>
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            {capitalizeFirst(type)}s
          </h3>
          <div className="grid gap-4">
            {groupedPairings[type].map((pairing) => (
              <div key={pairing.id} className="card p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">
                      {pairing.pairingDish}
                    </h4>
                    {pairing.description && (
                      <p className="text-gray-600 mb-3">{pairing.description}</p>
                    )}
                    {pairing.recipe && (
                      <Link
                        href={`/recipe/${pairing.recipe.slug}`}
                        className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                      >
                        View Recipe
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                  {pairing.popularity && (
                    <div className="ml-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {pairing.popularity}% popular
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}