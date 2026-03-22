"use client";

import type { EditPreset } from "@/types/analysis";

interface Faction {
  id: EditPreset;
  name: string;
  tagline: string;
  bg: string;
  creature: string;
  accent: string;
  clipClass: string;
}

const FACTIONS: Faction[] = [
  {
    id: "tiktok_short",
    name: "SHORT FORM",
    tagline: "Best 15–30s cut. Opening hook. Instant energy.",
    bg: "#FF003C",
    creature: "/creatures/raver.png",
    accent: "#CCFF00",
    clipClass: "clip-slant-right",
  },
  {
    id: "emotional_story",
    name: "STORYTELLER",
    tagline: "Emotional arcs. Mood shifts. Cinematic pacing.",
    bg: "#1F2833",
    creature: "/creatures/jazzman.png",
    accent: "#66FCF1",
    clipClass: "",
  },
  {
    id: "gym_hype",
    name: "HYPE EDIT",
    tagline: "Hard drops. Peak energy. Driving rhythms.",
    bg: "#FF007F",
    creature: "/creatures/producer.png",
    accent: "#CCFF00",
    clipClass: "clip-slant-left",
  },
];

interface BmFactionsProps {
  onSelectPreset: (p: EditPreset) => void;
  activePreset: EditPreset;
}

export function BmFactions({ onSelectPreset, activePreset }: BmFactionsProps) {
  return (
    <section id="factions" className="w-full" style={{ background: "#0B0C10" }}>
      {/* Heading */}
      <div className="px-8 md:px-16 py-16">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-px w-12" style={{ background: "#FF007F" }} />
          <span className="font-body font-bold uppercase tracking-[0.3em] text-xs" style={{ color: "#FF007F" }}>
            WHAT ARE YOU MAKING?
          </span>
        </div>
        <h2 className="font-display uppercase text-white leading-none"
          style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)", letterSpacing: "-0.02em" }}>
          PICK YOUR{" "}
          <span style={{ color: "#CCFF00" }}>PRESET</span>
        </h2>
      </div>

      {/* Faction panels */}
      <div className="w-full flex flex-col lg:flex-row" style={{ height: "clamp(400px, 60vh, 640px)" }}>
        {FACTIONS.map((f) => (
          <div
            key={f.id}
            className={`relative overflow-hidden cursor-pointer group transition-all duration-500 ${f.clipClass}`}
            style={{
              flex: activePreset === f.id ? "1.6" : "1",
              background: f.bg,
              minHeight: 180,
            }}
            onClick={() => { onSelectPreset(f.id); document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" }); }}
          >
            {/* Character */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[88%] pointer-events-none select-none"
              style={{ zIndex: 2 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.creature} alt={f.name}
                className="h-full object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                style={{ filter: `drop-shadow(0 0 30px ${f.accent}50)` }}
              />
            </div>

            {/* Label top */}
            <div className="absolute top-6 left-6 z-10">
              <p className="font-display text-white uppercase"
                style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)", letterSpacing: "0.02em" }}>
                {f.name}
              </p>
              <p className="font-body text-sm mt-1"
                style={{ color: "rgba(255,255,255,0.5)", maxWidth: "20ch" }}>
                {f.tagline}
              </p>
            </div>

            {/* Hover CTA */}
            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 px-6 py-2.5 font-body font-bold text-sm uppercase tracking-widest transition-all duration-300 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 whitespace-nowrap"
              style={{ background: f.accent, color: "#000" }}
            >
              SELECT PRESET →
            </div>

            {/* Active indicator */}
            {activePreset === f.id && (
              <div className="absolute top-0 left-0 right-0 h-1"
                style={{ background: f.accent }} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
