export type InputSource = "link" | "mic";
export type AnalysisMode = "metadata_only" | "recorded_audio";

export type EditPreset =
  | "instagram_reel"
  | "tiktok_short"
  | "youtube_intro"
  | "travel_montage"
  | "product_ad"
  | "fashion_luxury"
  | "emotional_story"
  | "wedding_memory"
  | "gym_hype"
  | "podcast_intro"
  | "documentary"
  | "gaming_montage"
  | "vlog"
  | "slideshow"
  | "general";

export const PRESET_OPTIONS: { id: EditPreset; label: string; icon: string; hint: string }[] = [
  { id: "instagram_reel",   label: "Instagram Reel",       icon: "📸", hint: "Short, punchy 15–30s" },
  { id: "tiktok_short",     label: "TikTok / Short",       icon: "🎵", hint: "Hook in the first second" },
  { id: "youtube_intro",    label: "YouTube Intro",        icon: "▶️",  hint: "10–20s channel opener" },
  { id: "travel_montage",   label: "Travel Montage",       icon: "✈️",  hint: "Scenic, sweeping builds" },
  { id: "product_ad",       label: "Product Ad",           icon: "🛍️",  hint: "Clean intro, clear payoff" },
  { id: "fashion_luxury",   label: "Fashion / Luxury",     icon: "💎", hint: "Smooth, elegant atmosphere" },
  { id: "emotional_story",  label: "Emotional Story",      icon: "🎭", hint: "Gentle builds, heartfelt peaks" },
  { id: "wedding_memory",   label: "Wedding / Memory",     icon: "💍", hint: "Warm, romantic sections" },
  { id: "gym_hype",         label: "Gym / Hype Edit",      icon: "💪", hint: "Hard drops, intense peaks" },
  { id: "podcast_intro",    label: "Podcast Intro",        icon: "🎙️",  hint: "Professional 5–15s opener" },
  { id: "documentary",      label: "Documentary",          icon: "🎬", hint: "Cinematic builds and tension" },
  { id: "gaming_montage",   label: "Gaming Montage",       icon: "🎮", hint: "Intense beats, dramatic finish" },
  { id: "vlog",             label: "Vlog",                 icon: "📹", hint: "Upbeat, doesn't overpower speech" },
  { id: "slideshow",        label: "Slideshow / Memories", icon: "🖼️",  hint: "Gentle, nostalgic sections" },
  { id: "general",          label: "General Edit",         icon: "🎵", hint: "Balanced for any use" },
];

export type SceneFitCategory =
  | "intro" | "reveal" | "montage" | "workout_peak"
  | "end_card" | "boss_fight" | "night_drive" | "study_focus";

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
  safetyLevel: "great" | "okay" | "risky";
  reason: string;
}

export interface HookWindow {
  range: TimeRange;
  reason: string;
}

export interface BestCut {
  durationLabel: string;
  start: string;
  end: string;
  title: string;
  reason: string;
  confidence: number;
}

export interface ShotPlanStep {
  label: string;
  start: string;
  end: string;
  visualPurpose: string;
  explanation: string;
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
  preset: EditPreset;
  analysisMode: AnalysisMode;
  youtubeVideoId?: string | null;
  soundcloudPath?: string | null;
  thumbnailUrl?: string | null;
  summary: string;
  moodShifts: MoodShift[];
  sceneFits: SceneFitSuggestion[];
  voiceoverSafeSections: VoiceoverSafeSection[];
  hookWindow: HookWindow;
  bestCuts: BestCut[];
  shotPlan: ShotPlanStep[];
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
  preset: EditPreset;
}

export interface AnalysisListResponse {
  analyses: AnalysisRecord[];
}

// Trending
export type TrendLabel = "new" | "rising" | "steady";
export type TrendingLanguage =
  | "worldwide" | "english" | "hindi" | "telugu"
  | "tamil" | "spanish" | "korean" | "japanese";

export interface TrendingTrack {
  id: string;
  rank: number;
  title: string;
  artist: string;
  thumbnailUrl?: string | null;
  language: string;
  region: string;
  source: string;
  sourceUrl: string;
  trendLabel: TrendLabel;
}

export interface TrendingResponse {
  language: string;
  tracks: TrendingTrack[];
  cached: boolean;
}

// Compare
export interface TrackCompareResult {
  rank: number;
  songTitle: string;
  artistName: string;
  thumbnailUrl?: string | null;
  sourceUrl: string;
  bestOpeningMoment: string;
  best15sCut?: string | null;
  voiceoverSuitability: string;
  emotionalPayoff: string;
  overallFitScore: number;
  overallFitReason: string;
  summary: string;
}

export interface CompareResponse {
  preset: EditPreset;
  winnerTitle: string;
  winnerReason: string;
  tracks: TrackCompareResult[];
}
