import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

const coreServices = [
  {
    title: "Website + Brand Foundation",
    summary: "High-performance websites with business positioning, conversion structure, and logo/brand system delivery."
  },
  {
    title: "Automation Pipelines",
    summary: "Lead intake workflows that route data to Sheets/CRM and trigger instant responses without manual follow-up."
  },
  {
    title: "Workflow Portals",
    summary: "Custom process systems for admissions, onboarding, approvals, and status tracking tailored to each business flow."
  },
  {
    title: "Hosting + Infrastructure",
    summary: "Managed deployment, uptime monitoring, secure release flow, SSL, and backup architecture for operational reliability."
  },
  {
    title: "AI Assistants + Data Intelligence",
    summary: "Business-trained AI assistant integration with dashboard visibility for customer queries and internal decision support."
  },
  {
    title: "Security Hardening",
    summary: "WAF, rate limiting, vulnerability patching strategy, and secure data handling standards for production environments."
  }
];

const addOns = [
  "Automation audit + process map",
  "Competitor intelligence weekly report bot",
  "Custom chatbot deployment and tuning",
  "Conversion optimization sprint",
  "Database cleanup and performance boost",
  "Legacy website migration"
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen relative overflow-hidden px-6 md:px-10 py-8">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <SiteHeader />

      <section className="relative z-10 max-w-6xl mx-auto mt-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Services</p>
        <h1 className="text-5xl md:text-6xl font-display text-[var(--ink)] mt-3">Automation-first services for real business operations.</h1>
        <p className="text-[var(--muted)] mt-4 max-w-3xl">
          ZERO is not a brochure-site vendor. We build systems that remove manual workload, improve conversion velocity, and create repeatable growth infrastructure.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {coreServices.map((item) => (
            <article key={item.title} className="soft-card p-6">
              <h2 className="text-2xl font-display text-[var(--ink)]">{item.title}</h2>
              <p className="text-sm text-[var(--muted)] mt-3 leading-relaxed">{item.summary}</p>
            </article>
          ))}
        </div>

        <article className="soft-card p-6 mt-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">High-Ticket Add-Ons</p>
          <h2 className="text-3xl font-display text-[var(--ink)] mt-2">Standalone leverage services</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-[var(--muted)]">
            {addOns.map((item) => (
              <p key={item}>• {item}</p>
            ))}
          </div>
        </article>
      </section>

      <div className="mt-10"><SiteFooter /></div>
    </main>
  );
}

