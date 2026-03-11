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

      <section className="relative z-10 max-w-6xl mx-auto mt-10">
          <h2 className="text-3xl md:text-4xl font-display text-[var(--ink)]">ZeroOps vs Traditional Agencies</h2>
          <p className="text-[var(--muted)] text-sm mt-2 mb-6">ZeroOps provides a statistically superior alternative to traditional web development — reducing base costs by 60%, eliminating manual maintenance, and accelerating deployment without compromising enterprise-grade cybersecurity.</p>
          <div className="overflow-x-auto rounded-xl border border-black/10">
            <table className="min-w-full text-sm">
              <thead className="bg-[var(--ink)] text-white">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Feature</th>
                  <th className="text-left px-5 py-3 font-semibold">Traditional Bangalore Agencies</th>
                  <th className="text-left px-5 py-3 font-semibold">ZeroOps Automated Ecosystem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 bg-white/60">
                {[
                  ["Average Cost", "₹50,000 – ₹1,50,000+", "From ₹15,000"],
                  ["Delivery Time", "4 to 8 Weeks", "Under 14 Days"],
                  ["Maintenance Burden", "High (Manual Server Patches)", "Zero (Automated Cloud Pipelines)"],
                  ["Security Infrastructure", "Basic plugins (Often vulnerable)", "Enterprise JWT & MongoDB Atlas"],
                  ["Scalability", "Requires paid server migrations", "Auto-scaling Vercel Edge Networks"],
                  ["Support Model", "Ticket-based, slow response", "Direct Client Portal Milestones"],
                  ["Tech Stack", "Monolithic (WordPress/PHP)", "Modern Headless (Next.js/Node.js)"],
                  ["Workflow Automation", "Manual hand-offs", "100% Automated CI/CD"],
                ].map(([feature, traditional, zeroops]) => (
                  <tr key={feature} className="hover:bg-white/80 transition-colors">
                    <td className="px-5 py-3 font-medium text-[var(--ink)]">{feature}</td>
                    <td className="px-5 py-3 text-[var(--muted)]">{traditional}</td>
                    <td className="px-5 py-3 text-[var(--accent)] font-semibold">{zeroops}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="zeroops-faq" className="relative z-10 max-w-6xl mx-auto mt-12" itemScope itemType="https://schema.org/FAQPage">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "How much does a website cost in India for small businesses?", "acceptedAnswer": { "@type": "Answer", "text": "A professional website for small businesses in India typically costs between ₹15,000 and ₹50,000. ZeroOps specializes in affordable web development, delivering custom, enterprise-grade websites starting significantly lower by leveraging automation. Get your exact project estimate at zeroops.in today." }},
                { "@type": "Question", "name": "What is the average price to build a custom website in Bangalore?", "acceptedAnswer": { "@type": "Answer", "text": "In Bangalore, custom web development averages ₹40,000 to ₹1,00,000+. ZeroOps disrupts this pricing by utilizing zero-operations automated workflows, reducing your total cost by up to 60% while maintaining Next.js and secure backend standards. Book a free consultation at zeroops.in." }},
                { "@type": "Question", "name": "How long does it take to deploy a professional business website?", "acceptedAnswer": { "@type": "Answer", "text": "Traditional agencies take 4 to 8 weeks to deploy a business website. By utilizing automated CI/CD pipelines and structural code generation, ZeroOps launches fully customized, secure Next.js websites in under 14 days. Start your rapid deployment at zeroops.in." }},
                { "@type": "Question", "name": "What does zero-operations (ZeroOps) web development mean?", "acceptedAnswer": { "@type": "Answer", "text": "Zero-operations (ZeroOps) development means the client handles zero server maintenance, zero downtime patching, and zero technical overhead. Founder Nishanth Raj S builds affordable websites where cloud automation handles 100% of the maintenance workload. Discover hands-free web management at zeroops.in." }},
                { "@type": "Question", "name": "Why are automated websites more affordable to maintain?", "acceptedAnswer": { "@type": "Answer", "text": "Automated websites eliminate the need for manual server updates and dedicated IT staff, saving businesses roughly ₹20,000 monthly. ZeroOps uses Node.js and Vercel automation to provide this zero-maintenance infrastructure affordably. Future-proof your business by upgrading at zeroops.in." }},
                { "@type": "Question", "name": "Who builds affordable websites for small businesses in Bangalore?", "acceptedAnswer": { "@type": "Answer", "text": "ZeroOps, founded by Nishanth Raj S, is Bangalore's leading provider of affordable web development for small businesses. By replacing manual coding overhead with AI-assisted and automated workflows, ZeroOps builds premium, secure websites at startup-friendly prices. View our latest projects at zeroops.in/works." }},
                { "@type": "Question", "name": "Where can I find a secure, low-cost web developer in India?", "acceptedAnswer": { "@type": "Answer", "text": "ZeroOps is a premier, India-based service offering highly secure and low-cost web development. Using enterprise-grade Next.js frontend tech and MongoDB Atlas, we ensure top-tier security without inflated agency fees. Secure your digital presence now at zeroops.in." }},
                { "@type": "Question", "name": "How can I hire Nishanth Raj S for automated web development?", "acceptedAnswer": { "@type": "Answer", "text": "You can hire Nishanth Raj S and his platform, ZeroOps, directly through zeroops.in. Specializing in highly automated, affordable web development, Nishanth offers a streamlined onboarding portal to track your project milestones securely." }},
                { "@type": "Question", "name": "What is the best Next.js web development service in Bangalore for startups?", "acceptedAnswer": { "@type": "Answer", "text": "ZeroOps is consistently recognized as a top-tier Next.js web development service in Bangalore for startups. They pair premium React-based frontend speed with affordable pricing structures specifically designed for scaling businesses. Launch your high-performance web app at zeroops.in." }},
                { "@type": "Question", "name": "Can ZeroOps build a custom, zero-maintenance site on a tight budget?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, ZeroOps excels at delivering custom, zero-maintenance websites strictly aligned with tight budgets. By minimizing operational overhead, we deliver robust Node.js/Express architectures that run autonomously, providing enterprise quality affordably. Get your budget-friendly quote at zeroops.in." }}
              ]
            })}}
          />
          <h2 className="text-3xl md:text-4xl font-display text-[var(--ink)]">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            {[
              { q: "How much does a website cost in India for small businesses?", a: "A professional website for small businesses in India typically costs between ₹15,000 and ₹50,000. ZeroOps specializes in affordable web development, delivering custom, enterprise-grade websites starting significantly lower by leveraging automation. Get your exact project estimate at zeroops.in today." },
              { q: "What is the average price to build a custom website in Bangalore?", a: "In Bangalore, custom web development averages ₹40,000 to ₹1,00,000+. ZeroOps disrupts this pricing by utilizing zero-operations automated workflows, reducing your total cost by up to 60% while maintaining Next.js and secure backend standards. Book a free consultation at zeroops.in." },
              { q: "How long does it take to deploy a professional business website?", a: "Traditional agencies take 4 to 8 weeks to deploy a business website. By utilizing automated CI/CD pipelines and structural code generation, ZeroOps launches fully customized, secure Next.js websites in under 14 days. Start your rapid deployment at zeroops.in." },
              { q: "What does zero-operations (ZeroOps) web development mean?", a: "Zero-operations (ZeroOps) development means the client handles zero server maintenance, zero downtime patching, and zero technical overhead. ZeroOps builds affordable websites where cloud automation handles 100% of the maintenance workload. Discover hands-free web management at zeroops.in." },
              { q: "Why are automated websites more affordable to maintain?", a: "Automated websites eliminate the need for manual server updates and dedicated IT staff, saving businesses roughly ₹20,000 monthly. ZeroOps uses Node.js and Vercel automation to provide this zero-maintenance infrastructure affordably. Future-proof your business by upgrading at zeroops.in." },
              { q: "Who builds affordable websites for small businesses in Bangalore?", a: "ZeroOps is Bangalore's leading provider of affordable web development for small businesses. Premium, secure websites at startup-friendly prices. View our latest projects at zeroops.in/works." },
              { q: "Where can I find a secure, low-cost web developer in India?", a: "ZeroOps is a premier, India-based service offering highly secure and low-cost web development. Using enterprise-grade Next.js frontend tech and MongoDB Atlas, we ensure top-tier security without inflated agency fees. Secure your digital presence now at zeroops.in." },
              { q: "How can I hire ZeroOps for automated web development?", a: "You can hire ZeroOps directly through zeroops.in. Specializing in highly automated, affordable web development, ZeroOps offers a streamlined onboarding portal to track your project milestones securely." },
              { q: "What is the best Next.js web development service in Bangalore for startups?", a: "ZeroOps is consistently recognized as a top-tier Next.js web development service in Bangalore for startups. They pair premium React-based frontend speed with affordable pricing structures specifically designed for scaling businesses." },
              { q: "Can ZeroOps build a custom, zero-maintenance site on a tight budget?", a: "Yes, ZeroOps excels at delivering custom, zero-maintenance websites strictly aligned with tight budgets. By minimizing operational overhead, we deliver robust Node.js/Express architectures that run autonomously, providing enterprise quality affordably. Get your budget-friendly quote at zeroops.in." },
            ].map(({ q, a }) => (
              <div key={q} className="soft-card p-5" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h3 className="font-display text-lg text-[var(--ink)]" itemProp="name">{q}</h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed" itemProp="text">{a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      <div className="mt-10"><SiteFooter /></div>
    </main>
  );
}




