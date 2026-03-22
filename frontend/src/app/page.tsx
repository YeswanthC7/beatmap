"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { EditPreset, SongAnalysisResult } from "@/types/analysis";
import { analyzeAudio, analyzeSongLink, fetchAnalysisById } from "@/lib/api";

import { BmLoader } from "@/components/bm-loader";
import { BmNav } from "@/components/bm-nav";
import { BmProgress } from "@/components/bm-progress";
import { BmHero } from "@/components/bm-hero";
import { BmFactions } from "@/components/bm-factions";
import { BmAnalyze } from "@/components/bm-analyze";
import { BmTrending } from "@/components/bm-trending";
import { BmFaq } from "@/components/bm-faq";
import { BmFooter } from "@/components/bm-footer";

type Tab = "link" | "mic" | "compare" | "history";

export default function Home() {
  const [tab, setTab] = useState<Tab>("link");
  const [preset, setPreset] = useState<EditPreset>("general");
  const [result, setResult] = useState<SongAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historyKey, setHistoryKey] = useState(0);
  const [linkUrl, setLinkUrl] = useState("");

  const analyzeRef = useRef<HTMLElement>(null);
  const scrollToAnalyze = () =>
    document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" });

  /* ── Reveal-on-scroll observer ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-revealed");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleLinkSubmit = useCallback(async (url: string) => {
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await analyzeSongLink({ url, preset });
      setResult(data);
      setHistoryKey((k) => k + 1);
      setTimeout(scrollToAnalyze, 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  }, [preset]);

  const handleHeroAnalyze = useCallback((url: string) => {
    setTab("link"); setLinkUrl(url);
    scrollToAnalyze();
    handleLinkSubmit(url);
  }, [handleLinkSubmit]);

  const handlePresetChange = useCallback((p: EditPreset) => {
    setPreset(p);
  }, []);

  const handleAudioReady = useCallback(async (file: File) => {
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await analyzeAudio(file, preset);
      setResult(data); setHistoryKey((k) => k + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Audio analysis failed.");
    } finally { setLoading(false); }
  }, [preset]);

  const handleOpenHistory = useCallback(async (id: string) => {
    setLoading(true); setError(""); setResult(null);
    setTab("link"); scrollToAnalyze();
    try { setResult(await fetchAnalysisById(id)); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Could not load analysis."); }
    finally { setLoading(false); }
  }, []);

  const handleLinkFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = linkUrl.trim();
    if (!t) return;
    try { new URL(t); } catch { return; }
    handleLinkSubmit(t);
  };

  return (
    <>
      <BmLoader />
      <BmProgress />
      <BmNav onAnalyze={scrollToAnalyze} />

      <div className="min-h-screen text-white" style={{ background: "#0B0C10" }}>
        {/* ── Hero ── */}
        <BmHero onAnalyze={handleHeroAnalyze} loading={loading} preset={preset} />

        {/* ── Faction / preset selector ── */}
        <BmFactions onSelectPreset={handlePresetChange} activePreset={preset} />

        {/* ── Analyze section ── */}
        <BmAnalyze
          tab={tab} setTab={setTab}
          preset={preset} setPreset={setPreset}
          linkUrl={linkUrl} setLinkUrl={setLinkUrl}
          loading={loading} error={error}
          result={result} historyKey={historyKey}
          onLinkSubmit={handleLinkFormSubmit}
          onAudioReady={handleAudioReady}
          onOpenHistory={handleOpenHistory}
          onClearResult={() => { setResult(null); setError(""); setLinkUrl(""); }}
        />

        {/* ── Trending ── */}
        <BmTrending preset={preset} onAnalyze={handleHeroAnalyze} />

        {/* ── FAQ ── */}
        <BmFaq />

        {/* ── Footer ── */}
        <BmFooter />
      </div>
    </>
  );
}
