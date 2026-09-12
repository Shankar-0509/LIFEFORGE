import { AttributeType, Difficulty } from './types';

export const ATTRIBUTE_CONFIG: Record<
  AttributeType,
  {
    label: string;
    icon: string;
    color: string;
    accentClass: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    description: string;
  }
> = {
  mind: {
    label: 'Mind',
    icon: 'brain',
    color: '#3b82f6',
    accentClass: 'text-blue-400',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
    description: 'Knowledge, learning, and mental discipline',
  },
  body: {
    label: 'Body',
    icon: 'dumbbell',
    color: '#ef4444',
    accentClass: 'text-red-400',
    bgClass: 'bg-red-500/10',
    textClass: 'text-red-400',
    borderClass: 'border-red-500/30',
    description: 'Physical training, health, and vitality',
  },
  craft: {
    label: 'Craft',
    icon: 'hammer',
    color: '#f59e0b',
    accentClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
    description: 'Building, creating, and mastering skills',
  },
  social: {
    label: 'Social',
    icon: 'users',
    color: '#10b981',
    accentClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
    description: 'Connection, communication, and community',
  },
  balance: {
    label: 'Balance',
    icon: 'scale',
    color: '#a855f7',
    accentClass: 'text-purple-400',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/30',
    description: 'Harmony, reflection, and inner peace',
  },
};

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; xp: number; essence: number; color: string; borderClass: string }
> = {
  trivial: {
    label: 'Trivial',
    xp: 10,
    essence: 3,
    color: '#64748b',
    borderClass: 'border-slate-500/40',
  },
  easy: {
    label: 'Easy',
    xp: 25,
    essence: 8,
    color: '#10b981',
    borderClass: 'border-emerald-500/40',
  },
  medium: {
    label: 'Medium',
    xp: 50,
    essence: 15,
    color: '#3b82f6',
    borderClass: 'border-blue-500/40',
  },
  hard: {
    label: 'Hard',
    xp: 100,
    essence: 30,
    color: '#f59e0b',
    borderClass: 'border-amber-500/40',
  },
  epic: {
    label: 'Epic',
    xp: 200,
    essence: 60,
    color: '#ef4444',
    borderClass: 'border-red-500/40',
  },
};

export const DIFFICULTIES: Difficulty[] = ['trivial', 'easy', 'medium', 'hard', 'epic'];
export const ATTRIBUTES: AttributeType[] = ['mind', 'body', 'craft', 'social', 'balance'];

export interface WorldNodeConfig {
  id: string;
  name: string;
  attribute: AttributeType | null;
  unlockLevel: number;
  description: string;
  position: { x: number; y: number };
  icon: string;
}

export const WORLD_NODES: WorldNodeConfig[] = [
  {
    id: 'forge',
    name: 'Starting Forge',
    attribute: null,
    unlockLevel: 1,
    description: 'The heart of your world. Every journey begins here.',
    position: { x: 50, y: 50 },
    icon: 'flame',
  },
  {
    id: 'library',
    name: 'Library',
    attribute: 'mind',
    unlockLevel: 5,
    description: 'A repository of knowledge. Study to expand your mind.',
    position: { x: 50, y: 15 },
    icon: 'book-open',
  },
  {
    id: 'workshop',
    name: 'Workshop',
    attribute: 'craft',
    unlockLevel: 8,
    description: 'A space for creation. Build, craft, and master skills.',
    position: { x: 85, y: 50 },
    icon: 'hammer',
  },
  {
    id: 'training_ground',
    name: 'Training Ground',
    attribute: 'body',
    unlockLevel: 10,
    description: 'Train your body and build physical resilience.',
    position: { x: 50, y: 85 },
    icon: 'dumbbell',
  },
  {
    id: 'garden',
    name: 'Garden',
    attribute: 'balance',
    unlockLevel: 12,
    description: 'A place of harmony and reflection. Find your center.',
    position: { x: 15, y: 50 },
    icon: 'trees',
  },
  {
    id: 'community',
    name: 'Community',
    attribute: 'social',
    unlockLevel: 15,
    description: 'Connect with others and build meaningful relationships.',
    position: { x: 80, y: 18 },
    icon: 'users',
  },
];
