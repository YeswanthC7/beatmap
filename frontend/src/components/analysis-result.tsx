import type { SongAnalysisResult } from "@/types/analysis";
import { formatSceneFitCategory } from "@/lib/formatters";
import { formatPlatform } from "@/lib/platform";
import { ResultCard } from "./result-card";

interface AnalysisResultProps {
  result: SongAnalysisResult;
}

const INTENSITY_COLOR: Record<string, string> = {
  low: "text-blue-300",
  medium: "text-cyan-300",
  high: "text-amber-300",
};

const MODE_LABEL: Record<string, string> = {
  metadata_only: "Metadata analysis",
  recorded_audio: "Audio analysis",
};

const PLATFORM_BADGE_COLOR: Record<string, string> = {
  youtube: "border-red-500/20 bg-red-500/10 text-red-300",
  soundcloud: "border-orange-500/20 bg-orange-500/10 text-orange-300",
  mic: "border-purple-500/20 bg-purple-500/10 text-purple-300",
};

export function AnalysisResult({ result }: AnalysisResultProps) {
  const platformBadge =
    PLATFORM_BADGE_COLOR[result.platform] ??
    "border-white/10 bg-white/5 text-white/60";

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ResultCard
          title={`${result.songTitle} — ${result.artistName}`}
          subtitle={`Source: ${result.sourceLabel}`}
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${platformBadge}`}
            >
              {formatPlatform(result.platform)}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/50">
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

          <p className="text-sm leading-7 text-white/75">{result.summary}</p>
        </ResultCard>

        <ResultCard title="Hook Window" subtitle="Best short-form payoff moment">
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="font-mono text-sm font-semibold text-cyan-200">
              {result.hookWindow.range.start} — {result.hookWindow.range.end}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              {result.hookWindow.reason}
            </p>
          </div>
        </ResultCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ResultCard title="Mood Shifts" subtitle="Timecoded emotional changes">
          <div className="space-y-3">
            {result.moodShifts.map((shift, i) => (
              <div
                key={`${shift.time}-${i}`}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white">{shift.label}</p>
                  <span className="font-mono text-xs text-white/40">{shift.time}</span>
                </div>
                <p className={`mt-1 text-xs capitalize font-medium ${INTENSITY_COLOR[shift.intensity] ?? "text-white/60"}`}>
                  {shift.intensity} intensity
                </p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  {shift.description}
                </p>
              </div>
            ))}
          </div>
        </ResultCard>

        <ResultCard title="Scene Fit" subtitle="Best content use cases">
          <div className="space-y-3">
            {result.sceneFits.map((scene, i) => (
              <div
                key={`${scene.category}-${i}`}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white">
                    {formatSceneFitCategory(scene.category as never)}
                  </p>
                  <span className="text-xs text-white/40">
                    {Math.round(scene.confidence * 100)}%
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-cyan-200/70">
                  {scene.bestRange.start} — {scene.bestRange.end}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  {scene.reason}
                </p>
              </div>
            ))}
          </div>
        </ResultCard>

        <ResultCard
          title="Voiceover Safe"
          subtitle="Sections with room for narration"
        >
          <div className="space-y-3">
            {result.voiceoverSafeSections.map((section, i) => (
              <div
                key={`${section.range.start}-${i}`}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <p className="font-mono text-sm font-medium text-white">
                  {section.range.start} — {section.range.end}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/65">
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
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.alternatives.map((track, i) => (
            <div
              key={`${track.title}-${i}`}
              className="rounded-xl border border-white/10 bg-black/20 p-4"
            >
              <p className="text-sm font-medium text-white">{track.title}</p>
              <p className="mt-1 text-xs text-cyan-200/80">
                {track.artist} · {track.source}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                {track.reason}
              </p>
            </div>
          ))}
        </div>
      </ResultCard>
    </div>
  );
}
