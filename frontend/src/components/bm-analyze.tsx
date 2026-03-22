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
  { id: "link",    label: "PASTE LINK"     },
  { id: "mic",     label: "RECORD AUDIO"   },
  { id: "compare", label: "COMPARE SONGS"  },
  { id: "history", label: "SAVED"          },
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
    <section
      id="analyze"
      className="relative w-full py-24 px-8 md:px-16"
      style={{ background: "#0D0E13" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Section heading */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-px w-10" style={{ background: "#CCFF00" }} />
            <span
              className="font-body font-bold uppercase tracking-[0.25em] text-xs"
              style={{ color: "#CCFF00" }}
            >
              GET YOUR EDIT PLAN
            </span>
          </div>
          <h2
            className="font-display uppercase text-white leading-none"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", letterSpacing: "-0.02em" }}
          >
            ANALYSE A SONG
          </h2>
        </div>

        {/* Preset pills — compact scrollable row */}
        <div className="mb-8">
          <p
            className="font-body font-bold uppercase tracking-widest text-xs mb-3"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            VIDEO TYPE
          </p>
          <div className="flex flex-wrap gap-1.5">
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
        <div
          className="mb-6 flex border-b"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="relative font-body font-bold text-xs uppercase tracking-widest px-5 py-3 transition-colors"
              style={{
                color: tab === t.id ? "#CCFF00" : "rgba(255,255,255,0.3)",
              }}
            >
              {t.label}
              {tab === t.id && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: "#CCFF00" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            {tab === "link" && (
              <form onSubmit={onLinkSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="Paste a YouTube or SoundCloud link…"
                  disabled={loading}
                  className="brutal-input flex-1 px-5 py-4 text-sm"
                />
                <button
                  type="submit"
                  disabled={loading || !linkUrl.trim()}
                  className="font-display uppercase px-7 py-4 transition-all disabled:opacity-40 shrink-0"
                  style={{
                    background: "#CCFF00",
                    color: "#000",
                    fontSize: 18,
                    letterSpacing: "0.04em",
                  }}
                  onMouseEnter={(e) =>
                    !loading &&
                    (e.currentTarget.style.background = "rgba(204,255,0,0.8)")
                  }
                  onMouseLeave={(e) =>
                    !loading && (e.currentTarget.style.background = "#CCFF00")
                  }
                >
                  {loading ? "ANALYSING…" : "ANALYSE →"}
                </button>
              </form>
            )}

            {tab === "mic" && (
              <div
                className="p-6"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <p
                  className="font-body text-sm mb-4"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Record from your microphone for instant AI analysis.
                </p>
                <Recorder onAudioReady={onAudioReady} loading={loading} />
              </div>
            )}

            {tab === "compare" && (
              <div
                id="compare"
                className="p-6"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <CompareTracks onClose={() => setTab("link")} />
              </div>
            )}

            {tab === "history" && (
              <div
                className="p-5"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <RecentAnalysesSection refreshKey={historyKey} onOpen={onOpenHistory} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 flex flex-col items-center gap-5 py-12"
          >
            <p
              className="font-display text-2xl uppercase"
              style={{ color: "#CCFF00", letterSpacing: "0.05em" }}
            >
              ANALYSING…
            </p>
            <div
              className="w-48 h-px relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="absolute inset-y-0 left-0 w-1/2"
                style={{
                  background: "#CCFF00",
                  animation: "sweep 0.9s ease-in-out infinite alternate",
                }}
              />
            </div>
            <style>{`@keyframes sweep { from { left: -50%; } to { left: 100%; } }`}</style>
          </motion.div>
        )}

        {/* Error */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 px-5 py-4"
            style={{ border: "1px solid rgba(255,60,60,0.3)", background: "rgba(255,0,60,0.06)" }}
          >
            <p className="font-body text-sm" style={{ color: "#ff7070" }}>
              {error}
            </p>
          </motion.div>
        )}

        {/* Result */}
        {!loading && !error && result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 space-y-4"
          >
            <div className="flex justify-end">
              <button
                onClick={onClearResult}
                className="font-body text-xs uppercase tracking-widest transition-colors"
                style={{ color: "rgba(255,255,255,0.2)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#CCFF00")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.2)")
                }
              >
                ← Analyse another
              </button>
            </div>
            <AnalysisResult result={result} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
