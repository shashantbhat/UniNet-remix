export function TextGlitch() {
    return (
      <div className="relative overflow-hidden font-medium group">
        <span className="invisible">Meet the Developers</span>
        <span className="text-neutral-400 absolute top-0 left-0 group-hover:-translate-y-full transition-transform ease-in-out duration-500 hover:duration-300">
        Meet the Developers
        </span>
        <span className="text-neutral-400 absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform ease-in-out duration-500 hover:duration-300">
        Meet the Developers
        </span>
      </div>
    );
  }
  
  import { motion } from "framer-motion";

// Optional utility function for conditional classNames, replace or remove as needed
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function TextGenerateEffectExample() {
  const text = `Welcome to UniNet`;

  return <TextGenerateEffect text={text} duration={0.5} />;
}

type TextGenerateEffectProps = {
  text: string;
  duration?: number;
} & React.ComponentProps<"span">;

function TextGenerateEffect({
  text,
  duration = 0.5,
  className,
}: TextGenerateEffectProps) {
  return (
    <motion.div className="inline-block whitespace-pre">
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className={cn(
            "inline-block whitespace-pre text-black",
            className
          )}
          initial={{ opacity: 0, filter: "blur(4px)", rotateX: 90, y: 5 }}
          whileInView={{
            opacity: 1,
            filter: "blur(0px)",
            rotateX: 0,
            y: 0,
          }}
          transition={{
            ease: "easeOut",
            duration: duration,
            delay: index * 0.015,
          }}
          viewport={{ once: true }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}