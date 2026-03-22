"use client";

const FOOTER_LINKS = [
  {
    group: "Product",
    links: [
      { label: "Analyze a song", href: "#analyze" },
      { label: "Compare tracks", href: "#compare" },
      { label: "Trending now", href: "#trending" },
      { label: "How it works", href: "#workflow" },
    ],
  },
  {
    group: "Use cases",
    links: [
      { label: "Reels & TikToks", href: "#analyze" },
      { label: "Travel edits", href: "#analyze" },
      { label: "Podcast intros", href: "#analyze" },
      { label: "Wedding videos", href: "#analyze" },
    ],
  },
  {
    group: "About",
    links: [
      { label: "What is BeatMap?", href: "#intro" },
      { label: "GitHub", href: "https://github.com/YeswanthC7/beatmap" },
    ],
  },
];

export function SiteFooter() {
  const scrollTo = (href: string) => {
    if (href.startsWith("http")) { window.open(href, "_blank"); return; }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/[0.05] px-4 pt-16 pb-10">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 max-w-xl"
        style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent)" }} />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/25">
                <span className="text-sm font-black text-white">B</span>
              </div>
              <span className="font-display text-base font-extrabold text-white">BeatMap</span>
            </div>
            <p className="text-sm leading-6 text-white/35 max-w-[200px]">
              Find the best part of any song for your video. Instantly.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="https://github.com/YeswanthC7/beatmap" target="_blank" rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/40 text-sm hover:text-white hover:bg-white/[0.1] transition-all">
                ⌂
              </a>
            </div>
          </div>

          {/* Link groups */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.group}>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/25">{group.group}</p>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-sm text-white/45 transition-colors hover:text-white/80"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.05] pt-8 sm:flex-row">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} BeatMap. Built for creators.
          </p>
          <p className="text-xs text-white/15">
            AI music intelligence for video editing
          </p>
        </div>
      </div>
    </footer>
  );
}
