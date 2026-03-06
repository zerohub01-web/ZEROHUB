"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { api } from "../../lib/api";
import { ZeroLogo } from "../../components/brand/ZeroLogo";
import { LogOut, Home, Users, BarChart, Bell, Zap, Search, ChevronRight, LayoutGrid } from "lucide-react";
import { NotificationBell } from "../../components/admin/NotificationBell";
import { BookingsManager } from "../../components/admin/BookingsManager";
import { TimelineManager } from "../../components/admin/TimelineManager";

export default function ZeroControlAdminLayout() {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const [view, setView] = useState<"dashboard" | "bookings" | "projects" | "analytics">("dashboard");
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.get("/api/admin/me");
        setAdmin(res.data);
      } catch {
        router.push("/zero-control/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-a)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--ink)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-a)] flex text-[var(--ink)] antialiased font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-a opacity-20 -top-20 -left-20 animate-pulse" />
        <div className="orb orb-b opacity-10 top-1/2 -right-20" />
      </div>

      {/* Glass Sidebar */}
      <aside className="w-72 glass-nav sticky top-0 h-screen flex flex-col z-20 transition-all duration-300">
        <div className="p-8 pb-10">
          <ZeroLogo variant="inverted" />
          <div className="mt-8 flex items-center gap-3 px-4 py-2 bg-[var(--ink)]/5 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {admin?.email?.[0].toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold opacity-60">Authorized Admin</p>
              <p className="text-sm font-semibold truncate leading-tight">{admin?.email || "Control Node"}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-1.5">
          <button
            onClick={() => setView("dashboard")}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all ${view === 'dashboard' ? 'bg-[var(--ink)] text-white shadow-xl shadow-black/10 active:scale-[0.98]' : 'text-[var(--muted)] hover:bg-white/40 hover:text-[var(--ink)]'}`}
          >
            <LayoutGrid size={18} /> Dashboard
          </button>
          <button
            onClick={() => setView("bookings")}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all group ${view === 'bookings' ? 'bg-[var(--ink)] text-white shadow-xl shadow-black/10 active:scale-[0.98]' : 'text-[var(--muted)] hover:bg-white/40 hover:text-[var(--ink)]'}`}
          >
            <Users size={18} className="group-hover:scale-110 transition-transform" /> Lead Pipeline
            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
          </button>
          <button
            onClick={() => setView("projects")}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all group ${view === 'projects' ? 'bg-[var(--ink)] text-white shadow-xl shadow-black/10 active:scale-[0.98]' : 'text-[var(--muted)] hover:bg-white/40 hover:text-[var(--ink)]'}`}
          >
            <Zap size={18} className="group-hover:scale-110 transition-transform" /> Project Timeline
            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
          </button>
          <button
            onClick={() => setView("analytics")}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all group ${view === 'analytics' ? 'bg-[var(--ink)] text-white shadow-xl shadow-black/10 active:scale-[0.98]' : 'text-[var(--muted)] hover:bg-white/40 hover:text-[var(--ink)]'}`}
          >
            <BarChart size={18} className="group-hover:scale-110 transition-transform" /> System Intel
            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
          </button>
        </nav>

        <div className="p-8">
          <button
            onClick={() => {
              // Instant Logout: Redirect immediately while cleanup happens in background
              router.push("/zero-control/login");
              api.post("/api/admin/logout").catch(() => { });
              toast.success("Session terminated.");
            }}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-3xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-bold transition-all border border-red-200/50"
          >
            <LogOut size={18} /> Sign Out Node
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-14 relative z-10">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-display premium-text tracking-tight">Node Overview</h1>
            <p className="text-sm text-[var(--muted)] mt-2 font-medium opacity-70 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Synchronized with ZERO HQ • Cloud Ops Active
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/40 rounded-2xl border border-white/50 backdrop-blur-sm group focus-within:bg-white/80 transition-all">
              <Search size={16} className="text-[var(--muted)]" />
              <input type="text" placeholder="Search operations..." className="bg-transparent border-none text-sm outline-none w-48 font-medium" />
            </div>

            <NotificationBell />
          </div>
        </header>

        {view === "dashboard" && (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {[
                { label: "Revenue Node", value: "₹42.8k", trend: "+12.5%", color: "blue" },
                { label: "Active Ops", value: "24", trend: "+4", color: "indigo" },
                { label: "System Uptime", value: "99.9%", trend: "Optimal", color: "green" }
              ].map((item, i) => (
                <div key={i} className="glass-card p-8 group hover:-translate-y-1 transition-all duration-300">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--muted)] font-extrabold opacity-50 mb-4">{item.label}</p>
                  <div className="flex items-end justify-between">
                    <h2 className="text-4xl font-display premium-text">{item.value}</h2>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {item.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <section className="glass-card p-10 min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
              {/* Subtle Grid Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--ink) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

              <div className="w-20 h-20 rounded-3xl bg-[var(--ink)]/5 flex items-center justify-center mb-6 border border-white/50 shadow-inner">
                <BarChart size={38} className="text-[var(--muted)] opacity-20" />
              </div>
              <h3 className="text-2xl font-display premium-text mb-3">Initialize Operation Stream</h3>
              <p className="text-sm text-[var(--muted)] max-w-sm mb-8 leading-relaxed font-medium">
                Your automation command center is ready. Connect your production stream to populate this node with real-time project telemetry.
              </p>
              <button
                onClick={() => setView("bookings")}
                className="px-8 py-3.5 bg-[var(--ink)] text-white rounded-2xl text-sm font-bold shadow-2xl shadow-black/30 hover:scale-[1.02] transition-transform active:scale-95"
              >
                Configure Data Bridge
              </button>
            </section>
          </>
        )}

        {view === "bookings" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-400">
            <BookingsManager />
          </div>
        )}

        {view === "projects" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-400">
            <TimelineManager />
          </div>
        )}

        {view === "analytics" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-400">
            <div className="glass-card p-20 text-center">
              <BarChart size={48} className="mx-auto text-[var(--muted)] opacity-20 mb-6" />
              <h2 className="text-2xl font-display premium-text">System Intel Pending</h2>
              <p className="text-sm text-[var(--muted)] opacity-60 mt-2 max-w-xs mx-auto">Real-time data visualization and MRR tracking will be synchronized in the next telemetry update.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
