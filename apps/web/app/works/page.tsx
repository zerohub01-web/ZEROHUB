import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

const items = [
  { title: "Finance Ops Revamp", result: "42% faster conversion-to-call", type: "SaaS / Fintech" },
  { title: "Healthcare Intake Flow", result: "3.1x qualified lead growth", type: "Healthcare" },
  { title: "Retail Expansion Engine", result: "27% repeat customer lift", type: "Commerce" }
];

export default function WorksPage() {
  return (
    <main className="min-h-screen relative overflow-hidden px-6 md:px-10 py-8">
      <div className="orb orb-a" /><div className="orb orb-b" />
      <SiteHeader />
      <section className="relative z-10 max-w-6xl mx-auto mt-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Works</p>
        <h1 className="text-5xl md:text-6xl font-display text-[var(--ink)] mt-3">Case results from real delivery.</h1>
        <div className="grid md:grid-cols-3 gap-4 mt-8">{items.map((w)=><article key={w.title} className="soft-card p-6"><p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">{w.type}</p><h2 className="text-2xl font-display text-[var(--ink)] mt-2">{w.title}</h2><p className="text-sm text-[var(--accent)] mt-3">{w.result}</p></article>)}</div>
      </section>
      <div className="mt-10"><SiteFooter /></div>
    </main>
  );
}
