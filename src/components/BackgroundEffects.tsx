import { motion } from "framer-motion";
import { useMemo } from "react";

const BackgroundEffects = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 1.5,
        duration: Math.random() * 5 + 3,
        delay: Math.random() * 3,
        opacity: Math.random() * 0.6 + 0.25,
      })),
    []
  );

  const bubbles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 55 + 20,
        duration: Math.random() * 10 + 6,
        delay: Math.random() * 6,
        opacity: Math.random() * 0.18 + 0.08,
      })),
    []
  );

  const shinePoints = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 3,
        duration: Math.random() * 2.5 + 1.5,
        delay: Math.random() * 4,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
      {/* Large gradient orbs */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]"
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/8 blur-[120px]"
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.15, 1] }}
        transition={{ duration: 7, delay: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[40%] left-[50%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px]"
        animate={{ opacity: [0.2, 0.5, 0.2], x: [-20, 20, -20] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Shine points - bright twinkle stars */}
      {shinePoints.map((s) => (
        <motion.div
          key={`shine-${s.id}`}
          className="absolute rounded-full bg-accent"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            filter: "blur(1px)",
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.3, 2, 0.3],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Sparkle particles */}
      {particles.map((p) => (
        <motion.div
          key={`particle-${p.id}`}
          className="absolute rounded-full bg-accent/70"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            opacity: [0, p.opacity, 0],
            scale: [0.5, 1.8, 0.5],
            y: [0, -40, 0],
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
          className="absolute rounded-full border border-accent/25 bg-accent/[0.06]"
          style={{
            left: `${b.x}%`,
            bottom: "-10%",
            width: b.size,
            height: b.size,
          }}
          animate={{
            y: [0, -(typeof window !== "undefined" ? window.innerHeight + 200 : 1200)],
            x: [0, Math.sin(b.id) * 60],
            opacity: [0, b.opacity, b.opacity, 0],
            scale: [0.8, 1.2, 0.9],
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
        className="absolute inset-0 opacity-[0.02]"
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
