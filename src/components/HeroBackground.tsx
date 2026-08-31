"use client";

import Image from "next/image";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#070a07] pointer-events-none">
      {/* Mobile Background */}
      <Image
        src="/ambient-mobile.jpg"
        alt="Ambient Restaurant Background"
        fill
        priority
        className="object-cover opacity-30 md:hidden"
        sizes="100vw"
        quality={50} // Extremely aggressive compression for instant loading
      />

      {/* Desktop Background */}
      <Image
        src="/ambient-desktop.jpg"
        alt="Ambient Restaurant Background"
        fill
        priority
        className="object-cover opacity-30 hidden md:block"
        sizes="100vw"
        quality={50}
      />

      {/* Dark overlay gradients to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070a07] via-[#070a07]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070a07]/90 via-transparent to-transparent h-40" />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
