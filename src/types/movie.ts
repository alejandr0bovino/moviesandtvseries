export interface MovieCast {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
  cast_id: number;
  credit_id: string;
}

export interface MovieCrew {
  id: number;
  name: string;
  job: string;
  department: string;
  credit_id: string;
}

export interface MovieGenre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
}

export interface Movie {
  original_language: string;
  origin_country: string;
  original_title: string;
  homepage: any;
  title: string;
  overview: string;
  release_date: string;
  imdb_id: string;
  poster_path?: string;
  youtubeTrailerKey?: string;
  backdrop_path?: string;
  runtime: number;
  popularity: number;
  tagline: string;
  vote_average: number;
  vote_count: number;
  status: string;
  budget: number;
  revenue?: number;
  cast?: MovieCast[];
  crew?: MovieCrew[];
  genres?: MovieGenre[];
  production_companies?: ProductionCompany[];
  id?: number;
}
