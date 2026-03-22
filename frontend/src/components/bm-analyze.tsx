"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { EditPreset, SongAnalysisResult } from "@/types/analysis";
import { PRESET_OPTIONS } from "@/types/analysis";
import { Recorder } from "./recorder";
import { CompareTracks } from "./compare-tracks";
import { RecentAnalysesSection } from "./recent-analyses-section";
import { AnalysisResult } from "./analysis-result";

type Tab = "link" | "mic" | "compare" | "history";

const TABS: { id: Tab; label: string }[] = [
  { id: "link", label: "PASTE LINK" },
  { id: "mic", label: "RECORD AUDIO" },
  { id: "compare", label: "COMPARE SONGS" },
  { id: "history", label: "SAVED ANALYSES" },
];

interface BmAnalyzeProps {
  tab: Tab;
  setTab: (t: Tab) => void;
  preset: EditPreset;
  setPreset: (p: EditPreset) => void;
  linkUrl: string;
  setLinkUrl: (u: string) => void;
  loading: boolean;
  error: string;
  result: SongAnalysisResult | null;
  historyKey: number;
  onLinkSubmit: (e: React.FormEvent) => void;
  onAudioReady: (file: File) => void;
  onOpenHistory: (id: string) => void;
  onClearResult: () => void;
}

export function BmAnalyze({
  tab, setTab, preset, setPreset,
  linkUrl, setLinkUrl,
  loading, error, result, historyKey,
  onLinkSubmit, onAudioReady, onOpenHistory, onClearResult,
}: BmAnalyzeProps) {
  return (
    <section id="analyze" className="relative w-full py-24 px-8 md:px-16" style={{ background: "#0B0C10" }}>
      {/* Top rule */}
      <div className="w-full h-px mb-16" style={{ background: "#CCFF00", opacity: 0.2 }} />

      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-px w-12" style={{ background: "#CCFF00" }} />
            <span className="font-body font-bold uppercase tracking-[0.3em] text-xs" style={{ color: "#CCFF00" }}>
              GET YOUR EDIT PLAN
            </span>
          </div>
          <h2 className="font-display uppercase text-white leading-none"
            style={{ fontSize: "clamp(2rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}>
            ANALYSE A SONG
          </h2>
        </div>

        {/* Preset selector */}
        <div className="mb-8">
          <p className="font-body font-bold uppercase tracking-widest text-xs mb-3"
            style={{ color: "rgba(255,255,255,0.3)" }}>
            WHAT ARE YOU MAKING?
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setPreset(opt.id)}
                className={`preset-chip px-3 py-1.5${preset === opt.id ? " active" : ""}`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div className="mb-6 flex border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="font-display text-sm uppercase tracking-wider px-5 py-3 relative transition-colors"
              style={{ color: tab === t.id ? "#CCFF00" : "rgba(255,255,255,0.3)" }}
            >
              {t.label}
              {tab === t.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#CCFF00" }} />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}>

            {tab === "link" && (
              <form onSubmit={onLinkSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="PASTE A YOUTUBE OR SOUNDCLOUD LINK…"
                  disabled={loading}
                  className="brutal-input flex-1 px-5 py-4 text-sm uppercase tracking-wider"
                />
                <button
                  type="submit" disabled={loading || !linkUrl.trim()}
                  className="font-display text-xl px-8 py-4 uppercase transition-all disabled:opacity-40"
                  style={{ background: "#CCFF00", color: "#000" }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#fff")}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#CCFF00")}
                >
                  {loading ? "ANALYSING…" : "ANALYSE →"}
                </button>
              </form>
            )}

            {tab === "mic" && (
              <div className="border-2 p-6" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <p className="font-body text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                  RECORD FROM YOUR MICROPHONE FOR INSTANT AI ANALYSIS.
                </p>
                <Recorder onAudioReady={onAudioReady} loading={loading} />
              </div>
            )}

            {tab === "compare" && (
              <div id="compare" className="border-2 p-6" style={{ borderColor: "rgba(255,0,127,0.2)" }}>
                <CompareTracks onClose={() => setTab("link")} />
              </div>
            )}

            {tab === "history" && (
              <div className="border-2 p-5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <RecentAnalysesSection refreshKey={historyKey} onOpen={onOpenHistory} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-12 flex flex-col items-center gap-4 py-12">
            <div className="font-display text-3xl uppercase animate-pulse" style={{ color: "#CCFF00" }}>
              ANALYSING…
            </div>
            <div className="w-64 h-px relative overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="absolute inset-y-0 left-0 w-1/2"
                style={{
                  background: "#CCFF00",
                  animation: "loadBar 1s ease-in-out infinite alternate",
                }} />
            </div>
            <style>{`@keyframes loadBar { from { left: -50%; } to { left: 100%; } }`}</style>
          </motion.div>
        )}

        {/* Error */}
        {error && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-6 border-2 px-5 py-4" style={{ borderColor: "#FF003C", background: "rgba(255,0,60,0.07)" }}>
            <p className="font-body text-sm" style={{ color: "#ff6b6b" }}>{error}</p>
          </motion.div>
        )}

        {/* Result */}
        {!loading && !error && result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }} className="mt-8 space-y-4">
            <div className="flex justify-end">
              <button
                onClick={onClearResult}
                className="font-body text-xs uppercase tracking-widest transition-colors"
                style={{ color: "rgba(255,255,255,0.25)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#CCFF00")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
              >
                ← ANALYSE ANOTHER
              </button>
            </div>
            <AnalysisResult result={result} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
