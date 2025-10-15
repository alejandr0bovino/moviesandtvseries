"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Chip } from "@heroui/react";
import ButtonArrow from '@/components/ui/button-arrow';
import { useEffect, useState } from "react";
import { legendsData } from "@/constants/legends";

type LegendsData = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  linkId: string;
};

export function ScreenLegends() {
  const [active, setActive] = useState(0);
  const autoplay = false;

  const handleNext = () => {
    setActive((prev) => (prev + 1) % legendsData.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + legendsData.length) % legendsData.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [autoplay]);

  const [rotationAngles, setRotationAngles] = useState<number[]>([]);

  useEffect(() => {
    const angles = legendsData.map(() => Math.floor(Math.random() * 14) - 6);
    setRotationAngles(angles);
  }, [legendsData]);

  return (
    <div className="mx-auto max-w-sm font-sans antialiased md:max-w-[690px]">
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        <div>
          <div className="relative h-80 md:h-120 w-full">
            <AnimatePresence>
              {legendsData.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: rotationAngles[index] || 0
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : (rotationAngles[index] || 0),
                    zIndex: isActive(index)
                      ? 40
                      : legendsData.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: rotationAngles[index] || 0
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom w-[240px] left-10 md:left-0"
                >
                  {isActive(index) ? (
                    <Link href={`/people/${testimonial.linkId}`} className="saturate-65">
                      <img
                        src={testimonial.src}
                        alt={testimonial.name}
                        width={240}
                        height={360}
                        draggable={false}
                        className="h-[360px] w-[240px] rounded-2xl object-cover object-center"
                      />
                    </Link>
                  ) : (
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      width={240}
                      height={360}
                      draggable={false}
                      className="h-[360px] w-[240px] rounded-2xl object-cover object-center"
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col justify-between h-91">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <Link href={`/people/${legendsData[active]?.linkId || ''}`}>
              <h3 className="text-2xl font-bold text-black">
                {legendsData[active]?.name || ''}
              </h3>
              <p className="text-sm text-gray-500 dark:text-neutral-500">
                {legendsData[active]?.designation || ''}
              </p>
              <motion.p className="mt-8 text-lg text-gray-800 dark:text-neutral-800">
                {(legendsData[active]?.quote || '').split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
              <div className="mt-5 fade-in">
                <Chip size="lg" className="border border-gray-400 bg-transparent">Read more</Chip>
              </div>
            </Link>
          </motion.div>

          <div className="flex gap-4 md:pt-0">
            <ButtonArrow direction="left" onClick={handlePrev} />
            <ButtonArrow direction="right" onClick={handleNext} />
          </div>
        </div>
      </div>
    </div>
  );
}