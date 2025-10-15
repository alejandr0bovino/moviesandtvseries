import Link from 'next/link';
import Image from 'next/image';
import { Link as Linkui, Tooltip } from "@heroui/react";
import Imdb2Icon from "@/icons/imdb2";
import { countryCodes } from '@/lib/countryCodes';
import { languageCodes } from '@/lib/languageCodes';
import { Movie } from '@/types/movie';
import { TvSeries } from '@/types/tvSeries';

interface GlobalDetailsProps {
  media: Movie | TvSeries;
  mediaType: 'movie' | 'tv-series';
}

export function GlobalDetails({ media, mediaType }: GlobalDetailsProps) {
  const isMovie = mediaType === 'movie';

  // Type guards for accessing specific properties
  const movie = isMovie ? (media as Movie) : null;
  const tvSeries = !isMovie ? (media as TvSeries) : null;

  // Get the original title based on media type
  const originalTitle = isMovie ? movie?.original_title : tvSeries?.original_name;

  // Get TMDB URL based on media type
  const tmdbUrl = isMovie
    ? `https://www.themoviedb.org/movie/${media.id}`
    : `https://www.themoviedb.org/tv/${media.id}`;

  return (
    <div className='flex flex-col gap-2 p-2'>
      {media.id && (
        <div className='flex gap-4 mb-2 h-6 items-center'>
          <Link href={tmdbUrl} target='_blank'>
            <Image
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="TMDB"
              width={112}
              height={14}
              style={{ width: "112px", height: "14px" }}
              priority
              className="saturate-[.40]"
            />
          </Link>

          {/* Only show IMDB link for movies */}
          {isMovie && movie?.imdb_id && (
            <Link href={`https://www.imdb.com/title/${movie.imdb_id}`} target="_blank" className="saturate-[.80]">
              <Imdb2Icon />
            </Link>
          )}
        </div>
      )}

      {media.homepage && (
        <p className="mb-1">
          <strong>Homepage</strong> {(() => {
            const displayText = media.homepage.replace(/^https?:\/\//, '');
            const isTruncated = displayText.length > 25;
            const finalText = isTruncated ? displayText.substring(0, 25) + '...' : displayText;

            const link = (
              <Linkui underline="always" href={`${media.homepage}`} target='_blank'>
                {finalText}
              </Linkui>
            );

            return isTruncated ? (
              <Tooltip content={media.homepage.replace(/^https?:\/\//, '')} color="foreground">
                {link}
              </Tooltip>
            ) : link;
          })()}
        </p>
      )}

      <p className="mb-1">
        <strong>Origin country</strong> {countryCodes[media.origin_country] || media.origin_country}
      </p>

      <p className="mb-1">
        <strong>Original language</strong> {languageCodes[media.original_language] || media.original_language}
      </p>

      <p className="mb-1">
        <strong>Original title</strong> {originalTitle && originalTitle.length > 25 ? originalTitle.substring(0, 25) + '...' : originalTitle}
      </p>

      {/* Only show budget and revenue for movies */}
      {isMovie && movie && (
        <>
          <p className="mb-1">
            <strong>Budget</strong> {movie.budget ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(movie.budget) : 'Not available'}
          </p>

          <p className="mb-1">
            <strong>Revenue</strong> {movie.revenue ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(movie.revenue) : 'Not available'}
          </p>
        </>
      )}

      <p>
        <strong>Status</strong> {media.status}
      </p>
    </div>
  );
}

