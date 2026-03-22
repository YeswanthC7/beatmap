export function BeatGhost() {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Ghost body */}
      <path
        d="M80 220 L80 140 Q80 60 160 60 Q240 60 240 140 L240 220 Q220 205 200 220 Q180 235 160 220 Q140 205 120 220 Q100 235 80 220 Z"
        fill="#F0ABFC"
      />
      {/* Ghost shimmer */}
      <path
        d="M100 90 Q120 75 160 80 Q200 75 215 95"
        stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.5"
      />
      {/* Eyes */}
      <ellipse cx="132" cy="150" rx="20" ry="22" fill="#07040f" />
      <ellipse cx="188" cy="150" rx="20" ry="22" fill="#07040f" />
      <ellipse cx="136" cy="146" rx="8" ry="9" fill="#F0ABFC" />
      <ellipse cx="192" cy="146" rx="8" ry="9" fill="#F0ABFC" />
      {/* Mouth */}
      <path d="M140 182 Q160 196 180 182" stroke="#07040f" strokeWidth="5" fill="none" strokeLinecap="round"/>
      {/* Cheek blush */}
      <ellipse cx="108" cy="172" rx="16" ry="10" fill="#E879F9" opacity="0.4"/>
      <ellipse cx="212" cy="172" rx="16" ry="10" fill="#E879F9" opacity="0.4"/>
      {/* Turntable / mixer underneath */}
      <rect x="50" y="255" width="220" height="48" rx="14" fill="#4A044E" />
      <ellipse cx="120" cy="279" rx="28" ry="24" fill="#1a001a" />
      <ellipse cx="120" cy="279" rx="20" ry="17" fill="#7E22CE" />
      <ellipse cx="120" cy="279" rx="8" ry="7" fill="#D946EF" />
      <ellipse cx="120" cy="279" rx="2.5" ry="2.5" fill="white" />
      <line x1="120" y1="262" x2="138" y2="272" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
      <ellipse cx="200" cy="279" rx="28" ry="24" fill="#1a001a" />
      <ellipse cx="200" cy="279" rx="20" ry="17" fill="#7E22CE" />
      <ellipse cx="200" cy="279" rx="8" ry="7" fill="#D946EF" />
      <ellipse cx="200" cy="279" rx="2.5" ry="2.5" fill="white" />
      <line x1="200" y1="262" x2="218" y2="272" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
      {/* Mixer faders */}
      <rect x="155" y="263" width="4" height="28" rx="2" fill="#6B21A8" />
      <rect x="153" y="272" width="8" height="6" rx="2" fill="#D946EF" />
      <rect x="167" y="263" width="4" height="28" rx="2" fill="#6B21A8" />
      <rect x="165" y="278" width="8" height="6" rx="2" fill="#F0ABFC" />
      {/* Ghost hands on decks */}
      <ellipse cx="85" cy="260" rx="18" ry="14" fill="#F0ABFC" opacity="0.7" />
      <ellipse cx="235" cy="260" rx="18" ry="14" fill="#F0ABFC" opacity="0.7" />
      {/* Floating notes */}
      <text x="42" y="120" fontSize="28" fill="#E879F9" opacity="0.9">♪</text>
      <text x="258" y="95" fontSize="22" fill="#A855F7" opacity="0.8">♫</text>
      <text x="255" y="185" fontSize="16" fill="#F0ABFC" opacity="0.7">♩</text>
    </svg>
  );
}
