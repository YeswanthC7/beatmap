"use client";

import type { EditPreset } from "@/types/analysis";

interface Faction {
  id: EditPreset;
  name: string;
  tagline: string;
  accent: string;
  creature: string;
  bg: string;
}

const FACTIONS: Faction[] = [
  {
    id: "tiktok_short",
    name: "SHORT FORM",
    tagline: "Best 15–30s cut. Opening hook. Instant energy.",
    accent: "#CCFF00",
    creature: "/creatures/raver.png",
    bg: "rgba(204,255,0,0.06)",
  },
  {
    id: "emotional_story",
    name: "STORYTELLER",
    tagline: "Emotional arcs. Mood shifts. Cinematic pacing.",
    accent: "#66FCF1",
    creature: "/creatures/jazzman.png",
    bg: "rgba(102,252,241,0.05)",
  },
  {
    id: "gym_hype",
    name: "HYPE EDIT",
    tagline: "Hard drops. Peak energy. Driving rhythms.",
    accent: "#FF007F",
    creature: "/creatures/producer.png",
    bg: "rgba(255,0,127,0.06)",
  },
];

interface BmFactionsProps {
  onSelectPreset: (p: EditPreset) => void;
  activePreset: EditPreset;
}

export function BmFactions({ onSelectPreset, activePreset }: BmFactionsProps) {
  return (
    <section id="factions" className="w-full" style={{ background: "#0B0C10" }}>
      {/* Section header */}
      <div className="px-8 md:px-16 pt-20 pb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-px w-10" style={{ background: "rgba(255,255,255,0.2)" }} />
          <span
            className="font-body font-bold uppercase tracking-[0.25em] text-xs"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            WHAT ARE YOU MAKING?
          </span>
        </div>
        <h2
          className="font-display uppercase text-white leading-none"
          style={{ fontSize: "clamp(2rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
        >
          PICK A PRESET
        </h2>
      </div>

      {/* Panels */}
      <div
        className="w-full flex flex-col lg:flex-row"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          minHeight: 340,
        }}
      >
        {FACTIONS.map((f, idx) => {
          const isActive = activePreset === f.id;
          return (
            <div
              key={f.id}
              className="relative overflow-hidden cursor-pointer group transition-all duration-400"
              style={{
                flex: isActive ? "1.5" : "1",
                background: isActive ? f.bg : "transparent",
                borderRight:
                  idx < FACTIONS.length - 1
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "none",
                minHeight: 200,
                transition: "flex 0.4s ease, background 0.3s ease",
              }}
              onClick={() => {
                onSelectPreset(f.id);
                document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {/* Active top line */}
              {isActive && (
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: f.accent }}
                />
              )}

              {/* Character */}
              <div
                className="absolute bottom-0 right-4 h-[85%] pointer-events-none select-none"
                style={{ zIndex: 1 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.creature}
                  alt={f.name}
                  className="h-full object-contain object-bottom transition-all duration-500"
                  style={{
                    filter: `drop-shadow(0 0 20px ${f.accent}25)`,
                    opacity: isActive ? 0.9 : 0.4,
                    transform: isActive ? "scale(1.03)" : "scale(1)",
                  }}
                />
              </div>

              {/* Label */}
              <div className="absolute top-8 left-8 z-10">
                <p
                  className="font-display text-white uppercase"
                  style={{
                    fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)",
                    color: isActive ? f.accent : "rgba(255,255,255,0.6)",
                    transition: "color 0.3s",
                  }}
                >
                  {f.name}
                </p>
                <p
                  className="font-body text-sm mt-1.5"
                  style={{ color: "rgba(255,255,255,0.35)", maxWidth: "18ch" }}
                >
                  {f.tagline}
                </p>
              </div>

              {/* Hover overlay CTA */}
              <div
                className="absolute bottom-6 left-8 z-10 font-body font-bold text-xs uppercase tracking-widest px-4 py-2 transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                style={{
                  background: f.accent,
                  color: "#000",
                }}
              >
                SELECT →
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
