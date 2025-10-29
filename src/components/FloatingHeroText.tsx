import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback } from "react";

type Props = {
  title: string;
  subtitle: string;
};

export default function FloatingHeroText({ title, subtitle }: Props) {
  // mouse → tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [8, -8]), { stiffness: 80, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-10, 10]), { stiffness: 80, damping: 18 });

  // idle bobbing
  const bobTitle = {
    y: [0, -8, 0, 6, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  };
  const bobSub = {
    y: [0, 6, 0, -6, 0],
    transition: { duration: 7.5, repeat: Infinity, ease: "easeInOut" },
  };

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;   // 0..1
    const py = (e.clientY - rect.top) / rect.height;   // 0..1
    // map to -1..1
    mx.set(px * 2 - 1);
    my.set(py * 2 - 1);
  }, [mx, my]);

  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <div
      className="relative w-full max-w-3xl mx-auto"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 1000 }}
    >
      {/* glow shadow layer */}
      <motion.div
        style={{ rotateX: rx, rotateY: ry }}
        className="absolute inset-0 -z-10 blur-2xl"
        animate={{ opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="text-[52px] sm:text-6xl font-extrabold text-indigo-400/60 text-center select-none">
          {title}
        </div>
        <div className="mt-3 text-base sm:text-lg text-indigo-400/50 text-center px-4">
          {subtitle}
        </div>
      </motion.div>

      {/* main layer */}
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="text-center select-none"
      >
        <motion.h2
          animate={bobTitle as any}
          className="text-[52px] sm:text-6xl font-extrabold bg-gradient-to-r from-indigo-700 via-violet-600 to-blue-600 bg-clip-text text-transparent drop-shadow"
        >
          {title}
        </motion.h2>

        <motion.p
          animate={bobSub as any}
          className="mt-3 text-base sm:text-lg text-gray-700"
        >
          {subtitle.split("React + Framer Motion")[0]}
          <span className="font-semibold text-indigo-600">React + Framer Motion</span>
          {subtitle.split("React + Framer Motion")[1] || ""}
        </motion.p>
      </motion.div>
    </div>
  );
}
