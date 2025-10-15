// API Types for TMDB and internal API responses

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  overview?: string;
  genre_ids?: number[];
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  adult?: boolean;
  original_language?: string;
  original_title?: string;
  backdrop_path?: string | null;
  video?: boolean;
}

export interface TvSeries {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date?: string;
  genre_ids?: number[];
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  adult?: boolean;
  original_language?: string;
  original_name?: string;
  backdrop_path?: string | null;
  origin_country?: string[];
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  adult?: boolean;
  gender?: number;
  known_for_department?: string;
  known_for?: KnownFor[];
  popularity?: number;
}

export interface KnownFor {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: 'movie' | 'tv';
  vote_average?: number;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieApiResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface TvSeriesApiResponse {
  results: TvSeries[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface PersonApiResponse {
  results: Person[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  homepage?: string;
  imdb_id?: string;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
  status?: string;
  tagline?: string;
  runtime?: number;
  budget?: number;
  revenue?: number;
  credits?: Credits;
  youtubeTrailerKey?: string | null;
  cast?: CastMember[];
  crew?: CrewMember[];
}

export interface TvSeriesDetails extends TvSeries {
  genres: Genre[];
  homepage?: string;
  imdb_id?: string;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
  status?: string;
  tagline?: string;
  episode_run_time?: number[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  credits?: Credits;
  youtubeTrailerKey?: string | null;
  cast?: CastMember[];
  crew?: CrewMember[];
}

export interface PersonDetails extends Person {
  biography?: string;
  birthday?: string;
  place_of_birth?: string;
  imdb_id?: string;
  known_for_department?: string;
  credits?: Credits;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character?: string;
  order?: number;
  profile_path?: string | null;
  media_type?: 'movie' | 'tv';
}

export interface CrewMember {
  id: number;
  name: string;
  job?: string;
  department?: string;
  profile_path?: string | null;
  media_type?: 'movie' | 'tv';
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface VideosResponse {
  results: Video[];
}

// Query parameter types
export interface MovieQueryParams {
  year?: string | undefined;
  genre?: string | undefined;
  query?: string | undefined;
  page?: string | undefined;
  sort?: string | undefined;
}

export interface TvSeriesQueryParams {
  year?: string | undefined;
  genre?: string | undefined;
  name?: string | undefined;
  page?: string | undefined;
  sort?: string | undefined;
}

export interface PersonQueryParams {
  query?: string | undefined;
  page?: string | undefined;
}

// API Error types
export interface ApiError {
  error: string;
  code?: string;
  details?: string;
}

// Environment variables type
export interface EnvVariables {
  TMDB_ACCESS_TOKEN: string;
  TMDB_API_KEY?: string;
  DATABASE_URL: string;
  CLERK_SECRET_KEY: string;
  NEXTAUTH_SECRET: string;
  NODE_ENV: 'development' | 'production' | 'test';
}
