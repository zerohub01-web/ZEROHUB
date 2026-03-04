"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Circle, MessageSquare, Paperclip, ChevronDown, ChevronRight, Zap } from "lucide-react";
import { api } from "../../lib/api";
import { toast } from "react-hot-toast";

type Milestone = {
    key: string;
    title: string;
    status: "PENDING" | "DONE";
    updatedAt: string;
    comments: any[];
    files: string[];
};

type Timeline = {
    _id: string;
    bookingId: string;
    customerName: string;
    customerEmail: string;
    milestones: Milestone[];
};

export function TimelineManager() {
    const [timelines, setTimelines] = useState<Timeline[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);

    async function fetchTimelines() {
        try {
            const res = await api.get("/api/admin/projects");
            setTimelines(res.data);
        } catch {
            toast.error("Failed to load project timelines");
        } finally {
            setLoading(false);
        }
    }

    async function toggleMilestone(bookingId: string, milestoneKey: string, currentStatus: string) {
        const newStatus = currentStatus === "DONE" ? "PENDING" : "DONE";
        const toastId = toast.loading(`Updating ${milestoneKey} status...`);
        try {
            await api.patch(`/api/admin/projects/${bookingId}/milestones/${milestoneKey}`, { status: newStatus });
            toast.success("Timeline synchronized.", { id: toastId });
            fetchTimelines();
        } catch {
            toast.error("Telemetry sync failed.", { id: toastId });
        }
    }

    useEffect(() => {
        fetchTimelines();
    }, []);

    if (loading) return <div className="text-center py-20 opacity-40 font-bold uppercase tracking-widest text-xs">Tracking project telemetry...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-display premium-text">Active Operations</h2>
                <button onClick={fetchTimelines} className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-white/40 rounded-xl hover:bg-white/80 transition border border-white/50">Ping Node</button>
            </div>

            <div className="space-y-4">
                {timelines.length === 0 && (
                    <div className="glass-card p-12 text-center">
                        <Zap size={32} className="mx-auto text-[var(--muted)] opacity-20 mb-4" />
                        <p className="text-sm font-bold text-[var(--muted)] opacity-60">No active production streams detected.</p>
                    </div>
                )}
                {timelines.map((timeline) => (
                    <div key={timeline._id} className="glass-card overflow-hidden group">
                        <button
                            onClick={() => setExpanded(expanded === timeline._id ? null : timeline._id)}
                            className="w-full flex items-center justify-between p-6 hover:bg-white/40 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-[var(--ink)]/5 flex items-center justify-center font-bold text-[var(--muted)] border border-black/5">
                                    {timeline.customerName[0]}
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-[var(--ink)]">{timeline.customerName}</h4>
                                    <p className="text-[10px] text-[var(--muted)] opacity-60 font-medium uppercase tracking-widest">{timeline.customerEmail}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="hidden md:flex items-center gap-1.5">
                                    {timeline.milestones.map((m) => (
                                        <div
                                            key={m.key}
                                            className={`w-2 h-2 rounded-full border shadow-sm ${m.status === 'DONE' ? 'bg-green-500 border-green-300' : 'bg-white border-black/10'}`}
                                            title={m.title}
                                        />
                                    ))}
                                </div>
                                {expanded === timeline._id ? <ChevronDown size={20} className="text-[var(--muted)] opacity-40" /> : <ChevronRight size={20} className="text-[var(--muted)] opacity-40" />}
                            </div>
                        </button>

                        {expanded === timeline._id && (
                            <div className="p-8 border-t border-black/5 bg-black/[0.01] space-y-8">
                                <div className="relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-black/5"></div>

                                    <div className="space-y-8 relative">
                                        {timeline.milestones.map((milestone) => (
                                            <div key={milestone.key} className="flex gap-4 group/ms">
                                                <button
                                                    onClick={() => toggleMilestone(timeline.bookingId, milestone.key, milestone.status)}
                                                    className={`z-10 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${milestone.status === 'DONE' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20 rotate-0' : 'bg-white border-2 border-black/10 text-transparent hover:border-[var(--ink)]'
                                                        }`}
                                                >
                                                    <CheckCircle size={14} />
                                                </button>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h5 className={`text-sm font-bold uppercase tracking-widest ${milestone.status === 'DONE' ? 'text-[var(--ink)]' : 'text-[var(--muted)] opacity-60'}`}>
                                                            {milestone.title}
                                                        </h5>
                                                        <div className="flex gap-2">
                                                            <button className="p-1.5 rounded-lg hover:bg-black/5 text-[var(--muted)] opacity-40 hover:opacity-100 transition"><MessageSquare size={14} /></button>
                                                            <button className="p-1.5 rounded-lg hover:bg-black/5 text-[var(--muted)] opacity-40 hover:opacity-100 transition"><Paperclip size={14} /></button>
                                                        </div>
                                                    </div>

                                                    {milestone.status === 'DONE' && (
                                                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">Verified • {new Date(milestone.updatedAt).toLocaleDateString()}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
