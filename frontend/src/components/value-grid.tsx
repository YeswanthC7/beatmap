"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const VALUES = [
  {
    icon: "✂️",
    title: "Find the best 15 seconds faster",
    body: "Stop scrubbing through the whole song. BeatMap shows you the strongest 15, 30, and 45-second windows with a reason why.",
    accent: "#f97316",
    bg: "from-orange-500/10 to-orange-500/5",
    border: "border-orange-500/20",
  },
  {
    icon: "🎙️",
    title: "Know where to talk over the music",
    body: "Get clear labels — Great, Could work, or May compete — so you know exactly where your voice fits without guessing.",
    accent: "#06b6d4",
    bg: "from-cyan-500/10 to-cyan-500/5",
    border: "border-cyan-500/20",
  },
  {
    icon: "🎞️",
    title: "Match songs to your video type",
    body: "Traveling? Making a reel? Running an ad? Choose your video type and BeatMap tailors every suggestion to it.",
    accent: "#8b5cf6",
    bg: "from-violet-500/10 to-violet-500/5",
    border: "border-violet-500/20",
  },
  {
    icon: "⚖️",
    title: "Compare tracks before you edit",
    body: "Not sure which song to use? Try two or three and see which one is actually better for your exact video.",
    accent: "#ec4899",
    bg: "from-pink-500/10 to-pink-500/5",
    border: "border-pink-500/20",
  },
  {
    icon: "🔥",
    title: "Use trending songs faster",
    body: "Browse what's popular right now in 8 languages and analyze any track in one click — no searching required.",
    accent: "#f97316",
    bg: "from-amber-500/10 to-amber-500/5",
    border: "border-amber-500/20",
  },
  {
    icon: "🎬",
    title: "Get a simple shot plan",
    body: "See how your visuals can line up with the music — a step-by-step plan from opening hook to end card.",
    accent: "#3b82f6",
    bg: "from-blue-500/10 to-blue-500/5",
    border: "border-blue-500/20",
  },
];

export function ValueGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-2xl"
        style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)" }} />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-violet-300 mb-4">
            Why creators use BeatMap
          </span>
          <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
            What BeatMap helps you{" "}
            <span className="gradient-text">do faster</span>
          </h2>
          <p className="mt-4 text-base text-white/45 max-w-lg mx-auto">
            Everything you need to pick the right part of a song and edit with confidence.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((val, i) => (
            <motion.div
              key={val.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`group relative rounded-3xl border bg-gradient-to-br ${val.bg} ${val.border} p-6 overflow-hidden cursor-default`}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at 50% 0%, ${val.accent}15, transparent 70%)` }} />

              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-2xl"
                  style={{ background: `${val.accent}15` }}>
                  {val.icon}
                </div>
                <h3 className="font-display text-base font-extrabold text-white mb-2">{val.title}</h3>
                <p className="text-sm leading-6 text-white/50">{val.body}</p>
              </div>

              {/* Accent dot */}
              <div className="absolute top-5 right-5 h-2 w-2 rounded-full opacity-60"
                style={{ background: val.accent, boxShadow: `0 0 8px ${val.accent}` }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
