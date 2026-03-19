import type { ReactNode } from "react";

interface ResultCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function ResultCard({
  title,
  subtitle,
  children,
}: ResultCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-white/60">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
