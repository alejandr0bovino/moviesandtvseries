"use client";
import { useEffect } from 'react';
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

import { PowerGlitch } from 'powerglitch';

import React, { useRef, useState } from "react";
import Link from 'next/link';

import MovieIcon from "@/icons/movie";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
  activePath?: string;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  useEffect(() => {
    const delay = 1200;

    const glitchTimeout = setTimeout(() => {
      PowerGlitch.glitch('.cm-logo-i',
        {
          "timing": {
            "duration": 5000,
            "easing": "ease-in-out"
          },
          "shake": {
            amplitudeX: 0.03,
            amplitudeY: 0.03
          }
        }
      );
    }, delay);

    return () => clearTimeout(glitchTimeout);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={cn("sticky inset-x-0 top-0 z-40 w-full fixed", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
            child as React.ReactElement<{ visible?: boolean }>,
            { visible },
          )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(20px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "40%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "800px",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-screen-xl flex-row items-center justify-between self-start rounded-full bg-white px-4 py-2 lg:flex",
        visible && "bg-white/80",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

import { usePathname } from "next/navigation";

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Ensure component is properly initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Reset hover state when pathname changes to prevent invisible items
  useEffect(() => {
    setHovered(null);
    setIsAnimating(false);
  }, [pathname]);

  const handleMouseEnter = (idx: number) => {
    if (!isInitialized) return;

    if (hovered !== idx) {
      setIsAnimating(true);
      setHovered(idx);
      // Reset animation state after a short delay
      setTimeout(() => setIsAnimating(false), 150);
    }
  };

  const handleMouseLeave = () => {
    if (!isInitialized) return;

    setIsAnimating(true);
    setHovered(null);
    setTimeout(() => setIsAnimating(false), 150);
  };

  return (
    <motion.div
      onMouseLeave={handleMouseLeave}
      className={cn(
        "hidden lg:flex flex-row items-center justify-center space-x-2 text-md font-medium",
        className,
      )}
    >
      {items.map((item, idx) => {
        const isActive = pathname === item.link || (item.link === '/movies' && pathname.startsWith('/movies/')) || (item.link === '/tv-series' && pathname.startsWith('/tv-series/')) || (item.link === '/people' && pathname.startsWith('/people/'));
        const isHovered = hovered === idx;

        return (
          <Link
            key={`link-${idx}-${pathname}`}
            href={item.link}
            onMouseEnter={() => handleMouseEnter(idx)}
            {...(onItemClick && { onClick: onItemClick })}
            className={cn(
              "relative px-4 py-2 rounded-full transition-colors duration-200",
              isActive
                ? "bg-[#000000] text-[#ffffff]"
                : "text-[#525252]",
              isHovered && !isActive && "text-[#171717]"
            )}
          >
            {isHovered && !isActive && isInitialized && (
              <motion.div
                key={`hover-${idx}-${pathname}`}
                layoutId="hovered"
                initial={{
                  opacity: 0,
                  scale: 1
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    mass: 0.8,
                    duration: 0.2
                  }
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: {
                    duration: 0.1,
                    ease: "easeOut"
                  }
                }}
                className="absolute inset-0 rounded-full border-1 border-[#000000]"
                style={{
                  zIndex: 1,
                  pointerEvents: "none"
                }}
                layout
                layoutDependency={pathname}
              />
            )}

            <motion.span
              className="relative z-10"
              animate={{
                color: isActive
                  ? "rgb(255 255 255)"
                  : isHovered
                    ? "rgb(17 24 39)"
                    : "rgb(82 82 82)",
                transition: {
                  duration: 0.2,
                  ease: "easeInOut"
                }
              }}
              style={{
                position: "relative",
                zIndex: 2
              }}
            >
              {item.name}
            </motion.span>
          </Link>
        );
      })}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(20px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "4px" : "2rem",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
        visible && "bg-white/80",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <IconX className="text-black" onClick={onClick} />
  ) : (
    <IconMenu2 className="text-black" onClick={onClick} />
  );
};

export const NavbarLogo = () => {
  return (
    <Link
      className="relative z-20 mr-4 flex items-center space-x-2 py-1 text-md text-black cm-logo-i"
      href="/"
    >
      <MovieIcon fill="#000000" width="25px" height="25px" />

      <span className="font-bold tracking-tighter">Movies & TV Series</span>
    </Link>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
    | React.ComponentPropsWithoutRef<"a">
    | React.ComponentPropsWithoutRef<"button">
  )) => {
  const baseStyles =
    "px-4 py-2 rounded-md bg-white button bg-white text-black text-md relative cursor-pointer inline-block text-center";

  const variantStyles = {
    primary:
      "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    secondary: "bg-transparent shadow-none",
    dark: "bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    gradient:
      "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
