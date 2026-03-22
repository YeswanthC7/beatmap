import type { ReactNode } from "react";

interface ResultCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accent?: "orange" | "pink" | "purple" | "amber" | "green" | "default";
}

const ACCENT_STYLES: Record<string, string> = {
  orange: "border-orange-500/25 bg-orange-500/5",
  pink: "border-pink-500/25 bg-pink-500/5",
  purple: "border-purple-500/25 bg-purple-500/5",
  amber: "border-amber-500/25 bg-amber-500/5",
  green: "border-emerald-500/25 bg-emerald-500/5",
  default: "border-white/10 bg-white/[0.04]",
};

const ACCENT_TITLE: Record<string, string> = {
  orange: "text-orange-200",
  pink: "text-pink-200",
  purple: "text-purple-200",
  amber: "text-amber-200",
  green: "text-emerald-200",
  default: "text-white",
};

const ACCENT_BAR: Record<string, string> = {
  orange: "bg-gradient-to-b from-orange-400 to-pink-500",
  pink: "bg-gradient-to-b from-pink-400 to-purple-500",
  purple: "bg-gradient-to-b from-purple-400 to-blue-500",
  amber: "bg-gradient-to-b from-amber-400 to-orange-500",
  green: "bg-gradient-to-b from-emerald-400 to-teal-500",
  default: "bg-gradient-to-b from-white/20 to-white/5",
};

export function ResultCard({
  title,
  subtitle,
  children,
  accent = "default",
}: ResultCardProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-3xl border p-6 shadow-xl backdrop-blur-sm ${ACCENT_STYLES[accent]}`}
    >
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-3xl ${ACCENT_BAR[accent]}`} />
      <div className="mb-5 pl-1">
        <h2 className={`font-display text-xl font-bold ${ACCENT_TITLE[accent]}`}>{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-white/45">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
