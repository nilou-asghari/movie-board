# CineBoard 🎬

A full-stack movie discovery app I built to practice React, TypeScript, and Node.js.
Users can browse popular movies, search by title, filter by genre, and save favorites.

## Tech Stack

**Frontend**

- React 19 + TypeScript
- React Router v7
- Axios
- Tailwind CSS + custom CSS
- TMDB API

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt

## Features

- 🔍 Real-time movie search with debounce
- 🎭 Genre filtering
- 📄 Paginated browsing
- 🎬 Detailed movie pages
- 🔐 Register / Login with JWT
- ♥ Save and manage favorite movies

## Getting Started

### Environment Variables

Root `.env`:

```
VITE_TMDB_API_KEY=your_tmdb_api_key
```

`server/.env`:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Run the app

```bash
# Frontend
npm install
npm run dev

# Backend
cd server
npm install
npm run dev
```

## Project Structure

```
src/
├── api/          # Axios instance with JWT interceptor
├── components/   # Navbar, MovieCard
├── context/      # AuthContext (login, register, logout, favorites)
├── hooks/        # useDebounce, useSearch
├── pages/        # Home, MovieDetails, Login, Register, Favorites
└── types/        # TypeScript interfaces

server/
├── middleware/   # JWT auth middleware
├── models/       # User model (email, password, favorites)
├── routes/       # /auth and /favorites endpoints
└── utils/        # JWT payload type
```

## Live Demo

Frontend: [cineboard-app.netlify.app](https://cineboard-app.netlify.app)
Backend: Deployed on Render
