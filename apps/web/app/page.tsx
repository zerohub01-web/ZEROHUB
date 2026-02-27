"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import { ZeroLogo } from "../components/brand/ZeroLogo";

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
  "Company automation workflows",
  "Custom logo and brand design",
  "Production hosting and deployment",
  "Annual maintenance and support"
];

const workHighlights = [
  { title: "Finance Ops Revamp", result: "42% faster conversion-to-call", type: "SaaS / Fintech" },
  { title: "Healthcare Intake Flow", result: "3.1x qualified lead growth", type: "Healthcare" },
  { title: "Retail Expansion Engine", result: "27% repeat customer lift", type: "Commerce" }
];

const pricing = [
  { name: "Launch", price: "₹2,10,000", summary: "Website + booking pipeline" },
  { name: "Scale", price: "₹4,10,000", summary: "Admin analytics + automations" },
  { name: "Enterprise", price: "Custom", summary: "Advanced workflows + support (INR)" }
];

const maintenancePlans = [
  {
    name: "Basic Care",
    period: "Annual",
    items: ["Security updates", "Monthly backups", "Uptime monitoring"]
  },
  {
    name: "Growth Care",
    period: "Annual",
    items: ["Everything in Basic", "Content + service updates", "Quarterly optimization review"]
  },
  {
    name: "Priority Care",
    period: "Annual",
    items: ["Everything in Growth", "Priority support SLA", "Conversion improvement iterations"]
  }
];

export default function HomePage() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<{ _id: string; title: string }[]>([]);
  const [activeTrack, setActiveTrack] = useState<"acquire" | "operate" | "expand">("acquire");
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  useEffect(() => {
    api
      .get("/api/services")
      .then((res) => setServices(res.data))
      .catch(() => setServices([]));
  }, []);

  async function handleBooking(formData: FormData) {
    setSending(true);
    setError(null);

    const payload = {
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      phone: String(formData.get("phone")),
      businessType: String(formData.get("businessType")),
      teamSize: String(formData.get("teamSize") ?? ""),
      monthlyLeads: String(formData.get("monthlyLeads") ?? ""),
      budgetRange: String(formData.get("budgetRange") ?? ""),
      service: String(formData.get("service")),
      date: new Date(String(formData.get("date"))).toISOString()
    };

    try {
      await api.post("/api/bookings", payload);
      setDone(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Network error. Verify API is running on localhost:4000.");
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
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <header className="relative z-20 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 pt-5 md:pt-6">
        <div className="glass-header px-4 md:px-5 py-3 flex items-center justify-between gap-4">
        <div className="logo-glass">
          <ZeroLogo variant="inverted" />
        </div>
        <nav className="hidden md:flex items-center gap-7 text-sm text-[var(--muted)]">
          <a href="#pricing" className="hover:text-[var(--ink)] transition">Pricing</a>
          <a href="#services" className="hover:text-[var(--ink)] transition">Services</a>
          <a href="#technology" className="hover:text-[var(--ink)] transition">Technology</a>
          <a href="#features" className="hover:text-[var(--ink)] transition">Features</a>
          <a href="#maintenance" className="hover:text-[var(--ink)] transition">Maintenance</a>
          <a href="#works" className="hover:text-[var(--ink)] transition">Works</a>
          <a href="#process" className="hover:text-[var(--ink)] transition">Process</a>
          <a href="#book" className="hover:text-[var(--ink)] transition">Book</a>
          <a href="/portal" className="hover:text-[var(--ink)] transition">Client Login</a>
        </nav>
        </div>
      </header>

      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 pt-4 md:pt-6 pb-10 md:pb-14 lg:pb-16 grid lg:grid-cols-[1.15fr_0.85fr] gap-6 md:gap-8 items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            Operating System for Growth Teams
          </p>
          <h1 className="mt-5 text-5xl md:text-7xl leading-[0.96] font-display tracking-tight text-[var(--ink)]">
            A website that runs
            <span className="block text-[var(--accent)]">your business.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--muted)]">
            ZERO combines cinematic brand presence with booking automation, secure admin controls, and decision-grade analytics.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#book" className="btn-primary rounded-full px-6 py-2.5 text-sm">Start Project</a>
            <a href="#services" className="btn-secondary rounded-full px-6 py-2.5 text-sm">View Offerings</a>
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

      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 py-12">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-4">
          <div className="dark-card p-6 md:p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-white/70">Pricing</p>
            <h2 className="text-4xl font-display mt-3">Straight plans for real delivery.</h2>
            <p className="text-sm text-white mt-3 font-medium">Pick a tier, then move into implementation fast.</p>
            <a href="/pricing" className="inline-block mt-5 btn-secondary rounded-full px-5 py-2 text-sm bg-white text-[var(--ink)] border-white">Full Pricing</a>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {pricing.map((plan) => (
              <article key={plan.name} className="soft-card p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{plan.name}</p>
                <p className="text-3xl font-display text-[var(--ink)] mt-2">{plan.price}</p>
                <p className="text-sm text-[var(--muted)] mt-2">{plan.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 py-12 md:py-14 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Core Services</p>
            <h2 className="text-4xl md:text-5xl font-display text-[var(--ink)] mt-2">What we deliver for companies</h2>
          </div>
          <p className="max-w-md text-sm text-[var(--muted)]">
            We automate your operations and keep your digital foundation strong: brand, hosting, and long-term maintenance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {services.length > 0 ? (
            services.map((service, i) => (
              <motion.article
                key={service._id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="soft-card p-5"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Company Service</p>
                <h3 className="text-2xl font-display text-[var(--ink)] mt-3">{service.title}</h3>
                <p className="text-sm text-[var(--muted)] mt-3">Modular delivery with analytics-backed iteration and operational hardening.</p>
              </motion.article>
            ))
          ) : (
            <article className="soft-card p-5 md:col-span-3">
              <h3 className="text-2xl font-display text-[var(--ink)]">Primary services</h3>
              <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-[var(--muted)]">
                <p>• Company process automation</p>
                <p>• Logo and brand identity design</p>
                <p>• Managed hosting and deployment</p>
                <p>• Annual maintenance and support</p>
              </div>
            </article>
          )}
        </div>
      </section>

      <section id="features" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 pb-12">
        <div className="soft-card p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Features</p>
          <h2 className="text-4xl md:text-5xl font-display text-[var(--ink)] mt-2">Built-in operating capabilities.</h2>
          <div className="grid md:grid-cols-2 gap-3 mt-6">
            {features.map((item) => (
              <div key={item} className="rounded-xl border border-black/10 bg-white/60 p-4 text-[var(--ink)]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="maintenance" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 pb-12">
        <div className="soft-card p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Annual Maintenance</p>
          <h2 className="text-4xl md:text-5xl font-display text-[var(--ink)] mt-2">Keep your company systems healthy all year.</h2>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {maintenancePlans.map((plan) => (
              <article key={plan.name} className="rounded-xl border border-black/10 bg-white/60 p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{plan.period}</p>
                <h3 className="text-2xl font-display text-[var(--ink)] mt-2">{plan.name}</h3>
                <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
                  {plan.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="technology"
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 pb-12"
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setSpotlight({ x, y });
        }}
      >
        <div className="tech-shell p-6 md:p-8" style={{ ["--spot-x" as string]: `${spotlight.x}%`, ["--spot-y" as string]: `${spotlight.y}%` }}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/70">Technology 2026</p>
              <h2 className="text-4xl md:text-5xl font-display text-white mt-2">Engineered like a product company.</h2>
            </div>
            <p className="max-w-lg text-sm text-white/75">
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
      </section>

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

      <section id="book" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 pb-14 md:pb-16 lg:pb-20">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-4 md:gap-5 items-start">
          <div className="dark-card p-7 md:p-9">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Consultation</p>
            <h2 className="text-4xl md:text-5xl font-display mt-3">Plan your next build sprint.</h2>
            <p className="text-white mt-4 font-medium">Share your business context, desired outcomes, and delivery timeline.</p>
          </div>

          <div className="soft-card p-6">
            {done ? (
              <p className="text-[var(--accent)] font-semibold">Booking created. Confirmation and admin notification were triggered.</p>
            ) : (
              <form action={handleBooking} className="grid gap-3">
                <input name="name" required placeholder="Full name" className="field" />
                <input name="email" type="email" required placeholder="Work email" className="field" />
                <input name="phone" required placeholder="Phone" className="field" />
                <input name="businessType" required placeholder="Business type" className="field" />
                <select name="teamSize" className="field" defaultValue="">
                  <option value="" disabled>Team size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="200+">200+</option>
                </select>
                <select name="monthlyLeads" className="field" defaultValue="">
                  <option value="" disabled>Monthly leads</option>
                  <option value="0-100">0-100</option>
                  <option value="101-500">101-500</option>
                  <option value="501-2000">501-2000</option>
                  <option value="2000+">2000+</option>
                </select>
                <select name="budgetRange" className="field" defaultValue="">
                  <option value="" disabled>Budget range</option>
                  <option value="₹1L-₹3L">₹1L-₹3L</option>
                  <option value="₹3L-₹8L">₹3L-₹8L</option>
                  <option value="₹8L-₹20L">₹8L-₹20L</option>
                  <option value="₹20L+">₹20L+</option>
                </select>
                <select name="service" required className="field">
                  <option value="">Select service</option>
                  {services.map((service) => (
                    <option key={service._id} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>
                <input name="date" type="date" required className="field" />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button disabled={sending} className="btn-primary py-2.5 text-sm disabled:opacity-70">
                  {sending ? "Processing..." : "Submit Booking"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 pb-10 text-sm text-[var(--muted)]">
        <div className="flex items-center gap-3">
          <ZeroLogo variant="inverted" compact />
          <p>(c) {new Date().getFullYear()} - Product websites engineered for scale.</p>
        </div>
      </footer>
    </main>
  );
}
