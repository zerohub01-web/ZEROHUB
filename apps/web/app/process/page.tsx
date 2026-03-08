import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

const steps = [
  { step: "01", title: "Discovery", copy: "We map your current workflow and bottlenecks." },
  { step: "02", title: "System Design", copy: "We design automation and analytics architecture." },
  { step: "03", title: "Build", copy: "We implement and connect the full system." },
  { step: "04", title: "Scale", copy: "We optimize performance and maintain growth." }
];

export default function ProcessPage() {
  return (
    <main className="min-h-screen relative overflow-hidden px-6 md:px-10 py-8">
      <div className="orb orb-a" /><div className="orb orb-b" />
      <SiteHeader />
      <section className="relative z-10 max-w-6xl mx-auto mt-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Process</p>
        <h1 className="text-5xl md:text-6xl font-display text-[var(--ink)] mt-3">How we execute.</h1>
        <div className="grid md:grid-cols-2 gap-4 mt-8">{steps.map((item) => <article key={item.step} className="soft-card p-6"><p className="font-mono text-sm text-[var(--accent)]">{item.step}</p><h2 className="text-2xl font-display text-[var(--ink)] mt-2">{item.title}</h2><p className="text-sm text-[var(--muted)] mt-2">{item.copy}</p></article>)}</div>
      </section>
      <div className="mt-10"><SiteFooter /></div>
    </main>
  );
}
