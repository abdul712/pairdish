'use client';

import { useRouter } from 'next/navigation';
import pairDishAPI from '@/lib/api';
import { useEffect, useState } from 'react';

interface SearchFiltersProps {
  currentCategory?: string;
  currentCuisine?: string;
}

export default function SearchFilters({ currentCategory, currentCuisine }: SearchFiltersProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    pairDishAPI.getCategories().then(setCategories);
  }, []);

  const cuisines = [
    'American',
    'Italian',
    'Mexican',
    'Chinese',
    'Japanese',
    'Indian',
    'Thai',
    'French',
    'Mediterranean',
    'Greek',
  ];

  const handleFilterChange = (type: 'category' | 'cuisine', value: string) => {
    const params = new URLSearchParams(window.location.search);
    
    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="card p-6">
        <h3 className="font-semibold mb-4">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value=""
              checked={!currentCategory}
              onChange={() => handleFilterChange('category', '')}
              className="mr-2"
            />
            <span className="text-sm">All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category}
                checked={currentCategory === category}
                onChange={() => handleFilterChange('category', category)}
                className="mr-2"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cuisine Filter */}
      <div className="card p-6">
        <h3 className="font-semibold mb-4">Cuisine</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="cuisine"
              value=""
              checked={!currentCuisine}
              onChange={() => handleFilterChange('cuisine', '')}
              className="mr-2"
            />
            <span className="text-sm">All Cuisines</span>
          </label>
          {cuisines.map((cuisine) => (
            <label key={cuisine} className="flex items-center">
              <input
                type="radio"
                name="cuisine"
                value={cuisine}
                checked={currentCuisine === cuisine}
                onChange={() => handleFilterChange('cuisine', cuisine)}
                className="mr-2"
              />
              <span className="text-sm">{cuisine}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}