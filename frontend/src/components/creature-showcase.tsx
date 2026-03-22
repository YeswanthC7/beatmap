"use client";

import { useEffect, useState } from "react";

const SCENES = [
  {
    src: "/creatures/producer.png",
    name: "The Producer",
    tag: "Studio Session",
    cardBg: "#1C1107",
    cardBorder: "#f97316",
    accent: "#f97316",
    glow: "rgba(249,115,22,0.35)",
    heroWash: "radial-gradient(ellipse 90% 100% at 90% 60%, rgba(249,115,22,0.18) 0%, transparent 65%)",
  },
  {
    src: "/creatures/cyberdj.png",
    name: "CyberDJ",
    tag: "Drop Incoming",
    cardBg: "#0D0018",
    cardBorder: "#e879f9",
    accent: "#e879f9",
    glow: "rgba(232,121,249,0.35)",
    heroWash: "radial-gradient(ellipse 90% 100% at 90% 60%, rgba(232,121,249,0.18) 0%, transparent 65%)",
  },
  {
    src: "/creatures/jazzman.png",
    name: "The Jazzman",
    tag: "Late Night Vibes",
    cardBg: "#120A00",
    cardBorder: "#fbbf24",
    accent: "#fbbf24",
    glow: "rgba(251,191,36,0.35)",
    heroWash: "radial-gradient(ellipse 90% 100% at 90% 60%, rgba(251,191,36,0.15) 0%, transparent 65%)",
  },
  {
    src: "/creatures/lofi.png",
    name: "Lo-Fi Beatmaker",
    tag: "Chill Mode",
    cardBg: "#00120D",
    cardBorder: "#6ee7b7",
    accent: "#6ee7b7",
    glow: "rgba(110,231,183,0.30)",
    heroWash: "radial-gradient(ellipse 90% 100% at 90% 60%, rgba(110,231,183,0.13) 0%, transparent 65%)",
  },
  {
    src: "/creatures/raver.png",
    name: "The Raver",
    tag: "Peak Hours",
    cardBg: "#080420",
    cardBorder: "#818cf8",
    accent: "#818cf8",
    glow: "rgba(129,140,248,0.35)",
    heroWash: "radial-gradient(ellipse 90% 100% at 90% 60%, rgba(129,140,248,0.18) 0%, transparent 65%)",
  },
];

const INTERVAL = 4500;

export function CreatureShowcase() {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase("out");
      setTimeout(() => {
        setActive((a) => (a + 1) % SCENES.length);
        setPhase("in");
      }, 450);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const s = SCENES[active];

  return (
    <>
      {/* Subtle hero colour wash */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{ background: s.heroWash }}
      />

      {/* Right-side character column */}
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 flex w-[48%] items-center justify-center pr-6 lg:pr-10">

        {/* Floating card */}
        <div
          className="relative rounded-3xl transition-all duration-500 ease-out overflow-hidden shadow-2xl"
          style={{
            width: "clamp(200px, 30vw, 360px)",
            height: "clamp(280px, 55vh, 520px)",
            opacity: phase === "in" ? 1 : 0,
            transform: phase === "in"
              ? "translateY(0) scale(1) rotate(-1.5deg)"
              : "translateY(20px) scale(0.96) rotate(-1.5deg)",
            backgroundColor: s.cardBg,
            border: `2px solid ${s.cardBorder}22`,
            boxShadow: `0 0 60px ${s.glow}, 0 24px 80px rgba(0,0,0,0.6)`,
          }}
        >
          {/* Character fills card */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.src}
            alt={s.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              display: "block",
            }}
          />

          {/* Card footer */}
          <div
            className="absolute bottom-0 inset-x-0 px-4 py-3"
            style={{
              background: `linear-gradient(to top, ${s.cardBg}EE 60%, transparent)`,
            }}
          >
            <p
              className="font-display text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: s.accent }}
            >
              {s.tag}
            </p>
            <p className="font-display text-base font-extrabold text-white/85 mt-0.5">
              {s.name}
            </p>
          </div>

          {/* Accent corner glow */}
          <div
            className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl"
            style={{ backgroundColor: s.accent, opacity: 0.25 }}
          />
        </div>

        {/* Dot nav below the card */}
        <div className="absolute bottom-6 flex items-center gap-2.5">
          {SCENES.map((sc, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? 22 : 6,
                height: 6,
                backgroundColor: i === active ? s.accent : "rgba(255,255,255,0.15)",
                boxShadow: i === active ? `0 0 8px ${s.accent}` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
