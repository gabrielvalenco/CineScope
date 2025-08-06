const db = require('../config/database');

class Movie {
  /**
   * Create a new movie entry
   * @param {Object} movieData - Movie data
   * @returns {Promise<Object>} - New movie data
   */
  static async create(movieData) {
    const { 
      user_id, 
      tmdb_id, 
      title, 
      poster_path, 
      release_date, 
      rating, 
      comment, 
      watch_date 
    } = movieData;
    
    const query = `
      INSERT INTO movies (
        user_id, tmdb_id, title, poster_path, 
        release_date, rating, comment, watch_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      user_id, 
      tmdb_id, 
      title, 
      poster_path, 
      release_date, 
      rating, 
      comment, 
      watch_date
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  /**
   * Get all movies by user
   * @param {number} userId - User ID
   * @param {Object} filters - Optional filters (rating, search term, etc.)
   * @returns {Promise<Array>} - List of movies
   */
  static async findByUser(userId, filters = {}) {
    let query = `
      SELECT m.*, 
             array_agg(t.name) FILTER (WHERE t.name IS NOT NULL) as tags
      FROM movies m
      LEFT JOIN movie_tags mt ON m.id = mt.movie_id
      LEFT JOIN tags t ON mt.tag_id = t.id
      WHERE m.user_id = $1
    `;
    
    const queryParams = [userId];
    let paramCounter = 2;
    
    // Add filters if provided
    if (filters.rating) {
      query += ` AND m.rating = $${paramCounter}`;
      queryParams.push(filters.rating);
      paramCounter++;
    }
    
    if (filters.search) {
      query += ` AND (m.title ILIKE $${paramCounter} OR m.comment ILIKE $${paramCounter})`;
      queryParams.push(`%${filters.search}%`);
      paramCounter++;
    }
    
    // Group by movie ID
    query += ` GROUP BY m.id`;
    
    // Add ordering
    const orderBy = filters.orderBy || 'watch_date';
    const order = filters.order === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY m.${orderBy} ${order}`;
    
    const result = await db.query(query, queryParams);
    return result.rows;
  }
  
  /**
   * Get movie by ID
   * @param {number} id - Movie ID
   * @param {number} userId - User ID (for authorization)
   * @returns {Promise<Object|null>} - Movie data or null if not found
   */
  static async findById(id, userId) {
    const query = `
      SELECT m.*, 
             array_agg(t.name) FILTER (WHERE t.name IS NOT NULL) as tags
      FROM movies m
      LEFT JOIN movie_tags mt ON m.id = mt.movie_id
      LEFT JOIN tags t ON mt.tag_id = t.id
      WHERE m.id = $1 AND m.user_id = $2
      GROUP BY m.id
    `;
    
    const result = await db.query(query, [id, userId]);
    return result.rows[0] || null;
  }
  
  /**
   * Update movie
   * @param {number} id - Movie ID
   * @param {number} userId - User ID (for authorization)
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} - Updated movie data or null if not found
   */
  static async update(id, userId, updateData) {
    const allowedFields = [
      'title', 'poster_path', 'release_date',
      'rating', 'comment', 'watch_date', 'tmdb_id'
    ];
    
    const updates = [];
    const values = [];
    let paramCounter = 1;
    
    // Build dynamic SET clause
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updates.push(`${key} = $${paramCounter}`);
        values.push(updateData[key]);
        paramCounter++;
      }
    });
    
    // Add updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Add id and userId to values array
    values.push(id);
    values.push(userId);
    
    const query = `
      UPDATE movies
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter} AND user_id = $${paramCounter + 1}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  }
  
  /**
   * Delete movie
   * @param {number} id - Movie ID
   * @param {number} userId - User ID (for authorization)
   * @returns {Promise<boolean>} - True if deleted, false if not found
   */
  static async delete(id, userId) {
    const query = `
      DELETE FROM movies
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;
    
    const result = await db.query(query, [id, userId]);
    return result.rowCount > 0;
  }
  
  /**
   * Add tag to movie
   * @param {number} movieId - Movie ID
   * @param {string} tagName - Tag name
   * @returns {Promise<Object>} - Tag data
   */
  static async addTag(movieId, tagName) {
    // Start a transaction
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if tag exists or create it
      let tagQuery = `
        SELECT id FROM tags WHERE name = $1
      `;
      
      let tagResult = await client.query(tagQuery, [tagName]);
      
      let tagId;
      if (tagResult.rowCount === 0) {
        // Create new tag
        const insertTagQuery = `
          INSERT INTO tags (name)
          VALUES ($1)
          RETURNING id
        `;
        
        tagResult = await client.query(insertTagQuery, [tagName]);
      }
      
      tagId = tagResult.rows[0].id;
      
      // Add tag to movie
      const addTagQuery = `
        INSERT INTO movie_tags (movie_id, tag_id)
        VALUES ($1, $2)
        ON CONFLICT (movie_id, tag_id) DO NOTHING
        RETURNING *
      `;
      
      await client.query(addTagQuery, [movieId, tagId]);
      
      // Commit transaction
      await client.query('COMMIT');
      
      return { movieId, tagId, tagName };
    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // Release client
      client.release();
    }
  }
  
  /**
   * Remove tag from movie
   * @param {number} movieId - Movie ID
   * @param {number} tagId - Tag ID
   * @returns {Promise<boolean>} - True if removed, false if not found
   */
  static async removeTag(movieId, tagId) {
    const query = `
      DELETE FROM movie_tags
      WHERE movie_id = $1 AND tag_id = $2
      RETURNING movie_id
    `;
    
    const result = await db.query(query, [movieId, tagId]);
    return result.rowCount > 0;
  }
  
  /**
   * Get movie statistics by user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - Statistics
   */
  static async getStats(userId) {
    const query = `
      SELECT 
        COUNT(*) as total_movies,
        AVG(rating) as average_rating,
        COUNT(DISTINCT DATE_TRUNC('month', watch_date)) as months_active
      FROM movies
      WHERE user_id = $1
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = Movie;
