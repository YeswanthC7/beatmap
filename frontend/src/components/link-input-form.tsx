"use client";

import { useState } from "react";

interface LinkInputFormProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export function LinkInputForm({ onSubmit, loading }: LinkInputFormProps) {
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setValidationError("Please enter a YouTube or SoundCloud link.");
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      setValidationError("Please enter a valid URL starting with https://");
      return;
    }
    setValidationError("");
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (validationError) setValidationError("");
          }}
          placeholder="Paste a YouTube or SoundCloud link…"
          disabled={loading}
          className="flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-sm text-white placeholder-white/25 outline-none transition focus:border-orange-400/50 focus:bg-white/[0.09] focus:ring-2 focus:ring-orange-400/20 disabled:opacity-50"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="font-display rounded-2xl px-8 py-4 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: loading || !url.trim()
              ? "rgba(255,255,255,0.1)"
              : "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
            boxShadow: loading || !url.trim() ? "none" : "0 0 24px rgba(249,115,22,0.35)",
          }}
        >
          {loading ? "Analysing…" : "Analyse →"}
        </button>
      </div>
      {validationError ? (
        <p className="mt-2 text-xs text-red-400">{validationError}</p>
      ) : null}
    </form>
  );
}
