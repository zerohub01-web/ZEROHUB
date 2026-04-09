import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../../../components/SiteHeader";
import { SiteFooter } from "../../../components/SiteFooter";
import { SnakeGame } from "../../../components/snake/SnakeGame";

export const metadata: Metadata = {
  title: "Classic Snake | ZERO",
  description: "Play a minimal classic Snake game built into ZERO."
};

export default function SnakePage() {
  return (
    <main className="min-h-screen relative overflow-hidden px-6 md:px-10 py-8">
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <SiteHeader />

      <section className="relative z-10 max-w-5xl mx-auto mt-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Features / Snake</p>
        <h1 className="text-4xl md:text-5xl font-display text-[var(--ink)] mt-3">Classic Snake</h1>
        <p className="mt-3 text-sm md:text-base text-[var(--muted)] max-w-2xl">
          Grid movement, score, food growth, collision-based game over, and quick restart.
        </p>
        <div className="mt-4">
          <Link href="/features" className="btn-secondary rounded-full px-4 py-2 text-sm inline-flex">
            Back to Features
          </Link>
        </div>

        <div className="mt-6">
          <SnakeGame />
        </div>
      </section>

      <div className="mt-10">
        <SiteFooter />
      </div>
    </main>
  );
}
