import RecipeCardSkeleton from './RecipeCardSkeleton';

interface RecipeGridSkeletonProps {
  count?: number;
}

export default function RecipeGridSkeleton({ count = 6 }: RecipeGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  );
}