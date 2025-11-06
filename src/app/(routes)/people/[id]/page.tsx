'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';
import { Spinner } from '@heroui/react';
import Imdb2Icon from "@/icons/imdb2"
import { IconPhotoOff, IconStarFilled } from "@tabler/icons-react";

interface Person {
  name: string;
  biography: string;
  birthday: string;
  place_of_birth: string;
  profile_path?: string;
  imdb_id?: string;
  known_for_department: string;
  credits?: {
    cast: Array<{
      id: number;
      title?: string;
      name?: string;
      poster_path?: string;
      media_type: string;
      character?: string;
      job?: string;
      department?: string;
      vote_average?: number;
      vote_count?: number;
    }>;
    crew: Array<{
      id: number;
      title?: string;
      name?: string;
      poster_path?: string;
      media_type: string;
      character?: string;
      job?: string;
      department?: string;
      vote_average?: number;
      vote_count?: number;
    }>;
  }
}

export default function PersonPage() {
  const { id } = useParams();
  const [person, setPerson] = useState<Person | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showFullBiography, setShowFullBiography] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const biographyRef = useRef<HTMLDivElement>(null);
  const [biographyHeight, setBiographyHeight] = useState<number>(0);
  const fullBiographyRef = useRef<HTMLDivElement>(null);
  const truncatedBiographyRef = useRef<HTMLDivElement>(null);
  const moviesScrollRef = useRef<HTMLDivElement>(null);

  // Function to truncate biography to 4 lines
  const truncateBiography = (text: string, maxLines: number = 4) => {
    const words = text.split(' ');
    const lineLength = 80; // Approximate characters per line
    const maxChars = lineLength * maxLines;

    if (text.length <= maxChars) return text;

    let truncated = '';
    let currentLength = 0;

    for (const word of words) {
      if (currentLength + word.length + 1 <= maxChars) {
        truncated += (truncated ? ' ' : '') + word;
        currentLength += word.length + 1;
      } else {
        break;
      }
    }

    return truncated + '...';
  };

  // Function to format biography with proper paragraph breaks
  const formatBiography = (text: string) => {
    // Split by double line breaks (common paragraph separator)
    const paragraphs = text.split(/\n\s*\n/);

    // If no double line breaks, try single line breaks
    if (paragraphs.length === 1) {
      const singleLineBreaks = text.split(/\n/);
      if (singleLineBreaks.length > 1) {
        return singleLineBreaks.map((paragraph, index) => (
          <span key={index}>
            {paragraph.trim()}
            {index < singleLineBreaks.length - 1 && <br />}
          </span>
        ));
      }
    }

    // Return paragraphs with proper spacing
    return paragraphs.map((paragraph, index) => (
      <span key={index}>
        {paragraph.trim()}
        {index < paragraphs.length - 1 && (
          <>
            <br />
            <br />
          </>
        )}
      </span>
    ));
  };

  const handleBiographyToggle = () => {
    setIsTransitioning(true);
    setShowFullBiography(!showFullBiography);

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Match the CSS transition duration
  };

  // Calculate max height for transitions
  const getMaxHeight = () => {
    if (!person?.biography) return 'auto';

    // Estimate height based on character count and line height
    // text-lg class increases line height, so we need to account for that
    const lineHeight = 28; // Increased from 24 to account for text-lg class
    const charsPerLine = 75; // Slightly reduced to account for larger text
    const lines = Math.ceil(person.biography.length / charsPerLine);

    if (showFullBiography) {
      return `${lines * lineHeight}px`;
    } else {
      // For truncated version, use 4 lines
      return `${4 * lineHeight}px`;
    }
  };

  // Calculate biography height when content changes
  useEffect(() => {
    if (biographyRef.current) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        if (biographyRef.current) {
          const height = biographyRef.current.scrollHeight;
          setBiographyHeight(height);
        }
      }, 10);
    }
  }, [person?.biography, showFullBiography]);

  useEffect(() => {
    const fetchPerson = async () => {
      if (!id) return;

      try {
        const res = await fetch(`/api/people/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch person data');
        }
        const data: Person = await res.json();
        setPerson(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerson();
  }, [id]);

  if (error) {
    return (
      <>
        <hr className="mt-3 mb-6 hr-text" data-content="PERSON INFO" />
        <p>Error: {error}</p>
      </>
    );
  }

  if (!person) return (
    <>
      <hr className="mt-3 mb-6 hr-text" data-content="PERSON INFO" />
      <div className="flex justify-center items-center h-104 pt-10">
        <Spinner size="lg" />
      </div>
    </>
  );

  // Get all movies from both cast and crew credits
  const allMovies = [
    ...(person.credits?.cast || []).filter(item => item.media_type === 'movie'),
    ...(person.credits?.crew || []).filter(item => item.media_type === 'movie')
  ];

  // Get all TV series from both cast and crew credits
  const allTVSeries = [
    ...(person.credits?.cast || []).filter(item => item.media_type === 'tv'),
    ...(person.credits?.crew || []).filter(item => item.media_type === 'tv')
  ];

  // Remove duplicates and sort by popularity (vote_average and vote_count)
  const uniqueMovies = allMovies
    .filter((movie, index, self) =>
      index === self.findIndex(m => m.id === movie.id)
    )
    .sort((a, b) => {
      // Sort by popularity: first by vote_average, then by vote_count
      const aScore = (a.vote_average || 0) * (a.vote_count || 0);
      const bScore = (b.vote_average || 0) * (b.vote_count || 0);
      return bScore - aScore;
    })
    .slice(0, 20); // Limit to 20 movies

  const uniqueTVSeries = allTVSeries
    .filter((tv, index, self) =>
      index === self.findIndex(t => t.id === tv.id)
    )
    .sort((a, b) => {
      // Sort by popularity: first by vote_average, then by vote_count
      const aScore = (a.vote_average || 0) * (a.vote_count || 0);
      const bScore = (b.vote_average || 0) * (b.vote_count || 0);
      return bScore - aScore;
    })
    .slice(0, 20); // Limit to 20 TV series

  return (
    <>
      <hr className="mt-3 mb-6 hr-text" data-content="PERSON INFO" />

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <Image
            src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
            alt={person.name}
            width={233}
            height={350}
            className="rounded-2xl saturate-65"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallbackDiv = target.nextElementSibling as HTMLElement;
              if (fallbackDiv) {
                fallbackDiv.style.display = 'flex';
              }
            }}
          />
          <div
            className="hidden flex-col items-center justify-center bg-gray-200 rounded-2xl text-gray-500 text-xs font-medium text-center"
            style={{ width: "233px", height: "350px" }}
          >
            <IconPhotoOff />
            Image not <br /> available
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-4">
            <h1 className='text-4xl font-semibold mb-6'>{person.name}</h1>
            <div
              ref={biographyRef}
              className="text-gray-700 text-lg overflow-hidden transition-all duration-600 ease-in-out"
              style={{
                maxHeight: getMaxHeight()
              }}
            >
              {person.biography ? (
                showFullBiography
                  ? formatBiography(person.biography)
                  : truncateBiography(person.biography)
              ) : 'Biography not available.'}
            </div>
            {person.biography && person.biography.length > 320 && (
              <button
                onClick={handleBiographyToggle}
                disabled={isTransitioning}
                className={`cursor-pointer mt-4 font-medium border border-gray-300 rounded-full px-4 py-1 transition-all duration-200 ease-in-out ${isTransitioning
                  ? ''
                  : ''
                  }`}
              >
                {showFullBiography ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          <hr className="mt-4 mb-4 hr-text" />

          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Personal Info</h2>
            <p><strong>Known For:</strong> {person.known_for_department}</p>
            {person.birthday && <p><strong>Birthday:</strong> {person.birthday}</p>}
            {person.place_of_birth && <p><strong>Place of Birth:</strong> {person.place_of_birth}</p>}
          </div>

          {person.imdb_id && (
            <p className="mb-4">
              <Link
                href={`https://www.imdb.com/name/${person.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-[48px] saturate-[.80]"
              >
                <Imdb2Icon />
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Filmography Summary */}
      {(uniqueMovies.length > 0 || uniqueTVSeries.length > 0) && (
        <div className="mt-12 mb-6">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span>{uniqueMovies.length} Movies</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              <span>{uniqueTVSeries.length} TV Series</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>{uniqueMovies.length + uniqueTVSeries.length} Total Credits</span>
            </div>
          </div>
        </div>
      )}

      {/* Known For Section - Most Popular Works */}
      {(uniqueMovies.length > 0 || uniqueTVSeries.length > 0) && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6">Known For</h2>
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
            {[...uniqueMovies.slice(0, 8), ...uniqueTVSeries.slice(0, 8)]
              .sort((a, b) => {
                const aScore = (a.vote_average || 0) * (a.vote_count || 0);
                const bScore = (b.vote_average || 0) * (b.vote_count || 0);
                return bScore - aScore;
              })
              .slice(0, 8)
              .map((item) => (
                <div
                  key={item.id}
                  className="min-w-[160px] flex-shrink-0"
                >
                  <Link href={`/${item.media_type === 'movie' ? 'movies' : 'tv-series'}/${item.id}`}>
                    <div className="relative">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                          alt={item.title || item.name || 'Title'}
                          width={160}
                          height={240}
                          className="rounded-xl saturate-65"
                        />
                      ) : (
                        <div className="w-[160px] h-[240px] bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500 text-sm font-medium text-center">
                          <IconPhotoOff className='mb-2' />
                          Image not <br /> available
                        </div>
                      )}

                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {item.media_type === 'movie' ? 'Movie' : 'TV'}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 backdrop-blur-sm text-white px-2 py-2.5 rounded-b-lg">

                        <p className="text-xs font-medium truncate">
                          {item.character || item.job || 'Actor'}
                        </p>
                      </div>
                    </div>

                    <h3 className="mt-2 text-sm font-medium text-gray-900 line-clamp-2 max-w-[160px]">
                      {item.title || item.name || 'Unknown Title'}
                    </h3>
                    {item.vote_average && (
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-xs text-yellow-600">
                          <IconStarFilled size={16} />
                        </span>
                        <span className="text-xs text-gray-600">
                          {item.vote_average.toFixed(1)} ({item.vote_count?.toLocaleString() || 0})
                        </span>
                      </div>
                    )}
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Movies Section */}
      {uniqueMovies.length > 0 && (
        <div className="mt-4">
          <h2 className="text-2xl font-semibold mb-6">Movies</h2>
          <div
            ref={moviesScrollRef}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-4"
          >
            {uniqueMovies.map((movie) => (
              <div
                key={movie.id}
                className="min-w-[160px] flex-shrink-0"
              >
                <Link href={`/movies/${movie.id}`}>
                  <div className="relative">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={movie.title || movie.name || 'Movie'}
                        width={160}
                        height={240}
                        className="rounded-xl saturate-65"
                      />
                    ) : (
                      <div className="w-[160px] h-[240px] bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500 text-sm font-medium text-center">
                        <IconPhotoOff className='mb-2' />
                        Image not <br /> available
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 backdrop-blur-sm text-white px-2 py-2.5 rounded-b-lg">
                      <p className="text-xs font-medium truncate">
                        {movie.character || movie.job || 'Actor'}
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-2 text-sm font-medium text-gray-900 line-clamp-2 max-w-[160px]">
                    {movie.title || movie.name || 'Unknown Title'}
                  </h3>
                  {movie.vote_average && (
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-xs text-yellow-600">
                        <IconStarFilled size={16} />
                      </span>
                      <span className="text-xs text-gray-600">
                        {movie.vote_average.toFixed(1)} ({movie.vote_count?.toLocaleString() || 0})
                      </span>
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TV Series Section */}
      {uniqueTVSeries.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">TV Series</h2>
          <div
            ref={moviesScrollRef}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-4"
          >
            {uniqueTVSeries.map((tv) => (
              <div
                key={tv.id}
                className="min-w-[160px] flex-shrink-0"
              >
                <Link href={`/tv-series/${tv.id}`}>
                  <div className="relative">
                    {tv.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${tv.poster_path}`}
                        alt={tv.name || 'TV Serie'}
                        width={160}
                        height={240}
                        className="rounded-xl saturate-65"
                      />
                    ) : (
                      <div className="w-[160px] h-[240px] bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500 text-sm font-medium text-center">
                        <IconPhotoOff className='mb-2' />
                        Image not <br /> available
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 backdrop-blur-sm text-white px-2 py-2.5 rounded-b-lg">
                      <p className="text-xs font-medium truncate">
                        {tv.character || tv.job || 'Actor'}
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-2 text-sm font-medium text-gray-900 line-clamp-2 max-w-[160px]">
                    {tv.name || 'Unknown Title'}
                  </h3>
                  {tv.vote_average && (
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-xs text-yellow-600">
                        <IconStarFilled size={16} />
                      </span>
                      <span className="text-xs text-gray-600">
                        {tv.vote_average.toFixed(1)} ({tv.vote_count?.toLocaleString() || 0})
                      </span>
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}