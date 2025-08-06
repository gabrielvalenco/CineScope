const axios = require('axios');

/**
 * TMDb API Service
 * Handles all interactions with The Movie Database API
 */
class TmdbService {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
    this.baseUrl = process.env.TMDB_API_URL || 'https://api.themoviedb.org/3';
    this.imageBaseUrl = 'https://image.tmdb.org/t/p/';
  }

  /**
   * Create request config with API key
   * @param {Object} options - Additional options for request
   * @returns {Object} - Request config
   */
  _createRequestConfig(options = {}) {
    return {
      ...options,
      params: {
        ...(options.params || {}),
        api_key: this.apiKey,
      },
    };
  }

  /**
   * Process movie response to standardize data structure
   * @param {Object} movie - Movie data from TMDb
   * @returns {Object} - Processed movie data
   */
  _processMovieResponse(movie) {
    return {
      tmdb_id: movie.id,
      title: movie.title,
      original_title: movie.original_title,
      poster_path: movie.poster_path ? `${this.imageBaseUrl}w500${movie.poster_path}` : null,
      backdrop_path: movie.backdrop_path ? `${this.imageBaseUrl}original${movie.backdrop_path}` : null,
      release_date: movie.release_date,
      overview: movie.overview,
      genres: movie.genres || [],
      runtime: movie.runtime,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      popularity: movie.popularity,
      original_language: movie.original_language
    };
  }

  /**
   * Search for movies
   * @param {string} query - Search term
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Search results
   */
  async searchMovies(query, options = {}) {
    try {
      const { page = 1, language = 'en-US', include_adult = false, year } = options;

      const config = this._createRequestConfig({
        params: {
          query,
          page,
          language,
          include_adult,
          year
        }
      });

      const response = await axios.get(`${this.baseUrl}/search/movie`, config);
      
      return {
        page: response.data.page,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results,
        results: response.data.results.map(movie => ({
          tmdb_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path ? `${this.imageBaseUrl}w200${movie.poster_path}` : null,
          release_date: movie.release_date,
          vote_average: movie.vote_average
        }))
      };
    } catch (error) {
      console.error('Error searching movies:', error.message);
      throw new Error(`Failed to search movies: ${error.response?.data?.status_message || error.message}`);
    }
  }

  /**
   * Get movie details by TMDb ID
   * @param {number} id - TMDb movie ID
   * @param {string} language - Response language
   * @returns {Promise<Object>} - Movie details
   */
  async getMovieById(id, language = 'en-US') {
    try {
      const config = this._createRequestConfig({
        params: { language }
      });

      const response = await axios.get(`${this.baseUrl}/movie/${id}`, config);
      
      return this._processMovieResponse(response.data);
    } catch (error) {
      console.error(`Error getting movie with ID ${id}:`, error.message);
      throw new Error(`Failed to get movie: ${error.response?.data?.status_message || error.message}`);
    }
  }

  /**
   * Get popular movies
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Popular movies
   */
  async getPopularMovies(options = {}) {
    try {
      const { page = 1, language = 'en-US', region } = options;

      const config = this._createRequestConfig({
        params: { page, language, region }
      });

      const response = await axios.get(`${this.baseUrl}/movie/popular`, config);
      
      return {
        page: response.data.page,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results,
        results: response.data.results.map(movie => ({
          tmdb_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path ? `${this.imageBaseUrl}w200${movie.poster_path}` : null,
          release_date: movie.release_date,
          vote_average: movie.vote_average
        }))
      };
    } catch (error) {
      console.error('Error getting popular movies:', error.message);
      throw new Error(`Failed to get popular movies: ${error.response?.data?.status_message || error.message}`);
    }
  }

  /**
   * Get now playing movies
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Now playing movies
   */
  async getNowPlayingMovies(options = {}) {
    try {
      const { page = 1, language = 'en-US', region } = options;

      const config = this._createRequestConfig({
        params: { page, language, region }
      });

      const response = await axios.get(`${this.baseUrl}/movie/now_playing`, config);
      
      return {
        page: response.data.page,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results,
        results: response.data.results.map(movie => ({
          tmdb_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path ? `${this.imageBaseUrl}w200${movie.poster_path}` : null,
          release_date: movie.release_date,
          vote_average: movie.vote_average
        }))
      };
    } catch (error) {
      console.error('Error getting now playing movies:', error.message);
      throw new Error(`Failed to get now playing movies: ${error.response?.data?.status_message || error.message}`);
    }
  }

  /**
   * Get upcoming movies
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Upcoming movies
   */
  async getUpcomingMovies(options = {}) {
    try {
      const { page = 1, language = 'en-US', region } = options;

      const config = this._createRequestConfig({
        params: { page, language, region }
      });

      const response = await axios.get(`${this.baseUrl}/movie/upcoming`, config);
      
      return {
        page: response.data.page,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results,
        results: response.data.results.map(movie => ({
          tmdb_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path ? `${this.imageBaseUrl}w200${movie.poster_path}` : null,
          release_date: movie.release_date,
          vote_average: movie.vote_average
        }))
      };
    } catch (error) {
      console.error('Error getting upcoming movies:', error.message);
      throw new Error(`Failed to get upcoming movies: ${error.response?.data?.status_message || error.message}`);
    }
  }
}

module.exports = new TmdbService();
