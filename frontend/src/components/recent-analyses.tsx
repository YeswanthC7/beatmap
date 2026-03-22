"use client";

import { useEffect, useState } from "react";
import type { AnalysisRecord } from "@/types/analysis";
import { deleteAnalysis, fetchAnalyses } from "@/lib/api";
import { formatPlatform } from "@/lib/platform";

interface RecentAnalysesProps {
  onOpen: (id: string) => void;
  refreshKey: number;
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const MODE_LABEL: Record<string, string> = {
  metadata_only: "Metadata",
  recorded_audio: "Audio",
};

export function RecentAnalyses({ onOpen, refreshKey }: RecentAnalysesProps) {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAnalyses();
      setAnalyses(data);
    } catch {
      setError("Could not load history. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [refreshKey]);

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    } catch {
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-center">
        <p className="text-sm text-red-300">{error}</p>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-white/40">No saved analyses yet. Run your first one above.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {analyses.map((record) => (
        <button
          key={record.id}
          onClick={() => onOpen(record.id)}
          className="group relative rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-400/30 hover:bg-white/8"
        >
          {record.thumbnailUrl ? (
            <img
              src={record.thumbnailUrl}
              alt={record.songTitle}
              className="mb-3 h-28 w-full rounded-xl object-cover"
            />
          ) : (
            <div className="mb-3 flex h-28 items-center justify-center rounded-xl border border-white/5 bg-black/20">
              <span className="text-xs text-white/20">No artwork</span>
            </div>
          )}
          <p className="truncate text-sm font-semibold text-white">
            {record.songTitle}
          </p>
          <p className="truncate text-xs text-white/50">{record.artistName}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/40">
              {formatPlatform(record.platform)}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/30">
              {MODE_LABEL[record.analysisMode] ?? record.analysisMode}
            </span>
            <span className="ml-auto text-xs text-white/25">
              {formatDate(record.createdAt)}
            </span>
          </div>
          <button
            onClick={(e) => handleDelete(e, record.id)}
            disabled={deletingId === record.id}
            className="absolute right-3 top-3 hidden rounded-lg border border-white/10 bg-black/40 p-1.5 text-white/30 transition hover:text-red-400 group-hover:flex"
            aria-label="Delete analysis"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </button>
        </button>
      ))}
    </div>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  );
}
