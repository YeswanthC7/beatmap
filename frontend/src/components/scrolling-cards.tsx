"use client";

const COL1 = [
  { color: "#fde68a", bg: "#78350f", label: "Mood Shift", time: "00:32", title: "Rising tension", desc: "Kick drum doubles, synth pads swell — perfect for reveal shots." },
  { color: "#bfdbfe", bg: "#1e3a5f", label: "Hook Window", time: "01:14", title: "Peak payoff", desc: "The chorus drop — strongest 8-bar window for short-form reels." },
  { color: "#d9f99d", bg: "#14532d", label: "Scene Fit", time: "02:05", title: "Montage", desc: "Driving 128bpm rhythm syncs naturally to fast-cut edits." },
  { color: "#fecaca", bg: "#7f1d1d", label: "Voiceover", time: "00:48", title: "Soft intro", desc: "Sparse arrangement leaves space for narration without conflict." },
  { color: "#e9d5ff", bg: "#4c1d95", label: "Mood Shift", time: "03:10", title: "Resolution", desc: "Tempo drops, reverb blooms — ideal for emotional outro." },
];

const COL2 = [
  { color: "#fbcfe8", bg: "#831843", label: "Scene Fit", time: "00:00", title: "Night Drive", desc: "Lo-fi synth bass and 80bpm groove — perfect nocturnal atmosphere." },
  { color: "#a5f3fc", bg: "#164e63", label: "Alternative", title: "Sapphire — Alt-J", desc: "Similar melancholic indie feel. Available on Free Music Archive." },
  { color: "#fed7aa", bg: "#7c2d12", label: "Hook Window", time: "01:45", title: "Bridge climax", desc: "All instruments converge here — strongest emotional peak of the track." },
  { color: "#c7d2fe", bg: "#312e81", label: "Mood Shift", time: "00:15", title: "Slow build", desc: "Single guitar line introduces the theme before drums enter at 0:32." },
  { color: "#bbf7d0", bg: "#14532d", label: "Scene Fit", time: "02:30", title: "End Card", desc: "Gentle fadeout creates space for logo animation or title reveal." },
];

const COL3 = [
  { color: "#fef9c3", bg: "#713f12", label: "Scene Fit", time: "01:00", title: "Workout Peak", desc: "BPM locks to 140 — energy sustained for full 90-second set sequence." },
  { color: "#fce7f3", bg: "#831843", label: "Voiceover", time: "02:15", title: "Mid-song break", desc: "Instrumental breakdown — 22 seconds of clean narration room." },
  { color: "#ddd6fe", bg: "#4c1d95", label: "Alternative", title: "Breathe — Télépopmusik", desc: "Similar ambient-electronic character. CC-licensed on ccMixter." },
  { color: "#cffafe", bg: "#164e63", label: "Mood Shift", time: "00:00", title: "Cold open", desc: "Ambient drone before beat drops — sets cinematic expectation." },
  { color: "#fca5a5", bg: "#7f1d1d", label: "Hook Window", time: "00:52", title: "Verse 1 hook", desc: "Melodic peak before the second chorus — high recall factor." },
];

interface CardData {
  color: string;
  bg: string;
  label: string;
  time?: string;
  title: string;
  desc: string;
}

function Card({ card }: { card: CardData }) {
  return (
    <div
      className="mb-3 w-56 shrink-0 rounded-3xl p-4 shadow-lg"
      style={{ backgroundColor: card.bg, border: `1px solid ${card.color}22` }}
    >
      <div
        className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
        style={{ backgroundColor: card.color + "22", color: card.color }}
      >
        {card.label}
      </div>
      {card.time && (
        <p className="font-mono text-xs font-bold mb-1" style={{ color: card.color }}>
          {card.time}
        </p>
      )}
      <p className="text-sm font-bold text-white mb-1">{card.title}</p>
      <p className="text-xs leading-5 text-white/55">{card.desc}</p>
    </div>
  );
}

function Column({ cards, direction }: { cards: CardData[]; direction: "up" | "down" }) {
  const doubled = [...cards, ...cards];
  return (
    <div className="relative overflow-hidden" style={{ height: 520 }}>
      <div className={direction === "up" ? "col-up" : "col-down"}>
        {doubled.map((card, i) => (
          <Card key={i} card={card} />
        ))}
      </div>
    </div>
  );
}

export function ScrollingCards() {
  return (
    <div className="relative overflow-hidden py-16">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(249,115,22,0.06), transparent)"
        }}
      />
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#07040f] to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#07040f] to-transparent" />
      <div className="absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-[#07040f] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-[#07040f] to-transparent" />

      <div className="mx-auto mb-10 max-w-xl text-center px-6">
        <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-orange-400/70 mb-3">
          What BeatMap produces
        </p>
        <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
          Every song, fully{" "}
          <span className="gradient-text">mapped</span>
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/45">
          Mood shifts, hook windows, scene fits, voiceover gaps — all timestamped and ready for your edit.
        </p>
      </div>

      <div className="flex justify-center gap-4 px-4">
        <Column cards={COL1} direction="up" />
        <Column cards={COL2} direction="down" />
        <Column cards={COL3} direction="up" />
      </div>
    </div>
  );
}
