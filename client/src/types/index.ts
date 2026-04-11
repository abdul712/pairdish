// Re-export shared types
export * from '../../../shared/types';

// Client-specific types
export interface SearchFilters {
  cuisine?: string;
  query?: string;
  page?: number;
  limit?: number;
}

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
}