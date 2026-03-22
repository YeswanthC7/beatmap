"use client";

import Link from "next/link";

export function BmFooter() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer id="footer" className="relative w-full overflow-hidden clip-diagonal"
      style={{ background: "#CCFF00", paddingTop: 80, paddingBottom: 60, paddingLeft: 60, paddingRight: 60 }}>

      {/* Giant CTA heading */}
      <div className="text-center mb-16">
        <button
          onClick={scrollTop}
          className="font-display uppercase text-black leading-none block w-full transition-transform hover:scale-105"
          style={{ fontSize: "clamp(3rem, 14vw, 12rem)", letterSpacing: "-0.04em" }}
        >
          FIND YOUR CUT
        </button>
        <p className="font-body font-bold uppercase tracking-[0.3em] text-sm mt-4"
          style={{ color: "rgba(0,0,0,0.5)" }}>
          PASTE A LINK. GET YOUR EDIT PLAN. START CUTTING.
        </p>
      </div>

      {/* Character cameo */}
      <div className="absolute right-16 bottom-0 pointer-events-none select-none hidden lg:block"
        style={{ width: 200 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/creatures/lofi.png" alt=""
          className="w-full object-contain object-bottom animate-float"
          style={{ filter: "brightness(0.1) contrast(1.5)" }}
        />
      </div>

      {/* Bottom row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{ borderTop: "2px solid rgba(0,0,0,0.15)", paddingTop: 32 }}>
        <span className="font-display text-2xl text-black uppercase tracking-wider">BEATMAP</span>

        <div className="flex gap-8">
          {[
            { label: "HOW IT WORKS", href: "/how-it-works" },
            { label: "ANALYSE",      href: "#analyze", anchor: true },
            { label: "TRENDING",     href: "#trending", anchor: true },
            { label: "COMPARE",      href: "#compare", anchor: true },
          ].map((l) =>
            l.anchor ? (
              <button key={l.label}
                onClick={() => document.getElementById(l.href.slice(1))?.scrollIntoView({ behavior: "smooth" })}
                className="font-body font-bold text-xs uppercase tracking-widest transition-opacity hover:opacity-60"
                style={{ color: "#000" }}>
                {l.label}
              </button>
            ) : (
              <Link key={l.label} href={l.href}
                className="font-body font-bold text-xs uppercase tracking-widest transition-opacity hover:opacity-60"
                style={{ color: "#000" }}>
                {l.label}
              </Link>
            )
          )}
        </div>

        <span className="font-body text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>
          © {new Date().getFullYear()} BEATMAP
        </span>
      </div>
    </footer>
  );
}
