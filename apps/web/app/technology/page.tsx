import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

const items = ["Agentic Automation Layer","Predictive Analytics Signals","Role-Aware Security Guardrails","Composable Service Modules","Real-time Event Notification Bus","Edge-ready API strategy"];

export default function TechnologyPage() {
  return (
    <main className="min-h-screen relative overflow-hidden px-6 md:px-10 py-8">
      <div className="orb orb-a" /><div className="orb orb-b" />
      <SiteHeader />
      <section className="relative z-10 max-w-6xl mx-auto mt-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Technology</p>
        <h1 className="text-5xl md:text-6xl font-display text-[var(--ink)] mt-3">Engineered like a product company.</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">{items.map((item) => <article key={item} className="soft-card p-5"><h2 className="text-xl font-display text-[var(--ink)]">{item}</h2></article>)}</div>
      </section>
      <div className="mt-10"><SiteFooter /></div>
    </main>
  );
}
