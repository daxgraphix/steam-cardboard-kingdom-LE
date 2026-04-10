import { 
  Beaker, 
  Cpu, 
  Settings, 
  Palette, 
  Divide, 
  Lightbulb, 
  Recycle, 
  Wrench, 
  Puzzle,
  Zap,
  Brain,
  Star,
  Timer,
  Moon,
  Sun,
  Trash2,
  ArrowLeft,
  Wind,
  Binary,
  Activity
} from 'lucide-react';
import { CategoryConfig, Game, SteamCategory } from './types';

export const STEAM_CATEGORIES: Record<SteamCategory, CategoryConfig> = {
  SCIENCE: { color: '#3b82f6', icon: Beaker, label: 'Science' },
  TECH: { color: '#10b981', icon: Cpu, label: 'Technology' },
  ENG: { color: '#f59e0b', icon: Settings, label: 'Engineering' },
  ART: { color: '#ec4899', icon: Palette, label: 'Art' },
  MATH: { color: '#8b5cf6', icon: Divide, label: 'Math' },
};

export const GAMES: Record<string, Game> = {
  'pipecleaner': {
    id: 'pipecleaner', 
    title: 'Circuit Logic', 
    category: 'TECH',
    icon: Lightbulb,
    description: 'Watch the current flow! Memorize and repeat the LED sequence.',
    learningFocus: 'Working Memory & Algorithms',
    challengeDesc: 'Speed Run: Sequence plays faster and time is limited!',
    knowledge: [
      "Circuits need a complete path for electricity to flow.",
      "Algorithms are step-by-step instructions for solving a problem.",
      "Memory is a key part of how computers process information.",
      "Parallel circuits allow multiple paths for current, while series circuits have only one."
    ]
  },
  'shadows': {
    id: 'shadows', 
    title: 'Shadow Lab', 
    category: 'ART',
    icon: Palette,
    description: 'Match the object to its projection. Observe contours!',
    learningFocus: 'Spatial Reasoning & Geometry',
    challengeDesc: 'Beat the Clock: Match all shapes before time runs out.',
    knowledge: [
      "Shadows are formed when an object blocks light.",
      "The shape of a shadow depends on the angle of the light source.",
      "Perspective changes how we see 3D objects in 2D.",
      "Anamorphic art uses distorted projection to create a clear image from a specific point."
    ]
  },
  'patterns': {
    id: 'patterns', 
    title: 'Pattern Factory', 
    category: 'MATH',
    icon: Puzzle,
    description: 'Fix the production line. What comes next in the sequence?',
    learningFocus: 'Pattern Recognition & Logic',
    challengeDesc: 'Chaos Mode: Patterns change quickly. Decide fast!',
    knowledge: [
      "Patterns are sequences that repeat according to a rule.",
      "Logic helps us predict what comes next in a system.",
      "Mathematics is the study of patterns and relationships.",
      "Fractals are infinitely complex patterns that are self-similar across different scales."
    ]
  },
  'sorting': {
    id: 'sorting', 
    title: 'Eco Sorter', 
    category: 'SCIENCE',
    icon: Recycle,
    description: 'Sort materials into the correct bins.',
    learningFocus: 'Classification & Sustainability',
    challengeDesc: 'Rush Hour: Sort as many items as possible in 30s.',
    knowledge: [
      "Classification is grouping things based on shared characteristics.",
      "Recycling helps conserve natural resources and energy.",
      "Sustainability means meeting our needs without hurting the future.",
      "Biodegradable materials can be broken down by bacteria or other organisms."
    ]
  },
  'gears': {
    id: 'gears', 
    title: 'Gear Engineer',
    category: 'ENG',
    icon: Settings,
    description: 'Connect the driver gear to the target to fix the machine!',
    learningFocus: 'Mechanical Systems',
    challengeDesc: 'Time Attack: Connect the gears before the engine overheats!',
    knowledge: [
      "Gears transfer motion and force from one part of a machine to another.",
      "Two gears touching each other will rotate in opposite directions.",
      "Gear ratios determine the speed and torque of a system.",
      "A worm gear is used to transmit motion between non-intersecting axes at right angles."
    ]
  },
  'builder': {
    id: 'builder', 
    title: 'Blueprint Build',
    category: 'ENG',
    icon: Wrench,
    description: 'Assemble the parts according to the blueprint specs.',
    learningFocus: 'Deconstruction & Assembly',
    challengeDesc: 'Memory Build: Blueprint fades away after 5 seconds!',
    knowledge: [
      "Blueprints are technical drawings that show how something is built.",
      "Engineering involves designing, building, and testing solutions.",
      "Structural integrity is the ability of a build to hold its weight.",
      "Triangles are the strongest shape in engineering because they don't deform easily."
    ]
  },
  'turbine': {
    id: 'turbine',
    title: 'Wind Power',
    category: 'SCIENCE',
    icon: Wind,
    description: 'Adjust the blade angle to capture the most wind energy!',
    learningFocus: 'Renewable Energy & Aerodynamics',
    challengeDesc: 'Storm Mode: Wind direction changes rapidly!',
    knowledge: [
      "Wind turbines convert kinetic energy from wind into electrical power.",
      "The 'pitch' of a blade is its angle relative to the wind.",
      "Aerodynamics is the study of how air moves around objects.",
      "Offshore wind farms can capture stronger, more consistent winds than land-based ones."
    ]
  },
  'binary': {
    id: 'binary',
    title: 'Binary Bits',
    category: 'TECH',
    icon: Binary,
    description: 'Convert decimal numbers into binary code (0s and 1s).',
    learningFocus: 'Computer Science & Number Systems',
    challengeDesc: 'Bit Rush: Convert 8-bit numbers under pressure!',
    knowledge: [
      "Binary is a base-2 number system used by computers.",
      "A 'bit' is the smallest unit of data in a computer (0 or 1).",
      "8 bits make up 1 byte.",
      "Binary code represents text, computer processor instructions, or any other data."
    ]
  }
};
