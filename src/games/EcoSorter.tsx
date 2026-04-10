import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameTimer } from '../components/ui/GameTimer';
import { AudioType, Difficulty } from '../types';
import { cn } from '../lib/utils';

interface EcoSorterProps {
  level: number;
  isChallenge: boolean;
  difficulty: Difficulty;
  onComplete: (stars: number, xp: number) => void;
  playSound: (type: AudioType, note?: string | string[]) => void;
  onFailure: () => void;
}

interface SorterItem {
  uid: string;
  type: 'recycle' | 'compost' | 'trash';
  emoji: string;
  r: number;
}

export const EcoSorter: React.FC<EcoSorterProps> = ({
  level,
  isChallenge,
  difficulty,
  onComplete,
  playSound,
  onFailure,
}) => {
  const [items, setItems] = useState<SorterItem[]>([]);
  const [score, setScore] = useState(0);
  
  const difficultyMultiplier = difficulty === 'EASY' ? 0.8 : difficulty === 'HARD' ? 1.5 : 1;
  const [timeLeft, setTimeLeft] = useState(Math.round((isChallenge ? 30 : 0) / difficultyMultiplier));
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const dropZones = useRef<Map<string, DOMRect>>(new Map());
  
  const target = Math.round((isChallenge ? 20 : 5 + level) * difficultyMultiplier);

  const bins = [
    { id: 'recycle', label: 'Recycle', color: 'bg-blue-500', icon: '♻️' },
    { id: 'compost', label: 'Compost', color: 'bg-green-500', icon: '🍎' },
    { id: 'trash', label: 'Trash', color: 'bg-slate-500', icon: '🗑️' }
  ];

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
      if (score >= 15) onComplete(3, score * 20);
      else onFailure();
    }
  }, [timeLeft, isChallenge, score, onComplete, onFailure]);

  useEffect(() => {
    if (!isChallenge && score > 0 && score === target) {
      const timeout = setTimeout(() => onComplete(3, 100 * level), 500);
      return () => clearTimeout(timeout);
    }
  }, [score, isChallenge, target, onComplete, level]);

  useEffect(() => {
    setScore(0);
    const pool: Omit<SorterItem, 'uid' | 'r'>[] = [
      { type: 'recycle', emoji: '🥤' }, { type: 'recycle', emoji: '📰' }, { type: 'recycle', emoji: '🥫' },
      { type: 'compost', emoji: '🍌' }, { type: 'compost', emoji: '🍂' }, { type: 'compost', emoji: '🥚' },
      { type: 'trash', emoji: '🍬' }, { type: 'trash', emoji: '🎈' }, { type: 'trash', emoji: '🚬' }
    ];
    const count = isChallenge ? 30 : target;
    const newItems = Array.from({ length: count }).map((_, i) => ({
      ...pool[Math.floor(Math.random() * pool.length)],
      uid: Math.random().toString(36).substr(2, 9),
      r: Math.random() * 360
    }));
    setItems(newItems);
  }, [level, isChallenge, target]);

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

  const handlePointerUp = (e: React.PointerEvent, id: string, type: string) => {
    if (draggedId !== id) return;
    setDraggedId(null);
    const targetEl = e.currentTarget as HTMLElement;
    targetEl.style.transform = '';

    let hitBinId: string | null = null;
    dropZones.current.forEach((rect, binId) => {
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        hitBinId = binId;
      }
    });

    if (hitBinId === type) {
      playSound('pop');
      setItems(prev => prev.filter(i => i.uid !== id));
      setScore(s => s + 1);
    } else if (hitBinId) {
      playSound('incorrect');
    }
  };

  const registerDropZone = useCallback((id: string, node: HTMLDivElement | null) => {
    if (node) dropZones.current.set(id, node.getBoundingClientRect());
  }, []);

  return (
    <div className="h-full flex flex-col p-4 touch-none">
      {isChallenge && <GameTimer time={timeLeft} />}
      
      <div className="flex justify-center gap-2 md:gap-6 mb-8">
        {bins.map(b => (
          <div 
            key={b.id}
            ref={(node) => registerDropZone(b.id, node)}
            className={cn(
              b.color,
              "w-24 h-32 md:w-36 md:h-48 rounded-b-3xl rounded-t-lg flex flex-col items-center justify-end p-4 text-white border-t-[12px] border-black/20 shadow-2xl transition-transform active:scale-95"
            )}
          >
            <div className="text-4xl md:text-6xl mb-4 drop-shadow-lg">{b.icon}</div>
            <div className="font-black text-xs md:text-sm uppercase tracking-tighter">{b.label}</div>
          </div>
        ))}
      </div>

      <div className="flex-grow bg-[#dcb386] rounded-t-[3rem] border-t-[12px] border-[#b58d64] p-8 flex flex-wrap justify-center content-center gap-6 relative shadow-inner overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm10 10l10 10M10 10L0 20M10 10L20 0M10 10L0 0\' stroke=\'%23000\' fill=\'none\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} />
        
        <AnimatePresence>
          {items.map(item => (
            <motion.div
              key={item.uid}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onPointerDown={(e) => handlePointerDown(e, item.uid)}
              onPointerMove={(e) => handlePointerMove(e, item.uid)}
              onPointerUp={(e) => handlePointerUp(e, item.uid, item.type)}
              className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl cursor-grab active:cursor-grabbing hover:scale-110 transition-transform border-b-4 border-slate-200 z-10"
            >
              <div style={{ transform: `rotate(${item.r}deg)` }}>{item.emoji}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!isChallenge && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur px-6 py-2 rounded-full font-bold text-slate-600 shadow-lg border-2 border-slate-200">
          {score} / {target} Sorted
        </div>
      )}
    </div>
  );
};
