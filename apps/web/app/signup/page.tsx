"use client";

import { FormEvent, useState } from "react";
import { api } from "../../lib/api";
import { ZeroLogo } from "../../components/brand/ZeroLogo";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/api/auth/signup", form);
      window.location.href = "/portal";
    } catch (err: unknown) {
      const msg = typeof err === "object" && err && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : "Signup failed";
      setError(msg ?? "Signup failed");
    }
  }

  return (
    <main className="min-h-screen px-6 py-10 flex items-center justify-center">
      <div className="soft-card p-7 w-full max-w-md">
        <ZeroLogo variant="inverted" />
        <h1 className="text-3xl font-display text-[var(--ink)] mt-4">Create Account</h1>
        <p className="text-sm text-[var(--muted)] mt-2">Get access to your private project tracking portal.</p>

        <form onSubmit={onSubmit} className="grid gap-3 mt-5">
          <input className="field" placeholder="Full name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
          <input className="field" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} required />
          <input className="field" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary py-2.5 text-sm">Create Account</button>
        </form>

        <p className="text-sm text-[var(--muted)] mt-4">
          Already have an account? <a className="underline" href="/login">Login</a>
        </p>
      </div>
    </main>
  );
}
