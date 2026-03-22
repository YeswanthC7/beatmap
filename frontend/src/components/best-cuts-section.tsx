"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BestCut } from "@/types/analysis";

interface BestCutsSectionProps {
  cuts: BestCut[];
  analysisMode: string;
}

const CUT_CONFIG = [
  {
    accent: "#f97316",
    glow: "rgba(249,115,22,0.25)",
    badge: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    bar: "bg-orange-500",
    icon: "⚡",
    label: "Shortest & punchiest",
  },
  {
    accent: "#ec4899",
    glow: "rgba(236,72,153,0.25)",
    badge: "bg-pink-500/15 text-pink-300 border-pink-500/30",
    bar: "bg-pink-500",
    icon: "✂️",
    label: "Standard short-form",
  },
  {
    accent: "#8b5cf6",
    glow: "rgba(139,92,246,0.25)",
    badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    bar: "bg-purple-500",
    icon: "🎬",
    label: "Longer narrative",
  },
];

function WaveformViz({ accent, confidence }: { accent: string; confidence: number }) {
  const bars = Array.from({ length: 20 }, (_, i) => {
    const base = Math.sin(i * 0.7) * 0.4 + 0.6;
    const inWindow = i >= 4 && i <= Math.round(4 + confidence * 12);
    return { h: base, lit: inWindow };
  });

  return (
    <div className="flex items-end gap-0.5 h-8">
      {bars.map((b, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-300"
          style={{
            height: `${b.h * 100}%`,
            background: b.lit ? accent : "rgba(255,255,255,0.08)",
            boxShadow: b.lit ? `0 0 6px ${accent}80` : "none",
          }}
        />
      ))}
    </div>
  );
}

export function BestCutsSection({ cuts, analysisMode }: BestCutsSectionProps) {
  const [copied, setCopied] = useState<number | null>(null);

  if (!cuts || cuts.length === 0) return null;

  const isMetadataOnly = analysisMode === "metadata_only";

  const handleCopy = (i: number, cut: BestCut) => {
    navigator.clipboard?.writeText(`${cut.start} – ${cut.end}: ${cut.title}`).catch(() => {});
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="mb-5">
        <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-pink-400/60 mb-1">
          Exact timestamps to use
        </p>
        <h2 className="font-display text-2xl font-extrabold text-white">
          Best cuts for your video
        </h2>
        <p className="mt-1 text-xs text-white/35">
          The strongest windows matched to your edit type.
          {isMetadataOnly && " Estimated from song knowledge + AI."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cuts.map((cut, i) => {
          const cfg = CUT_CONFIG[i] ?? CUT_CONFIG[0];
          const pct = Math.round(cut.confidence * 100);
          const isCopied = copied === i;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-black/30 p-5 flex flex-col"
              style={{ boxShadow: `0 0 40px ${cfg.glow}` }}
            >
              {/* Accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                style={{ background: cfg.accent }} />

              {/* Top badges */}
              <div className="flex items-center justify-between mb-4">
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${cfg.badge}`}>
                  {cut.durationLabel}
                </span>
                <span className="text-xs text-white/25">{cfg.label}</span>
              </div>

              {/* Timestamp — BIG */}
              <div className="mb-3">
                <p className="font-mono text-2xl font-bold" style={{ color: cfg.accent }}>
                  {cut.start}
                  <span className="text-white/20 mx-2">–</span>
                  {cut.end}
                </p>
                <p className="mt-1 font-display text-sm font-bold text-white">{cut.title}</p>
              </div>

              {/* Waveform visualization */}
              <div className="mb-3">
                <WaveformViz accent={cfg.accent} confidence={cut.confidence} />
                <p className="mt-1 text-[10px] text-white/25">← highlighted region is your cut window</p>
              </div>

              <p className="text-xs leading-5 text-white/50 flex-1">{cut.reason}</p>

              {/* Confidence + Copy */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-white/25">AI confidence</span>
                    <span className="text-[10px] font-bold" style={{ color: cfg.accent }}>{pct}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/10">
                    <div className={`h-full rounded-full ${cfg.bar} opacity-70`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(i, cut)}
                  className="shrink-0 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all"
                  style={{
                    borderColor: isCopied ? `${cfg.accent}60` : "rgba(255,255,255,0.1)",
                    background: isCopied ? `${cfg.accent}15` : "rgba(255,255,255,0.04)",
                    color: isCopied ? cfg.accent : "rgba(255,255,255,0.35)",
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span key={isCopied ? "copied" : "copy"}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}>
                      {isCopied ? "✓ Copied!" : "Copy"}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
