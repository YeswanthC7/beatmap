"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "WHAT IS BEATMAP?",
    a: "BeatMap is an AI-powered music intelligence engine for video creators. Paste any YouTube or SoundCloud link, pick your edit type, and get exact timestamps for best cuts, hook moments, talk-over windows, and a step-by-step shot plan.",
  },
  {
    q: "HOW DOES THE ANALYSIS WORK?",
    a: "BeatMap uses large language models (Groq + Gemini) trained on music knowledge to analyse any song. It returns precise timestamps, energy maps, mood shifts, and preset-specific edit plans — all calibrated for your chosen video format.",
  },
  {
    q: "WHAT VIDEO FORMATS ARE SUPPORTED?",
    a: "BeatMap covers Instagram Reels, TikTok Shorts, YouTube Intros, Travel Montages, Product Ads, Fashion/Luxury, Emotional Stories, Wedding Memories, Gym Hype Edits, Podcast Intros, Documentaries, Gaming Montages, Vlogs, Slideshows, and General Edits.",
  },
  {
    q: "CAN I RECORD FROM A MICROPHONE?",
    a: "Yes. Switch to the Record Audio tab to capture live audio through your mic. The AI will analyse it in real time using the Gemini audio model and return timing recommendations just like a link analysis.",
  },
  {
    q: "HOW DO I COMPARE TWO SONGS?",
    a: "Use the Compare Songs tab. Paste 2–3 links, pick a video preset, and BeatMap will rank them by overall fit score, best opening moment, voiceover suitability, and emotional payoff.",
  },
  {
    q: "DOES IT WORK WITH SOUNDCLOUD?",
    a: "Yes — both YouTube and SoundCloud links are supported. Just paste the full URL and BeatMap will detect the platform automatically.",
  },
];

export function BmFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative w-full py-24 px-8 md:px-16" style={{ background: "#0B0C10" }}>
      {/* Giant background text */}
      <div
        className="pointer-events-none select-none absolute left-0 right-0 text-center font-display uppercase"
        style={{
          top: "50%", transform: "translateY(-50%)",
          fontSize: "clamp(8rem, 25vw, 22rem)",
          color: "rgba(255,255,255,0.025)",
          lineHeight: 1,
          letterSpacing: "-0.05em",
        }}
      >
        FAQ
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-px w-12" style={{ background: "#CCFF00" }} />
            <span className="font-body font-bold uppercase tracking-[0.3em] text-xs" style={{ color: "#CCFF00" }}>
              QUESTIONS
            </span>
          </div>
          <h2 className="font-display uppercase text-white leading-none"
            style={{ fontSize: "clamp(2rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}>
            HOW DOES IT WORK?
          </h2>
        </div>

        <div className="space-y-0">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <button
                  className="w-full py-7 flex justify-between items-center text-left gap-4 transition-colors"
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{ color: isOpen ? "#CCFF00" : "rgba(255,255,255,0.8)" }}
                >
                  <span className="font-display text-xl sm:text-2xl uppercase" style={{ letterSpacing: "0.01em" }}>
                    {faq.q}
                  </span>
                  <span
                    className="faq-icon text-3xl font-light shrink-0"
                    style={{
                      color: "#CCFF00",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    +
                  </span>
                </button>

                <div
                  className="faq-content overflow-hidden"
                  style={{ maxHeight: isOpen ? 300 : 0 }}
                >
                  <p className="font-body pb-7 text-base leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.45)" }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
