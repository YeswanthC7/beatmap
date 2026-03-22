"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-violet-500/20 px-8 py-16 text-center"
          style={{ background: "linear-gradient(135deg, #1a0040 0%, #0d001a 50%, #00102d 100%)" }}
        >
          {/* Background glows */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 left-1/4 h-48 w-48 rounded-full blur-[80px]"
              style={{ background: "rgba(139,92,246,0.25)" }} />
            <div className="absolute -bottom-16 right-1/4 h-48 w-48 rounded-full blur-[80px]"
              style={{ background: "rgba(236,72,153,0.2)" }} />
            {/* Animated particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div key={i}
                className="absolute h-1 w-1 rounded-full bg-violet-400"
                style={{ left: `${10 + i * 11}%`, top: `${20 + (i % 3) * 25}%` }}
                animate={{ y: [-10, -30, -10], opacity: [0, 0.8, 0] }}
                transition={{ duration: 3 + i * 0.5, delay: i * 0.4, repeat: Infinity }}
              />
            ))}
          </div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">BeatMap</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl"
          >
            Stop guessing.
            <br />
            <span className="gradient-text">Start editing faster.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mx-auto mt-5 max-w-md text-base text-white/50"
          >
            Find the best part of the song before you even open your editor.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/30 transition-all hover:scale-105 hover:shadow-violet-500/50"
            >
              Analyze a song →
            </button>
            <button
              onClick={() => document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-2xl border border-white/15 bg-white/[0.06] px-8 py-4 text-sm font-bold text-white/80 backdrop-blur-sm transition-all hover:bg-white/[0.1] hover:text-white"
            >
              Explore trending tracks
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
