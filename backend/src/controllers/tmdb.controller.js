const tmdbService = require('../services/tmdb.service');

/**
 * Search movies from TMDb
 */
exports.searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // Extract optional parameters
    const options = {
      page: req.query.page ? parseInt(req.query.page) : 1,
      language: req.query.language || 'en-US',
      include_adult: req.query.include_adult === 'true',
      year: req.query.year ? parseInt(req.query.year) : undefined
    };
    
    const results = await tmdbService.searchMovies(query, options);
    
    res.status(200).json(results);
  } catch (error) {
    console.error('Error searching TMDb movies:', error);
    res.status(500).json({ 
      message: 'Error searching for movies',
      error: error.message 
    });
  }
};

/**
 * Get movie details from TMDb
 */
exports.getMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const language = req.query.language || 'en-US';
    
    const movie = await tmdbService.getMovieById(id, language);
    
    res.status(200).json(movie);
  } catch (error) {
    console.error(`Error getting TMDb movie ${req.params.id}:`, error);
    
    // Handle 404 specifically
    if (error.message.includes('404')) {
      return res.status(404).json({ message: 'Movie not found in TMDb' });
    }
    
    res.status(500).json({ 
      message: 'Error getting movie details',
      error: error.message 
    });
  }
};

/**
 * Get popular movies from TMDb
 */
exports.getPopular = async (req, res) => {
  try {
    const options = {
      page: req.query.page ? parseInt(req.query.page) : 1,
      language: req.query.language || 'en-US',
      region: req.query.region
    };
    
    const movies = await tmdbService.getPopularMovies(options);
    
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error getting popular movies:', error);
    res.status(500).json({ 
      message: 'Error getting popular movies',
      error: error.message 
    });
  }
};

/**
 * Get now playing movies from TMDb
 */
exports.getNowPlaying = async (req, res) => {
  try {
    const options = {
      page: req.query.page ? parseInt(req.query.page) : 1,
      language: req.query.language || 'en-US',
      region: req.query.region
    };
    
    const movies = await tmdbService.getNowPlayingMovies(options);
    
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error getting now playing movies:', error);
    res.status(500).json({ 
      message: 'Error getting now playing movies',
      error: error.message 
    });
  }
};

/**
 * Get upcoming movies from TMDb
 */
exports.getUpcoming = async (req, res) => {
  try {
    const options = {
      page: req.query.page ? parseInt(req.query.page) : 1,
      language: req.query.language || 'en-US',
      region: req.query.region
    };
    
    const movies = await tmdbService.getUpcomingMovies(options);
    
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error getting upcoming movies:', error);
    res.status(500).json({ 
      message: 'Error getting upcoming movies',
      error: error.message 
    });
  }
};
