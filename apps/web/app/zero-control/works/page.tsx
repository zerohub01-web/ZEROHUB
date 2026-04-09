"use client";

import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import { Trash2, Plus, Loader2, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

interface Work {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  type: string;
  result: string;
}

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    coverImage: "",
    type: "",
    result: ""
  });

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const { data } = await api.get("/api/admin/work");
      setWorks(data);
    } catch (err) {
      toast.error("Failed to load works");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this work?")) return;
    try {
      await api.delete(`/api/admin/work/${id}`);
      toast.success("Work deleted");
      fetchWorks();
    } catch {
      toast.error("Failed to delete work");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/api/admin/work", formData);
      toast.success("Work added successfully");
      setShowForm(false);
      setFormData({ title: "", slug: "", coverImage: "", type: "", result: "" });
      fetchWorks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add work");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display text-[var(--ink)]">Previous Works</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Manage the portfolio cases shown on the public site.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--ink)] text-white text-sm font-medium rounded-lg hover:bg-black/80 transition"
        >
          <Plus size={16} /> {showForm ? "Cancel" : "Add Work"}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleSubmit} className="soft-card p-6 mb-8 grid md:grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1 border-b pb-4 mb-2 md:border-b-0 md:pb-0 md:mb-0">
            <h3 className="font-display text-lg">Add New Case Study</h3>
            <p className="text-sm text-[var(--muted)] mt-1">Fill out the details to display on the public works page. For 'Cover Image', please provide a valid image URL.</p>
          </div>
          
          <div className="space-y-4 col-span-2 md:col-span-1">
            <input
              required
              type="text"
              placeholder="Case Title (e.g. Finance Ops Revamp)"
              className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white/50 focus:outline-none focus:border-[var(--ink)] text-sm"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <input
              required
              type="text"
              placeholder="Slug (e.g. finance-ops)"
              className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white/50 focus:outline-none focus:border-[var(--ink)] text-sm"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
            <input
              required
              type="url"
              placeholder="Cover Image URL"
              className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white/50 focus:outline-none focus:border-[var(--ink)] text-sm"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            />
            <input
              required
              type="text"
              placeholder="Industry Type (e.g. SaaS / Fintech)"
              className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white/50 focus:outline-none focus:border-[var(--ink)] text-sm"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
            <input
              required
              type="text"
              placeholder="Result (e.g. 42% faster conversion)"
              className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white/50 focus:outline-none focus:border-[var(--ink)] text-sm"
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
            />
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full flex justify-center py-3 bg-[var(--ink)] text-white font-medium rounded-lg hover:bg-black/90 transition disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Save Work"}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[var(--muted)]" /></div>
      ) : works.length === 0 ? (
        <section className="soft-card p-8 flex flex-col items-center justify-center text-center">
          <Briefcase size={48} className="text-[var(--muted)]/30 mb-4" />
          <h3 className="text-xl font-display text-[var(--ink)]">No works added yet</h3>
          <p className="text-sm text-[var(--muted)] mt-2">Click 'Add Work' to create your first portfolio case.</p>
        </section>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <article key={work._id} className="soft-card relative overflow-hidden group">
              {work.coverImage && (
                <div className="h-40 w-full bg-black/5 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={work.coverImage} alt={work.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--muted)] font-bold">{work.type}</p>
                <h3 className="text-lg font-display text-[var(--ink)] mt-1">{work.title}</h3>
                <p className="text-sm text-[var(--accent)] mt-2">{work.result}</p>
              </div>
              
              <button
                onClick={() => handleDelete(work._id)}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur text-red-600 rounded-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition shadow-sm hover:bg-red-50"
                title="Delete Work"
              >
                <Trash2 size={16} />
              </button>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
