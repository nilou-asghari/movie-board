import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { MovieDetail } from "../types/movie";
import { useAuth } from "../context/AuthContext";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, toggleFavorite } = useAuth();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`,
      )
      .then((res) => setMovie(res.data))
      .catch(() => setError("Movie not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner" />
        <p>Loading movie...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="detail-error">
        <p>{error || "Movie not found."}</p>
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Go Back
        </button>
      </div>
    );
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/500x750/1a1a2e/e0e0e0?text=No+Image";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  const isFav = user?.favorites.includes(movie.id);

  const ratingColor =
    movie.vote_average >= 7.5
      ? "#4ade80"
      : movie.vote_average >= 5
        ? "#facc15"
        : "#f87171";

  const formatCurrency = (n: number) =>
    n > 0 ? `$${n.toLocaleString()}` : "N/A";

  const formatRuntime = (mins: number | null) => {
    if (!mins) return "N/A";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="detail-page">
      {/* Backdrop */}
      {backdropUrl && (
        <div
          className="detail-backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}>
          <div className="backdrop-fade" />
        </div>
      )}

      <div className="detail-content">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Back
        </button>

        <div className="detail-main">
          {/* Poster */}
          <div className="detail-poster-wrap">
            <img src={posterUrl} alt={movie.title} className="detail-poster" />
            {user && (
              <button
                className={`detail-fav-btn ${isFav ? "fav-active" : ""}`}
                onClick={() => toggleFavorite(movie.id)}>
                {isFav ? "♥ In My List" : "♡ Add to My List"}
              </button>
            )}
            {!user && (
              <p className="fav-hint">
                <a href="/login">Sign in</a> to save favorites
              </p>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            {movie.tagline && (
              <p className="detail-tagline">"{movie.tagline}"</p>
            )}
            <h1 className="detail-title">{movie.title}</h1>

            <div className="detail-meta">
              <span className="meta-badge" style={{ color: ratingColor }}>
                ★ {movie.vote_average.toFixed(1)}
              </span>
              <span className="meta-badge">
                {movie.vote_count.toLocaleString()} votes
              </span>
              <span className="meta-badge">
                {movie.release_date?.slice(0, 4)}
              </span>
              <span className="meta-badge">{formatRuntime(movie.runtime)}</span>
              <span className="meta-badge">{movie.status}</span>
            </div>

            <div className="detail-genres">
              {movie.genres.map((g) => (
                <span key={g.id} className="genre-tag">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="detail-overview">{movie.overview}</p>

            <div className="detail-stats">
              <div className="stat-row">
                <span className="stat-label">Release Date</span>
                <span className="stat-value">{movie.release_date}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Budget</span>
                <span className="stat-value">
                  {formatCurrency(movie.budget)}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Revenue</span>
                <span className="stat-value">
                  {formatCurrency(movie.revenue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
