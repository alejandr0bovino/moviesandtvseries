'use client';

import { useState, useRef, useEffect } from 'react';
import { Tooltip } from '@heroui/react';
import { IconShare } from '@tabler/icons-react';

interface ShareButtonProps {
  className?: string;
}

export function ShareButton({ className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          setCopied(true);
          setIsHovering(false);

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            setCopied(false);
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy URL: ', err);
        });
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <button
      onClick={handleCopy}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="px-3.25 py-1.5 cursor-pointer rounded-full bg-gray-200 flex gap-2 items-center text-sm h-[38px] m-auto xl:mx-0"
    >
      <IconShare width={20} height={20} /> {copied ? 'Copied!' : 'Share'}
    </button>
  );
}