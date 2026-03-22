import type {
  AnalysisListResponse,
  AnalysisRecord,
  CompareResponse,
  EditPreset,
  SongAnalysisResult,
  TrendingLanguage,
  TrendingResponse,
} from "@/types/analysis";

export interface AnalyzeLinkRequest {
  url: string;
  preset?: EditPreset;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) message = body.detail;
    } catch {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function analyzeSongLink(payload: AnalyzeLinkRequest): Promise<SongAnalysisResult> {
  const res = await fetch("/api/analyze/link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: payload.url, preset: payload.preset ?? "general" }),
    cache: "no-store",
  });
  return handleResponse<SongAnalysisResult>(res);
}

export async function analyzeAudio(file: File, preset: EditPreset = "general"): Promise<SongAnalysisResult> {
  const form = new FormData();
  form.append("file", file, file.name);
  form.append("preset", preset);
  const res = await fetch("/api/analyze/audio", {
    method: "POST",
    body: form,
    cache: "no-store",
  });
  return handleResponse<SongAnalysisResult>(res);
}

export async function fetchTrending(language: TrendingLanguage = "worldwide", limit = 10): Promise<TrendingResponse> {
  const res = await fetch(`/api/trending?language=${language}&limit=${limit}`, { cache: "no-store" });
  return handleResponse<TrendingResponse>(res);
}

export async function compareTrackLinks(urls: string[], preset: EditPreset = "general"): Promise<CompareResponse> {
  const res = await fetch("/api/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls, preset }),
    cache: "no-store",
  });
  return handleResponse<CompareResponse>(res);
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
