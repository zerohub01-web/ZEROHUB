"use client";

const stackItems = [
  "Next.js",
  "Node.js",
  "React",
  "TypeScript",
  "Cloudflare",
  "MongoDB",
  "Docker",
  "GitHub Actions"
];

export default function Hero3D() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.22),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.18),transparent_40%),linear-gradient(150deg,#081422_0%,#0a1f35_45%,#091627_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative z-10 grid h-full grid-cols-2 gap-3 p-4 md:p-5 content-center">
        {stackItems.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold tracking-[0.03em] text-slate-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
