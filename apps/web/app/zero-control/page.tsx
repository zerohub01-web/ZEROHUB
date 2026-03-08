import { BarChart } from "lucide-react";

export default function ZeroControlDashboard() {
  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display text-[var(--ink)]">Overview</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Admin system placeholder ready for next phase integration.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[var(--ink)] text-white flex items-center justify-center font-bold text-sm">
          ZH
        </div>
      </header>

      {/* Dashboard Grid Placeholder */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {["Active Clients", "Monthly Revenue", "Pending Actions"].map((item, i) => (
          <div key={i} className="soft-card p-6">
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-bold">{item}</p>
            <h2 className="text-4xl font-display text-[var(--ink)] mt-3">--</h2>
          </div>
        ))}
      </div>

      <section className="soft-card p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
        <BarChart size={48} className="text-[var(--muted)]/30 mb-4" />
        <h3 className="text-xl font-display text-[var(--ink)]">Data Feed Pending</h3>
        <p className="text-sm text-[var(--muted)] max-w-sm mt-2">The backend APIs for the analytics reporting and booking pipeline management will be injected into this layout next phase.</p>
      </section>
    </>
  );
}
