"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "../../lib/api";
import { toast } from "react-hot-toast";
import { FolderKanban, FolderOpen, LogOut, Mail, MessageSquare, RefreshCw, ShieldCheck, UserRound } from "lucide-react";
import { SiteHeader } from "../../components/SiteHeader";
import { CustomerProfile, CustomerProject } from "../../types/customer";

function statusTone(status: CustomerProject["status"]) {
  if (status === "COMPLETED") return "text-emerald-700";
  if (status === "CONFIRMED") return "text-sky-700";
  return "text-amber-700";
}

function milestoneTone(status: "PENDING" | "DONE") {
  return status === "DONE" ? "text-emerald-700" : "text-amber-700";
}

export default function PortalPage() {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [posting, setPosting] = useState<string | null>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [me, data] = await Promise.all([
        api.get("/api/auth/me"),
        api.get("/api/projects")
      ]);
      setCustomer(me.data);
      setProjects(data.data.projects ?? []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        window.location.href = "/login";
      } else {
        toast.error("Failed to load project data.");
        console.error("Portal Data Fetch Error:", err);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function logout() {
    const loadingId = toast.loading("Logging out...");
    try {
      await api.post("/api/auth/logout");
      toast.success("Successfully logged out!", { id: loadingId });
      window.location.href = "/";
    } catch {
      toast.error("Failed to logout.", { id: loadingId });
    }
  }

  async function postComment(bookingId: string, milestoneKey: string) {
    const text = commentInputs[`${bookingId}-${milestoneKey}`]?.trim();
    if (!text) return;
    setPosting(`${bookingId}-${milestoneKey}`);
    try {
      await api.post(`/api/auth/projects/${bookingId}/milestones/${milestoneKey}/comment`, { comment: text });
      toast.success("Message sent!");
      setCommentInputs(prev => ({ ...prev, [`${bookingId}-${milestoneKey}`]: "" }));
      // Silently refresh to show new comment
      fetchData(true);
    } catch {
      toast.error("Failed to send message.");
    } finally {
      setPosting(null);
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <SiteHeader portalMode />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-6 space-y-5">
        <section className="soft-card p-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display text-[var(--ink)]">Project Tracker</h1>
            <p className="text-[var(--muted)] mt-2">Track your milestones, admin messages, and project files.</p>
          </div>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-black transition"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </section>

        <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
          <section className="soft-card p-6 lg:sticky lg:top-28">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Account Details</p>
                <h2 className="text-2xl font-display text-[var(--ink)] mt-2">Client Profile</h2>
              </div>
              <button
                onClick={logout}
                className="btn-secondary flex items-center gap-1.5 hover-lift rounded-full px-4 py-2 text-sm"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>

            {loading ? (
              <div className="mt-4 grid gap-3">
                <div className="h-24 skeleton"></div>
                <div className="h-24 skeleton"></div>
                <div className="h-24 skeleton"></div>
              </div>
            ) : (
              <>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <article className="rounded-xl border border-black/10 bg-white/70 p-4">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--ink)] text-white/90">
                      <UserRound size={16} />
                    </div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)] mt-3">Client Name</p>
                    <p className="text-lg font-semibold text-[var(--ink)] mt-1">{customer?.name ?? "Client"}</p>
                  </article>

                  <article className="rounded-xl border border-black/10 bg-white/70 p-4">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--ink)] text-white/90">
                      <Mail size={16} />
                    </div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)] mt-3">Email</p>
                    <p className="text-sm text-[var(--ink)] mt-1 break-all">{customer?.email ?? "-"}</p>
                  </article>

                  <article className="rounded-xl border border-black/10 bg-white/70 p-4">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--ink)] text-white/90">
                      <FolderKanban size={16} />
                    </div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)] mt-3">Active Projects</p>
                    <p className="text-lg font-semibold text-[var(--ink)] mt-1">{projects.length}</p>
                  </article>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <ShieldCheck size={14} /> Session Active
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                    <FolderKanban size={14} /> {projects.length} Live Project{projects.length === 1 ? "" : "s"}
                  </span>
                </div>
              </>
            )}
          </section>

          <section className="space-y-4">
            {loading ? (
              <article className="soft-card p-5 space-y-4">
                <div className="w-1/4 h-3 skeleton mb-2"></div>
                <div className="w-1/2 h-8 skeleton mb-4"></div>
                <div className="w-32 h-4 skeleton"></div>
                <div className="mt-5 grid md:grid-cols-3 gap-3">
                  <div className="h-32 skeleton"></div>
                  <div className="h-32 skeleton"></div>
                </div>
              </article>
            ) : projects.length ? (
              projects.map((project) => (
                <article key={project.id || project._id} className="soft-card p-5">
                  <div className="mb-4 h-48 w-full rounded-lg overflow-hidden border border-black/10 bg-white/60 flex items-center justify-center">
                    {project.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src="/zero-logo.png" alt="ZeroOps" className="h-16 w-auto opacity-30" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/10 pb-4 mb-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{project.businessType || project.type}</p>
                      <h2 className="text-2xl font-display text-[var(--ink)] mt-2">{project.title}</h2>
                      {project.status && <p className={`text-sm mt-2 font-semibold ${statusTone(project.status)}`}>{project.status}</p>}
                      {project.date ? (
                        <p className="text-sm text-[var(--muted)] mt-1">Date: {new Date(project.date).toLocaleDateString()}</p>
                      ) : (
                        <p className="text-sm text-[var(--muted)] mt-1">Date: {new Date(project.createdAt).toLocaleDateString()}</p>
                      )}
                      {project.value && <p className="text-sm text-[var(--muted)]">Value: ₹{project.value}</p>}
                      {project.result && <p className="text-sm text-[var(--accent)] mt-2">{project.result}</p>}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {project.milestones?.map((milestone: any) => (
                      <div key={milestone.key} className="rounded-xl border border-black/10 bg-white/65 p-5">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-[var(--ink)] uppercase tracking-[0.12em]">{milestone.title}</p>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            milestone.status === "DONE"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>{milestone.status}</span>
                        </div>
                        <p className="text-xs text-[var(--muted)] mb-4">Last updated: {new Date(milestone.updatedAt).toLocaleString()}</p>

                        {/* Files */}
                        {milestone.files.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-[var(--muted)] uppercase tracking-[0.12em] mb-1">Files</p>
                            <div className="space-y-1">
                              {milestone.files.map((file: string) => (
                                <a
                                  key={file}
                                  href={file}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block text-xs underline hover:text-[var(--ink)] text-[var(--accent)] break-all transition"
                                >
                                  {file}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Chat Thread */}
                        <div className="bg-gray-50/70 rounded-lg border p-3 space-y-2 max-h-56 overflow-y-auto mb-3">
                          {milestone.comments.length === 0 ? (
                            <p className="text-xs text-[var(--muted)] italic text-center py-2">No messages yet. Admin will provide updates here.</p>
                          ) : (
                            milestone.comments.map((c: any, idx: number) => (
                              <div
                                key={`${c.by}-${idx}`}
                                className={`text-sm p-3 rounded-lg max-w-[85%] ${
                                  c.by === "client"
                                    ? "ml-auto bg-[var(--ink)] text-white"
                                    : "bg-white border border-black/10 text-[var(--ink)]"
                                }`}
                              >
                                <p className="text-[10px] opacity-60 mb-1 uppercase font-semibold">
                                  {c.by === "client" ? "You" : "ZeroOps Team"} · {new Date(c.at).toLocaleString()}
                                </p>
                                <p>{c.text}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Client Reply */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Reply to admin..."
                            className="flex-1 text-sm px-3 py-2 border rounded-md focus:outline-none focus:border-[var(--ink)]"
                            value={commentInputs[`${project.id}-${milestone.key}`] ?? ""}
                            onChange={(e) => setCommentInputs(prev => ({
                              ...prev,
                              [`${project.id}-${milestone.key}`]: e.target.value
                            }))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") postComment(project.id, milestone.key);
                            }}
                          />
                          <button
                            onClick={() => postComment(project.id, milestone.key)}
                            disabled={!commentInputs[`${project.id}-${milestone.key}`]?.trim() || posting === `${project.id}-${milestone.key}`}
                            className="px-4 bg-[var(--ink)] text-white rounded-md hover:bg-black/80 transition disabled:opacity-50 text-sm"
                          >
                            <MessageSquare size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <article className="soft-card p-10 mt-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50/50 flex items-center justify-center text-[var(--accent)] mb-4 shadow-sm border border-blue-100/30">
                  <FolderOpen size={28} />
                </div>
                <h2 className="text-xl font-display text-[var(--ink)]">No Active Projects</h2>
                <p className="text-[var(--muted)] mt-2 max-w-sm">
                  You haven't booked any services yet. Start a project with us to see your timeline and milestones here.
                </p>
                <a href="/" className="mt-5 btn-primary hover-lift px-6 py-2.5 text-sm inline-block">
                  Start Project
                </a>
              </article>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
