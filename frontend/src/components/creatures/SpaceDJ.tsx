export function SpaceDJ() {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Helmet visor glow */}
      <ellipse cx="160" cy="148" rx="80" ry="80" fill="#1a0a3e" />
      <ellipse cx="160" cy="148" rx="80" ry="80" fill="url(#helmetGrad)" />
      {/* Suit body */}
      <rect x="104" y="222" width="112" height="72" rx="30" fill="#C4B5FD" />
      {/* Arms */}
      <rect x="60" y="225" width="50" height="32" rx="16" fill="#A78BFA" />
      <rect x="210" y="225" width="50" height="32" rx="16" fill="#A78BFA" />
      {/* Gloves */}
      <ellipse cx="72" cy="265" rx="18" ry="16" fill="#7C3AED" />
      <ellipse cx="248" cy="265" rx="18" ry="16" fill="#7C3AED" />
      {/* Turntable in left hand */}
      <ellipse cx="72" cy="265" rx="12" ry="10" fill="#07040f" />
      <ellipse cx="72" cy="265" rx="6" ry="5" fill="#A855F7" />
      <ellipse cx="72" cy="265" rx="2" ry="1.5" fill="#F9A8D4" />
      {/* Helmet */}
      <ellipse cx="160" cy="145" rx="78" ry="78" fill="#DDD6FE" />
      <ellipse cx="160" cy="145" rx="63" ry="63" fill="#1a0a3e" />
      {/* Stars inside helmet */}
      <circle cx="135" cy="128" r="2" fill="white" opacity="0.8"/>
      <circle cx="178" cy="118" r="1.5" fill="white" opacity="0.7"/>
      <circle cx="152" cy="165" r="1" fill="white" opacity="0.6"/>
      <circle cx="188" cy="155" r="2.5" fill="white" opacity="0.9"/>
      <circle cx="130" cy="162" r="1.5" fill="#A855F7" opacity="0.9"/>
      {/* Alien face inside */}
      <ellipse cx="145" cy="145" rx="12" ry="14" fill="#5B21B6" />
      <ellipse cx="175" cy="145" rx="12" ry="14" fill="#5B21B6" />
      <ellipse cx="145" cy="143" rx="7" ry="8" fill="#A855F7" />
      <ellipse cx="175" cy="143" rx="7" ry="8" fill="#A855F7" />
      <circle cx="145" cy="143" r="3" fill="white" />
      <circle cx="175" cy="143" r="3" fill="white" />
      <path d="M149 162 Q160 170 171 162" stroke="#7C3AED" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Antenna */}
      <line x1="160" y1="67" x2="160" y2="30" stroke="#C4B5FD" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="160" cy="25" r="8" fill="#F9A8D4" />
      <circle cx="160" cy="25" r="4" fill="#EC4899" />
      {/* Collar detail */}
      <path d="M104 222 Q160 210 216 222" stroke="#7C3AED" strokeWidth="3" fill="none"/>
      {/* Chest control panel */}
      <rect x="136" y="230" width="48" height="32" rx="8" fill="#7C3AED" />
      <circle cx="148" cy="240" r="4" fill="#F9A8D4" />
      <circle cx="160" cy="240" r="4" fill="#FDE68A" />
      <circle cx="172" cy="240" r="4" fill="#6EE7B7" />
      <rect x="140" y="250" width="40" height="4" rx="2" fill="#A855F7" />
      {/* Music notes */}
      <text x="30" y="100" fontSize="22" fill="#F9A8D4" opacity="0.8">♫</text>
      <text x="265" y="130" fontSize="18" fill="#FDE68A" opacity="0.8">♪</text>
      <defs>
        <radialGradient id="helmetGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
    </svg>
  );
}
