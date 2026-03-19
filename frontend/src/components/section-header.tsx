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
      <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
        {eyebrow}
      </div>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-7 text-white/70 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
