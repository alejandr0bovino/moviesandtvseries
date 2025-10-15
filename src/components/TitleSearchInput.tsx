import React, { useState, useEffect } from 'react';
import { Input } from "@heroui/react";

interface TitleSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const TitleSearchInput: React.FC<TitleSearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search by title...",
  className,
}) => {
  // Internal state for the input value
  const [internalValue, setInternalValue] = useState(value);

  // Update internal value when external value changes (e.g., from clear filters)
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounced effect to call onChange after 300ms of no typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [internalValue]); // Only depend on internalValue to prevent infinite loops

  return (
    <Input
      className={className} // Apply the passed className
      placeholder={placeholder}
      radius="full"
      value={internalValue}
      size="lg"
      onChange={(e) => setInternalValue(e.target.value)} // Update internal value immediately
      startContent={
        <svg
          width={18}
          height={18}
          strokeWidth={2.5}
          fill="none"
          viewBox="0 0 24 24"
          stroke="#666666"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      }
    />
  );
};

export default TitleSearchInput;