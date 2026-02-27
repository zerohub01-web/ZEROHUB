"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { ZeroLogo } from "../../components/brand/ZeroLogo";
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

  useEffect(() => {
    Promise.all([api.get("/api/auth/me"), api.get("/api/auth/projects")])
      .then(([me, data]) => {
        setCustomer(me.data);
        setProjects(data.data.projects ?? []);
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, []);

  async function logout() {
    await api.post("/api/auth/logout");
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen px-6 md:px-10 py-8 relative overflow-hidden">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="relative z-10 max-w-6xl mx-auto space-y-5">
        <header className="glass-header px-4 md:px-5 py-3 flex items-center justify-between">
          <div className="logo-glass"><ZeroLogo variant="inverted" /></div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-[var(--muted)]">{customer?.name ?? "Loading..."}</p>
            <button onClick={logout} className="btn-secondary rounded-full px-4 py-1.5 text-sm">Logout</button>
          </div>
        </header>

        <section className="soft-card p-6">
          <h1 className="text-4xl font-display text-[var(--ink)]">Project Tracker</h1>
          <p className="text-[var(--muted)] mt-2">Track your milestones, files, and comments in one timeline.</p>
        </section>

        <section className="space-y-4">
          {projects.length ? projects.map((project) => (
            <article key={project.id} className="soft-card p-5">
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
                  <div key={milestone.key} className="rounded-xl border border-black/10 bg-white/65 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{milestone.title}</p>
                    <p className={`text-sm font-semibold mt-1 ${milestoneTone(milestone.status)}`}>{milestone.status}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">Updated: {new Date(milestone.updatedAt).toLocaleDateString()}</p>

                    <div className="mt-3">
                      <p className="text-xs text-[var(--muted)] uppercase tracking-[0.12em]">Files</p>
                      <div className="mt-1 space-y-1">
                        {milestone.files.length ? milestone.files.map((file) => (
                          <a key={file} href={file} target="_blank" rel="noreferrer" className="block text-xs underline text-[var(--accent)] break-all">
                            {file}
                          </a>
                        )) : <p className="text-xs text-[var(--muted)]">No files</p>}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-[var(--muted)] uppercase tracking-[0.12em]">Comments</p>
                      <div className="mt-1 space-y-1">
                        {milestone.comments.length ? milestone.comments.map((c, idx) => (
                          <p key={`${c.by}-${idx}`} className="text-xs text-[var(--ink)]">
                            {c.text} <span className="text-[var(--muted)]">- {c.by}</span>
                          </p>
                        )) : <p className="text-xs text-[var(--muted)]">No comments</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          )) : (
            <article className="soft-card p-5 md:col-span-2">
              <p className="text-[var(--muted)]">No projects found yet for your account email address.</p>
            </article>
          )}
        </section>
      </div>
    </main>
  );
}
