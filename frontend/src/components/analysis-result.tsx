"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SongAnalysisResult } from "@/types/analysis";
import { PRESET_OPTIONS } from "@/types/analysis";
import { formatSceneFitCategory } from "@/lib/formatters";
import { formatPlatform } from "@/lib/platform";
import { BestCutsSection } from "./best-cuts-section";
import { ShotPlanSection } from "./shot-plan-section";

interface AnalysisResultProps {
  result: SongAnalysisResult;
}

type ResultTab = "overview" | "cuts" | "shotplan" | "voiceover" | "alternatives";

const INTENSITY_STYLE: Record<string, string> = {
  low:    "bg-blue-500/15 text-blue-300 border-blue-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  high:   "bg-orange-500/15 text-orange-300 border-orange-500/30",
};

const INTENSITY_DOT: Record<string, string> = {
  low: "#3b82f6", medium: "#f59e0b", high: "#f97316",
};

const SAFETY_STYLE: Record<string, string> = {
  great: "bg-green-500/15 text-green-300 border-green-500/30",
  okay:  "bg-amber-500/15 text-amber-300 border-amber-500/30",
  risky: "bg-red-500/15 text-red-300 border-red-500/30",
};

const SAFETY_LABEL: Record<string, string> = {
  great: "Great for talking",
  okay:  "Could work",
  risky: "Music may compete",
};

const PLATFORM_BADGE: Record<string, string> = {
  youtube:    "border-red-500/30 bg-red-500/10 text-red-300",
  soundcloud: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  mic:        "border-purple-500/30 bg-purple-500/10 text-purple-300",
};

const SCENE_ICON: Record<string, string> = {
  intro: "🎬", reveal: "✨", montage: "🖼️", workout_peak: "💪",
  end_card: "🏁", boss_fight: "⚔️", night_drive: "🌙", study_focus: "📖",
};

function TabBar({ active, onChange, counts }: {
  active: ResultTab;
  onChange: (t: ResultTab) => void;
  counts: Partial<Record<ResultTab, number>>;
}) {
  const tabs: { id: ResultTab; label: string; icon: string }[] = [
    { id: "overview",     label: "Overview",    icon: "🗺️" },
    { id: "cuts",         label: "Best cuts",   icon: "✂️" },
    { id: "shotplan",     label: "Shot plan",   icon: "🎬" },
    { id: "voiceover",    label: "Voiceover",   icon: "🎙️" },
    { id: "alternatives", label: "Similar",     icon: "🎵" },
  ];

  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6">
      {tabs.map((tab) => {
        const count = counts[tab.id];
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
              active === tab.id
                ? "border-violet-500/50 bg-violet-500/15 text-violet-200"
                : "border-white/[0.07] bg-white/[0.02] text-white/35 hover:text-white/60 hover:border-white/15"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {count !== undefined && count > 0 && (
              <span className={`rounded-full px-1.5 text-[9px] font-extrabold ${
                active === tab.id ? "bg-violet-400/20 text-violet-300" : "bg-white/10 text-white/30"
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function HookWindowHero({ hookWindow }: { hookWindow: SongAnalysisResult["hookWindow"] }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(`${hookWindow.range.start} – ${hookWindow.range.end}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-pink-500/20 bg-black/30 p-6"
      style={{ boxShadow: "0 0 60px rgba(236,72,153,0.08)" }}>
      <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none"
        style={{ background: "linear-gradient(to left, rgba(236,72,153,0.06), transparent)" }} />

      <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-400/60 mb-3">Best opening moment</p>

      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="font-mono text-4xl font-black text-pink-200 leading-none">
            {hookWindow.range.start}
            <span className="text-pink-400/40 mx-3 font-light">—</span>
            {hookWindow.range.end}
          </p>
          <p className="mt-3 text-sm leading-6 text-white/55 max-w-lg">{hookWindow.reason}</p>
        </div>

        <button onClick={copy}
          className="shrink-0 rounded-xl border px-4 py-2 text-sm font-bold transition-all"
          style={{
            borderColor: copied ? "rgba(236,72,153,0.5)" : "rgba(236,72,153,0.2)",
            background: copied ? "rgba(236,72,153,0.1)" : "transparent",
            color: copied ? "#f9a8d4" : "rgba(236,72,153,0.6)",
          }}
        >
          {copied ? "✓ Copied!" : "Copy timestamp"}
        </button>
      </div>
    </div>
  );
}

function EnergyMap({ moodShifts }: { moodShifts: SongAnalysisResult["moodShifts"] }) {
  return (
    <div className="space-y-3">
      {moodShifts.map((shift, i) => {
        const dot = INTENSITY_DOT[shift.intensity] ?? "#8b5cf6";
        return (
          <motion.div
            key={`${shift.time}-${i}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex gap-4 items-start rounded-2xl border border-white/[0.06] bg-black/20 p-4 hover:border-white/10 transition-colors"
          >
            {/* Timeline dot */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full mt-0.5" style={{ background: dot, boxShadow: `0 0 8px ${dot}` }} />
              {i < moodShifts.length - 1 && <div className="flex-1 w-px bg-white/[0.06] mt-1 min-h-8" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-white">{shift.label}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${INTENSITY_STYLE[shift.intensity] ?? ""}`}>
                    {shift.intensity === "low" ? "Calm" : shift.intensity === "medium" ? "Building" : "Peak"}
                  </span>
                  <span className="font-mono text-xs text-white/30">{shift.time}</span>
                </div>
              </div>
              <p className="text-xs leading-5 text-white/50">{shift.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function SceneFits({ sceneFits }: { sceneFits: SongAnalysisResult["sceneFits"] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {sceneFits.map((scene, i) => {
        const pct = Math.round(scene.confidence * 100);
        const icon = SCENE_ICON[scene.category] ?? "🎵";
        return (
          <motion.div key={`${scene.category}-${i}`}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-purple-500/15 bg-purple-500/[0.04] p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span>{icon}</span>
                <p className="text-sm font-semibold text-white">
                  {formatSceneFitCategory(scene.category as never)}
                </p>
              </div>
              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-300">
                {pct}%
              </span>
            </div>
            <div className="mb-2 h-1 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-purple-500 opacity-60" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-[10px] text-purple-300/50 mb-1 font-mono">{scene.bestRange.start} — {scene.bestRange.end}</p>
            <p className="text-xs leading-5 text-white/50">{scene.reason}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const [tab, setTab] = useState<ResultTab>("overview");

  const platformBadge = PLATFORM_BADGE[result.platform] ?? "border-white/10 bg-white/5 text-white/60";
  const preset = result.preset ?? "general";
  const presetMeta = PRESET_OPTIONS.find((p) => p.id === preset);

  return (
    <div className="space-y-2">
      {/* ── Song header card ── */}
      <div className="rounded-3xl border border-white/[0.07] bg-black/30 overflow-hidden">
        <div className="flex gap-5 p-5 flex-col sm:flex-row">
          {/* Thumbnail */}
          {result.thumbnailUrl ? (
            <div className="shrink-0 overflow-hidden rounded-2xl border border-white/10 w-full sm:w-32 h-32 sm:h-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.thumbnailUrl} alt={result.songTitle}
                className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-white/10 text-3xl">
              🎵
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${platformBadge}`}>
                {formatPlatform(result.platform)}
              </span>
              {presetMeta && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/50">
                  {presetMeta.icon} {presetMeta.label}
                </span>
              )}
            </div>
            <h3 className="font-display text-xl font-extrabold text-white leading-tight">{result.songTitle}</h3>
            <p className="text-sm text-white/45 mt-0.5">{result.artistName}</p>
            <p className="mt-3 text-sm leading-6 text-white/55">{result.summary}</p>
          </div>
        </div>

        {/* Hook window hero — always visible at top */}
        <div className="px-5 pb-5">
          <HookWindowHero hookWindow={result.hookWindow} />
        </div>
      </div>

      {/* ── Tab navigation ── */}
      <div className="rounded-3xl border border-white/[0.07] bg-black/20 p-5">
        <TabBar
          active={tab}
          onChange={setTab}
          counts={{
            cuts: result.bestCuts?.length ?? 0,
            shotplan: result.shotPlan?.length ?? 0,
            voiceover: result.voiceoverSafeSections?.length ?? 0,
            alternatives: result.alternatives?.length ?? 0,
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}>

            {tab === "overview" && (
              <div className="space-y-6">
                {/* Energy map */}
                <div>
                  <h3 className="font-display text-lg font-extrabold text-white mb-1">Energy map</h3>
                  <p className="text-xs text-white/35 mb-4">How the song's energy changes over time.</p>
                  <EnergyMap moodShifts={result.moodShifts} />
                </div>

                {/* Scene fits */}
                <div>
                  <h3 className="font-display text-lg font-extrabold text-white mb-1">Best use cases</h3>
                  <p className="text-xs text-white/35 mb-4">What type of video this song works best for.</p>
                  <SceneFits sceneFits={result.sceneFits} />
                </div>
              </div>
            )}

            {tab === "cuts" && (
              <BestCutsSection cuts={result.bestCuts} analysisMode={result.analysisMode} />
            )}

            {tab === "shotplan" && (
              <ShotPlanSection steps={result.shotPlan} preset={preset} />
            )}

            {tab === "voiceover" && (
              <div>
                <h3 className="font-display text-lg font-extrabold text-white mb-1">Voiceover windows</h3>
                <p className="text-xs text-white/35 mb-4">
                  Where you can narrate without the music competing.
                </p>
                <div className="mb-3 flex gap-4 text-[10px] font-bold text-white/30 flex-wrap">
                  <span className="text-green-400">● Great for talking</span>
                  <span className="text-amber-400">● Could work</span>
                  <span className="text-red-400">● Music may compete</span>
                </div>
                <div className="space-y-3">
                  {result.voiceoverSafeSections.map((section, i) => {
                    const safety = section.safetyLevel ?? "okay";
                    return (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="rounded-2xl border border-white/[0.08] bg-black/20 p-5">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <p className="font-mono text-xl font-bold text-emerald-300">
                            {section.range.start} — {section.range.end}
                          </p>
                          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${SAFETY_STYLE[safety] ?? SAFETY_STYLE.okay}`}>
                            {SAFETY_LABEL[safety] ?? safety}
                          </span>
                        </div>
                        <p className="text-xs leading-5 text-white/55">{section.reason}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {tab === "alternatives" && (
              <div>
                <h3 className="font-display text-lg font-extrabold text-white mb-1">Similar tracks to try</h3>
                <p className="text-xs text-white/35 mb-4">
                  If this song doesn't fit — free-to-use tracks in the same creative direction.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {result.alternatives.map((track, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.07 }}
                      className="rounded-2xl border border-pink-500/15 bg-pink-500/[0.04] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-sm">
                          🎵
                        </div>
                        <div>
                          <p className="font-display text-sm font-bold text-white leading-tight">{track.title}</p>
                          <p className="text-[10px] text-pink-300/70">{track.artist}</p>
                        </div>
                      </div>
                      <p className="text-[10px] font-semibold text-white/30 mb-2">{track.source}</p>
                      <p className="text-xs leading-5 text-white/50">{track.reason}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
