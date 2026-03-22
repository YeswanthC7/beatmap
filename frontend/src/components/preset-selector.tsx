"use client";

import { type EditPreset, PRESET_OPTIONS } from "@/types/analysis";

interface PresetSelectorProps {
  value: EditPreset;
  onChange: (preset: EditPreset) => void;
}

export function PresetSelector({ value, onChange }: PresetSelectorProps) {
  return (
    <div>
      <p className="mb-1 text-sm font-semibold text-white/70">
        What are you making?
      </p>
      <p className="mb-3 text-xs text-white/35">
        Choose your video type so BeatMap can suggest the best part of the song for it.
      </p>
      <div className="flex flex-wrap gap-2">
        {PRESET_OPTIONS.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              title={opt.hint}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                active
                  ? "border-orange-500/60 bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-200"
                  : "border-white/10 bg-white/[0.04] text-white/45 hover:border-white/20 hover:text-white/70"
              }`}
            >
              <span>{opt.icon}</span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
