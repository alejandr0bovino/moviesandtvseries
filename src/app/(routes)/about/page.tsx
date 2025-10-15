'use client';

import { useEffect } from 'react';
import MovieIcon from "@/icons/movie";
import { PowerGlitch } from 'powerglitch';

export default function About() {
  useEffect(() => {
    PowerGlitch.glitch('#cm-logo-223',
      {
        "timing": {
          "duration": 4000
        },
        "glitchTimeSpan": {
          "start": 0,
          "end": 0
        },
        "shake": {
          "amplitudeX": 0,
          "amplitudeY": 0
        },
        "slice": {
          "minHeight": 0,
          "maxHeight": 0,
        },
        "pulse": {
          "scale": 1.8
        }
      }
    );
  }, []);


  return (
    <>
      <hr className="mt-3 mb-7 hr-text" data-content="ABOUT" />

      <div className="w-full max-w-screen-xl mx-auto mb-20 flex">

        <div className="flex-3 md:flex-2 hidden sm:block">

          <MovieIcon fill="#CCCCCC" width="200px" height="200px" id="cm-logo-223" />

        </div>

        <div className="flex-8">
          <h1 className='mb-2 text-4xl font-semibold leading-[1.41176]'>About us</h1>

          <div className="text-xl leading-9 mb-9">

            <p>Welcome to Movies & TV Series, your go-to place for exploring the world of movies and TV series.</p>

            <p>We built this website for fans who want more than just trailers and ratings. Here, you can:</p>

            <p>Discover trending movies and shows across genres.</p>

            <p>Dive into detailed cast, crew, and episode info.</p>

            <p>Filter by release year, genre, or streaming platform.</p>

            <p>Save favorites and build your personal watchlist.</p>

            <p>Our goal is simple: make it easier (and more fun) to decide what to watch next. Whether you’re a casual viewer or a hardcore cinephile, CineScope helps you spend less time searching and more time watching.</p>

          </div>

          <h2 className="text-2xl font-semibold mb-2">Tech stack</h2>

          <ul className="text-xl leading-9">
            <li>**Framework**: Next.js 15.5.2 with React 19</li>
            <li>**Database**: PostgreSQL with Prisma ORM</li>
            <li>**Authentication**: Clerk</li>
            <li>**Styling**: Tailwind CSS with HeroUI components</li>
            <li>**Language**: TypeScript</li>
            <li>**Frontend Cloud**: Vercel</li>
          </ul>

        </div>
      </div>
    </>
  );
}





