export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-5 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <WaveformIcon className="h-8 w-8 text-cyan-400/60" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-white/80">No analysis yet</h3>
        <p className="mt-1.5 max-w-xs text-sm leading-6 text-white/40">
          Paste a YouTube or SoundCloud link, or record audio from your mic to generate a scene-fit dossier.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 text-xs text-white/30">
        <span className="rounded-full border border-white/10 px-3 py-1">Mood shifts</span>
        <span className="rounded-full border border-white/10 px-3 py-1">Hook window</span>
        <span className="rounded-full border border-white/10 px-3 py-1">Scene fit</span>
        <span className="rounded-full border border-white/10 px-3 py-1">Voiceover safe</span>
        <span className="rounded-full border border-white/10 px-3 py-1">Alternatives</span>
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
