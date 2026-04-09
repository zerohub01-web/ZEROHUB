"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircle2, Circle, Download, Loader2, Mail, MessageSquare, CheckCheck } from "lucide-react";
import { api } from "../../../../../lib/api";
import { buildWhatsAppLink } from "../../../../../utils/whatsapp";

interface ContractView {
  id: string;
  contractNumber: string;
  status: "DRAFT" | "SENT" | "VIEWED" | "SIGNED" | "COMPLETED" | "CANCELLED";
  clientName: string;
  clientEmail: string;
  serviceType: string;
  createdAt: string;
  emailSentAt?: string;
  viewedAt?: string;
  viewCount?: number;
  clientSignedAt?: string;
  effectiveDate: string;
  totalAmount?: number;
  currencySymbol?: string;
  portalLink?: string;
  portalTokens?: {
    pdf?: string;
  };
}

function isDone(current: ContractView["status"], target: ContractView["status"]): boolean {
  const order: ContractView["status"][] = ["DRAFT", "SENT", "VIEWED", "SIGNED", "COMPLETED"];
  return order.indexOf(current) >= order.indexOf(target);
}

function formatMoney(symbol: string, amount?: number): string {
  return `${symbol}${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export default function ContractDetailViewPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const [contract, setContract] = useState<ContractView | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [origin, setOrigin] = useState("");
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const fetchContract = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/api/contracts/${id}`);
      setContract(data as ContractView);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load contract details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchContract();
  }, [id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const reminderLink = useMemo(() => {
    if (!contract) return "";
    const phone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "918590464379";
    const fallbackOrigin = process.env.NEXT_PUBLIC_WEB_URL || "";
    const portalLink =
      contract.portalLink || `${(origin || fallbackOrigin).replace(/\/$/, "")}/portal/contract/${contract.id}`;
    const message = `Hi ${contract.clientName}, your service agreement (${contract.contractNumber}) from ZERO OPS is awaiting your signature. Please sign here: ${portalLink}`;
    return buildWhatsAppLink(phone, message);
  }, [contract, origin]);

  const resendContract = async () => {
    if (!contract) return;
    setBusy(true);
    try {
      const { data } = await api.post(`/api/contracts/${contract.id}/send`);
      if (data?.emailSent === false) {
        toast.error(data?.message || "Contract marked as sent, but email delivery failed.");
      } else if (Array.isArray(data?.warnings) && data.warnings.length > 0) {
        toast(data?.message || "Contract sent with warnings.");
      } else {
        toast.success(data?.message || "Contract sent again.");
      }
      await fetchContract();
    } catch (error) {
      console.error(error);
      toast.error("Failed to resend contract.");
    } finally {
      setBusy(false);
    }
  };

  const markComplete = async () => {
    if (!contract) return;
    setBusy(true);
    try {
      await api.patch(`/api/contracts/${contract.id}`, { status: "COMPLETED" });
      toast.success("Contract marked complete.");
      await fetchContract();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update contract status.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[360px] flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--muted)]" />
      </div>
    );
  }

  if (!contract) {
    return <div className="soft-card p-8 text-sm text-[var(--muted)]">Contract not found.</div>;
  }

  const pdfToken = contract.portalTokens?.pdf || "";
  const pdfHref = pdfToken
    ? `/api/contracts/${contract.id}/pdf?token=${encodeURIComponent(pdfToken)}`
    : `/api/contracts/${contract.id}/pdf`;

  return (
    <section className="space-y-5 pb-24 md:pb-0">
      <header className="soft-card p-4 md:p-6">
        <Link href={"/zero-control/contracts" as Route} className="inline-flex min-h-[44px] items-center rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[var(--ink)]">
          Back to Contracts
        </Link>
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Contract Tracker</p>
        <h1 className="mt-2 text-2xl font-display text-[var(--ink)] md:text-3xl">{contract.contractNumber}</h1>
        <p className="text-sm text-[var(--muted)] mt-2">
          {contract.clientName} - {contract.serviceType}
        </p>
      </header>

      <section className="soft-card p-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-black/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Contract Value</p>
          <p className="text-2xl font-semibold mt-2">{formatMoney(contract.currencySymbol || "\u20B9", contract.totalAmount)}</p>
          <p className="text-sm text-[var(--muted)] mt-2">Effective Date: {new Date(contract.effectiveDate).toLocaleDateString("en-IN")}</p>
        </article>

        <article className="rounded-xl border border-black/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Current Status</p>
          <p className="text-2xl font-semibold mt-2">{contract.status}</p>
          <p className="text-sm text-[var(--muted)] mt-2">Views: {contract.viewCount || 0}</p>
        </article>
      </section>

      <section className="soft-card p-6">
        <h2 className="text-xl font-semibold text-[var(--ink)] mb-4">Activity Timeline</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Created - {new Date(contract.createdAt).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {isDone(contract.status, "SENT") ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Circle size={16} className="text-slate-400" />}
            <span>Sent to {contract.clientEmail} - {contract.emailSentAt ? new Date(contract.emailSentAt).toLocaleString("en-IN") : "pending"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {isDone(contract.status, "VIEWED") ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Circle size={16} className="text-slate-400" />}
            <span>Viewed by client - {contract.viewedAt ? `${new Date(contract.viewedAt).toLocaleString("en-IN")} (${contract.viewCount || 0} views)` : "pending"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {isDone(contract.status, "SIGNED") ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Circle size={16} className="text-slate-400" />}
            <span>Signed - {contract.clientSignedAt ? new Date(contract.clientSignedAt).toLocaleString("en-IN") : "awaiting"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {isDone(contract.status, "COMPLETED") ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Circle size={16} className="text-slate-400" />}
            <span>Completed - {contract.status === "COMPLETED" ? "done" : "pending"}</span>
          </div>
        </div>
      </section>

      <section className="soft-card p-6">
        <h2 className="text-xl font-semibold text-[var(--ink)] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void resendContract()} disabled={busy} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-800">
            <Mail size={14} /> Resend Email
          </button>

          <a href={pdfHref} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold">
            <Download size={14} /> Download PDF
          </a>

          <button type="button" onClick={() => void markComplete()} disabled={busy || contract.status === "COMPLETED"} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            <CheckCheck size={14} /> Mark Complete
          </button>

          <a href={reminderLink} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white">
            <MessageSquare size={14} /> Send WhatsApp Reminder
          </a>

          <Link href={`/zero-control/contracts/${contract.id}` as Route} className="inline-flex min-h-[44px] items-center rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold">
            Edit Contract
          </Link>
        </div>
      </section>

      <section className="soft-card p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[var(--ink)]">PDF Preview</h2>
          <button
            type="button"
            onClick={() => setShowPdfPreview((prev) => !prev)}
            className="inline-flex min-h-[44px] items-center rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)]"
          >
            {showPdfPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>
        {showPdfPreview ? (
          <div className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white">
            <div className="relative aspect-[3/4] w-full">
              <iframe src={pdfHref} title="Contract PDF preview" className="h-full w-full" />
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--muted)]">Preview the final client-facing contract PDF on mobile and desktop.</p>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-white/95 px-3 py-3 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-5xl gap-2">
          <a
            href={pdfHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-lg border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-[var(--ink)]"
          >
            <Download size={14} /> PDF
          </a>
          <button
            type="button"
            onClick={() => void markComplete()}
            disabled={busy || contract.status === "COMPLETED"}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            <CheckCheck size={14} /> Complete
          </button>
        </div>
      </div>
    </section>
  );
}
