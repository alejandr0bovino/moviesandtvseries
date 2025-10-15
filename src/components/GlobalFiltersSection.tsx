'use client';

import { Tooltip } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import CloseIcon from '@/icons/close';
import { SelectYearFilter } from '@/components/SelectYearFilter';
import { SelectGenreFilter } from '@/components/SelectGenreFilter';

interface SortOption {
  value: string;
  label: string;
}

interface GlobalFiltersSectionProps {
  year: string;
  genre: string;
  sort: string;
  titleQuery: string;
  isFilterAnimating: boolean;
  genreOptions: Array<{ key: string; label: string }>;
  sortOptions: SortOption[];
  onYearChange: (year: string) => void;
  onGenreChange: (genre: string) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: (defaultSort: string) => void;
}

export default function GlobalFiltersSection({
  year,
  genre,
  sort,
  titleQuery,
  isFilterAnimating,
  genreOptions,
  sortOptions,
  onYearChange,
  onGenreChange,
  onSortChange,
  onClearFilters,
}: GlobalFiltersSectionProps) {
  const renderSortSelect = (isDisabled: boolean) => (
    <Select
      selectedKeys={[sort]}
      onSelectionChange={keys => {
        const selected = Array.from(keys)[0];
        onSortChange(selected as string);
      }}
      className="w-65 block mx-auto md:block md:mx-auto xl:mx-0 mb-3 xl:mb-0 cm-select"
      isDisabled={isDisabled}
      radius="full"
      popoverProps={{ shouldBlockScroll: false }}
      size="lg"
      startContent={
        <svg width="24px" height="24px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path fill="#000000" d="M384 96a32 32 0 0164 0v786.752a32 32 0 01-54.592 22.656L95.936 608a32 32 0 010-45.312h.128a32 32 0 0145.184 0L384 805.632V96zm192 45.248a32 32 0 0154.592-22.592L928.064 416a32 32 0 010 45.312h-.128a32 32 0 01-45.184 0L640 218.496V928a32 32 0 11-64 0V141.248z" />
        </svg>
      }
    >
      {sortOptions.map(option => (
        <SelectItem key={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );

  const defaultSort = sortOptions[0]?.value || 'popularity.desc';

  return (
    <div className="block xl:flex xl:gap-4 xl:items-center">
      <SelectYearFilter
        selectedYear={year}
        onYearChange={onYearChange}
        className="max-w-[210px] block mx-auto md:block md:mx-auto xl:mx-0 mb-3 xl:mb-0 cm-autocomplete"
      />

      <SelectGenreFilter
        selectedGenre={genre}
        onGenreChange={onGenreChange}
        genreOptions={genreOptions}
        className="max-w-[265px] block mx-auto md:block md:mx-auto xl:mx-0 mb-3 xl:mb-0 cm-autocomplete"
      />

      {titleQuery && !isFilterAnimating ? (
        <Tooltip content="Sorting is disabled when searching by title" color="foreground">
          <div>
            {renderSortSelect(true)}
          </div>
        </Tooltip>
      ) : (
        <div>
          {renderSortSelect(!!titleQuery)}
        </div>
      )}

      {(year || genre || sort !== defaultSort) && (
        <button
          onClick={() => onClearFilters(defaultSort)}
          className="px-3.5 py-1.5 cursor-pointer rounded-full bg-gray-200 
                    text-base flex gap-1 items-center text-sm h-[38px] m-auto xl:mx-0 mb-3 xl:my-0"
        >
          <CloseIcon /> Clear filters
        </button>
      )}
    </div>
  );
}
