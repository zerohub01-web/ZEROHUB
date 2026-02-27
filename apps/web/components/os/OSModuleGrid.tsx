"use client";

import { OSWindow } from "./OSWindow";

const modules = [
  { title: "Database", status: "Online", detail: "Mongo cluster healthy" },
  { title: "Execution Pipeline", status: "Ready", detail: "Automations armed" },
  { title: "Booking", status: "Active", detail: "Public flow live" },
  { title: "Analytics", status: "Streaming", detail: "KPI snapshots updating" }
];

export function OSModuleGrid() {
  return (
    <OSWindow title="Module Matrix">
      <div className="grid sm:grid-cols-2 gap-3">
        {modules.map((mod) => (
          <article key={mod.title} className="rounded-xl border border-white/10 p-3 bg-black/20">
            <p className="font-semibold">{mod.title}</p>
            <p className="text-neon text-sm">{mod.status}</p>
            <p className="text-xs text-mist mt-1">{mod.detail}</p>
          </article>
        ))}
      </div>
    </OSWindow>
  );
}
