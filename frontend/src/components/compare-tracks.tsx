"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CompareResponse, EditPreset, TrackCompareResult } from "@/types/analysis";
import { PRESET_OPTIONS } from "@/types/analysis";
import { compareTrackLinks } from "@/lib/api";

interface CompareTracksProps {
  onClose: () => void;
}

const RANK_COLORS = ["#f97316", "#a78bfa", "#22c55e"];
const RANK_LABELS = ["Winner", "Runner-up", "3rd place"];

function ScoreRing({ score, color }: { score: number; color: string }) {
  const pct = Math.round(score * 100);
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const filled = (pct / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
      <svg width="56" height="56" className="-rotate-90">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <motion.circle
          cx="28" cy="28" r={radius} fill="none" stroke={color} strokeWidth="3"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${filled} ${circumference}` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-xs font-extrabold" style={{ color }}>{pct}</p>
        <p className="text-[7px] text-white/25 -mt-0.5">%</p>
      </div>
    </div>
  );
}

function TrackCard({ track, index }: { track: TrackCompareResult; index: number }) {
  const color = RANK_COLORS[index] ?? "#8b5cf6";
  const label = RANK_LABELS[index] ?? `#${index + 1}`;
  const isWinner = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl border p-5"
      style={{
        borderColor: isWinner ? `${color}30` : "rgba(255,255,255,0.07)",
        background: isWinner ? `${color}06` : "rgba(0,0,0,0.2)",
        boxShadow: isWinner ? `0 0 40px ${color}12` : "none",
      }}
    >
      {isWinner && (
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
      )}

      {/* Track header */}
      <div className="flex items-start gap-3 mb-4">
        {track.thumbnailUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={track.thumbnailUrl} alt={track.songTitle}
            className="h-12 w-12 shrink-0 rounded-xl object-cover border border-white/10" />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl">🎵</div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-tight truncate">{track.songTitle}</p>
          <p className="text-xs text-white/40 truncate">{track.artistName}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ background: `${color}20`, color }}>
            {label}
          </span>
          <ScoreRing score={track.overallFitScore} color={color} />
        </div>
      </div>

      {/* Key data rows */}
      <div className="space-y-2.5 mb-3">
        <DataRow icon="🎯" label="Best opening" value={track.bestOpeningMoment} color={color} />
        {track.best15sCut && <DataRow icon="✂️" label="Best 15s cut" value={track.best15sCut} color={color} />}
        <DataRow icon="🎙️" label="For talking over" value={track.voiceoverSuitability} color={color} />
        <DataRow icon="❤️" label="Emotional payoff" value={track.emotionalPayoff} color={color} />
      </div>

      {/* Summary */}
      <p className="text-xs leading-5 text-white/45 border-t border-white/[0.06] pt-3">{track.summary}</p>

      {/* Fit score bar */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full bg-white/10">
          <motion.div className="h-full rounded-full" style={{ background: color, opacity: 0.7 }}
            initial={{ width: "0%" }}
            animate={{ width: `${Math.round(track.overallFitScore * 100)}%` }}
            transition={{ duration: 0.8, delay: index * 0.12 + 0.3, ease: "easeOut" }}
          />
        </div>
        <span className="text-[10px] font-bold" style={{ color }}>
          {Math.round(track.overallFitScore * 100)}% fit
        </span>
      </div>

      {track.sourceUrl && (
        <a href={track.sourceUrl} target="_blank" rel="noopener noreferrer"
          className="mt-3 block text-[10px] font-semibold text-white/20 hover:text-white/45 transition-colors">
          Open on platform ↗
        </a>
      )}
    </motion.div>
  );
}

function DataRow({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="flex gap-2 text-xs">
      <span className="shrink-0 mt-0.5">{icon}</span>
      <div>
        <span className="font-semibold text-white/30">{label}: </span>
        <span className="text-white/60">{value}</span>
      </div>
    </div>
  );
}

export function CompareTracks({ onClose }: CompareTracksProps) {
  const [urls, setUrls] = useState(["", ""]);
  const [preset, setPreset] = useState<EditPreset>("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CompareResponse | null>(null);

  const addUrl = () => { if (urls.length < 3) setUrls([...urls, ""]); };
  const setUrl = (i: number, val: string) => { const n = [...urls]; n[i] = val; setUrls(n); };
  const removeUrl = (i: number) => { if (urls.length <= 2) return; setUrls(urls.filter((_, idx) => idx !== i)); };

  const handleCompare = async () => {
    const validUrls = urls.filter((u) => u.trim());
    if (validUrls.length < 2) { setError("Please enter at least 2 song links."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      setResult(await compareTrackLinks(validUrls, preset));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Comparison failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const presetMeta = PRESET_OPTIONS.find((p) => p.id === preset);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-extrabold text-white">Compare songs</h2>
          <p className="text-xs text-white/40 mt-0.5">Find the best fit before you start cutting.</p>
        </div>
        <button onClick={onClose} className="text-white/25 hover:text-white/55 text-sm transition-colors">✕</button>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* URL inputs */}
            <div className="space-y-2 mb-4">
              {urls.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex h-12 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                    style={{ color: RANK_COLORS[i] ?? "#8b5cf6" }}>
                    {i + 1}
                  </div>
                  <input type="url" placeholder={`Song ${i + 1} — YouTube or SoundCloud link`}
                    value={url} onChange={(e) => setUrl(i, e.target.value)}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-violet-500/40 focus:outline-none focus:ring-2 focus:ring-violet-500/10 transition-all"
                  />
                  {urls.length > 2 && (
                    <button onClick={() => removeUrl(i)}
                      className="px-3 text-white/25 hover:text-red-400 transition-colors text-sm">✕</button>
                  )}
                </div>
              ))}
              {urls.length < 3 && (
                <button onClick={addUrl}
                  className="ml-10 text-xs font-semibold text-violet-400/60 hover:text-violet-400 transition-colors">
                  + Add a third song
                </button>
              )}
            </div>

            {/* Preset */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-white/40 mb-2">What are you making?</p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_OPTIONS.map((opt) => (
                  <button key={opt.id} onClick={() => setPreset(opt.id)}
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all ${
                      preset === opt.id
                        ? "border-violet-500/40 bg-violet-500/15 text-violet-200"
                        : "border-white/10 text-white/35 hover:text-white/60"
                    }`}>
                    <span>{opt.icon}</span> {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
            )}

            <button onClick={handleCompare} disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.01] disabled:opacity-40 disabled:hover:scale-100">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Comparing songs…
                </span>
              ) : "Compare songs →"}
            </button>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-4">

            {/* Winner banner */}
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-3xl border border-orange-500/25 bg-orange-500/[0.06] p-5"
              style={{ boxShadow: "0 0 50px rgba(249,115,22,0.08)" }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)" }} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400/60 mb-1">
                Best overall for {presetMeta?.icon} {presetMeta?.label ?? preset}
              </p>
              <p className="font-display text-2xl font-extrabold text-white mb-2">🏆 {result.winnerTitle}</p>
              <p className="text-sm leading-6 text-white/60">{result.winnerReason}</p>
            </motion.div>

            {/* Track cards */}
            <div className={`grid gap-4 ${result.tracks.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
              {result.tracks.map((track, i) => (
                <TrackCard key={i} track={track} index={i} />
              ))}
            </div>

            <button onClick={() => { setResult(null); setUrls(["", ""]); }}
              className="text-xs font-semibold text-white/25 hover:text-white/55 transition-colors">
              ← Compare different songs
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
