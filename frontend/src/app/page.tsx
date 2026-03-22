"use client";

import { useCallback, useState } from "react";
import type { SongAnalysisResult } from "@/types/analysis";
import { analyzeAudio, analyzeSongLink, fetchAnalysisById } from "@/lib/api";
import { AnalysisResult } from "@/components/analysis-result";
import { EmptyState } from "@/components/empty-state";
import { LinkInputForm } from "@/components/link-input-form";
import { RecentAnalyses } from "@/components/recent-analyses";
import { Recorder } from "@/components/recorder";
import { SectionHeader } from "@/components/section-header";

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
  const [result, setResult] = useState<SongAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const handleLinkSubmit = useCallback(async (url: string) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await analyzeSongLink({ url });
      setResult(data);
      setHistoryRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAudioReady = useCallback(async (file: File) => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await analyzeAudio(file);
      setResult(data);
      setHistoryRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Audio analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpenHistory = useCallback(async (id: string) => {
    setLoading(true);
    setError("");
    setTab("link");
    try {
      const data = await fetchAnalysisById(id);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not load analysis.");
    } finally {
      setLoading(false);
    }
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "link", label: "Link" },
    { id: "mic", label: "Mic / Audio" },
    { id: "history", label: "History" },
  ];

  return (
    <main className="min-h-screen text-white">
      <section className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20">
        <SectionHeader
          eyebrow="BeatMap"
          title="Turn any song into scene-fit intelligence"
          description="Paste a song link or record live audio to generate timestamped mood shifts, hook windows, voiceover-safe sections, and creative use-case insights."
        />

        <div className="mt-12">
          <div className="mb-6 flex gap-2 rounded-2xl border border-white/8 bg-white/[0.04] p-1.5 sm:inline-flex">
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

          {tab === "link" && (
            <div className="mb-8">
              <LinkInputForm onSubmit={handleLinkSubmit} loading={loading} />
            </div>
          )}

          {tab === "mic" && !loading && (
            <div className="mb-8 rounded-3xl border border-purple-500/20 bg-purple-500/5 p-6">
              <p className="mb-4 text-sm text-white/45">
                Record audio directly from your microphone for AI scene analysis.
              </p>
              <Recorder onAudioReady={handleAudioReady} loading={loading} />
            </div>
          )}

          {tab === "history" && (
            <div className="mb-8">
              <h2 className="font-display mb-4 text-sm font-bold uppercase tracking-widest text-amber-300/70">
                Recent analyses
              </h2>
              <RecentAnalyses onOpen={handleOpenHistory} refreshKey={historyRefreshKey} />
            </div>
          )}

          {loading && (
            <div className="mb-8 flex flex-col items-center gap-5 py-16">
              <div className="relative">
                <div className="absolute inset-0 rounded-full animate-pulse-ring opacity-40"
                  style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }} />
                <div className="relative h-12 w-12 animate-spin rounded-full border-2 border-transparent"
                  style={{ borderTopColor: "#f97316", borderRightColor: "#ec4899" }} />
              </div>
              <p className="text-sm font-medium text-white/40">
                Analysing{tab === "mic" ? " your recording" : ""}…
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4">
              <p className="text-sm font-semibold text-red-300">{error}</p>
              <p className="mt-1 text-xs text-red-400/60">
                Check that the backend is running and the link is a valid YouTube or SoundCloud URL.
              </p>
            </div>
          )}

          {!loading && !error && result && <AnalysisResult result={result} />}

          {!loading && !error && !result && tab !== "history" && <EmptyState />}
        </div>
      </section>
    </main>
  );
}
