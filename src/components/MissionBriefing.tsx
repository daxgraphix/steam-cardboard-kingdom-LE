import React from 'react';
import { Brain, Zap, Star, ArrowLeft } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Game } from '../types';
import { STEAM_CATEGORIES } from '../constants';

interface MissionBriefingProps {
  game: Game;
  level: number;
  isChallenge: boolean;
  onStart: () => void;
  onBack: () => void;
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({
  game,
  level,
  isChallenge,
  onStart,
  onBack,
}) => {
  const config = STEAM_CATEGORIES[game.category];
  const themeColor = isChallenge ? '#ef4444' : config.color;

  return (
    <Modal>
      <div className="relative">
        <div 
          className="h-32 w-full flex items-center justify-center relative overflow-hidden transition-colors duration-300"
          style={{ backgroundColor: themeColor }}
        >
          {isChallenge ? (
            <Zap className="w-64 h-64 text-white opacity-20 absolute animate-pulse" />
          ) : (
            <config.icon className="w-64 h-64 text-white opacity-20 absolute" />
          )}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-lg z-10">
            <game.icon className="w-12 h-12" style={{ color: themeColor }} />
          </div>
        </div>

        <div className="p-8 text-center">
          <h2 className="marker-font text-3xl mb-1 text-slate-800 dark:text-white">
            {isChallenge ? "CHALLENGE MODE" : game.title}
          </h2>
          <div 
            className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-6"
            style={{ backgroundColor: themeColor }}
          >
            {isChallenge ? `HARDCORE • LEVEL ${level}` : `${config.label} • MISSION ${level}`}
          </div>

          <div className="space-y-4 mb-8 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-600 flex gap-4 items-start">
                <Brain className="w-6 h-6 mt-1 flex-shrink-0 text-slate-400" />
                <div>
                  <div className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-1">Concept</div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{game.learningFocus}</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-600 flex gap-4 items-start">
                <Zap className="w-6 h-6 mt-1 flex-shrink-0 text-red-500" />
                <div>
                  <div className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-1">Challenge</div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">
                    {isChallenge ? game.challengeDesc : `Level ${level}: Master the basics!`}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border-2 border-blue-100 dark:border-blue-800/50">
              <div className="flex items-center gap-2 font-bold text-xs uppercase text-blue-500 tracking-widest mb-3">
                <Star className="w-4 h-4 fill-current" />
                STEAM Knowledge
              </div>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                {game.knowledge.map((k, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onBack}
              className="flex-1 py-4 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              BACK
            </button>
            <button 
              onClick={onStart}
              className="flex-[2] py-4 rounded-xl font-bold text-white shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 transition-all"
              style={{ backgroundColor: themeColor }}
            >
              {isChallenge ? "ACCEPT CHALLENGE" : "START BUILDING"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
