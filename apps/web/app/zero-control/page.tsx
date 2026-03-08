"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { BarChart, Users, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface DashboardStats {
  totalBookings: number;
  revenue: number;
  growthPercent: number;
  activeCustomers: number;
  topService: string;
}

export default function ZeroControlDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get("/api/admin/analytics?filter=month");
      setStats(data.kpis);
    } catch {
      toast.error("Failed to load dashboard statistics");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-[400px] items-center justify-center"><Loader2 className="animate-spin text-[var(--muted)]" /></div>;
  }

  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display text-[var(--ink)]">Performance Overview</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Real-time health of your automation service pipeline.</p>
        </div>
      </header>

      {/* Real KPI Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="soft-card p-6">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-bold">Active Clients</p>
            <Users size={16} className="text-[var(--muted)]" />
          </div>
          <h2 className="text-4xl font-display text-[var(--ink)] mt-1">{stats?.activeCustomers || 0}</h2>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <ArrowUpRight size={12} /> Live tracked inquiries
          </p>
        </div>

        <div className="soft-card p-6">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-bold">Monthly Revenue</p>
            <DollarSign size={16} className="text-[var(--muted)]" />
          </div>
          <h2 className="text-4xl font-display text-[var(--ink)] mt-1">₹{stats?.revenue.toLocaleString() || 0}</h2>
          <div className={`text-xs mt-2 flex items-center gap-1 ${(stats?.growthPercent || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
            {(stats?.growthPercent || 0) >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(stats?.growthPercent || 0)}% compared to last period
          </div>
        </div>

        <div className="soft-card p-6">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs uppercase tracking-[0.1em] text-[var(--muted)] font-bold">Bookings</p>
            <Calendar size={16} className="text-[var(--muted)]" />
          </div>
          <h2 className="text-4xl font-display text-[var(--ink)] mt-1">{stats?.totalBookings || 0}</h2>
          <p className="text-xs text-[var(--muted)] mt-2">Top Service: <span className="text-[var(--ink)] font-medium">{stats?.topService || "N/A"}</span></p>
        </div>
      </div>

      <section className="soft-card p-8 min-h-[300px] flex flex-col items-center justify-center text-center bg-gray-50/50 border-dashed">
        <BarChart size={48} className="text-[var(--muted)]/30 mb-4" />
        <h3 className="text-xl font-display text-[var(--ink)]">Advanced Charting</h3>
        <p className="text-sm text-[var(--muted)] max-w-sm mt-2">
          Switch to <span className="font-bold underline cursor-pointer" onClick={() => window.location.href='/zero-control/analytics'}>Deep Analytics</span> for hourly and daily trend visualization.
        </p>
      </section>
    </>
  );
}
