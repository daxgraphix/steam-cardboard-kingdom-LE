import React from 'react';
import { cn } from '../../lib/utils';

interface BoxBotProps {
  className?: string;
  color?: string;
}

export const BoxBot: React.FC<BoxBotProps> = ({ className, color = "#3b82f6" }) => (
  <svg viewBox="0 0 100 100" className={cn("w-full h-full", className)}>
    <rect x="20" y="40" width="60" height="50" rx="8" fill="#dcb386" stroke="#8d6e63" strokeWidth="3" />
    <rect x="30" y="50" width="40" height="30" rx="4" fill={color} fillOpacity="0.9" stroke="white" strokeWidth="2" />
    <rect x="25" y="10" width="50" height="35" rx="6" fill="#dcb386" stroke="#8d6e63" strokeWidth="3" />
    <circle cx="40" cy="25" r="8" fill="white" stroke="#333" strokeWidth="2" />
    <circle cx="60" cy="25" r="8" fill="white" stroke="#333" strokeWidth="2" />
    <circle cx="42" cy="25" r="3" fill="black" />
    <circle cx="58" cy="25" r="3" fill="black" />
    <path d="M40 35 Q50 42 60 35" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);
