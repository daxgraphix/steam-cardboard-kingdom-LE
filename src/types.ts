import { LucideIcon } from 'lucide-react';

export type SteamCategory = 'SCIENCE' | 'TECH' | 'ENG' | 'ART' | 'MATH';

export interface CategoryConfig {
  color: string;
  icon: LucideIcon;
  label: string;
}

export interface Game {
  id: string;
  title: string;
  category: SteamCategory;
  icon: LucideIcon;
  description: string;
  learningFocus: string;
  challengeDesc: string;
  knowledge: string[];
}

export interface GameProgress {
  level: number;
  highScore?: number;
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface UserProfile {
  points: number;
  progress: Record<string, GameProgress>;
  settings: {
    volume: number;
    haptics: boolean;
    difficulty: Difficulty;
  };
}

export type AudioType = 'click' | 'pop' | 'correct' | 'incorrect' | 'note' | 'win';
