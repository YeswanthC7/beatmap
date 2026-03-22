"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import type { EditPreset, ShotPlanStep } from "@/types/analysis";
import { PRESET_OPTIONS } from "@/types/analysis";

interface ShotPlanSectionProps {
  steps: ShotPlanStep[];
  preset: EditPreset;
}

const STEP_COLORS = [
  { border: "border-orange-500/25", bg: "bg-orange-500/[0.06]", num: "text-orange-400", dot: "#f97316" },
  { border: "border-pink-500/25",   bg: "bg-pink-500/[0.06]",   num: "text-pink-400",   dot: "#ec4899" },
  { border: "border-purple-500/25", bg: "bg-purple-500/[0.06]", num: "text-purple-400", dot: "#8b5cf6" },
  { border: "border-blue-500/25",   bg: "bg-blue-500/[0.06]",   num: "text-blue-400",   dot: "#3b82f6" },
  { border: "border-teal-500/25",   bg: "bg-teal-500/[0.06]",   num: "text-teal-400",   dot: "#14b8a6" },
  { border: "border-amber-500/25",  bg: "bg-amber-500/[0.06]",  num: "text-amber-400",  dot: "#f59e0b" },
  { border: "border-green-500/25",  bg: "bg-green-500/[0.06]",  num: "text-green-400",  dot: "#22c55e" },
];

function MiniTimeline({ steps }: { steps: ShotPlanStep[] }) {
  function parseTime(t: string): number {
    const parts = t.split(":").map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] ?? 0;
  }

  const starts = steps.map((s) => parseTime(s.start));
  const ends = steps.map((s) => parseTime(s.end));
  const totalEnd = Math.max(...ends);
  if (totalEnd === 0) return null;

  return (
    <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-3">Timeline overview</p>
      <div className="relative h-6 w-full rounded-full bg-white/[0.05] overflow-hidden">
        {steps.map((step, i) => {
          const cfg = STEP_COLORS[i % STEP_COLORS.length];
          const left = (parseTime(step.start) / totalEnd) * 100;
          const width = ((parseTime(step.end) - parseTime(step.start)) / totalEnd) * 100;
          return (
            <div
              key={i}
              className="absolute top-0 bottom-0 rounded-sm flex items-center justify-center overflow-hidden"
              style={{ left: `${left}%`, width: `${Math.max(width, 2)}%`, background: cfg.dot + "40",
                borderRight: `1px solid ${cfg.dot}60` }}
            >
              <span className="text-[9px] font-extrabold" style={{ color: cfg.dot }}>{i + 1}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-white/20">{steps[0]?.start ?? "0:00"}</span>
        <span className="text-[9px] text-white/20">{steps[steps.length - 1]?.end ?? ""}</span>
      </div>
    </div>
  );
}

export function ShotPlanSection({ steps, preset }: ShotPlanSectionProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  if (!steps || steps.length === 0) return null;

  const presetLabel = PRESET_OPTIONS.find((p) => p.id === preset)?.label ?? "your edit";

  const copyPlan = () => {
    const text = steps
      .map((s, i) => `Step ${i + 1}: ${s.label} (${s.start}–${s.end})\n${s.visualPurpose}\n${s.explanation}`)
      .join("\n\n");
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 2000);
  };

  const copyStep = (step: ShotPlanStep, i: number) => {
    const text = `Step ${i + 1}: ${step.label} (${step.start}–${step.end}) — ${step.explanation}`;
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-teal-400/60 mb-1">
            How to cut it
          </p>
          <h2 className="font-display text-2xl font-extrabold text-white">Suggested shot plan</h2>
          <p className="mt-1 text-xs text-white/35">
            {steps.length} steps for a <strong className="text-white/60">{presetLabel}</strong>.
            Click any step to expand the full editing advice.
          </p>
        </div>
        <button onClick={copyPlan}
          className="shrink-0 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all"
          style={{
            borderColor: copyDone ? "rgba(20,184,166,0.5)" : "rgba(255,255,255,0.1)",
            background: copyDone ? "rgba(20,184,166,0.1)" : "rgba(255,255,255,0.04)",
            color: copyDone ? "#2dd4bf" : "rgba(255,255,255,0.4)",
          }}
        >
          {copyDone ? "✓ Copied!" : "Copy plan"}
        </button>
      </div>

      <MiniTimeline steps={steps} />

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/[0.06]" />

        <div className="space-y-3">
          {steps.map((step, i) => {
            const cfg = STEP_COLORS[i % STEP_COLORS.length];
            const isOpen = expanded === i;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                className="relative flex gap-4"
              >
                {/* Step number bubble */}
                <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-[#07040f] ${cfg.border}`}
                  style={{ boxShadow: isOpen ? `0 0 16px ${cfg.dot}40` : "none" }}>
                  <span className={`font-display text-sm font-extrabold ${cfg.num}`}>{i + 1}</span>
                </div>

                {/* Step card */}
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className={`flex-1 rounded-2xl border text-left transition-all ${cfg.border} ${cfg.bg}
                    hover:brightness-110 focus:outline-none`}
                >
                  <div className="flex items-start justify-between gap-2 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm font-extrabold text-white">{step.label}</p>
                      <p className={`text-xs font-semibold mt-0.5 ${cfg.num}`}>{step.visualPurpose}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-xs text-white/35">{step.start} – {step.end}</span>
                      <span className="text-white/25 text-xs">{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-white/[0.05] pt-3">
                          <p className="text-xs leading-5 text-white/60">{step.explanation}</p>
                          <button
                            onClick={(e) => { e.stopPropagation(); copyStep(step, i); }}
                            className="mt-3 text-[10px] font-semibold text-white/25 hover:text-white/50 transition-colors"
                          >
                            Copy this step
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
