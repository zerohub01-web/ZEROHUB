"use client";

import { motion } from "framer-motion";

interface WindowProps {
  title: string;
  children: React.ReactNode;
}

export function OSWindow({ title, children }: WindowProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel overflow-hidden"
    >
      <header className="px-4 py-2 border-b border-white/10 flex items-center gap-2 text-xs font-mono text-mist">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
        <span className="ml-2">{title}</span>
      </header>
      <div className="p-4">{children}</div>
    </motion.section>
  );
}
