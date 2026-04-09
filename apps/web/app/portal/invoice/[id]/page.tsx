"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import SignaturePad from "signature_pad";
import toast from "react-hot-toast";
import { Download, Loader2, MessageSquare, PenLine } from "lucide-react";

interface PublicInvoice {
  id: string;
  invoiceNumber: string;
  status: "DRAFT" | "SENT" | "VIEWED" | "SIGNED" | "PAID" | "OVERDUE" | "CANCELLED";
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientBusiness: string;
  clientAddress?: string;
  totalAmount: number;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  currencySymbol: string;
  paymentTerms: string;
  dueDate: string;
  createdAt: string;
  items: Array<{ category?: string; description: string; quantity: number; unitPrice: number; total: number }>;
  upiId?: string;
  ifscCode?: string;
  accountNumber?: string;
  bankName?: string;
  proposalNote?: string;
  clientSignature?: string;
  signedAt?: string;
  portalTokens?: {
    view?: string;
    sign?: string;
    pdf?: string;
  };
}

function formatMoney(symbol: string, amount: number): string {
  return `${symbol}${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function getApiBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;
  return (fromEnv || "http://localhost:4000").replace(/\/$/, "");
}

export default function PortalInvoicePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = params?.id ?? "";
  const viewToken = searchParams?.get("token") ?? "";

  const [invoice, setInvoice] = useState<PublicInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  const apiBase = useMemo(() => getApiBase(), []);

  const fetchInvoice = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const tokenQuery = viewToken ? `?token=${encodeURIComponent(viewToken)}` : "";
      const res = await fetch(`${apiBase}/portal/invoice/${id}${tokenQuery}`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Invoice fetch failed (${res.status})`);
      }
      const data = (await res.json()) as PublicInvoice;
      setInvoice(data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load invoice details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchInvoice();
  }, [id, viewToken]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    signaturePadRef.current = new SignaturePad(canvas, {
      minWidth: 0.9,
      maxWidth: 2.3,
      penColor: "#0f172a"
    });

    return () => {
      signaturePadRef.current?.off();
      signaturePadRef.current = null;
    };
  }, [invoice?.id]);

  const signAndAccept = async () => {
    if (!invoice) return;

    const pad = signaturePadRef.current;
    if (!pad || pad.isEmpty()) {
      toast.error("Please add your signature first.");
      return;
    }

    setSigning(true);
    try {
      const signature = pad.toDataURL("image/png");
      const signToken = invoice.portalTokens?.sign ?? "";
      if (!signToken) {
        throw new Error("This signing link is missing a valid access token.");
      }

      const res = await fetch(`${apiBase}/api/invoices/${invoice.id}/sign?token=${encodeURIComponent(signToken)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature })
      });

      if (!res.ok) {
        throw new Error(`Sign failed (${res.status})`);
      }

      toast.success("Invoice signed successfully.");
      await fetchInvoice();
    } catch (error) {
      console.error(error);
      toast.error("Unable to save signature.");
    } finally {
      setSigning(false);
    }
  };

  const copyUpi = async () => {
    if (!invoice?.upiId) return;
    try {
      await navigator.clipboard.writeText(invoice.upiId);
      toast.success("UPI ID copied.");
    } catch {
      toast.error("Could not copy UPI ID.");
    }
  };

  const waLink = useMemo(() => {
    if (!invoice) return "";
    const phone = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "918590464379").replace(/\D/g, "") || "918590464379";
    const txt = `Hi ZeroOps, I have a question about invoice ${invoice.invoiceNumber}.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(txt)}`;
  }, [invoice]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--muted)]" />
      </main>
    );
  }

  if (!invoice) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="soft-card p-8 text-center text-sm text-[var(--muted)]">Invoice not found.</div>
      </main>
    );
  }

  const pdfToken = invoice.portalTokens?.pdf ?? "";
  const pdfHref = pdfToken
    ? `${apiBase}/api/invoices/${invoice.id}/pdf?token=${encodeURIComponent(pdfToken)}`
    : `${apiBase}/api/invoices/${invoice.id}/pdf`;

  return (
    <main className="min-h-screen px-4 py-6 pb-28 sm:px-6 md:px-10 md:py-8 md:pb-8">
      <section className="max-w-5xl mx-auto space-y-5">
        <article className="soft-card p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Client Invoice</p>
              <h1 className="mt-2 text-2xl font-display text-[var(--ink)] md:text-3xl">{invoice.invoiceNumber}</h1>
              <p className="text-sm text-[var(--muted)] mt-2">{invoice.clientName} - {invoice.clientBusiness}</p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Total Due</p>
              <p className="mt-2 text-xl font-semibold md:text-2xl">{formatMoney(invoice.currencySymbol || "₹", invoice.totalAmount)}</p>
              <p className="text-sm text-[var(--muted)] mt-2">Due by {new Date(invoice.dueDate).toLocaleDateString("en-IN")}</p>
            </div>
          </div>
        </article>

        <article className="soft-card p-4 md:p-6">
          {invoice.proposalNote ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900 mb-4">
              {invoice.proposalNote}
            </div>
          ) : null}

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-black/10">
                <tr>
                  <th className="py-2 text-left">Description</th>
                  <th className="py-2 text-left">Qty</th>
                  <th className="py-2 text-left">Unit Price</th>
                  <th className="py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {(Array.isArray(invoice.items) ? invoice.items : []).map((item, idx) => (
                  <tr key={`${item.description}-${idx}`}>
                    <td className="py-2">
                      <p className="font-medium">{item.description}</p>
                      {item.category ? <p className="text-xs text-[var(--muted)] mt-0.5">{item.category}</p> : null}
                    </td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2">{formatMoney(invoice.currencySymbol || "₹", item.unitPrice)}</td>
                    <td className="py-2 font-semibold">{formatMoney(invoice.currencySymbol || "₹", item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {(Array.isArray(invoice.items) ? invoice.items : []).map((item, idx) => (
              <article key={`${item.description}-${idx}`} className="rounded-xl border border-black/10 bg-white/75 p-3 text-sm">
                <p className="font-semibold text-[var(--ink)]">{item.description}</p>
                {item.category ? <p className="mt-0.5 text-xs text-[var(--muted)]">{item.category}</p> : null}
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-[var(--muted)]">Qty</p>
                    <p className="font-semibold">{item.quantity}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)]">Unit</p>
                    <p className="font-semibold">{formatMoney(invoice.currencySymbol || "₹", item.unitPrice)}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)]">Total</p>
                    <p className="font-semibold">{formatMoney(invoice.currencySymbol || "₹", item.total)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-4 ml-auto max-w-xs rounded-xl border border-black/10 bg-white/70 p-4 text-sm space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><strong>{formatMoney(invoice.currencySymbol || "₹", invoice.subtotal)}</strong></div>
            <div className="flex justify-between"><span>GST ({invoice.gstRate}%)</span><strong>{formatMoney(invoice.currencySymbol || "₹", invoice.gstAmount)}</strong></div>
            <div className="flex justify-between text-base"><span>Total</span><strong>{formatMoney(invoice.currencySymbol || "₹", invoice.totalAmount)}</strong></div>
          </div>
        </article>

        <article className="soft-card p-4 md:p-6">
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
            <p className="mt-3 text-sm text-[var(--muted)]">Use preview to confirm layout and totals before signing.</p>
          )}
        </article>

        <article id="invoice-sign-panel" className="soft-card grid gap-5 p-4 md:grid-cols-2 md:p-6">
          <div>
            <h2 className="text-lg font-semibold text-[var(--ink)]">Payment Details</h2>
            <p className="text-sm text-[var(--muted)] mt-2">Terms: {invoice.paymentTerms || "Due within 7 days"}</p>
            <div className="mt-3 space-y-1 text-sm">
              <p>Bank: {invoice.bankName || "HDFC Bank"}</p>
              <p>Account: {invoice.accountNumber || "-"}</p>
              <p>IFSC: {invoice.ifscCode || "-"}</p>
              <p>UPI: {invoice.upiId || "zerohub01@upi"}</p>
            </div>
            <button type="button" onClick={copyUpi} className="mt-3 inline-flex min-h-[44px] items-center rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold">
              Copy UPI ID
            </button>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--ink)]">Digital Signature</h2>
            {invoice.clientSignature ? (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm text-emerald-900">
                <p className="font-semibold">Signed</p>
                <p className="mt-1">Signed at: {invoice.signedAt ? new Date(invoice.signedAt).toLocaleString("en-IN") : "-"}</p>
              </div>
            ) : (
              <>
                <div className="mt-3 rounded-xl border border-black/10 bg-white/70 p-3">
                  <canvas ref={canvasRef} className="h-56 w-full rounded-lg border border-black/10 bg-white md:h-40" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => signaturePadRef.current?.clear()} className="inline-flex min-h-[44px] items-center rounded-lg border border-black/10 bg-white px-3 py-2 text-sm">
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => void signAndAccept()}
                    disabled={signing}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white md:flex-none"
                  >
                    {signing ? <Loader2 size={14} className="animate-spin" /> : <PenLine size={14} />}
                    Sign and Accept
                  </button>
                </div>
              </>
            )}
          </div>
        </article>

        <article className="soft-card p-4 md:p-6 flex flex-wrap gap-2">
          <a href={pdfHref} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold">
            <Download size={14} /> Download PDF
          </a>

          <a href={waLink} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white">
            <MessageSquare size={14} /> Questions? Chat on WhatsApp
          </a>
        </article>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-3 py-3 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-5xl gap-2">
          <a
            href={pdfHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-lg border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-[var(--ink)]"
          >
            <Download size={14} /> PDF
          </a>
          {invoice.clientSignature ? (
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-lg bg-[#25D366] px-3 py-2 text-xs font-semibold text-white"
            >
              <MessageSquare size={14} /> WhatsApp
            </a>
          ) : (
            <a
              href="#invoice-sign-panel"
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
            >
              <PenLine size={14} /> Sign
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
