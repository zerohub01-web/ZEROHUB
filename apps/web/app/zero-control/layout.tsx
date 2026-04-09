"use client";

import type { Route } from "next";
import { ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  BarChart3,
  FileSignature,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquareMore,
  PhoneCall,
  ReceiptText,
  Settings,
  Star,
  Users,
  X
} from "lucide-react";
import { ZeroLogo } from "../../components/brand/ZeroLogo";
import { api } from "../../lib/api";
import { useAuthStore } from "../../store/auth";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
};

type NavSection = {
  heading: string;
  items: NavItem[];
};

function isPathActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function badgeFor(item: NavItem, pendingContracts: number, pendingInvoices: number): number | undefined {
  if (item.href === "/zero-control/contracts") {
    return pendingContracts > 0 ? pendingContracts : undefined;
  }
  if (item.href === "/zero-control/invoices") {
    return pendingInvoices > 0 ? pendingInvoices : undefined;
  }
  return item.badge;
}

export default function ZeroControlAdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [pendingContracts, setPendingContracts] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const callLogoutEndpoint = async (url: string) => {
    try {
      const response = await api.post(url, undefined, {
        validateStatus: () => true
      });
      return response.status;
    } catch {
      return 0;
    }
  };

  const isAcceptableStatus = (status: number) =>
    status === 0 || status === 200 || status === 204 || status === 401 || status === 403 || status === 404 || status === 500;

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    const loadingId = toast.loading("Signing out...");

    try {
      const [adminStatus, customerStatus] = await Promise.all([
        callLogoutEndpoint("/api/admin/logout"),
        callLogoutEndpoint("/api/auth/logout")
      ]);

      useAuthStore.getState().setAdmin(undefined);

      if (!isAcceptableStatus(adminStatus) || !isAcceptableStatus(customerStatus)) {
        toast.error("Logout partially failed. Redirecting to login...", { id: loadingId });
      } else {
        toast.success("Logged out successfully.", { id: loadingId });
      }

      window.location.assign("/login");
    } catch {
      useAuthStore.getState().setAdmin(undefined);
      toast.error("Could not verify logout. Redirecting to login...", { id: loadingId });
      window.location.assign("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;

    const fetchBadges = async () => {
      try {
        const [invoiceStats, contractStats] = await Promise.all([
          api.get<{ pendingCount?: number; awaitingSignature?: number }>("/api/invoices/stats/overview"),
          api.get<{ pendingSignatureCount?: number }>("/api/contracts/stats/overview")
        ]);

        if (cancelled) return;

        const pendingInvoice = Number(invoiceStats.data?.pendingCount ?? 0);
        const awaitingInvoiceSignature = Number(invoiceStats.data?.awaitingSignature ?? 0);
        const pendingContractSignature = Number(contractStats.data?.pendingSignatureCount ?? 0);

        setPendingInvoices(Math.max(0, pendingInvoice + awaitingInvoiceSignature));
        setPendingContracts(Math.max(0, pendingContractSignature));
      } catch {
        if (!cancelled) {
          setPendingInvoices(0);
          setPendingContracts(0);
        }
      }
    };

    void fetchBadges();
    const timer = window.setInterval(fetchBadges, 45_000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const sections: NavSection[] = useMemo(
    () => [
      {
        heading: "MAIN",
        items: [
          { label: "Dashboard", href: "/zero-control", icon: <Home size={18} /> },
          { label: "Lead Inbox", href: "/zero-control/clients", icon: <Users size={18} /> },
          { label: "Bookings", href: "/zero-control/clients", icon: <Users size={18} /> }
        ]
      },
      {
        heading: "COMMUNICATION",
        items: [
          { label: "WhatsApp", href: "/zero-control/whatsapp", icon: <MessageCircle size={18} /> },
          { label: "Follow-ups", href: "/zero-control/followups", icon: <MessageSquareMore size={18} /> },
          { label: "Calls", href: "/zero-control/calls", icon: <PhoneCall size={18} /> }
        ]
      },
      {
        heading: "DOCUMENTS",
        items: [
          { label: "Contracts", href: "/zero-control/contracts", icon: <FileSignature size={18} /> },
          { label: "Invoices", href: "/zero-control/invoices", icon: <ReceiptText size={18} /> },
          { label: "Proposals", href: "/zero-control/proposals", icon: <FileText size={18} /> }
        ]
      },
      {
        heading: "SETTINGS",
        items: [
          { label: "Analytics", href: "/zero-control/analytics", icon: <BarChart3 size={18} /> },
          { label: "Reviews", href: "/zero-control/reviews", icon: <Star size={18} /> },
          { label: "Settings", href: "/zero-control/settings", icon: <Settings size={18} /> }
        ]
      }
    ],
    []
  );

  const allNavItems = useMemo(() => sections.flatMap((section) => section.items), [sections]);

  const mobileBottomNav = useMemo(
    () => [
      { label: "Home", href: "/zero-control", icon: <Home size={18} /> },
      { label: "Clients", href: "/zero-control/clients", icon: <Users size={18} /> },
      { label: "Contracts", href: "/zero-control/contracts", icon: <FileSignature size={18} /> },
      { label: "Invoices", href: "/zero-control/invoices", icon: <ReceiptText size={18} /> },
      { label: "Settings", href: "/zero-control/settings", icon: <Settings size={18} /> }
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[var(--bg-a)] md:flex">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/85 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between gap-3">
          <ZeroLogo variant="inverted" compact />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-white/90 text-[var(--ink)]"
            aria-label={mobileMenuOpen ? "Close admin menu" : "Open admin menu"}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 bg-[rgba(6,15,26,0.62)] backdrop-blur-sm md:hidden">
          <div className="h-full w-full overflow-y-auto bg-[var(--bg-a)] px-4 pb-28 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <ZeroLogo variant="inverted" compact />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-white/90 text-[var(--ink)]"
                aria-label="Close admin menu"
              >
                <X size={18} />
              </button>
            </div>

            {sections.map((section) => (
              <div key={section.heading} className="mb-5">
                <p className="px-1 pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">{section.heading}</p>
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const badge = badgeFor(item, pendingContracts, pendingInvoices);
                    const active = isPathActive(pathname, item.href);
                    return (
                      <Link
                        key={`${section.heading}-${item.label}-${item.href}`}
                        href={item.href as Route}
                        className={`flex min-h-[44px] items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                          active
                            ? "border border-black/15 bg-[var(--ink)] text-white"
                            : "border border-black/10 bg-white/80 text-[var(--ink)]"
                        }`}
                      >
                        <span className="inline-flex items-center gap-3">
                          {item.icon}
                          {item.label}
                        </span>
                        {typeof badge === "number" && badge > 0 ? (
                          <span
                            className={`inline-flex min-w-7 items-center justify-center rounded-full px-2 py-1 text-[11px] font-semibold ${
                              active ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {badge}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
              className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogOut size={18} /> {isLoggingOut ? "Exiting..." : "Exit Admin"}
            </button>
          </div>
        </div>
      ) : null}

      <aside className="hidden w-72 border-r border-black/10 bg-white/50 backdrop-blur-md md:flex md:flex-col">
        <div className="border-b border-black/10 p-6">
          <ZeroLogo variant="inverted" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">Admin Control</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {sections.map((section) => (
            <div key={section.heading} className="mb-6 last:mb-0">
              <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">{section.heading}</p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const badge = badgeFor(item, pendingContracts, pendingInvoices);
                  const active = isPathActive(pathname, item.href);
                  return (
                    <Link
                      key={`${section.heading}-${item.label}-${item.href}`}
                      href={item.href as Route}
                      className={`flex min-h-[44px] items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                        active
                          ? "border border-black/15 bg-[var(--ink)] text-white"
                          : "text-[var(--ink)] hover:bg-black/5"
                      }`}
                    >
                      <span className="inline-flex items-center gap-3">
                        {item.icon}
                        {item.label}
                      </span>
                      {typeof badge === "number" && badge > 0 ? (
                        <span
                          className={`inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            active ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-black/10 p-4">
          <button
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
            className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LogOut size={18} /> {isLoggingOut ? "Exiting..." : "Exit Admin"}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 pb-24 pt-4 sm:px-5 md:p-8 md:pb-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-2 py-2 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {mobileBottomNav.map((item) => {
            const active = isPathActive(pathname, item.href);
            const sourceItem = allNavItems.find((candidate) => candidate.href === item.href);
            const badge = sourceItem ? badgeFor(sourceItem, pendingContracts, pendingInvoices) : undefined;
            return (
              <Link
                key={item.href}
                href={item.href as Route}
                className={`relative inline-flex min-h-[44px] flex-col items-center justify-center rounded-xl px-1 py-1.5 text-[10px] font-semibold ${
                  active ? "bg-[var(--ink)] text-white" : "text-[var(--muted)]"
                }`}
              >
                {item.icon}
                <span className="mt-0.5 truncate">{item.label}</span>
                {typeof badge === "number" && badge > 0 ? (
                  <span
                    className={`absolute right-1 top-0 inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                      active ? "bg-white text-[var(--ink)]" : "bg-amber-200 text-amber-900"
                    }`}
                  >
                    {badge > 9 ? "9+" : badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
