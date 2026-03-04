"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ZeroLogo } from "./brand/ZeroLogo";

type NavItem = {
  href: Route;
  label: string;
};

interface SiteHeaderProps {
  portalMode?: boolean;
  onLogout?: () => void;
}

const baseNavItems: NavItem[] = [
  { href: "/pricing", label: "Pricing" },
  { href: "/services", label: "Services" },
  { href: "/features", label: "Features" },
  { href: "/technology", label: "Technology" },
  { href: "/maintenance", label: "Maintenance" },
  { href: "/works", label: "Works" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/process", label: "Process" },
  { href: "/book", label: "Book" }
];

export function SiteHeader({ portalMode = false, onLogout }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = useMemo(
    () => (portalMode ? [...baseNavItems, { href: "/portal" as Route, label: "Portal" }] : baseNavItems),
    [portalMode]
  );

  const isActive = (href: Route) => pathname === href;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10 lg:px-12 pt-3 md:pt-4">
          <div className="glass-header px-4 md:px-5 py-3 flex items-center justify-between gap-3">
            <div className="logo-glass">
              <Link href="/" aria-label="ZERO Home">
                <ZeroLogo variant="inverted" />
              </Link>
            </div>

            <nav className="hidden xl:flex items-center gap-2 text-sm" aria-label="Primary">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`header-link ${isActive(item.href) ? "header-link-active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden xl:flex items-center gap-3">
              {!portalMode ? (
                <Link href="/portal" className="btn-secondary rounded-full px-4 py-1.5 text-sm">
                  Client Login
                </Link>
              ) : onLogout ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="btn-secondary rounded-full px-4 py-1.5 text-sm inline-flex items-center gap-1.5"
                >
                  <LogOut size={14} /> Logout
                </button>
              ) : null}
            </div>

            <div className="flex xl:hidden items-center gap-2">
              {!portalMode ? (
                <Link href="/book" className="btn-secondary rounded-full px-4 py-1.5 text-sm">
                  Book
                </Link>
              ) : onLogout ? (
                <button
                  type="button"
                  onClick={onLogout}
                  className="btn-secondary rounded-full px-4 py-1.5 text-sm inline-flex items-center gap-1.5"
                >
                  <LogOut size={14} /> Logout
                </button>
              ) : null}

              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((prev) => !prev)}
                className="header-menu-btn"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {open ? (
            <nav className="glass-header mt-2 p-3 xl:hidden" aria-label="Mobile Primary">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`header-link ${isActive(item.href) ? "header-link-active" : ""}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {!portalMode ? (
                <Link href="/portal" onClick={() => setOpen(false)} className="btn-secondary rounded-full px-4 py-2 text-sm mt-3 inline-flex">
                  Client Login
                </Link>
              ) : onLogout ? (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onLogout();
                  }}
                  className="btn-secondary rounded-full px-4 py-2 text-sm mt-3 inline-flex items-center gap-1.5"
                >
                  <LogOut size={14} /> Logout
                </button>
              ) : null}
            </nav>
          ) : null}
        </div>
      </header>

      <div
        aria-hidden
        className={open ? "h-[16.25rem] sm:h-[16.75rem] xl:h-[6.5rem]" : "h-[6.15rem] sm:h-[6.5rem]"}
      />
    </>
  );
}
