import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import type { Movie, Genre } from "../types/movie";

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [genres, setGenres] = useState<Genre[]>([]);

  const apiKey = "9e3a15fbadfd9ddb146c37535b599e63";
  const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

  const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

  const fetchMovies = async () => {
    try {
      const response = await axios.get<{ results: Movie[] }>(apiUrl);
      setMovies(response.data.results);
      console.log("Movies fetched:", response.data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get<{ results: Genre[] }>(genreUrl);
      setGenres(response.data.genres);
      console.log("genre fetched:", response.data.genres);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
    fetchMovies();
  }, []);

  const GetGenresName = (genreIds: number[]): string => {
    if (genreIds.length === 0) return "unknown";
    const genre = genres.find((g) => g.id === genreIds[0]);
    return genre ? genre.name : "unknown";
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Movie Board
      </h1>
      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading Movies...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              genre={
                movie.genre_ids?.length ? GetGenresName(movie.genre_ids) : "N/A"
              }
              posterPath={movie.poster_path}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
