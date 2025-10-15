export interface TvSeriesCast {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
  cast_id: number;
  credit_id: string;
}

export interface TvSeriesCrew {
  id: number;
  name: string;
  job: string;
  department: string;
  credit_id: string;
}

export interface TvSeriesGenre {
  id: number;
  name: string;
}

export interface TvSeriesSeason {
  id: number;
  name: string;
  air_date: string;
  episode_count: number;
  overview: string;
  poster_path?: string;
  season_number: number;
}

export interface ProductionCompany {
  id: number;
  name: string;
}

export interface TvSeries {
  name: string;
  tagline: string;
  overview: string;
  release_date: string;
  poster_path?: string;
  youtubeTrailerKey?: string;
  first_air_date: string;
  runtime: number;
  popularity: number;
  vote_average: number;
  vote_count: number;
  last_episode_to_air: {
    runtime: number;
    air_date: string;
  };
  homepage: string;
  origin_country: string;
  original_language: string;
  original_name: string;
  budget: number;
  revenue: number;
  status: string;
  cast?: TvSeriesCast[];
  crew?: TvSeriesCrew[];
  genres?: TvSeriesGenre[];
  production_companies?: ProductionCompany[];
  seasons?: TvSeriesSeason[];
  backdrop_path?: string;
  id?: number;
}
