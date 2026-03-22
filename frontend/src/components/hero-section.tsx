"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Reusable micro-components ─── */

function MusicCreature({
  x, y, size = 32, color, glowColor, delay = 0, shape = "round", z = 20,
}: {
  x: string | number; y: string | number; size?: number; color: string;
  glowColor?: string; delay?: number; shape?: "round" | "blob" | "oval"; z?: number;
}) {
  const glow = glowColor ?? color;
  const borderRadius = shape === "round" ? "50%" : shape === "blob" ? "60% 40% 55% 45% / 55% 45% 60% 40%" : "50% 50% 40% 40%";
  return (
    <motion.div className="absolute pointer-events-none select-none"
      style={{ left: x, top: y, zIndex: z }}
      animate={{ y: [0, -(size * 0.3), 0], rotate: [-4, 4, -4] }}
      transition={{ duration: 3.5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <div style={{ width: size, height: size, borderRadius, background: color,
        boxShadow: `0 0 ${size * 0.6}px ${glow}60, 0 0 ${size * 1.2}px ${glow}25` }} />
      {/* eyes */}
      <div style={{ position: "absolute", top: "32%", left: 0, right: 0, display: "flex", justifyContent: "center", gap: size * 0.2 }}>
        <div style={{ width: size * 0.13, height: size * 0.13, background: "rgba(255,255,255,0.9)", borderRadius: "50%" }} />
        <div style={{ width: size * 0.13, height: size * 0.13, background: "rgba(255,255,255,0.9)", borderRadius: "50%" }} />
      </div>
    </motion.div>
  );
}

function FloatingCard({
  x, y, title, value, accent, delay = 0, rotate = -2, w = 140, z = 25,
}: {
  x: string | number; y: string | number; title: string; value: string;
  accent: string; delay?: number; rotate?: number; w?: number; z?: number;
}) {
  return (
    <motion.div className="absolute pointer-events-none select-none rounded-2xl border"
      style={{
        left: x, top: y, width: w, zIndex: z,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)",
        borderColor: `${accent}35`, rotate,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${accent}20`,
      }}
      animate={{ y: [0, -10, 0], rotate: [rotate - 1, rotate + 1, rotate - 1] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <div className="p-3">
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>{title}</p>
        <p style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: accent }}>{value}</p>
      </div>
    </motion.div>
  );
}

function Particle({ x, y, color, size = 3, delay = 0 }: {
  x: string; y: string; color: string; size?: number; delay?: number;
}) {
  return (
    <motion.div className="absolute pointer-events-none select-none rounded-full"
      style={{ left: x, top: y, width: size, height: size, background: color, zIndex: 5 }}
      animate={{ y: [0, -60, 0], opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
      transition={{ duration: 4 + delay * 0.7, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function GlowOrb({ x, y, color, size = 80, opacity = 0.12, blur = 40, z = 0 }: {
  x: string; y: string; color: string; size?: number; opacity?: number; blur?: number; z?: number;
}) {
  return (
    <div className="absolute pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, borderRadius: "50%",
        background: color, filter: `blur(${blur}px)`, opacity, zIndex: z, transform: "translate(-50%,-50%)" }} />
  );
}

/* ─── Studio World Scene ─── */
function StudioScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background architecture — monitor/screen shapes in perspective */}
      {[
        { left: "52%", top: "8%", w: 140, h: 80, color: "#1a0a00", border: "rgba(249,115,22,0.2)" },
        { left: "68%", top: "4%", w: 100, h: 60, color: "#150800", border: "rgba(249,115,22,0.15)" },
        { left: "82%", top: "10%", w: 80, h: 50, color: "#120700", border: "rgba(249,115,22,0.1)" },
      ].map((m, i) => (
        <motion.div key={i} className="absolute rounded-xl pointer-events-none"
          style={{ left: m.left, top: m.top, width: m.w, height: m.h,
            background: m.color, border: `1px solid ${m.border}`, zIndex: 4 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
        >
          {/* Screen scanline glow */}
          <div style={{ position: "absolute", inset: 4, borderRadius: 8,
            background: `linear-gradient(180deg, rgba(249,115,22,0.05) 0%, rgba(249,115,22,0.12) 50%, rgba(249,115,22,0.03) 100%)` }} />
          <div style={{ position: "absolute", top: 8, left: 10, right: 10, height: 2, borderRadius: 1,
            background: "rgba(249,115,22,0.3)" }} />
          <div style={{ position: "absolute", top: 14, left: 10, right: 20, height: 1, borderRadius: 1,
            background: "rgba(249,115,22,0.15)" }} />
        </motion.div>
      ))}

      {/* GIANT timeline bar */}
      <motion.div className="absolute pointer-events-none"
        style={{ left: "38%", top: "48%", right: 0, height: 44, zIndex: 8,
          background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.08), rgba(249,115,22,0.2), rgba(249,115,22,0.08))",
          borderTop: "1px solid rgba(249,115,22,0.4)", borderBottom: "1px solid rgba(249,115,22,0.2)" }}
        animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 4, repeat: Infinity }}
      >
        {/* Segment fills on timeline */}
        {[
          { left: "5%", w: "18%", color: "#8b5cf6" },
          { left: "26%", w: "12%", color: "#f97316" },
          { left: "41%", w: "22%", color: "#06b6d4" },
          { left: "66%", w: "15%", color: "#ec4899" },
        ].map((seg, i) => (
          <motion.div key={i} className="absolute inset-y-0 rounded-sm"
            style={{ left: seg.left, width: seg.w, background: seg.color + "55",
              borderRight: `2px solid ${seg.color}80` }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </motion.div>

      {/* Timeline playhead */}
      <motion.div className="absolute pointer-events-none"
        style={{ top: "42%", bottom: "46%", width: 2, zIndex: 12, background: "#f97316",
          boxShadow: "0 0 12px #f97316" }}
        animate={{ left: ["45%", "85%", "45%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div style={{ position: "absolute", top: -6, left: -5, width: 12, height: 12,
          background: "#f97316", borderRadius: "50%", boxShadow: "0 0 12px #f97316" }} />
      </motion.div>

      {/* Timestamp chips floating above timeline */}
      {[
        { label: "Best cut", time: "0:08", left: "44%", top: "34%", color: "#f97316", delay: 0 },
        { label: "Talk-over", time: "0:34", left: "61%", top: "38%", color: "#06b6d4", delay: 0.8 },
        { label: "Big moment", time: "1:12", left: "78%", top: "33%", color: "#ec4899", delay: 0.4 },
      ].map((chip, i) => (
        <motion.div key={i} className="absolute pointer-events-none rounded-full"
          style={{ left: chip.left, top: chip.top, zIndex: 14,
            background: `${chip.color}18`, border: `1px solid ${chip.color}50`,
            backdropFilter: "blur(8px)", padding: "4px 10px" }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: chip.delay }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: chip.color,
              boxShadow: `0 0 6px ${chip.color}` }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: chip.color }}>{chip.label}</span>
            <span style={{ fontSize: 9, fontFamily: "monospace", color: "rgba(255,255,255,0.5)" }}>{chip.time}</span>
          </div>
        </motion.div>
      ))}

      {/* Floating song cards */}
      <FloatingCard x="58%" y="12%" title="Best 15s cut" value="0:08 – 0:23" accent="#f97316" delay={0} rotate={-3} w={128} />
      <FloatingCard x="75%" y="18%" title="Talk-over window" value="0:34 – 0:48" accent="#06b6d4" delay={1.2} rotate={2} w={138} />
      <FloatingCard x="85%" y="56%" title="Shot plan step" value="Opening hook" accent="#8b5cf6" delay={0.6} rotate={-1} w={120} />

      {/* Helper creatures on timeline */}
      <MusicCreature x="48%" y="52%" size={24} color="#f97316" delay={0} z={18} />
      <MusicCreature x="62%" y="50%" size={20} color="#8b5cf6" delay={0.8} shape="blob" z={18} />
      <MusicCreature x="77%" y="51%" size={22} color="#06b6d4" delay={1.5} z={18} />

      {/* Producer character — free in scene, no card */}
      <motion.div className="absolute pointer-events-none select-none"
        style={{ right: "6%", bottom: 0, width: "clamp(160px, 22vw, 290px)", zIndex: 20 }}
        animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/creatures/producer.png" alt="The Producer"
          style={{ width: "100%", objectFit: "contain", objectPosition: "bottom",
            filter: "drop-shadow(0 0 32px rgba(249,115,22,0.55)) drop-shadow(0 0 80px rgba(249,115,22,0.2))" }} />
        {/* Ground glow beneath character */}
        <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 20,
          background: "rgba(249,115,22,0.35)", filter: "blur(20px)", borderRadius: "50%" }} />
      </motion.div>

      {/* Ambient particles */}
      {[
        { x: "40%", y: "30%", color: "#f97316", d: 0 }, { x: "55%", y: "20%", color: "#8b5cf6", d: 0.5 },
        { x: "70%", y: "25%", color: "#06b6d4", d: 1 }, { x: "85%", y: "35%", color: "#f97316", d: 1.5 },
        { x: "90%", y: "20%", color: "#ec4899", d: 0.8 }, { x: "43%", y: "60%", color: "#8b5cf6", d: 0.3 },
      ].map((p, i) => <Particle key={i} x={p.x} y={p.y} color={p.color} delay={p.d} size={2 + (i % 2)} />)}

      {/* Glow orbs */}
      <GlowOrb x="70%" y="50%" color="#f97316" size={300} opacity={0.08} blur={80} />
      <GlowOrb x="90%" y="20%" color="#8b5cf6" size={150} opacity={0.1} blur={50} />
    </div>
  );
}

/* ─── Trending World Scene ─── */
function TrendingScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background: music planet / globe */}
      <motion.div className="absolute pointer-events-none"
        style={{ right: "4%", top: "5%", width: 320, height: 320, borderRadius: "50%", zIndex: 3,
          background: "radial-gradient(circle at 35% 35%, #1a0040, #0d001a, #050010)",
          border: "1px solid rgba(217,70,239,0.2)",
          boxShadow: "0 0 80px rgba(217,70,239,0.15), inset 0 0 60px rgba(129,140,248,0.05)" }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {/* Latitude lines */}
        {[30, 50, 70].map((top, i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: `${top}%`, height: 1,
            background: "rgba(217,70,239,0.1)" }} />
        ))}
        {/* Longitude lines */}
        {[30, 50, 70].map((left, i) => (
          <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${left}%`, width: 1,
            background: "rgba(217,70,239,0.08)" }} />
        ))}
      </motion.div>

      {/* Floating music islands/regions */}
      {[
        { cx: "60%", cy: "22%", size: 36, color: "#d946ef", label: "🇺🇸", delay: 0 },
        { cx: "80%", cy: "42%", size: 30, color: "#818cf8", label: "🇰🇷", delay: 0.5 },
        { cx: "55%", cy: "58%", size: 28, color: "#06b6d4", label: "🇮🇳", delay: 1 },
        { cx: "75%", cy: "65%", size: 24, color: "#ec4899", label: "🇯🇵", delay: 1.5 },
        { cx: "90%", cy: "28%", size: 22, color: "#a78bfa", label: "🇬🇧", delay: 0.8 },
      ].map((island, i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ left: island.cx, top: island.cy, zIndex: 10, transform: "translate(-50%,-50%)" }}
          animate={{ y: [0, -6, 0] }} transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: island.delay }}
        >
          <div style={{ width: island.size, height: island.size, borderRadius: "50%",
            background: island.color, boxShadow: `0 0 20px ${island.color}70, 0 0 40px ${island.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: island.size * 0.45 }}>
            {island.label}
          </div>
          {/* Track moving to island */}
          <motion.div style={{ position: "absolute", top: "50%", left: "50%", width: 6, height: 6,
            background: island.color, borderRadius: "50%",
            boxShadow: `0 0 8px ${island.color}` }}
            animate={{ x: [0, -(island.size * 2), 0], y: [0, -(island.size * 1.5), 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: island.delay + 1 }}
          />
        </motion.div>
      ))}

      {/* Glowing connection paths (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 6 }}>
        <motion.path d="M 380 130 Q 450 200 480 260" fill="none" stroke="rgba(217,70,239,0.2)"
          strokeWidth="1.5" strokeDasharray="4 6"
          animate={{ strokeDashoffset: [24, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
        <motion.path d="M 480 260 Q 530 310 560 380" fill="none" stroke="rgba(129,140,248,0.2)"
          strokeWidth="1.5" strokeDasharray="4 6"
          animate={{ strokeDashoffset: [24, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
        <motion.path d="M 560 180 Q 600 300 580 380" fill="none" stroke="rgba(6,182,212,0.2)"
          strokeWidth="1.5" strokeDasharray="4 6"
          animate={{ strokeDashoffset: [24, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }} />
      </svg>

      {/* Floating track cards */}
      <FloatingCard x="40%" y="15%" title="Trending #1" value="Worldwide" accent="#d946ef" delay={0} rotate={-4} w={122} />
      <FloatingCard x="70%" y="10%" title="Rising fast" value="K-pop · 🇰🇷" accent="#818cf8" delay={1.2} rotate={3} w={110} />
      <FloatingCard x="84%" y="50%" title="New • EN" value="Top 10" accent="#06b6d4" delay={0.7} rotate={-2} w={106} />

      {/* Companion music creatures */}
      <MusicCreature x="43%" y="50%" size={26} color="#d946ef" delay={0} shape="blob" z={12} />
      <MusicCreature x="67%" y="30%" size={20} color="#818cf8" delay={0.6} z={12} />
      <MusicCreature x="88%" y="60%" size={18} color="#06b6d4" delay={1.2} shape="oval" z={12} />

      {/* CyberDJ character — free in scene */}
      <motion.div className="absolute pointer-events-none select-none"
        style={{ right: "3%", bottom: 0, width: "clamp(150px, 20vw, 270px)", zIndex: 20 }}
        animate={{ y: [0, -10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/creatures/cyberdj.png" alt="CyberDJ"
          style={{ width: "100%", objectFit: "contain", objectPosition: "bottom",
            filter: "drop-shadow(0 0 30px rgba(217,70,239,0.6)) drop-shadow(0 0 70px rgba(217,70,239,0.25))" }} />
        <div style={{ position: "absolute", bottom: 0, left: "15%", right: "15%", height: 20,
          background: "rgba(217,70,239,0.4)", filter: "blur(20px)", borderRadius: "50%" }} />
      </motion.div>

      {/* Stars */}
      {[...Array(10)].map((_, i) => (
        <motion.div key={i} className="absolute pointer-events-none rounded-full"
          style={{ left: `${38 + i * 6}%`, top: `${8 + (i % 4) * 12}%`, width: 2, height: 2,
            background: "white", opacity: 0.4, zIndex: 2 }}
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      <GlowOrb x="72%" y="40%" color="#d946ef" size={280} opacity={0.09} blur={80} />
      <GlowOrb x="58%" y="20%" color="#818cf8" size={120} opacity={0.08} blur={50} />
    </div>
  );
}

/* ─── Energy Scene ─── */
function EnergyScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Speed lines radiating from right */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 3 }}>
        {[10, 20, 30, 40, 50, 60, 70, 80].map((y, i) => (
          <motion.line key={i} x1="100%" y1={`${y}%`} x2="45%" y2="50%"
            stroke={i % 2 === 0 ? "rgba(129,140,248,0.12)" : "rgba(217,70,239,0.1)"}
            strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 1.5 + i * 0.1, repeat: Infinity, delay: i * 0.08 }}
          />
        ))}
      </svg>

      {/* Floating vertical reel frames */}
      {[
        { left: "42%", top: "8%", h: 200, w: 95, rot: -8, color: "#818cf8", delay: 0 },
        { left: "58%", top: "4%", h: 230, w: 105, rot: 4, color: "#d946ef", delay: 0.4 },
        { left: "74%", top: "10%", h: 190, w: 90, rot: -5, color: "#06b6d4", delay: 0.8 },
        { left: "88%", top: "15%", h: 170, w: 80, rot: 6, color: "#ec4899", delay: 1.2 },
      ].map((frame, i) => (
        <motion.div key={i} className="absolute pointer-events-none rounded-3xl"
          style={{
            left: frame.left, top: frame.top, width: frame.w, height: frame.h,
            rotate: frame.rot, zIndex: 8,
            background: `linear-gradient(180deg, ${frame.color}20, ${frame.color}08)`,
            border: `1.5px solid ${frame.color}35`,
            boxShadow: `0 0 20px ${frame.color}20, inset 0 0 30px ${frame.color}05`,
          }}
          animate={{ y: [0, -12, 0], rotate: [frame.rot - 2, frame.rot + 2, frame.rot - 2] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: frame.delay }}
        >
          {/* Mini waveform inside frame */}
          <div style={{ position: "absolute", bottom: 20, left: 10, right: 10,
            display: "flex", alignItems: "flex-end", gap: 2, height: 30 }}>
            {[8, 18, 10, 25, 14, 22, 8, 16, 20, 12].map((h, j) => (
              <div key={j} style={{ flex: 1, height: h, borderRadius: 2,
                background: frame.color + "80",
                animationDuration: `${0.7 + j * 0.1}s`, animationDelay: `${j * 0.06}s` }}
                className="wave-bar" />
            ))}
          </div>
          {/* Hook label */}
          <div style={{ position: "absolute", top: 14, left: 10,
            background: `${frame.color}25`, border: `1px solid ${frame.color}40`,
            borderRadius: 99, padding: "2px 8px" }}>
            <span style={{ fontSize: 8, fontWeight: 700, color: frame.color }}>Hook: 0:{4 + i * 3}s</span>
          </div>
        </motion.div>
      ))}

      {/* Beat burst circles */}
      {[0, 0.6, 1.2].map((delay, i) => (
        <motion.div key={i} className="absolute pointer-events-none rounded-full"
          style={{ left: "55%", top: "50%", transform: "translate(-50%,-50%)", zIndex: 2,
            border: "2px solid rgba(129,140,248,0.3)" }}
          animate={{ width: [0, 200 + i * 80], height: [0, 200 + i * 80], opacity: [0.6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay, ease: "easeOut" }}
        />
      ))}

      {/* Energy creature companions */}
      <MusicCreature x="40%" y="20%" size={22} color="#818cf8" delay={0} shape="blob" z={14} />
      <MusicCreature x="85%" y="55%" size={26} color="#ec4899" delay={0.8} z={14} />
      <MusicCreature x="65%" y="65%" size={19} color="#d946ef" delay={1.5} shape="blob" z={14} />

      {/* Floating data chips */}
      <FloatingCard x="40%" y="55%" title="Best 15s cut" value="0:04 – 0:19" accent="#818cf8" delay={0.3} rotate={2} w={120} />
      <FloatingCard x="75%" y="62%" title="Opening hook" value="0:02 – 0:08" accent="#ec4899" delay={1} rotate={-3} w={118} />

      {/* Raver character free in scene */}
      <motion.div className="absolute pointer-events-none select-none"
        style={{ right: "5%", bottom: 0, width: "clamp(150px, 20vw, 265px)", zIndex: 20 }}
        animate={{ y: [0, -12, 0], x: [0, 4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/creatures/raver.png" alt="The Raver"
          style={{ width: "100%", objectFit: "contain", objectPosition: "bottom",
            filter: "drop-shadow(0 0 28px rgba(129,140,248,0.65)) drop-shadow(0 0 60px rgba(129,140,248,0.3))" }} />
        <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 18,
          background: "rgba(129,140,248,0.45)", filter: "blur(18px)", borderRadius: "50%" }} />
      </motion.div>

      {/* Particles */}
      {[
        { x: "42%", y: "35%", color: "#818cf8", d: 0 }, { x: "60%", y: "25%", color: "#d946ef", d: 0.4 },
        { x: "78%", y: "30%", color: "#ec4899", d: 0.9 }, { x: "90%", y: "40%", color: "#818cf8", d: 1.3 },
        { x: "52%", y: "70%", color: "#d946ef", d: 0.6 },
      ].map((p, i) => <Particle key={i} x={p.x} y={p.y} color={p.color} delay={p.d} size={3} />)}

      <GlowOrb x="65%" y="50%" color="#818cf8" size={280} opacity={0.1} blur={90} />
    </div>
  );
}

/* ─── Mood Arc / Dreamscape Scene ─── */
function MoodScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Dreamy landscape silhouette */}
      <svg className="absolute bottom-0 w-full pointer-events-none" style={{ zIndex: 4, height: "50%" }}
        viewBox="0 0 900 300" preserveAspectRatio="none">
        <motion.path
          d="M0,200 C120,140 200,220 320,160 C400,110 500,180 600,130 C700,80 800,160 900,120 L900,300 L0,300 Z"
          fill="rgba(251,191,36,0.05)"
          animate={{ d: [
            "M0,200 C120,140 200,220 320,160 C400,110 500,180 600,130 C700,80 800,160 900,120 L900,300 L0,300 Z",
            "M0,220 C120,160 200,240 320,180 C400,130 500,200 600,150 C700,100 800,180 900,140 L900,300 L0,300 Z",
            "M0,200 C120,140 200,220 320,160 C400,110 500,180 600,130 C700,80 800,160 900,120 L900,300 L0,300 Z",
          ]}}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Second softer wave */}
        <motion.path
          d="M0,240 C150,200 280,250 420,210 C540,175 660,225 780,190 C860,168 900,200 900,200 L900,300 L0,300 Z"
          fill="rgba(139,92,246,0.04)"
          animate={{ d: [
            "M0,240 C150,200 280,250 420,210 C540,175 660,225 780,190 C860,168 900,200 900,200 L900,300 L0,300 Z",
            "M0,260 C150,220 280,270 420,230 C540,195 660,245 780,210 C860,188 900,220 900,220 L900,300 L0,300 Z",
            "M0,240 C150,200 280,250 420,210 C540,175 660,225 780,190 C860,168 900,200 900,200 L900,300 L0,300 Z",
          ]}}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </svg>

      {/* Floating memory frames */}
      {[
        { left: "42%", top: "12%", w: 110, h: 75, color: "#fbbf24", rot: -6, delay: 0 },
        { left: "65%", top: "8%", w: 90, h: 65, color: "#a78bfa", rot: 5, delay: 0.7 },
        { left: "80%", top: "20%", w: 80, h: 55, color: "#ec4899", rot: -3, delay: 1.4 },
      ].map((frame, i) => (
        <motion.div key={i} className="absolute pointer-events-none rounded-xl"
          style={{ left: frame.left, top: frame.top, width: frame.w, height: frame.h,
            rotate: frame.rot, zIndex: 8,
            background: `linear-gradient(135deg, ${frame.color}15, ${frame.color}05)`,
            border: `1px solid ${frame.color}30`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 24px ${frame.color}15` }}
          animate={{ y: [0, -10, 0], rotate: [frame.rot - 1.5, frame.rot + 1.5, frame.rot - 1.5] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: frame.delay }}
        >
          <div style={{ padding: 8 }}>
            <div style={{ height: 2, background: `${frame.color}40`, borderRadius: 1, marginBottom: 6 }} />
            <div style={{ height: 1, background: `${frame.color}20`, borderRadius: 1, marginBottom: 4, width: "70%" }} />
            <div style={{ height: 1, background: `${frame.color}20`, borderRadius: 1, width: "50%" }} />
          </div>
        </motion.div>
      ))}

      {/* Floating stars */}
      {[...Array(14)].map((_, i) => (
        <motion.div key={i} className="absolute pointer-events-none rounded-full"
          style={{ left: `${38 + i * 5}%`, top: `${6 + (i % 5) * 11}%`, zIndex: 3,
            width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2, background: "#fbbf24",
            boxShadow: "0 0 4px rgba(251,191,36,0.8)" }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}

      {/* Dreamy companion creatures */}
      <MusicCreature x="42%" y="40%" size={28} color="rgba(251,191,36,0.8)" glowColor="#fbbf24" delay={0} shape="blob" z={12} />
      <MusicCreature x="70%" y="30%" size={22} color="rgba(167,139,250,0.9)" glowColor="#a78bfa" delay={1} z={12} />
      <MusicCreature x="87%" y="55%" size={20} color="rgba(236,72,153,0.8)" glowColor="#ec4899" delay={2} shape="oval" z={12} />

      {/* Mood segment markers */}
      {[
        { left: "44%", top: "58%", label: "Calm opening", color: "#06b6d4" },
        { left: "63%", top: "52%", label: "Building", color: "#fbbf24" },
        { left: "81%", top: "44%", label: "Emotional peak", color: "#ec4899" },
      ].map((m, i) => (
        <motion.div key={i} className="absolute pointer-events-none flex items-center gap-1.5"
          style={{ left: m.left, top: m.top, zIndex: 14 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.8 }}
        >
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: m.color,
            boxShadow: `0 0 10px ${m.color}` }} />
          <span style={{ fontSize: 9, fontWeight: 600, color: m.color }}>{m.label}</span>
        </motion.div>
      ))}

      {/* Jazzman character free in scene */}
      <motion.div className="absolute pointer-events-none select-none"
        style={{ right: "4%", bottom: 0, width: "clamp(155px, 21vw, 280px)", zIndex: 20 }}
        animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/creatures/jazzman.png" alt="The Jazzman"
          style={{ width: "100%", objectFit: "contain", objectPosition: "bottom",
            filter: "drop-shadow(0 0 28px rgba(251,191,36,0.5)) drop-shadow(0 0 60px rgba(251,191,36,0.2))" }} />
        <div style={{ position: "absolute", bottom: 0, left: "12%", right: "12%", height: 18,
          background: "rgba(251,191,36,0.35)", filter: "blur(18px)", borderRadius: "50%" }} />
      </motion.div>

      <GlowOrb x="68%" y="45%" color="#fbbf24" size={240} opacity={0.07} blur={80} />
      <GlowOrb x="88%" y="25%" color="#a78bfa" size={120} opacity={0.08} blur={50} />
    </div>
  );
}

/* ─── Scene registry ─── */
const SCENES = [
  {
    id: "studio",   label: "Creator studio",     pills: ["Best cuts", "Shot plan", "Talk-over"],
    accent: "#f97316", heroBg: "from-[#130500] via-[#0a0200] to-[#07000e]",
    visual: <StudioScene />,
  },
  {
    id: "trending", label: "Trending worldwide",  pills: ["8 languages", "Live charts", "1-click analyse"],
    accent: "#d946ef", heroBg: "from-[#0d001a] via-[#090014] to-[#07000e]",
    visual: <TrendingScene />,
  },
  {
    id: "energy",   label: "Short-form energy",   pills: ["Best 15s cut", "Opening hook", "Reel-ready"],
    accent: "#818cf8", heroBg: "from-[#04002d] via-[#060018] to-[#07000e]",
    visual: <EnergyScene />,
  },
  {
    id: "mood",     label: "Storytelling mood",   pills: ["Emotional arc", "Cinematic pacing", "Mood match"],
    accent: "#fbbf24", heroBg: "from-[#120a00] via-[#0a0500] to-[#07000e]",
    visual: <MoodScene />,
  },
];

/* ─── Main hero ─── */
interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  loading: boolean;
}

export function HeroSection({ onAnalyze, loading }: HeroSectionProps) {
  const [activeScene, setActiveScene] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [url, setUrl] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const rotateNext = useCallback(() => {
    setPhase("out");
    setTimeout(() => { setActiveScene((p) => (p + 1) % SCENES.length); setPhase("in"); }, 450);
  }, []);

  const startRotation = useCallback(() => {
    intervalRef.current = setInterval(rotateNext, 5800);
  }, [rotateNext]);

  useEffect(() => {
    startRotation();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startRotation]);

  const handleManualScene = (i: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("out");
    setTimeout(() => { setActiveScene(i); setPhase("in"); }, 300);
    startRotation();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = url.trim();
    if (!t) return;
    try { new URL(t); } catch { return; }
    onAnalyze(t);
  };

  const scene = SCENES[activeScene];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12 overflow-hidden">
      {/* Deep page background */}
      <AnimatePresence mode="wait">
        <motion.div key={`bg-${scene.id}`}
          className={`absolute inset-0 bg-gradient-to-br ${scene.heroBg}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.4 }}
        />
      </AnimatePresence>

      {/* Page-level ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full blur-[130px]"
          style={{ background: `${scene.accent}14`, transition: "background 1s" }} />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full blur-[100px]"
          style={{ background: `${scene.accent}10`, transition: "background 1s" }} />
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Feature pills */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }} className="flex flex-wrap justify-center gap-2 mb-8">
          {["🔥 Trending now", "✂️ Best cuts", "🎙 Talk-over", "⚖️ Compare"].map((pill) => (
            <span key={pill} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/50 backdrop-blur-sm">
              {pill}
            </span>
          ))}
        </motion.div>

        {/* Hero world container */}
        <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/[0.07] shadow-2xl"
          style={{ minHeight: 560 }}>

          {/* World scene (absolutely positioned layers) */}
          <AnimatePresence mode="wait">
            <motion.div key={`scene-${scene.id}`}
              initial={{ opacity: 0 }} animate={{ opacity: phase === "in" ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              {scene.visual}
            </motion.div>
          </AnimatePresence>

          {/* Left-to-right gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-30 pointer-events-none" />

          {/* Text content — z above scene + overlay */}
          <div className="relative z-40 flex h-full flex-col justify-between p-8 md:p-12" style={{ minHeight: 560 }}>
            {/* Top row: scene label + dots */}
            <div className="flex items-center justify-between">
              <AnimatePresence mode="wait">
                <motion.div key={`label-${scene.id}`}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 w-fit rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 backdrop-blur-md"
                >
                  <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: scene.accent }} />
                  <span className="text-xs font-semibold text-white/60">{scene.label}</span>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-2">
                {SCENES.map((_, i) => (
                  <button key={i} onClick={() => handleManualScene(i)}
                    className="rounded-full transition-all duration-500 hover:opacity-80"
                    style={{ width: i === activeScene ? 22 : 7, height: 7,
                      background: i === activeScene ? scene.accent : "rgba(255,255,255,0.2)",
                      boxShadow: i === activeScene ? `0 0 10px ${scene.accent}` : "none" }}
                  />
                ))}
              </div>
            </div>

            {/* Main heading + input */}
            <div className="mt-auto max-w-lg">
              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Find the best part{" "}
                <span className="gradient-text">of any song</span>{" "}
                for your video.
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="mt-4 max-w-md text-sm leading-7 text-white/50">
                Paste a link, choose what you're making, get the best cut and a simple edit plan.
              </motion.p>

              {/* Scene-specific pills */}
              <AnimatePresence mode="wait">
                <motion.div key={`pills-${scene.id}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="mt-4 flex flex-wrap gap-2">
                  {scene.pills.map((p) => (
                    <span key={p} className="rounded-full border px-2.5 py-1 text-[10px] font-bold"
                      style={{ borderColor: `${scene.accent}40`, color: scene.accent, background: `${scene.accent}12` }}>
                      {p}
                    </span>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Quick input */}
              <motion.form onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste a YouTube or SoundCloud link…" disabled={loading}
                  className="flex-1 rounded-2xl border border-white/15 bg-white/[0.09] px-5 py-3.5 text-sm text-white placeholder-white/25 backdrop-blur-sm outline-none transition focus:border-violet-400/50 focus:bg-white/[0.13] focus:ring-2 focus:ring-violet-400/20 disabled:opacity-50"
                />
                <button type="submit" disabled={loading || !url.trim()}
                  className="shrink-0 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition-all hover:scale-105 hover:shadow-violet-500/50 disabled:opacity-40 disabled:hover:scale-100">
                  {loading ? "Analysing…" : "Analyse →"}
                </button>
              </motion.form>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                className="mt-4 flex flex-wrap gap-4">
                <button onClick={() => document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-xs text-white/35 hover:text-white/65 transition-colors">
                  Explore trending tracks →
                </button>
                <button onClick={() => document.getElementById("compare")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-xs text-white/35 hover:text-white/65 transition-colors">
                  Compare 2 songs →
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
