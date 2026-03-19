import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BeatMap",
  description:
    "AI-powered music intelligence engine for scene-fit insights, hook detection, and creative-use recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
