import DishCardSkeleton from './DishCardSkeleton';

interface DishGridSkeletonProps {
  count?: number;
}

export default function DishGridSkeleton({ count = 8 }: DishGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <DishCardSkeleton key={index} />
      ))}
    </div>
  );
}