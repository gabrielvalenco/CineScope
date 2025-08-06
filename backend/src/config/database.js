const { Pool } = require('pg');

// Create a new PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test the database connection
pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to the database');
    done();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
