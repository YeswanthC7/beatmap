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
    intervalRef.current = setInterval(
      () => setWordIdx((i) => (i + 1) % WORDS.length),
      2400
    );
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = url.trim();
    if (!t) return;
    try { new URL(t); } catch { return; }
    onAnalyze(t);
  };

  return (
    <header
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: "#0B0C10" }}
    >
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Character — right side */}
      <div
        className="pointer-events-none select-none absolute right-0 bottom-0 hidden lg:block animate-float"
        style={{ width: "clamp(180px, 22vw, 360px)", zIndex: 2, opacity: 0.85 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/creatures/cyberdj.png"
          alt=""
          style={{
            width: "100%",
            objectFit: "contain",
            objectPosition: "bottom",
            filter: "drop-shadow(0 0 30px rgba(204,255,0,0.2))",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 w-full max-w-6xl pt-28 pb-24">
        {/* Eyebrow */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px w-10" style={{ background: "#CCFF00" }} />
          <span
            className="font-body font-bold uppercase tracking-[0.25em] text-xs"
            style={{ color: "#CCFF00" }}
          >
            AI MUSIC INTELLIGENCE
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-display text-white leading-none uppercase"
          style={{
            fontSize: "clamp(3rem, 9vw, 8rem)",
            letterSpacing: "-0.02em",
            maxWidth: "15ch",
          }}
        >
          FIND THE{" "}
          <span
            className="font-display"
            style={{
              color: "#CCFF00",
              display: "inline-block",
              minWidth: "6ch",
              transition: "opacity 0.3s",
            }}
          >
            {WORDS[wordIdx]}
          </span>{" "}
          OF ANY SONG.
        </h1>

        {/* Sub */}
        <p
          className="font-body mt-5 mb-10 max-w-lg"
          style={{ color: "rgba(255,255,255,0.38)", lineHeight: 1.7, fontSize: 16 }}
        >
          Paste a YouTube or SoundCloud link. Pick your edit type.
          Get exact timestamps, best cuts, and a shot-by-shot plan.
        </p>

        {/* Input row */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-xl"
        >
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a YouTube or SoundCloud link…"
            disabled={loading}
            className="brutal-input flex-1 px-5 py-4 text-sm"
            style={{ fontSize: 14 }}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="font-display uppercase px-7 py-4 transition-all disabled:opacity-40 shrink-0"
            style={{
              background: "#CCFF00",
              color: "#000",
              fontSize: 18,
              letterSpacing: "0.04em",
            }}
            onMouseEnter={(e) =>
              !loading && (e.currentTarget.style.background = "rgba(204,255,0,0.8)")
            }
            onMouseLeave={(e) =>
              !loading && (e.currentTarget.style.background = "#CCFF00")
            }
          >
            {loading ? "ANALYSING…" : "ANALYSE →"}
          </button>
        </form>

        {/* Scroll hint */}
        <p
          className="font-body text-xs mt-8 uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Scroll to explore trending tracks ↓
        </p>
      </div>

      {/* Slim marquee strip */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden"
        style={{
          background: "rgba(204,255,0,0.08)",
          borderTop: "1px solid rgba(204,255,0,0.15)",
          height: 36,
        }}
      >
        <div className="marquee-track flex items-center h-full">
          {[...Array(12)].flatMap((_, i) => [
            <span
              key={`a${i}`}
              className="font-body font-bold text-xs mx-5 uppercase tracking-widest"
              style={{ color: "#CCFF00" }}
            >
              BEST CUTS
            </span>,
            <span
              key={`b${i}`}
              className="mx-3 text-xs"
              style={{ color: "rgba(204,255,0,0.3)" }}
            >
              ·
            </span>,
            <span
              key={`c${i}`}
              className="font-body font-bold text-xs mx-5 uppercase tracking-widest"
              style={{ color: "#CCFF00" }}
            >
              SHOT PLAN
            </span>,
            <span
              key={`d${i}`}
              className="mx-3 text-xs"
              style={{ color: "rgba(204,255,0,0.3)" }}
            >
              ·
            </span>,
            <span
              key={`e${i}`}
              className="font-body font-bold text-xs mx-5 uppercase tracking-widest"
              style={{ color: "#CCFF00" }}
            >
              HOOK DETECTION
            </span>,
            <span
              key={`f${i}`}
              className="mx-3 text-xs"
              style={{ color: "rgba(204,255,0,0.3)" }}
            >
              ·
            </span>,
            <span
              key={`g${i}`}
              className="font-body font-bold text-xs mx-5 uppercase tracking-widest"
              style={{ color: "#CCFF00" }}
            >
              TALK-OVER ZONES
            </span>,
            <span
              key={`h${i}`}
              className="mx-3 text-xs"
              style={{ color: "rgba(204,255,0,0.3)" }}
            >
              ·
            </span>,
          ])}
        </div>
      </div>
    </header>
  );
}
