"use client";

import { ZeroLogo } from "../../components/brand/ZeroLogo";
import { api } from "../../lib/api";
import { toast } from "react-hot-toast";
import { LogOut, Home, Users, BarChart, Briefcase } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function ZeroControlAdminLayout({ children }: { children: ReactNode }) {
  const handleLogout = async () => {
    try {
      await api.post("/api/admin/logout");
      window.location.href = "/";
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-a)] flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-black/10 bg-white/50 backdrop-blur-md flex flex-col">
        <div className="p-6 border-b border-black/10">
          <ZeroLogo variant="inverted" />
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)] font-semibold mt-6">Admin Control</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/zero-control" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-black/5 text-sm font-medium transition text-[var(--ink)]">
            <Home size={18} /> Dashboard
          </Link>
          <Link href="/zero-control/works" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-black/5 text-sm font-medium transition text-[var(--ink)]">
            <Briefcase size={18} /> Previous Works
          </Link>
          <Link href="/zero-control/clients" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-black/5 text-sm font-medium transition text-[var(--ink)]">
            <Users size={18} /> Clients
          </Link>
          <Link href="/zero-control/analytics" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-black/5 text-sm font-medium transition text-[var(--ink)]">
            <BarChart size={18} /> Analytics
          </Link>
        </nav>
        <div className="p-4 border-t border-black/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium transition">
            <LogOut size={18} /> Exit Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
