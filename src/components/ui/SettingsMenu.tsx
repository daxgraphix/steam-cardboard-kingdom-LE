import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Moon, Sun, Trash2, Smartphone, Volume1, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Difficulty } from '../../types';

interface SettingsMenuProps {
  isDark: boolean;
  toggleTheme: () => void;
  isSoundOn: boolean;
  toggleSound: () => void;
  volume: number;
  setVolume: (v: number) => void;
  haptics: boolean;
  toggleHaptics: () => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  onReset: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  isDark,
  toggleTheme,
  isSoundOn,
  toggleSound,
  volume,
  setVolume,
  haptics,
  toggleHaptics,
  difficulty,
  setDifficulty,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

  return (
    <div className="relative z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-3 rounded-2xl transition-all shadow-[0_4px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none border-2",
          isOpen
            ? "bg-blue-100 border-blue-300 text-blue-600"
            : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
        )}
      >
        <Settings className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border-4 border-slate-100 dark:border-slate-700 p-4 flex flex-col gap-4 origin-top-right"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                    {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    Volume
                  </div>
                  <span className="text-xs font-mono text-slate-400">{isSoundOn ? Math.round(volume * 100) : 0}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleSound} 
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {isSoundOn ? <Volume1 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </motion.button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={volume}
                    disabled={!isSoundOn}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-grow h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-30"
                  />
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-700" />

              <div className="space-y-3">
                <div className="flex items-center gap-2 px-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <Gauge className="w-4 h-4" />
                  Difficulty
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
                  {difficulties.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        "flex-1 py-2 text-[10px] font-black rounded-lg transition-all",
                        difficulty === d
                          ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm"
                          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-700" />

              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleTheme}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-500" />}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{isDark ? "Light" : "Dark"}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleHaptics}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-2xl transition-colors border-2",
                    haptics 
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600" 
                      : "bg-slate-50 dark:bg-slate-900/50 border-transparent text-slate-400"
                  )}
                >
                  <Smartphone className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Haptics</span>
                </motion.button>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-700" />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { onReset(); setIsOpen(false); }}
                className="w-full flex items-center justify-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-bold text-red-500"
              >
                <Trash2 className="w-5 h-5" />
                Reset All Progress
              </motion.button>
            </motion.div>
            <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
