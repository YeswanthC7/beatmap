import type { SongAnalysisResult } from "@/types/analysis";
import { PRESET_OPTIONS } from "@/types/analysis";
import { formatSceneFitCategory } from "@/lib/formatters";
import { formatPlatform } from "@/lib/platform";
import { BestCutsSection } from "./best-cuts-section";
import { ResultCard } from "./result-card";
import { ShotPlanSection } from "./shot-plan-section";

interface AnalysisResultProps {
  result: SongAnalysisResult;
}

const INTENSITY_STYLE: Record<string, string> = {
  low:    "bg-blue-500/15 text-blue-300 border-blue-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  high:   "bg-orange-500/15 text-orange-300 border-orange-500/30",
};

const INTENSITY_LABEL: Record<string, string> = {
  low: "Calm", medium: "Building", high: "Peak energy",
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

const MODE_LABEL: Record<string, string> = {
  metadata_only:  "Based on song knowledge + AI",
  recorded_audio: "Based on your audio recording",
};

const PLATFORM_BADGE: Record<string, string> = {
  youtube:    "border-red-500/30 bg-red-500/10 text-red-300",
  soundcloud: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  mic:        "border-purple-500/30 bg-purple-500/10 text-purple-300",
};

export function AnalysisResult({ result }: AnalysisResultProps) {
  const platformBadge = PLATFORM_BADGE[result.platform] ?? "border-white/10 bg-white/5 text-white/60";
  const preset = result.preset ?? "general";
  const presetMeta = PRESET_OPTIONS.find((p) => p.id === preset);

  return (
    <div className="space-y-6">
      {/* ── Track header ── */}
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <ResultCard title={result.songTitle} subtitle={result.artistName} accent="orange">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${platformBadge}`}>
              {formatPlatform(result.platform)}
            </span>
            {presetMeta && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/50">
                {presetMeta.icon} {presetMeta.label}
              </span>
            )}
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/35">
              {MODE_LABEL[result.analysisMode] ?? result.analysisMode}
            </span>
          </div>

          {result.thumbnailUrl && (
            <div className="mb-4 overflow-hidden rounded-2xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.thumbnailUrl}
                alt={result.songTitle}
                className="h-48 w-full object-cover"
              />
            </div>
          )}

          <p className="text-sm leading-7 text-white/65">{result.summary}</p>
        </ResultCard>

        {/* ── Best opening moment ── */}
        <ResultCard title="Best opening moment" subtitle="The strongest part to start or use in your edit" accent="pink">
          <div className="rounded-2xl border border-pink-400/20 bg-pink-400/10 p-5">
            <p className="font-display font-mono text-2xl font-bold text-pink-200 mb-2">
              {result.hookWindow.range.start} — {result.hookWindow.range.end}
            </p>
            <p className="text-sm leading-6 text-white/65">{result.hookWindow.reason}</p>
          </div>
        </ResultCard>
      </div>

      {/* ── Best cuts ── */}
      {result.bestCuts && result.bestCuts.length > 0 && (
        <BestCutsSection cuts={result.bestCuts} analysisMode={result.analysisMode} />
      )}

      {/* ── Mood shifts + Scene fit + Voiceover ── */}
      <div className="grid gap-5 lg:grid-cols-3">
        <ResultCard title="Energy map" subtitle="How the song's energy changes over time" accent="amber">
          <div className="space-y-3">
            {result.moodShifts.map((shift, i) => (
              <div key={`${shift.time}-${i}`} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{shift.label}</p>
                  <span className="font-mono text-xs text-white/35 shrink-0">{shift.time}</span>
                </div>
                <span className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${INTENSITY_STYLE[shift.intensity] ?? "bg-white/5 text-white/40 border-white/10"}`}>
                  {INTENSITY_LABEL[shift.intensity] ?? shift.intensity}
                </span>
                <p className="mt-2 text-xs leading-5 text-white/50">{shift.description}</p>
              </div>
            ))}
          </div>
        </ResultCard>

        <ResultCard title="Best use cases" subtitle="What type of video this song works best for" accent="purple">
          <div className="space-y-3">
            {result.sceneFits.map((scene, i) => (
              <div key={`${scene.category}-${i}`} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">
                    {formatSceneFitCategory(scene.category as never)}
                  </p>
                  <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-300">
                    {Math.round(scene.confidence * 100)}%
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-purple-300/60">
                  {scene.bestRange.start} — {scene.bestRange.end}
                </p>
                <p className="mt-2 text-xs leading-5 text-white/50">{scene.reason}</p>
              </div>
            ))}
          </div>
        </ResultCard>

        <ResultCard
          title="Best parts to talk over"
          subtitle="Where you can narrate without the music competing"
          accent="green"
        >
          <div className="mb-3 flex gap-3 text-[10px] font-bold text-white/30 flex-wrap">
            <span className="text-green-400">● Great for talking</span>
            <span className="text-amber-400">● Could work</span>
            <span className="text-red-400">● Music may compete</span>
          </div>
          <div className="space-y-3">
            {result.voiceoverSafeSections.map((section, i) => {
              const safetyLevel = section.safetyLevel ?? "okay";
              return (
                <div key={`${section.range.start}-${i}`} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="font-mono text-base font-bold text-emerald-300">
                      {section.range.start} — {section.range.end}
                    </p>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${SAFETY_STYLE[safetyLevel] ?? SAFETY_STYLE.okay}`}>
                      {SAFETY_LABEL[safetyLevel] ?? safetyLevel}
                    </span>
                  </div>
                  <p className="text-xs leading-5 text-white/50">{section.reason}</p>
                </div>
              );
            })}
          </div>
        </ResultCard>
      </div>

      {/* ── Shot plan ── */}
      {result.shotPlan && result.shotPlan.length > 0 && (
        <ShotPlanSection steps={result.shotPlan} preset={preset} />
      )}

      {/* ── Similar tracks ── */}
      <ResultCard
        title="Similar tracks to try"
        subtitle="If this song doesn't fit, these are in a similar creative direction and free to use"
        accent="pink"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.alternatives.map((track, i) => (
            <div key={`${track.title}-${i}`} className="rounded-2xl border border-white/8 bg-black/20 p-4">
              <p className="font-display text-sm font-bold text-white">{track.title}</p>
              <p className="mt-1 text-xs font-medium text-pink-300/80">
                {track.artist} · {track.source}
              </p>
              <p className="mt-2 text-xs leading-5 text-white/50">{track.reason}</p>
            </div>
          ))}
        </div>
      </ResultCard>
    </div>
  );
}
