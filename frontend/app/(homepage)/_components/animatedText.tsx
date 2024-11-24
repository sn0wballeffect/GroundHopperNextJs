"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

export default function AnimatedText() {
  const text = "Finde Sportevents in deiner Nähe.";
  const controls = useAnimationControls();

  useEffect(() => {
    const sequence = async () => {
      await controls.start("visible");
    };
    sequence();
  }, [controls]);

  const characters = Array.from(text);

  return (
    <div className="py-12 sm:py-20">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center">
        {characters.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.1,
                  delay: index * 0.05,
                },
              },
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </h1>
    </div>
  );
}
