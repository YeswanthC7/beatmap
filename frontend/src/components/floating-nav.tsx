"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Trending",      href: "#trending",    isAnchor: true },
  { label: "Analyze",       href: "#analyze",     isAnchor: true },
  { label: "Compare",       href: "#compare",     isAnchor: true },
  { label: "How it works",  href: "/how-it-works", isAnchor: false },
];

export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleAnchor = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
    >
      <div className={`flex w-full max-w-5xl items-center justify-between gap-6 rounded-full px-5 py-3 transition-all duration-500 ${
        scrolled ? "glass-dark shadow-2xl shadow-black/40 border-white/10" : "glass border-white/[0.06]"
      }`}>
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/30">
            <span className="text-xs font-black text-white">B</span>
          </div>
          <span className="font-display text-sm font-extrabold text-white tracking-tight">BeatMap</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) =>
            link.isAnchor ? (
              <button key={link.label} onClick={() => handleAnchor(link.href)}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-white/50 transition-all hover:bg-white/[0.06] hover:text-white">
                {link.label}
              </button>
            ) : (
              <Link key={link.label} href={link.href}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-white/50 transition-all hover:bg-white/[0.06] hover:text-white">
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <button onClick={() => handleAnchor("#analyze")}
            className="hidden rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-violet-500/40 sm:flex">
            Analyze a Song
          </button>
          <button onClick={() => setMobileOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-white/60 md:hidden">
            <span className="text-lg leading-none">{mobileOpen ? "✕" : "≡"}</span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full max-w-xs right-4 glass-dark rounded-3xl p-4 shadow-2xl border-white/10"
          >
            {NAV_LINKS.map((link) =>
              link.isAnchor ? (
                <button key={link.label} onClick={() => handleAnchor(link.href)}
                  className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-white/70 transition-all hover:bg-white/[0.06] hover:text-white">
                  {link.label}
                </button>
              ) : (
                <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-white/70 transition-all hover:bg-white/[0.06] hover:text-white">
                  {link.label}
                </Link>
              )
            )}
            <button onClick={() => handleAnchor("#analyze")}
              className="mt-2 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 py-3 text-sm font-bold text-white">
              Analyze a Song
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
