"use client";

import { motion } from "framer-motion";
import { Layout, LineChart, Cpu, BarChart3 } from "lucide-react";

export function VisualProof() {
    return (
        <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 py-16 md:py-24">
            <div className="text-center mb-16">
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--accent)] mb-4">Command Center Proof</p>
                <h2 className="text-4xl md:text-5xl font-display text-[var(--ink)]">See the system in action.</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Mockup Dashboard UI */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="relative"
                >
                    <div className="bg-[#0c0c0c] rounded-2xl p-2 shadow-2xl overflow-hidden aspect-[4/3] border border-white/5">
                        <div className="bg-[#1a1a1a] h-6 flex items-center gap-1.5 px-3 border-b border-white/5">
                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        </div>
                        <div className="p-6 grid grid-cols-12 gap-4">
                            <div className="col-span-3 space-y-3">
                                <div className="h-8 w-full bg-white/5 rounded-md animate-pulse" />
                                <div className="h-4 w-2/3 bg-white/5 rounded-md" />
                                <div className="h-4 w-3/4 bg-white/5 rounded-md" />
                                <div className="pt-8 space-y-2">
                                    <div className="h-6 w-full bg-[var(--accent)]/20 rounded-md" />
                                    <div className="h-6 w-full bg-white/5 rounded-md" />
                                </div>
                            </div>
                            <div className="col-span-9 space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="h-24 bg-white/5 rounded-xl border border-white/5 p-3 flex flex-col justify-between">
                                        <BarChart3 size={14} className="text-[var(--accent)]" />
                                        <div className="h-2 w-12 bg-white/10 rounded" />
                                    </div>
                                    <div className="h-24 bg-white/5 rounded-xl border border-white/5 p-3 flex flex-col justify-between">
                                        <TrendingUp size={14} className="text-emerald-400" />
                                        <div className="h-2 w-12 bg-white/10 rounded" />
                                    </div>
                                    <div className="h-24 bg-white/5 rounded-xl border border-white/5 p-3 flex flex-col justify-between">
                                        <Cpu size={14} className="text-purple-400" />
                                        <div className="h-2 w-12 bg-white/10 rounded" />
                                    </div>
                                </div>
                                <div className="h-48 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-around opacity-20">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="w-1 bg-[var(--accent)]" style={{ height: `${20 + Math.random() * 60}%` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[var(--accent)]/10 blur-[80px] -z-10" />
                </motion.div>

                <div className="space-y-10">
                    <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-xl bg-[var(--ink)] text-white flex items-center justify-center shrink-0">
                            <Layout size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-display text-[var(--ink)] mb-2">Unified Dashboard</h3>
                            <p className="text-sm text-[var(--muted)] leading-relaxed">Control your entire business pipeline from a single, high-fidelity command center.</p>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                            <LineChart size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-display text-[var(--ink)] mb-2">Real-time Intelligence</h3>
                            <p className="text-sm text-[var(--muted)] leading-relaxed">Turn obscure logs into decision-ready metrics. Track conversion, churn, and operational speed instantly.</p>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                            <Cpu size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-display text-[var(--ink)] mb-2">Agentic Workflows</h3>
                            <p className="text-sm text-[var(--muted)] leading-relaxed">We deploy AI agents that handle triaging, notifications, and data entry, so your team doesn't have to.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

import { TrendingUp } from "lucide-react";
