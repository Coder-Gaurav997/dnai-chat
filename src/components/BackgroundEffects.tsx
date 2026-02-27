import { motion } from "framer-motion";
import { useMemo } from "react";

const BackgroundEffects = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.4 + 0.1,
      })),
    []
  );

  const bubbles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 60 + 20,
        duration: Math.random() * 12 + 10,
        delay: Math.random() * 8,
        opacity: Math.random() * 0.06 + 0.02,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px] animate-pulse-glow"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-primary/3 blur-[100px] animate-pulse-glow"
        style={{ animationDelay: "3s" }}
      />

      {/* Shine points / sparkle particles */}
      {particles.map((p) => (
        <motion.div
          key={`particle-${p.id}`}
          className="absolute rounded-full bg-primary/60"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            opacity: [0, p.opacity, 0],
            scale: [0.5, 1.5, 0.5],
            y: [0, -30, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating bubbles */}
      {bubbles.map((b) => (
        <motion.div
          key={`bubble-${b.id}`}
          className="absolute rounded-full border border-primary/10"
          style={{
            left: `${b.x}%`,
            bottom: "-10%",
            width: b.size,
            height: b.size,
            opacity: b.opacity,
          }}
          animate={{
            y: [0, -(typeof window !== "undefined" ? window.innerHeight + 200 : 1200)],
            x: [0, Math.sin(b.id) * 50],
            opacity: [0, b.opacity, b.opacity, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
};

export default BackgroundEffects;
