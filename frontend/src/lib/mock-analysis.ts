import type { SongAnalysisResult } from "@/types/analysis";

export const mockAnalysis: SongAnalysisResult = {
  songTitle: "Midnight Pulse",
  artistName: "Nova Echo",
  source: "link",
  sourceLabel: "youtube.com/watch?v=dQw4w9WgXcQ",
  platform: "youtube",
  thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  summary:
    "A cinematic electronic track with a slow atmospheric build, a confident mid-track lift, and a strong late hook that fits reveal, night-drive, and montage-style content.",
  moodShifts: [
    {
      time: "00:12",
      label: "Atmospheric build",
      intensity: "low",
      description:
        "Soft textures and gradual tension make this section suitable for intros and establishing shots.",
    },
    {
      time: "00:38",
      label: "Momentum lift",
      intensity: "medium",
      description:
        "Percussion and synth energy increase, making it a good fit for transition sequences and movement-heavy visuals.",
    },
    {
      time: "01:04",
      label: "Main hook lands",
      intensity: "high",
      description:
        "The strongest musical payoff arrives here, creating a compelling drop point for reveals or emotionally charged edits.",
    },
  ],
  sceneFits: [
    {
      category: "reveal",
      confidence: 0.94,
      reason:
        "The delayed build and strong payoff create an ideal setup for a product reveal or dramatic visual turn.",
      bestRange: {
        start: "00:58",
        end: "01:15",
      },
    },
    {
      category: "night_drive",
      confidence: 0.91,
      reason:
        "Steady pulse, wide atmosphere, and controlled energy make it feel immersive for late-night motion visuals.",
      bestRange: {
        start: "00:34",
        end: "01:10",
      },
    },
    {
      category: "montage",
      confidence: 0.88,
      reason:
        "The evolving energy profile supports edits with cuts, progression, and visual pacing changes.",
      bestRange: {
        start: "00:24",
        end: "01:20",
      },
    },
  ],
  voiceoverSafeSections: [
    {
      range: {
        start: "00:00",
        end: "00:18",
      },
      reason:
        "Minimal melodic density leaves room for spoken narration without major clashes.",
    },
    {
      range: {
        start: "00:42",
        end: "00:54",
      },
      reason:
        "Consistent instrumental backing supports voiceovers while maintaining momentum.",
    },
  ],
  hookWindow: {
    range: {
      start: "01:02",
      end: "01:13",
    },
    reason:
      "This section contains the strongest emotional and rhythmic payoff, making it ideal for short-form hooks.",
  },
  alternatives: [
    {
      title: "City Lights Motion",
      artist: "Aria Vector",
      source: "Free Music Archive",
      reason:
        "Offers a similar cinematic-electronic rise with a slightly softer drop for branded content.",
    },
    {
      title: "Neon Run",
      artist: "Static Harbor",
      source: "Internet Archive",
      reason:
        "Matches the night-drive atmosphere and pulse-driven pacing with a more ambient texture.",
    },
  ],
};
