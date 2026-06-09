import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../context/AuthContext";
import type { MovieDetail } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const Favorites: React.FC = () => {
  const { user, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<MovieDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.favorites.length === 0) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          user.favorites.map((id) =>
            axios
              .get(
                `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`,
              )
              .then((r) => r.data)
              .catch(() => null),
          ),
        );
        setMovies(results.filter(Boolean));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (!user) return null;

  return (
    <div className="page-favorites">
      <div className="favorites-header">
        <h1 className="favorites-title">My List</h1>
        <p className="favorites-sub">
          {user.favorites.length}{" "}
          {user.favorites.length === 1 ? "film" : "films"} saved
        </p>
      </div>

      {loading ? (
        <div className="grid-skeleton">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🎞️</span>
          <p>Your list is empty.</p>
          <button
            onClick={() => navigate("/")}
            className="btn-primary"
            style={{ marginTop: "1rem" }}>
            Browse Movies
          </button>
        </div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              genre={movie.genres.map((g) => g.name).join(", ")}
              posterPath={movie.poster_path}
              rating={movie.vote_average}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
