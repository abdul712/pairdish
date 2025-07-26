export default function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg p-4 sm:p-6 text-center bg-gray-200 animate-pulse"
        >
          <div className="h-4 bg-gray-300 rounded mx-auto w-3/4"></div>
        </div>
      ))}
    </div>
  );
}