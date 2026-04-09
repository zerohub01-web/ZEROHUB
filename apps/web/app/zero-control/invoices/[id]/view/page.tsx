"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircle2, Circle, Download, Loader2, Mail, MessageSquare, Wallet } from "lucide-react";
import { api } from "../../../../../lib/api";

interface InvoiceView {
  id: string;
  invoiceNumber: string;
  status: "DRAFT" | "SENT" | "VIEWED" | "SIGNED" | "PAID" | "OVERDUE" | "CANCELLED";
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientBusiness: string;
  totalAmount: number;
  currencySymbol: string;
  dueDate: string;
  createdAt: string;
  emailSentAt?: string;
  viewedAt?: string;
  viewCount?: number;
  signedAt?: string;
  pdfUrl?: string;
  upiId?: string;
  paymentTerms?: string;
  portalTokens?: {
    pdf?: string;
  };
}

function statusDone(current: InvoiceView["status"], target: InvoiceView["status"]): boolean {
  const order: InvoiceView["status"][] = ["DRAFT", "SENT", "VIEWED", "SIGNED", "PAID"];
  return order.indexOf(current) >= order.indexOf(target);
}

export default function InvoiceDetailViewPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const [invoice, setInvoice] = useState<InvoiceView | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const fetchInvoice = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/api/invoices/${id}`);
      setInvoice(data as InvoiceView);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load invoice details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchInvoice();
  }, [id]);

  const reminderLink = useMemo(() => {
    if (!invoice) return "";
    const base = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "918590464379").replace(/\D/g, "") || "918590464379";
    const amount = `${invoice.currencySymbol || "₹"}${Number(invoice.totalAmount || 0).toLocaleString("en-IN")}`;
    const text = `Hi ${invoice.clientName}, just a reminder that invoice ${invoice.invoiceNumber} for ${amount} is due on ${new Date(
      invoice.dueDate
    ).toLocaleDateString("en-IN")}. Pay via UPI: ${invoice.upiId || "zerohub01@upi"}`;
    return `https://wa.me/${base}?text=${encodeURIComponent(text)}`;
  }, [invoice]);

  const sendAgain = async () => {
    if (!invoice) return;
    setBusy(true);
    try {
      const { data } = await api.post(`/api/invoices/${invoice.id}/send`);
      if (data?.emailSent === false) {
        toast.error(data?.message || "Invoice marked as sent, but email delivery failed.");
      } else if (Array.isArray(data?.warnings) && data.warnings.length > 0) {
        toast(data?.message || "Invoice sent with warnings.");
      } else {
        toast.success(data?.message || "Invoice resent to client.");
      }
      await fetchInvoice();
    } catch (error) {
      console.error(error);
      toast.error("Failed to resend invoice.");
    } finally {
      setBusy(false);
    }
  };

  const markPaid = async () => {
    if (!invoice) return;
    setBusy(true);
    try {
      await api.patch(`/api/invoices/${invoice.id}`, { status: "PAID" });
      toast.success("Invoice marked as paid.");
      await fetchInvoice();
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark paid.");
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

  if (!invoice) {
    return <div className="soft-card p-8 text-sm text-[var(--muted)]">Invoice not found.</div>;
  }

  const pdfToken = invoice.portalTokens?.pdf || "";
  const pdfHref = pdfToken
    ? `/api/invoices/${invoice.id}/pdf?token=${encodeURIComponent(pdfToken)}`
    : `/api/invoices/${invoice.id}/pdf`;

  return (
    <section className="space-y-5 pb-24 md:pb-0">
      <header className="soft-card p-4 md:p-6">
        <Link href={"/zero-control/invoices" as Route} className="inline-flex min-h-[44px] items-center rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-[var(--ink)]">
          Back to Invoices
        </Link>
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Invoice Tracker</p>
        <h1 className="mt-2 text-2xl font-display text-[var(--ink)] md:text-3xl">{invoice.invoiceNumber}</h1>
        <p className="text-sm text-[var(--muted)] mt-2">
          {invoice.clientName} - {invoice.clientBusiness}
        </p>
      </header>

      <section className="soft-card p-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-black/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Amount Due</p>
          <p className="text-2xl font-semibold mt-2">
            {(invoice.currencySymbol || "₹") + Number(invoice.totalAmount || 0).toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-[var(--muted)] mt-2">Due Date: {new Date(invoice.dueDate).toLocaleDateString("en-IN")}</p>
        </article>

        <article className="rounded-xl border border-black/10 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Current Status</p>
          <p className="text-2xl font-semibold mt-2">{invoice.status}</p>
          <p className="text-sm text-[var(--muted)] mt-2">Views: {invoice.viewCount || 0}</p>
        </article>
      </section>

      <section className="soft-card p-6">
        <h2 className="text-xl font-semibold text-[var(--ink)] mb-4">Activity Timeline</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Created - {new Date(invoice.createdAt).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {statusDone(invoice.status, "SENT") ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Circle size={16} className="text-slate-400" />}
            <span>Sent to client - {invoice.emailSentAt ? new Date(invoice.emailSentAt).toLocaleString("en-IN") : "pending"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {statusDone(invoice.status, "VIEWED") ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Circle size={16} className="text-slate-400" />}
            <span>Viewed by client - {invoice.viewedAt ? `${new Date(invoice.viewedAt).toLocaleString("en-IN")} (${invoice.viewCount || 0} views)` : "pending"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {statusDone(invoice.status, "SIGNED") ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Circle size={16} className="text-slate-400" />}
            <span>Signed - {invoice.signedAt ? new Date(invoice.signedAt).toLocaleString("en-IN") : "pending"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {statusDone(invoice.status, "PAID") ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Circle size={16} className="text-slate-400" />}
            <span>Paid - {invoice.status === "PAID" ? "completed" : "pending"}</span>
          </div>
        </div>
      </section>

      <section className="soft-card p-6">
        <h2 className="text-xl font-semibold text-[var(--ink)] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void sendAgain()} disabled={busy} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-800">
            <Mail size={14} /> Resend Email
          </button>

          <a href={pdfHref} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold">
            <Download size={14} /> Download PDF
          </a>

          <button type="button" onClick={() => void markPaid()} disabled={busy || invoice.status === "PAID"} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            <Wallet size={14} /> Mark as Paid
          </button>

          <a href={reminderLink} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white">
            <MessageSquare size={14} /> Send Reminder
          </a>

          <Link href={`/zero-control/invoices/${invoice.id}` as Route} className="inline-flex min-h-[44px] items-center rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold">
            Edit Invoice
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
              <iframe src={pdfHref} title="Invoice PDF preview" className="h-full w-full" />
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--muted)]">Preview the final invoice PDF exactly as the client sees it.</p>
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
            onClick={() => void markPaid()}
            disabled={busy || invoice.status === "PAID"}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            <Wallet size={14} /> Mark Paid
          </button>
        </div>
      </div>
    </section>
  );
}
