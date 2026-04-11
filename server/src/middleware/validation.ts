import { Request, Response, NextFunction } from 'express';

export const validateSearchQuery = (req: Request, res: Response, next: NextFunction) => {
  const { q } = req.query;
  
  if (!q || typeof q !== 'string' || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Search query must be at least 2 characters long'
    });
  }
  
  // Sanitize the search query
  req.query.q = q.trim().slice(0, 100); // Limit to 100 characters
  next();
};

export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query;
  
  // Set defaults and validate
  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 20;
  
  if (pageNum < 1) {
    return res.status(400).json({
      success: false,
      error: 'Page must be greater than 0'
    });
  }
  
  if (limitNum < 1 || limitNum > 100) {
    return res.status(400).json({
      success: false,
      error: 'Limit must be between 1 and 100'
    });
  }
  
  req.query.page = pageNum.toString();
  req.query.limit = limitNum.toString();
  next();
};

export const validateSlug = (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params;
  
  if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid slug parameter'
    });
  }
  
  // Basic slug validation (alphanumeric, hyphens, underscores)
  const slugRegex = /^[a-zA-Z0-9-_]+$/;
  if (!slugRegex.test(slug)) {
    return res.status(400).json({
      success: false,
      error: 'Slug contains invalid characters'
    });
  }
  
  next();
};