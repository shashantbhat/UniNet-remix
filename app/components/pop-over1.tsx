import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as HoverCard from "@radix-ui/react-hover-card";
import * as RadixPopover from "@radix-ui/react-popover";


// Ensure you have installed required dependencies:
// npm install @radix-ui/react-hover-card framer-motion

export function PopoverExample1() {
  return (
    <HoverCard.Root openDelay={200} closeDelay={300}>
      <HoverCard.Trigger asChild>
        <a
          className="rounded-full inline-block"
          href="https://github.com/yash-dhingra"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img
            className="rounded-full"
            src="https://avatars.githubusercontent.com/u/77784099?v=4"
            alt="Yash's image"
            width={45}
            height={45}
          />
        </a>
      </HoverCard.Trigger>

      <AnimatePresence>
        <HoverCard.Portal>
          <HoverCard.Content
            className="bg-white rounded-lg shadow-lg p-4 w-64"
            sideOffset={5}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <img
                  className="rounded-full"
                  src="https://avatars.githubusercontent.com/u/77784099?v=4"
                  alt="Yash's image"
                  width={45}
                  height={45}
                />
                <div>
                  <h3 className="font-medium">Yash Dhingra</h3>
                  <p className="text-sm text-gray-500">@yash-dhingra</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Student at JIIT
              </p>
            </motion.div>
            <HoverCard.Arrow className="fill-white" />
          </HoverCard.Content>
        </HoverCard.Portal>
      </AnimatePresence>
    </HoverCard.Root>
  );
}

const container = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const item = {
  initial: {
    opacity: 0,
    y: 16,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 19,
      mass: 1.2,
    },
  },
};

function Popover({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const MotionContent = motion(RadixPopover.Content);

  return (
    <RadixPopover.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      openDelay={0}
      closeDelay={0}
    >
      <RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <AnimatePresence mode="wait">
          {isOpen && (
            <MotionContent
              className="z-10 w-full max-w-[300px] rounded-lg border border-neutral-800 bg-neutral-950 p-5"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 19,
                mass: 1.2,
              }}
            >
              <motion.div
                variants={container}
                initial="initial"
                animate="animate"
                exit="initial"
                className="flex flex-col gap-[7px]"
              >
                <motion.div variants={item}>
                  <img
                    className="rounded-full"
                    // src="https://avatars.githubusercontent.com/u/77784099?v=4"
                    // alt="Yash's image"
                    width={60}
                    height={60}
                  />
                </motion.div>
                <div className="flex flex-col gap-4">
                  <div>
                    <motion.h1
                      variants={item}
                      className="text-base font-medium text-white"
                    >
                      Gustavo Rodrigues
                    </motion.h1>
                    <motion.p
                      variants={item}
                      className="text-base text-neutral-400"
                    >
                      @guhrodrrigues
                    </motion.p>
                  </div>
                  <motion.span
                    variants={item}
                    className="text-base text-neutral-200"
                  >
                    My desire is to polish products by combining design and
                    code.
                  </motion.span>
                  <motion.div variants={item} className="flex gap-4">
                    <div className="flex gap-1.5">
                      <span className="text-base font-medium text-neutral-300">
                        0
                      </span>{" "}
                      <span className="text-base text-neutral-400">
                        Following
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-base font-medium text-neutral-300">
                        2,784
                      </span>{" "}
                      <span className="text-base text-neutral-400">
                        Followers
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              <RadixPopover.Arrow className="fill-neutral-800" />
            </MotionContent>
          )}
        </AnimatePresence>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}