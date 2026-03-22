"use client";

export function HeroBackground() {
  const particles = [
    { size: 4, left: "12%", delay: "0s", duration: "6s", color: "#f97316" },
    { size: 3, left: "25%", delay: "1.5s", duration: "8s", color: "#ec4899" },
    { size: 5, left: "40%", delay: "0.5s", duration: "7s", color: "#a855f7" },
    { size: 3, left: "55%", delay: "2s", duration: "9s", color: "#fbbf24" },
    { size: 4, left: "68%", delay: "1s", duration: "6.5s", color: "#f97316" },
    { size: 3, left: "80%", delay: "3s", duration: "8.5s", color: "#ec4899" },
    { size: 5, left: "90%", delay: "0.8s", duration: "7.5s", color: "#a855f7" },
    { size: 3, left: "5%", delay: "2.5s", duration: "10s", color: "#fbbf24" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="blob-1 absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #f97316, #ec4899)" }}
      />
      <div
        className="blob-2 absolute -top-20 right-0 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #a855f7, #3b82f6)" }}
      />
      <div
        className="blob-3 absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full opacity-10 blur-3xl"
        style={{ background: "radial-gradient(circle, #fbbf24, #f97316)" }}
      />

      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            bottom: "10%",
            backgroundColor: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: 0,
          }}
        />
      ))}

      <div className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(249,115,22,0.1), transparent)",
        }}
      />
    </div>
  );
}
