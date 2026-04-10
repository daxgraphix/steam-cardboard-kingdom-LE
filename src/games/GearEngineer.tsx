import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings } from 'lucide-react';
import { GameTimer } from '../components/ui/GameTimer';
import { AudioType, Difficulty } from '../types';
import { cn } from '../lib/utils';

interface GearEngineerProps {
  level: number;
  isChallenge: boolean;
  difficulty: Difficulty;
  onComplete: (stars: number, xp: number) => void;
  playSound: (type: AudioType, note?: string | string[]) => void;
  onFailure: () => void;
}

export const GearEngineer: React.FC<GearEngineerProps> = ({
  level,
  isChallenge,
  difficulty,
  onComplete,
  playSound,
  onFailure,
}) => {
  const [placed, setPlaced] = useState<number[]>([0]); 
  
  const difficultyMultiplier = difficulty === 'EASY' ? 0.8 : difficulty === 'HARD' ? 1.5 : 1;
  const count = Math.round((3 + Math.floor(level/2)) * difficultyMultiplier);
  const slots = useMemo(() => Array.from({ length: count }).map((_, i) => ({ id: i })), [count]);
  const [timeLeft, setTimeLeft] = useState(Math.round((10 + level * 2) / difficultyMultiplier));

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
    if (placed.length === count && placed.length > 1) {
      playSound('correct');
      const timeout = setTimeout(() => onComplete(3, (100 * level) * (isChallenge ? 2 : 1)), 1500);
      return () => clearTimeout(timeout);
    }
  }, [placed.length, count, level, isChallenge, onComplete, playSound]);

  useEffect(() => {
    setPlaced([0]);
  }, [level]);

  const handleClick = (id: number) => {
    if (placed.includes(id - 1) && !placed.includes(id)) {
      playSound('click');
      setPlaced(prev => [...prev, id]);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      {isChallenge && <GameTimer time={timeLeft} />}
      
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 p-12 bg-white dark:bg-slate-800 rounded-[3rem] border-4 border-slate-200 dark:border-slate-700 shadow-2xl relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        
        {slots.map((s, i) => {
          const isPlaced = placed.includes(s.id);
          const isNext = placed.includes(s.id - 1) && !isPlaced;
          const isSpinning = placed.length === count;
          
          return (
            <div key={i} className="relative flex items-center">
              {i > 0 && (
                <div className={cn(
                  "w-6 h-2 md:w-10 md:h-3 transition-colors duration-500",
                  placed.includes(i) ? 'bg-slate-600 dark:bg-slate-400' : 'bg-slate-200 dark:bg-slate-700'
                )} />
              )}
              <motion.button
                whileHover={isNext ? { scale: 1.1, rotate: 10 } : {}}
                whileTap={isNext ? { scale: 0.9 } : {}}
                onClick={() => handleClick(s.id)}
                disabled={!isNext}
                className={cn(
                  "w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all border-4",
                  isPlaced 
                    ? 'bg-orange-500 text-white border-orange-600 shadow-lg' 
                    : 'bg-slate-100 dark:bg-slate-900 border-dashed border-slate-300 dark:border-slate-600',
                  isNext && 'animate-pulse border-orange-400 border-solid bg-orange-50 dark:bg-orange-900/20'
                )}
              >
                {isPlaced && (
                  <motion.div
                    animate={isSpinning ? { rotate: i % 2 === 0 ? 360 : -360 } : {}}
                    transition={isSpinning ? { duration: 3, repeat: Infinity, ease: "linear" } : {}}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <Settings className="w-1/2 h-1/2" />
                  </motion.div>
                )}
              </motion.button>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">
          {placed.length === count ? "System Operational" : `Connect ${count - placed.length} More Gears`}
        </p>
      </div>
    </div>
  );
};
