import React from "react";
import Link from 'next/link';
import { InfiniteMovieQuotes } from "@/components/ui/infinit-movie-quotes";
import { ScreenLegends } from "@/components/ScreenLegends";
import { LandingHero } from "@/components/LandingHero";
import MovieTabs from "@/components/MovieTabs";
import GlitchLogo from '@/components/GlitchLogo';
import { TextFlip } from "@/components/ui/text-flip";
import { Ellipsis } from "lucide-react";
import { movieQuotes, movieQuotes2, genreWords } from "@/constants/landing";

export default function Home() {
  return (
    <div>
      <nav className="c-main-nav">
        <div className="w-full max-w-screen-xl px-4 mx-auto flex flex-wrap items-center justify-between pt-4">

          <GlitchLogo />

          <div className="w-auto hidden sm:block">
            <ul className="flex flex-row md:p-0 space-x-8 md:mt-0 font-extrabold text-gray-200">
              <li>
                <Link href={`/movies/`} prefetch={true} className="hover:text-gray-300 transition">Movies</Link>
              </li>
              <li>
                <Link href={`/tv-series/`} prefetch={true} className="hover:text-gray-300 transition" >TV Series</Link>
              </li>
              <li>
                <Link href={`/people/`} prefetch={true} className="hover:text-gray-300 transition" >People</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <LandingHero />

      <div className="w-full max-w-screen-xl flex flex-col md:flex-row justify-center items-center px-4 mx-auto mt-14 font-bold">
        <div className="text-3xl md:text-5xl mb-4 md:mb-0 text-center md:text-left">Movies and TV Series about</div>
        <TextFlip className="cm-text-flip text-4xl md:text-5xl px-2" words={genreWords} />
      </div>

      <MovieTabs />

      <div className="w-full max-w-screen-xl px-4 mx-auto mb-20 text-2xl text-center leading-9">
        <p>
          Discover your next favorite film with our Movies app! Explore a vast collection of titles, from the latest blockbusters to timeless classics. Dive into detailed movie information, find new releases, and easily browse by genre or year. Your ultimate cinematic journey starts here.
        </p>
      </div>


      <div className="bg-gray-200 pt-10 md:pt-20 pb-20 md:pb-0 px-5 sm:px-0">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-black mb-14 md:mb-20">Hollywood Screen Legends</h2>
        <ScreenLegends />
      </div>

      <div className="cm-infinite pt-20 mb-15">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-black mb-10">Movie Quotes</h2>

        <p className="w-full max-w-screen-xl px-4 mx-auto mb-10 text-2xl text-center leading-9">
          Iconic lines, unforgettable moments.
          Relive the words that defined cinema.<br />
          Your favorite movie quotes, all in one place.
        </p>

        <div>
          <InfiniteMovieQuotes
            items={movieQuotes}
            direction="right"
            speed="slow"
          />
        </div>

        <div>
          <InfiniteMovieQuotes
            items={movieQuotes2}
            direction="left"
            speed="normal"
          />
        </div>
      </div>

      <div className="flex justify-center text-4xl text-gray-400">
        <Ellipsis size={40} />
      </div>
    </div>
  )
}