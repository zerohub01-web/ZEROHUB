"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import { ZeroLogo } from "../components/brand/ZeroLogo";
import { CtaBlock } from "../components/CtaBlock";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

const Hero3D = dynamic(() => import("../components/os/Hero3D"), { ssr: false });

const trust = [
  { value: "99.9%", label: "platform uptime target" },
  { value: "3x", label: "faster ops delivery" },
  { value: "24/7", label: "booking automation" },
  { value: "360", label: "business visibility" }
];

const process = [
  { step: "01", title: "Architecture", copy: "Define revenue flow, conversion points, and operational bottlenecks." },
  { step: "02", title: "Build", copy: "Ship production website, admin system, and secure analytics stack." },
  { step: "03", title: "Scale", copy: "Track KPIs and execute weekly optimization cycles." }
];

const features = [
  "High-speed productized website builds",
  "Automated intake and CRM pipelines",
  "Custom workflow portals and dashboards",
  "AI assistant integration for support and sales",
  "Security hardening and infrastructure reliability",
  "Monthly maintenance MRR retainers"
];

const workHighlights = [
  { title: "Finance Ops Revamp", result: "42% faster conversion-to-call", type: "SaaS / Fintech" },
  { title: "Healthcare Intake Flow", result: "3.1x qualified lead growth", type: "Healthcare" },
  { title: "Retail Expansion Engine", result: "27% repeat customer lift", type: "Commerce" }
];

const pricing = [
  { name: "Digital Storefront", price: "INR 15,000 - 25,000", summary: "Fast deployment with strict scope boundaries" },
  { name: "Business Automation", price: "INR 40,000 - 60,000", summary: "Automated workflows replacing manual operations" },
  { name: "Digital Fortress & AI", price: "INR 90,000 - 1,50,000+", summary: "Custom backend, AI agents, and security hardening" }
];

const maintenancePlans = [
  {
    name: "Essential Care",
    period: "INR 2,000 - 3,500 / month",
    items: ["Managed hosting", "Weekly off-site backups", "SSL renewals", "24/7 uptime monitoring"]
  },
  {
    name: "Growth & Security",
    period: "INR 6,000 - 10,000 / month",
    items: ["Everything in Essential", "Vulnerability scans + patching", "DB optimization", "Monthly analytics report"]
  },
  {
    name: "Elite Retainer",
    period: "INR 15,000+ / month",
    items: ["Everything in Growth", "AI tuning and conversion review", "12h priority SLA", "Competitor intelligence automation"]
  }
];

export default function HomePage() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<{ _id: string; title: string }[]>([]);
  const [activeTrack, setActiveTrack] = useState<"acquire" | "operate" | "expand">("acquire");
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    api
      .get("/api/services")
      .then((res) => setServices(res.data))
      .catch(() => setServices([]));
    api
      .get("/api/auth/me")
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  async function handleBooking(formData: FormData) {
    setSending(true);
    setError(null);

    const payload = {
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      phone: String(formData.get("phone")),
      businessType: String(formData.get("businessType")),
      currentWorkflow: String(formData.get("currentWorkflow")),
      teamSize: String(formData.get("teamSize") ?? ""),
      service: String(formData.get("service")),
      date: new Date().toISOString()
    };

    try {
      await api.post("/api/bookings", payload);
      setDone(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data as { message?: string; errors?: { fieldErrors?: Record<string, string[]> } } | undefined;
        const firstFieldError = responseData?.errors?.fieldErrors
          ? Object.values(responseData.errors.fieldErrors).flat()[0]
          : undefined;
        setError(firstFieldError ?? responseData?.message ?? "Network error. Verify API is running on localhost:4000.");
      } else {
        setError("Booking failed. Please try again.");
      }
    } finally {
      setSending(false);
    }
  }

  const trackContent = {
    acquire: {
      title: "Acquire",
      text: "AI-assisted conversion surfaces, intent scoring, and adaptive booking flows."
    },
    operate: {
      title: "Operate",
      text: "Agent-ready admin control, predictive KPI alerts, and operational observability."
    },
    expand: {
      title: "Expand",
      text: "Composable modules for new markets, services, and productized revenue streams."
    }
  };

  return (
    <main className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "ZeroOps Web Development",
            "url": "https://zeroops.in",
            "logo": "https://zeroops.in/logo.png",
            "description": "ZeroOps provides automated, affordable web development and zero-maintenance Next.js websites for small businesses globally.",
            "priceRange": "₹15000 - ₹100000",
            "areaServed": [
              { "@type": "City", "name": "Bangalore" },
              { "@type": "Country", "name": "India" },
              { "@type": "Place", "name": "Global" }
            ],
            "founder": {
              "@type": "Person",
              "name": "Nishanth Raj S",
              "jobTitle": "Full-Stack DevOps Engineer",
              "sameAs": [
                "https://www.linkedin.com/in/nishanth-raj-s",
                "https://github.com/nishanthrajs01-stack"
              ]
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Web Development Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Automated Landing Page Deployment",
                    "description": "High-conversion Next.js single page applications."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Full-Stack Web App Development",
                    "description": "Custom Node.js/Express backends with automated CI/CD."
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Zero-Maintenance E-Commerce",
                    "description": "Secure, scalable storefronts with zero operational overhead."
                  }
                }
              ]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "24"
            }
          })
        }}
      />
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <SiteHeader />

      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 pt-8 md:pt-12 pb-16 md:pb-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 md:gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/70 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            Operating System for Growth Teams
          </p>
          <h1 className="mt-6 text-5xl md:text-7xl leading-[0.96] font-display tracking-tight text-[var(--ink)]">
            Affordable Web Development with Zero Operational Overhead
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--muted)]">
            ZERO combines cinematic brand presence with booking automation, secure admin controls, and decision-grade analytics.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="/book" className="btn-primary hover-lift rounded-full px-8 py-3.5 text-sm md:text-base font-semibold shadow-md shadow-[var(--ink)]/10">Start Project</a>
            <a href="/services" className="btn-secondary rounded-full px-8 py-3.5 text-sm md:text-base font-semibold">View Offerings</a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="tilt-panel p-4 md:p-5 relative">
          <div className="rounded-2xl border border-black/10 bg-white/70 p-3">
            <div className="h-[300px] md:h-[360px] rounded-xl overflow-hidden border border-black/10 bg-[var(--ink)]/95">
              <div className="hidden md:block h-full">
                <Hero3D />
              </div>
              <div className="md:hidden h-full grid place-items-center px-4 text-center text-white/70 text-sm">
                Mobile mode runs a lightweight visualization.
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.35 }}
              className="hero-brand-tag"
            >
              <ZeroLogo variant="white" />
              <p className="hero-brand-meta">Real-time operating model</p>
            </motion.div>
            <div className="hero-pulse" />
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 border-y border-black/10 bg-white/45 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 py-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {trust.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.28, delay: i * 0.05 }}
            >
              <p className="text-3xl font-display text-[var(--ink)]">{item.value}</p>
              <p className="text-sm text-[var(--muted)] mt-1">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 py-16 md:py-24">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6 md:gap-8">
          <div className="dark-card p-6 md:p-8 lg:p-10 flex flex-col justify-center">
            <p className="text-xs md:text-sm uppercase tracking-[0.18em] text-white/70">Pricing</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display mt-3 leading-tight">Transparent, Affordable Web Development Pricing</h2>
            <p className="text-sm md:text-base text-white/90 mt-4 leading-relaxed">Productized pricing for fast delivery with strict scope and maximum value.</p>
            <div className="mt-8">
              <a href="/pricing" className="inline-block hover-lift btn-secondary rounded-full px-6 md:px-8 py-3 text-sm md:text-base font-semibold bg-white text-[var(--ink)] border-white">Full Pricing Breakdown</a>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pricing.map((plan) => (
              <article key={plan.name} className="soft-card p-6 md:p-7 flex flex-col hover-lift transition-all">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{plan.name}</p>
                <p className="text-3xl md:text-4xl font-display text-[var(--ink)] mt-3">{plan.price}</p>
                <p className="text-sm text-[var(--muted)] mt-4 leading-relaxed flex-1">{plan.summary}</p>
              </article>
            ))}
          </div>
        </div>
        <CtaBlock />
      </section>

      <section id="services" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--muted)]">Core Services</p>
            <h2 className="text-4xl md:text-5xl font-display text-[var(--ink)] mt-3 leading-tight">Automated Website Development & Secure Cloud Infrastructure</h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-[var(--muted)] leading-relaxed">
            From storefront launches to AI-driven operations, we deliver scoped systems that remove manual workload and compound growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {services.length > 0 ? (
            services.map((service, i) => (
              <motion.article
                key={service._id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="soft-card p-6 md:p-8 hover-lift"
              >
                <h3 className="text-2xl font-display text-[var(--ink)]">{service.title}</h3>
                <p className="text-sm text-[var(--muted)] mt-4 leading-relaxed">Modular delivery with analytics-backed iteration and operational hardening.</p>
              </motion.article>
            ))
          ) : (
            <article className="soft-card p-6 md:p-8 md:col-span-3">
              <h3 className="text-2xl font-display text-[var(--ink)]">High-leverage services</h3>
              <div className="mt-5 grid sm:grid-cols-2 gap-4 text-sm text-[var(--muted)]">
                <p>• Productized website + brand launch</p>
                <p>• Intake workflow automation</p>
                <p>• AI assistant + dashboard integrations</p>
                <p>• Maintenance MRR and support</p>
              </div>
            </article>
          )}
        </div>
        <CtaBlock />
      </section>

      <section id="features" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 pb-16 md:pb-24">
        <div className="soft-card p-6 md:p-8 lg:p-10">
          <p className="text-xs md:text-sm uppercase tracking-[0.18em] text-[var(--muted)] font-semibold">Features</p>
          <h2 className="text-3xl md:text-5xl font-display text-[var(--ink)] mt-3 leading-tight">Built-in operating capabilities.</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {features.map((item) => (
              <div key={item} className="rounded-xl border border-black/10 bg-white/60 p-5 text-[var(--ink)] font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="maintenance" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 pb-16 md:pb-24">
        <div className="soft-card p-6 md:p-8 lg:p-10">
          <p className="text-xs md:text-sm uppercase tracking-[0.18em] text-[var(--muted)] font-semibold">Maintenance MRR</p>
          <h2 className="text-3xl md:text-5xl font-display text-[var(--ink)] mt-3 leading-tight">Recurring care plans that protect uptime, speed, and security.</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {maintenancePlans.map((plan) => (
              <article key={plan.name} className="rounded-xl border border-black/10 bg-white/60 p-6 md:p-7 hover-lift transition-all">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{plan.period}</p>
                <h3 className="text-2xl font-display text-[var(--ink)] mt-2">{plan.name}</h3>
                <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  {plan.items.map((item) => (
                    <li key={item} className="flex gap-2"><span className="text-[var(--accent)]">•</span> {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="technology"
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 pb-16 md:pb-24"
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setSpotlight({ x, y });
        }}
      >
        <div className="tech-shell p-6 md:p-10" style={{ ["--spot-x" as string]: `${spotlight.x}%`, ["--spot-y" as string]: `${spotlight.y}%` }}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-xs md:text-sm uppercase tracking-[0.18em] text-white/70 font-semibold">Technology 2026</p>
              <h2 className="text-3xl md:text-5xl font-display text-white mt-3 leading-tight">Enterprise Engineers for Small Businesses</h2>
            </div>
            <p className="max-w-md text-sm md:text-base text-white/80 leading-relaxed">
              Built with agentic workflows, event-driven automations, and secure production architecture expected in modern 2026 SaaS delivery.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4 mt-6">
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Agentic Automation Layer",
                "Predictive Analytics Signals",
                "Role-Aware Security Guardrails",
                "Composable Service Modules",
                "Real-time Event Notification Bus",
                "Edge-ready API strategy"
              ].map((item) => (
                <div key={item} className="tech-chip">{item}</div>
              ))}
            </div>
            <div className="tech-panel">
              <p className="text-xs uppercase tracking-[0.18em] text-white/65">Growth Tracks</p>
              <div className="flex gap-2 mt-3">
                {(["acquire", "operate", "expand"] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTrack(key)}
                    className={`track-btn ${activeTrack === key ? "track-btn-active" : ""}`}
                  >
                    {key}
                  </button>
                ))}
              </div>
              <h3 className="text-2xl font-display text-white mt-4">{trackContent[activeTrack].title}</h3>
              <p className="text-sm text-white/75 mt-2">{trackContent[activeTrack].text}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 pb-12 md:pb-14 lg:pb-16">
        <div className="grid md:grid-cols-3 gap-4">
          {process.map((item) => (
            <article key={item.step} className="soft-card p-6">
              <p className="font-mono text-sm text-[var(--accent)]">{item.step}</p>
              <h3 className="text-2xl font-display text-[var(--ink)] mt-2">{item.title}</h3>
              <p className="text-sm text-[var(--muted)] mt-2">{item.copy}</p>
            </article>
          ))}
        </div>
        <CtaBlock />
      </section>

      {isAuthenticated && (
        <section id="works" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 pb-12">
          <div className="grid lg:grid-cols-3 gap-4">
            {workHighlights.map((work) => (
              <article key={work.title} className="soft-card p-6">
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">{work.type}</p>
                <h3 className="text-2xl font-display text-[var(--ink)] mt-2">{work.title}</h3>
                <p className="text-sm text-[var(--accent)] mt-3">{work.result}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section id="book" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 pb-24 md:pb-32">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 md:gap-8 items-start">
          <div className="dark-card p-8 md:p-10 lg:p-12">
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-white/70 font-semibold">Consultation</p>
            <h2 className="text-3xl md:text-5xl font-display mt-4 leading-tight">Plan your next build sprint.</h2>
            <p className="text-white/90 mt-5 leading-relaxed">Share your business context, desired outcomes, and delivery timeline. Start systemizing today.</p>
          </div>

          <div className="soft-card p-6 md:p-8">
            {done ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto mb-5 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 className="text-2xl font-display text-[var(--ink)]">Booking Received</h3>
                <p className="text-[var(--muted)] mt-2">Your system audit request has been routed to our team. We will reach out on WhatsApp shortly.</p>
              </motion.div>
            ) : (
              <form action={handleBooking} className="grid gap-4">
                <input name="name" required placeholder="Full name" className="field py-3" />
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="email" type="email" required placeholder="Work email" className="field py-3" />
                  <input name="phone" required placeholder="Phone number" className="field py-3" />
                </div>
                <input name="businessType" required placeholder="Business Type & Industry" className="field py-3" />
                <textarea name="currentWorkflow" required placeholder="Describe your current manual workflow & bottlenecks..." className="field py-3 min-h-[100px] resize-y" />
                <div className="grid md:grid-cols-2 gap-4">
                  <select name="teamSize" className="field py-3" defaultValue="">
                    <option value="" disabled>Team size</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="200+">200+</option>
                  </select>
                  <select name="service" required className="field py-3">
                    <option value="">Select service to audit</option>
                    {services.length > 0 ? (
                      services.map((service) => (
                        <option key={service._id} value={service.title}>{service.title}</option>
                      ))
                    ) : (
                      <>
                        <option value="Digital Storefront build">Digital Storefront build</option>
                        <option value="Business Automation pipeline">Business Automation pipeline</option>
                        <option value="Digital Fortress & AI system">Digital Fortress & AI system</option>
                        <option value="Maintenance MRR plan">Maintenance MRR plan</option>
                      </>
                    )}
                  </select>
                </div>
                {error && <p className="text-sm font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
                <button disabled={sending} className="mt-2 btn-primary hover-lift py-3.5 text-sm md:text-base shadow-[0_0_15px_rgba(14,116,144,0.15)] disabled:opacity-70 disabled:transform-none">
                  {sending ? "Processing request..." : "Submit Booking"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* Mobile Sticky CTA */}
      <div className="mobile-cta-bar">
        <a href="/book" className="btn-primary flex-1 py-3 text-center text-sm font-semibold shadow-lg shadow-cyan-900/10">
          Get Free Automation Audit
        </a>
      </div>
    </main>
  );
}











