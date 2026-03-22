import type {
  AnalysisListResponse,
  AnalysisRecord,
  SongAnalysisResult,
} from "@/types/analysis";

export interface AnalyzeLinkRequest {
  url: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) message = body.detail;
    } catch {
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function analyzeSongLink(
  payload: AnalyzeLinkRequest,
): Promise<SongAnalysisResult> {
  const res = await fetch("/api/analyze/link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  return handleResponse<SongAnalysisResult>(res);
}

export async function analyzeAudio(file: File): Promise<SongAnalysisResult> {
  const form = new FormData();
  form.append("file", file, file.name);
  const res = await fetch("/api/analyze/audio", {
    method: "POST",
    body: form,
    cache: "no-store",
  });
  return handleResponse<SongAnalysisResult>(res);
}

export async function fetchAnalyses(): Promise<AnalysisRecord[]> {
  const res = await fetch("/api/analyses", { cache: "no-store" });
  const data = await handleResponse<AnalysisListResponse>(res);
  return data.analyses;
}

export async function fetchAnalysisById(id: string): Promise<SongAnalysisResult> {
  const res = await fetch(`/api/analyses/${id}`, { cache: "no-store" });
  return handleResponse<SongAnalysisResult>(res);
}

export async function deleteAnalysis(id: string): Promise<void> {
  const res = await fetch(`/api/analyses/${id}`, { method: "DELETE" });
  await handleResponse<unknown>(res);
}
