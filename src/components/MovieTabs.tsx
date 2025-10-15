"use client";

import { Tabs } from "@/components/ui/tabs";
import MovieList from "@/components/MovieList";
import { movieTabsConfig } from "@/constants/movies";

export default function MovieTabs() {
  const movieTabs = movieTabsConfig.map((tab) => ({
    title: tab.title,
    value: tab.value,
    content: (
      <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-gray-200">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-8">{tab.title}</h2>
        <MovieList fetchUrl={tab.fetchUrl} />
      </div>
    ),
  }));

  return (
    <div className="h-[35rem] sm:h-[43.5rem] px-5 lg:px-0 [perspective:988px] relative b
        flex flex-col max-w-[991px] mx-auto w-full items-start justify-start mt-10 mb-40 text-xl font-medium">
      <Tabs tabs={movieTabs} />
    </div>
  );
}
