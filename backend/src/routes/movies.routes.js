const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All movie routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/movies
 * @desc    Get all movies for current user
 * @access  Private
 */
router.get('/', movieController.getMovies);

/**
 * @route   GET /api/movies/:id
 * @desc    Get movie by id
 * @access  Private
 */
router.get('/:id', movieController.getMovie);

/**
 * @route   POST /api/movies
 * @desc    Create a new movie
 * @access  Private
 */
router.post('/', movieController.createMovie);

/**
 * @route   PUT /api/movies/:id
 * @desc    Update a movie
 * @access  Private
 */
router.put('/:id', movieController.updateMovie);

/**
 * @route   DELETE /api/movies/:id
 * @desc    Delete a movie
 * @access  Private
 */
router.delete('/:id', movieController.deleteMovie);

/**
 * @route   POST /api/movies/:id/tags
 * @desc    Add a tag to a movie
 * @access  Private
 */
router.post('/:id/tags', movieController.addTag);

/**
 * @route   DELETE /api/movies/:id/tags/:tagId
 * @desc    Remove a tag from a movie
 * @access  Private
 */
router.delete('/:id/tags/:tagId', movieController.removeTag);

/**
 * @route   GET /api/movies/stats
 * @desc    Get movie statistics
 * @access  Private
 */
router.get('/stats', movieController.getStats);

module.exports = router;
