'use client';

import { Recipe } from '@/types';
import { formatCookingTime } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';

interface RecipeHeaderProps {
  recipe: Recipe;
}

export default function RecipeHeader({ recipe }: RecipeHeaderProps) {
  const [imageError, setImageError] = useState(false);
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <nav className="text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-primary-600">Home</a>
              <span className="mx-2">/</span>
              <a href="/recipes" className="hover:text-primary-600">Recipes</a>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{recipe.title}</span>
            </nav>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {recipe.prepTime && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Prep: {formatCookingTime(recipe.prepTime)}</span>
                </div>
              )}
              {recipe.cookTime && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Cook: {formatCookingTime(recipe.cookTime)}</span>
                </div>
              )}
              {totalTime > 0 && (
                <div className="flex items-center font-medium">
                  <span>Total: {formatCookingTime(totalTime)}</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Servings: {recipe.servings}</span>
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex items-center">
                  <span className="capitalize px-2 py-1 bg-gray-200 rounded">
                    {recipe.difficulty}
                  </span>
                </div>
              )}
            </div>
          </div>
          {recipe.imageUrl && (
            <div className="rounded-lg overflow-hidden shadow-lg">
              {!imageError ? (
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
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