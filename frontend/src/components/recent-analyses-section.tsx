"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { AnalysisRecord } from "@/types/analysis";
import { PRESET_OPTIONS } from "@/types/analysis";
import { fetchAnalyses } from "@/lib/api";

interface RecentAnalysesSectionProps {
  refreshKey: number;
  onOpen: (id: string) => void;
}

export function RecentAnalysesSection({ refreshKey, onOpen }: RecentAnalysesSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchAnalyses()
      .then(setAnalyses)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (!loading && analyses.length === 0) return null;

  return (
    <section ref={ref} className="relative py-20 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-2xl"
        style={{ background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.25), transparent)" }} />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-end justify-between gap-4"
        >
          <div>
            <span className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-300 mb-3">
              Your work
            </span>
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              Pick up where you left off
            </h2>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse rounded-3xl border border-white/[0.05] bg-white/[0.02] p-4 h-28" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {analyses.slice(0, 6).map((rec, i) => {
              const presetMeta = PRESET_OPTIONS.find(p => p.id === rec.preset);
              const platformIcon = rec.platform === "youtube" ? "▶" : rec.platform === "soundcloud" ? "☁" : "🎙";
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -4, transition: { duration: 0.15 } }}
                  className="group relative flex flex-col rounded-3xl border border-white/[0.06] bg-white/[0.02] p-5 cursor-default overflow-hidden"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {rec.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={rec.thumbnailUrl} alt={rec.songTitle}
                        className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-lg border border-white/10">
                        {platformIcon}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{rec.songTitle}</p>
                      <p className="truncate text-xs text-white/40">{rec.artistName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    {presetMeta && (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-white/40">
                        {presetMeta.icon} {presetMeta.label}
                      </span>
                    )}
                    <span className="ml-auto text-[10px] text-white/20">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Hover action */}
                  <motion.button
                    initial={{ opacity: 0, y: 6 }} whileHover={{ opacity: 1, y: 0 }}
                    className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-2 rounded-b-3xl bg-gradient-to-t from-violet-500/20 to-transparent py-3 text-xs font-bold text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onOpen(rec.id)}
                  >
                    Open analysis →
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
