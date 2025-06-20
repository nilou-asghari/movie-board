import { useState, useEffect } from "react";
import axios from "axios";
import type { Movie } from "../types/movie";

const useSearch = (query: string, debounceDelay: number = 500) => {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiKey = "9e3a15fbadfd9ddb146c37535b599e63";

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(
            query
          )}`
        );
        setResults(response.data.results);
      } catch (err) {
        setError("Failed to fetch search results");
      } finally {
        setLoading(false);
      }
    };
    const timeoutId = setTimeout(fetchData, debounceDelay);
    return () => clearTimeout(timeoutId);
  }, [query, debounceDelay]);
  return { results, loading, error };
};
export default useSearch;
