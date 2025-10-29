import { motion, useMotionValue, animate } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";

interface RotatableCardProps {
  children: ReactNode;
  width?: number;
  height?: number;
  /** độ nhạy xoay (góc / pixel) */
  sensitivity?: number; // mặc định 0.4
  /** bật quán tính sau khi thả */
  inertia?: boolean;    // mặc định true
}

export default function RotatableCard({
  children,
  width = 380,
  height = 340,
  sensitivity = 0.4,
  inertia = true,
}: RotatableCardProps) {
  // Lưu góc hiện tại dạng số (vượt quá 360° cũng ok)
  const angleXRef = useRef(0); // xoay theo trục X (kéo lên/xuống)
  const angleYRef = useRef(0); // xoay theo trục Y (kéo trái/phải)

  // Motion values để render mượt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Hàm cập nhật góc + set vào motion values
  const setAngles = (ax: number, ay: number) => {
    angleXRef.current = ax;
    angleYRef.current = ay;
    rotateX.set(ax);
    rotateY.set(ay);
  };

  return (
    <div className="perspective w-full flex justify-center items-center">
      <motion.div
        className="relative bg-white/95 rounded-2xl shadow-2xl p-6 flex flex-col justify-center items-center cursor-grab transform-style-preserve-3d select-none"
        style={{ width, height, rotateX, rotateY, x, y }}
        drag
        dragElastic={0}            // ta tự xử lý quán tính
        dragMomentum={false}       // tắt momentum mặc định
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        whileTap={{ cursor: "grabbing", scale: 0.995 }}
        onDrag={(_, info) => {
          // delta: thay đổi so với event trước -> cộng dồn vào góc
          const nextY = angleYRef.current + info.delta.x * sensitivity; // kéo ngang -> rotateY
          const nextX = angleXRef.current - info.delta.y * sensitivity; // kéo dọc -> rotateX (ngược chiều)
          setAngles(nextX, nextY);
        }}
        onDragEnd={(_, info) => {
          if (!inertia) return;
          // Quán tính: tiếp tục xoay thêm theo vận tốc lúc thả
          const vx = info.velocity.y; // vận tốc trục dọc -> tác động rotateX
          const vy = info.velocity.x; // vận tốc trục ngang -> tác động rotateY
          const extraX = -vx * 0.15;  // hệ số quán tính, có thể chỉnh
          const extraY =  vy * 0.15;

          const targetX = angleXRef.current + extraX;
          const targetY = angleYRef.current + extraY;

          // animate dạng "inertia-like" (dùng spring nhẹ để dừng dần)
          const stopX = animate(angleXRef.current, targetX, {
            type: "spring",
            stiffness: 40,
            damping: 20,
            onUpdate: (v) => rotateX.set(v),
          });
          const stopY = animate(angleYRef.current, targetY, {
            type: "spring",
            stiffness: 40,
            damping: 20,
            onUpdate: (v) => rotateY.set(v),
          });

          // cập nhật ref cuối cùng khi dừng
          stopX.then(() => { angleXRef.current = rotateX.get(); });
          stopY.then(() => { angleYRef.current = rotateY.get(); });
        }}
      >
        {/* Shine / highlight nhẹ để cảm giác 3D đẹp hơn */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(120px 160px at 30% 20%, rgba(255,255,255,0.35), rgba(255,255,255,0))",
          }}
        />
        {children}
      </motion.div>
    </div>
  );
}
