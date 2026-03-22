"use client";

import type { EditPreset, ShotPlanStep } from "@/types/analysis";
import { PRESET_OPTIONS } from "@/types/analysis";

interface ShotPlanSectionProps {
  steps: ShotPlanStep[];
  preset: EditPreset;
}

const STEP_COLORS = [
  "border-orange-500/25 bg-orange-500/[0.06]",
  "border-pink-500/25 bg-pink-500/[0.06]",
  "border-purple-500/25 bg-purple-500/[0.06]",
  "border-blue-500/25 bg-blue-500/[0.06]",
  "border-teal-500/25 bg-teal-500/[0.06]",
  "border-amber-500/25 bg-amber-500/[0.06]",
  "border-green-500/25 bg-green-500/[0.06]",
];

const STEP_NUM_COLORS = [
  "text-orange-400", "text-pink-400", "text-purple-400",
  "text-blue-400", "text-teal-400", "text-amber-400", "text-green-400",
];

export function ShotPlanSection({ steps, preset }: ShotPlanSectionProps) {
  if (!steps || steps.length === 0) return null;

  const presetLabel = PRESET_OPTIONS.find((p) => p.id === preset)?.label ?? "your edit";

  const copyPlan = () => {
    const text = steps
      .map((s, i) => `${i + 1}. ${s.label} (${s.start}–${s.end}) — ${s.visualPurpose}\n   ${s.explanation}`)
      .join("\n\n");
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-teal-400/70 mb-1">
            How to cut your video
          </p>
          <h2 className="font-display text-xl font-extrabold text-white">Suggested shot plan</h2>
          <p className="mt-1 text-xs text-white/35">
            A simple sequence for a <strong className="text-white/60">{presetLabel}</strong> — what to show and when.
          </p>
        </div>
        <button
          onClick={copyPlan}
          className="shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/45 hover:text-white/70 transition-colors"
        >
          Copy plan
        </button>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/[0.06]" />
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="relative flex gap-4">
              <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-[#07040f] ${STEP_COLORS[i % STEP_COLORS.length]}`}>
                <span className={`font-display text-sm font-extrabold ${STEP_NUM_COLORS[i % STEP_NUM_COLORS.length]}`}>
                  {i + 1}
                </span>
              </div>
              <div className={`flex-1 rounded-2xl border p-4 ${STEP_COLORS[i % STEP_COLORS.length]}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-display text-sm font-extrabold text-white">{step.label}</p>
                  <span className="font-mono text-xs text-white/35 shrink-0">{step.start} – {step.end}</span>
                </div>
                <p className={`text-xs font-semibold mb-1.5 ${STEP_NUM_COLORS[i % STEP_NUM_COLORS.length]}`}>
                  {step.visualPurpose}
                </p>
                <p className="text-xs leading-5 text-white/50">{step.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
