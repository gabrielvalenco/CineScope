# 🎬 CineScope — Your Personal Movie Diary

CineScope is a mobile application built with React Native, designed to help users record, rate, and reflect on movies they've watched. It integrates external APIs, provides personalized recommendations, and offers a clean visual timeline of your cinematic journey.

---

## 📋 Table of Contents

- [Features](#-core-features-mvp)
- [Project Structure](#-project-structure)
- [Development Setup](#-development-setup)
- [Backend API](#-backend-api)
- [Frontend App](#-frontend-app)
- [CI/CD Workflow](#-cicd-workflow)
- [Development Roadmap](#-development-roadmap)
- [Contributing](#-contributing)

---

## 📱 Core Features (MVP)

- 🔐 User authentication (JWT)
- 🎞️ Personal movie tracking
- 📝 Add new entries with:
  - Title
  - Rating (0-10)
  - Personal comment
  - Date watched
- 🎥 TMDb integration for movie data
- 🏷️ Custom tags for organization

---

## 🗂️ Project Structure

The project is organized as a monorepo with the following structure:

```plaintext
CineScope/
 ┣ app/                  ← React Native (Expo) app
 ┣ backend/              ← Node.js/Express API
 ┃ ┣ src/                ← Backend source code
 ┃ ┃ ┣ config/           ← Configuration files
 ┃ ┃ ┣ controllers/      ← API controllers
 ┃ ┃ ┣ middlewares/      ← Express middlewares
 ┃ ┃ ┣ models/           ← Database models
 ┃ ┃ ┣ routes/           ← API routes
 ┃ ┃ ┣ services/         ← External services
 ┃ ┃ ┣ utils/            ← Utility functions
 ┃ ┃ ┗ index.js          ← Main entry point
 ┣ docs/                 ← Project documentation
 ┃ ┣ api.md              ← API documentation
 ┃ ┣ index.md            ← Documentation index
 ┃ ┗ setup.md            ← Setup instructions
 ┣ .github/              ← GitHub workflows
 ┃ ┗ workflows/          ← CI/CD configuration
 ┣ README.md             ← Main documentation
 ┗ docker-compose.yml    ← Docker configuration
```

---

## 🛠️ Development Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Docker and Docker Compose (optional for local development)
- PostgreSQL database
- TMDb API key

### Environment Variables

Create a `.env` file in the `backend/` directory using the provided `.env.example` as a template:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cinescope
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
TMDB_API_KEY=your_tmdb_api_key
TMDB_API_URL=https://api.themoviedb.org/3
```

### Using Docker (Recommended)

The easiest way to start development is using Docker:

```bash
# Start the backend and PostgreSQL database
docker-compose up
```

This will start the backend API on http://localhost:3000 and PostgreSQL on port 5432.

### Manual Setup

#### Backend

```bash
# Install dependencies
cd backend
npm install

# Run in development mode
npm run dev
```

#### Frontend (React Native App)

```bash
# Install dependencies
cd app
npm install

# Start the Expo development server
npm start
```

---

## 🔌 Backend API

The backend API provides endpoints for authentication, movie management, and TMDb integration. Detailed API documentation is available in [docs/api.md](./docs/api.md).

### Key Endpoints

- **Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login a user
  - `GET /api/auth/me` - Get current user profile

- **Movies**
  - `GET /api/movies` - List all movies for current user
  - `POST /api/movies` - Add a new movie
  - `PUT /api/movies/:id` - Update a movie
  - `DELETE /api/movies/:id` - Delete a movie

- **TMDb Integration**
  - `GET /api/tmdb/search` - Search for movies
  - `GET /api/tmdb/movie/:id` - Get movie details
  - `GET /api/tmdb/popular` - Get popular movies

### Database Schema

The PostgreSQL database includes the following main tables:

- `users` - User accounts
- `movies` - User's movie entries
- `tags` - Movie tags for organization
- `movie_tags` - Many-to-many relationship between movies and tags

---

## 📱 Frontend App

The frontend is a React Native app built with Expo. The app will feature:

- User authentication
- Movie search and browsing via TMDb
- Personal movie collection management
- Tracking watched movies with ratings and comments
- Custom tags and filtering

### Getting Started with the App

With Expo installed, you can start the app using:

```bash
cd app
npm start
```

This will open the Expo developer tools where you can run the app on iOS/Android simulators or physical devices using the Expo Go app.

---

## 🔄 CI/CD Workflow

The project uses GitHub Actions for continuous integration and deployment. The workflow includes:

- Linting and code quality checks
- Running backend tests
- Building and testing the React Native app

Workflow files can be found in the `.github/workflows` directory.

---

## 🚀 Development Roadmap

### Completed

- ✅ Project structure setup
- ✅ Docker configuration
- ✅ CI/CD workflow setup
- ✅ Backend API with user authentication
- ✅ Movie CRUD operations
- ✅ TMDb integration

### In Progress

- 🔄 API documentation and testing

### Coming Soon

- React Native app implementation
- User interface design
- Advanced filtering and searching
- Statistics and recommendations

---

## 👥 Contributing

1. Clone the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests: `cd backend && npm test`
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.
