"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CompareResponse, EditPreset, TrackCompareResult } from "@/types/analysis";
import { PRESET_OPTIONS } from "@/types/analysis";
import { compareTrackLinks } from "@/lib/api";

interface CompareTracksProps {
  onClose: () => void;
}

const RANK_COLORS = ["#CCFF00", "#FF007F", "#66FCF1"];
const RANK_LABELS = ["WINNER", "RUNNER-UP", "3RD PLACE"];

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
          strokeLinecap="square"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${filled} ${circumference}` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-sm" style={{ color }}>{pct}</p>
        <p className="font-body text-[7px] -mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>%</p>
      </div>
    </div>
  );
}

function TrackCard({ track, index }: { track: TrackCompareResult; index: number }) {
  const color = RANK_COLORS[index] ?? "#CCFF00";
  const label = RANK_LABELS[index] ?? `#${index + 1}`;
  const isWinner = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.4 }}
      className="relative p-5"
      style={{
        border: `2px solid ${isWinner ? color + "40" : "rgba(255,255,255,0.07)"}`,
        background: isWinner ? color + "07" : "transparent",
      }}
    >
      {/* Top accent line on winner */}
      {isWinner && (
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: color }} />
      )}

      {/* Track header */}
      <div className="flex items-start gap-3 mb-4">
        {track.thumbnailUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={track.thumbnailUrl} alt={track.songTitle}
            className="h-12 w-12 shrink-0 object-cover" style={{ border: "2px solid rgba(255,255,255,0.1)" }} />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center text-xl"
            style={{ border: "2px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            🎵
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-body font-bold text-sm text-white leading-tight truncate">{track.songTitle}</p>
          <p className="font-body text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
            {track.artistName}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="font-body font-bold text-[10px] uppercase tracking-widest px-2 py-0.5"
            style={{ background: color + "20", color, border: `1px solid ${color}40` }}>
            {label}
          </span>
          <ScoreRing score={track.overallFitScore} color={color} />
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <DataRow icon="🎯" label="BEST OPENING" value={track.bestOpeningMoment} color={color} />
        {track.best15sCut && <DataRow icon="✂️" label="BEST 15S CUT" value={track.best15sCut} color={color} />}
        <DataRow icon="🎙️" label="TALK-OVER" value={track.voiceoverSuitability} color={color} />
        <DataRow icon="❤️" label="EMOTIONAL" value={track.emotionalPayoff} color={color} />
      </div>

      <p className="font-body text-xs leading-5 pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }}>
        {track.summary}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-0.5" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div className="h-full" style={{ background: color, opacity: 0.7 }}
            initial={{ width: "0%" }}
            animate={{ width: `${Math.round(track.overallFitScore * 100)}%` }}
            transition={{ duration: 0.8, delay: index * 0.12 + 0.3 }}
          />
        </div>
        <span className="font-body font-bold text-[10px]" style={{ color }}>
          {Math.round(track.overallFitScore * 100)}% FIT
        </span>
      </div>

      {track.sourceUrl && (
        <a href={track.sourceUrl} target="_blank" rel="noopener noreferrer"
          className="mt-3 block font-body font-bold text-[10px] uppercase tracking-widest transition-colors"
          style={{ color: "rgba(255,255,255,0.2)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = color)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.2)")}
        >
          OPEN ON PLATFORM ↗
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
        <span className="font-body font-bold text-[10px] uppercase tracking-wider" style={{ color: color + "aa" }}>
          {label}:{" "}
        </span>
        <span className="font-body text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{value}</span>
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
    } finally { setLoading(false); }
  };

  const presetMeta = PRESET_OPTIONS.find((p) => p.id === preset);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl uppercase text-white" style={{ letterSpacing: "0.02em" }}>
            COMPARE SONGS
          </h2>
          <p className="font-body text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            FIND THE BEST FIT BEFORE YOU START CUTTING.
          </p>
        </div>
        <button onClick={onClose}
          className="font-body font-bold text-sm transition-colors"
          style={{ color: "rgba(255,255,255,0.25)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FF003C")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
        >
          ✕ CLOSE
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="space-y-2 mb-4">
              {urls.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex h-12 w-8 shrink-0 items-center justify-center font-display text-sm"
                    style={{ color: RANK_COLORS[i] ?? "#CCFF00" }}>
                    {i + 1}
                  </div>
                  <input type="url" placeholder={`SONG ${i + 1} — YOUTUBE OR SOUNDCLOUD LINK`}
                    value={url} onChange={(e) => setUrl(i, e.target.value)}
                    className="brutal-input flex-1 px-4 py-3 text-xs uppercase tracking-wider"
                  />
                  {urls.length > 2 && (
                    <button onClick={() => removeUrl(i)}
                      className="font-body font-bold px-3 transition-colors"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#FF003C")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {urls.length < 3 && (
                <button onClick={addUrl}
                  className="ml-10 font-body font-bold text-xs uppercase tracking-widest transition-colors"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#CCFF00")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                >
                  + ADD A THIRD SONG
                </button>
              )}
            </div>

            <div className="mb-4">
              <p className="font-body font-bold text-[10px] uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.3)" }}>
                WHAT ARE YOU MAKING?
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_OPTIONS.map((opt) => (
                  <button key={opt.id} onClick={() => setPreset(opt.id)}
                    className={`preset-chip px-2.5 py-1${preset === opt.id ? " active" : ""}`}>
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 border-2 px-4 py-3 text-sm"
                style={{ borderColor: "#FF003C", background: "rgba(255,0,60,0.07)", color: "#ff6b6b" }}>
                {error}
              </div>
            )}

            <button onClick={handleCompare} disabled={loading}
              className="w-full font-display text-xl uppercase py-4 transition-all disabled:opacity-40"
              style={{ background: "#CCFF00", color: "#000", letterSpacing: "0.05em" }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#fff")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#CCFF00")}
            >
              {loading ? "COMPARING…" : "COMPARE SONGS →"}
            </button>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-4">

            {/* Winner banner */}
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className="relative p-5"
              style={{ border: "2px solid #CCFF0040", background: "#CCFF0008" }}>
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "#CCFF00" }} />
              <p className="font-body font-bold text-[10px] uppercase tracking-widest mb-1"
                style={{ color: "rgba(204,255,0,0.5)" }}>
                BEST OVERALL — {presetMeta?.icon} {presetMeta?.label?.toUpperCase() ?? preset.toUpperCase()}
              </p>
              <p className="font-display text-2xl uppercase text-white mb-2"
                style={{ letterSpacing: "0.02em" }}>
                🏆 {result.winnerTitle}
              </p>
              <p className="font-body text-sm leading-6" style={{ color: "rgba(255,255,255,0.55)" }}>
                {result.winnerReason}
              </p>
            </motion.div>

            <div className={`grid gap-3 ${result.tracks.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
              {result.tracks.map((track, i) => (
                <TrackCard key={i} track={track} index={i} />
              ))}
            </div>

            <button onClick={() => { setResult(null); setUrls(["", ""]); }}
              className="font-body font-bold text-xs uppercase tracking-widest transition-colors"
              style={{ color: "rgba(255,255,255,0.25)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#CCFF00")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
            >
              ← COMPARE DIFFERENT SONGS
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
