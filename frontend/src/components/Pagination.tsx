import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    return `${baseUrl}&page=${page}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // First page
    if (start > 1) {
      pages.push(
        <Link
          key={1}
          href={getPageUrl(1)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          1
        </Link>
      );
      if (start > 2) {
        pages.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = start; i <= end; i++) {
      pages.push(
        <Link
          key={i}
          href={getPageUrl(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            i === currentPage
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </Link>
      );
    }

    // Last page
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>
        );
      }
      pages.push(
        <Link
          key={totalPages}
          href={getPageUrl(totalPages)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {totalPages}
        </Link>
      );
    }

    return pages;
  };

  return (
    <nav className="flex justify-center mt-8">
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        {currentPage > 1 && (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Previous
          </Link>
        )}

        {/* Page numbers */}
        {renderPageNumbers()}

        {/* Next button */}
        {currentPage < totalPages && (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Next
          </Link>
        )}
      </div>
    </nav>
  );
}