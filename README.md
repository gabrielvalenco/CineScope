# 🎬 CineScope — Your Personal Movie Diary

CineScope is a mobile application built with React Native, designed to help users record, rate, and reflect on movies they've watched. It integrates external APIs, provides personalized recommendations, and offers a clean visual timeline of your cinematic journey.

---

## 📱 Core Features (MVP)

- 🔐 User authentication (JWT or Firebase Authentication)
- 🎞️ Personal movie list
- 📝 Add new entries with:
  - Title
  - Rating (0-10)
  - Personal comment
  - Date watched

---

## 🚀 Feature Expansion Roadmap

### 🎥 TMDb Integration
- Auto-complete movie titles
- Fetch posters, synopsis, cast, and genre
- Display rich metadata for each movie

### 🏷️ Tags & Genre Filtering
- Filter movies by genre (action, comedy, etc.)
- Custom tags (e.g., “Rewatch later”, “Watched with friends”)

### 📅 Visual Diary Mode
- Calendar or timeline-based view
- Show watched movies by day
- Mini-posters and ratings on each date

### 👥 Social Layer (Optional)
- Follow friends and view their recent ratings
- Public or private comment visibility
- Activity feed: “What your friends are watching”

### 🎯 Smart Recommendations
- Suggest films based on ratings and genres
- View personal stats:
  - Favorite genres
  - Average score
  - Most-watched directors

### 📶 Offline Support
- Store data locally when offline
- Sync with the backend once reconnected

---

## 🧱 Tech Stack

### Frontend
- React Native + Expo
- React Navigation
- Redux or Context API

### Backend
- Node.js + Express or Firebase Functions
- PostgreSQL or Firestore
- JWT-based auth

### DevOps
- Docker for local development
- GitHub Actions (CI/CD for linting, testing, and builds)
- Expo Go or TestFlight for beta distribution

---

## 🗂️ Repository Structure

```plaintext
cine-scope/
 ┣ app/                  ← React Native app
 ┣ backend/              ← API services (Node/Firebase)
 ┣ docs/                 ← Project documentation
 ┣ .github/              ← CI/CD workflows
 ┣ README.md
 ┗ docker-compose.yml
