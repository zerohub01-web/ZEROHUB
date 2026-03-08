"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { Loader2, TrendingUp, Users, DollarSign, Activity, Eye } from "lucide-react";
import toast from "react-hot-toast";

interface KPIs {
  totalBookings: number;
  revenue: number;
  growthPercent: number;
  activeCustomers: number;
  conversionRate: number;
  repeatCustomers: number;
  topService: string;
}

interface ActivityItem {
  _id: string;
  action: string;
  userEmail: string;
  metadata: Record<string, any>;
  createdAt: string;
}

export default function AdminAnalyticsPage() {
  const [filter, setFilter] = useState<"today" | "week" | "month" | "all">("today");
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [filter]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Fetch KPIs
      const { data: analyticsData } = await api.get(`/api/admin/analytics?filter=${filter}`);
      if (analyticsData && analyticsData.kpis) {
        setKpis(analyticsData.kpis);
      } else {
        console.warn("Analytics API returned no KPIs", analyticsData);
        setKpis({
          totalBookings: 0, revenue: 0, growthPercent: 0, activeCustomers: 0, 
          conversionRate: 0, repeatCustomers: 0, topService: "None"
        });
      }

      // Fetch latest activity log (first 10 items)
      const { data: activityData } = await api.get("/api/admin/activity");
      setActivities(Array.isArray(activityData) ? activityData.slice(0, 15) : []);
    } catch (err) {
      console.error("Analytics Fetch Error:", err);
      toast.error("Failed to load live analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
  };

  const getActionFormat = (action: string) => {
    switch(action) {
      case "BOOKING_CREATED": return { bg: "bg-blue-100", text: "text-blue-700", label: "New Request" };
      case "BOOKING_STATUS_CHANGED": return { bg: "bg-orange-100", text: "text-orange-700", label: "Status Upd" };
      case "PROJECT_MILESTONE_UPDATED": return { bg: "bg-purple-100", text: "text-purple-700", label: "Milestone" };
      default: return { bg: "bg-gray-100", text: "text-gray-700", label: "System" };
    }
  };

  return (
    <>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display text-[var(--ink)]">Analytics Sandbox</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Review operational volume, user logins, and revenue insights.</p>
        </div>
        
        {/* Filter Toggle */}
        <div className="flex bg-black/5 p-1 rounded-lg w-fit">
          {(["today", "week", "month", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition capitalize ${filter === f ? "bg-white text-[var(--ink)] shadow-sm" : "text-[var(--muted)] hover:text-black"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {isLoading || !kpis ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[var(--muted)]" /></div>
      ) : (
        <div className="space-y-6">
          {/* KPI Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="soft-card p-5">
              <div className="flex justify-between items-start">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)] font-bold">Total Requests</p>
                <Activity size={16} className="text-[var(--muted)]" />
              </div>
              <h2 className="text-3xl font-display text-[var(--ink)] mt-2">{kpis.totalBookings}</h2>
              <p className="text-xs text-[var(--accent)] mt-2">Conversion: {kpis.conversionRate}%</p>
            </div>
            
            <div className="soft-card p-5">
              <div className="flex justify-between items-start">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)] font-bold">Revenue Value</p>
                <DollarSign size={16} className="text-[var(--muted)]" />
              </div>
              <h2 className="text-3xl font-display text-[var(--ink)] mt-2">{formatCurrency(kpis.revenue)}</h2>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp size={12} /> {kpis.growthPercent > 0 ? "+" : ""}{kpis.growthPercent}% growth
              </p>
            </div>

            <div className="soft-card p-5">
              <div className="flex justify-between items-start">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)] font-bold">Active Users</p>
                <Users size={16} className="text-[var(--muted)]" />
              </div>
              <h2 className="text-3xl font-display text-[var(--ink)] mt-2">{kpis.activeCustomers}</h2>
              <p className="text-xs text-[var(--muted)] mt-2">{kpis.repeatCustomers} repeated interactions</p>
            </div>

            <div className="soft-card p-5">
              <div className="flex justify-between items-start">
                <p className="text-xs uppercase tracking-wider text-[var(--muted)] font-bold">Top Service</p>
                <Eye size={16} className="text-[var(--muted)]" />
              </div>
              <h2 className="text-xl font-display text-[var(--ink)] mt-2 truncate" title={kpis.topService}>
                {kpis.topService}
              </h2>
              <p className="text-xs text-[var(--muted)] mt-2 line-clamp-1">Most requested offering</p>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="soft-card">
            <div className="p-5 border-b border-black/10">
              <h3 className="font-semibold text-lg text-[var(--ink)]">Recent Activity</h3>
              <p className="text-xs text-[var(--muted)]">Who did what recently</p>
            </div>
            <div className="p-0">
              {activities.length === 0 ? (
                <p className="p-5 text-center text-sm text-[var(--muted)]">No recent activity found.</p>
              ) : (
                <div className="divide-y divide-black/5">
                  {activities.map((act) => {
                    const format = getActionFormat(act.action);
                    return (
                      <div key={act._id} className="p-4 flex items-center justify-between hover:bg-black/5 transition">
                        <div className="flex items-center gap-4">
                          <span className={`${format.bg} ${format.text} px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase w-28 text-center`}>
                            {format.label}
                          </span>
                          <div>
                            <p className="text-sm text-[var(--ink)] font-medium">
                              {act.metadata?.clientName ? `${act.metadata.clientName} (${act.userEmail})` : act.userEmail}
                            </p>
                            <p className="text-xs text-[var(--muted)]">Action: {act.action.replace(/_/g, " ")}</p>
                          </div>
                        </div>
                        <span className="text-xs text-[var(--muted)]">{new Date(act.createdAt).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
