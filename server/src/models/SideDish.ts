import pool from '../config/database';
import { SideDish } from '@shared/types';

export class SideDishModel {
  static async findAll(page = 1, limit = 20): Promise<{ sideDishes: SideDish[], total: number }> {
    const offset = (page - 1) * limit;
    
    const countQuery = 'SELECT COUNT(*) FROM side_dishes';
    const dishesQuery = `
      SELECT * FROM side_dishes
      ORDER BY name ASC
      LIMIT $1 OFFSET $2
    `;
    
    const [countResult, dishesResult] = await Promise.all([
      pool.query(countQuery),
      pool.query(dishesQuery, [limit, offset])
    ]);
    
    return {
      sideDishes: dishesResult.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  static async findById(id: number): Promise<SideDish | null> {
    const query = 'SELECT * FROM side_dishes WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findBySlug(slug: string): Promise<SideDish | null> {
    const query = 'SELECT * FROM side_dishes WHERE slug = $1';
    const result = await pool.query(query, [slug]);
    return result.rows[0] || null;
  }

  static async create(dishData: Omit<SideDish, 'id' | 'created_at'>): Promise<SideDish> {
    const query = `
      INSERT INTO side_dishes (name, slug, description, cuisine_type, image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [
      dishData.name,
      dishData.slug,
      dishData.description,
      dishData.cuisine_type,
      dishData.image_url
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async search(searchTerm: string): Promise<SideDish[]> {
    const searchPattern = `%${searchTerm.toLowerCase()}%`;
    
    const query = `
      SELECT * FROM side_dishes
      WHERE LOWER(name) LIKE $1 
         OR LOWER(description) LIKE $1 
         OR LOWER(cuisine_type) LIKE $1
      ORDER BY 
        CASE 
          WHEN LOWER(name) LIKE $1 THEN 1
          WHEN LOWER(description) LIKE $1 THEN 2
          ELSE 3
        END,
        name ASC
      LIMIT 50
    `;
    
    const result = await pool.query(query, [searchPattern]);
    return result.rows;
  }
}