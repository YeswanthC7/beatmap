"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EditPreset, SongAnalysisResult } from "@/types/analysis";
import { analyzeAudio, analyzeSongLink, fetchAnalysisById } from "@/lib/api";

// Layout + sections
import { FloatingNav } from "@/components/floating-nav";
import { HeroSection } from "@/components/hero-section";
import { IntroSection } from "@/components/intro-section";
import { PresetSelector } from "@/components/preset-selector";
import { TrendingSection } from "@/components/trending-section";
import { ValueGrid } from "@/components/value-grid";
import { WorkflowSection } from "@/components/workflow-section";
import { ComparisonPreview } from "@/components/comparison-preview";
import { RecentAnalysesSection } from "@/components/recent-analyses-section";
import { FinalCTA } from "@/components/final-cta";
import { SiteFooter } from "@/components/site-footer";
import { MarqueeStrip } from "@/components/marquee-strip";

// App components
import { AnalysisResult } from "@/components/analysis-result";
import { Recorder } from "@/components/recorder";
import { CompareTracks } from "@/components/compare-tracks";

type Tab = "link" | "mic" | "compare" | "history";

function HistoryTabContent({ refreshKey, onOpen }: { refreshKey: number; onOpen: (id: string) => void }) {
  return (
    <div className="rounded-3xl border border-amber-500/20 bg-amber-500/[0.03] p-1">
      <RecentAnalysesSection refreshKey={refreshKey} onOpen={onOpen} />
      <div className="px-6 pb-6 text-center" id="history-empty">
        <p className="text-xs text-white/25">Your analysed tracks will appear here. Try a song to build your BeatMap library.</p>
      </div>
    </div>
  );
}

const TAB_CONFIG: Record<Tab, { icon: string; label: string; activeClass: string }> = {
  link:    { icon: "🔗", label: "Paste a link",      activeClass: "from-violet-500/20 to-pink-500/20 border-violet-500/40 text-violet-200" },
  mic:     { icon: "🎙️", label: "Record audio",       activeClass: "from-purple-500/20 to-blue-500/20 border-purple-500/40 text-purple-200" },
  compare: { icon: "⚖️", label: "Compare songs",      activeClass: "from-pink-500/20 to-rose-500/20 border-pink-500/40 text-pink-200" },
  history: { icon: "📂", label: "Recent analyses",    activeClass: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-200" },
};

export default function Home() {
  const [tab, setTab] = useState<Tab>("link");
  const [preset, setPreset] = useState<EditPreset>("general");
  const [result, setResult] = useState<SongAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [linkUrl, setLinkUrl] = useState("");

  const analyzeRef = useRef<HTMLElement>(null);

  const scrollToAnalyze = () => {
    analyzeRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLinkSubmit = useCallback(async (url: string) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await analyzeSongLink({ url, preset });
      setResult(data);
      setHistoryRefreshKey((k) => k + 1);
      setTimeout(() => analyzeRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [preset]);

  const handleHeroAnalyze = useCallback((url: string) => {
    setTab("link");
    setLinkUrl(url);
    scrollToAnalyze();
    handleLinkSubmit(url);
  }, [handleLinkSubmit]);

  const handleTrendingAnalyze = useCallback((url: string) => {
    setTab("link");
    setLinkUrl(url);
    scrollToAnalyze();
    handleLinkSubmit(url);
  }, [handleLinkSubmit]);

  const handleAudioReady = useCallback(async (file: File) => {
    setLoading(true);
    setError("");
    setResult(null);
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
    setResult(null);
    scrollToAnalyze();
    try {
      const data = await fetchAnalysisById(id);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not load analysis.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLinkFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = linkUrl.trim();
    if (!trimmed) return;
    try { new URL(trimmed); } catch { return; }
    handleLinkSubmit(trimmed);
  };

  return (
    <div className="min-h-screen text-white">
      {/* ── Floating nav ── */}
      <FloatingNav />

      {/* ── Hero ── */}
      <HeroSection onAnalyze={handleHeroAnalyze} loading={loading} />

      {/* ── Marquee ── */}
      <MarqueeStrip />

      {/* ── Intro / positioning ── */}
      <section id="intro">
        <IntroSection />
      </section>

      {/* ── Main analyze section ── */}
      <section id="analyze" ref={analyzeRef as React.RefObject<HTMLElement>} className="relative py-20 px-4 scroll-mt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-2xl"
          style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)" }} />

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-violet-300 mb-4">
              Analyze any song
            </span>
            <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
              Pick a song.{" "}
              <span className="gradient-text">Get your edit plan.</span>
            </h2>
            <p className="mt-3 text-sm text-white/40 max-w-md mx-auto">
              Paste a YouTube or SoundCloud link, choose your video type, and BeatMap does the rest.
            </p>
          </motion.div>

          {/* Preset selector */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5"
          >
            <PresetSelector value={preset} onChange={setPreset} />
          </motion.div>

          {/* Tab switcher */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-5 flex gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-1.5"
          >
            {(Object.entries(TAB_CONFIG) as [Tab, typeof TAB_CONFIG[Tab]][]).map(([id, cfg]) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all sm:px-5 ${
                  tab === id
                    ? `bg-gradient-to-r ${cfg.activeClass}`
                    : "border-transparent text-white/30 hover:text-white/60"
                }`}
              >
                <span className="hidden sm:inline">{cfg.icon}</span>
                <span>{cfg.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {tab === "link" && (
                <form onSubmit={handleLinkFormSubmit} className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="Paste a YouTube or SoundCloud link…"
                    disabled={loading}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white placeholder-white/25 outline-none transition focus:border-violet-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={loading || !linkUrl.trim()}
                    className="shrink-0 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                  >
                    {loading ? "Analysing…" : "Analyse →"}
                  </button>
                </form>
              )}

              {tab === "mic" && !loading && (
                <div className="rounded-3xl border border-purple-500/20 bg-purple-500/[0.04] p-6">
                  <p className="mb-4 text-sm text-white/45">
                    Record directly from your microphone for AI analysis.
                  </p>
                  <Recorder onAudioReady={handleAudioReady} loading={loading} />
                </div>
              )}

              {tab === "compare" && (
                <div className="rounded-3xl border border-pink-500/20 bg-pink-500/[0.03] p-6">
                  <CompareTracks onClose={() => setTab("link")} />
                </div>
              )}

              {tab === "history" && (
                <HistoryTabContent refreshKey={historyRefreshKey} onOpen={handleOpenHistory} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Loading state */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-8 flex flex-col items-center gap-5 py-14"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full animate-pulse-ring opacity-30"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }} />
                <div className="relative h-14 w-14 animate-spin rounded-full border-2 border-transparent"
                  style={{ borderTopColor: "#8b5cf6", borderRightColor: "#ec4899" }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white/60">Analysing your song…</p>
                <p className="mt-1 text-xs text-white/25">Finding best cuts, talking sections, and shot plan</p>
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {error && !loading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/[0.08] px-5 py-4"
            >
              <p className="text-sm font-semibold text-red-300">{error}</p>
              <p className="mt-1 text-xs text-red-400/50">
                Check that the link is a valid YouTube or SoundCloud URL and the backend is running.
              </p>
            </motion.div>
          )}

          {/* Result */}
          {!loading && !error && result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mt-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/25">
                  Analysis complete — scroll down for your full edit plan.
                </p>
                <button onClick={() => { setResult(null); setError(""); setLinkUrl(""); }}
                  className="text-xs text-white/25 hover:text-white/55 transition-colors">
                  ← Analyse another
                </button>
              </div>
              <AnalysisResult result={result} />
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Trending ── */}
      <TrendingSection preset={preset} onAnalyze={handleTrendingAnalyze} />

      {/* ── Value grid ── */}
      <ValueGrid />

      {/* ── Workflow ── */}
      <WorkflowSection />

      {/* ── Comparison preview ── */}
      <ComparisonPreview />

      {/* ── Recent analyses (only if history exists) ── */}
      <RecentAnalysesSection refreshKey={historyRefreshKey} onOpen={handleOpenHistory} />

      {/* ── Final CTA ── */}
      <FinalCTA />

      {/* ── Footer ── */}
      <SiteFooter />
    </div>
  );
}
