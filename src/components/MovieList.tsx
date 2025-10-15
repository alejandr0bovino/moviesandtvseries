'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Spinner } from '@heroui/react';

import ButtonArrow from '@/components/ui/button-arrow';

type Movie = {
  id: number;
  title: string;
  poster_path: string;
};

interface MovieListProps {
  fetchUrl: string;
}

export default function MovieList({ fetchUrl }: MovieListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMovies(data.results.slice(0, 12));

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [fetchUrl]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      const isScrollable = container.scrollWidth > container.clientWidth;
      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;
      setCanScrollRight(isScrollable && !isAtEnd);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    handleScroll();
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [movies]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.offsetWidth * 1.034;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  if (loading) return <div className="flex justify-center items-center h-94 sm:h-114"><Spinner size="lg" /></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="relative w-full">
      <div className="absolute bottom-0 mb-[-70px] right-0 z-10 flex gap-3">

        <ButtonArrow direction="left" onClick={() => scroll('left')} disabled={!canScrollLeft} />
        <ButtonArrow direction="right" onClick={() => scroll('right')} disabled={!canScrollRight} />
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory"
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="min-w-[40vw] md:min-w-[282px] flex-shrink-0"
          >
            <Link href={`/movies/${movie.id}`} prefetch={true}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={282}
                height={423}
                className="rounded-2xl saturate-65 cm-movie-list-image"
                style={{ width: "282px", height: "423px" }}
                priority={true}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}