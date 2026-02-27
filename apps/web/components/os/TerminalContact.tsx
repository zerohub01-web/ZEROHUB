"use client";

import { OSWindow } from "./OSWindow";

export function TerminalContact() {
  return (
    <OSWindow title="Terminal Contact">
      <div className="font-mono text-sm space-y-2">
        <p><span className="text-neon">zero@ops</span>:~$ secure channel opened</p>
        <p><span className="text-neon">zero@ops</span>:~$ route /api/bookings ready</p>
        <p><span className="text-neon">zero@ops</span>:~$ message: Scale my business engine</p>
      </div>
    </OSWindow>
  );
}
