import Image from 'next/image';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr';
import { Movie } from '@/types/movie';
import { TvSeries } from '@/types/tvSeries';

interface GlobalMediaProps {
  media: Movie | TvSeries;
}

export function GlobalMedia({ media }: GlobalMediaProps) {
  // Helper function to get the title based on media type
  const getTitle = () => {
    return 'title' in media ? media.title : media.name;
  };

  if (media.youtubeTrailerKey) {
    return (
      <div className='cm-vplayer rounded-2xl saturate-65 flex-shrink-0 mb-4 lg:mb-0'>
        <MediaPlayer
          title={getTitle()}
          poster={`https://image.tmdb.org/t/p/w500/${media.backdrop_path}`}
          aspectRatio="16:9"
          autoPlay={false}
          preload="metadata"
          src={`https://www.youtube.com/embed/${media.youtubeTrailerKey}`}
        >
          <MediaProvider />
          <PlyrLayout icons={plyrLayoutIcons} />
        </MediaPlayer>
      </div>
    );
  }

  if (media.backdrop_path) {
    return (
      <div className='relative w-auto h-auto lg:w-[622px] lg:h-[350px] flex-shrink-0'>
        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-2xl font-bold z-9'>
          Trailer not available
        </div>
        <Image
          src={`https://image.tmdb.org/t/p/w500/${media.backdrop_path}`}
          alt={getTitle()}
          width={622}
          height={350}
          className="rounded-2xl saturate-65"
        />
      </div>
    );
  }

  return null;
}
