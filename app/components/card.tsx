import { useMotionValue, motion, useMotionTemplate } from "framer-motion";

export function CardRevealedPointer() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const background = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(38, 38, 38, 0.4), transparent 80%)`;

  return (
    <div
      onMouseMove={(e) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
      }}
      className="group relative w-full max-w-[350px] overflow-hidden rounded-xl bg-neutral-950"
    >
    <a 
      href="https://github.com/shashantbhat/UniNet-Remix" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="group relative block w-full rounded-xl hover:no-underline transition-all duration-300 hover:scale-105"
    >
      {/* Decorative top border */}
      <div className="absolute right-5 top-0 h-px w-80 bg-gradient-to-l from-transparent via-white/30 via-10% to-transparent" />

      {/* Mouse hover background effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: background,
        }}
      />

      {/* Card content */}
      <div className="relative flex flex-col gap-3 rounded-xl border border-white/10 px-4 py-5">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-neutral-200">From The Developers</h3>
          <p className="text-sm leading-[1.5] text-neutral-400">
            UniNet is still is in development. 
            We are working hard to make it,
            we appreciate your feedback and contributions.
            Use it, test it throughly, if possible you can contribute to the project.
            open up new issue make your PR, we will review it.
            you can check the Github repository just by a click.
          </p>
        </div>
      </div>
        </a>
    </div>
  );
}

