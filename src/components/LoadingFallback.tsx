import { motion } from 'motion/react';

export function LoadingFallback() {
  return (
    <div className="h-full min-h-[20rem] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200 bg-white/90 dark:bg-slate-900/90 px-6 py-5 text-slate-700 dark:text-slate-200 shadow-xl"
      >
        <p className="font-semibold tracking-wide">Preparing your mission...</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Thanks for your patience while we load the lab.</p>
      </motion.div>
    </div>
  );
}
