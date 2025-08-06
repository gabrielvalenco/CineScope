# CineScope API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

### Register a new user

```
POST /auth/register
```

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "JWT_TOKEN"
}
```

### Login

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "profile_image": null
  },
  "token": "JWT_TOKEN"
}
```

### Get Current User

```
GET /auth/me
```

**Headers:**

```
Authorization: Bearer JWT_TOKEN
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "profile_image": null
  }
}
```

## Movies

All movie endpoints require authentication via the Authorization header.

### Get All Movies

```
GET /movies
```

**Query Parameters:**

- `rating`: Filter by rating (1-10)
- `search`: Search in titles and comments
- `orderBy`: Field to order by (default: watch_date)
- `order`: "asc" or "desc" (default: "desc")

**Response:**

```json
{
  "movies": [
    {
      "id": 1,
      "user_id": 1,
      "tmdb_id": 550,
      "title": "Fight Club",
      "poster_path": "https://image.tmdb.org/t/p/w500/path/to/poster.jpg",
      "release_date": "1999-10-15",
      "rating": 9,
      "comment": "Excellent movie",
      "watch_date": "2023-01-15",
      "created_at": "2023-01-16T20:30:45.123Z",
      "updated_at": "2023-01-16T20:30:45.123Z",
      "tags": ["favorite", "drama"]
    }
  ]
}
```

### Get Movie by ID

```
GET /movies/:id
```

**Response:**

```json
{
  "movie": {
    "id": 1,
    "user_id": 1,
    "tmdb_id": 550,
    "title": "Fight Club",
    "poster_path": "https://image.tmdb.org/t/p/w500/path/to/poster.jpg",
    "release_date": "1999-10-15",
    "rating": 9,
    "comment": "Excellent movie",
    "watch_date": "2023-01-15",
    "created_at": "2023-01-16T20:30:45.123Z",
    "updated_at": "2023-01-16T20:30:45.123Z",
    "tags": ["favorite", "drama"]
  }
}
```

### Create Movie

```
POST /movies
```

**Request Body:**

```json
{
  "tmdb_id": 550,
  "title": "Fight Club",
  "poster_path": "https://image.tmdb.org/t/p/w500/path/to/poster.jpg",
  "release_date": "1999-10-15",
  "rating": 9,
  "comment": "Excellent movie",
  "watch_date": "2023-01-15",
  "tags": ["favorite", "drama"]
}
```

**Response:**

```json
{
  "movie": {
    "id": 1,
    "user_id": 1,
    "tmdb_id": 550,
    "title": "Fight Club",
    "poster_path": "https://image.tmdb.org/t/p/w500/path/to/poster.jpg",
    "release_date": "1999-10-15",
    "rating": 9,
    "comment": "Excellent movie",
    "watch_date": "2023-01-15",
    "created_at": "2023-01-16T20:30:45.123Z",
    "updated_at": "2023-01-16T20:30:45.123Z"
  }
}
```

### Update Movie

```
PUT /movies/:id
```

**Request Body:**

```json
{
  "rating": 8,
  "comment": "Updated comment",
  "tags": ["favorite", "drama", "new-tag"]
}
```

**Response:**

```json
{
  "movie": {
    "id": 1,
    "user_id": 1,
    "tmdb_id": 550,
    "title": "Fight Club",
    "poster_path": "https://image.tmdb.org/t/p/w500/path/to/poster.jpg",
    "release_date": "1999-10-15",
    "rating": 8,
    "comment": "Updated comment",
    "watch_date": "2023-01-15",
    "created_at": "2023-01-16T20:30:45.123Z",
    "updated_at": "2023-01-16T21:45:12.456Z",
    "tags": ["favorite", "drama", "new-tag"]
  }
}
```

### Delete Movie

```
DELETE /movies/:id
```

**Response:**

```json
{
  "message": "Movie deleted successfully"
}
```

### Add Tag to Movie

```
POST /movies/:id/tags
```

**Request Body:**

```json
{
  "tag": "action"
}
```

**Response:**

```json
{
  "movie": {
    "id": 1,
    "user_id": 1,
    "tmdb_id": 550,
    "title": "Fight Club",
    "poster_path": "https://image.tmdb.org/t/p/w500/path/to/poster.jpg",
    "release_date": "1999-10-15",
    "rating": 8,
    "comment": "Updated comment",
    "watch_date": "2023-01-15",
    "created_at": "2023-01-16T20:30:45.123Z",
    "updated_at": "2023-01-16T21:45:12.456Z",
    "tags": ["favorite", "drama", "new-tag", "action"]
  }
}
```

### Get Movie Statistics

```
GET /movies/stats
```

**Response:**

```json
{
  "stats": {
    "total_movies": 42,
    "average_rating": 7.8,
    "months_active": 5
  }
}
```

## TMDb Integration

All TMDb endpoints require authentication via the Authorization header.

### Search Movies

```
GET /tmdb/search?query=fight%20club
```

**Query Parameters:**

- `query`: Search term (required)
- `page`: Page number (default: 1)
- `language`: Response language (default: "en-US")
- `include_adult`: Include adult content (default: false)
- `year`: Filter by year

**Response:**

```json
{
  "page": 1,
  "total_pages": 10,
  "total_results": 185,
  "results": [
    {
      "tmdb_id": 550,
      "title": "Fight Club",
      "poster_path": "https://image.tmdb.org/t/p/w200/path/to/poster.jpg",
      "release_date": "1999-10-15",
      "vote_average": 8.4
    }
  ]
}
```

### Get Movie Details

```
GET /tmdb/movie/:id
```

**Query Parameters:**

- `language`: Response language (default: "en-US")

**Response:**

```json
{
  "tmdb_id": 550,
  "title": "Fight Club",
  "original_title": "Fight Club",
  "poster_path": "https://image.tmdb.org/t/p/w500/path/to/poster.jpg",
  "backdrop_path": "https://image.tmdb.org/t/p/original/path/to/backdrop.jpg",
  "release_date": "1999-10-15",
  "overview": "A ticking-time-bomb insomniac and a slippery soap salesman...",
  "genres": [
    {
      "id": 18,
      "name": "Drama"
    }
  ],
  "runtime": 139,
  "vote_average": 8.4,
  "vote_count": 24685,
  "popularity": 67.23,
  "original_language": "en"
}
```

### Get Popular Movies

```
GET /tmdb/popular
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `language`: Response language (default: "en-US")
- `region`: Filter by region

**Response:**

```json
{
  "page": 1,
  "total_pages": 500,
  "total_results": 10000,
  "results": [
    {
      "tmdb_id": 550,
      "title": "Fight Club",
      "poster_path": "https://image.tmdb.org/t/p/w200/path/to/poster.jpg",
      "release_date": "1999-10-15",
      "vote_average": 8.4
    }
  ]
}
```

### Get Now Playing Movies

```
GET /tmdb/now-playing
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `language`: Response language (default: "en-US")
- `region`: Filter by region

**Response:** Same format as Popular Movies

### Get Upcoming Movies

```
GET /tmdb/upcoming
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `language`: Response language (default: "en-US")
- `region`: Filter by region

**Response:** Same format as Popular Movies
