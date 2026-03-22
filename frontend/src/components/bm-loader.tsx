"use client";

import { useEffect, useState } from "react";

export function BmLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      id="loader"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: "#0B0C10" }}
    >
      {/* Glitchy BEATMAP title */}
      <h1
        className="font-display glitch-effect select-none"
        data-text="BEATMAP"
        style={{
          fontSize: "clamp(4rem, 16vw, 14rem)",
          color: "white",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        BEATMAP
      </h1>

      <p
        className="font-body mt-6 uppercase tracking-[0.3em] text-sm"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        AI music intelligence
      </p>

      {/* Loading bar */}
      <div className="mt-12 w-64 h-px bg-white/10 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0"
          style={{
            background: "#CCFF00",
            animation: "loadBar 2.5s linear forwards",
          }}
        />
      </div>

      <button
        onClick={() => setVisible(false)}
        className="absolute bottom-12 font-body text-sm uppercase tracking-widest px-6 py-2 transition-all"
        style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#CCFF00";
          (e.currentTarget as HTMLButtonElement).style.color = "#000";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#CCFF00";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
        }}
      >
        SKIP
      </button>

      <style>{`
        @keyframes loadBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
