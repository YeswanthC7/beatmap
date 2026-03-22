"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCENES = [
  {
    id: "studio",
    label: "Creator studio",
    creature: "/creatures/producer.png",
    creatureName: "The Producer",
    creatureTag: "Studio session",
    accent: "#f97316",
    glow: "rgba(249,115,22,0.25)",
    heroBg: "from-[#130500] via-[#0d0300] to-[#07000e]",
    cardBg: "#1C1107",
    cardBorder: "rgba(249,115,22,0.25)",
    pills: ["Best cuts", "Shot plan", "Talk-over sections"],
  },
  {
    id: "trending",
    label: "Trending worldwide",
    creature: "/creatures/cyberdj.png",
    creatureName: "CyberDJ",
    creatureTag: "Drop incoming",
    accent: "#d946ef",
    glow: "rgba(217,70,239,0.25)",
    heroBg: "from-[#0d001a] via-[#0a0015] to-[#07000e]",
    cardBg: "#0D0018",
    cardBorder: "rgba(217,70,239,0.25)",
    pills: ["Worldwide trending", "8 languages", "Instant analysis"],
  },
  {
    id: "energy",
    label: "Short-form energy",
    creature: "/creatures/raver.png",
    creatureName: "The Raver",
    creatureTag: "Peak hours",
    accent: "#818cf8",
    glow: "rgba(129,140,248,0.25)",
    heroBg: "from-[#04002d] via-[#060018] to-[#07000e]",
    cardBg: "#080420",
    cardBorder: "rgba(129,140,248,0.25)",
    pills: ["Best 15s cut", "Opening hook", "Reel-ready"],
  },
  {
    id: "mood",
    label: "Mood arc",
    creature: "/creatures/jazzman.png",
    creatureName: "The Jazzman",
    creatureTag: "Late night vibes",
    accent: "#fbbf24",
    glow: "rgba(251,191,36,0.2)",
    heroBg: "from-[#120a00] via-[#0a0600] to-[#07000e]",
    cardBg: "#120A00",
    cardBorder: "rgba(251,191,36,0.25)",
    pills: ["Emotional arc", "Cinematic", "Storytelling"],
  },
];

interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  loading: boolean;
}

export function HeroSection({ onAnalyze, loading }: HeroSectionProps) {
  const [activeScene, setActiveScene] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [url, setUrl] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextScene = useCallback(() => {
    setPhase("out");
    setTimeout(() => {
      setActiveScene((prev) => (prev + 1) % SCENES.length);
      setPhase("in");
    }, 400);
  }, []);

  const startRotation = useCallback(() => {
    intervalRef.current = setInterval(nextScene, 5500);
  }, [nextScene]);

  useEffect(() => {
    startRotation();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startRotation]);

  const handleManualScene = (i: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("out");
    setTimeout(() => { setActiveScene(i); setPhase("in"); }, 300);
    startRotation();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = url.trim();
    if (!t) return;
    try { new URL(t); } catch { return; }
    onAnalyze(t);
  };

  const scene = SCENES[activeScene];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12 overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${scene.id}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className={`absolute inset-0 bg-gradient-to-br ${scene.heroBg}`}
        />
      </AnimatePresence>

      {/* Ambient glow from creature */}
      <div className="pointer-events-none absolute inset-0 transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse 70% 80% at 75% 55%, ${scene.glow}, transparent)` }} />

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {["🔥 Trending now", "✂️ Best cuts", "🎙 Talk-over sections", "⚖️ Compare songs"].map((pill) => (
            <span key={pill}
              className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/50 backdrop-blur-sm">
              {pill}
            </span>
          ))}
        </motion.div>

        {/* Main hero card */}
        <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/[0.07] shadow-2xl"
          style={{ minHeight: 540 }}>

          {/* Foreground overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />

          {/* ── Creature card (right side) ── */}
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 flex w-[45%] items-end justify-center pb-0 pr-6 lg:pr-10 z-20">
            <div
              className="relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 ease-out"
              style={{
                width: "clamp(180px, 26vw, 320px)",
                height: "clamp(260px, 52vh, 490px)",
                opacity: phase === "in" ? 1 : 0,
                transform: phase === "in"
                  ? "translateY(0) scale(1) rotate(-2deg)"
                  : "translateY(24px) scale(0.94) rotate(-2deg)",
                backgroundColor: scene.cardBg,
                border: `1.5px solid ${scene.cardBorder}`,
                boxShadow: `0 0 60px ${scene.glow}, 0 30px 90px rgba(0,0,0,0.7)`,
              }}
            >
              {/* Creature image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={scene.creature} alt={scene.creatureName}
                className="h-full w-full object-cover object-top block" />

              {/* Card footer */}
              <div className="absolute bottom-0 inset-x-0 px-4 py-3"
                style={{ background: `linear-gradient(to top, ${scene.cardBg}F0 60%, transparent)` }}>
                <p className="font-display text-[9px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: scene.accent }}>{scene.creatureTag}</p>
                <p className="font-display text-sm font-extrabold text-white/85 mt-0.5">{scene.creatureName}</p>
              </div>

              {/* Corner glow */}
              <div className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full blur-2xl opacity-40"
                style={{ background: scene.accent }} />
            </div>

            {/* Dot nav */}
            <div className="absolute bottom-5 flex gap-2">
              {SCENES.map((_, i) => (
                <button key={i} onClick={() => handleManualScene(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeScene ? 20 : 6,
                    height: 6,
                    background: i === activeScene ? scene.accent : "rgba(255,255,255,0.15)",
                    boxShadow: i === activeScene ? `0 0 8px ${scene.accent}` : "none",
                  }} />
              ))}
            </div>
          </div>

          {/* ── Text content (left) ── */}
          <div className="relative z-30 flex h-full flex-col justify-between p-8 md:p-12" style={{ minHeight: 540 }}>
            {/* Scene label */}
            <AnimatePresence mode="wait">
              <motion.div key={`label-${scene.id}`}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.35 }}
                className="flex items-center gap-2 w-fit rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 backdrop-blur-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ background: scene.accent }} />
                <span className="text-xs font-semibold text-white/60">{scene.label}</span>
              </motion.div>
            </AnimatePresence>

            {/* Heading + input */}
            <div className="mt-auto max-w-lg">
              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Find the best part{" "}
                <span className="gradient-text">of any song</span>{" "}
                for your video.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="mt-4 max-w-md text-sm leading-7 text-white/50"
              >
                Paste a link, choose what you're making, get the best cut and a simple edit plan.
              </motion.p>

              {/* Scene pills */}
              <AnimatePresence mode="wait">
                <motion.div key={`pills-${scene.id}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 flex flex-wrap gap-2"
                >
                  {scene.pills.map((p) => (
                    <span key={p} className="rounded-full border px-2.5 py-1 text-[10px] font-bold"
                      style={{ borderColor: `${scene.accent}40`, color: scene.accent, background: `${scene.accent}12` }}>
                      {p}
                    </span>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Quick input */}
              <motion.form
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <div className="relative flex-1">
                  <input
                    type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste a YouTube or SoundCloud link…"
                    disabled={loading}
                    className="w-full rounded-2xl border border-white/15 bg-white/[0.08] px-5 py-3.5 text-sm text-white placeholder-white/25 backdrop-blur-sm outline-none transition focus:border-violet-400/50 focus:bg-white/[0.12] focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
                  />
                </div>
                <button type="submit" disabled={loading || !url.trim()}
                  className="shrink-0 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition-all hover:scale-105 hover:shadow-violet-500/50 disabled:opacity-50 disabled:hover:scale-100">
                  {loading ? "Analysing…" : "Analyse →"}
                </button>
              </motion.form>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                className="mt-4 flex flex-wrap gap-4">
                <button onClick={() => document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-xs font-medium text-white/35 hover:text-white/65 transition-colors">
                  Explore trending tracks →
                </button>
                <button onClick={() => document.getElementById("compare")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-xs font-medium text-white/35 hover:text-white/65 transition-colors">
                  Compare 2 songs →
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
