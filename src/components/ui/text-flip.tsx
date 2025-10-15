"use client";

import React, { useState, useEffect, useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface WordItem {
  word: string;
  link: string;
}

export interface TextFlipProps {
  words?: WordItem[];
  interval?: number;
  className?: string;
  textClassName?: string;
  animationDuration?: number;
}

export function TextFlip({
  words = [],
  interval = 3000,
  className,
  textClassName,
  animationDuration = 700,
}: TextFlipProps) {
  const id = useId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [width, setWidth] = useState(100);
  const textRef = React.useRef<HTMLDivElement>(null);

  const updateWidthForWord = () => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth + 30;
      setWidth(textWidth);
    }
  };

  useEffect(() => {
    updateWidthForWord();
  }, [currentWordIndex]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [words, interval]);

  const currentWordItem = words[currentWordIndex];

  return (
    <motion.div
      layout
      layoutId={`words-here-${id}`}
      animate={{ width }}
      transition={{ duration: animationDuration / 2000 }}
      className={cn(
        "relative rounded-lg text-center",
        className,
      )}
      key={currentWordItem?.word || ''}
    >
      <motion.div
        transition={{
          duration: animationDuration / 1000,
          ease: "easeInOut",
        }}
        className={(textClassName)}
        ref={textRef}
        layoutId={`word-div-${currentWordItem?.word || ''}-${id}`}
      >
        <Link href={currentWordItem?.link || "#"}>
          <motion.div>
            {(currentWordItem?.word || '').split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{
                  opacity: 0,
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                transition={{
                  delay: index * 0.02,
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}