"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "react-hot-toast";
import { FolderKanban, FolderOpen, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
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
  const [projects, setProjects] = useState<CustomerProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/api/auth/me"), api.get("/api/auth/projects")])
      .then(([me, data]) => {
        setCustomer(me.data);
        setProjects(data.data.projects ?? []);
        setLoading(false);
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, []);

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

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <SiteHeader portalMode />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-6 space-y-5">
        <section className="soft-card p-6">
          <h1 className="text-4xl font-display text-[var(--ink)]">Project Tracker</h1>
          <p className="text-[var(--muted)] mt-2">Track your milestones, files, and comments in one timeline.</p>
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
                <article key={project.id} className="soft-card p-5 hover-lift transition-all">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{project.businessType}</p>
                      <h2 className="text-2xl font-display text-[var(--ink)] mt-2">{project.title}</h2>
                      <p className={`text-sm mt-2 font-semibold ${statusTone(project.status)}`}>{project.status}</p>
                      <p className="text-sm text-[var(--muted)] mt-1">Date: {new Date(project.date).toLocaleDateString()}</p>
                      <p className="text-sm text-[var(--muted)]">Value: ₹{project.value}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid md:grid-cols-3 gap-3">
                    {project.milestones?.map((milestone) => (
                      <div key={milestone.key} className="rounded-xl border border-black/10 bg-white/65 hover:bg-white transition p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{milestone.title}</p>
                        <p className={`text-sm font-semibold mt-1 ${milestoneTone(milestone.status)}`}>{milestone.status}</p>
                        <p className="text-xs text-[var(--muted)] mt-1">Updated: {new Date(milestone.updatedAt).toLocaleDateString()}</p>

                        <div className="mt-3">
                          <p className="text-xs text-[var(--muted)] uppercase tracking-[0.12em]">Files</p>
                          <div className="mt-1 space-y-1">
                            {milestone.files.length ? (
                              milestone.files.map((file) => (
                                <a
                                  key={file}
                                  href={file}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block text-xs underline hover:text-[var(--ink)] text-[var(--accent)] break-all transition"
                                >
                                  {file}
                                </a>
                              ))
                            ) : (
                              <p className="text-xs text-[var(--muted)]">No files</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-xs text-[var(--muted)] uppercase tracking-[0.12em]">Comments</p>
                          <div className="mt-1 space-y-1">
                            {milestone.comments.length ? (
                              milestone.comments.map((c, idx) => (
                                <p key={`${c.by}-${idx}`} className="text-xs text-[var(--ink)]">
                                  {c.text} <span className="text-[var(--muted)]">- {c.by}</span>
                                </p>
                              ))
                            ) : (
                              <p className="text-xs text-[var(--muted)]">No comments</p>
                            )}
                          </div>
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
