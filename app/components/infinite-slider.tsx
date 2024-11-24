import React from "react";

// Utility function to conditionally join class names
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function InfiniteSliderExample() {
  return (
    <InfiniteSlider pauseOnHover>
      <img
        src="/mentor.png"
        className="aspect-square w-[150px] h-[80px] rounded-[4px]"
        alt="mentor"
      />
      <img
        src="/pg mates.png"
        className="aspect-square w-[130px] h-[80px] rounded-[4px]"
        alt="pg mates"
      />
      <img
        src="/dating.png"
        className="aspect-square w-[130px] h-[80px] rounded-[4px]"
        alt="dating"
      />
      <img
        src="/carpool.png"
        className="aspect-square w-[150px] h-[80px] rounded-[4px]"
        alt="carpool"
      />
    </InfiniteSlider>
  );
}

type InfiniteSliderProps = {
  children: React.ReactNode;
  className?: string;
  pauseOnHover?: boolean;
};

function InfiniteSlider({
  children,
  className,
  pauseOnHover,
}: InfiniteSliderProps) {
  return (
    <div
      data-id="slider"
      className={cn("group relative flex gap-10 overflow-hidden", className)}
    >
      <div className="absolute left-0 w-1/12 h-full bg-gradient-to-r from-background to-transparent z-10" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 animate-infinite-slider justify-around gap-10 [--gap:1rem]",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
          data-id={`slider-child-${i + 1}`}
        >
          {children}
        </div>
      ))}
      <div className="absolute right-0 w-1/12 h-full bg-gradient-to-l from-background to-transparent z-10" />
    </div>
  );
}