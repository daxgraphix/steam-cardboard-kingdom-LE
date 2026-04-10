import React from 'react';
import { motion } from 'motion/react';
import { BoxBot } from './ui/BoxBot';
import { SettingsMenu } from './ui/SettingsMenu';
import { GAMES, STEAM_CATEGORIES } from '../constants';
import { UserProfile, Game, Difficulty } from '../types';

interface DashboardProps {
  profile: UserProfile;
  onSelectGame: (game: Game) => void;
  toggleSound: () => void;
  isSoundOn: boolean;
  volume: number;
  setVolume: (v: number) => void;
  haptics: boolean;
  toggleHaptics: () => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  toggleTheme: () => void;
  isDark: boolean;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  onSelectGame,
  toggleSound,
  isSoundOn,
  volume,
  setVolume,
  haptics,
  toggleHaptics,
  difficulty,
  setDifficulty,
  toggleTheme,
  isDark,
  onReset,
}) => (
  <div className="h-full overflow-y-auto p-4 md:p-8">
    <header className="max-w-6xl mx-auto flex flex-row items-center justify-between mb-8 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-slate-800 rounded-2xl border-4 border-slate-800 dark:border-slate-400 flex items-center justify-center shadow-[2px_2px_0_#1e293b] dark:shadow-[2px_2px_0_#000] rotate-3">
          <BoxBot className="w-8 h-8 md:w-10 md:h-10" />
        </div>
        <div>
          <h1 className="marker-font text-2xl md:text-3xl text-slate-800 dark:text-white leading-none">MAKER LAB</h1>
          <div className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
            Junior Engineer • {profile.points} XP
          </div>
        </div>
      </div>
      <SettingsMenu 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        isSoundOn={isSoundOn} 
        toggleSound={toggleSound} 
        volume={volume}
        setVolume={setVolume}
        haptics={haptics}
        toggleHaptics={toggleHaptics}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        onReset={onReset} 
      />
    </header>
    
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      {Object.values(GAMES).map((game, index) => {
        const config = STEAM_CATEGORIES[game.category];
        const gameProgress = profile.progress[game.id] || { level: 1 };
        const currentLevel = gameProgress.level;
        const isMastered = currentLevel > 8;
        const percent = Math.min(100, ((currentLevel - 1) / 8) * 100);

        return (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectGame(game)}
            className="group relative text-left h-80"
          >
            <div className="absolute inset-0 bg-slate-800 dark:bg-slate-600 rounded-[2.5rem] translate-y-2 translate-x-0 transition-all group-hover:translate-y-4 group-hover:shadow-xl" />
            <div className={`relative h-full bg-white dark:bg-slate-800 rounded-[2.5rem] border-4 ${isMastered ? 'border-yellow-400' : 'border-slate-800 dark:border-slate-500'} overflow-hidden flex flex-col`}>
              <div 
                className="h-36 flex items-center justify-center relative overflow-hidden" 
                style={{ backgroundColor: config.color }}
              >
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(white 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
                <game.icon className="w-20 h-20 text-white drop-shadow-md transform group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-black/20 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  {config.label}
                </div>
                {isMastered && (
                  <div className="absolute top-3 right-3 bg-yellow-400 text-slate-900 border-2 border-white shadow-lg text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider animate-pulse">
                    MASTERED
                  </div>
                )}
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-xl text-slate-800 dark:text-white leading-tight mb-1">{game.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold line-clamp-2">{game.description}</p>
                </div>
                <div className="flex flex-col gap-1 mt-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">PROGRESS</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {isMastered ? "100%" : `Lvl ${currentLevel} / 8`}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${isMastered ? 100 : percent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full" 
                      style={{ backgroundColor: config.color }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  </div>
);
