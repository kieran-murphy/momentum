"use client";

import { useEffect, useState } from "react";

type Particle = {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
};

export default function Burst({ color, onDone }: { color: string; onDone: () => void }) {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      angle: (360 / 10) * i + Math.random() * 20 - 10,
      distance: 22 + Math.random() * 14,
      size: 3 + Math.random() * 3,
      delay: Math.random() * 40,
    }))
  );

  useEffect(() => {
    const t = setTimeout(onDone, 550);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <span className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0" aria-hidden="true">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const dx = Math.cos(rad) * p.distance;
        const dy = Math.sin(rad) * p.distance;
        return (
          <span
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: color,
              left: 0,
              top: 0,
              animation: `burst-fly 500ms ease-out ${p.delay}ms forwards`,
              // @ts-expect-error custom properties for the keyframe
              "--dx": `${dx}px`,
              "--dy": `${dy}px`,
            }}
          />
        );
      })}
      <style jsx>{`
        @keyframes burst-fly {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.4);
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}
