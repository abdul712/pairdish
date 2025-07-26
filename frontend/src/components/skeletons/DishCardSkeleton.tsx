export default function DishCardSkeleton() {
  return (
    <div className="card h-full animate-pulse">
      <div className="w-full h-48 sm:h-52 bg-gray-200"></div>
      <div className="p-4 sm:p-5">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}