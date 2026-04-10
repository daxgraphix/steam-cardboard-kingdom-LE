import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameTimer } from '../components/ui/GameTimer';
import { AudioType, Difficulty } from '../types';
import { cn } from '../lib/utils';

interface BlueprintBuildProps {
  level: number;
  isChallenge: boolean;
  difficulty: Difficulty;
  onComplete: (stars: number, xp: number) => void;
  playSound: (type: AudioType, note?: string | string[]) => void;
  onFailure: () => void;
}

interface BuildPart {
  uid: string;
  id: string;
  p: string;
  c: string;
}

export const BlueprintBuild: React.FC<BlueprintBuildProps> = ({
  level,
  isChallenge,
  difficulty,
  onComplete,
  playSound,
  onFailure,
}) => {
  const [placed, setPlaced] = useState<string[]>([]);
  const [showBlueprint, setShowBlueprint] = useState(true);
  
  const difficultyMultiplier = difficulty === 'EASY' ? 0.8 : difficulty === 'HARD' ? 1.5 : 1;
  const [timeLeft, setTimeLeft] = useState(Math.round((20 + level * 5) / difficultyMultiplier));
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const dropZones = useRef<Map<string, DOMRect>>(new Map());

  const shapes = useMemo(() => {
    const s = [
      { id: 'body', p: "M10,10 h80 v80 h-80 Z", c: "#3b82f6" },
      { id: 'top', p: "M10,90 L50,10 L90,90 Z", c: "#ef4444" },
      { id: 'win', p: "M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10", c: "#eab308" }
    ];
    return Array.from({ length: 2 + Math.floor(level/2) }).map((_, i) => ({
      ...s[i % s.length],
      uid: Math.random().toString(36).substr(2, 9)
    }));
  }, [level]);

  useEffect(() => {
    setPlaced([]);
    setShowBlueprint(true);
    setTimeLeft(20 + level * 5);
  }, [level]);

  useEffect(() => {
    if (isChallenge) {
      const hideTimer = setTimeout(() => setShowBlueprint(false), 5000);
      const gameTimer = setInterval(() => {
        setTimeLeft(t => Math.max(0, t - 1));
      }, 1000);
      return () => {
        clearTimeout(hideTimer);
        clearInterval(gameTimer);
      };
    }
  }, [isChallenge]);

  useEffect(() => {
    if (isChallenge && timeLeft === 0) {
      onFailure();
    }
  }, [timeLeft, isChallenge, onFailure]);

  useEffect(() => {
    if (placed.length > 0 && placed.length === shapes.length) {
      const timeout = setTimeout(() => onComplete(3, (100 * level) * (isChallenge ? 2 : 1)), 800);
      return () => clearTimeout(timeout);
    }
  }, [placed, shapes.length, level, isChallenge, onComplete]);

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
    const targetEl = e.currentTarget as HTMLElement;
    targetEl.style.transform = '';

    let hitUid: string | null = null;
    dropZones.current.forEach((rect, uid) => {
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        hitUid = uid;
      }
    });

    if (hitUid === id) {
      playSound('pop');
      setPlaced(prev => [...prev, id]);
    } else if (hitUid) {
      playSound('incorrect');
    }
  };

  const registerDropZone = useCallback((uid: string, node: HTMLDivElement | null) => {
    if (node) dropZones.current.set(uid, node.getBoundingClientRect());
  }, []);

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-6 touch-none">
      {isChallenge && <GameTimer time={timeLeft} />}
      
      <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-3xl flex md:flex-col gap-6 overflow-auto shadow-inner min-h-[120px] border-4 border-slate-200 dark:border-slate-700">
        <AnimatePresence>
          {shapes.map(s => !placed.includes(s.uid) && (
            <motion.div
              key={s.uid}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onPointerDown={(e) => handlePointerDown(e, s.uid)}
              onPointerMove={(e) => handlePointerMove(e, s.uid)}
              onPointerUp={(e) => handlePointerUp(e, s.uid)}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 cursor-grab active:cursor-grabbing z-20"
            >
              <div className="bg-white dark:bg-slate-700 p-2 rounded-2xl shadow-lg border-b-4 border-slate-200 dark:border-slate-900">
                <svg viewBox="0 0 100 100">
                  <path d={s.p} fill={s.c} stroke="white" strokeWidth="2" />
                </svg>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex-grow bg-blue-600 rounded-[3rem] p-12 relative flex flex-wrap content-center justify-center gap-8 overflow-hidden shadow-2xl border-4 border-blue-700">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[length:40px_40px]" />
        
        <div className="absolute top-6 left-6 text-white/40 font-mono text-xs border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
          BLUEPRINT_SPEC_V{level}.0
        </div>

        {shapes.map(s => (
          <div 
            key={s.uid}
            ref={(node) => registerDropZone(s.uid, node)}
            className="w-24 h-24 md:w-32 md:h-32 relative"
          >
            <svg viewBox="0 0 100 100" className={cn(
              "w-full h-full transition-all duration-700",
              isChallenge && !showBlueprint && !placed.includes(s.uid) ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            )}>
              <path 
                d={s.p} 
                fill={placed.includes(s.uid) ? s.c : 'rgba(255,255,255,0.1)'} 
                stroke="white" 
                strokeWidth="2" 
                strokeDasharray={placed.includes(s.uid) ? "" : "5,5"} 
                className="transition-all duration-500"
              />
            </svg>
            {placed.includes(s.uid) && (
              <motion.div 
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 pointer-events-none"
              >
                <div className="w-full h-full border-4 border-white rounded-full animate-ping opacity-20" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
