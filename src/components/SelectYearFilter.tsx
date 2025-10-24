import React from 'react';
import { Autocomplete, AutocompleteItem } from '@heroui/react';

interface SelectYearFilterProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  className?: string;
}

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 35 }, (_, i) => {
    const y = currentYear - i;
    return { key: y.toString(), label: y.toString() };
  });
};

const years = generateYears();

export function SelectYearFilter({ selectedYear, onYearChange, className }: SelectYearFilterProps) {
  const handleSelectionChange = (val: any) => {
    const year = val?.toString() || '';

    // Always call onYearChange, even if it's the same value
    // This ensures the parent component can handle the state properly
    onYearChange(year);

    // Blur the autocomplete when an option is selected or cleared
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        activeElement.blur();
      }
    }, 0);
  };

  return (
    <Autocomplete
      // key={`year-${selectedYear}`}
      aria-label="Select Year Filter"
      selectedKey={selectedYear}
      classNames={{
        base: className || 'max-w-[220px] block mx-auto md:block md:mx-auto xl:mx-0 mb-3 xl:mb-0 cm-autocomplete',
      }}
      defaultItems={years}
      onSelectionChange={handleSelectionChange}
      inputProps={{
        classNames: {
          input: 'ml-1 text-base',
          inputWrapper: 'h-[52px]',
        },
      }}
      placeholder="Select year"
      radius="full"
      startContent={
        <svg width="31px" height="31px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
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