import type { Metadata } from "next";
import { Anton, Space_Grotesk } from "next/font/google";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-anton",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BeatMap — Find the best part of any song",
  description:
    "AI-powered music intelligence engine. Paste a YouTube or SoundCloud link, pick your edit type, and get exact timestamps, best cuts, and a full shot plan for your video.",
  openGraph: {
    title: "BeatMap — Find the best part of any song",
    description:
      "AI-powered music intelligence engine. Paste a link, get timestamps, best cuts, and a full edit plan for your video.",
    images: [
      {
        url: "/thumbnail.png",
        width: 1280,
        height: 720,
        alt: "BeatMap — AI Music Intelligence",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeatMap — Find the best part of any song",
    description:
      "AI-powered music intelligence engine. Paste a link, get timestamps, best cuts, and a full edit plan for your video.",
    images: ["/thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${anton.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
