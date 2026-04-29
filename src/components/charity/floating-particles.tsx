"use client";

/**
 * Floating particles — חלקיקים עדינים שצפים על רקע ה-Hero.
 * 12 חלקיקים, גדלים שונים, animation delays שונים.
 */
export function FloatingParticles() {
  const particles = Array.from({ length: 14 }).map((_, i) => ({
    size: 2 + ((i * 7) % 5),
    left: (i * 13) % 100,
    delay: (i * 0.7) % 8,
    duration: 9 + ((i * 3) % 8),
    opacity: 0.15 + ((i * 5) % 30) / 100,
  }));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle absolute rounded-full bg-white"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
