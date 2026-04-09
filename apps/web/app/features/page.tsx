import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

const items = [
  "Company automation workflows",
  "Custom logo and brand design",
  "Production hosting and deployment",
  "Annual maintenance and support"
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen relative overflow-hidden px-6 md:px-10 py-8">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <SiteHeader />
      <section className="relative z-10 max-w-6xl mx-auto mt-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Features</p>
        <h1 className="text-5xl md:text-6xl font-display text-[var(--ink)] mt-3">
          Built-in operating capabilities.
        </h1>
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {items.map((item) => (
            <article key={item} className="soft-card p-6">
              <h2 className="text-2xl font-display text-[var(--ink)]">{item}</h2>
            </article>
          ))}
        </div>

        <article className="soft-card p-6 mt-6">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Interactive</p>
          <h2 className="text-2xl font-display text-[var(--ink)] mt-2">Play Classic Snake</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            A minimal arcade mode with keyboard and touch controls.
          </p>
          <a href="/features/snake" className="btn-secondary rounded-full px-4 py-2 text-sm inline-flex mt-4">
            Open Snake
          </a>
        </article>
      </section>
      <div className="mt-10">
        <SiteFooter />
      </div>
    </main>
  );
}
