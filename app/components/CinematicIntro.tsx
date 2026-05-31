"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CinematicIntro({ onComplete }: { onComplete?: () => void }) {
  const [textActive, setTextActive] = useState(true);
  const [slideOut, setSlideOut] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Lock scrolling on mount
    document.body.style.overflow = "hidden";

    // Text starts fading out slightly before the 2.5s mark
    const textTimer = setTimeout(() => {
      setTextActive(false);
    }, 2350);

    // Overlay slides up at 2.5s
    const slideTimer = setTimeout(() => {
      setSlideOut(true);
    }, 2500);

    // Release scroll and unmount after slide-out animation (1.1s duration)
    const completeTimer = setTimeout(() => {
      document.body.style.overflow = "";
      setMounted(false);
      if (onComplete) onComplete();
    }, 3600); // 2.5s + 1.1s = 3.6s

    return () => {
      clearTimeout(textTimer);
      clearTimeout(slideTimer);
      clearTimeout(completeTimer);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "0%" }}
        animate={slideOut ? { y: "-100%" } : { y: "0%" }}
        transition={{
          duration: 1.1,
          ease: [0.85, 0, 0.15, 1], // Cinematic, luxurious, premium cubic-bezier slide-out
        }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black px-6 text-center select-none"
      >
        <AnimatePresence>
          {textActive && (
            <motion.h1
              initial={{
                opacity: 0,
                scale: 0.82,
                letterSpacing: "-0.15em",
                filter: "blur(6px)",
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.82, 0.95, 1.02, 1.05],
                letterSpacing: ["-0.15em", "-0.05em", "0.08em", "0.22em"],
                filter: ["blur(6px)", "blur(0px)", "blur(0px)", "blur(3px)"],
              }}
              transition={{
                duration: 2.5,
                times: [0, 0.25, 0.82, 1], // Perfect keyframe offsets for fade-in, hold, expansion, and fade-out
                ease: "easeOut",
              }}
              className="max-w-4xl font-sans text-2xl font-extrabold uppercase tracking-widest text-white sm:text-3xl md:text-4xl leading-relaxed sm:leading-loose"
            >
              The Ultimate University
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Maths Admissions Hub
              </span>
            </motion.h1>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
