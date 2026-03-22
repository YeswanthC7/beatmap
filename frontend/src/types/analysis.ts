export type InputSource = "link" | "mic";
export type AnalysisMode = "metadata_only" | "recorded_audio";

export type SceneFitCategory =
  | "intro"
  | "reveal"
  | "montage"
  | "workout_peak"
  | "end_card"
  | "boss_fight"
  | "night_drive"
  | "study_focus";

export interface TimeRange {
  start: string;
  end: string;
}

export interface MoodShift {
  time: string;
  label: string;
  intensity: "low" | "medium" | "high";
  description: string;
}

export interface SceneFitSuggestion {
  category: SceneFitCategory;
  confidence: number;
  reason: string;
  bestRange: TimeRange;
}

export interface VoiceoverSafeSection {
  range: TimeRange;
  reason: string;
}

export interface HookWindow {
  range: TimeRange;
  reason: string;
}

export interface AlternativeTrack {
  title: string;
  artist: string;
  source: string;
  reason: string;
}

export interface SongAnalysisResult {
  id?: string | null;
  songTitle: string;
  artistName: string;
  source: InputSource;
  sourceLabel: string;
  platform: string;
  analysisMode: AnalysisMode;
  youtubeVideoId?: string | null;
  soundcloudPath?: string | null;
  thumbnailUrl?: string | null;
  summary: string;
  moodShifts: MoodShift[];
  sceneFits: SceneFitSuggestion[];
  voiceoverSafeSections: VoiceoverSafeSection[];
  hookWindow: HookWindow;
  alternatives: AlternativeTrack[];
}

export interface AnalysisRecord {
  id: string;
  createdAt: string;
  platform: string;
  sourceLabel: string;
  songTitle: string;
  artistName: string;
  thumbnailUrl?: string | null;
  analysisMode: AnalysisMode;
}

export interface AnalysisListResponse {
  analyses: AnalysisRecord[];
}
