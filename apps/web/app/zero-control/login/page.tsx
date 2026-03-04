"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { api } from "../../../lib/api";
import { ZeroLogo } from "../../../components/brand/ZeroLogo";

export default function AdminLoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    async function handleLogin(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Verifying credentials...");

        try {
            await api.post("/api/admin/login", form);
            toast.success("Welcome back, Master Admin.", { id: toastId });
            router.push("/zero-control");
        } catch (err: any) {
            const message = err.response?.data?.message || "Authentication failed";
            toast.error(message, { id: toastId });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 bg-[var(--bg-a)] overflow-hidden">
            {/* Background Orbs for Ambient Glow */}
            <div className="orb orb-a opacity-30 animate-pulse" />
            <div className="orb orb-b opacity-20" />

            <div className="w-full max-w-md relative z-10">
                <div className="glass-card p-10 flex flex-col items-center">
                    <div className="mb-8">
                        <ZeroLogo variant="inverted" />
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 bg-[var(--ink)]/5 rounded-full mb-6">
                        <ShieldCheck size={14} className="text-[var(--accent)]" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--muted)]">Admin Node V1.0</span>
                    </div>

                    <h1 className="text-3xl font-display text-[var(--ink)] mb-2 text-center">System Access</h1>
                    <p className="text-sm text-[var(--muted)] mb-8 text-center px-4 leading-relaxed">
                        Please authenticate via encrypted channel to continue to the ZERO Operating System.
                    </p>

                    <form onSubmit={handleLogin} className="w-full space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] ml-1" htmlFor="email">
                                Terminal ID
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="field w-full py-3 px-4 text-base"
                                placeholder="admin@zeroops.in"
                                required
                                value={form.email}
                                onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] ml-1" htmlFor="password">
                                Passphrase
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="field w-full py-3 px-4 text-base pr-12"
                                    placeholder="••••••••"
                                    required
                                    value={form.password}
                                    onChange={(e) => setForm(s => ({ ...s, password: e.target.value }))}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] opacity-60 hover:opacity-100 transition"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2 group relative overflow-hidden"
                        >
                            <span className="relative z-10">{loading ? "Synchronizing..." : "Initiate Connection"}</span>
                            {!loading && <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-black/5 w-full text-center">
                        <a href="/" className="text-xs text-[var(--muted)] hover:text-[var(--ink)] transition flex items-center justify-center gap-2">
                            Back to Public Interface
                        </a>
                    </div>
                </div>

                <p className="text-center mt-8 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] opacity-40 font-bold">
                    &copy; 2026 ZERO Business Automation Systems
                </p>
            </div>
        </div>
    );
}
