export function LoadingSpinner() {
    const bars = Array(12).fill(0); // Array to create 12 spinner bars
  
    return (
      <div className="h-[24px] w-[24px]">
        {/* Wrapper to center the spinner */}
        <div className="relative left-1/2 top-1/2 h-[inherit] w-[inherit]">
          {bars.map((_, i) => (
            <div
              key={`spinner-bar-${i}`} // Unique key for each bar
              aria-label={`spinner-bar-${i + 1}`} // Accessibility label for screen readers
              className={`absolute -left-[10%] -top-[3.9%] h-[8%] w-[24%] rounded-md bg-neutral-400`}
              style={{
                animation: "spinner-animation 1.2s linear infinite",
                animationDelay: `-${1.3 - i * 0.1}s`,
                transform: `rotate(${30 * i}deg) translate(146%)`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }