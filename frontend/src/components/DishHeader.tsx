'use client';

import { Dish } from '@/types';
import { useState } from 'react';
import Image from 'next/image';

interface DishHeaderProps {
  dish: Dish;
}

export default function DishHeader({ dish }: DishHeaderProps) {
  const [imageError, setImageError] = useState(false);
  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <nav className="text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-primary-600">Home</a>
              <span className="mx-2">/</span>
              <a href={`/search?category=${encodeURIComponent(dish.category || dish.dish_type || 'main')}`} className="hover:text-primary-600">
                {dish.category || dish.dish_type}
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
              {!imageError ? (
                <Image
                  src={dish.imageUrl}
                  alt={dish.name}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                  priority={true}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyepckMjgHHrZUybcMeV"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-base">Image unavailable</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}