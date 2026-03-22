export function MoodCat() {
  return (
    <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Body */}
      <ellipse cx="160" cy="220" rx="90" ry="75" fill="#FDE68A" />
      {/* Head */}
      <ellipse cx="160" cy="145" rx="78" ry="72" fill="#FDE68A" />
      {/* Ears */}
      <path d="M95 90 L78 50 L120 82 Z" fill="#FDE68A" />
      <path d="M225 90 L242 50 L200 82 Z" fill="#FDE68A" />
      <path d="M97 86 L83 57 L116 82 Z" fill="#FBBF24" />
      <path d="M223 86 L237 57 L204 82 Z" fill="#FBBF24" />
      {/* Face */}
      {/* Eyes - big sparkly */}
      <ellipse cx="135" cy="145" rx="18" ry="19" fill="#07040f" />
      <ellipse cx="185" cy="145" rx="18" ry="19" fill="#07040f" />
      <ellipse cx="139" cy="141" rx="7" ry="7" fill="white" />
      <ellipse cx="189" cy="141" rx="7" ry="7" fill="white" />
      <circle cx="141" cy="140" r="2.5" fill="#07040f" />
      <circle cx="191" cy="140" r="2.5" fill="#07040f" />
      {/* Nose */}
      <path d="M152 165 L160 172 L168 165 Q160 160 152 165 Z" fill="#F97316" />
      {/* Mouth */}
      <path d="M148 174 Q160 185 172 174" stroke="#F97316" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Whiskers */}
      <line x1="88" y1="162" x2="140" y2="168" stroke="#B45309" strokeWidth="1.5" opacity="0.6"/>
      <line x1="88" y1="170" x2="140" y2="172" stroke="#B45309" strokeWidth="1.5" opacity="0.6"/>
      <line x1="88" y1="178" x2="140" y2="176" stroke="#B45309" strokeWidth="1.5" opacity="0.6"/>
      <line x1="180" y1="168" x2="232" y2="162" stroke="#B45309" strokeWidth="1.5" opacity="0.6"/>
      <line x1="180" y1="172" x2="232" y2="170" stroke="#B45309" strokeWidth="1.5" opacity="0.6"/>
      <line x1="180" y1="176" x2="232" y2="178" stroke="#B45309" strokeWidth="1.5" opacity="0.6"/>
      {/* Blush */}
      <ellipse cx="112" cy="175" rx="15" ry="9" fill="#FCA5A5" opacity="0.5"/>
      <ellipse cx="208" cy="175" rx="15" ry="9" fill="#FCA5A5" opacity="0.5"/>
      {/* Tail — waveform shaped */}
      <path d="M250 250 Q270 225 280 240 Q290 255 270 270 Q250 285 260 300" stroke="#FBBF24" strokeWidth="16" fill="none" strokeLinecap="round"/>
      {/* Waveform bars on tail */}
      <rect x="258" y="240" width="5" height="18" rx="2.5" fill="#F97316" transform="rotate(15 258 240)" />
      <rect x="268" y="232" width="5" height="26" rx="2.5" fill="#EC4899" transform="rotate(10 268 232)" />
      <rect x="278" y="244" width="5" height="14" rx="2.5" fill="#A855F7" transform="rotate(20 278 244)" />
      {/* Paws */}
      <ellipse cx="104" cy="285" rx="30" ry="20" fill="#FDE68A" />
      <ellipse cx="216" cy="285" rx="30" ry="20" fill="#FDE68A" />
      <ellipse cx="104" cy="291" rx="22" ry="12" fill="#FBBF24" opacity="0.3"/>
      <ellipse cx="216" cy="291" rx="22" ry="12" fill="#FBBF24" opacity="0.3"/>
      {/* Tiny toe beans */}
      <ellipse cx="94" cy="287" rx="6" ry="5" fill="#FCA5A5" opacity="0.6"/>
      <ellipse cx="104" cy="290" rx="6" ry="5" fill="#FCA5A5" opacity="0.6"/>
      <ellipse cx="114" cy="287" rx="6" ry="5" fill="#FCA5A5" opacity="0.6"/>
      <ellipse cx="206" cy="287" rx="6" ry="5" fill="#FCA5A5" opacity="0.6"/>
      <ellipse cx="216" cy="290" rx="6" ry="5" fill="#FCA5A5" opacity="0.6"/>
      <ellipse cx="226" cy="287" rx="6" ry="5" fill="#FCA5A5" opacity="0.6"/>
      {/* Music notes */}
      <text x="40" y="145" fontSize="24" fill="#F97316" opacity="0.85">♫</text>
      <text x="262" y="120" fontSize="20" fill="#EC4899" opacity="0.8">♪</text>
    </svg>
  );
}
