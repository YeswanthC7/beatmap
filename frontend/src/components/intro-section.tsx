"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
};

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-white/[0.07] bg-white/[0.03] px-6 py-5">
      <span className="font-display text-3xl font-extrabold gradient-text">{value}</span>
      <span className="mt-1 text-xs text-white/40">{label}</span>
    </div>
  );
}

export function IntroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 px-4">
      {/* Divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-2xl"
        style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)" }} />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* Left: Text */}
          <div>
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
              <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
                What BeatMap does
              </span>
            </motion.div>

            <motion.h2
              custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="font-display mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl"
            >
              Music should help your edit,
              <br />
              <span className="gradient-text">not slow it down.</span>
            </motion.h2>

            <motion.p
              custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="mt-5 text-base leading-7 text-white/55"
            >
              Most creators waste time scrubbing through a whole song trying to figure out where to start,
              whether they can talk over it, or if it's even the right track. BeatMap does that work for you.
            </motion.p>

            <motion.ul
              custom={3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="mt-6 space-y-3"
            >
              {[
                { icon: "✂️", text: "Find the best 15, 30, or 45-second window instantly" },
                { icon: "🎙️", text: "Know exactly which parts are safe to talk over" },
                { icon: "🎬", text: "Get a simple shot plan matched to the music" },
                { icon: "⚖️", text: "Compare two songs side by side before you commit" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="mt-0.5 text-base">{item.icon}</span>
                  <span className="text-sm leading-6 text-white/60">{item.text}</span>
                </li>
              ))}
            </motion.ul>

            <motion.button
              custom={4} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              onClick={() => document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-8 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105"
            >
              Try it with a song →
            </motion.button>
          </div>

          {/* Right: Visual composition */}
          <motion.div
            custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="relative"
          >
            <div className="relative rounded-3xl border border-white/[0.07] bg-gradient-to-br from-violet-900/20 to-pink-900/10 p-6 overflow-hidden">
              {/* Background glow */}
              <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full blur-3xl"
                style={{ background: "rgba(139,92,246,0.2)" }} />

              {/* Floating feature preview cards */}
              <div className="space-y-3">
                {[
                  {
                    icon: "✂️",
                    title: "Best 15-second cut",
                    value: "0:08 — 0:23",
                    badge: "High energy",
                    badgeColor: "text-orange-300 bg-orange-500/10 border-orange-500/20",
                    bar: "from-orange-500 to-pink-500",
                    barWidth: "78%",
                  },
                  {
                    icon: "🎙️",
                    title: "Best part to talk over",
                    value: "0:34 — 0:48",
                    badge: "Great",
                    badgeColor: "text-green-300 bg-green-500/10 border-green-500/20",
                    bar: "from-green-500 to-cyan-500",
                    barWidth: "92%",
                  },
                  {
                    icon: "🎬",
                    title: "Best opening moment",
                    value: "0:04 — 0:12",
                    badge: "Strong hook",
                    badgeColor: "text-violet-300 bg-violet-500/10 border-violet-500/20",
                    bar: "from-violet-500 to-blue-500",
                    barWidth: "85%",
                  },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{card.icon}</span>
                        <p className="text-xs font-semibold text-white/70">{card.title}</p>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-base font-bold text-white">{card.value}</p>
                    <div className="mt-2 h-1 rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }} animate={inView ? { width: card.barWidth } : { width: 0 }}
                        transition={{ delay: 0.6 + i * 0.2, duration: 0.8 }}
                        className={`h-full rounded-full bg-gradient-to-r ${card.bar}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom shot plan preview */}
              <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                <p className="text-xs font-semibold text-white/50 mb-3">Simple shot plan</p>
                <div className="flex gap-2">
                  {["Opening", "Setup", "Reveal", "Payoff", "End"].map((step, i) => (
                    <motion.div key={step}
                      initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="flex-1 rounded-xl py-1.5 text-center text-[9px] font-bold border border-white/10"
                      style={{ background: `hsl(${260 + i * 20}, 70%, 20%)`, color: `hsl(${260 + i * 20}, 80%, 75%)` }}
                    >
                      {step}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <StatPill value="15+" label="Edit types" />
              <StatPill value="3" label="Cut lengths" />
              <StatPill value="8" label="Languages" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
