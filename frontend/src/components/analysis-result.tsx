import type { SongAnalysisResult } from "@/types/analysis";
import { formatSceneFitCategory } from "@/lib/formatters";
import { formatPlatform } from "@/lib/platform";
import { ResultCard } from "./result-card";

interface AnalysisResultProps {
  result: SongAnalysisResult;
}

const INTENSITY_STYLE: Record<string, string> = {
  low: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  high: "bg-orange-500/15 text-orange-300 border-orange-500/30",
};

const MODE_LABEL: Record<string, string> = {
  metadata_only: "Metadata analysis",
  recorded_audio: "Audio analysis",
};

const PLATFORM_BADGE_COLOR: Record<string, string> = {
  youtube: "border-red-500/30 bg-red-500/10 text-red-300",
  soundcloud: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  mic: "border-purple-500/30 bg-purple-500/10 text-purple-300",
};

export function AnalysisResult({ result }: AnalysisResultProps) {
  const platformBadge =
    PLATFORM_BADGE_COLOR[result.platform] ??
    "border-white/10 bg-white/5 text-white/60";

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <ResultCard
          title={`${result.songTitle}`}
          subtitle={result.artistName}
          accent="orange"
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${platformBadge}`}>
              {formatPlatform(result.platform)}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/40">
              {MODE_LABEL[result.analysisMode] ?? result.analysisMode}
            </span>
          </div>

          {result.thumbnailUrl ? (
            <div className="mb-4 overflow-hidden rounded-2xl border border-white/10">
              <img
                src={result.thumbnailUrl}
                alt={`${result.songTitle} thumbnail`}
                className="h-52 w-full object-cover"
              />
            </div>
          ) : null}

          <p className="text-sm leading-7 text-white/65">{result.summary}</p>
        </ResultCard>

        <ResultCard title="Hook Window" subtitle="Best short-form payoff moment" accent="pink">
          <div className="rounded-2xl border border-pink-400/20 bg-pink-400/10 p-5">
            <p className="font-display font-mono text-2xl font-bold text-pink-200">
              {result.hookWindow.range.start} — {result.hookWindow.range.end}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/65">
              {result.hookWindow.reason}
            </p>
          </div>
        </ResultCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <ResultCard title="Mood Shifts" subtitle="Timecoded emotional arc" accent="amber">
          <div className="space-y-3">
            {result.moodShifts.map((shift, i) => (
              <div
                key={`${shift.time}-${i}`}
                className="rounded-2xl border border-white/8 bg-black/20 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{shift.label}</p>
                  <span className="font-mono text-xs text-white/35 shrink-0">{shift.time}</span>
                </div>
                <span className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${INTENSITY_STYLE[shift.intensity] ?? "bg-white/5 text-white/40 border-white/10"}`}>
                  {shift.intensity}
                </span>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {shift.description}
                </p>
              </div>
            ))}
          </div>
        </ResultCard>

        <ResultCard title="Scene Fit" subtitle="Best content use cases" accent="purple">
          <div className="space-y-3">
            {result.sceneFits.map((scene, i) => (
              <div
                key={`${scene.category}-${i}`}
                className="rounded-2xl border border-white/8 bg-black/20 p-4"
              >
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
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {scene.reason}
                </p>
              </div>
            ))}
          </div>
        </ResultCard>

        <ResultCard
          title="Voiceover Safe"
          subtitle="Quiet sections for narration"
          accent="green"
        >
          <div className="space-y-3">
            {result.voiceoverSafeSections.map((section, i) => (
              <div
                key={`${section.range.start}-${i}`}
                className="rounded-2xl border border-white/8 bg-black/20 p-4"
              >
                <p className="font-mono text-base font-bold text-emerald-300">
                  {section.range.start} — {section.range.end}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {section.reason}
                </p>
              </div>
            ))}
          </div>
        </ResultCard>
      </div>

      <ResultCard
        title="Alternative Tracks"
        subtitle="Similar creative direction from open / free sources"
        accent="pink"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.alternatives.map((track, i) => (
            <div
              key={`${track.title}-${i}`}
              className="rounded-2xl border border-white/8 bg-black/20 p-4"
            >
              <p className="font-display text-sm font-bold text-white">{track.title}</p>
              <p className="mt-1 text-xs font-medium text-pink-300/80">
                {track.artist} · {track.source}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {track.reason}
              </p>
            </div>
          ))}
        </div>
      </ResultCard>
    </div>
  );
}
