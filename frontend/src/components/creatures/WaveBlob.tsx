export function WaveBlob() {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Body */}
      <ellipse cx="160" cy="185" rx="110" ry="105" fill="#FF6B2B" />
      <ellipse cx="100" cy="230" rx="38" ry="30" fill="#FF6B2B" />
      <ellipse cx="220" cy="230" rx="38" ry="30" fill="#FF6B2B" />
      {/* Squiggle bottom */}
      <path d="M60 250 Q80 270 100 255 Q120 240 140 255 Q160 270 180 255 Q200 240 220 255 Q240 270 260 250" stroke="#E85A1B" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Eyes - waveform style */}
      <rect x="110" y="158" width="30" height="12" rx="6" fill="#07040f" />
      <rect x="180" y="158" width="30" height="12" rx="6" fill="#07040f" />
      {/* Waveform bars inside eyes */}
      <rect x="114" y="161" width="4" height="6" rx="2" fill="#FF6B2B" />
      <rect x="121" y="159" width="4" height="10" rx="2" fill="#FF6B2B" />
      <rect x="128" y="162" width="4" height="4" rx="2" fill="#FF6B2B" />
      <rect x="184" y="161" width="4" height="6" rx="2" fill="#FF6B2B" />
      <rect x="191" y="159" width="4" height="10" rx="2" fill="#FF6B2B" />
      <rect x="198" y="162" width="4" height="4" rx="2" fill="#FF6B2B" />
      {/* Smile */}
      <path d="M135 195 Q160 215 185 195" stroke="#07040f" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Headphones */}
      <path d="M108 155 Q108 120 160 120 Q212 120 212 155" stroke="#07040f" strokeWidth="8" fill="none" strokeLinecap="round" />
      <rect x="96" y="148" width="22" height="28" rx="10" fill="#07040f" />
      <rect x="202" y="148" width="22" height="28" rx="10" fill="#07040f" />
      <rect x="100" y="152" width="14" height="20" rx="7" fill="#FFB347" />
      <rect x="206" y="152" width="14" height="20" rx="7" fill="#FFB347" />
      {/* Floating music notes */}
      <text x="48" y="130" fontSize="24" fill="#FFB347" opacity="0.85">♪</text>
      <text x="258" y="115" fontSize="18" fill="#EC4899" opacity="0.85">♫</text>
      <text x="270" y="175" fontSize="14" fill="#A855F7" opacity="0.7">♩</text>
    </svg>
  );
}
