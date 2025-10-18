'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

import { Alert } from "@heroui/react"; // Removed Input as it's now in TitleSearchInput
import CloseIcon from '@/icons/close';
import GridViewIcon from '@/icons/gridView';
import ListViewIcon from '@/icons/listView';
import TitleSearchInput from '@/components/TitleSearchInput'; // Import the TitleSearchInput component
import { ShareButton } from '@/components/ShareButton';
import { MovieSkeletonGrid } from '@/components/MovieSkeletonGrid';
import { IconPhotoOff } from '@tabler/icons-react';

type KnownFor = {
  title?: string;
  name?: string;
};

type People = {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for?: KnownFor[];
};

export default function People() {
  const [people, setPeople] = useState<People[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('s') || '');
  const defaultViewMode = searchParams.get('v') === 'list' ? 'list' : 'grid';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultViewMode);
  const router = useRouter();

  const updateQueryParams = ({
    s = '',
    v = 'grid',
  }: {
    s?: string;
    v?: 'grid' | 'list';
  }) => {
    const params = new URLSearchParams();
    if (s) params.set('s', s);
    if (v) params.set('v', v);
    router.push(`/people?${params.toString()}`);
  };

  const fetchPeoplex = async (
    name = searchTerm
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (name) params.append('query', name);

      const response = await fetch(`/api/people?${params.toString()}`);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPeople(data.results);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const v = searchParams.get('v') === 'list' ? 'list' : 'grid';
    setViewMode(v);

    const timeout = setTimeout(() => {
      fetchPeoplex(searchTerm);
    }, 420);

    return () => clearTimeout(timeout);
  }, [searchTerm]); // Depend only on searchTerm for fetching


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // New handler for search term changes using the TitleSearchInput component
  const handleSearchTermChange = (val: string) => {
    setSearchTerm(val);
    updateQueryParams({ s: val, v: viewMode }); // Update query params for search term
  };

  // Helper to decide skeleton count
  const getSkeletonCount = () => {
    if (searchTerm) return 6; // Searching: fewer results expected
    return 20; // Browsing: full page
  };


  return (
    <>
      <hr className="mt-3 mb-6 hr-text" data-content="PEOPLE" />

      <div className="mb-6 xl:flex items-center gap-4">

        <div className='flex-5 xl:flex gap-4 items-center'>

          <TitleSearchInput
            className="cm-input max-w-[420px] w-[320px] sm:w-[420px] block  xl:mx-0 mb-3 xl:mb-0 m-auto mb-3 xl:mb-0"
            value={searchTerm}
            onChange={handleSearchTermChange}
            placeholder="Search by name..."
          />

          {(searchTerm) && (
            <button
              onClick={() => {
                setLoading(true);
                setSearchTerm('');
                updateQueryParams({ s: '', v: viewMode });
              }}
              className="px-3.5 py-1.5 cursor-pointer rounded-full bg-gray-200 flex gap-1 items-center text-sm h-[38px] mx-auto xl:mx-0 mb-3 xl:mb-0"
            >
              <CloseIcon /> Clear search
            </button>
          )}
        </div>

        {viewMode && (
          <div className="flex justify-center xl:justify-end mb-3 xl:mb-0">

            {viewMode === 'grid' ? (
              <>
                <button
                  className="px-4 py-1.5 border border-2 rounded-l-full bg-gray-200 flex gap-2 items-center text-sm h-[38px]"
                >
                  <GridViewIcon /> Grid view
                </button>

                <button
                  onClick={() => {
                    setViewMode('list');
                    updateQueryParams({ s: searchTerm, v: 'list' });
                  }}
                  className="cursor-pointer px-4 py-1.5 border border-2 rounded-r-full border-gray-200 flex gap-2 items-center text-sm h-[38px]"
                >
                  <ListViewIcon /> List view
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setViewMode('grid');
                    updateQueryParams({ s: searchTerm, v: 'grid' });
                  }}
                  className="cursor-pointer px-4 py-1.5 border border-2 rounded-l-full border-gray-200 flex gap-2 items-center text-sm h-[38px]"
                >
                  <GridViewIcon /> Grid view
                </button>

                <button
                  className="px-4 py-1.5 border border-2 rounded-r-full bg-gray-200 flex gap-2 items-center text-sm h-[38px]"
                >
                  <ListViewIcon /> List view
                </button>
              </>
            )}
          </div>
        )}

        <ShareButton />

      </div>

      <hr className="mb-6.5 hr-text" />

      <div>
        {error && <p>Error: {error}</p>}
        {!loading && people.length === 0 && (
          <div className="flex items-center justify-center w-70 m-auto h-64">
            <Alert description="Please try a different search." title="No results found" variant="bordered" />
          </div>
        )}
        {loading ? (
          <MovieSkeletonGrid count={getSkeletonCount()} viewMode={viewMode} />
        ) : (

          <div className="space-y-10">
            <ul
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 justify-items-center'
                  : 'flex flex-col gap-6'
              }
            >
              {people.map((person) => (
                <li
                  key={person.id}
                  className={viewMode === 'list' ? 'w-full group' : ''}
                >
                  {viewMode === 'list' ? (
                    <Link
                      href={`/people/${person.id}`}
                      className="flex gap-6 w-full p-4 rounded-xl border border-gray-300 shadow-sm hover:shadow-xl transition duration-300
                         bg-white"
                    >
                      <div className="w-28 relative flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
                          alt={person.name}
                          width={124}
                          height={168}
                          style={{ width: "124px", height: "168px" }}
                          className="object-cover rounded saturate-65"
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
                          className="hidden flex-col items-center justify-center bg-gray-200 rounded text-gray-500 text-xs font-medium text-center"
                          style={{ width: "113px", height: "168px" }}
                        >
                          <IconPhotoOff className='mb-2' />
                          Image not <br /> available
                        </div>
                      </div>
                      <div className="transform transition-transform duration-300 group-hover:translate-x-2">
                        <h3 className="text-xl font-semibold mb-2">{person.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{person.known_for_department}</p>
                        <div className='text-xs text-gray-500 mb-2'>Known for: &nbsp;
                          <span className="text-sm text-gray-500">
                            {person.known_for
                              ?.slice(0, 3)
                              .map((item) => item.title || item.name)
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link href={`/people/${person.id}`}>
                      <div className="group p-4 bg-white rounded-xl border border-gray-300 shadow-sm
                      hover:shadow-xl transition duration-300 w-[229px] text-sm hover:text-gray-600">
                        <div className="relative h-70 w-full overflow-hidden rounded-md">
                          <Image
                            src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
                            alt={person.name}
                            width={195}
                            height={292}
                            className="w-[195px] h-[292px] object-cover rounded-md saturate-65"
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
                            className="hidden flex-col items-center justify-center bg-gray-200 rounded-md text-gray-500 text-sm font-medium text-center"
                            style={{ width: "195px", height: "292px" }}
                          >
                            <IconPhotoOff className='mb-2' />
                            Image not <br /> available
                          </div>
                        </div>
                        <div className="mt-4 transform transition-transform flex flex-col duration-300 group-hover:translate-x-2">
                          <h3 className="text-lg font-semibold mb-2">{person.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{person.known_for_department}</p>
                          <div className='text-xs text-gray-500 mb-2'>Known for: &nbsp;

                            <span className="text-sm text-gray-500">
                              {person.known_for
                                ?.slice(0, 3)
                                .map((item) => item.title || item.name)
                                .filter(Boolean)
                                .join(', ')}
                            </span>

                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </li>

              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}