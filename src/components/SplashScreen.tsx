import React from 'react';
import { motion } from 'motion/react';
import { BoxBot } from './ui/BoxBot';

interface SplashScreenProps {
  onEnter: (e: React.MouseEvent) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-slate-100 dark:bg-slate-900">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,currentColor_2px,transparent_2px)] bg-[length:24px_24px] text-slate-400 pointer-events-none" />
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <BoxBot className="w-48 h-48 drop-shadow-2xl mb-6" />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="marker-font text-6xl md:text-7xl text-slate-800 dark:text-white mb-2 tracking-wide relative z-10"
      >
        STEAM
      </motion.h1>
      
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="font-bold text-2xl text-slate-500 dark:text-slate-400 mb-12 tracking-widest relative z-10"
      >
        CARDBOARD KINGDOM
      </motion.h2>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onEnter}
        className="relative z-20 bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold py-4 px-12 rounded-full shadow-[0_6px_0_#1e40af] transition-all active:translate-y-1 active:shadow-none"
      >
        ENTER LAB
      </motion.button>
    </div>
  );
};
