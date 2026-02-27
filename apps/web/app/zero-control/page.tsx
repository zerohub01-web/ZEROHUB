"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { api } from "../../lib/api";
import { useAuthStore } from "../../store/auth";
import { AnalyticsResponse, Booking, ServiceItem } from "../../types";
import { ZeroLogo } from "../../components/brand/ZeroLogo";

type Filter = "today" | "week" | "month" | "custom";

interface CustomerRow {
  email: string;
  name: string;
  phone: string;
  totalValue: number;
  bookingHistory: { service: string; status: string; date: string; value: number }[];
}

interface ActivityItem {
  _id: string;
  action: string;
  performedBy: string;
  timestamp: string;
}

interface WorkItem {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
}

function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <article className={`soft-card ${className}`}>{children}</article>;
}

export default function ZeroControlPage() {
  const { adminId, role, setAdmin } = useAuthStore();
  const [authChecking, setAuthChecking] = useState(true);
  const [filter, setFilter] = useState<Filter>("month");
  const [range, setRange] = useState({ from: "", to: "" });
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [work, setWork] = useState<WorkItem[]>([]);
  const [alert, setAlert] = useState("");
  const [timelineForm, setTimelineForm] = useState({
    bookingId: "",
    milestoneKey: "planned" as "planned" | "in_progress" | "delivered",
    status: "PENDING" as "PENDING" | "DONE",
    fileUrl: "",
    comment: ""
  });

  const [loginForm, setLoginForm] = useState({ adminId: "", password: "" });
  const [serviceForm, setServiceForm] = useState({ title: "", price: 0 });
  const [workForm, setWorkForm] = useState({ title: "", slug: "", coverImage: "", gallery: "" });
  const lastBookingIdRef = useRef<string | null>(null);

  const canManageSettings = role === "SUPER_ADMIN";

  const metrics = useMemo(() => {
    if (!analytics) return [];
    return [
      ["Total bookings", analytics.kpis.totalBookings],
      ["Revenue", `₹${analytics.kpis.revenue}`],
      ["Growth", `${analytics.kpis.growthPercent}%`],
      ["Active customers", analytics.kpis.activeCustomers],
      ["Conversion", `${analytics.kpis.conversionRate}%`]
    ] as const;
  }, [analytics]);

  async function loadAll() {
    const query =
      filter === "custom" && range.from && range.to
        ? `/api/admin/analytics?filter=custom&from=${new Date(range.from).toISOString()}&to=${new Date(range.to).toISOString()}`
        : `/api/admin/analytics?filter=${filter}`;

    const [a, b, s, c, l, w] = await Promise.all([
      api.get(query),
      api.get("/api/admin/bookings"),
      api.get("/api/admin/services"),
      api.get("/api/admin/customers"),
      api.get("/api/admin/activity"),
      api.get("/api/admin/work")
    ]);

    const nextBookings = b.data as Booking[];
    if (lastBookingIdRef.current && nextBookings[0] && nextBookings[0]._id !== lastBookingIdRef.current) {
      setAlert("New booking received");
      setTimeout(() => setAlert(""), 3000);
    }
    if (nextBookings[0]) lastBookingIdRef.current = nextBookings[0]._id;

    setAnalytics(a.data);
    setBookings(nextBookings);
    setServices(s.data);
    setCustomers(c.data);
    setActivity(l.data);
    setWork(w.data);
  }

  useEffect(() => {
    async function initAdminSession() {
      try {
        const res = await api.get("/api/admin/me");
        setAdmin(res.data);
      } catch {
        try {
          const bridge = await api.post("/api/admin/customer-bridge");
          setAdmin(bridge.data);
        } catch {
          setAdmin(undefined);
        }
      } finally {
        setAuthChecking(false);
      }
    }

    initAdminSession();
  }, [setAdmin]);

  useEffect(() => {
    if (!adminId) return;
    loadAll();
    const timer = setInterval(loadAll, 12000);
    return () => clearInterval(timer);
  }, [adminId, filter, range.from, range.to]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await api.post("/api/admin/login", loginForm);
    setAdmin(res.data);
  }

  async function updateStatus(id: string, status: Booking["status"]) {
    await api.patch(`/api/admin/bookings/${id}`, { status });
    await loadAll();
  }

  async function createService(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/api/admin/services", serviceForm);
    setServiceForm({ title: "", price: 0 });
    await loadAll();
  }

  async function toggleService(s: ServiceItem) {
    await api.patch(`/api/admin/services/${s._id}`, { isActive: !s.isActive });
    await loadAll();
  }

  async function createWork(e: React.FormEvent) {
    e.preventDefault();
    await api.post("/api/admin/work", {
      title: workForm.title,
      slug: workForm.slug,
      coverImage: workForm.coverImage,
      gallery: workForm.gallery ? workForm.gallery.split(",").map((x) => x.trim()) : [],
      seoTitle: workForm.title,
      seoDescription: `${workForm.title} case study`
    });
    setWorkForm({ title: "", slug: "", coverImage: "", gallery: "" });
    await loadAll();
  }

  async function updateMilestoneAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!timelineForm.bookingId) return;

    await api.patch(
      `/api/admin/projects/${timelineForm.bookingId}/milestones/${timelineForm.milestoneKey}`,
      {
        status: timelineForm.status,
        fileUrl: timelineForm.fileUrl || undefined,
        comment: timelineForm.comment || undefined
      }
    );
    setTimelineForm((s) => ({ ...s, fileUrl: "", comment: "" }));
    setAlert("Project milestone updated and customer notified");
    setTimeout(() => setAlert(""), 2500);
  }

  if (authChecking) {
    return (
      <main className="min-h-screen px-6 py-12 relative overflow-hidden">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="relative z-10 max-w-md mx-auto soft-card p-7 text-center">
          <ZeroLogo variant="inverted" />
          <p className="text-sm text-[var(--muted)] mt-4">Checking access...</p>
        </div>
      </main>
    );
  }

  if (!adminId) {
    return (
      <main className="min-h-screen px-6 py-12 relative overflow-hidden">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="relative z-10 max-w-[1400px] mx-auto mb-8">
          <div className="glass-header px-4 md:px-5 py-3 flex items-center justify-between gap-4">
            <div className="logo-glass">
              <ZeroLogo variant="inverted" />
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--muted)]">
              <a href="/" className="hover:text-[var(--ink)] transition">Home</a>
              <a href="/pricing" className="hover:text-[var(--ink)] transition">Pricing</a>
            </nav>
            <a href="/" className="btn-secondary rounded-full px-4 py-1.5 text-sm md:hidden">Home</a>
          </div>
        </div>
        <div className="relative z-10 max-w-md mx-auto soft-card p-7">
          <ZeroLogo variant="inverted" />
          <h1 className="text-3xl font-display text-[var(--ink)] mt-4">Control Access</h1>
          <p className="text-sm text-[var(--muted)] mt-2">Secure entry for operational analytics and management controls.</p>
          <form onSubmit={login} className="grid gap-3 mt-5">
            <input
              placeholder="Admin ID"
              className="field"
              value={loginForm.adminId}
              onChange={(e) => setLoginForm((s) => ({ ...s, adminId: e.target.value }))}
            />
            <input
              type="password"
              placeholder="Password"
              className="field"
              value={loginForm.password}
              onChange={(e) => setLoginForm((s) => ({ ...s, password: e.target.value }))}
            />
            <button className="rounded-xl bg-[var(--ink)] py-2.5 text-sm font-semibold text-white">Authenticate</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 md:px-8 py-6 md:py-8 relative overflow-hidden">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      {alert && <div className="fixed top-5 right-5 soft-card px-4 py-2 z-30 text-[var(--accent)] text-sm font-semibold">{alert}</div>}

      <div className="relative z-10 space-y-4 md:space-y-5 max-w-[1400px] mx-auto">
        <div className="glass-header px-4 md:px-5 py-3 flex items-center justify-between gap-4">
          <div className="logo-glass">
            <ZeroLogo variant="inverted" />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--muted)]">
            <a href="/" className="hover:text-[var(--ink)] transition">Home</a>
            <a href="/pricing" className="hover:text-[var(--ink)] transition">Pricing</a>
          </nav>
          <a href="/" className="btn-secondary rounded-full px-4 py-1.5 text-sm md:hidden">Home</a>
        </div>

        <header className="soft-card p-4 md:p-5 flex flex-wrap gap-3 items-center justify-between">
          <div>
            <ZeroLogo variant="inverted" />
            <p className="text-sm text-[var(--muted)] mt-2">{adminId} ({role})</p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            {(["today", "week", "month", "custom"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-full px-3 py-1.5 text-xs border ${filter === key ? "bg-[var(--ink)] text-white border-black" : "border-black/20 text-[var(--ink)]"}`}
              >
                {key}
              </button>
            ))}
            {filter === "custom" && (
              <>
                <input
                  type="date"
                  value={range.from}
                  onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
                  className="field text-xs px-2 py-1.5"
                />
                <input
                  type="date"
                  value={range.to}
                  onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
                  className="field text-xs px-2 py-1.5"
                />
              </>
            )}
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {metrics.map(([label, value]) => (
            <AdminCard key={label} className="p-4 hover-lift">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
              <p className="text-3xl font-display mt-2 text-[var(--ink)]">{value}</p>
            </AdminCard>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.3 }}>
          <AdminCard className="p-4 h-[320px]">
            <p className="font-display text-2xl text-[var(--ink)] mb-3">Revenue Trend</p>
            <ResponsiveContainer width="100%" height="86%">
              <AreaChart data={analytics?.charts.revenueTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#b5bdc8" />
                <XAxis dataKey="date" hide />
                <YAxis stroke="#667085" />
                <Tooltip />
                <Area dataKey="amount" stroke="#0e7490" fill="#0e749033" />
              </AreaChart>
            </ResponsiveContainer>
          </AdminCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.3, delay: 0.06 }}>
          <AdminCard className="p-4 h-[320px]">
            <p className="font-display text-2xl text-[var(--ink)] mb-3">Service Performance</p>
            <ResponsiveContainer width="100%" height="86%">
              <BarChart data={analytics?.charts.servicePerformance ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#b5bdc8" />
                <XAxis dataKey="service" stroke="#667085" />
                <YAxis stroke="#667085" />
                <Tooltip />
                <Bar dataKey="count" fill="#0f1720" />
              </BarChart>
            </ResponsiveContainer>
          </AdminCard>
          </motion.div>
        </section>

        <AdminCard className="p-4">
          <p className="font-display text-2xl text-[var(--ink)] mb-3">Bookings Management</p>
          <div className="overflow-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr className="text-left text-[var(--muted)] border-b border-black/10">
                  <th className="py-2">Customer</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-b border-black/10">
                    <td className="py-3">
                      <p className="font-medium text-[var(--ink)]">{b.name}</p>
                      <p className="text-xs text-[var(--muted)]">{b.email}</p>
                    </td>
                    <td>{b.service}</td>
                    <td>{new Date(b.date).toLocaleDateString()}</td>
                    <td>
                      <select
                        className="field text-xs px-2 py-1"
                        value={b.status}
                        onChange={(e) => updateStatus(b._id, e.target.value as Booking["status"])}
                      >
                        <option value="NEW">New</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>

        <section className="grid gap-4 xl:grid-cols-2">
          <AdminCard className="p-4 hover-lift">
            <p className="font-display text-2xl text-[var(--ink)] mb-3">Customer Database</p>
            <div className="space-y-2 max-h-80 overflow-auto pr-1">
              {customers.map((c) => (
                <div key={c.email} className="rounded-xl border border-black/10 p-3 bg-white/70">
                  <p className="font-medium text-[var(--ink)]">{c.name}</p>
                  <p className="text-xs text-[var(--muted)]">{c.email}</p>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    {c.phone} | total ₹{c.totalValue} | {c.bookingHistory.length} bookings
                  </p>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard className="p-4 hover-lift">
            <p className="font-display text-2xl text-[var(--ink)] mb-3">Activity Log</p>
            <div className="space-y-2 max-h-80 overflow-auto pr-1 text-sm">
              {activity.map((a) => (
                <div key={a._id} className="rounded-xl border border-black/10 p-3 bg-white/70">
                  <p className="font-mono text-xs text-[var(--accent)]">{a.action}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{a.performedBy} | {new Date(a.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </AdminCard>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <AdminCard className="p-4 hover-lift">
            <p className="font-display text-2xl text-[var(--ink)] mb-3">Service Management</p>
            <div className="space-y-2 mb-4">
              {services.map((s) => (
                <div key={s._id} className="rounded-xl border border-black/10 p-3 bg-white/70 flex justify-between items-center gap-2">
                  <div>
                    <p className="font-medium text-[var(--ink)]">{s.title}</p>
                    <p className="text-sm text-[var(--muted)]">₹{s.price}</p>
                  </div>
                  <button
                    disabled={!canManageSettings}
                    className="btn-secondary rounded-lg px-3 py-1.5 text-xs disabled:opacity-50"
                    onClick={() => toggleService(s)}
                  >
                    {s.isActive ? "Disable" : "Enable"}
                  </button>
                </div>
              ))}
            </div>

            {canManageSettings ? (
              <form onSubmit={createService} className="grid gap-2">
                <input
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm((s) => ({ ...s, title: e.target.value }))}
                  placeholder="Service title"
                  className="field"
                />
                <input
                  type="number"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm((s) => ({ ...s, price: Number(e.target.value) }))}
                  placeholder="Price"
                  className="field"
                />
                <button className="btn-primary py-2 text-sm">Add Service</button>
              </form>
            ) : (
              <p className="text-xs text-[var(--muted)]">MANAGER role has no settings access.</p>
            )}
          </AdminCard>

          <AdminCard className="p-4 hover-lift">
            <p className="font-display text-2xl text-[var(--ink)] mb-3">Work CMS</p>
            <div className="space-y-2 mb-4 max-h-48 overflow-auto pr-1">
              {work.map((w) => (
                <div key={w._id} className="rounded-xl border border-black/10 p-3 bg-white/70">
                  <p className="font-medium text-[var(--ink)]">{w.title}</p>
                  <p className="text-xs text-[var(--muted)]">/{w.slug}</p>
                </div>
              ))}
            </div>

            {canManageSettings ? (
              <form onSubmit={createWork} className="grid gap-2">
                <input value={workForm.title} onChange={(e) => setWorkForm((s) => ({ ...s, title: e.target.value }))} placeholder="Project title" className="field" />
                <input value={workForm.slug} onChange={(e) => setWorkForm((s) => ({ ...s, slug: e.target.value }))} placeholder="Slug" className="field" />
                <input value={workForm.coverImage} onChange={(e) => setWorkForm((s) => ({ ...s, coverImage: e.target.value }))} placeholder="Cover image URL" className="field" />
                <input value={workForm.gallery} onChange={(e) => setWorkForm((s) => ({ ...s, gallery: e.target.value }))} placeholder="Gallery URLs (comma separated)" className="field" />
                <button className="btn-primary py-2 text-sm">Add Project</button>
              </form>
            ) : (
              <p className="text-xs text-[var(--muted)]">MANAGER role has no work settings access.</p>
            )}
          </AdminCard>
        </section>

        <AdminCard className="p-4">
          <p className="font-display text-2xl text-[var(--ink)] mb-3">Project Timeline Updates</p>
          <p className="text-sm text-[var(--muted)] mb-3">
            Update milestones (Planned, In Progress, Delivered), attach file links, and add comments. Status updates trigger auto email to customer.
          </p>
          <form onSubmit={updateMilestoneAdmin} className="grid md:grid-cols-2 gap-2">
            <select
              className="field"
              value={timelineForm.bookingId}
              onChange={(e) => setTimelineForm((s) => ({ ...s, bookingId: e.target.value }))}
              required
            >
              <option value="">Select booking</option>
              {bookings.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} - {b.service}
                </option>
              ))}
            </select>
            <select
              className="field"
              value={timelineForm.milestoneKey}
              onChange={(e) => setTimelineForm((s) => ({ ...s, milestoneKey: e.target.value as "planned" | "in_progress" | "delivered" }))}
            >
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="delivered">Delivered</option>
            </select>
            <select
              className="field"
              value={timelineForm.status}
              onChange={(e) => setTimelineForm((s) => ({ ...s, status: e.target.value as "PENDING" | "DONE" }))}
            >
              <option value="PENDING">Pending</option>
              <option value="DONE">Done</option>
            </select>
            <input
              className="field"
              placeholder="File URL (optional)"
              value={timelineForm.fileUrl}
              onChange={(e) => setTimelineForm((s) => ({ ...s, fileUrl: e.target.value }))}
            />
            <input
              className="field md:col-span-2"
              placeholder="Comment (optional)"
              value={timelineForm.comment}
              onChange={(e) => setTimelineForm((s) => ({ ...s, comment: e.target.value }))}
            />
            <button className="btn-primary py-2 text-sm md:col-span-2">Update Milestone</button>
          </form>
        </AdminCard>
      </div>
    </main>
  );
}
