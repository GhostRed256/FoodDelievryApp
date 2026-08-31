"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const BACKGROUNDS = [
  "/hero/momos.jpg",
  "/hero/roll.jpg",
  "/hero/noodles.jpg",
];

export default function HeroBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Preload next images
    BACKGROUNDS.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={BACKGROUNDS[currentIndex]}
            alt="Hero Background"
            fill
            priority
            className="object-cover opacity-60"
            sizes="100vw"
            quality={60} // Aggressive compression for instant mobile load
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlays to blend with the rest of the dark site */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070a07] via-[#070a07]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070a07]/90 via-transparent to-transparent h-40" />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
