import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

const items = [
  { name: "Arun Nair", type: "Logistics Company", quote: "ZERO automated our lead follow-up and saved our ops team hours every week." },
  { name: "Megha Patel", type: "Healthcare Clinic", quote: "We moved from manual chaos to a clear booking and analytics workflow in weeks." },
  { name: "Rohit Sharma", type: "Retail Brand", quote: "The dashboard visibility and automation stack helped us scale without adding headcount." }
];

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen relative overflow-hidden px-6 md:px-10 py-8">
      <div className="orb orb-a" /><div className="orb orb-b" />
      <SiteHeader />
      <section className="relative z-10 max-w-6xl mx-auto mt-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Testimonials</p>
        <h1 className="text-5xl md:text-6xl font-display text-[var(--ink)] mt-3">Trusted by Growing Businesses</h1>
        <div className="grid md:grid-cols-3 gap-4 mt-8">{items.map((i)=><article key={i.name} className="soft-card p-6"><p className="text-sm text-[var(--muted)]">{i.quote}</p><p className="mt-3 text-[var(--ink)] font-semibold">{i.name}</p><p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)] mt-1">{i.type}</p></article>)}</div>
      </section>
      <div className="mt-10"><SiteFooter /></div>
    </main>
  );
}
