"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export function FloatingCTA() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 600px
            if (window.scrollY > 600) setVisible(true);
            else setVisible(false);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-8 left-0 right-0 z-50 px-6 pointer-events-none flex justify-center"
                >
                    <a
                        href="/book"
                        className="pointer-events-auto flex items-center gap-3 px-8 py-4 bg-[var(--ink)] text-white rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform active:scale-95 group"
                    >
                        <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-white animate-pulse">
                            <Zap size={14} fill="currentColor" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest">Get Free Automation Audit</span>
                    </a>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
