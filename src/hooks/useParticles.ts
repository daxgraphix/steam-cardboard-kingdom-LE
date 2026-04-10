import { useCallback, useEffect, useRef, useState } from 'react';

export interface ParticleTrigger {
  id: number;
  x: number;
  y: number;
  color?: string;
}

export const useParticles = () => {
  const [triggers, setTriggers] = useState<ParticleTrigger[]>([]);
  const timeouts = useRef<number[]>([]);

  const spawnParticles = useCallback((x: number, y: number, color?: string) => {
    const id = Date.now();
    setTriggers(prev => [...prev, { id, x, y, color }]);
    const timeout = window.setTimeout(() => {
      setTriggers(prev => prev.filter(t => t.id !== id));
    }, 1000);

    timeouts.current.push(timeout);
  }, []);

  useEffect(() => {
    return () => {
      timeouts.current.forEach(window.clearTimeout);
      timeouts.current = [];
    };
  }, []);

  return { triggers, spawnParticles };
};
