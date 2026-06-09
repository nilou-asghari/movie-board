import React from "react";
import { Link } from "react-router-dom";
import type { MovieCardProps } from "../types/movie";

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  genre,
  posterPath,
  rating,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "https://placehold.co/500x750/1a1a2e/e0e0e0?text=No+Image";

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(id);
  };

  const ratingColor =
    rating && rating >= 7.5
      ? "#4ade80"
      : rating && rating >= 5
        ? "#facc15"
        : "#f87171";

  return (
    <Link to={`/movie/${id}`} className="movie-card">
      <div className="card-poster-wrap">
        <img
          src={posterUrl}
          alt={title}
          className="card-poster"
          loading="lazy"
        />
        <div className="card-overlay">
          {rating !== undefined && (
            <span className="card-rating" style={{ color: ratingColor }}>
              ★ {rating.toFixed(1)}
            </span>
          )}
          {onToggleFavorite && (
            <button
              className={`fav-btn ${isFavorite ? "fav-active" : ""}`}
              onClick={handleFav}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
              {isFavorite ? "♥" : "♡"}
            </button>
          )}
        </div>
      </div>
      <div className="card-info">
        <h3 className="card-title">{title}</h3>
        <span className="card-genre">{genre}</span>
      </div>
    </Link>
  );
};

export default MovieCard;
