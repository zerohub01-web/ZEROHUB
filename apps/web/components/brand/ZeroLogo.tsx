type LogoVariant = "primary" | "white" | "inverted";

interface ZeroLogoProps {
  variant?: LogoVariant;
  compact?: boolean;
  className?: string;
}

export function ZeroLogo({ variant = "primary", compact = false, className }: ZeroLogoProps) {
  const logoClass =
    variant === "white"
      ? "zero-logo-white"
      : variant === "inverted"
        ? "zero-logo-inverted"
        : "zero-logo-primary";

  const classes = ["zero-logo", compact ? "zero-logo-compact" : "", logoClass, className ?? ""]
    .join(" ")
    .trim();

  return (
    <div className={classes} aria-label="ZERO logo">
      <span className="zero-word">ZER</span>
      <span className="zero-power" aria-hidden>
        <svg viewBox="0 0 100 100" fill="none" role="img">
          <circle cx="50" cy="54" r="34" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
          <path d="M50 16V44" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}
