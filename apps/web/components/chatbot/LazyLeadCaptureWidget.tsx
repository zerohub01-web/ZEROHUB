"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LeadCaptureWidget = dynamic(
  () => import("./LeadCaptureWidget").then((module) => module.LeadCaptureWidget),
  { ssr: false }
);

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

export function LazyLeadCaptureWidget() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    const activate = () => setEnabled(true);

    const currentWindow = window as IdleWindow;

    if (typeof currentWindow.requestIdleCallback === "function") {
      idleId = currentWindow.requestIdleCallback(activate, { timeout: 2500 });
    } else {
      timeoutId = setTimeout(activate, 1800);
    }

    return () => {
      if (idleId !== null && typeof currentWindow.cancelIdleCallback === "function") {
        currentWindow.cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!enabled) return null;
  return <LeadCaptureWidget />;
}
