import Link from 'next/link';
import { Chip } from "@heroui/react";
import { MovieGenre } from '@/types/movie';
import { TvSeriesGenre } from '@/types/tvSeries';

interface GlobalGenresProps {
  genres?: MovieGenre[] | TvSeriesGenre[] | undefined;
  mediaType: 'movie' | 'tv-series';
}

export function GlobalGenres({ genres, mediaType }: GlobalGenresProps) {
  if (!genres || genres.length === 0) return null;

  const baseUrl = mediaType === 'movie' ? '/movies' : '/tv-series';

  return (
    <div>
      {genres.map((g) => (
        <Link href={`${baseUrl}?g=${g.id}`} key={g.id} className='mr-2'>
          <Chip
            size="md"
            color="primary"
            variant="dot"
            className='hover:bg-[#F5A525] hover:border-[#F5A525]'
          >
            {g.name}
          </Chip>
        </Link>
      ))}
    </div>
  );
}

