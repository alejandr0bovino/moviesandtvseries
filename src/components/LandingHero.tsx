"use client"
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";

export function LandingHero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col h-[44rem] w-full overflow-hidden bg-black/[0.96] antialiased items-center justify-center">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
        )}
      />

      <Spotlight
        className={cn(
          "-top-40 left-0 md:-top-20 md:left-60",
          isMounted ? "animate-spotlight" : "opacity-0"
        )}
        fill="white"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-0 md:pt-0">
        <h1
          className={cn(
            "cm-aurora-home-text bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center font-bold text-transparent text-5xl md:text-7xl",
            "transition-all duration-750 ease-in",
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          Where every screen<br /> tells a story
        </h1>
        <p
          className={cn(
            "mx-auto mt-4 max-w-lg text-center text-neutral-300 text-lg md:text-2xl",
            "transition-all duration-550 ease-in delay-200",
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"
          )}
        >
          Uncover a new favorite every day with an endless library of movies and tv series designed for your perfect escape.
        </p>
      </div>

      <div
        className={cn(
          "flex mt-5 relative",
          "transition-all duration-500 ease-in delay-[520ms]",
          isMounted ? "opacity-100" : "opacity-0 -mb-2.5"
        )}
      >
        <Link href={`/movies/`} prefetch={true} className="block bg-white font-medium hover:bg-gray-300 rounded-full text-2xl px-5 py-2.5 text-center transition duration-400">Movies</Link>

        <Link href={`/tv-series/`} prefetch={true} className="ml-[20] block bg-transparent text-white border-1 border-white
            font-medium rounded-full text-2xl px-5 py-2.5 text-center transition duration-400 hover:border-gray-300 hover:text-gray-300">
          TV Series</Link>
      </div>
    </div>
  );
}