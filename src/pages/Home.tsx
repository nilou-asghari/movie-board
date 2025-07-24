import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import type { Movie, Genre } from "../types/movie";
import useDebounce from "../hooks/useDebounce";
import useSearch from "../hooks/useSearch";

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
  } = useSearch(debouncedSearchTerm);

  const apiKey = "9e3a15fbadfd9ddb146c37535b599e63";
  const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${currentPage}`;
  const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ results: Movie[] }>(apiUrl);
      setMovies(response.data.results);
      console.log("Movies fetched:", response.data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get<{ genres: Genre[] }>(genreUrl);
      setGenres(response.data.genres);
      console.log("Genres fetched:", response.data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  });
  useEffect(() => {
    fetchMovies();
    window.scroll(0, 0);
  }, [currentPage]);

  const GetGenresName = (genreIds: number[]): string => {
    if (genreIds.length === 0) return "Unknown";
    const genre = genres.find((g) => g.id === genreIds[0]);
    return genre ? genre.name : "Unknown";
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Movie Board
      </h1>

      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movies..."
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>

      {searchTerm ? (
        <>
          {searchLoading ? (
            <p>Loading search results...</p>
          ) : searchError ? (
            <p>{searchError}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  genre={GetGenresName(movie.genre_ids)}
                  posterPath={movie.poster_path}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {loading ? (
            <p>Loading Movies...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  genre={
                    movie.genre_ids?.length
                      ? GetGenresName(movie.genre_ids)
                      : "N/A"
                  }
                  posterPath={movie.poster_path}
                />
              ))}
            </div>
          )}
        </>
      )}
      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Pervious
        </button>
        <span className="px-4 py-2 font-semibold">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
