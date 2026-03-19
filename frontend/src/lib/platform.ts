export function formatPlatform(platform: string): string {
  switch (platform) {
    case "youtube":
      return "YouTube";
    case "soundcloud":
      return "SoundCloud";
    case "unknown":
      return "Unknown";
    default:
      return platform;
  }
}
