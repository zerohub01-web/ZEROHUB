"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck, TrendingUp, Zap } from "lucide-react";

const testimonials = [
    {
        name: "Alex Rivera",
        role: "COO @ FinStream",
        content: "ZERO didn't just build a site; they built an engine. Our booking volume tripled while manual admin work dropped by 60%.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
    },
    {
        name: "Sarah Chen",
        role: "Founder @ HealthPath",
        content: "The custom dashboard gives us clarity we never had. We can now track leads from first click to final onboarding automatically.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
        name: "James Miller",
        role: "CEO @ RetailStack",
        content: "The automated audit identified exactly where we were losing revenue. Within two weeks, our conversion rates hit 24%.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
    }
];

const logos = [
    "FINSTREAM", "HEALTHPATH", "RETAILSTACK", "NEXUS AI", "CORE LOGISTICS", "QUANTUM OPS"
];

export function TrustSection() {
    return (
        <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 py-16 md:py-24">
            {/* Client Logos */}
            <div className="border-t border-black/5 pt-12">
                <p className="text-center text-xs uppercase tracking-[0.3em] text-[var(--muted)] mb-10 font-bold">Trusted by Performance-First Teams</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                    {logos.map(logo => (
                        <span key={logo} className="font-display font-black text-xl md:text-2xl tracking-tighter cursor-default hover:text-[var(--accent)] transition-colors">{logo}</span>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
            <div className="mt-24 grid md:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                    <motion.div
                        key={t.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="soft-card p-8 flex flex-col"
                    >
                        <div className="flex gap-1 text-[var(--accent)] mb-6">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <p className="text-[var(--ink)] font-medium leading-relaxed italic flex-1">"{t.content}"</p>
                        <div className="mt-8 flex items-center gap-4">
                            <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border border-black/10 bg-white" />
                            <div>
                                <p className="text-sm font-bold text-[var(--ink)]">{t.name}</p>
                                <p className="text-xs text-[var(--muted)] font-medium">{t.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Case Studies / Before & After */}
            <div className="mt-24 grid lg:grid-cols-2 gap-8">
                <div className="dark-card p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                        <ShieldCheck size={120} />
                    </div>
                    <p className="text-xs uppercase tracking-widest text-white/50 mb-4">Case Study #01</p>
                    <h3 className="text-3xl font-display text-white mb-6">FinStream: Scaling without Hiring</h3>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <p className="text-xs text-white/40 uppercase mb-1">Before ZERO</p>
                            <p className="text-xl font-bold text-red-300">12h Lead Delay</p>
                        </div>
                        <div>
                            <p className="text-xs text-white/40 uppercase mb-1">After ZERO</p>
                            <p className="text-xl font-bold text-emerald-300">Instant Routing</p>
                        </div>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">
                        Automated the entire triage process using AI intent scoring. Reduced need for 2 full-time intake coordinators while handling 4x the lead volume.
                    </p>
                </div>

                <div className="soft-card p-8 md:p-12 border-dashed border-2 border-black/10 flex flex-col justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center mx-auto mb-6">
                        <TrendingUp size={32} />
                    </div>
                    <h3 className="text-2xl font-display text-[var(--ink)] mb-4">Ready for your system audit?</h3>
                    <p className="text-[var(--muted)] text-sm mb-8">Get a 15-minute breakdown of your operational bottlenecks and how we can automate them.</p>
                    <a href="/book" className="btn-primary rounded-full px-8 py-4 inline-flex items-center gap-2 justify-center">
                        <Zap size={18} fill="currentColor" />
                        Book System Demo
                    </a>
                </div>
            </div>
        </section>
    );
}
