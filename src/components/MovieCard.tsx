import React from "react";
import type { MovieCardProps } from "../types/movie.ts";
const MovieCard: React.FC<MovieCardProps> = ({ title, genre, posterPath }) => {
  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "https://via.placeholder.com/500x750?text=No+Image";
  return (
    <div>
      <img src={posterUrl} alt={title} />
      <h2>{title}</h2>
      <p>{genre}</p>
    </div>
  );
};

export default MovieCard;
