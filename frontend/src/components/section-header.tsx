interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-orange-300">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
        {eyebrow}
      </div>
      <h1 className="font-display mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
        Turn any song into{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          scene intelligence
        </span>
      </h1>
      <p className="mt-5 text-base leading-7 text-white/60 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
