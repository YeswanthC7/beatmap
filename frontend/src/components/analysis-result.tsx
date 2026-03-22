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

const INTENSITY_COLOR: Record<string, string> = {
  low: "#66FCF1", medium: "#CCFF00", high: "#FF007F",
};
const INTENSITY_LABEL: Record<string, string> = {
  low: "CALM", medium: "BUILDING", high: "PEAK",
};

const SAFETY_COLOR: Record<string, string> = {
  great: "#CCFF00", okay: "#FFB800", risky: "#FF003C",
};
const SAFETY_LABEL: Record<string, string> = {
  great: "GREAT", okay: "COULD WORK", risky: "RISKY",
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
  const tabs: { id: ResultTab; label: string }[] = [
    { id: "overview",     label: "OVERVIEW"  },
    { id: "cuts",         label: "BEST CUTS" },
    { id: "shotplan",     label: "SHOT PLAN" },
    { id: "voiceover",    label: "VOICEOVER" },
    { id: "alternatives", label: "SIMILAR"   },
  ];

  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
      {tabs.map((tab) => {
        const count = counts[tab.id];
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative shrink-0 px-4 py-3 font-display text-sm uppercase transition-colors"
            style={{ color: isActive ? "#CCFF00" : "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}
          >
            {tab.label}
            {count !== undefined && count > 0 && (
              <span className="ml-1.5 font-body text-[10px] font-bold"
                style={{ color: isActive ? "#CCFF00" : "rgba(255,255,255,0.2)" }}>
                {count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#CCFF00" }} />
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
    <div className="border-2 p-5" style={{ borderColor: "#FF007F", background: "rgba(255,0,127,0.05)" }}>
      <p className="font-body font-bold text-xs uppercase tracking-[0.2em] mb-3"
        style={{ color: "rgba(255,0,127,0.6)" }}>
        BEST OPENING MOMENT
      </p>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="font-display text-4xl leading-none" style={{ color: "#FF007F" }}>
            {hookWindow.range.start}
            <span className="mx-3 font-body font-light" style={{ color: "rgba(255,0,127,0.3)" }}>—</span>
            {hookWindow.range.end}
          </p>
          <p className="mt-3 text-sm leading-6" style={{ color: "rgba(255,255,255,0.5)" }}>
            {hookWindow.reason}
          </p>
        </div>
        <button onClick={copy}
          className="shrink-0 font-body font-bold text-xs uppercase tracking-widest px-4 py-2 transition-all"
          style={{
            border: `2px solid ${copied ? "#FF007F" : "rgba(255,0,127,0.3)"}`,
            background: copied ? "#FF007F" : "transparent",
            color: copied ? "#000" : "rgba(255,0,127,0.7)",
          }}
        >
          {copied ? "✓ COPIED" : "COPY TIMESTAMP"}
        </button>
      </div>
    </div>
  );
}

function EnergyMap({ moodShifts }: { moodShifts: SongAnalysisResult["moodShifts"] }) {
  return (
    <div className="space-y-2">
      {moodShifts.map((shift, i) => {
        const col = INTENSITY_COLOR[shift.intensity] ?? "#CCFF00";
        return (
          <motion.div
            key={`${shift.time}-${i}`}
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-4 items-start p-4 transition-all"
            style={{ border: "2px solid rgba(255,255,255,0.05)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = col + "30")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")}
          >
            <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
              <div className="w-2 h-2" style={{ background: col, boxShadow: `0 0 8px ${col}` }} />
              {i < moodShifts.length - 1 && <div className="flex-1 w-px min-h-6" style={{ background: "rgba(255,255,255,0.08)" }} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-body font-bold text-sm text-white">{shift.label}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-body font-bold text-[10px] uppercase px-2 py-0.5"
                    style={{ background: col + "20", color: col, border: `1px solid ${col}40` }}>
                    {INTENSITY_LABEL[shift.intensity] ?? shift.intensity}
                  </span>
                  <span className="font-body text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {shift.time}
                  </span>
                </div>
              </div>
              <p className="text-xs leading-5" style={{ color: "rgba(255,255,255,0.45)" }}>{shift.description}</p>
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
            className="p-4" style={{ border: "2px solid rgba(204,255,0,0.1)" }}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span>{icon}</span>
                <p className="font-body font-bold text-sm text-white">
                  {formatSceneFitCategory(scene.category as never)}
                </p>
              </div>
              <span className="font-display text-sm" style={{ color: "#CCFF00" }}>{pct}%</span>
            </div>
            <div className="mb-2 h-0.5 w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full" style={{ width: `${pct}%`, background: "#CCFF00", opacity: 0.7 }} />
            </div>
            <p className="font-body text-[10px] mb-1" style={{ color: "rgba(204,255,0,0.4)" }}>
              {scene.bestRange.start} — {scene.bestRange.end}
            </p>
            <p className="font-body text-xs leading-5" style={{ color: "rgba(255,255,255,0.45)" }}>{scene.reason}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const [tab, setTab] = useState<ResultTab>("overview");

  const preset = result.preset ?? "general";
  const presetMeta = PRESET_OPTIONS.find((p) => p.id === preset);

  return (
    <div className="space-y-3">
      {/* ── Song header ── */}
      <div className="border-2 overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
        <div className="flex gap-5 p-5 flex-col sm:flex-row">
          {result.thumbnailUrl ? (
            <div className="shrink-0 overflow-hidden w-full sm:w-32 h-28 sm:h-auto"
              style={{ border: "2px solid rgba(255,255,255,0.1)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.thumbnailUrl} alt={result.songTitle}
                className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center text-3xl"
              style={{ background: "rgba(204,255,0,0.08)", border: "2px solid rgba(204,255,0,0.15)" }}>
              🎵
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="font-body font-bold text-xs uppercase tracking-widest px-2.5 py-0.5"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}>
                {formatPlatform(result.platform)}
              </span>
              {presetMeta && (
                <span className="font-body font-bold text-xs uppercase tracking-widest px-2.5 py-0.5"
                  style={{ border: "1px solid rgba(204,255,0,0.2)", color: "rgba(204,255,0,0.6)" }}>
                  {presetMeta.icon} {presetMeta.label}
                </span>
              )}
            </div>
            <h3 className="font-display text-2xl uppercase text-white leading-tight"
              style={{ letterSpacing: "-0.01em" }}>
              {result.songTitle}
            </h3>
            <p className="font-body text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              {result.artistName}
            </p>
            <p className="font-body mt-3 text-sm leading-6" style={{ color: "rgba(255,255,255,0.5)" }}>
              {result.summary}
            </p>
          </div>
        </div>

        {/* Hook window */}
        <div className="px-5 pb-5">
          <HookWindowHero hookWindow={result.hookWindow} />
        </div>
      </div>

      {/* ── Tabbed detail panel ── */}
      <div className="border-2 p-5" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <TabBar
          active={tab} onChange={setTab}
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
              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-xl uppercase text-white mb-1" style={{ letterSpacing: "0.02em" }}>
                    ENERGY MAP
                  </h3>
                  <p className="font-body text-xs mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                    HOW THE SONG&apos;S ENERGY CHANGES OVER TIME.
                  </p>
                  <EnergyMap moodShifts={result.moodShifts} />
                </div>
                <div>
                  <h3 className="font-display text-xl uppercase text-white mb-1" style={{ letterSpacing: "0.02em" }}>
                    BEST USE CASES
                  </h3>
                  <p className="font-body text-xs mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                    WHAT TYPE OF VIDEO THIS SONG WORKS BEST FOR.
                  </p>
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
                <h3 className="font-display text-xl uppercase text-white mb-1" style={{ letterSpacing: "0.02em" }}>
                  VOICEOVER WINDOWS
                </h3>
                <p className="font-body text-xs mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                  WHERE YOU CAN NARRATE WITHOUT THE MUSIC COMPETING.
                </p>
                <div className="mb-4 flex gap-4 text-[10px] font-bold flex-wrap">
                  <span style={{ color: "#CCFF00" }}>● GREAT</span>
                  <span style={{ color: "#FFB800" }}>● COULD WORK</span>
                  <span style={{ color: "#FF003C" }}>● RISKY</span>
                </div>
                <div className="space-y-2">
                  {result.voiceoverSafeSections.map((section, i) => {
                    const safety = section.safetyLevel ?? "okay";
                    const col = SAFETY_COLOR[safety] ?? "#CCFF00";
                    return (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="p-5" style={{ border: `2px solid ${col}20` }}>
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <p className="font-display text-xl" style={{ color: col }}>
                            {section.range.start} — {section.range.end}
                          </p>
                          <span className="font-body font-bold text-[10px] uppercase tracking-widest px-2.5 py-1"
                            style={{ background: col + "20", color: col, border: `1px solid ${col}40` }}>
                            {SAFETY_LABEL[safety] ?? safety}
                          </span>
                        </div>
                        <p className="font-body text-xs leading-5" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {section.reason}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {tab === "alternatives" && (
              <div>
                <h3 className="font-display text-xl uppercase text-white mb-1" style={{ letterSpacing: "0.02em" }}>
                  SIMILAR TRACKS TO TRY
                </h3>
                <p className="font-body text-xs mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                  FREE-TO-USE TRACKS IN THE SAME CREATIVE DIRECTION.
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {result.alternatives.map((track, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.07 }}
                      className="p-4" style={{ border: "2px solid rgba(255,0,127,0.15)" }}>
                      <div className="text-2xl mb-2">🎵</div>
                      <p className="font-display text-base uppercase text-white leading-tight mb-1"
                        style={{ letterSpacing: "0.01em" }}>
                        {track.title}
                      </p>
                      <p className="font-body text-xs mb-1" style={{ color: "rgba(255,0,127,0.7)" }}>
                        {track.artist}
                      </p>
                      <p className="font-body font-bold text-[10px] uppercase mb-2"
                        style={{ color: "rgba(255,255,255,0.2)" }}>
                        {track.source}
                      </p>
                      <p className="font-body text-xs leading-5" style={{ color: "rgba(255,255,255,0.45)" }}>
                        {track.reason}
                      </p>
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
