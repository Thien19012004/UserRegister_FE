import { motion } from "framer-motion";
import { useMemo } from "react";

type FloatingTextOverlayProps = {
  phrases?: string[];
  rows?: number;         // số dải chữ
  density?: number;      // số cụm chữ mỗi dải
  speedMin?: number;     // giây
  speedMax?: number;     // giây
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function FloatingTextOverlay({
  phrases = ["Authorization", "Login", "Sign Up", "Thien", "Haha", "Hoho", "Hehe"],
  rows = 6,
  density = 4,
  speedMin = 20,
  speedMax = 45,
}: FloatingTextOverlayProps) {
  
  const bands = useMemo(() => {
    return Array.from({ length: rows }).map((_, rowIdx) => {
      const angle = rand(-8, 8);              
      const top = (rowIdx + 1) * (100 / (rows + 1)); 
      const speed = rand(speedMin, speedMax);  
      const dir = rowIdx % 2 === 0 ? 1 : -1;   
      const opacity = rand(0.08, 0.18);        
      const size = rand(20, 36);               
      const blur = rand(0, 1.5);              
      const words = Array.from({ length: density }).map(() => {
        const text = phrases[Math.floor(Math.random() * phrases.length)];
        return { text, gap: rand(24, 80) };
      });
      return { angle, top, speed, dir, opacity, size, blur, words };
    });
  }, [rows, density, speedMin, speedMax, phrases]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      style={{ mixBlendMode: "normal" }}
    >
      {bands.map((b, i) => (
        <div
          key={i}
          className="absolute w-[140vw] -left-[20vw]"
          style={{
            top: `${b.top}%`,
            transform: `rotate(${b.angle}deg)`,
            opacity: b.opacity,
            filter: `blur(${b.blur}px)`,
            willChange: "transform",
          }}
        >
          <motion.div
          
            animate={{ x: b.dir > 0 ? ["-20vw", "-160vw"] : ["-160vw", "-20vw"] }}
            transition={{
              duration: b.speed,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex items-center whitespace-nowrap"
          >
            {/* Lặp một chuỗi dài để luôn phủ kín màn hình */}
            {Array.from({ length: 8 }).map((_, k) => (
              <div key={k} className="flex items-center">
                {b.words.map((w, j) => (
                  <span
                    key={`${k}-${j}`}
                    className="uppercase tracking-wider"
                    style={{
                      fontSize: `${b.size}px`,
                      marginRight: `${w.gap}px`,
                  
                      WebkitTextStroke: "1px rgba(0,0,0,0.08)",
                      color: "rgba(31,41,55,0.25)",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {w.text}
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
