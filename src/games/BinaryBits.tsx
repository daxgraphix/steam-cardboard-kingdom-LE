import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Binary } from 'lucide-react';
import { GameTimer } from '../components/ui/GameTimer';
import { AudioType, Difficulty } from '../types';
import { cn } from '../lib/utils';

interface BinaryBitsProps {
  level: number;
  isChallenge: boolean;
  difficulty: Difficulty;
  onComplete: (stars: number, xp: number) => void;
  playSound: (type: AudioType, note?: string | string[]) => void;
  onFailure: () => void;
}

export const BinaryBits: React.FC<BinaryBitsProps> = ({
  level,
  isChallenge,
  difficulty,
  onComplete,
  playSound,
  onFailure,
}) => {
  const difficultyMultiplier = difficulty === 'EASY' ? 0.8 : difficulty === 'HARD' ? 1.5 : 1;
  
  const bitCount = useMemo(() => {
    const base = 3 + Math.floor(level / 2);
    if (difficulty === 'EASY') return Math.max(3, base - 1);
    if (difficulty === 'HARD') return Math.min(8, base + 1);
    return Math.min(8, base);
  }, [level, difficulty]);

  const [target, setTarget] = useState(0);
  const [bits, setBits] = useState<number[]>(new Array(bitCount).fill(0));
  const [timeLeft, setTimeLeft] = useState(Math.round((15 + level * 2) / difficultyMultiplier));
  const [score, setScore] = useState(0);
  
  const targetScore = useMemo(() => {
    const base = isChallenge ? 10 : 3 + Math.floor(level / 2);
    return Math.round(base * difficultyMultiplier);
  }, [isChallenge, level, difficultyMultiplier]);

  const generateTarget = useCallback(() => {
    const max = Math.pow(2, bitCount) - 1;
    setTarget(Math.floor(Math.random() * max) + 1);
    setBits(new Array(bitCount).fill(0));
  }, [bitCount]);

  useEffect(() => {
    generateTarget();
  }, [generateTarget]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      onFailure();
    }
  }, [timeLeft, onFailure]);

  useEffect(() => {
    if (score > 0) {
      if (score >= targetScore) {
        onComplete(3, (100 * level) * (isChallenge ? 2 : 1));
      } else {
        const timeout = setTimeout(generateTarget, 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [score, targetScore, level, isChallenge, onComplete, generateTarget]);

  const currentValue = useMemo(() => {
    return bits.reduce((acc, bit, i) => acc + bit * Math.pow(2, bitCount - 1 - i), 0);
  }, [bits, bitCount]);

  const toggleBit = (index: number) => {
    playSound('click');
    const newBits = [...bits];
    newBits[index] = newBits[index] === 0 ? 1 : 0;
    setBits(newBits);

    const newValue = newBits.reduce((acc, bit, i) => acc + bit * Math.pow(2, bitCount - 1 - i), 0);
    if (newValue === target) {
      playSound('correct');
      setScore(s => s + 1);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 relative">
      <GameTimer time={timeLeft} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-2xl border-4 border-slate-200 dark:border-slate-700 flex flex-col items-center gap-12"
      >
        <div className="text-center space-y-2">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Convert to Binary</p>
          <motion.h2 
            key={target}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="marker-font text-7xl text-slate-800 dark:text-white"
          >
            {target}
          </motion.h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {bits.map((bit, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleBit(i)}
                className={cn(
                  "w-12 h-20 md:w-16 md:h-24 rounded-2xl border-4 flex items-center justify-center text-3xl font-black transition-all",
                  bit === 1 
                    ? "bg-blue-500 border-blue-600 text-white shadow-[0_6px_0_#1e40af]" 
                    : "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500"
                )}
              >
                {bit}
              </motion.button>
              <span className="text-[10px] font-bold text-slate-400 font-mono">
                {Math.pow(2, bitCount - 1 - i)}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="text-2xl font-bold text-slate-600 dark:text-slate-300">
               Current: <motion.span 
                 key={currentValue}
                 animate={{ scale: currentValue === target ? [1, 1.2, 1] : 1 }}
                 className={cn(currentValue > target ? "text-red-500" : "text-blue-500")}
               >
                 {currentValue}
               </motion.span>
             </div>
          </div>
          
          <div className="flex gap-2">
            {Array.from({ length: targetScore }).map((_, i) => (
              <motion.div 
                key={i}
                initial={false}
                animate={{ 
                  scale: i < score ? 1.2 : 1,
                  backgroundColor: i < score ? "#22c55e" : "#e2e8f0"
                }}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-500",
                  i < score ? "shadow-[0_0_10px_#22c55e]" : "dark:bg-slate-700"
                )}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
