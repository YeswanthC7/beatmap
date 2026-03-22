export function BeatBot() {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Legs */}
      <rect x="122" y="268" width="26" height="44" rx="10" fill="#0F766E" />
      <rect x="172" y="268" width="26" height="44" rx="10" fill="#0F766E" />
      {/* Feet */}
      <rect x="112" y="302" width="40" height="14" rx="7" fill="#0D9488" />
      <rect x="168" y="302" width="40" height="14" rx="7" fill="#0D9488" />
      {/* Body */}
      <rect x="88" y="180" width="144" height="92" rx="22" fill="#0F766E" />
      {/* Body panel */}
      <rect x="100" y="192" width="120" height="68" rx="14" fill="#115E59" />
      {/* EQ bars on chest */}
      <rect x="112" y="220" width="10" height="30" rx="4" fill="#2DD4BF" />
      <rect x="128" y="210" width="10" height="40" rx="4" fill="#F97316" />
      <rect x="144" y="218" width="10" height="22" rx="4" fill="#EC4899" />
      <rect x="160" y="206" width="10" height="44" rx="4" fill="#A855F7" />
      <rect x="176" y="215" width="10" height="35" rx="4" fill="#2DD4BF" />
      <rect x="192" y="222" width="10" height="18" rx="4" fill="#F97316" />
      {/* Arms */}
      <rect x="35" y="188" width="55" height="26" rx="13" fill="#0F766E" />
      <rect x="230" y="188" width="55" height="26" rx="13" fill="#0F766E" />
      {/* Hands */}
      <circle cx="40" cy="201" r="16" fill="#0D9488" />
      <circle cx="280" cy="201" r="16" fill="#0D9488" />
      {/* Speaker cone in left hand */}
      <circle cx="40" cy="201" r="10" fill="#07040f" />
      <circle cx="40" cy="201" r="6" fill="#0F766E" />
      <circle cx="40" cy="201" r="2.5" fill="#2DD4BF" />
      {/* Wrist controls */}
      <rect x="58" y="195" width="22" height="14" rx="4" fill="#115E59" />
      <circle cx="64" cy="202" r="3" fill="#F97316" />
      <circle cx="74" cy="202" r="3" fill="#2DD4BF" />
      <rect x="240" y="195" width="22" height="14" rx="4" fill="#115E59" />
      <circle cx="246" cy="202" r="3" fill="#EC4899" />
      <circle cx="256" cy="202" r="3" fill="#A855F7" />
      {/* Neck */}
      <rect x="144" y="165" width="32" height="18" rx="8" fill="#0D9488" />
      {/* Head */}
      <rect x="90" y="82" width="140" height="85" rx="28" fill="#0F766E" />
      {/* Head visor band */}
      <rect x="90" y="108" width="140" height="32" rx="0" fill="#115E59" />
      <rect x="90" y="108" width="140" height="32" rx="28" fill="#115E59" />
      {/* Eyes / display screens */}
      <rect x="106" y="116" width="44" height="18" rx="6" fill="#07040f" />
      <rect x="170" y="116" width="44" height="18" rx="6" fill="#07040f" />
      {/* EQ lines on eyes */}
      <rect x="110" y="119" width="4" height="12" rx="2" fill="#2DD4BF" />
      <rect x="118" y="121" width="4" height="8" rx="2" fill="#F97316" />
      <rect x="126" y="118" width="4" height="14" rx="2" fill="#2DD4BF" />
      <rect x="134" y="120" width="4" height="10" rx="2" fill="#EC4899" />
      <rect x="174" y="119" width="4" height="12" rx="2" fill="#A855F7" />
      <rect x="182" y="121" width="4" height="8" rx="2" fill="#2DD4BF" />
      <rect x="190" y="118" width="4" height="14" rx="2" fill="#F97316" />
      <rect x="198" y="120" width="4" height="10" rx="2" fill="#2DD4BF" />
      {/* Mouth speaker grille */}
      <rect x="122" y="147" width="76" height="10" rx="5" fill="#115E59" />
      <rect x="126" y="150" width="68" height="3" rx="1.5" fill="#2DD4BF" opacity="0.4"/>
      {/* Antenna */}
      <line x1="160" y1="82" x2="160" y2="52" stroke="#0D9488" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="160" cy="46" r="10" fill="#F97316" />
      <circle cx="160" cy="46" r="5" fill="#FDE68A" />
      {/* Notes */}
      <text x="38" y="130" fontSize="22" fill="#2DD4BF" opacity="0.8">♫</text>
      <text x="264" y="155" fontSize="18" fill="#F97316" opacity="0.8">♪</text>
    </svg>
  );
}
