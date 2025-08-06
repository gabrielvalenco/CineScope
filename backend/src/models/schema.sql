-- Schema for CineScope database

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Movies table
CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  tmdb_id INTEGER,
  title VARCHAR(255) NOT NULL,
  poster_path VARCHAR(255),
  release_date DATE,
  rating INTEGER CHECK (rating >= 0 AND rating <= 10),
  comment TEXT,
  watch_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Movie-Tags relationship table
CREATE TABLE IF NOT EXISTS movie_tags (
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, tag_id)
);

-- Indexes
CREATE INDEX idx_movies_user_id ON movies(user_id);
CREATE INDEX idx_movies_tmdb_id ON movies(tmdb_id);
CREATE INDEX idx_movie_tags_movie_id ON movie_tags(movie_id);
CREATE INDEX idx_movie_tags_tag_id ON movie_tags(tag_id);
