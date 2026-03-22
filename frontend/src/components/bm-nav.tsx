"use client";

import Link from "next/link";

export function BmNav({ onAnalyze }: { onAnalyze?: () => void }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 w-full flex items-center justify-between px-8 py-6 z-50"
      style={{ mixBlendMode: "difference" }}
    >
      <div className="font-display text-white text-2xl tracking-wider select-none cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        BEATMAP
      </div>

      <div className="hidden md:flex items-center gap-8">
        {[
          { label: "TRENDING", id: "trending" },
          { label: "ANALYSE", id: "analyze" },
          { label: "COMPARE", id: "compare" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="font-body font-bold text-sm uppercase tracking-widest text-white transition-colors"
            style={{ color: "white" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#CCFF00")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
          >
            {item.label}
          </button>
        ))}
        <Link href="/how-it-works"
          className="font-body font-bold text-sm uppercase tracking-widest"
          style={{ color: "white" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#CCFF00")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "white")}
        >
          HOW IT WORKS
        </Link>
      </div>

      <button
        onClick={() => { if (onAnalyze) onAnalyze(); else scrollTo("analyze"); }}
        className="font-body font-bold text-sm uppercase tracking-widest px-5 py-2.5 transition-all"
        style={{ background: "#CCFF00", color: "#000" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        ANALYSE A SONG
      </button>
    </nav>
  );
}
