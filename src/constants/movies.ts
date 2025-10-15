export const movieGenres = [
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' },
  { id: '14', name: 'Fantasy' },
  { id: '36', name: 'History' },
  { id: '27', 'name': 'Horror' },
  { id: '10402', name: 'Music' },
  { id: '9648', name: 'Mystery' },
  { id: '10749', name: 'Romance' },
  { id: '878', name: 'Science Fiction' },
  { id: '10770', name: 'TV Movie' },
  { id: '53', name: 'Thriller' },
  { id: '10752', name: 'War' },
  { id: '37', name: 'Western' },
];

export const tvSeriesGenres = [
  { id: '10759', name: 'Action & Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' },
  { id: '10762', name: 'Kids' },
  { id: '9648', name: 'Mystery' },
  { id: '10763', name: 'News' },
  { id: '10764', 'name': 'Reality' },
  { id: '10765', name: 'Sci-Fi & Fantasy' },
  { id: '10766', name: 'Soap' },
  { id: '10767', name: 'Talk' },
  { id: '10768', name: 'War & Politics' },
  { id: '37', name: 'Western' },
];

export const sortOptions = [
  { value: 'popularity.desc', label: 'Popularity ↓ (default)' },
  { value: 'popularity.asc', label: 'Popularity ↑' },
  { value: 'original_title.desc', label: 'Title ↓' },
  { value: 'original_title.asc', label: 'Title ↑' },
  { value: 'vote_average.desc', label: 'Rating ↓' },
  { value: 'vote_average.asc', label: 'Rating ↑' },
];

export const tvSeriesSortOptions = [
  { value: 'popularity.desc', label: 'Popularity ↓ (default)' },
  { value: 'popularity.asc', label: 'Popularity ↑' },
  { value: 'original_name.desc', label: 'Title ↓' },
  { value: 'original_name.asc', label: 'Title ↑' },
  { value: 'vote_average.desc', label: 'Rating ↓' },
  { value: 'vote_average.asc', label: 'Rating ↑' },
];

export const movieTabsConfig = [
  {
    title: "In theaters",
    value: "in-theaters",
    fetchUrl: "/api/movies/list/featured",
  },
  {
    title: "Popular",
    value: "popular",
    fetchUrl: "/api/movies/list/popular",
  },
  {
    title: "Upcoming",
    value: "upcoming",
    fetchUrl: "/api/movies/list/upcoming",
  },
];
