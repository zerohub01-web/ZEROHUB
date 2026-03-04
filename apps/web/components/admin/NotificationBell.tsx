"use client";

import { useState, useEffect } from "react";
import { Bell, LucideIcon, Info, UserPlus, Zap } from "lucide-react";
import { api } from "../../lib/api";

type LogEntry = {
    _id: string;
    type: string;
    email: string;
    metadata: any;
    createdAt: string;
};

const iconMap: Record<string, LucideIcon> = {
    BOOKING_CREATED: UserPlus,
    BOOKING_STATUS_CHANGED: Zap,
    DEFAULT: Info
};

export function NotificationBell() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [open, setOpen] = useState(false);
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        async function fetchLogs() {
            try {
                const res = await api.get("/api/admin/activity");
                // Sort by date and take latest 5
                const sorted = (res.data as LogEntry[]).sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                ).slice(0, 5);
                setLogs(sorted);
                setUnread(sorted.length > 0 ? 1 : 0); // Simplified for demo
            } catch (err) {
                console.error("Failed to fetch logs", err);
            }
        }
        fetchLogs();
    }, []);

    return (
        <div className="relative">
            <button
                onClick={() => { setOpen(!open); setUnread(0); }}
                className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-white/40 border border-white/50 backdrop-blur-sm text-[var(--ink)] hover:bg-white/80 transition-all active:scale-95"
            >
                <Bell size={20} />
                {unread > 0 && (
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ring-4 ring-red-500/20"></span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-4 w-80 glass-card p-4 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)]">System Alerts</h4>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">LIVE</span>
                    </div>

                    <div className="space-y-3">
                        {logs.length === 0 ? (
                            <p className="text-xs text-center py-8 text-[var(--muted)] opacity-60">No recent activity found.</p>
                        ) : (
                            logs.map((log) => {
                                const Icon = iconMap[log.type] || iconMap.DEFAULT;
                                return (
                                    <div key={log._id} className="flex gap-3 p-3 rounded-xl bg-white/40 border border-white/50 hover:bg-white/70 transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-[var(--ink)]/5 flex items-center justify-center shrink-0">
                                            <Icon size={14} className="text-[var(--muted)]" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-bold truncate text-[var(--ink)]">{log.type.replace(/_/g, " ")}</p>
                                            <p className="text-[10px] text-[var(--muted)] opacity-70 truncate">{log.email}</p>
                                            <p className="text-[9px] text-[var(--muted)] opacity-40 mt-1 font-medium">
                                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <button className="w-full mt-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--ink)] transition-colors border-t border-black/5 pt-4">
                        View All Activity
                    </button>
                </div>
            )}
        </div>
    );
}
