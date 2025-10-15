'use client';

import GridViewIcon from '@/icons/gridView';
import ListViewIcon from '@/icons/listView';
import { ViewMode } from '@/types/movies';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeToggle: (mode: ViewMode) => void;
}

export default function ViewToggle({ viewMode, onViewModeToggle }: ViewToggleProps) {
  return (
    <div className="flex justify-center xl:justify-end mb-3 xl:mb-0">
      {viewMode === 'grid' ? (
        <>
          <button className="px-4 py-1.5 border border-2 rounded-l-full bg-gray-200 flex gap-2 items-center text-sm h-[38px]">
            <GridViewIcon /> Grid view
          </button>
          <button
            onClick={() => onViewModeToggle('list')}
            className="cursor-pointer px-4 py-1.5 border border-2 rounded-r-full border-gray-200 flex gap-2 items-center text-sm h-[38px]"
          >
            <ListViewIcon /> List view
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => onViewModeToggle('grid')}
            className="cursor-pointer px-4 py-1.5 border border-2 rounded-l-full border-gray-200 flex gap-2 items-center text-sm h-[38px]"
          >
            <GridViewIcon /> Grid view
          </button>
          <button className="px-4 py-1.5 border border-2 rounded-r-full bg-gray-200 flex gap-2 items-center text-sm h-[38px]">
            <ListViewIcon /> List view
          </button>
        </>
      )}
    </div>
  );
}