const express = require('express');
const router = express.Router();
const tmdbController = require('../controllers/tmdb.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All TMDb routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/tmdb/search
 * @desc    Search for movies from TMDb
 * @access  Private
 */
router.get('/search', tmdbController.searchMovies);

/**
 * @route   GET /api/tmdb/movie/:id
 * @desc    Get a specific movie from TMDb by ID
 * @access  Private
 */
router.get('/movie/:id', tmdbController.getMovie);

/**
 * @route   GET /api/tmdb/popular
 * @desc    Get popular movies from TMDb
 * @access  Private
 */
router.get('/popular', tmdbController.getPopular);

/**
 * @route   GET /api/tmdb/now-playing
 * @desc    Get now playing movies from TMDb
 * @access  Private
 */
router.get('/now-playing', tmdbController.getNowPlaying);

/**
 * @route   GET /api/tmdb/upcoming
 * @desc    Get upcoming movies from TMDb
 * @access  Private
 */
router.get('/upcoming', tmdbController.getUpcoming);

module.exports = router;
