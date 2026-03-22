"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import type { EditPreset, TrendingLanguage, TrendingTrack } from "@/types/analysis";
import { fetchTrending } from "@/lib/api";

const LANG_TABS: { id: TrendingLanguage; label: string; flag: string }[] = [
  { id: "worldwide", label: "WORLDWIDE", flag: "🌍" },
  { id: "english",   label: "ENGLISH",  flag: "🇬🇧" },
  { id: "hindi",     label: "HINDI",    flag: "🇮🇳" },
  { id: "telugu",    label: "TELUGU",   flag: "🇮🇳" },
  { id: "tamil",     label: "TAMIL",    flag: "🇮🇳" },
  { id: "spanish",   label: "SPANISH",  flag: "🇪🇸" },
  { id: "korean",    label: "KOREAN",   flag: "🇰🇷" },
  { id: "japanese",  label: "JAPANESE", flag: "🇯🇵" },
];

const RANK_MEDAL = ["🥇", "🥈", "🥉"];

interface BmTrendingProps {
  preset: EditPreset;
  onAnalyze: (url: string) => void;
}

export function BmTrending({ preset, onAnalyze }: BmTrendingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [lang, setLang] = useState<TrendingLanguage>("worldwide");
  const [tracks, setTracks] = useState<TrendingTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (l: TrendingLanguage) => {
    setLoading(true); setError("");
    try {
      const data = await fetchTrending(l, 10);
      setTracks(data.tracks);
    } catch {
      setError("Couldn't load trending songs right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(lang); }, [lang, load]);

  return (
    <section id="trending" ref={ref} className="relative w-full py-24 px-8 md:px-16"
      style={{ background: "#1F2833" }}>

      {/* Heading */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="h-px w-12" style={{ background: "#66FCF1" }} />
          <span className="font-body font-bold uppercase tracking-[0.3em] text-xs" style={{ color: "#66FCF1" }}>
            🔥 LIVE CHARTS
          </span>
        </div>
        <h2 className="font-display uppercase text-white leading-none"
          style={{ fontSize: "clamp(2rem, 7vw, 6rem)", letterSpacing: "-0.02em" }}>
          TRENDING{" "}
          <span style={{ color: "#CCFF00" }}>RIGHT NOW</span>
        </h2>
        <p className="font-body mt-2" style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
          PICK ONE AND ANALYSE IT INSTANTLY.
        </p>
      </div>

      {/* Language tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {LANG_TABS.map((t) => (
          <button key={t.id} onClick={() => setLang(t.id)}
            className="font-body font-bold text-xs uppercase tracking-widest px-3 py-2 transition-all"
            style={{
              border: `2px solid ${lang === t.id ? "#CCFF00" : "rgba(255,255,255,0.15)"}`,
              background: lang === t.id ? "#CCFF00" : "transparent",
              color: lang === t.id ? "#000" : "rgba(255,255,255,0.4)",
            }}
          >
            {t.flag} {t.label}
          </button>
        ))}
        {loading && (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-transparent animate-spin rounded-full"
              style={{ borderTopColor: "#CCFF00" }} />
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 border-2 px-4 py-3 flex justify-between"
          style={{ borderColor: "#FF003C", background: "rgba(255,0,60,0.07)" }}>
          <p className="font-body text-sm" style={{ color: "#ff6b6b" }}>{error}</p>
          <button onClick={() => load(lang)}
            className="font-body font-bold text-xs uppercase" style={{ color: "#FF003C" }}>RETRY</button>
        </div>
      )}

      {/* Track grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 animate-pulse"
                style={{ border: "2px solid rgba(255,255,255,0.05)" }}>
                <div className="h-14 w-14 shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <div className="h-3 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div key={lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid gap-3 sm:grid-cols-2">
            {tracks.map((track, i) => (
              <motion.div key={track.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group flex items-center gap-4 p-4 cursor-default transition-all"
                style={{ border: "2px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#CCFF00")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
              >
                {/* Rank */}
                <span className="font-display text-base w-7 text-center shrink-0"
                  style={{ color: i < 3 ? "#CCFF00" : "rgba(255,255,255,0.2)" }}>
                  {i < 3 ? RANK_MEDAL[i] : i + 1}
                </span>

                {/* Artwork */}
                {track.thumbnailUrl ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={track.thumbnailUrl} alt={track.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center text-xl"
                    style={{ background: "#0B0C10" }}>🎵</div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-body font-bold text-sm text-white truncate">{track.title}</p>
                  <p className="font-body text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {track.artist}
                  </p>
                  {track.trendLabel === "new" && (
                    <span className="font-body font-bold text-[10px] uppercase"
                      style={{ color: "#CCFF00" }}>NEW ↑</span>
                  )}
                  {track.trendLabel === "rising" && (
                    <span className="font-body font-bold text-[10px] uppercase"
                      style={{ color: "#FF007F" }}>RISING ↑</span>
                  )}
                </div>

                {/* Analyse button */}
                <button
                  onClick={() => onAnalyze(track.sourceUrl)}
                  className="shrink-0 font-display text-xs uppercase px-3 py-2 opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background: "#CCFF00", color: "#000", letterSpacing: "0.05em" }}
                >
                  ANALYSE →
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
