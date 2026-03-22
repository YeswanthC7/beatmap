import type { BestCut } from "@/types/analysis";

interface BestCutsSectionProps {
  cuts: BestCut[];
  analysisMode: string;
}

const CUT_ACCENT: Record<number, { bar: string; badge: string; text: string }> = {
  0: { bar: "bg-orange-500", badge: "bg-orange-500/15 text-orange-300 border-orange-500/30", text: "text-orange-300" },
  1: { bar: "bg-pink-500",   badge: "bg-pink-500/15 text-pink-300 border-pink-500/30",     text: "text-pink-300" },
  2: { bar: "bg-purple-500", badge: "bg-purple-500/15 text-purple-300 border-purple-500/30", text: "text-purple-300" },
};

export function BestCutsSection({ cuts, analysisMode }: BestCutsSectionProps) {
  if (!cuts || cuts.length === 0) return null;

  const isMetadataOnly = analysisMode === "metadata_only";

  return (
    <div>
      <div className="mb-4">
        <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-pink-400/70 mb-1">
          Best sections to use
        </p>
        <h2 className="font-display text-xl font-extrabold text-white">Best cuts for your video</h2>
        <p className="mt-1 text-xs text-white/35">
          The strongest windows of the song for common video lengths.
          {isMetadataOnly && " Estimated from song knowledge and AI reasoning."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {cuts.map((cut, i) => {
          const accent = CUT_ACCENT[i] ?? CUT_ACCENT[0];
          const confidencePct = Math.round(cut.confidence * 100);

          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent.bar} rounded-r-full`} />

              <span className={`mb-3 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${accent.badge}`}>
                {cut.durationLabel}
              </span>

              <p className={`font-display font-mono text-lg font-bold ${accent.text} mb-1`}>
                {cut.start} — {cut.end}
              </p>

              <p className="font-display text-sm font-bold text-white mb-2">{cut.title}</p>
              <p className="text-xs leading-5 text-white/50">{cut.reason}</p>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${accent.bar} opacity-60`}
                    style={{ width: `${confidencePct}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-white/30">{confidencePct}%</span>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`${cut.start} – ${cut.end}`)
                    .catch(() => {});
                }}
                className="mt-3 text-[11px] font-semibold text-white/25 hover:text-white/50 transition-colors"
              >
                Copy timestamps
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
