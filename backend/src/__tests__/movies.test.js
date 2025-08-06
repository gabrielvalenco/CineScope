const request = require('supertest');
const express = require('express');
const moviesRoutes = require('../routes/movies.routes');
const movieController = require('../controllers/movie.controller');

// Mock dependencies
jest.mock('../controllers/movie.controller');
jest.mock('../middlewares/auth.middleware', () => (req, res, next) => {
  req.user = { id: 1, username: 'testuser', email: 'test@example.com' };
  next();
});

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/movies', moviesRoutes);

describe('Movie Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/movies', () => {
    it('should get all movies for the current user', async () => {
      // Mock data
      const mockMovies = [
        {
          id: 1,
          user_id: 1,
          title: 'Test Movie',
          tmdb_id: 123,
          rating: 8,
          tags: ['action', 'favorite']
        }
      ];

      // Mock the getMovies controller function
      movieController.getMovies.mockImplementation((req, res) => {
        res.status(200).json({ movies: mockMovies });
      });

      // Make the request
      const response = await request(app)
        .get('/api/movies')
        .set('Authorization', 'Bearer mock-jwt-token');

      // Assert the response
      expect(response.status).toBe(200);
      expect(response.body.movies).toEqual(mockMovies);
      expect(movieController.getMovies).toHaveBeenCalled();
    });
  });

  describe('GET /api/movies/:id', () => {
    it('should get a specific movie by id', async () => {
      // Mock data
      const mockMovie = {
        id: 1,
        user_id: 1,
        title: 'Test Movie',
        tmdb_id: 123,
        rating: 8,
        tags: ['action', 'favorite']
      };

      // Mock the getMovie controller function
      movieController.getMovie.mockImplementation((req, res) => {
        res.status(200).json({ movie: mockMovie });
      });

      // Make the request
      const response = await request(app)
        .get('/api/movies/1')
        .set('Authorization', 'Bearer mock-jwt-token');

      // Assert the response
      expect(response.status).toBe(200);
      expect(response.body.movie).toEqual(mockMovie);
      expect(movieController.getMovie).toHaveBeenCalled();
    });
  });

  describe('POST /api/movies', () => {
    it('should create a new movie', async () => {
      // Mock data
      const newMovie = {
        title: 'New Test Movie',
        tmdb_id: 456,
        rating: 9,
        comment: 'Great movie!',
        watch_date: '2023-08-01'
      };

      const createdMovie = {
        id: 2,
        user_id: 1,
        ...newMovie,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Mock the createMovie controller function
      movieController.createMovie.mockImplementation((req, res) => {
        res.status(201).json({ movie: createdMovie });
      });

      // Make the request
      const response = await request(app)
        .post('/api/movies')
        .send(newMovie)
        .set('Authorization', 'Bearer mock-jwt-token');

      // Assert the response
      expect(response.status).toBe(201);
      expect(response.body.movie).toEqual(createdMovie);
      expect(movieController.createMovie).toHaveBeenCalled();
    });
  });

  describe('PUT /api/movies/:id', () => {
    it('should update a movie', async () => {
      // Mock data
      const updateData = {
        rating: 10,
        comment: 'Updated comment'
      };

      const updatedMovie = {
        id: 1,
        user_id: 1,
        title: 'Test Movie',
        tmdb_id: 123,
        rating: 10,
        comment: 'Updated comment',
        updated_at: new Date().toISOString()
      };

      // Mock the updateMovie controller function
      movieController.updateMovie.mockImplementation((req, res) => {
        res.status(200).json({ movie: updatedMovie });
      });

      // Make the request
      const response = await request(app)
        .put('/api/movies/1')
        .send(updateData)
        .set('Authorization', 'Bearer mock-jwt-token');

      // Assert the response
      expect(response.status).toBe(200);
      expect(response.body.movie).toEqual(updatedMovie);
      expect(movieController.updateMovie).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/movies/:id', () => {
    it('should delete a movie', async () => {
      // Mock the deleteMovie controller function
      movieController.deleteMovie.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Movie deleted successfully' });
      });

      // Make the request
      const response = await request(app)
        .delete('/api/movies/1')
        .set('Authorization', 'Bearer mock-jwt-token');

      // Assert the response
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Movie deleted successfully');
      expect(movieController.deleteMovie).toHaveBeenCalled();
    });
  });
});
