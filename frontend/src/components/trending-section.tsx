"use client";

import { useCallback, useEffect, useState } from "react";
import type { EditPreset, TrendingLanguage, TrendingTrack } from "@/types/analysis";
import { fetchTrending } from "@/lib/api";

const LANG_TABS: { id: TrendingLanguage; label: string; flag: string }[] = [
  { id: "worldwide", label: "Worldwide", flag: "🌍" },
  { id: "english",   label: "English",   flag: "🇬🇧" },
  { id: "hindi",     label: "Hindi",     flag: "🇮🇳" },
  { id: "telugu",    label: "Telugu",    flag: "🇮🇳" },
  { id: "tamil",     label: "Tamil",     flag: "🇮🇳" },
  { id: "spanish",   label: "Spanish",   flag: "🇪🇸" },
  { id: "korean",    label: "Korean",    flag: "🇰🇷" },
  { id: "japanese",  label: "Japanese",  flag: "🇯🇵" },
];

const TREND_STYLE: Record<string, string> = {
  new:     "bg-green-500/15 text-green-300 border-green-500/30",
  rising:  "bg-orange-500/15 text-orange-300 border-orange-500/30",
  steady:  "bg-white/5 text-white/35 border-white/10",
};
const TREND_LABEL: Record<string, string> = {
  new: "New", rising: "Rising", steady: "",
};

interface TrendingSectionProps {
  preset: EditPreset;
  onAnalyze: (url: string) => void;
}

export function TrendingSection({ preset, onAnalyze }: TrendingSectionProps) {
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
    <div>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-orange-400/70 mb-1">
            Trending now
          </p>
          <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
            Popular songs people are using right now
          </h2>
          {cached && (
            <p className="mt-1 text-xs text-white/25">Showing curated popular picks</p>
          )}
        </div>
        {loading && (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-transparent shrink-0"
            style={{ borderTopColor: "#f97316" }} />
        )}
      </div>

      {/* Language tabs */}
      <div className="mb-5 flex gap-1.5 overflow-x-auto pb-1">
        {LANG_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setLang(tab.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
              lang === tab.id
                ? "border-orange-500/40 bg-orange-500/15 text-orange-200"
                : "border-white/10 bg-white/[0.04] text-white/40 hover:text-white/70"
            }`}
          >
            <span>{tab.flag}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4">
          <p className="text-sm text-red-300">{error}</p>
          <button
            onClick={() => load(lang)}
            className="ml-auto rounded-xl border border-red-400/30 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-500/10"
          >
            Retry
          </button>
        </div>
      )}

      {!error && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : tracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onAnalyze={() => onAnalyze(track.sourceUrl)}
                />
              ))}
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
      <div className="h-12 w-12 shrink-0 rounded-xl bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/4 rounded-full bg-white/10" />
        <div className="h-3 w-1/2 rounded-full bg-white/8" />
      </div>
    </div>
  );
}

function TrackCard({ track, onAnalyze }: { track: TrendingTrack; onAnalyze: () => void }) {
  const trendStyle = TREND_STYLE[track.trendLabel] ?? TREND_STYLE.steady;
  const trendLabel = TREND_LABEL[track.trendLabel];

  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3 transition-all hover:border-orange-500/20 hover:bg-orange-500/5">
      <span className="font-display w-6 shrink-0 text-center text-xs font-bold text-white/25">
        {track.rank}
      </span>

      {track.thumbnailUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={track.thumbnailUrl}
          alt={track.title}
          className="h-12 w-12 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl">
          🎵
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{track.title}</p>
        <p className="truncate text-xs text-white/45">{track.artist}</p>
        {trendLabel && (
          <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${trendStyle}`}>
            {trendLabel}
          </span>
        )}
      </div>

      <button
        onClick={onAnalyze}
        className="shrink-0 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-orange-500/20"
      >
        Analyse →
      </button>
    </div>
  );
}
