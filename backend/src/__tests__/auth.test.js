const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth.routes');
const authController = require('../controllers/auth.controller');

// Mock dependencies
jest.mock('../controllers/auth.controller');
jest.mock('../middlewares/auth.middleware', () => (req, res, next) => {
  req.user = { id: 1, username: 'testuser', email: 'test@example.com' };
  next();
});

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      // Mock the register controller function
      authController.register.mockImplementation((req, res) => {
        res.status(201).json({
          message: 'User registered successfully',
          user: {
            id: 1,
            username: 'newuser',
            email: 'new@example.com'
          },
          token: 'mock-jwt-token'
        });
      });

      // Make the request
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123'
        });

      // Assert the response
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(authController.register).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user', async () => {
      // Mock the login controller function
      authController.login.mockImplementation((req, res) => {
        res.status(200).json({
          message: 'Login successful',
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com'
          },
          token: 'mock-jwt-token'
        });
      });

      // Make the request
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      // Assert the response
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(authController.login).toHaveBeenCalled();
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get the current user profile', async () => {
      // Mock the getCurrentUser controller function
      authController.getCurrentUser.mockImplementation((req, res) => {
        res.status(200).json({
          user: {
            id: 1,
            username: 'testuser',
            email: 'test@example.com'
          }
        });
      });

      // Make the request
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer mock-jwt-token');

      // Assert the response
      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe('testuser');
      expect(authController.getCurrentUser).toHaveBeenCalled();
    });
  });
});
