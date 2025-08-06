const Movie = require('../models/movie.model');

/**
 * Get all movies for current user
 */
exports.getMovies = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Parse query parameters
    const filters = {
      rating: req.query.rating ? parseInt(req.query.rating) : null,
      search: req.query.search || null,
      orderBy: req.query.orderBy || 'watch_date',
      order: req.query.order || 'desc'
    };
    
    // Remove null filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === null) {
        delete filters[key];
      }
    });
    
    // Get movies
    const movies = await Movie.findByUser(userId, filters);
    
    res.status(200).json({ movies });
  } catch (error) {
    console.error('Error getting movies:', error);
    res.status(500).json({ message: 'Error getting movies' });
  }
};

/**
 * Get movie by ID
 */
exports.getMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const movie = await Movie.findById(id, userId);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.status(200).json({ movie });
  } catch (error) {
    console.error('Error getting movie:', error);
    res.status(500).json({ message: 'Error getting movie' });
  }
};

/**
 * Create new movie
 */
exports.createMovie = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const {
      tmdb_id,
      title,
      poster_path,
      release_date,
      rating,
      comment,
      watch_date,
      tags
    } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    // Create movie
    const movieData = {
      user_id: userId,
      tmdb_id,
      title,
      poster_path,
      release_date,
      rating: rating || null,
      comment: comment || null,
      watch_date: watch_date || null
    };
    
    const movie = await Movie.create(movieData);
    
    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tag of tags) {
        await Movie.addTag(movie.id, tag);
      }
      
      // Fetch movie again with tags
      const updatedMovie = await Movie.findById(movie.id, userId);
      return res.status(201).json({ movie: updatedMovie });
    }
    
    res.status(201).json({ movie });
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: 'Error creating movie' });
  }
};

/**
 * Update movie
 */
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const {
      tmdb_id,
      title,
      poster_path,
      release_date,
      rating,
      comment,
      watch_date,
      tags
    } = req.body;
    
    // Check if movie exists
    const existingMovie = await Movie.findById(id, userId);
    
    if (!existingMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Update movie
    const updateData = {};
    
    if (title !== undefined) updateData.title = title;
    if (tmdb_id !== undefined) updateData.tmdb_id = tmdb_id;
    if (poster_path !== undefined) updateData.poster_path = poster_path;
    if (release_date !== undefined) updateData.release_date = release_date;
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;
    if (watch_date !== undefined) updateData.watch_date = watch_date;
    
    const movie = await Movie.update(id, userId, updateData);
    
    // Update tags if provided
    if (tags && Array.isArray(tags)) {
      // This is a simplified approach - a more sophisticated implementation 
      // would handle tag differences more efficiently
      
      // Get current tags
      const currentTags = existingMovie.tags || [];
      
      // Remove tags that aren't in the new list
      for (const tag of currentTags) {
        if (!tags.includes(tag)) {
          // Find tag ID
          const tagQuery = await require('../config/database').query('SELECT id FROM tags WHERE name = $1', [tag]);
          if (tagQuery.rows.length > 0) {
            await Movie.removeTag(id, tagQuery.rows[0].id);
          }
        }
      }
      
      // Add new tags
      for (const tag of tags) {
        if (!currentTags.includes(tag)) {
          await Movie.addTag(id, tag);
        }
      }
      
      // Fetch updated movie with tags
      const updatedMovie = await Movie.findById(id, userId);
      return res.status(200).json({ movie: updatedMovie });
    }
    
    res.status(200).json({ movie });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ message: 'Error updating movie' });
  }
};

/**
 * Delete movie
 */
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const deleted = await Movie.delete(id, userId);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ message: 'Error deleting movie' });
  }
};

/**
 * Add tag to movie
 */
exports.addTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { tag } = req.body;
    const userId = req.user.id;
    
    // Check if movie exists and belongs to user
    const movie = await Movie.findById(id, userId);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Validate tag
    if (!tag || typeof tag !== 'string') {
      return res.status(400).json({ message: 'Valid tag name is required' });
    }
    
    // Add tag
    await Movie.addTag(id, tag);
    
    // Get updated movie
    const updatedMovie = await Movie.findById(id, userId);
    
    res.status(200).json({ movie: updatedMovie });
  } catch (error) {
    console.error('Error adding tag:', error);
    res.status(500).json({ message: 'Error adding tag to movie' });
  }
};

/**
 * Remove tag from movie
 */
exports.removeTag = async (req, res) => {
  try {
    const { id, tagId } = req.params;
    const userId = req.user.id;
    
    // Check if movie exists and belongs to user
    const movie = await Movie.findById(id, userId);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Remove tag
    await Movie.removeTag(id, tagId);
    
    // Get updated movie
    const updatedMovie = await Movie.findById(id, userId);
    
    res.status(200).json({ movie: updatedMovie });
  } catch (error) {
    console.error('Error removing tag:', error);
    res.status(500).json({ message: 'Error removing tag from movie' });
  }
};

/**
 * Get user movie statistics
 */
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await Movie.getStats(userId);
    
    res.status(200).json({ stats });
  } catch (error) {
    console.error('Error getting movie stats:', error);
    res.status(500).json({ message: 'Error getting movie statistics' });
  }
};
