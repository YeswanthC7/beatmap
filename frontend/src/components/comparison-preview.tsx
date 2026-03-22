"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const TRACKS = [
  {
    title: "As It Was",
    artist: "Harry Styles",
    score: 91,
    isWinner: true,
    rows: [
      { label: "Best opening",       value: "0:06 — strong hook", good: true },
      { label: "Better for talking", value: "0:34 — calm section", good: true },
      { label: "Travel video fit",   value: "Excellent", good: true },
      { label: "Emotional payoff",   value: "Strong peak at 2:14", good: true },
    ],
  },
  {
    title: "Heat Waves",
    artist: "Glass Animals",
    score: 74,
    isWinner: false,
    rows: [
      { label: "Best opening",       value: "0:20 — slower build", good: false },
      { label: "Better for talking", value: "Limited quiet", good: false },
      { label: "Travel video fit",   value: "Moderate", good: false },
      { label: "Emotional payoff",   value: "Steady, no big peak", good: false },
    ],
  },
];

export function ComparisonPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="compare" ref={ref} className="relative py-24 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-2xl"
        style={{ background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.3), transparent)" }} />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="inline-block rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-pink-300 mb-4">
            Compare before you edit
          </span>
          <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
            Compare songs{" "}
            <span className="gradient-text">side by side</span>
          </h2>
          <p className="mt-4 text-base text-white/45 max-w-lg mx-auto">
            Try 2 or 3 tracks and see which one works better for your exact video — before you start editing.
          </p>
        </motion.div>

        {/* Example preset */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 flex items-center gap-3 justify-center"
        >
          <span className="text-xs text-white/30">Comparing for:</span>
          <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">
            ✈️ Travel Montage
          </span>
        </motion.div>

        {/* Comparison cards */}
        <div className="grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
          {TRACKS.map((track, ti) => (
            <motion.div
              key={track.title}
              initial={{ opacity: 0, y: 28, x: ti === 0 ? -20 : 20 }}
              animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
              transition={{ delay: 0.3 + ti * 0.15, duration: 0.6 }}
              className={`relative rounded-3xl border p-5 overflow-hidden ${
                track.isWinner
                  ? "border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-pink-500/5"
                  : "border-white/[0.07] bg-white/[0.02]"
              }`}
            >
              {track.isWinner && (
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-lg shadow-violet-500/30"
                >
                  Best choice
                </motion.div>
              )}

              {/* Track info */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center text-xl ${
                  track.isWinner ? "bg-gradient-to-br from-violet-500 to-pink-500" : "bg-white/10"
                }`}>
                  🎵
                </div>
                <div>
                  <p className="font-display text-sm font-extrabold text-white">{track.title}</p>
                  <p className="text-xs text-white/40">{track.artist}</p>
                </div>
              </div>

              {/* Overall score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-white/30 font-semibold">Overall fit</span>
                  <span className="text-xs font-bold" style={{ color: track.isWinner ? "#8b5cf6" : "#ffffff60" }}>
                    {track.score}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <motion.div className="h-full rounded-full"
                    style={{ background: track.isWinner ? "linear-gradient(90deg, #8b5cf6, #ec4899)" : "rgba(255,255,255,0.2)" }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${track.score}%` } : {}}
                    transition={{ delay: 0.6 + ti * 0.2, duration: 0.9 }}
                  />
                </div>
              </div>

              {/* Comparison rows */}
              <div className="space-y-2">
                {track.rows.map((row) => (
                  <div key={row.label} className="flex items-start gap-2">
                    <span className={`mt-0.5 text-xs shrink-0 ${row.good ? "text-green-400" : "text-white/20"}`}>
                      {row.good ? "✓" : "·"}
                    </span>
                    <div>
                      <span className="text-[10px] text-white/30">{row.label}: </span>
                      <span className="text-[10px] text-white/60">{row.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-white/35 mb-4">
            Paste your own songs and compare for your specific video type.
          </p>
          <button
            onClick={() => document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" })}
            className="rounded-2xl border border-pink-500/30 bg-pink-500/10 px-7 py-3 text-sm font-bold text-pink-200 transition-all hover:scale-105 hover:bg-pink-500/20"
          >
            Compare your tracks →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
