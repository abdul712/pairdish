'use client';

import { useState } from 'react';

interface RecipeInstructionsProps {
  instructions: string[];
}

export default function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-4">Instructions</h2>
      
      <ol className="space-y-4">
        {instructions.map((instruction, index) => (
          <li key={index} className="flex">
            <button
              onClick={() => toggleStep(index)}
              className={`flex-shrink-0 w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center font-medium text-sm transition-colors ${
                completedSteps.has(index)
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'border-gray-300 text-gray-600 hover:border-primary-400'
              }`}
            >
              {completedSteps.has(index) ? '✓' : index + 1}
            </button>
            <p className={`pt-1 ${completedSteps.has(index) ? 'text-gray-500 line-through' : ''}`}>
              {instruction}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}