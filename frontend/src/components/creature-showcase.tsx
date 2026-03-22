"use client";

import { useEffect, useState } from "react";
import { WaveBlob } from "@/components/creatures/WaveBlob";
import { SpaceDJ } from "@/components/creatures/SpaceDJ";
import { BeatGhost } from "@/components/creatures/BeatGhost";
import { MoodCat } from "@/components/creatures/MoodCat";
import { BeatBot } from "@/components/creatures/BeatBot";

const CREATURES = [
  { Component: WaveBlob,   bgFrom: "#7c2d12", bgTo: "#1c0a00", accent: "#f97316" },
  { Component: SpaceDJ,    bgFrom: "#2e1065", bgTo: "#0a0030", accent: "#a855f7" },
  { Component: BeatGhost,  bgFrom: "#701a75", bgTo: "#1a003a", accent: "#e879f9" },
  { Component: MoodCat,    bgFrom: "#78350f", bgTo: "#1c0a00", accent: "#fbbf24" },
  { Component: BeatBot,    bgFrom: "#134e4a", bgTo: "#00100f", accent: "#2dd4bf" },
];

const INTERVAL = 3800;

export function CreatureShowcase() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % CREATURES.length);
        setVisible(true);
      }, 500);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const current = CREATURES[active];

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-8 overflow-hidden">
      {/* Glow backdrop that changes colour with each creature */}
      <div
        className="absolute right-0 top-0 h-full w-1/2 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 70% 90% at 85% 50%, ${current.accent}22, transparent)`,
        }}
      />

      {/* Creature frame */}
      <div
        className="relative flex items-center justify-center transition-all duration-500"
        style={{
          width: 280,
          height: 280,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.96)",
          filter: `drop-shadow(0 0 40px ${current.accent}55)`,
        }}
      >
        {/* Pill bg behind the creature */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-30 transition-colors duration-700"
          style={{ background: `radial-gradient(circle, ${current.bgFrom}, ${current.bgTo})` }}
        />
        <div className="relative z-10 w-full h-full animate-float">
          <current.Component />
        </div>
      </div>

      {/* Dot nav */}
      <div className="absolute bottom-6 right-8 flex gap-2">
        {CREATURES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? 20 : 6,
              height: 6,
              backgroundColor: i === active ? current.accent : "rgba(255,255,255,0.18)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
