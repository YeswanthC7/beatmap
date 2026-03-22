"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WorkflowSection } from "@/components/workflow-section";
import { ComparisonPreview } from "@/components/comparison-preview";
import { SiteFooter } from "@/components/site-footer";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen text-white">
      {/* Simple top nav */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <div className="flex w-full max-w-5xl items-center justify-between rounded-full border border-white/[0.07] bg-black/40 px-5 py-3 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500">
              <span className="text-xs font-black text-white">B</span>
            </div>
            <span className="font-display text-sm font-extrabold text-white">BeatMap</span>
          </Link>
          <Link href="/"
            className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-xs font-semibold text-white/60 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Page header */}
      <div className="relative pt-36 pb-4 px-4 text-center">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full blur-[100px]"
          style={{ background: "rgba(139,92,246,0.12)" }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 mb-4">
            How it works
          </span>
          <h1 className="font-display text-5xl font-extrabold text-white sm:text-6xl">
            From song to{" "}
            <span className="gradient-text-blue">edit plan</span>
          </h1>
          <p className="mt-4 text-base text-white/45 max-w-md mx-auto">
            Three steps. No guessing. Just paste a link and BeatMap does the thinking.
          </p>
        </motion.div>
      </div>

      <WorkflowSection />
      <ComparisonPreview />

      {/* CTA */}
      <div className="px-4 py-16 text-center">
        <Link href="/#analyze"
          className="inline-block rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-9 py-4 text-sm font-bold text-white shadow-xl shadow-violet-500/25 transition-all hover:scale-105">
          Try it with your song →
        </Link>
      </div>

      <SiteFooter />
    </div>
  );
}
