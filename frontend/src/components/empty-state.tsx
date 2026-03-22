export function EmptyState() {
  const chips = [
    { label: "Mood shifts", color: "border-orange-500/30 bg-orange-500/10 text-orange-300" },
    { label: "Hook window", color: "border-pink-500/30 bg-pink-500/10 text-pink-300" },
    { label: "Scene fit", color: "border-purple-500/30 bg-purple-500/10 text-purple-300" },
    { label: "Voiceover safe", color: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
    { label: "Alternatives", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
  ];

  return (
    <div className="flex flex-col items-center gap-6 py-20 text-center">
      <div className="relative animate-float">
        <div className="absolute inset-0 rounded-3xl blur-2xl opacity-40"
          style={{ background: "linear-gradient(135deg, #f97316, #ec4899, #a855f7)" }} />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10"
          style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(168,85,246,0.15))" }}>
          <WaveformIcon className="h-9 w-9 text-white/70" />
        </div>
      </div>
      <div>
        <h3 className="font-display text-xl font-bold text-white">No analysis yet</h3>
        <p className="mt-2 max-w-xs text-sm leading-6 text-white/40">
          Paste a YouTube or SoundCloud link, or record audio from your mic to generate a full scene-fit dossier.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 text-xs">
        {chips.map(({ label, color }) => (
          <span key={label} className={`rounded-full border px-3 py-1 font-medium ${color}`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function WaveformIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12h2M6 8v8M10 5v14M14 9v6M18 7v10M22 12h-2" />
    </svg>
  );
}
