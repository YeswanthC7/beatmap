"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "PASTE A LINK",
    desc: "Drop any YouTube or SoundCloud URL into BeatMap. We detect the platform automatically — no setup, no login.",
    accent: "#CCFF00",
  },
  {
    num: "02",
    title: "PICK YOUR PRESET",
    desc: "Choose what you're making: TikTok, Instagram Reel, Travel Montage, Wedding Memory, Gym Hype Edit — 15 presets and counting. The AI calibrates its output for your exact format.",
    accent: "#FF007F",
  },
  {
    num: "03",
    title: "AI ANALYSES THE SONG",
    desc: "Our engine (Groq LLaMA-3.3 + Gemini Flash) maps every energy shift, mood change, and instrumental beat in the track. No audio download needed.",
    accent: "#66FCF1",
  },
  {
    num: "04",
    title: "GET YOUR EDIT PLAN",
    desc: "You receive: the best 15s / 30s / 60s cuts, the hook moment timestamp, voiceover-safe windows, a step-by-step shot plan, and scene-fit suggestions — all timed to the second.",
    accent: "#CCFF00",
  },
  {
    num: "05",
    title: "START CUTTING",
    desc: "Jump straight to your NLE with exact timestamps. Compare multiple tracks side-by-side. Save results to history and revisit anytime.",
    accent: "#FF007F",
  },
];

const FEATURES = [
  { icon: "⚡", label: "HOOK DETECTION", desc: "Pinpoints the exact moment that grabs attention." },
  { icon: "✂️", label: "BEST CUTS",      desc: "15s / 30s / 60s clips ranked by energy and fit." },
  { icon: "🎙️", label: "VOICEOVER ZONES", desc: "Quiet windows perfect for talking over." },
  { icon: "🎬", label: "SHOT PLAN",      desc: "Step-by-step visual plan tied to the music." },
  { icon: "📊", label: "COMPARE TRACKS", desc: "Rank 2–3 songs by fit score for your project." },
  { icon: "🔥", label: "LIVE TRENDING",  desc: "10 language charts refreshed in real time." },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen text-white" style={{ background: "#0B0C10" }}>
      {/* Nav */}
      <nav className="fixed top-0 w-full flex items-center justify-between px-8 py-6 z-50"
        style={{ mixBlendMode: "difference" }}>
        <Link href="/" className="font-display text-white text-2xl tracking-wider">BEATMAP</Link>
        <Link href="/"
          className="font-body font-bold text-sm uppercase tracking-widest px-5 py-2.5 transition-all"
          style={{ background: "#CCFF00", color: "#000" }}
          onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.opacity = "0.8")}
          onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.opacity = "1")}
        >
          ← BACK
        </Link>
      </nav>

      {/* Hero banner */}
      <div className="relative pt-40 pb-24 px-8 md:px-16 overflow-hidden"
        style={{ background: "#1F2833" }}>
        {/* Giant bg text */}
        <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center"
          style={{
            fontSize: "clamp(8rem, 30vw, 28rem)",
            color: "rgba(255,255,255,0.025)",
            fontFamily: "var(--font-display)",
            lineHeight: 1,
          }}>
          HOW
        </div>

        <motion.div className="relative z-10"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-12" style={{ background: "#CCFF00" }} />
            <span className="font-body font-bold uppercase tracking-[0.3em] text-xs" style={{ color: "#CCFF00" }}>
              THE PROCESS
            </span>
          </div>
          <h1 className="font-display uppercase text-white leading-none"
            style={{ fontSize: "clamp(3rem, 11vw, 9rem)", letterSpacing: "-0.02em" }}>
            FROM SONG TO<br />
            <span style={{ color: "#CCFF00" }}>EDIT PLAN.</span>
          </h1>
          <p className="font-body mt-6 text-lg max-w-xl" style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
            Five steps. Thirty seconds. Every timestamp you need to start cutting.
          </p>
        </motion.div>
      </div>

      {/* Steps */}
      <section className="px-8 md:px-16 py-24">
        <div className="max-w-5xl mx-auto space-y-0">
          {STEPS.map((step, i) => (
            <motion.div key={step.num}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: 0.1 }}
              className="flex gap-8 py-10 items-start"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {/* Number */}
              <span className="font-display text-6xl md:text-8xl leading-none shrink-0 select-none"
                style={{ color: step.accent, opacity: 0.3, minWidth: "2.5ch" }}>
                {step.num}
              </span>
              {/* Content */}
              <div className="pt-2">
                <h3 className="font-display uppercase text-white text-3xl md:text-4xl leading-none mb-3"
                  style={{ letterSpacing: "-0.01em" }}>
                  {step.title}
                </h3>
                <p className="font-body text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="px-8 md:px-16 py-24" style={{ background: "#1F2833" }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-px w-12" style={{ background: "#FF007F" }} />
              <span className="font-body font-bold uppercase tracking-[0.3em] text-xs" style={{ color: "#FF007F" }}>
                WHAT YOU GET
              </span>
            </div>
            <h2 className="font-display uppercase text-white leading-none"
              style={{ fontSize: "clamp(2rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}>
              ALL THE TOOLS<br />
              <span style={{ color: "#CCFF00" }}>IN ONE PLAN</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.07)" }}>
            {FEATURES.map((f) => (
              <motion.div key={f.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4 }}
                className="p-8 group transition-colors"
                style={{ background: "#1F2833" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#0B0C10")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#1F2833")}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h4 className="font-display text-xl uppercase text-white mb-2" style={{ letterSpacing: "0.02em" }}>
                  {f.label}
                </h4>
                <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-8 md:px-16 py-24" style={{ background: "#CCFF00" }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display uppercase text-black leading-none mb-8"
            style={{ fontSize: "clamp(3rem, 10vw, 8rem)", letterSpacing: "-0.04em" }}>
            READY TO CUT?
          </h2>
          <Link href="/"
            className="inline-block font-display text-2xl uppercase px-10 py-5 transition-all"
            style={{ background: "#000", color: "#CCFF00", letterSpacing: "0.05em" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#1F2833";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#000";
            }}
          >
            ANALYSE A SONG →
          </Link>
        </div>
      </section>

      {/* Footer strip */}
      <div className="px-8 md:px-16 py-6 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <span className="font-display text-xl text-white uppercase">BEATMAP</span>
        <span className="font-body text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          © {new Date().getFullYear()} BEATMAP
        </span>
      </div>
    </div>
  );
}
