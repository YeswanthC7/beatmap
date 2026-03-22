"use client";

import { motion } from "framer-motion";
import { type EditPreset, PRESET_OPTIONS } from "@/types/analysis";

interface PresetSelectorProps {
  value: EditPreset;
  onChange: (preset: EditPreset) => void;
  compact?: boolean;
}

export function PresetSelector({ value, onChange, compact = false }: PresetSelectorProps) {
  return (
    <div>
      {!compact && (
        <div className="mb-4">
          <p className="font-display text-sm font-extrabold text-white mb-1">What are you making?</p>
          <p className="text-xs text-white/40">
            Choose your video type so BeatMap can suggest the best part of the song for it.
          </p>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {PRESET_OPTIONS.map((opt) => {
          const active = value === opt.id;
          return (
            <motion.button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              title={opt.hint}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                active
                  ? "border-violet-500/50 bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-violet-200 shadow-md shadow-violet-500/15"
                  : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/70"
              }`}
            >
              <span>{opt.icon}</span>
              {opt.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
