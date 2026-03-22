"use client";

import { useCallback, useState } from "react";
import type { EditPreset, SongAnalysisResult } from "@/types/analysis";
import { analyzeAudio, analyzeSongLink, fetchAnalysisById } from "@/lib/api";
import { AnalysisResult } from "@/components/analysis-result";
import { CompareTracks } from "@/components/compare-tracks";
import { CreatureShowcase } from "@/components/creature-showcase";
import { EmptyState } from "@/components/empty-state";
import { HeroBackground } from "@/components/hero-background";
import { LinkInputForm } from "@/components/link-input-form";
import { MarqueeStrip } from "@/components/marquee-strip";
import { PresetSelector } from "@/components/preset-selector";
import { RecentAnalyses } from "@/components/recent-analyses";
import { Recorder } from "@/components/recorder";
import { ScrollingCards } from "@/components/scrolling-cards";
import { TrendingSection } from "@/components/trending-section";

type Tab = "link" | "mic" | "history";

const TAB_STYLES: Record<Tab, { active: string; icon: string }> = {
  link: {
    active: "bg-gradient-to-r from-orange-500/20 to-pink-500/20 border-orange-500/40 text-orange-200",
    icon: "🔗",
  },
  mic: {
    active: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-200",
    icon: "🎙",
  },
  history: {
    active: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-200",
    icon: "📂",
  },
};

export default function Home() {
  const [tab, setTab] = useState<Tab>("link");
  const [preset, setPreset] = useState<EditPreset>("general");
  const [result, setResult] = useState<SongAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [showCompare, setShowCompare] = useState(false);

  const handleLinkSubmit = useCallback(async (url: string) => {
    setLoading(true);
    setError("");
    setResult(null);
    setShowCompare(false);
    try {
      const data = await analyzeSongLink({ url, preset });
      setResult(data);
      setHistoryRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [preset]);

  const handleAudioReady = useCallback(async (file: File) => {
    setLoading(true);
    setError("");
    setResult(null);
    setShowCompare(false);
    try {
      const data = await analyzeAudio(file, preset);
      setResult(data);
      setHistoryRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Audio analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [preset]);

  const handleOpenHistory = useCallback(async (id: string) => {
    setLoading(true);
    setError("");
    setTab("link");
    setShowCompare(false);
    try {
      const data = await fetchAnalysisById(id);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not load analysis.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Called from the Trending section — auto-submit a track URL for analysis
  const handleTrendingAnalyze = useCallback((url: string) => {
    setTab("link");
    setShowCompare(false);
    handleLinkSubmit(url);
  }, [handleLinkSubmit]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "link", label: "Link" },
    { id: "mic", label: "Mic / Audio" },
    { id: "history", label: "History" },
  ];

  const isEmpty = !loading && !error && !result;
  const showScrollingCards = isEmpty && tab !== "history";
  const showTrending = isEmpty && tab !== "history" && !showCompare;

  return (
    <main className="min-h-screen text-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-screen flex flex-col justify-center">
        <HeroBackground />
        <CreatureShowcase />

        <div className="relative mx-auto w-full max-w-7xl px-6 pb-16 pt-16 sm:px-8 sm:pt-24">

          {/* Headline */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-orange-300 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              BeatMap
            </div>
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.05]">
              Turn any song into{" "}
              <span className="gradient-text">scene intelligence</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/55 sm:text-lg">
              Paste a YouTube or SoundCloud link — or record live — and get timestamped mood shifts, hook windows, voiceover gaps, and scene fits in seconds.
            </p>
          </div>

          {/* Input panel */}
          <div className="mt-10 max-w-2xl space-y-5">

            {/* Tab switcher */}
            <div className="flex gap-2 rounded-2xl border border-white/8 bg-white/[0.04] p-1.5 sm:inline-flex">
              {tabs.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-bold transition-all ${
                    tab === id
                      ? TAB_STYLES[id].active
                      : "border-transparent text-white/35 hover:text-white/60"
                  }`}
                >
                  <span>{TAB_STYLES[id].icon}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* Preset selector — show on link + mic tabs */}
            {(tab === "link" || tab === "mic") && !loading && (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                <PresetSelector value={preset} onChange={setPreset} />
              </div>
            )}

            {/* Compare toggle */}
            {tab === "link" && isEmpty && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCompare((v) => !v)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                    showCompare
                      ? "border-pink-500/40 bg-pink-500/15 text-pink-200"
                      : "border-white/10 bg-white/[0.04] text-white/40 hover:text-white/70"
                  }`}
                >
                  ⚖️ Compare multiple songs
                </button>
                {showCompare && (
                  <p className="text-xs text-white/30">
                    Find which song works best for your edit before committing.
                  </p>
                )}
              </div>
            )}

            {/* Compare panel */}
            {showCompare && tab === "link" && (
              <div className="rounded-3xl border border-pink-500/20 bg-pink-500/[0.04] p-6">
                <CompareTracks onClose={() => setShowCompare(false)} />
              </div>
            )}

            {/* Link input */}
            {tab === "link" && !showCompare && (
              <LinkInputForm onSubmit={handleLinkSubmit} loading={loading} />
            )}

            {/* Mic input */}
            {tab === "mic" && !loading && (
              <div className="rounded-3xl border border-purple-500/20 bg-purple-500/5 p-6">
                <p className="mb-4 text-sm text-white/45">
                  Record audio directly from your microphone for AI scene analysis.
                </p>
                <Recorder onAudioReady={handleAudioReady} loading={loading} />
              </div>
            )}

            {/* History */}
            {tab === "history" && (
              <div>
                <h2 className="font-display mb-4 text-sm font-bold uppercase tracking-widest text-amber-300/70">
                  Recent analyses
                </h2>
                <RecentAnalyses onOpen={handleOpenHistory} refreshKey={historyRefreshKey} />
              </div>
            )}

            {/* Loading spinner */}
            {loading && (
              <div className="flex flex-col items-center gap-5 py-16">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full animate-pulse-ring opacity-40"
                    style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}
                  />
                  <div
                    className="relative h-12 w-12 animate-spin rounded-full border-2 border-transparent"
                    style={{ borderTopColor: "#f97316", borderRightColor: "#ec4899" }}
                  />
                </div>
                <p className="text-sm font-medium text-white/40">
                  Analysing{tab === "mic" ? " your recording" : ""}…
                </p>
                <p className="text-xs text-white/20">
                  Getting mood shifts, best cuts, shot plan, and voiceover windows.
                </p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4">
                <p className="text-sm font-semibold text-red-300">{error}</p>
                <p className="mt-1 text-xs text-red-400/60">
                  Check that the backend is running and the link is a valid YouTube or SoundCloud URL.
                </p>
              </div>
            )}

            {/* Result */}
            {!loading && !error && result && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/30">
                    Analysis complete — scroll down for cuts, shot plan, and more.
                  </p>
                  <button
                    onClick={() => { setResult(null); setError(""); }}
                    className="text-xs text-white/25 hover:text-white/50 transition-colors"
                  >
                    ← Analyse another
                  </button>
                </div>
                <AnalysisResult result={result} />
              </div>
            )}

            {/* Empty state hint */}
            {isEmpty && tab !== "history" && !showCompare && <EmptyState />}
          </div>
        </div>
      </section>

      {/* ── Marquee strip ── */}
      <MarqueeStrip />

      {/* ── Scrolling card showcase (empty state only) ── */}
      {showScrollingCards && <ScrollingCards />}

      {/* ── Trending tracks section ── */}
      {showTrending && (
        <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
          <TrendingSection preset={preset} onAnalyze={handleTrendingAnalyze} />
        </section>
      )}
    </main>
  );
}
