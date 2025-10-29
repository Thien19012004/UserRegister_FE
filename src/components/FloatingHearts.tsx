import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Heart {
  id: number;
  x: number; // vị trí ngang ban đầu
  size: number;
  delay: number;
  duration: number;
  color: string;
}

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHearts: Heart[] = Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
        (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * window.innerWidth,
          size: 16 + Math.random() * 20,
          delay: Math.random() * 0.5,
          duration: 2.5 + Math.random() * 2,
          color: ["#ef4444", "#f43f5e", "#ec4899", "#e11d48"][Math.floor(Math.random() * 4)],
        })
      );
      setHearts((prev) => [...prev, ...newHearts]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-[9999]">
      {hearts.map((heart) => (
        <motion.span
          key={heart.id}
          initial={{
            x: heart.x,
            y: window.innerHeight + 50,
            opacity: 1,
            scale: 0.8,
            rotate: 0,
          }}
          animate={{
            y: -100,
            opacity: 0,
            scale: [1, 1.5, 1],
            rotate: [0, 20, -20, 0],
          }}
          transition={{
            delay: heart.delay,
            duration: heart.duration,
            ease: "easeOut",
          }}
          onAnimationComplete={() => {
            setHearts((prev) => prev.filter((h) => h.id !== heart.id));
          }}
          style={{
            position: "absolute",
            left: heart.x,
            fontSize: heart.size,
            color: heart.color,
          }}
        >
          ❤️
        </motion.span>
      ))}
    </div>
  );
}
