"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BestCut } from "@/types/analysis";

interface BestCutsSectionProps {
  cuts: BestCut[];
  analysisMode: string;
}

const CUT_CONFIG = [
  { accent: "#CCFF00", label: "SHORTEST & PUNCHIEST" },
  { accent: "#FF007F", label: "STANDARD SHORT-FORM" },
  { accent: "#66FCF1", label: "LONGER NARRATIVE" },
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
        <div key={i} className="flex-1 transition-all duration-300"
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
        <h2 className="font-display text-2xl uppercase text-white mb-1" style={{ letterSpacing: "0.02em" }}>
          BEST CUTS
        </h2>
        <p className="font-body text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          EXACT TIMESTAMPS TO USE.{isMetadataOnly ? " ESTIMATED FROM SONG KNOWLEDGE + AI." : ""}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {cuts.map((cut, i) => {
          const cfg = CUT_CONFIG[i] ?? CUT_CONFIG[0];
          const pct = Math.round(cut.confidence * 100);
          const isCopied = copied === i;

          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative p-5 flex flex-col"
              style={{ border: `2px solid ${cfg.accent}25`, background: `${cfg.accent}05` }}
            >
              {/* Accent left bar */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5"
                style={{ background: cfg.accent }} />

              {/* Duration label */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-body font-bold text-[10px] uppercase tracking-widest px-2 py-0.5"
                  style={{ background: cfg.accent + "20", color: cfg.accent, border: `1px solid ${cfg.accent}40` }}>
                  {cut.durationLabel}
                </span>
                <span className="font-body text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {cfg.label}
                </span>
              </div>

              {/* Big timestamp */}
              <div className="mb-3">
                <p className="font-display text-2xl" style={{ color: cfg.accent }}>
                  {cut.start}
                  <span className="mx-2" style={{ color: "rgba(255,255,255,0.2)" }}>–</span>
                  {cut.end}
                </p>
                <p className="font-body font-bold text-sm text-white mt-1">{cut.title}</p>
              </div>

              {/* Waveform */}
              <div className="mb-3">
                <WaveformViz accent={cfg.accent} confidence={cut.confidence} />
                <p className="font-body mt-1 text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                  ← highlighted = your cut window
                </p>
              </div>

              <p className="font-body text-xs leading-5 flex-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                {cut.reason}
              </p>

              {/* Confidence + Copy */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-body text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                      AI confidence
                    </span>
                    <span className="font-body font-bold text-[10px]" style={{ color: cfg.accent }}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-0.5 w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full" style={{ width: `${pct}%`, background: cfg.accent, opacity: 0.7 }} />
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(i, cut)}
                  className="shrink-0 font-body font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 transition-all"
                  style={{
                    border: `2px solid ${isCopied ? cfg.accent : "rgba(255,255,255,0.15)"}`,
                    background: isCopied ? cfg.accent : "transparent",
                    color: isCopied ? "#000" : "rgba(255,255,255,0.4)",
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span key={isCopied ? "y" : "n"}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}>
                      {isCopied ? "✓ COPIED" : "COPY"}
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
