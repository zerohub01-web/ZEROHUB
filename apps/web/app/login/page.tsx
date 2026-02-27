"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { api } from "../../lib/api";
import { ZeroLogo } from "../../components/brand/ZeroLogo";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (opts: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const adminEmail = "zerohub01@gmail.com";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const googleRef = useRef<HTMLDivElement | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/api/auth/login", form);
      const isAdminEmail = form.email.trim().toLowerCase() === adminEmail;
      window.location.href = isAdminEmail ? "/zero-control" : "/portal";
    } catch (err: unknown) {
      const msg = typeof err === "object" && err && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : "Login failed";
      setError(msg ?? "Login failed");
    }
  }

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.google || !googleRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          const res = await api.post<{ customer?: { email?: string } }>("/api/auth/google", { credential });
          const isAdminEmail = res.data?.customer?.email?.trim().toLowerCase() === adminEmail;
          window.location.href = isAdminEmail ? "/zero-control" : "/portal";
        }
      });
      window.google.accounts.id.renderButton(googleRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        width: 320
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <main className="min-h-screen px-6 py-10 flex items-center justify-center">
      <div className="soft-card p-7 w-full max-w-md">
        <ZeroLogo variant="inverted" />
        <h1 className="text-3xl font-display text-[var(--ink)] mt-4">Customer Login</h1>
        <p className="text-sm text-[var(--muted)] mt-2">Track your project progress and updates in real time.</p>

        <form onSubmit={onSubmit} className="grid gap-3 mt-5">
          <input className="field" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} required />
          <input className="field" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary py-2.5 text-sm">Login</button>
        </form>

        <div className="mt-4" ref={googleRef} />

        <p className="text-sm text-[var(--muted)] mt-4">
          New here? <a className="underline" href="/signup">Create account</a>
        </p>
      </div>
    </main>
  );
}
