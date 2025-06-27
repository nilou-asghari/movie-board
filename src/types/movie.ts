export interface Movie {
  id: number;
  title: string;
  genre_ids: number[];
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface MovieDetail {
  id: number;
  title: string;
  poster_path: string | null;
  genres: Genre[];
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface MovieCardProps {
  id: number;
  title: string;
  genre: string;
  posterPath: string | null;
}

export interface Genre {
  id: number;
  name: string;
}
