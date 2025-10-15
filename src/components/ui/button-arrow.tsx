import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonArrowProps {
  direction: "left" | "right";
  text?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function ButtonArrow({
  direction,
  text,
  className,
  onClick,
  disabled,
}: ButtonArrowProps) {
  const ArrowIcon = direction === "left" ? ArrowLeft : ArrowRight;
  const isLeftDirection = direction === "left";

  return (
    <button
      onClick={onClick}
      className={cn(
        "cursor-pointer py-2.5 flex items-center justify-center rounded-full bg-black transition-colors duration-700 ease-in-out",
        !disabled && "group", // Only add group class if not disabled
        text
          ? (isLeftDirection ? "pl-4 pr-6" : "pl-6 pr-6")
          : "w-12",
        disabled && "opacity-50 cursor-default"
      )}
      disabled={disabled}
    >
      {/* Icon Container - positioned first for left, last for right */}
      {isLeftDirection && (
        <div
          className={cn(
            "relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full transition-transform duration-700",
            !disabled && "group-hover:bg-black", // Only apply hover if not disabled
          )}
        >
          {/* Animated Arrow Strip for LEFT direction */}
          <div className={cn(
            "absolute left-0 flex h-7 items-center justify-center transition-all duration-350 ease-in-out",
            !disabled && "group-hover:-translate-x-1/2" // Only apply hover if not disabled
          )}>
            {/* Initial Arrow (Visible by default) */}
            <ArrowIcon
              size={18}
              className={cn(
                "size-8 transform p-1 text-white opacity-100 transition-transform duration-500 ease-in-out",
                !disabled && "group-hover:opacity-0" // Only apply hover if not disabled
              )}
            />
            {/* Hover Arrow (Visible on hover) */}
            <ArrowIcon
              size={18}
              className={cn(
                "size-8 transform p-1 text-white opacity-0",
                !disabled && "group-hover:opacity-100" // Only apply hover if not disabled
              )}
            />
          </div>
        </div>
      )}

      {/* Text */}
      {text && (
        <span
          className={cn(
            "text-white transition-colors duration-700 ease-in-out",
            direction === "left" ? "ml-2" : "mr-2"
          )}
        >
          {text}
        </span>
      )}

      {/* Icon Container - positioned last for right direction */}
      {!isLeftDirection && (
        <div
          className={cn(
            "relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full transition-transform duration-700",
            !disabled && "group-hover:bg-black", // Only apply hover if not disabled
          )}
        >
          {/* Animated Arrow Strip for RIGHT direction */}
          <div className={cn(
            "absolute left-0 flex h-7 -translate-x-1/2 items-center justify-center transition-all duration-350 ease-in-out",
            !disabled && "group-hover:translate-x-0" // Only apply hover if not disabled
          )}>
            <ArrowIcon
              size={18}
              className={cn(
                "size-8 transform p-1 text-white opacity-0",
                !disabled && "group-hover:opacity-100" // Only apply hover if not disabled
              )}
            />
            <ArrowIcon
              size={18}
              className={cn(
                "size-8 transform p-1 text-white opacity-100 transition-transform duration-500 ease-in-out",
                !disabled && "group-hover:opacity-0" // Only apply hover if not disabled
              )}
            />
          </div>
        </div>
      )}
    </button>
  );
}
