import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import type { Movie, Genre } from "../types/movie";
import useDebounce from "../hooks/useDebounce";
import useSearch from "../hooks/useSearch";
import { useAuth } from "../context/AuthContext";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const Home: React.FC = () => {
  const { user, toggleFavorite } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 450);
  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
  } = useSearch(debouncedSearch);

  // Fetch genres once
  useEffect(() => {
    axios
      .get<{ genres: Genre[] }>(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`,
      )
      .then((res) => setGenres(res.data.genres))
      .catch(console.error);
  }, []);

  // Fetch popular movies when page or genre filter changes
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const genreParam = selectedGenre ? `&with_genres=${selectedGenre}` : "";
      const url = selectedGenre
        ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&page=${currentPage}${genreParam}&sort_by=popularity.desc`
        : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${currentPage}`;
      const res = await axios.get<{ results: Movie[]; total_pages: number }>(
        url,
      );
      setMovies(res.data.results);
      setTotalPages(Math.min(res.data.total_pages, 500));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedGenre]);

  useEffect(() => {
    if (!debouncedSearch) fetchMovies();
  }, [fetchMovies, debouncedSearch]);

  const getGenreName = (genreIds: number[]): string => {
    if (!genreIds?.length) return "Unknown";
    const found = genres.find((g) => g.id === genreIds[0]);
    return found ? found.name : "Unknown";
  };

  const handleGenreChange = (id: number | null) => {
    setSelectedGenre(id);
    setCurrentPage(1);
  };

  const displayMovies = debouncedSearch ? searchResults : movies;
  const isLoading = debouncedSearch ? searchLoading : loading;
  const showPagination = !debouncedSearch;

  return (
    <div className="page-home">
      {/* Hero Search */}
      <div className="hero-section">
        <h1 className="hero-title">Discover Your Next Film</h1>
        <p className="hero-sub">Millions of movies. One place.</p>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title..."
            className="search-input"
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Genre Filter */}
      {!debouncedSearch && (
        <div className="genre-bar">
          <button
            className={`genre-chip ${selectedGenre === null ? "active" : ""}`}
            onClick={() => handleGenreChange(null)}>
            All
          </button>
          {genres.map((g) => (
            <button
              key={g.id}
              className={`genre-chip ${selectedGenre === g.id ? "active" : ""}`}
              onClick={() => handleGenreChange(g.id)}>
              {g.name}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="movies-section">
        {debouncedSearch && (
          <p className="results-label">
            {searchLoading
              ? "Searching..."
              : `Results for "${debouncedSearch}"`}
          </p>
        )}

        {searchError && <p className="error-msg">{searchError}</p>}

        {isLoading ? (
          <div className="grid-skeleton">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : displayMovies.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎥</span>
            <p>No movies found.</p>
          </div>
        ) : (
          <div className="movies-grid">
            {displayMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                genre={getGenreName(movie.genre_ids)}
                posterPath={movie.poster_path}
                rating={movie.vote_average}
                isFavorite={user?.favorites.includes(movie.id)}
                onToggleFavorite={user ? toggleFavorite : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {showPagination && !loading && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="page-btn">
            ← Prev
          </button>
          <span className="page-info">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="page-btn">
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
