import { ResultCard } from "@/components/result-card";
import { SectionHeader } from "@/components/section-header";
import { formatSceneFitCategory } from "@/lib/formatters";
import { mockAnalysis } from "@/lib/mock-analysis";
import { formatPlatform } from "@/lib/platform";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-white">
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16">
        <SectionHeader
          eyebrow="BeatMap"
          title="Turn any song into scene-fit intelligence"
          description="Paste a song link or use live mic input to generate timestamped mood shifts, hook windows, voiceover-safe sections, and creative use-case insights."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <ResultCard
            title={`${mockAnalysis.songTitle} — ${mockAnalysis.artistName}`}
            subtitle={`Source: ${mockAnalysis.sourceLabel}`}
          >
            <div className="mb-4 flex flex-wrap gap-3">
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                Platform: {formatPlatform(mockAnalysis.platform)}
              </div>
              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                Input: {mockAnalysis.source}
              </div>
            </div>

            {mockAnalysis.thumbnailUrl ? (
              <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <img
                  src={mockAnalysis.thumbnailUrl}
                  alt={`${mockAnalysis.songTitle} thumbnail`}
                  className="h-56 w-full object-cover"
                />
              </div>
            ) : null}

            <p className="text-sm leading-7 text-white/75">
              {mockAnalysis.summary}
            </p>
          </ResultCard>

          <ResultCard
            title="Hook Window"
            subtitle="Best short-form payoff moment"
          >
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <p className="text-sm font-medium text-cyan-200">
                {mockAnalysis.hookWindow.range.start} -{" "}
                {mockAnalysis.hookWindow.range.end}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                {mockAnalysis.hookWindow.reason}
              </p>
            </div>
          </ResultCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <ResultCard
            title="Mood Shifts"
            subtitle="Timecoded emotional changes"
          >
            <div className="space-y-4">
              {mockAnalysis.moodShifts.map((shift) => (
                <div
                  key={`${shift.time}-${shift.label}`}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">
                      {shift.label}
                    </p>
                    <span className="text-xs text-white/50">{shift.time}</span>
                  </div>
                  <p className="mt-2 text-sm capitalize text-cyan-200">
                    Intensity: {shift.intensity}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {shift.description}
                  </p>
                </div>
              ))}
            </div>
          </ResultCard>

          <ResultCard title="Scene Fit" subtitle="Best content use cases">
            <div className="space-y-4">
              {mockAnalysis.sceneFits.map((scene) => (
                <div
                  key={`${scene.category}-${scene.bestRange.start}`}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">
                      {formatSceneFitCategory(scene.category)}
                    </p>
                    <span className="text-xs text-white/50">
                      {Math.round(scene.confidence * 100)}%
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-cyan-200">
                    Best range: {scene.bestRange.start} - {scene.bestRange.end}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
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
            <div className="space-y-4">
              {mockAnalysis.voiceoverSafeSections.map((section) => (
                <div
                  key={`${section.range.start}-${section.range.end}`}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <p className="text-sm font-medium text-white">
                    {section.range.start} - {section.range.end}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {section.reason}
                  </p>
                </div>
              ))}
            </div>
          </ResultCard>
        </div>

        <div className="mt-6">
          <ResultCard
            title="Alternative Tracks"
            subtitle="Similar creative direction from open/free sources"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {mockAnalysis.alternatives.map((track) => (
                <div
                  key={`${track.title}-${track.artist}`}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <p className="text-sm font-medium text-white">
                    {track.title}
                  </p>
                  <p className="mt-1 text-sm text-cyan-200">
                    {track.artist} · {track.source}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    {track.reason}
                  </p>
                </div>
              ))}
            </div>
          </ResultCard>
        </div>
      </section>
    </main>
  );
}
