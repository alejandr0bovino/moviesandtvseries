// Movie-related types and interfaces

export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date?: string;
  overview?: string;
  genre_ids?: number[];
  vote_average?: number;
};

export interface MovieApiResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export type ViewMode = 'grid' | 'list';
