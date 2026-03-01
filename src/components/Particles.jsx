import { useMemo } from "react";

/**
 * Particles — generates floating ambient particles using CSS animations.
 * Uses pure CSS keyframes defined in index.css for performance.
 */
const Particles = ({ count = 22, colorGold = true }) => {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id:       i,
      left:     Math.random() * 100,
      size:     1 + Math.random() * 2.5,
      duration: 9 + Math.random() * 14,
      delay:    Math.random() * 12,
      color:    Math.random() > 0.5 ? "#ffb703" : "#fb8500",
    })),
  [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle absolute rounded-full"
          style={{
            left:              `${p.left}%`,
            width:             `${p.size}px`,
            height:            `${p.size}px`,
            background:        p.color,
            animationDuration: `${p.duration}s`,
            animationDelay:    `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Particles;
