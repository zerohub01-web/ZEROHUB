"use client";

import Image from "next/image";
import { useState } from "react";

type LogoVariant = "primary" | "white" | "inverted";

interface ZeroLogoProps {
  variant?: LogoVariant;
  compact?: boolean;
  className?: string;
}

export function ZeroLogo({ variant = "primary", compact = false, className }: ZeroLogoProps) {
  const [imageOk, setImageOk] = useState(true);

  const variantClass =
    variant === "white"
      ? "zero-logo-image-white"
      : variant === "inverted"
        ? "zero-logo-image-inverted"
        : "zero-logo-image-primary";

  const textClass =
    variant === "white"
      ? "zero-logo-white"
      : variant === "inverted"
        ? "zero-logo-inverted"
        : "zero-logo-primary";

  const wrapperClass = ["zero-logo", compact ? "zero-logo-compact" : "", className ?? ""]
    .join(" ")
    .trim();

  return (
    <div className={wrapperClass} aria-label="ZERO logo">
      {imageOk ? (
        <Image
          src="/zero-logo.png?v=6"
          alt="ZERO"
          width={172}
          height={40}
          sizes="(max-width: 768px) 140px, 172px"
          className={`zero-logo-image ${variantClass}`}
          draggable={false}
          onError={() => setImageOk(false)}
        />
      ) : (
        <div className={textClass}>
          <span className="zero-word">ZER</span>
          <span className="zero-power" aria-hidden>
            <svg viewBox="0 0 100 100" fill="none" role="img">
              <circle cx="50" cy="54" r="34" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
              <path d="M50 16V44" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}
