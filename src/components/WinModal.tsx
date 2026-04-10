import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Modal } from './ui/Modal';

interface WinModalProps {
  xp: number;
  onNext: () => void;
  onMenu: () => void;
  isChallenge: boolean;
}

export const WinModal: React.FC<WinModalProps> = ({ xp, onNext, onMenu, isChallenge }) => (
  <Modal>
    <div className="p-8 text-center bg-white dark:bg-slate-800">
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.1, type: "spring" }}
          >
            <Star 
              className={`w-12 h-12 ${isChallenge ? 'text-red-500' : 'text-yellow-400'} fill-current`} 
            />
          </motion.div>
        ))}
      </div>
      
      <h2 className="marker-font text-4xl text-slate-800 dark:text-white mb-2">
        {isChallenge ? "CHALLENGE CRUSHED!" : "MISSION COMPLETE!"}
      </h2>
      
      <p className="text-2xl font-bold text-slate-500 dark:text-slate-400 mb-8">
        +{xp} XP Earned
      </p>

      <div className="flex flex-col gap-3">
        {!isChallenge && (
          <button 
            onClick={onNext}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-[0_4px_0_#15803d] transition-all active:translate-y-1 active:shadow-none"
          >
            Next Mission
          </button>
        )}
        <button 
          onClick={onMenu}
          className="w-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          Back to Lab
        </button>
      </div>
    </div>
  </Modal>
);
