import { ZeroLogo } from "../../components/brand/ZeroLogo";

const tiers = [
  {
    name: "Launch",
    price: "₹2,10,000",
    note: "For teams moving from brochure site to conversion machine.",
    features: ["Public ZERO website", "Booking pipeline", "Core analytics"],
    cta: "Start Launch"
  },
  {
    name: "Scale",
    price: "₹4,10,000",
    note: "For growing companies needing secure admin control.",
    features: ["Everything in Launch", "RBAC admin dashboard", "Service/work CMS", "Activity logging"],
    cta: "Choose Scale",
    featured: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "For multi-team operations and advanced integrations (INR pricing on consultation).",
    features: ["Custom workflows", "Dedicated architecture", "SLA + support"],
    cta: "Talk to Sales"
  }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden px-6 md:px-10 py-8">
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="pt-1 md:pt-2 mb-10">
          <div className="glass-header px-4 md:px-5 py-3 flex items-center justify-between gap-4">
            <div className="logo-glass">
              <ZeroLogo variant="inverted" />
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--muted)]">
              <a href="/" className="hover:text-[var(--ink)] transition">Home</a>
            </nav>
            <a href="/" className="btn-secondary rounded-full px-4 py-1.5 text-sm md:hidden">Home</a>
          </div>
        </header>

        <section className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Pricing</p>
          <h1 className="text-5xl md:text-6xl font-display text-[var(--ink)] mt-3">Plans built for growth velocity.</h1>
          <p className="text-[var(--muted)] mt-4 max-w-2xl">Each tier is structured around shipping outcomes, not billable noise.</p>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={`soft-card p-6 ${tier.featured ? "ring-2 ring-[var(--accent)]" : ""}`}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{tier.name}</p>
              <p className="text-4xl font-display text-[var(--ink)] mt-3">{tier.price}</p>
              <p className="text-sm text-[var(--muted)] mt-2">{tier.note}</p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--ink)]">
                {tier.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <button className="mt-6 w-full rounded-xl bg-[var(--ink)] text-white py-2.5 text-sm font-semibold">{tier.cta}</button>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
