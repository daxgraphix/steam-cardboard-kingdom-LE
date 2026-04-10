import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
}

export const ParticleEffect: React.FC<{ x: number; y: number; color?: string; count?: number }> = ({ 
  x, 
  y, 
  color = '#3b82f6', 
  count = 12 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: Math.random(),
      x,
      y,
      color,
      size: Math.random() * 8 + 4,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 1000);
    return () => clearTimeout(timer);
  }, [x, y, color, count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
            animate={{ 
              x: p.x + p.vx * 20, 
              y: p.y + p.vy * 20, 
              opacity: 0, 
              scale: 0 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: '50%',
              boxShadow: `0 0 10px ${p.color}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
