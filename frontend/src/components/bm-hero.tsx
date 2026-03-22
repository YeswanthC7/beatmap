"use client";

import { useEffect, useRef, useState } from "react";
import type { EditPreset } from "@/types/analysis";

const WORDS = ["BEST CUT", "HOOK MOMENT", "EDIT PLAN", "SHOT MAP", "TALK-OVER"];

interface BmHeroProps {
  onAnalyze: (url: string) => void;
  loading: boolean;
  preset: EditPreset;
}

export function BmHero({ onAnalyze, loading, preset }: BmHeroProps) {
  const [wordIdx, setWordIdx] = useState(0);
  const [url, setUrl] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setWordIdx((i) => (i + 1) % WORDS.length), 2400);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = url.trim();
    if (!t) return;
    try { new URL(t); } catch { return; }
    onAnalyze(t);
  };

  const scrollAnalyze = () => document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" });

  return (
    <header
      id="hero"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0B0C10" }}
    >
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(204,255,0,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(204,255,0,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Corner accents */}
      <div className="pointer-events-none absolute top-0 left-0 w-32 h-32"
        style={{ borderRight: "1px solid rgba(204,255,0,0.2)", borderBottom: "1px solid rgba(204,255,0,0.2)" }} />
      <div className="pointer-events-none absolute bottom-0 right-0 w-32 h-32"
        style={{ borderLeft: "1px solid rgba(204,255,0,0.2)", borderTop: "1px solid rgba(204,255,0,0.2)" }} />

      {/* Character — floating right side */}
      <div
        className="pointer-events-none select-none absolute right-0 bottom-0 hidden lg:block animate-float"
        style={{ width: "clamp(200px, 28vw, 420px)", zIndex: 2 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/creatures/cyberdj.png" alt=""
          style={{
            width: "100%", objectFit: "contain", objectPosition: "bottom",
            filter: "drop-shadow(0 0 40px rgba(204,255,0,0.35)) brightness(1.1)",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-start px-8 md:px-16 lg:px-24 w-full max-w-7xl pt-32 pb-20">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-12" style={{ background: "#CCFF00" }} />
          <span className="font-body font-bold uppercase tracking-[0.3em] text-xs" style={{ color: "#CCFF00" }}>
            AI MUSIC INTELLIGENCE
          </span>
        </div>

        {/* Massive headline */}
        <h1 className="font-display text-white text-shadow-brutal leading-none uppercase select-none"
          style={{ fontSize: "clamp(3.5rem, 11vw, 10rem)", letterSpacing: "-0.02em", maxWidth: "14ch" }}>
          FIND THE{" "}
          <span
            className="font-display"
            style={{
              color: "#CCFF00",
              display: "inline-block",
              minWidth: "6ch",
              transition: "opacity 0.25s",
            }}
          >
            {WORDS[wordIdx]}
          </span>{" "}
          OF ANY SONG.
        </h1>

        {/* Subtext */}
        <p className="font-body text-lg mt-6 mb-10 max-w-xl"
          style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
          Paste a YouTube or SoundCloud link. Pick your edit type.
          Get exact timestamps, best cuts, and a shot-by-shot plan.
        </p>

        {/* Input + CTA */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="PASTE A YOUTUBE OR SOUNDCLOUD LINK…"
            disabled={loading}
            className="brutal-input font-body flex-1 px-5 py-4 text-sm uppercase tracking-wider"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="font-display text-xl px-8 py-4 uppercase tracking-wider transition-all disabled:opacity-40"
            style={{ background: "#CCFF00", color: "#000", letterSpacing: "0.05em" }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#fff")}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#CCFF00")}
          >
            {loading ? "ANALYSING…" : "ANALYSE →"}
          </button>
        </form>

        {/* Quick nav links */}
        <div className="mt-8 flex flex-wrap gap-6">
          <button onClick={scrollAnalyze}
            className="font-body text-xs font-bold uppercase tracking-widest transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#CCFF00")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          >
            COMPARE SONGS →
          </button>
          <button onClick={() => document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" })}
            className="font-body text-xs font-bold uppercase tracking-widest transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#CCFF00")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          >
            EXPLORE TRENDING →
          </button>
        </div>
      </div>

      {/* Bottom marquee teaser */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden"
        style={{ background: "#CCFF00", height: 44 }}>
        <div className="marquee-track flex items-center h-full">
          {[...Array(8)].flatMap((_, i) => [
            <span key={`a${i}`} className="font-display text-black text-lg mx-6 uppercase">BEST CUTS</span>,
            <span key={`b${i}`} className="font-display text-black text-lg mx-6 uppercase">·</span>,
            <span key={`c${i}`} className="font-display text-black text-lg mx-6 uppercase">SHOT PLAN</span>,
            <span key={`d${i}`} className="font-display text-black text-lg mx-6 uppercase">·</span>,
            <span key={`e${i}`} className="font-display text-black text-lg mx-6 uppercase">TALK-OVER ZONES</span>,
            <span key={`f${i}`} className="font-display text-black text-lg mx-6 uppercase">·</span>,
            <span key={`g${i}`} className="font-display text-black text-lg mx-6 uppercase">HOOK DETECTION</span>,
            <span key={`h${i}`} className="font-display text-black text-lg mx-6 uppercase">·</span>,
          ])}
        </div>
      </div>
    </header>
  );
}
