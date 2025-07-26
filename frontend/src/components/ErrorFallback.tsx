interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function ErrorFallback({ 
  message = "Failed to load content", 
  onRetry,
  showRetry = true 
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="text-center max-w-sm">
        <svg
          className="mx-auto h-8 w-8 text-gray-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-600 mb-4">{message}</p>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="btn-secondary px-4 py-2 text-sm"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export function DishGridErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="col-span-full">
        <ErrorFallback 
          message="Unable to load dishes. Please try again."
          onRetry={onRetry}
        />
      </div>
    </div>
  );
}

export function RecipeGridErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="col-span-full">
        <ErrorFallback 
          message="Unable to load recipes. Please try again."
          onRetry={onRetry}
        />
      </div>
    </div>
  );
}

export function CategoryGridErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorFallback 
      message="Unable to load categories. Please try again."
      onRetry={onRetry}
    />
  );
}