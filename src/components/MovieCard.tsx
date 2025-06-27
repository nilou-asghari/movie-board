import React from "react";
import { Link } from "react-router-dom";
import type { MovieCardProps } from "../types/movie.ts";
const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  genre,
  posterPath,
}) => {
  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "https://via.placeholder.com/500x750?text=No+Image";
  return (
    <Link to={`/movie/${id}`}>
      <div className="border border-gray-300 rounded-lg p-4 hover:shaow-lg transion duration-300">
        <img
          src={posterUrl}
          alt={title}
          className="w-full  object-cover rounded-md mb-4 "
        />
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-500">{genre}</p>
      </div>
    </Link>
  );
};

export default MovieCard;
