import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameTimer } from '../components/ui/GameTimer';
import { AudioType, Difficulty } from '../types';
import { cn } from '../lib/utils';

interface ShadowLabProps {
  level: number;
  isChallenge: boolean;
  difficulty: Difficulty;
  onComplete: (stars: number, xp: number) => void;
  playSound: (type: AudioType, note?: string | string[]) => void;
  onFailure: () => void;
}

interface Shape {
  id: string;
  p: string;
  c: string;
  uid: string;
}

export const ShadowLab: React.FC<ShadowLabProps> = ({
  level,
  isChallenge,
  difficulty,
  onComplete,
  playSound,
  onFailure,
}) => {
  const [matched, setMatched] = useState<string[]>([]);
  
  const difficultyMultiplier = difficulty === 'EASY' ? 0.8 : difficulty === 'HARD' ? 1.5 : 1;
  const [timeLeft, setTimeLeft] = useState(Math.round((30 + level * 5) / difficultyMultiplier));
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const dropZones = useRef<Map<string, DOMRect>>(new Map());

  const shapes = useMemo(() => {
    const all = [
      { id: 'tri', p: "M50,15 L90,85 L10,85 Z", c: "#ef4444" },
      { id: 'sq', p: "M15,15 h70 v70 h-70 Z", c: "#3b82f6" },
      { id: 'cir', p: "M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10", c: "#eab308" },
      { id: 'star', p: "M50,5 L63,40 H98 L70,60 L80,95 L50,75 L20,95 L30,60 L2,40 H37 Z", c: "#a855f7" },
      { id: 'hex', p: "M25,5 L75,5 L100,50 L75,95 L25,95 L0,50 Z", c: "#10b981" }
    ];
    return all.slice(0, Math.min(all.length, 2 + Math.ceil(level/2))).map(s => ({ ...s, uid: Math.random().toString(36).substr(2, 9) }));
  }, [level]);

  useEffect(() => {
    if (isChallenge) {
      const timer = setInterval(() => {
        setTimeLeft(t => Math.max(0, t - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isChallenge]);

  useEffect(() => {
    if (isChallenge && timeLeft === 0) {
      onFailure();
    }
  }, [timeLeft, isChallenge, onFailure]);

  useEffect(() => {
    if (matched.length > 0 && matched.length === shapes.length) {
      onComplete(3, (100 * level) * (isChallenge ? 2 : 1));
    }
  }, [matched, shapes.length, level, isChallenge, onComplete]);
  
  useEffect(() => {
    setMatched([]);
  }, [level]);

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    setDraggedId(id);
    setDragPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent, id: string) => {
    if (draggedId !== id) return;
    const target = e.currentTarget as HTMLElement;
    target.style.transform = `translate(${e.clientX - dragPos.x - target.offsetLeft}px, ${e.clientY - dragPos.y - target.offsetTop}px)`;
  };

  const handlePointerUp = (e: React.PointerEvent, id: string) => {
    if (draggedId !== id) return;
    setDraggedId(null);
    const target = e.currentTarget as HTMLElement;
    target.style.transform = '';

    let hitId: string | null = null;
    dropZones.current.forEach((rect, zoneId) => {
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        hitId = zoneId;
      }
    });

    if (hitId === id) {
      playSound('pop');
      setMatched(prev => [...prev, id]);
    } else {
      playSound('incorrect');
    }
  };

  const registerDropZone = useCallback((id: string, node: HTMLDivElement | null) => {
    if (node) dropZones.current.set(id, node.getBoundingClientRect());
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-around p-4 max-w-2xl mx-auto touch-none">
      {isChallenge && <GameTimer time={timeLeft} />}
      
      <div className="w-full grid grid-cols-3 gap-4 bg-slate-200 dark:bg-slate-800 p-8 rounded-[3rem] border-4 border-slate-300 dark:border-slate-700 shadow-inner">
        {shapes.map(s => (
          <div 
            key={s.id}
            ref={(node) => registerDropZone(s.id, node)}
            className={cn(
              "aspect-square flex items-center justify-center transition-all duration-500 rounded-2xl",
              matched.includes(s.id) ? 'bg-green-500/20 scale-90' : 'bg-slate-300/50 dark:bg-slate-700/50'
            )}
          >
            <svg viewBox="0 0 100 100" className={cn(
              "w-20 h-20 transition-all",
              matched.includes(s.id) ? 'opacity-0 scale-0' : 'opacity-40 grayscale'
            )}>
              <path d={s.p} fill="#334155" />
            </svg>
          </div>
        ))}
      </div>

      <div className="flex gap-6 flex-wrap justify-center min-h-[140px] w-full">
        <AnimatePresence>
          {shapes.map(s => !matched.includes(s.id) && (
            <motion.div
              key={s.id}
              layoutId={s.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onPointerDown={(e) => handlePointerDown(e, s.id)}
              onPointerMove={(e) => handlePointerMove(e, s.id)}
              onPointerUp={(e) => handlePointerUp(e, s.id)}
              className="cursor-grab active:cursor-grabbing z-20"
            >
              <div className="bg-white dark:bg-slate-700 p-2 rounded-2xl shadow-xl border-b-4 border-slate-200 dark:border-slate-900 hover:scale-110 transition-transform">
                <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md">
                  <path d={s.p} fill={s.c} stroke="white" strokeWidth="3" />
                </svg>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
