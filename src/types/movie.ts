export interface Movie {
  id: number;
  title: string;
  genre_ids: number[];
  posterPath: string | null;
  overview: string;
  release_date: string;
}
export interface MovieCardProps {
  title: string;
  genre: string;
  posterPath: string | null;
}
