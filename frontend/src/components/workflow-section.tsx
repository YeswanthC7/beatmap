"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Paste any song link",
    body: "YouTube or SoundCloud. No account needed, no setup.",
    icon: "🔗",
    color: "#8b5cf6",
    example: null,
  },
  {
    num: "02",
    title: "Choose what you're making",
    body: "Reel, travel video, podcast intro, gym edit — pick your video type.",
    icon: "🎞️",
    color: "#ec4899",
    example: null,
  },
  {
    num: "03",
    title: "Get your edit plan",
    body: "Best cuts, best talking sections, and a shot plan — all specific to your video type.",
    icon: "✅",
    color: "#06b6d4",
    example: null,
  },
];

const CUT_EXAMPLES = [
  { label: "Best 15s cut", range: "0:08 — 0:23", conf: 88, color: "#f97316", glyph: "✂️" },
  { label: "Best 30s cut", range: "0:04 — 0:34", conf: 82, color: "#8b5cf6", glyph: "✂️" },
  { label: "Best 45s cut", range: "0:08 — 0:53", conf: 79, color: "#ec4899", glyph: "✂️" },
];

const VOICEOVER_EXAMPLES = [
  { range: "0:24 — 0:36", level: "Great for talking", color: "#22c55e" },
  { range: "0:58 — 1:10", level: "Could work", color: "#f59e0b" },
  { range: "1:28 — 1:40", level: "May compete", color: "#ef4444" },
];

const SHOTPLAN_EXAMPLES = [
  { step: "Opening hook", time: "0:04 – 0:08", color: "#8b5cf6" },
  { step: "Setup",        time: "0:08 – 0:20", color: "#3b82f6" },
  { step: "Reveal",       time: "0:20 – 0:34", color: "#06b6d4" },
  { step: "Payoff",       time: "0:34 – 0:48", color: "#ec4899" },
  { step: "End card",     time: "0:48 – 0:58", color: "#f97316" },
];

export function WorkflowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="workflow" ref={ref} className="relative py-24 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-2xl"
        style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)" }} />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 mb-4">
            From song to edit plan
          </span>
          <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
            How it works in{" "}
            <span className="gradient-text-blue">3 simple steps</span>
          </h2>
          <p className="mt-4 text-base text-white/45 max-w-lg mx-auto">
            BeatMap helps you choose the part to use, find space for voice, and build a simple structure for your video.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mb-16 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div key={step.num}
              initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-4xl font-extrabold" style={{ color: step.color, opacity: 0.25 }}>
                  {step.num}
                </span>
                <span className="text-2xl">{step.icon}</span>
              </div>
              <h3 className="font-display text-base font-extrabold text-white mb-2">{step.title}</h3>
              <p className="text-sm leading-6 text-white/50">{step.body}</p>
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="absolute -right-2 top-1/2 hidden h-0.5 w-4 sm:block"
                  style={{ background: `linear-gradient(90deg, ${step.color}60, transparent)` }} />
              )}
            </motion.div>
          ))}
        </div>

        {/* Output showcase */}
        <motion.div
          initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="rounded-[2rem] border border-white/[0.07] bg-white/[0.02] p-6 md:p-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-6">
            Example analysis output
          </p>
          <div className="grid gap-6 md:grid-cols-3">

            {/* Best cuts */}
            <div>
              <p className="font-display text-sm font-extrabold text-white mb-3">Best cuts to use</p>
              <div className="space-y-3">
                {CUT_EXAMPLES.map((cut, i) => (
                  <motion.div key={cut.label}
                    initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-white/60">{cut.label}</span>
                      <span className="text-[10px] font-bold" style={{ color: cut.color }}>{cut.conf}%</span>
                    </div>
                    <p className="font-mono text-sm font-bold text-white">{cut.range}</p>
                    <div className="mt-2 h-0.5 rounded-full bg-white/10">
                      <motion.div className="h-full rounded-full" style={{ background: cut.color }}
                        initial={{ width: 0 }} animate={inView ? { width: `${cut.conf}%` } : {}}
                        transition={{ delay: 0.7 + i * 0.15, duration: 0.7 }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Voiceover */}
            <div>
              <p className="font-display text-sm font-extrabold text-white mb-3">Best parts to talk over</p>
              <div className="space-y-3">
                {VOICEOVER_EXAMPLES.map((v, i) => (
                  <motion.div key={v.range}
                    initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.55 + i * 0.1 }}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-sm font-bold text-white">{v.range}</p>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold border"
                        style={{ color: v.color, borderColor: `${v.color}30`, background: `${v.color}10` }}>
                        {v.level}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Shot plan */}
            <div>
              <p className="font-display text-sm font-extrabold text-white mb-3">Suggested shot plan</p>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-white/[0.06]" />
                <div className="space-y-2">
                  {SHOTPLAN_EXAMPLES.map((sp, i) => (
                    <motion.div key={sp.step}
                      initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex items-center gap-3 pl-7"
                    >
                      <div className="absolute left-1.5 h-3 w-3 rounded-full border-2 border-[#05000e]"
                        style={{ background: sp.color }} />
                      <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{sp.step}</span>
                          <span className="font-mono text-[10px] text-white/30">{sp.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
