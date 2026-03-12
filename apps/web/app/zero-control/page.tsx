"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { BarChart, Users, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Loader2, CheckCircle, Trash2, Clock, Star } from "lucide-react";
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
  const [reviews, setReviews] = useState<any[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchReviews();
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

  const fetchReviews = async () => {
    try {
      const { data } = await api.get("/api/reviews/admin/all");
      setReviews(data.reviews || []);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/api/reviews/admin/${id}/approve`);
      toast.success("Review approved");
      fetchReviews();
    } catch {
      toast.error("Failed to approve review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/api/reviews/admin/${id}`);
      toast.success("Review deleted");
      fetchReviews();
    } catch {
      toast.error("Failed to delete review");
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

      {/* Review Management Section */}
      <section className="mt-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display text-[var(--ink)]">Review Management</h2>
          <span className="text-xs uppercase tracking-[0.1em] text-[var(--muted)]">{reviews.length} total reviews</span>
        </div>

        {isReviewsLoading ? (
          <div className="flex h-32 items-center justify-center soft-card"><Loader2 className="animate-spin text-[var(--muted)]" /></div>
        ) : reviews.length === 0 ? (
          <div className="soft-card p-10 text-center text-[var(--muted)] text-sm italic">
            No reviews submitted yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {reviews.map((r: any) => (
              <div key={r._id} className="soft-card p-5 flex flex-wrap md:flex-nowrap items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-[var(--ink)]">{r.clientName}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                      ))}
                    </div>
                    {r.approved ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100 font-bold uppercase">
                        <CheckCircle size={10} /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100 font-bold uppercase">
                        <Clock size={10} /> Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--ink)] leading-relaxed italic border-l-2 border-black/5 pl-4 py-1">
                    "{r.testimonial}"
                  </p>
                  <p className="text-[10px] text-[var(--muted)] mt-3">
                    Submitted on {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  {!r.approved && (
                    <button
                      onClick={() => handleApprove(r._id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-sm"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 text-xs font-bold hover:bg-red-100 transition"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
