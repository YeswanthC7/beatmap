"use client";

import { useEffect, useState } from "react";

const SECTIONS = ["hero", "analyze", "trending", "factions", "footer"];

export function BmProgress() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
      {SECTIONS.map((_, i) => (
        <div
          key={i}
          className="progress-dot"
          style={i === active ? { background: "#CCFF00", boxShadow: "0 0 8px #CCFF00", transform: "scale(1.4)" } : {}}
        />
      ))}
    </aside>
  );
}
