"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EditPreset, ShotPlanStep } from "@/types/analysis";
import { PRESET_OPTIONS } from "@/types/analysis";

interface ShotPlanSectionProps {
  steps: ShotPlanStep[];
  preset: EditPreset;
}

const STEP_ACCENTS = ["#CCFF00", "#FF007F", "#66FCF1", "#FF003C", "#FFB800", "#CCFF00", "#FF007F"];

function parseTime(t: string): number {
  const parts = t.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] ?? 0;
}

function MiniTimeline({ steps }: { steps: ShotPlanStep[] }) {
  const ends = steps.map((s) => parseTime(s.end));
  const totalEnd = Math.max(...ends);
  if (totalEnd === 0) return null;

  return (
    <div className="mb-6 p-4" style={{ border: "2px solid rgba(255,255,255,0.07)" }}>
      <p className="font-body font-bold text-[10px] uppercase tracking-widest mb-3"
        style={{ color: "rgba(255,255,255,0.25)" }}>
        TIMELINE OVERVIEW
      </p>
      <div className="relative h-5 w-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
        {steps.map((step, i) => {
          const accent = STEP_ACCENTS[i % STEP_ACCENTS.length];
          const left = (parseTime(step.start) / totalEnd) * 100;
          const width = ((parseTime(step.end) - parseTime(step.start)) / totalEnd) * 100;
          return (
            <div key={i} className="absolute top-0 bottom-0 flex items-center justify-center overflow-hidden"
              style={{
                left: `${left}%`, width: `${Math.max(width, 2)}%`,
                background: accent + "30",
                borderRight: `1px solid ${accent}50`,
              }}>
              <span className="font-display text-[9px]" style={{ color: accent }}>{i + 1}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="font-body text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
          {steps[0]?.start ?? "0:00"}
        </span>
        <span className="font-body text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
          {steps[steps.length - 1]?.end ?? ""}
        </span>
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
          <h2 className="font-display text-2xl uppercase text-white mb-1" style={{ letterSpacing: "0.02em" }}>
            SHOT PLAN
          </h2>
          <p className="font-body text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {steps.length} STEPS FOR A <span className="font-bold text-white/60 uppercase">{presetLabel}</span>.
            CLICK ANY STEP TO EXPAND EDITING NOTES.
          </p>
        </div>
        <button onClick={copyPlan}
          className="shrink-0 font-body font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 transition-all"
          style={{
            border: `2px solid ${copyDone ? "#CCFF00" : "rgba(255,255,255,0.15)"}`,
            background: copyDone ? "#CCFF00" : "transparent",
            color: copyDone ? "#000" : "rgba(255,255,255,0.4)",
          }}
        >
          {copyDone ? "✓ COPIED" : "COPY PLAN"}
        </button>
      </div>

      <MiniTimeline steps={steps} />

      <div className="space-y-2">
        {steps.map((step, i) => {
          const accent = STEP_ACCENTS[i % STEP_ACCENTS.length];
          const isOpen = expanded === i;

          return (
            <motion.div key={i}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              className="flex gap-3"
            >
              {/* Number */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center font-display text-sm"
                style={{
                  border: `2px solid ${accent}40`,
                  color: accent,
                  background: isOpen ? accent + "15" : "transparent",
                  boxShadow: isOpen ? `0 0 16px ${accent}30` : "none",
                  transition: "all 0.2s",
                }}>
                {i + 1}
              </div>

              {/* Card */}
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="flex-1 text-left transition-all"
                style={{
                  border: `2px solid ${isOpen ? accent + "40" : "rgba(255,255,255,0.07)"}`,
                  background: isOpen ? accent + "08" : "transparent",
                }}
              >
                <div className="flex items-start justify-between gap-2 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-body font-bold text-sm text-white">{step.label}</p>
                    <p className="font-body text-xs mt-0.5" style={{ color: accent + "bb" }}>
                      {step.visualPurpose}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-body text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {step.start} – {step.end}
                    </span>
                    <span className="font-body text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <p className="font-body text-xs leading-5" style={{ color: "rgba(255,255,255,0.55)" }}>
                          {step.explanation}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); copyStep(step, i); }}
                          className="mt-3 font-body font-bold text-[10px] uppercase tracking-widest transition-colors"
                          style={{ color: "rgba(255,255,255,0.2)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#CCFF00")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
                        >
                          COPY STEP
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
  );
}
