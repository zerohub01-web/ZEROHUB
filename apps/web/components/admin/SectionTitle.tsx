"use client";

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      {subtitle && <p className="text-sm text-mist">{subtitle}</p>}
    </header>
  );
}
