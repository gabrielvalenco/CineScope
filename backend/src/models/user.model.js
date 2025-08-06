const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  /**
   * Create a new user
   * @param {Object} userData - User data (username, email, password)
   * @returns {Promise<Object>} - New user data
   */
  static async create(userData) {
    const { username, email, password } = userData;
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
    `;
    
    try {
      const result = await db.query(query, [username, email, hashedPassword]);
      return result.rows[0];
    } catch (error) {
      // Handle unique constraint violations
      if (error.code === '23505') { // PostgreSQL unique violation
        if (error.constraint === 'users_email_key') {
          throw new Error('Email already in use');
        }
        if (error.constraint === 'users_username_key') {
          throw new Error('Username already taken');
        }
      }
      throw error;
    }
  }
  
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} - User data or null if not found
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  }
  
  /**
   * Find user by id
   * @param {number} id - User id
   * @returns {Promise<Object|null>} - User data or null if not found
   */
  static async findById(id) {
    const query = 'SELECT id, username, email, profile_image, created_at FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }
  
  /**
   * Verify password
   * @param {string} password - Plain password to verify
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>} - True if password matches
   */
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
  
  /**
   * Update user profile
   * @param {number} id - User id
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated user data
   */
  static async update(id, updateData) {
    const allowedFields = ['username', 'profile_image'];
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
    
    // Add id to values array
    values.push(id);
    
    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING id, username, email, profile_image, updated_at
    `;
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
}

module.exports = User;
