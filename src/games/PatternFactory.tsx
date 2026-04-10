import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameTimer } from '../components/ui/GameTimer';
import { AudioType, Difficulty } from '../types';
import { cn } from '../lib/utils';

interface PatternFactoryProps {
  level: number;
  isChallenge: boolean;
  difficulty: Difficulty;
  onComplete: (stars: number, xp: number) => void;
  playSound: (type: AudioType, note?: string | string[]) => void;
  onFailure: () => void;
}

type ShapeType = 'sq' | 'cir' | 'tri' | 'star';

export const PatternFactory: React.FC<PatternFactoryProps> = ({
  level,
  isChallenge,
  difficulty,
  onComplete,
  playSound,
  onFailure,
}) => {
  const [pattern, setPattern] = useState<ShapeType[]>([]);
  const [options, setOptions] = useState<ShapeType[]>([]);
  
  const difficultyMultiplier = difficulty === 'EASY' ? 0.8 : difficulty === 'HARD' ? 1.5 : 1;
  const [timeLeft, setTimeLeft] = useState(15);
  const [answerIndex, setAnswerIndex] = useState(0);
  
  const generatePattern = useMemo(() => {
    const types: ShapeType[] = ['sq', 'cir', 'tri', 'star'];
    const pool = types.slice(0, Math.min(types.length, 2 + Math.floor(level/3)));
    const seqLen = Math.round((4 + Math.floor(level/2)) * difficultyMultiplier);
    
    let seq: ShapeType[] = [];
    // Simple ABAB or ABCA patterns
    for(let i=0; i<seqLen; i++) {
      seq.push(pool[i % pool.length]);
    }
    
    const hiddenIdx = seq.length - 1;
    return { seq, hiddenIdx, pool };
  }, [level]);

  useEffect(() => {
    setPattern(generatePattern.seq);
    setAnswerIndex(generatePattern.hiddenIdx);
    setOptions([...generatePattern.pool].sort(() => Math.random() - 0.5));
    setTimeLeft(Math.round((isChallenge ? 10 : 20) / difficultyMultiplier));
  }, [generatePattern, isChallenge, difficultyMultiplier]);

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

  const Shape = ({ type, className, isHidden }: { type: ShapeType, className?: string, isHidden?: boolean }) => (
    <div className={cn(
      "w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl transition-all",
      isHidden ? "bg-slate-800 border-4 border-slate-700 animate-pulse" : "bg-white shadow-lg",
      className
    )}>
      {isHidden ? (
        <span className="text-white text-3xl font-bold">?</span>
      ) : (
        <>
          {type === 'sq' && <div className="w-10 h-10 bg-blue-500 rounded-lg" />}
          {type === 'cir' && <div className="w-10 h-10 bg-red-500 rounded-full" />}
          {type === 'tri' && <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[34px] border-b-yellow-500" />}
          {type === 'star' && <div className="w-12 h-12 bg-purple-500 [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]" />}
        </>
      )}
    </div>
  );

  const handleSelect = (type: ShapeType) => {
    if (type === pattern[answerIndex]) {
      playSound('correct');
      onComplete(3, (100 * level) * (isChallenge ? 2 : 1));
    } else {
      playSound('incorrect');
      if (isChallenge) onFailure();
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-16 p-4">
      {isChallenge && <GameTimer time={timeLeft} />}
      
      <div className="w-full max-w-4xl relative h-40 bg-slate-300 dark:bg-slate-700 rounded-3xl border-y-8 border-slate-400 dark:border-slate-800 overflow-hidden flex items-center px-8 shadow-inner">
        <div 
          className="absolute inset-0 opacity-10 animate-[conveyor_2s_linear_infinite]" 
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, #000 40px, #000 48px)' }} 
        />
        
        <div className="relative z-10 flex gap-4 w-full justify-center items-center">
          {pattern.map((p, i) => (
            <motion.div
              key={i}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Shape type={p} isHidden={i === answerIndex} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {options.map((o, i) => (
          <motion.button
            key={i}
            whileHover={{ y: -10, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(o)}
            className="p-2 bg-slate-100 dark:bg-slate-600 rounded-3xl shadow-xl border-b-8 border-slate-300 dark:border-slate-900 transition-all"
          >
            <Shape type={o} className="bg-transparent shadow-none" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};
