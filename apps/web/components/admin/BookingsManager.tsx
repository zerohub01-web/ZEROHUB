"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, CheckCircle, Clock, Trash2, ArrowUpRight } from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "react-hot-toast";

type Booking = {
    _id: string;
    name: string;
    email: string;
    service: string;
    status: "NEW" | "CONFIRMED" | "COMPLETED";
    createdAt: string;
};

export function BookingsManager() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchBookings() {
        try {
            const res = await api.get("/api/admin/bookings");
            setBookings(res.data);
        } catch (err) {
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id: string, status: string) {
        const loadingId = toast.loading(`Updating status to ${status}...`);
        try {
            await api.patch(`/api/admin/bookings/${id}`, { status });
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status: status as any } : b));
            toast.success("Lead status updated.", { id: loadingId });
        } catch (err) {
            toast.error("Failed to update status", { id: loadingId });
        }
    }

    useEffect(() => {
        fetchBookings();
    }, []);

    if (loading) return <div className="text-center py-20 opacity-50 font-medium">Loading production leads...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-display premium-text">Lead Pipeline</h2>
                <div className="flex gap-2">
                    <button onClick={fetchBookings} className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-white/40 rounded-xl hover:bg-white/80 transition shadow-sm border border-white/50">Refresh</button>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto text-left">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-black/5 bg-black/[0.02]">
                                <th className="px-8 py-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--muted)] opacity-50">Client Identity</th>
                                <th className="px-8 py-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--muted)] opacity-50">Service Operation</th>
                                <th className="px-8 py-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--muted)] opacity-50 text-center">Protocol Status</th>
                                <th className="px-8 py-5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--muted)] opacity-50 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-white/40 transition-colors group">
                                    <td className="px-8 py-5 text-left">
                                        <p className="font-bold text-[var(--ink)]">{booking.name}</p>
                                        <p className="text-xs text-[var(--muted)] font-medium opacity-60">{booking.email}</p>
                                    </td>
                                    <td className="px-8 py-5 text-left">
                                        <span className="px-3 py-1 bg-white/50 rounded-lg text-[10px] font-bold text-[var(--muted)] border border-black/5 shadow-sm">
                                            {booking.service}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-extrabold border shadow-sm ${booking.status === "NEW" ? "bg-amber-50 text-amber-600 border-amber-200" :
                                                booking.status === "CONFIRMED" ? "bg-green-50 text-green-600 border-green-200" :
                                                    "bg-blue-50 text-blue-600 border-blue-200"
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {booking.status === "NEW" && (
                                                <button
                                                    onClick={() => updateStatus(booking._id, "CONFIRMED")}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-[var(--ink)] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:scale-105 transition-transform"
                                                >
                                                    <CheckCircle size={12} /> Convert to Client
                                                </button>
                                            )}
                                            <button className="p-2 text-[var(--muted)] hover:bg-black/5 rounded-lg transition">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {bookings.length === 0 && (
                        <div className="py-20 text-center">
                            <Clock size={40} className="mx-auto text-[var(--muted)] opacity-20 mb-4" />
                            <p className="text-[var(--muted)] font-medium opacity-60">No active leads in the buffer.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
