import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { GameTimer } from '../components/ui/GameTimer';
import { AudioType, Difficulty } from '../types';

interface CircuitLogicProps {
  level: number;
  isChallenge: boolean;
  difficulty: Difficulty;
  onComplete: (stars: number, xp: number) => void;
  playSound: (type: AudioType, note?: string | string[]) => void;
  onFailure: () => void;
}

export const CircuitLogic: React.FC<CircuitLogicProps> = ({
  level,
  isChallenge,
  difficulty,
  onComplete,
  playSound,
  onFailure,
}) => {
  const difficultyMultiplier = difficulty === 'EASY' ? 0.8 : difficulty === 'HARD' ? 1.5 : 1;
  const sequenceLength = Math.round((2 + level + (isChallenge ? 2 : 0)) * difficultyMultiplier);
  const speed = (isChallenge ? 200 : Math.max(200, 600 - (level * 40))) / difficultyMultiplier;
  
  const [sequence, setSequence] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [lit, setLit] = useState<number | null>(null);
  const [status, setStatus] = useState<'wait' | 'show' | 'input' | 'won'>('wait');
  const [timeLeft, setTimeLeft] = useState(Math.round((isChallenge ? 15 + level * 3 : 0) / difficultyMultiplier));

  const leds = [
    { id: 0, c: '#ef4444', n: 'C4' },
    { id: 1, c: '#3b82f6', n: 'E4' },
    { id: 2, c: '#22c55e', n: 'G4' },
    { id: 3, c: '#eab308', n: 'B4' }
  ];

  const playSeq = useCallback(async (seq: number[]) => {
    setStatus('show');
    await new Promise(r => setTimeout(r, 800));
    for (const i of seq) {
      setLit(i);
      playSound('note', leds[i].n);
      await new Promise(r => setTimeout(r, speed));
      setLit(null);
      await new Promise(r => setTimeout(r, 100));
    }
    setStatus('input');
  }, [speed, playSound]);

  useEffect(() => {
    setStep(0);
    setStatus('wait');
    const newSeq = Array.from({ length: sequenceLength }).map(() => Math.floor(Math.random() * 4));
    setSequence(newSeq);
    const timer = setTimeout(() => playSeq(newSeq), 1000);
    return () => clearTimeout(timer);
  }, [level, sequenceLength, playSeq]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isChallenge && status === 'input') {
      timer = setInterval(() => {
        setTimeLeft(t => Math.max(0, t - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, isChallenge]);

  useEffect(() => {
    if (isChallenge && timeLeft === 0 && status === 'input') {
      onFailure();
    }
  }, [timeLeft, isChallenge, status, onFailure]);

  const handlePress = (id: number) => {
    if (status !== 'input') return;
    
    setLit(id);
    playSound('note', leds[id].n);
    setTimeout(() => setLit(null), 150);

    if (id === sequence[step]) {
      if (step + 1 === sequence.length) {
        setStatus('won');
        onComplete(3, (100 * level) * (isChallenge ? 2 : 1));
      } else {
        setStep(s => s + 1);
      }
    } else {
      playSound('incorrect');
      if (isChallenge) {
        onFailure();
      } else {
        setStep(0);
        setStatus('wait');
        setTimeout(() => playSeq(sequence), 1000);
      }
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 relative">
      {isChallenge && <GameTimer time={timeLeft} />}
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 p-8 rounded-[3rem] shadow-2xl relative max-w-sm w-full border-b-[12px] border-slate-900"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-700 px-6 py-2 rounded-full text-sm font-mono text-green-400 border-2 border-slate-600 shadow-xl">
          {status === 'show' ? 'RECEIVING...' : status === 'input' ? 'ENTER CODE' : 'STANDBY'}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {leds.map((l, i) => (
            <motion.button
              key={i}
              whileHover={status === 'input' ? { scale: 1.05 } : {}}
              whileTap={status === 'input' ? { scale: 0.95 } : {}}
              onClick={() => handlePress(i)}
              disabled={status !== 'input'}
              className={`
                aspect-square rounded-full border-4 border-slate-700 relative transition-all active:scale-95
                ${lit === i ? 'scale-105 shadow-[0_0_50px_currentColor] z-10' : 'hover:border-slate-600'}
              `}
              style={{ 
                backgroundColor: lit === i ? l.c : '#1e293b', 
                color: l.c,
                borderColor: lit === i ? '#fff' : undefined
              }}
            >
              <div className="absolute inset-2 rounded-full opacity-20" style={{ backgroundColor: l.c }} />
              {status === 'input' && (
                <motion.div 
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-white/10"
                />
              )}
            </motion.button>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {sequence.map((_, i) => (
            <div 
              key={i}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                i < step ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 
                i === step && status === 'input' ? 'bg-blue-500 animate-pulse' : 
                'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
