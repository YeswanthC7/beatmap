"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const VALUES = [
  {
    icon: "✂️",
    title: "Find the best 15 seconds",
    body: "Stop scrubbing. BeatMap shows you the strongest windows and tells you why they work.",
    accent: "#f97316",
    bg: "from-orange-500/10 to-orange-500/5",
    border: "border-orange-500/20",
    creature: "/creatures/producer.png",
  },
  {
    icon: "🎙️",
    title: "Know where to talk over",
    body: "Clear labels — Great, Could work, or May compete — so your voice always fits.",
    accent: "#06b6d4",
    bg: "from-cyan-500/10 to-cyan-500/5",
    border: "border-cyan-500/20",
    creature: null,
  },
  {
    icon: "🔥",
    title: "Use trending songs instantly",
    body: "Browse what's popular in 8 languages and analyze any track in one click.",
    accent: "#ec4899",
    bg: "from-pink-500/10 to-pink-500/5",
    border: "border-pink-500/20",
    creature: "/creatures/cyberdj.png",
  },
  {
    icon: "🎬",
    title: "Get a simple shot plan",
    body: "See how your visuals line up with the music — from opening hook to end card.",
    accent: "#8b5cf6",
    bg: "from-violet-500/10 to-violet-500/5",
    border: "border-violet-500/20",
    creature: null,
  },
];

export function ValueGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-20 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-2xl"
        style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)" }} />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
            What BeatMap helps you{" "}
            <span className="gradient-text">do faster</span>
          </h2>
          <p className="mt-3 text-sm text-white/40 max-w-sm mx-auto">
            Everything you need to pick the right part of a song.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((val, i) => (
            <motion.div
              key={val.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`group relative rounded-3xl border bg-gradient-to-br ${val.bg} ${val.border} overflow-hidden cursor-default`}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at 50% 0%, ${val.accent}12, transparent 70%)` }} />

              {/* Creature cameo */}
              {val.creature && (
                <div className="pointer-events-none absolute bottom-0 right-0 w-20 opacity-20 group-hover:opacity-35 transition-opacity duration-500 select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={val.creature} alt="" className="w-full object-contain object-bottom" />
                </div>
              )}

              <div className="relative p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-xl"
                  style={{ background: `${val.accent}15` }}>
                  {val.icon}
                </div>
                <h3 className="font-display text-sm font-extrabold text-white mb-1.5">{val.title}</h3>
                <p className="text-xs leading-5 text-white/45">{val.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Link to how it works */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }} className="mt-8 text-center"
        >
          <Link href="/how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-xs font-semibold text-white/45 hover:text-white hover:bg-white/[0.07] transition-all">
            See how it works in detail →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
