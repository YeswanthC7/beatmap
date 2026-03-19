export type InputSource = "link" | "mic";

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
  songTitle: string;
  artistName: string;
  source: InputSource;
  sourceLabel: string;
  platform: string;
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
