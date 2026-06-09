export interface Movie {
  id: number;
  title: string;
  genre_ids: number[];
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  backdrop_path: string | null;
}

export interface MovieDetail {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: Genre[];
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  tagline: string | null;
  status: string;
  budget: number;
  revenue: number;
}

export interface MovieCardProps {
  id: number;
  title: string;
  genre: string;
  posterPath: string | null;
  rating?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
}

export interface Genre {
  id: number;
  name: string;
}
