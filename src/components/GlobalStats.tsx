import { Star, TrendingUp, Tally5, Heart } from 'lucide-react';

interface GlobalStatsProps {
  popularity: number;
  vote_average: number;
  vote_count: number;
  likesCount: number;
  variant?: 'movie' | 'tv-series';
}

export function GlobalStats({
  popularity,
  vote_average,
  vote_count,
  likesCount,
  variant = 'movie'
}: GlobalStatsProps) {
  // Use responsive gap for movies, fixed gap for TV series
  const gapClass = variant === 'movie' ? 'gap-2 md:gap-8' : 'gap-8';

  return (
    <div className={`flex ${gapClass} leading-relaxed mb-3 md:mb-0`}>
      <div className='text-center'>
        <span className='text-md font-bold text-gray-500'>POPULARITY</span>
        <br />
        <span className='flex gap-1 items-center justify-center'>
          <TrendingUp className='w-4 h-4' /> {Math.floor(popularity)}
        </span>
      </div>

      <div className='text-center'>
        <span className='text-md font-bold text-gray-500'>RATING</span>
        <br />
        <span className='flex gap-1 items-center justify-center'>
          <Star className='w-4 h-4' /> {vote_average.toFixed(1)}
        </span>
      </div>

      <div className='text-center'>
        <span className='text-md font-bold text-gray-500'>VOTE COUNT</span>
        <br />
        <span className='flex gap-1 items-center justify-center'>
          <Tally5 className='w-4 h-4' /> {vote_count}
        </span>
      </div>

      <div className='text-center'>
        <span className='text-md font-bold text-gray-500'>LIKES</span>
        <br />
        <span className='flex gap-1 items-center justify-center'>
          <Heart className='w-4 h-4' /> {likesCount}
        </span>
      </div>
    </div>
  );
}
