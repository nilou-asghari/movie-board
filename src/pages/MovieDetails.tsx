import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { MovieDetail, Genre } from "../types/movie";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const apiKey = "9e3a15fbadfd9ddb146c37535b599e63";
  const movieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;
  useEffect(() => {
    const fetchMovie = async () => {
      const response = await axios.get(movieUrl);
      setMovie(response.data);
      console.log("movie", response.data);
      setLoading(false);
    };
    fetchMovie();
  }, [id]);
  if (loading) return <p>Loading Movie Details...</p>;
  if (!movie) return <p>Movie not found</p>;
  const postUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <div className="flex gap-2">
        <img src={postUrl} alt={movie.title} className="w-80 rounded-lg" />
        <div>
          <p>
            <strong>Realease Date:</strong>
            {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong>
            {movie.vote_average}
          </p>
          <p>
            <strong>Genres:</strong>
            {movie.genres.map((g) => g.name).join(", ")}
          </p>
          <p className="mt-4">
            <strong>Overview:</strong>
            {movie.overview}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
