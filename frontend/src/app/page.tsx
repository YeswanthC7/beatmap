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
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16">
        <SectionHeader
          eyebrow="BeatMap"
          title="Turn any song into scene-fit intelligence"
          description="Paste a song link or record live audio to generate timestamped mood shifts, hook windows, voiceover-safe sections, and creative use-case insights."
        />

        <div className="mt-10">
          <div className="mb-6 flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1 sm:inline-flex">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
                  tab === id
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
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
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="mb-4 text-sm text-white/50">
                Record audio directly from your microphone for AI scene analysis.
              </p>
              <Recorder onAudioReady={handleAudioReady} loading={loading} />
            </div>
          )}

          {tab === "history" && (
            <div className="mb-8">
              <h2 className="mb-4 text-sm font-medium text-white/60">Recent analyses</h2>
              <RecentAnalyses onOpen={handleOpenHistory} refreshKey={historyRefreshKey} />
            </div>
          )}

          {loading && (
            <div className="mb-8 flex flex-col items-center gap-4 py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />
              <p className="text-sm text-white/50">Analysing{tab === "mic" ? " your recording" : ""}…</p>
            </div>
          )}

          {error && !loading && (
            <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4">
              <p className="text-sm font-medium text-red-300">{error}</p>
              <p className="mt-1 text-xs text-red-400/70">
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
