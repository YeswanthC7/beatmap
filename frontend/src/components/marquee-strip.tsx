const ITEMS = [
  { icon: "🎵", label: "Mood Shifts" },
  { icon: "🎯", label: "Hook Windows" },
  { icon: "🎬", label: "Scene Fit" },
  { icon: "🎙️", label: "Voiceover Safe" },
  { icon: "🔀", label: "Alternative Tracks" },
  { icon: "⏱️", label: "Timestamped" },
  { icon: "🧠", label: "AI-Powered" },
  { icon: "🎸", label: "Any Genre" },
  { icon: "📺", label: "Film & Video" },
  { icon: "🎮", label: "Game Soundtracks" },
];

export function MarqueeStrip() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] py-4">
      <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#07040f] to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#07040f] to-transparent" />
      <div className="marquee-track inline-flex gap-0">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-display inline-flex items-center gap-2 px-6 text-sm font-semibold text-white/40"
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
            <span className="ml-4 text-white/15">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
