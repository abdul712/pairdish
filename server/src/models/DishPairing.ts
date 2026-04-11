import pool from '../config/database';
import { DishPairing } from '@shared/types';

export class DishPairingModel {
  static async findByMainDishSlug(dishSlug: string): Promise<DishPairing[]> {
    const query = `
      SELECT 
        dp.*,
        sd.id as side_dish_id,
        sd.name as side_dish_name,
        sd.slug as side_dish_slug,
        sd.description as side_dish_description,
        sd.cuisine_type as side_dish_cuisine_type,
        sd.image_url as side_dish_image_url,
        sd.created_at as side_dish_created_at
      FROM dish_pairings dp
      INNER JOIN main_dishes md ON dp.main_dish_id = md.id
      INNER JOIN side_dishes sd ON dp.side_dish_id = sd.id
      WHERE md.slug = $1
      ORDER BY dp.display_order ASC, dp.match_score DESC
    `;
    
    const result = await pool.query(query, [dishSlug]);
    
    // Transform the flat result into the nested structure
    return result.rows.map(row => ({
      id: row.id,
      main_dish_id: row.main_dish_id,
      side_dish_id: row.side_dish_id,
      pairing_reason: row.pairing_reason,
      match_score: row.match_score,
      display_order: row.display_order,
      side_dish: {
        id: row.side_dish_id,
        name: row.side_dish_name,
        slug: row.side_dish_slug,
        description: row.side_dish_description,
        cuisine_type: row.side_dish_cuisine_type,
        image_url: row.side_dish_image_url,
        created_at: row.side_dish_created_at
      }
    }));
  }

  static async create(pairingData: Omit<DishPairing, 'id' | 'side_dish'>): Promise<DishPairing> {
    const query = `
      INSERT INTO dish_pairings (main_dish_id, side_dish_id, pairing_reason, match_score, display_order)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [
      pairingData.main_dish_id,
      pairingData.side_dish_id,
      pairingData.pairing_reason,
      pairingData.match_score,
      pairingData.display_order
    ];
    
    const result = await pool.query(query, values);
    
    // Get the side dish information
    const sideDishQuery = 'SELECT * FROM side_dishes WHERE id = $1';
    const sideDishResult = await pool.query(sideDishQuery, [pairingData.side_dish_id]);
    
    return {
      ...result.rows[0],
      side_dish: sideDishResult.rows[0]
    };
  }

  static async findByMainDishId(mainDishId: number): Promise<DishPairing[]> {
    const query = `
      SELECT 
        dp.*,
        sd.*
      FROM dish_pairings dp
      INNER JOIN side_dishes sd ON dp.side_dish_id = sd.id
      WHERE dp.main_dish_id = $1
      ORDER BY dp.display_order ASC, dp.match_score DESC
    `;
    
    const result = await pool.query(query, [mainDishId]);
    
    return result.rows.map(row => ({
      id: row.id,
      main_dish_id: row.main_dish_id,
      side_dish_id: row.side_dish_id,
      pairing_reason: row.pairing_reason,
      match_score: row.match_score,
      display_order: row.display_order,
      side_dish: {
        id: row.side_dish_id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        cuisine_type: row.cuisine_type,
        image_url: row.image_url,
        created_at: row.created_at
      }
    }));
  }
}