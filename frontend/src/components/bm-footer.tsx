"use client";

import Link from "next/link";

export function BmFooter() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      id="footer"
      className="relative w-full overflow-hidden"
      style={{
        background: "#111318",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Big CTA */}
      <div className="px-8 md:px-16 pt-20 pb-12 text-center">
        <button
          onClick={scrollTop}
          className="font-display uppercase text-white leading-none block w-full transition-opacity hover:opacity-70"
          style={{
            fontSize: "clamp(2.5rem, 11vw, 9rem)",
            letterSpacing: "-0.04em",
          }}
        >
          FIND YOUR CUT
        </button>
        <p
          className="font-body text-sm mt-4 uppercase tracking-[0.2em]"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          PASTE A LINK — GET YOUR EDIT PLAN — START CUTTING
        </p>
        <button
          onClick={scrollTop}
          className="mt-8 inline-block font-body font-bold text-xs uppercase tracking-widest px-6 py-3 transition-all"
          style={{ background: "#CCFF00", color: "#000" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(204,255,0,0.8)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "#CCFF00")
          }
        >
          ANALYSE A SONG →
        </button>
      </div>

      {/* Character */}
      <div
        className="absolute right-16 bottom-0 pointer-events-none select-none hidden lg:block"
        style={{ width: 160, opacity: 0.15 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/creatures/lofi.png"
          alt=""
          className="w-full object-contain object-bottom animate-float"
        />
      </div>

      {/* Bottom nav row */}
      <div
        className="px-8 md:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="font-display text-lg text-white uppercase tracking-wider">
          BEATMAP
        </span>

        <div className="flex flex-wrap gap-6 justify-center">
          {[
            { label: "HOW IT WORKS", href: "/how-it-works", anchor: false },
            { label: "ANALYSE", id: "analyze", anchor: true },
            { label: "TRENDING", id: "trending", anchor: true },
            { label: "COMPARE", id: "compare", anchor: true },
          ].map((l) =>
            l.anchor ? (
              <button
                key={l.label}
                onClick={() =>
                  document.getElementById(l.id!)?.scrollIntoView({ behavior: "smooth" })
                }
                className="font-body font-bold text-xs uppercase tracking-widest transition-colors"
                style={{ color: "rgba(255,255,255,0.3)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
                }
              >
                {l.label}
              </button>
            ) : (
              <Link
                key={l.label}
                href={l.href!}
                className="font-body font-bold text-xs uppercase tracking-widest transition-colors"
                style={{ color: "rgba(255,255,255,0.3)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "rgba(255,255,255,0.3)")
                }
              >
                {l.label}
              </Link>
            )
          )}
        </div>

        <span
          className="font-body text-xs"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          © {new Date().getFullYear()} BEATMAP
        </span>
      </div>
    </footer>
  );
}
