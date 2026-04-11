import pool from '../config/database';
import { MainDish } from '@shared/types';

export class MainDishModel {
  static async findAll(page = 1, limit = 20): Promise<{ dishes: MainDish[], total: number }> {
    const offset = (page - 1) * limit;
    
    const countQuery = 'SELECT COUNT(*) FROM main_dishes';
    const dishesQuery = `
      SELECT * FROM main_dishes
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const [countResult, dishesResult] = await Promise.all([
      pool.query(countQuery),
      pool.query(dishesQuery, [limit, offset])
    ]);
    
    return {
      dishes: dishesResult.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  static async findBySlug(slug: string): Promise<MainDish | null> {
    const query = `
      SELECT * FROM main_dishes
      WHERE slug = $1
    `;
    
    const result = await pool.query(query, [slug]);
    return result.rows[0] || null;
  }

  static async findPopular(limit = 12): Promise<MainDish[]> {
    const query = `
      SELECT md.* FROM main_dishes md
      LEFT JOIN popular_dishes pd ON md.id = pd.dish_id
      ORDER BY COALESCE(pd.view_count, 0) DESC, md.created_at DESC
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  static async search(searchTerm: string, page = 1, limit = 20): Promise<{ dishes: MainDish[], total: number }> {
    const offset = (page - 1) * limit;
    const searchPattern = `%${searchTerm.toLowerCase()}%`;
    
    const countQuery = `
      SELECT COUNT(*) FROM main_dishes
      WHERE LOWER(name) LIKE $1 
         OR LOWER(description) LIKE $1 
         OR LOWER(cuisine_type) LIKE $1
    `;
    
    const dishesQuery = `
      SELECT * FROM main_dishes
      WHERE LOWER(name) LIKE $1 
         OR LOWER(description) LIKE $1 
         OR LOWER(cuisine_type) LIKE $1
      ORDER BY 
        CASE 
          WHEN LOWER(name) LIKE $1 THEN 1
          WHEN LOWER(description) LIKE $1 THEN 2
          ELSE 3
        END,
        created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const [countResult, dishesResult] = await Promise.all([
      pool.query(countQuery, [searchPattern]),
      pool.query(dishesQuery, [searchPattern, limit, offset])
    ]);
    
    return {
      dishes: dishesResult.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  static async create(dishData: Omit<MainDish, 'id' | 'created_at' | 'updated_at'>): Promise<MainDish> {
    const query = `
      INSERT INTO main_dishes (name, slug, description, cuisine_type, seo_title, meta_description, featured_image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      dishData.name,
      dishData.slug,
      dishData.description,
      dishData.cuisine_type,
      dishData.seo_title,
      dishData.meta_description,
      dishData.featured_image
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async incrementViewCount(dishId: number): Promise<void> {
    const query = `
      INSERT INTO popular_dishes (dish_id, view_count)
      VALUES ($1, 1)
      ON CONFLICT (dish_id)
      DO UPDATE SET view_count = popular_dishes.view_count + 1
    `;
    
    await pool.query(query, [dishId]);
  }
}