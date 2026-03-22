"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function BmNav({ onAnalyze }: { onAnalyze?: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav
      className="fixed top-0 w-full z-[100] flex items-center justify-between px-8 py-5 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(11,12,16,0.95)"
          : "rgba(11,12,16,0.7)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px solid transparent",
      }}
    >
      <div
        className="font-display text-white text-xl tracking-wider select-none cursor-pointer"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
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
            className="font-body font-bold text-xs uppercase tracking-widest transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          >
            {item.label}
          </button>
        ))}
        <Link
          href="/how-it-works"
          className="font-body font-bold text-xs uppercase tracking-widest transition-colors"
          style={{ color: "rgba(255,255,255,0.5)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color =
              "rgba(255,255,255,0.5)")
          }
        >
          HOW IT WORKS
        </Link>
      </div>

      <button
        onClick={() => {
          if (onAnalyze) onAnalyze();
          else scrollTo("analyze");
        }}
        className="font-body font-bold text-xs uppercase tracking-widest px-4 py-2 transition-all"
        style={{ background: "#CCFF00", color: "#000" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(204,255,0,0.8)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "#CCFF00")
        }
      >
        ANALYSE A SONG
      </button>
    </nav>
  );
}
