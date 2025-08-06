const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CineScope API',
    version: '0.1.0'
  });
});

// API routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/movies', require('./routes/movies.routes'));
app.use('/api/tmdb', require('./routes/tmdb.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
