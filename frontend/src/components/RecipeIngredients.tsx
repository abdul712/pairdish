'use client';

import { useState } from 'react';

interface RecipeIngredientsProps {
  ingredients: string[];
  servings?: number;
}

export default function RecipeIngredients({ ingredients, servings = 4 }: RecipeIngredientsProps) {
  const [multiplier, setMultiplier] = useState(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const adjustedServings = servings * multiplier;

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Ingredients</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMultiplier(Math.max(0.5, multiplier - 0.5))}
            className="btn-secondary px-2 py-1 text-sm"
          >
            -
          </button>
          <span className="text-sm font-medium px-3">
            {adjustedServings} servings
          </span>
          <button
            onClick={() => setMultiplier(multiplier + 0.5)}
            className="btn-secondary px-2 py-1 text-sm"
          >
            +
          </button>
        </div>
      </div>
      
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-start">
            <input
              type="checkbox"
              checked={checkedIngredients.has(index)}
              onChange={() => toggleIngredient(index)}
              className="mt-1 mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className={checkedIngredients.has(index) ? 'line-through text-gray-500' : ''}>
              {ingredient}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}