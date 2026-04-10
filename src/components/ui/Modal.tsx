import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface ModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ children, isOpen = true, className }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            "bg-white dark:bg-slate-800 rounded-[2.5rem] border-4 border-slate-800 dark:border-slate-600 shadow-[8px_8px_0px_rgba(30,41,59,0.2)] max-w-lg w-full overflow-hidden relative",
            className
          )}
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
