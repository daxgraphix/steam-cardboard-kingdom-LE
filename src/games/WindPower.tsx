import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wind } from 'lucide-react';
import { GameTimer } from '../components/ui/GameTimer';
import { AudioType, Difficulty } from '../types';
import { cn } from '../lib/utils';

interface WindPowerProps {
  level: number;
  isChallenge: boolean;
  difficulty: Difficulty;
  onComplete: (stars: number, xp: number) => void;
  playSound: (type: AudioType, note?: string | string[]) => void;
  onFailure: () => void;
}

export const WindPower: React.FC<WindPowerProps> = ({
  level,
  isChallenge,
  difficulty,
  onComplete,
  playSound,
  onFailure,
}) => {
  const [turbineAngle, setTurbineAngle] = useState(0);
  const [windAngle, setWindAngle] = useState(45);
  const [power, setPower] = useState(0);
  
  const difficultyMultiplier = difficulty === 'EASY' ? 0.8 : difficulty === 'HARD' ? 1.5 : 1;
  const [targetPower] = useState(100 * difficultyMultiplier);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(Math.round((20 + level * 5) / difficultyMultiplier));

  useEffect(() => {
    const interval = setInterval(() => {
      if (isChallenge) {
        const speed = difficulty === 'HARD' ? 15 : difficulty === 'EASY' ? 5 : 10;
        setWindAngle(prev => (prev + (Math.random() * speed - (speed/2)) + 360) % 360);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isChallenge, difficulty]);

  useEffect(() => {
    const diff = Math.abs(turbineAngle - windAngle);
    const normalizedDiff = Math.min(diff, 360 - diff);
    const tolerance = difficulty === 'EASY' ? 60 : difficulty === 'HARD' ? 30 : 45;
    const efficiency = Math.max(0, 1 - normalizedDiff / tolerance);
    setPower(Math.round(efficiency * 100));
  }, [turbineAngle, windAngle, difficulty]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (power > 50) {
        setCurrentTotal(prev => prev + (power / 10));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [power]);

  useEffect(() => {
    if (currentTotal >= targetPower) {
      onComplete(3, (100 * level) * (isChallenge ? 2 : 1));
    }
  }, [currentTotal, targetPower, level, isChallenge, onComplete]);

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

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 relative">
      <GameTimer time={timeLeft} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[3rem] p-8 shadow-2xl border-4 border-slate-200 dark:border-slate-700 flex flex-col items-center gap-8"
      >
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Wind Indicator */}
          <motion.div 
            animate={{ rotate: windAngle }}
            className="absolute inset-0 flex items-center justify-center opacity-20"
          >
            <div className="w-full h-1 bg-blue-400 rounded-full" />
            <Wind className="w-8 h-8 text-blue-400 absolute -right-4" />
          </motion.div>

          {/* Turbine */}
          <motion.div 
            animate={{ 
              rotate: turbineAngle,
              scale: power > 80 ? 1.05 : 1
            }}
            className="relative z-10 w-full h-full flex items-center justify-center"
          >
            <div className="w-4 h-4 bg-slate-800 rounded-full z-20" />
            <motion.div 
              animate={{ rotate: power > 0 ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: Math.max(0.2, 2 - power/50), ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="absolute w-1.5 h-24 bg-slate-400 rounded-full origin-bottom -translate-y-12" />
              <div className="absolute w-1.5 h-24 bg-slate-400 rounded-full origin-bottom -translate-y-12 rotate-120" />
              <div className="absolute w-1.5 h-24 bg-slate-400 rounded-full origin-bottom -translate-y-12 rotate-240" />
            </motion.div>
          </motion.div>
        </div>

        <div className="w-full space-y-4">
          <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-widest">
            <span>Power Output</span>
            <motion.span animate={{ scale: power > 90 ? [1, 1.2, 1] : 1 }}>{power}%</motion.span>
          </div>
          <div className="w-full h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-600">
            <motion.div 
              animate={{ width: `${power}%` }}
              className={cn(
                "h-full transition-colors duration-300",
                power > 80 ? "bg-green-500" : power > 40 ? "bg-yellow-500" : "bg-red-500"
              )}
            />
          </div>

          <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-widest pt-4">
            <span>Energy Goal</span>
            <span>{Math.round(currentTotal)} / {Math.round(targetPower)}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${(currentTotal / targetPower) * 100}%` }}
              className="h-full bg-blue-500"
            />
          </div>
        </div>

        <div className="w-full space-y-2">
          <motion.input 
            whileHover={{ scale: 1.02 }}
            type="range" 
            min="0" 
            max="360" 
            value={turbineAngle}
            onChange={(e) => {
              setTurbineAngle(parseInt(e.target.value));
              if (Math.abs(parseInt(e.target.value) - windAngle) < 10) {
                playSound('click');
              }
            }}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Adjust Pitch Angle</p>
        </div>
      </motion.div>
    </div>
  );
};
