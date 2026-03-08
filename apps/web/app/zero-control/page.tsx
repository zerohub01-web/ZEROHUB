import { ZeroLogo } from "../../components/brand/ZeroLogo";
import { LogOut, Home, Users, BarChart } from "lucide-react";

export default function ZeroControlAdminLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-a)] flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-black/10 bg-white/50 backdrop-blur-md flex flex-col">
        <div className="p-6 border-b border-black/10">
          <ZeroLogo variant="inverted" />
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)] font-semibold mt-6">Admin Control</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[var(--ink)] text-white text-sm font-medium">
            <Home size={18} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[var(--muted)] hover:bg-black/5 text-sm font-medium transition">
            <Users size={18} /> Clients
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[var(--muted)] hover:bg-black/5 text-sm font-medium transition">
            <BarChart size={18} /> Analytics
          </a>
        </nav>
        <div className="p-4 border-t border-black/10">
          <a href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium transition">
            <LogOut size={18} /> Exit Admin
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
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
      </main>
    </div>
  );
}
