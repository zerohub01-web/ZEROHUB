"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../lib/api";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

export default function BookPage() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<{ _id: string; title: string }[]>([]);

  useEffect(() => {
    api.get("/api/services").then((res) => setServices(res.data)).catch(() => setServices([]));
  }, []);

  async function handleBooking(formData: FormData) {
    setSending(true);
    setError(null);
    const payload = {
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      phone: String(formData.get("phone")),
      businessType: String(formData.get("businessType")),
      currentWorkflow: String(formData.get("currentWorkflow")),
      teamSize: String(formData.get("teamSize") ?? ""),
      service: String(formData.get("service")),
      date: new Date().toISOString()
    };

    try {
      await api.post("/api/bookings", payload);
      setDone(true);
    } catch (err: any) { // Added type annotation for err
      console.error("Booking Error:", err.response?.data || err.message);
      // @ts-ignore
      window.DEBUG_BOOKING_ERROR = err.response?.data || err.message;
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Unable to process booking. Please try again later.";
      toast.error(errorMsg); // Added toast notification
      // The original setError logic is replaced by toast.error as per instruction's implied change.
      // If the user intended to keep setError, the instruction was ambiguous.
      // For now, I'm following the provided snippet's logic which uses toast.
      // The trailing part of the instruction's snippet was malformed and seemed to be a partial copy of the original catch block.
      // I'm interpreting the instruction as replacing the error handling with the new toast-based one.
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden px-6 md:px-10 py-8">
      <div className="orb orb-a" /><div className="orb orb-b" />
      <SiteHeader />
      <section id="book" className="relative z-10 max-w-6xl mx-auto mt-8 pb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Book</p>
        <h1 className="text-5xl md:text-6xl font-display text-[var(--ink)] mt-3">Get your free automation audit.</h1>
        <div className="soft-card p-6 md:p-8 mt-8">
          {done ? (
            <p className="text-[var(--accent)] font-semibold">Booking created. Confirmation and admin notification were triggered.</p>
          ) : (
            <form action={handleBooking} className="grid gap-4">
              <input name="name" required placeholder="Full name" className="field py-3" />
              <div className="grid md:grid-cols-2 gap-4">
                <input name="email" type="email" required placeholder="Work email" className="field py-3" />
                <input name="phone" required placeholder="Phone number" className="field py-3" />
              </div>
              <input name="businessType" required placeholder="Business Type & Industry" className="field py-3" />
              <textarea name="currentWorkflow" required placeholder="Describe your workflow and bottlenecks" className="field py-3 min-h-[100px] resize-y" />
              <div className="grid md:grid-cols-2 gap-4">
                <select name="teamSize" className="field py-3" defaultValue=""><option value="" disabled>Team size</option><option value="1-10">1-10</option><option value="11-50">11-50</option><option value="51-200">51-200</option><option value="200+">200+</option></select>
                <select name="service" required className="field py-3">
                  <option value="">Select service</option>
                  {services.length > 0 ? (
                    services.map((s)=><option key={s._id} value={s.title}>{s.title}</option>)
                  ) : (
                    <>
                      <option value="Digital Storefront build">Digital Storefront build</option>
                      <option value="Business Automation pipeline">Business Automation pipeline</option>
                      <option value="Digital Fortress & AI system">Digital Fortress & AI system</option>
                      <option value="Maintenance MRR plan">Maintenance MRR plan</option>
                    </>
                  )}
                </select>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button disabled={sending} className="btn-primary py-3.5 text-sm disabled:opacity-70">{sending ? "Processing..." : "Submit Booking"}</button>
            </form>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}



