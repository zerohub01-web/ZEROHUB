"use client";

export function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="panel p-4">
      <p className="text-sm text-mist">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </article>
  );
}
