"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function BootScreen() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" });
  }, []);

  return (
    <div ref={ref} className="panel p-6">
      <p className="font-mono text-neon text-sm mb-2">ZERO BOOT</p>
      <div className="font-mono text-sm text-mist space-y-1">
        <p>Boot sequence initialized...</p>
        <p>Core modules synchronized...</p>
        <p>System layout mounted...</p>
      </div>
    </div>
  );
}
