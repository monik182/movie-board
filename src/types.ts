export interface MovieApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface EnhancedMovie extends Movie {
  saved?: boolean
  watched?: boolean
}

export interface MovieStorage {
  getMovies(): Promise<EnhancedMovie[]>
  saveMovie(movie: EnhancedMovie): Promise<void>
  updateMovie(movie: EnhancedMovie): Promise<void>
  deleteMovie(movieId: EnhancedMovie['id']): Promise<void>
  movieExists(movieId: EnhancedMovie['id']): Promise<boolean>
}
