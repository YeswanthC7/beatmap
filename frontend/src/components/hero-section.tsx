"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCENES = [
  {
    id: "trending",
    label: "Trending worldwide",
    gradient: "from-[#0a0030] via-[#1a0050] to-[#0d001a]",
    accent: "#8b5cf6",
    visual: <TrendingScene />,
  },
  {
    id: "studio",
    label: "Creator studio",
    gradient: "from-[#000d2e] via-[#001a4d] to-[#000820]",
    accent: "#3b82f6",
    visual: <StudioScene />,
  },
  {
    id: "energy",
    label: "Short-form energy",
    gradient: "from-[#1a000d] via-[#2d0030] to-[#0d0020]",
    accent: "#ec4899",
    visual: <EnergyScene />,
  },
  {
    id: "mood",
    label: "Mood arc",
    gradient: "from-[#001a10] via-[#001a30] to-[#0a0020]",
    accent: "#06b6d4",
    visual: <MoodScene />,
  },
];

function TrendingScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Globe glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)" }} />
      {/* Track cards */}
      {[
        { top: "18%", left: "12%", title: "Blinding Lights", artist: "The Weeknd", delay: 0 },
        { top: "45%", left: "62%", title: "As It Was", artist: "Harry Styles", delay: 0.3 },
        { top: "68%", left: "22%", title: "Dynamite", artist: "BTS", delay: 0.6 },
        { top: "28%", right: "8%", title: "Anti-Hero", artist: "Taylor Swift", delay: 0.15 },
      ].map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{ delay: card.delay, duration: 0.6, y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute glass rounded-2xl px-3 py-2 backdrop-blur-xl"
          style={{ top: card.top, left: (card as any).left, right: (card as any).right }}
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs">🎵</div>
            <div>
              <p className="text-xs font-bold text-white leading-none">{card.title}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{card.artist}</p>
            </div>
          </div>
        </motion.div>
      ))}
      {/* Pulsing dots */}
      {[
        { top: "35%", left: "40%", color: "#8b5cf6" },
        { top: "55%", left: "55%", color: "#ec4899" },
        { top: "25%", left: "70%", color: "#06b6d4" },
      ].map((dot, i) => (
        <motion.div key={i} className="absolute h-2 w-2 rounded-full"
          style={{ top: dot.top, left: dot.left, background: dot.color,
            boxShadow: `0 0 12px ${dot.color}` }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function StudioScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Timeline bar */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-2 rounded-full"
        style={{ background: "linear-gradient(90deg, #8b5cf6, #ec4899, #f97316)", transformOrigin: "left" }}
      />
      {/* Timestamp chips */}
      {[
        { left: "15%", label: "Best cut", color: "#8b5cf6", top: "40%" },
        { left: "42%", label: "Talk here", color: "#06b6d4", top: "58%" },
        { left: "68%", label: "Big moment", color: "#ec4899", top: "40%" },
        { left: "85%", label: "End", color: "#f97316", top: "58%" },
      ].map((chip, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.15 }}
          className="absolute glass rounded-full px-2 py-1 text-[10px] font-bold"
          style={{ left: chip.left, top: chip.top, color: chip.color, border: `1px solid ${chip.color}40` }}
        >
          {chip.label}
        </motion.div>
      ))}
      {/* Floating panels */}
      <motion.div
        animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[8%] top-[20%] glass rounded-2xl p-4 w-44"
      >
        <p className="text-xs font-bold text-white mb-2">Best 15-second cut</p>
        <p className="font-mono text-sm font-bold text-violet-400">0:08 — 0:23</p>
        <div className="mt-2 h-1 rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
            initial={{ width: "0%" }} animate={{ width: "72%" }} transition={{ delay: 0.8, duration: 1 }} />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute left-[8%] bottom-[22%] glass rounded-2xl p-3 w-40"
      >
        <p className="text-[10px] text-white/40 mb-1">Talk-over window</p>
        <p className="font-mono text-sm font-bold text-cyan-400">0:34 — 0:48</p>
        <span className="mt-1 inline-block rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400">Great</span>
      </motion.div>
    </div>
  );
}

function EnergyScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Vertical video cards */}
      {[
        { left: "20%", scale: 0.9, gradient: "from-pink-500/30 to-purple-500/30", delay: 0 },
        { left: "42%", scale: 1.0, gradient: "from-violet-500/30 to-blue-500/30", delay: 0.1 },
        { left: "64%", scale: 0.85, gradient: "from-orange-500/30 to-pink-500/30", delay: 0.2 },
      ].map((card, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: card.delay, duration: 0.6 }}
          style={{ left: card.left, scale: card.scale }}
          className="absolute top-1/2 -translate-y-1/2 w-28 h-48 rounded-3xl glass overflow-hidden border border-white/10"
        >
          <div className={`h-full w-full bg-gradient-to-b ${card.gradient} flex flex-col items-center justify-end pb-4`}>
            {/* Mini waveform */}
            <div className="flex items-end gap-0.5 h-8">
              {[6, 12, 8, 16, 10, 14, 8, 12, 6].map((h, j) => (
                <div key={j} className="w-1 rounded-full bg-white/60"
                  style={{ height: h, animationDelay: `${j * 0.1}s` }} />
              ))}
            </div>
            <span className="mt-2 text-[9px] font-bold text-white/60">Hook: 0:04</span>
          </div>
        </motion.div>
      ))}
      {/* Burst sparks */}
      {[...Array(6)].map((_, i) => (
        <motion.div key={i}
          className="absolute h-1 w-1 rounded-full bg-pink-400"
          style={{ left: `${30 + i * 8}%`, top: `${40 + (i % 3) * 10}%` }}
          animate={{ scale: [0, 2, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function MoodScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Waveform gradient layers */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
        <motion.path
          d="M0,200 C100,160 200,240 300,200 C400,160 500,240 600,180 C700,120 800,200 800,200 L800,400 L0,400 Z"
          fill="rgba(139,92,246,0.08)"
          animate={{ d: [
            "M0,200 C100,160 200,240 300,200 C400,160 500,240 600,180 C700,120 800,200 800,200 L800,400 L0,400 Z",
            "M0,220 C100,180 200,260 300,220 C400,180 500,260 600,200 C700,140 800,220 800,220 L800,400 L0,400 Z",
            "M0,200 C100,160 200,240 300,200 C400,160 500,240 600,180 C700,120 800,200 800,200 L800,400 L0,400 Z",
          ]}}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,240 C150,200 250,280 400,240 C550,200 650,260 800,240 L800,400 L0,400 Z"
          fill="rgba(6,182,212,0.06)"
          animate={{ d: [
            "M0,240 C150,200 250,280 400,240 C550,200 650,260 800,240 L800,400 L0,400 Z",
            "M0,260 C150,220 250,300 400,260 C550,220 650,280 800,260 L800,400 L0,400 Z",
            "M0,240 C150,200 250,280 400,240 C550,200 650,260 800,240 L800,400 L0,400 Z",
          ]}}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </svg>
      {/* Segment markers */}
      {[
        { left: "15%", top: "30%", label: "Calm opening", color: "#06b6d4" },
        { left: "40%", top: "50%", label: "Building tension", color: "#8b5cf6" },
        { left: "68%", top: "28%", label: "Emotional peak", color: "#ec4899" },
      ].map((m, i) => (
        <motion.div key={i}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.25 }}
          className="absolute flex items-center gap-1.5"
          style={{ left: m.left, top: m.top }}
        >
          <div className="h-2 w-2 rounded-full" style={{ background: m.color, boxShadow: `0 0 8px ${m.color}` }} />
          <span className="text-[10px] font-semibold" style={{ color: m.color }}>{m.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

interface HeroSectionProps {
  onAnalyze: (url: string, preset?: string) => void;
  loading: boolean;
}

export function HeroSection({ onAnalyze, loading }: HeroSectionProps) {
  const [activeScene, setActiveScene] = useState(0);
  const [url, setUrl] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRotation = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % SCENES.length);
    }, 5500);
  }, []);

  useEffect(() => {
    startRotation();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startRotation]);

  const handleManualScene = (i: number) => {
    setActiveScene(i);
    if (intervalRef.current) clearInterval(intervalRef.current);
    startRotation();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    try { new URL(trimmed); } catch { return; }
    onAnalyze(trimmed);
  };

  const scene = SCENES[activeScene];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12 overflow-hidden">
      {/* Page-level background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full blur-[120px]"
          style={{ background: "rgba(139,92,246,0.12)" }} />
        <div className="absolute top-1/3 -right-20 h-72 w-72 rounded-full blur-[100px]"
          style={{ background: "rgba(236,72,153,0.09)" }} />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full blur-[100px]"
          style={{ background: "rgba(6,182,212,0.07)" }} />
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Helper pills */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
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

        {/* Cinematic hero container */}
        <div className="relative w-full rounded-[2.5rem] overflow-hidden border border-white/[0.08] shadow-2xl"
          style={{ minHeight: 520 }}>
          {/* Animated scene background */}
          <AnimatePresence mode="wait">
            <motion.div
              key={scene.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className={`absolute inset-0 bg-gradient-to-br ${scene.gradient}`}
            >
              {scene.visual}
            </motion.div>
          </AnimatePresence>

          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-12" style={{ minHeight: 520 }}>
            {/* Top: scene label */}
            <div className="flex items-center justify-between">
              <motion.div
                key={`label-${activeScene}`}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 backdrop-blur-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: scene.accent }} />
                <span className="text-xs font-semibold text-white/60">{scene.label}</span>
              </motion.div>
              {/* Scene dots */}
              <div className="flex gap-2">
                {SCENES.map((_, i) => (
                  <button key={i} onClick={() => handleManualScene(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === activeScene ? "w-6" : "w-1.5 bg-white/20"}`}
                    style={i === activeScene ? { background: scene.accent } : {}}
                  />
                ))}
              </div>
            </div>

            {/* Main heading */}
            <div className="mt-auto max-w-xl">
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
                className="mt-4 max-w-md text-base leading-7 text-white/55"
              >
                Paste a song link, choose what you're making, and BeatMap finds the best cut,
                the best part to talk over, and a simple edit plan — instantly.
              </motion.p>

              {/* Quick input */}
              <motion.form
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <div className="relative flex-1">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste a YouTube or SoundCloud link…"
                    disabled={loading}
                    className="w-full rounded-2xl border border-white/15 bg-white/[0.08] px-5 py-3.5 text-sm text-white placeholder-white/30 backdrop-blur-sm outline-none transition focus:border-violet-400/50 focus:bg-white/[0.12] focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="shrink-0 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition-all hover:scale-105 hover:shadow-violet-500/50 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? "Analysing…" : "Analyse →"}
                </button>
              </motion.form>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="mt-4 flex flex-wrap gap-3"
              >
                <button
                  onClick={() => document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-sm font-medium text-white/40 hover:text-white/70 transition-colors underline-offset-2 hover:underline"
                >
                  Explore trending tracks →
                </button>
                <button
                  onClick={() => document.getElementById("compare")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-sm font-medium text-white/40 hover:text-white/70 transition-colors underline-offset-2 hover:underline"
                >
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
