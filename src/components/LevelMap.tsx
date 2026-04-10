import React from 'react';
import { ArrowLeft, Zap, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { Game } from '../types';
import { STEAM_CATEGORIES } from '../constants';
import { cn } from '../lib/utils';

interface LevelMapProps {
  game: Game;
  unlocked: number;
  onSelect: (level: number) => void;
  onBack: () => void;
  isChallengeMode: boolean;
  toggleChallenge: () => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  game,
  unlocked,
  onSelect,
  onBack,
  isChallengeMode,
  toggleChallenge,
}) => {
  const config = STEAM_CATEGORIES[game.category];
  
  return (
    <div className="h-full flex flex-col">
      <div 
        className={cn(
          "p-4 flex items-center justify-between shadow-md z-10 text-white transition-colors duration-500",
          isChallengeMode ? 'bg-red-500' : ''
        )}
        style={{ backgroundColor: !isChallengeMode ? config.color : undefined }}
      >
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full hover:bg-white/30 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="w-5 h-5" /> LAB
        </button>
        <div className="text-center">
          <h2 className="marker-font text-xl md:text-2xl leading-none">{game.title}</h2>
          <span className="text-[10px] md:text-xs font-bold opacity-80 uppercase tracking-widest">
            {isChallengeMode ? "CHALLENGE MODE" : config.label}
          </span>
        </div>
        <button 
          onClick={toggleChallenge} 
          className={cn(
            "p-2 rounded-full transition-all",
            isChallengeMode ? 'bg-white text-red-500 shadow-lg scale-110' : 'bg-black/20 text-white hover:bg-black/30'
          )}
        >
          <Zap className="w-6 h-6" />
        </button>
      </div>

      <div className={cn(
        "flex-grow relative overflow-y-auto p-8 transition-colors duration-500",
        isChallengeMode ? 'bg-red-50 dark:bg-red-900/10' : 'bg-slate-50 dark:bg-slate-900'
      )}>
        <div className="max-w-md mx-auto flex flex-col items-center gap-8 relative pb-20">
          <div className="absolute top-8 bottom-8 w-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
          
          {Array.from({ length: 8 }).map((_, i) => {
            const lvl = i + 1;
            const isLocked = lvl > unlocked;
            
            return (
              <motion.button
                key={lvl}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !isLocked && onSelect(lvl)}
                className={cn(
                  "relative z-10 w-20 h-20 rounded-3xl flex items-center justify-center border-b-8 transition-all active:translate-y-1 active:border-b-0",
                  isLocked 
                    ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-900 text-slate-400' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-white',
                  isChallengeMode && !isLocked && 'border-red-500 ring-4 ring-red-500/20'
                )}
                style={!isLocked ? { 
                  borderColor: isChallengeMode ? '#ef4444' : config.color,
                  color: isChallengeMode ? '#ef4444' : config.color 
                } : {}}
              >
                {isLocked ? (
                  <Lock className="w-8 h-8" />
                ) : (
                  <span className="marker-font text-3xl">{lvl}</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
