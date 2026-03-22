"use client";

import { useState } from "react";
import type { CompareResponse, EditPreset } from "@/types/analysis";
import { PRESET_OPTIONS } from "@/types/analysis";
import { compareTrackLinks } from "@/lib/api";

interface CompareTracksProps {
  onClose: () => void;
}

export function CompareTracks({ onClose }: CompareTracksProps) {
  const [urls, setUrls] = useState(["", ""]);
  const [preset, setPreset] = useState<EditPreset>("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CompareResponse | null>(null);

  const addUrl = () => {
    if (urls.length < 3) setUrls([...urls, ""]);
  };

  const setUrl = (i: number, val: string) => {
    const next = [...urls];
    next[i] = val;
    setUrls(next);
  };

  const removeUrl = (i: number) => {
    if (urls.length <= 2) return;
    setUrls(urls.filter((_, idx) => idx !== i));
  };

  const handleCompare = async () => {
    const validUrls = urls.filter((u) => u.trim());
    if (validUrls.length < 2) {
      setError("Please enter at least 2 song links.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await compareTrackLinks(validUrls, preset);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Comparison failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const presetLabel = PRESET_OPTIONS.find((p) => p.id === preset)?.label ?? preset;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-extrabold text-white">Compare songs</h2>
          <p className="text-xs text-white/40 mt-0.5">
            Find the best song for your edit before you start cutting.
          </p>
        </div>
        <button onClick={onClose} className="text-white/30 hover:text-white/60 text-sm transition-colors">
          ✕ Close
        </button>
      </div>

      {!result && (
        <>
          <div className="space-y-2">
            {urls.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  placeholder={`Song ${i + 1} — paste a YouTube or SoundCloud link`}
                  value={url}
                  onChange={(e) => setUrl(i, e.target.value)}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-orange-500/40 focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
                />
                {urls.length > 2 && (
                  <button
                    onClick={() => removeUrl(i)}
                    className="px-3 text-white/25 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {urls.length < 3 && (
              <button
                onClick={addUrl}
                className="text-xs font-semibold text-orange-400/70 hover:text-orange-400 transition-colors"
              >
                + Add a third song
              </button>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-white/50 mb-2">What are you making?</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPreset(opt.id)}
                  className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all ${
                    preset === opt.id
                      ? "border-orange-500/50 bg-orange-500/15 text-orange-200"
                      : "border-white/10 text-white/35 hover:text-white/60"
                  }`}
                >
                  <span>{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
          )}

          <button
            onClick={handleCompare}
            disabled={loading}
            className="w-full rounded-2xl border border-orange-500/40 bg-gradient-to-r from-orange-500/20 to-pink-500/20 py-3 text-sm font-bold text-orange-200 transition-all hover:from-orange-500/30 hover:to-pink-500/30 disabled:opacity-50"
          >
            {loading ? "Comparing songs…" : "Compare songs →"}
          </button>
        </>
      )}

      {result && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.07] p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-400/70 mb-1">
              Best overall for {presetLabel}
            </p>
            <p className="font-display text-lg font-extrabold text-white mb-2">{result.winnerTitle}</p>
            <p className="text-sm leading-6 text-white/60">{result.winnerReason}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.tracks.map((track, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-4 ${
                  i === 0
                    ? "border-orange-500/25 bg-orange-500/[0.05]"
                    : "border-white/[0.06] bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {track.thumbnailUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={track.thumbnailUrl} alt={track.songTitle} className="h-10 w-10 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-lg">🎵</div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{track.songTitle}</p>
                    <p className="text-xs text-white/40">{track.artistName}</p>
                  </div>
                  {i === 0 && (
                    <span className="ml-auto rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-300">
                      Winner
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <Row label="Best opening" value={track.bestOpeningMoment} />
                  {track.best15sCut && <Row label="Best 15s cut" value={track.best15sCut} />}
                  <Row label="For talking over" value={track.voiceoverSuitability} />
                  <Row label="Emotional payoff" value={track.emotionalPayoff} />
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-orange-500 opacity-70"
                      style={{ width: `${Math.round(track.overallFitScore * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white/30">
                    {Math.round(track.overallFitScore * 100)}% fit
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => { setResult(null); setUrls(["", ""]); }}
            className="text-xs font-semibold text-white/30 hover:text-white/60 transition-colors"
          >
            ← Start over
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-white/30 font-semibold">{label}: </span>
      <span className="text-white/60">{value}</span>
    </div>
  );
}
