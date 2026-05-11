import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function FloatingPaths({ position, count }: { position: number; count: number }) {
  const paths = Array.from({ length: count }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none opacity-40 [filter:blur(0.4px)]">
      <svg
        className="w-full h-full"
        style={{ color: "#F4F6F8" }}
        viewBox="0 0 696 316"
        fill="none"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.05 + path.id * 0.018}
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{
              pathLength: 1,
              opacity: [0.18, 0.38, 0.18],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPaths() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // 1. Detecta si el dispositivo principal usa pantalla táctil (coarse pointer) como celulares o tablets
    const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    
    // 2. Detecta si el sistema operativo en el User-Agent es móvil
    const isMobileOS = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    setIsMobileDevice(hasCoarsePointer || isMobileOS);
  }, []);

  // Si es un dispositivo móvil real, desactivar por completo los trazos pesados para un rendimiento óptimo
  if (isMobileDevice) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <FloatingPaths position={1} count={36} />
      <FloatingPaths position={-1} count={36} />
    </div>
  );
}
