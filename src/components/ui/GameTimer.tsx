import React from 'react';
import { Timer } from 'lucide-react';
import { cn } from '../../lib/utils';

interface GameTimerProps {
  time: number;
  className?: string;
}

export const GameTimer: React.FC<GameTimerProps> = ({ time, className }) => (
  <div className={cn(
    "absolute top-4 right-4 flex items-center gap-2 bg-slate-900/80 text-white px-3 py-1 rounded-full font-mono border border-white/20 shadow-lg z-20",
    className
  )}>
    <Timer className={cn("w-4 h-4", time < 10 ? "text-red-400" : "text-blue-400")} />
    <span className={cn(
      "text-lg font-bold",
      time < 10 && "text-red-400 animate-pulse"
    )}>
      {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
    </span>
  </div>
);
