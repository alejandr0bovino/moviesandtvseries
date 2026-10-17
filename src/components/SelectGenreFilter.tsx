import type { Key } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

interface GenreOption {
  key: string;
  label: string;
}

interface SelectGenreFilterProps {
  selectedGenre: string;
  onGenreChange: (genreId: string) => void;
  genreOptions: GenreOption[];
  className?: string;
}

export function SelectGenreFilter({
  selectedGenre,
  onGenreChange,
  genreOptions,
  className,
}: SelectGenreFilterProps) {
  const handleSelectionChange = (val: Key | null) => {
    const selected = val?.toString() || "";

    // Always call onGenreChange, even if it's the same value
    // This ensures the parent component can handle the state properly
    onGenreChange(selected);

    // HeroUI opens the list when the clear button is pressed. Blur only after
    // a real selection so clearing keeps the dropdown open.
    if (val == null) return;

    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        activeElement.blur();
      }
    }, 0);
  };

  return (
    <Autocomplete
      // key={`genre-${selectedGenre}`}
      aria-label="Genre"
      selectedKey={selectedGenre || null}
      classNames={{
        base: className || "max-w-[240px] block mx-auto md:block md:mx-auto xl:mx-0 mb-3 xl:mb-0 cm-autocomplete",
      }}
      defaultItems={genreOptions}
      onSelectionChange={handleSelectionChange}
      inputProps={{
        classNames: {
          input: "ml-1 text-base",
          inputWrapper: "h-[52px]",
        },
      }}
      placeholder="Select genre"
      radius="full"
      startContent={
        <svg width="26px" height="26px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 2.5H15M3 7.5H12M5 12.5H10" stroke="#000000" />
        </svg>
      }
      variant="bordered"
      allowsCustomValue={false}
    >
      {(item) => (
        <AutocompleteItem
          key={item.key}
          className="flex hover:!bg-gray-200 items-center justify-between"
        >
          {item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}