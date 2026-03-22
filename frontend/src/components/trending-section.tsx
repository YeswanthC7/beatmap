"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EditPreset, TrendingLanguage, TrendingTrack } from "@/types/analysis";
import { fetchTrending } from "@/lib/api";
import { useInView } from "framer-motion";
import { useRef } from "react";

const LANG_TABS: { id: TrendingLanguage; label: string; flag: string }[] = [
  { id: "worldwide", label: "Worldwide", flag: "🌍" },
  { id: "english",   label: "English",  flag: "🇬🇧" },
  { id: "hindi",     label: "Hindi",    flag: "🇮🇳" },
  { id: "telugu",    label: "Telugu",   flag: "🇮🇳" },
  { id: "tamil",     label: "Tamil",    flag: "🇮🇳" },
  { id: "spanish",   label: "Spanish",  flag: "🇪🇸" },
  { id: "korean",    label: "Korean",   flag: "🇰🇷" },
  { id: "japanese",  label: "Japanese", flag: "🇯🇵" },
];

const TREND_BADGE: Record<string, { label: string; style: string }> = {
  new:    { label: "New",     style: "bg-green-500/15 text-green-300 border-green-500/25" },
  rising: { label: "Rising",  style: "bg-orange-500/15 text-orange-300 border-orange-500/25" },
  steady: { label: "Popular", style: "bg-violet-500/10 text-violet-300/60 border-violet-500/15" },
};

const RANK_COLORS = [
  "text-yellow-400",
  "text-slate-300",
  "text-amber-600",
];

interface TrendingSectionProps {
  preset: EditPreset;
  onAnalyze: (url: string) => void;
}

export function TrendingSection({ preset, onAnalyze }: TrendingSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [lang, setLang] = useState<TrendingLanguage>("worldwide");
  const [tracks, setTracks] = useState<TrendingTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cached, setCached] = useState(false);

  const load = useCallback(async (l: TrendingLanguage) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTrending(l, 10);
      setTracks(data.tracks);
      setCached(data.cached);
    } catch {
      setError("Couldn't load trending songs right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(lang); }, [lang, load]);

  return (
    <section id="trending" ref={ref} className="relative py-24 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-2xl"
        style={{ background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.3), transparent)" }} />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-300 mb-3">
              🔥 Trending now
            </span>
            <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
              Popular songs people are{" "}
              <span className="gradient-text">using right now</span>
            </h2>
            <p className="mt-2 text-sm text-white/40">
              Pick one and analyze it instantly.
              {cached && " · Showing curated picks"}
            </p>
          </div>
          {loading && (
            <div className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-transparent"
              style={{ borderTopColor: "#f97316" }} />
          )}
        </motion.div>

        {/* Language tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-8 flex gap-2 overflow-x-auto pb-2"
        >
          {LANG_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setLang(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                lang === tab.id
                  ? "border-orange-500/40 bg-orange-500/15 text-orange-200"
                  : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {tab.flag} {tab.label}
            </button>
          ))}
        </motion.div>

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4">
            <p className="text-sm text-red-300">{error}</p>
            <button onClick={() => load(lang)} className="text-xs font-bold text-red-300 hover:text-red-200">
              Retry
            </button>
          </div>
        )}

        {/* Track grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex animate-pulse items-center gap-3 rounded-3xl border border-white/[0.05] bg-white/[0.02] p-4">
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 rounded-full bg-white/10" />
                    <div className="h-3 w-1/2 rounded-full bg-white/[0.07]" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div key={lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-3 sm:grid-cols-2">
              {tracks.map((track, i) => {
                const badge = TREND_BADGE[track.trendLabel] ?? TREND_BADGE.steady;
                return (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    whileHover={{ y: -3, transition: { duration: 0.15 } }}
                    className="group relative flex items-center gap-4 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-orange-500/20 hover:bg-orange-500/[0.04] cursor-default"
                  >
                    {/* Rank */}
                    <span className={`font-display w-7 shrink-0 text-center text-sm font-extrabold ${RANK_COLORS[track.rank - 1] ?? "text-white/20"}`}>
                      {track.rank <= 3 ? ["🥇","🥈","🥉"][track.rank - 1] : track.rank}
                    </span>

                    {/* Artwork */}
                    {track.thumbnailUrl ? (
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={track.thumbnailUrl} alt={track.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-pink-500/30 text-xl border border-white/10">
                        🎵
                      </div>
                    )}

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{track.title}</p>
                      <p className="truncate text-xs text-white/40">{track.artist}</p>
                      {track.trendLabel !== "steady" && (
                        <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.style}`}>
                          {badge.label}
                        </span>
                      )}
                    </div>

                    {/* Analyze button */}
                    <button
                      onClick={() => onAnalyze(track.sourceUrl)}
                      className="shrink-0 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-orange-500/20 hover:scale-105"
                    >
                      Analyse →
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
