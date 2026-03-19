import type { SongAnalysisResult } from "@/types/analysis";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export interface AnalyzeLinkRequest {
  url: string;
}

export async function analyzeSongLink(
  payload: AnalyzeLinkRequest,
): Promise<SongAnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/api/analyze/link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to analyze song link.");
  }

  return (await response.json()) as SongAnalysisResult;
}
