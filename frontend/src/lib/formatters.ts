import type { SceneFitCategory } from "@/types/analysis";

export function formatSceneFitCategory(category: SceneFitCategory): string {
  switch (category) {
    case "intro":
      return "Intro";
    case "reveal":
      return "Reveal";
    case "montage":
      return "Montage";
    case "workout_peak":
      return "Workout Peak";
    case "end_card":
      return "End Card";
    case "boss_fight":
      return "Boss Fight";
    case "night_drive":
      return "Night Drive";
    case "study_focus":
      return "Study Focus";
    default:
      return category;
  }
}
