import CloseIcon from '@/icons/close';
import FiltersIcon from '@/icons/filter';
import TitleSearchInput from '@/components/TitleSearchInput';

interface GlobalSearchSectionProps {
  titleQuery: string;
  filtersVisible: boolean;
  onTitleSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onFiltersToggle: () => void;
}

export default function GlobalSearchSection({
  titleQuery,
  filtersVisible,
  onTitleSearchChange,
  onClearSearch,
  onFiltersToggle,
}: GlobalSearchSectionProps) {
  return (
    <div className='block xl:flex xl:flex-5 gap-4 items-center'>
      <TitleSearchInput
        className="cm-input max-w-[420px] w-[320px] sm:w-[420px] block  xl:mx-0 mb-3 xl:mb-0 m-auto mb-3 xl:mb-0"
        value={titleQuery}
        onChange={onTitleSearchChange}
        placeholder="Search by title..."
      />

      {titleQuery ? (
        <button
          onClick={onClearSearch}
          className="px-3.5 py-1.5 cursor-pointer rounded-full bg-gray-200 flex gap-1 items-center text-sm h-[38px] m-auto xl:mx-0 mb-3 xl:my-0"
        >
          <CloseIcon /> Clear search
        </button>
      ) : null}

      <button
        onClick={onFiltersToggle}
        className="hidden xl:flex gap-2 px-3.5 py-1.5 bg-gray-200 rounded-full cursor-pointer items-center text-sm h-[38px]"
      >
        <FiltersIcon /> {filtersVisible ? 'Hide filters' : 'Show filters'}
      </button>
    </div>
  );
}