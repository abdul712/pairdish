'use client';

import { Recipe } from '@/types';
import { formatCookingTime, truncateText } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [imageError, setImageError] = useState(false);
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="card h-full transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 touch-manipulation">
      {recipe.imageUrl && (
        <div className="relative aspect-w-16 aspect-h-9 bg-gray-200 overflow-hidden">
          {!imageError ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              width={400}
              height={300}
              className="w-full h-48 sm:h-52 object-cover transition-transform duration-300 hover:scale-110"
              onError={() => setImageError(true)}
              priority={false}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyepckMjgHHrZUybcMeV"
            />
          ) : (
            <div className="w-full h-48 sm:h-52 bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Image unavailable</p>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-lg sm:text-xl mb-2 line-clamp-2">{recipe.title}</h3>
        {recipe.description && (
          <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
            {truncateText(recipe.description, 80)}
          </p>
        )}
        <div className="flex items-center justify-between text-sm sm:text-base text-gray-500 pt-2 border-t border-gray-100">
          {totalTime > 0 && (
            <span className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatCookingTime(totalTime)}
            </span>
          )}
          {recipe.difficulty && (
            <span className="capitalize font-medium text-primary-600">{recipe.difficulty}</span>
          )}
        </div>
      </div>
    </div>
  );
}