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
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none ring-0 transition focus:border-cyan-400/50 focus:bg-white/8 focus:ring-1 focus:ring-cyan-400/30 disabled:opacity-50"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Analysing…" : "Analyse"}
        </button>
      </div>
      {validationError ? (
        <p className="mt-2 text-xs text-red-400">{validationError}</p>
      ) : null}
    </form>
  );
}
