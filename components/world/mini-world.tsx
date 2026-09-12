'use client';

import { motion } from 'framer-motion';
import { Flame, BookOpen, Hammer, Dumbbell, Trees, Users } from 'lucide-react';

export function MiniWorld() {
  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto">
      {/* Ambient glow */}
      <div className="absolute inset-0 forge-radial rounded-full blur-2xl" />

      {/* Terrain base */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="terrain-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(28 40% 20%)" />
            <stop offset="60%" stopColor="hsl(30 30% 12%)" />
            <stop offset="100%" stopColor="hsl(30 20% 8%)" />
          </radialGradient>
          <linearGradient id="path-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(28 80% 55% / 0.6)" />
            <stop offset="100%" stopColor="hsl(28 80% 55% / 0.1)" />
          </linearGradient>
        </defs>

        <circle cx="200" cy="200" r="180" fill="url(#terrain-grad)" stroke="hsl(28 40% 25%)" strokeWidth="1" />

        {/* Paths radiating from center */}
        <path d="M 200 200 L 200 80" stroke="url(#path-grad)" strokeWidth="3" strokeDasharray="6 4" fill="none" />
        <path d="M 200 200 L 320 200" stroke="url(#path-grad)" strokeWidth="3" strokeDasharray="6 4" fill="none" />
        <path d="M 200 200 L 200 320" stroke="url(#path-grad)" strokeWidth="3" strokeDasharray="6 4" fill="none" />
        <path d="M 200 200 L 80 200" stroke="url(#path-grad)" strokeWidth="3" strokeDasharray="6 4" fill="none" />
        <path d="M 200 200 L 300 100" stroke="url(#path-grad)" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.5" />

        {/* Trees / nature dots */}
        {[
          [120, 130], [280, 130], [120, 270], [280, 270],
          [100, 200], [300, 200], [200, 100], [200, 300],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="hsl(140 40% 35% / 0.4)"
            className="animate-twinkle"
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}

        {/* Stars */}
        {Array.from({ length: 15 }).map((_, i) => {
          const angle = (i / 15) * Math.PI * 2;
          const r = 170 + Math.random() * 20;
          return (
            <circle
              key={`star-${i}`}
              cx={200 + Math.cos(angle) * r}
              cy={200 + Math.sin(angle) * r}
              r="1"
              fill="hsl(40 60% 80% / 0.6)"
              className="animate-twinkle"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          );
        })}
      </svg>

      {/* Center: Forge */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full animate-pulse-glow" />
          <div className="relative w-16 h-16 rounded-full forge-gradient flex items-center justify-center shadow-2xl border-2 border-orange-400/40">
            <Flame className="w-8 h-8 text-white" />
          </div>
        </div>
      </motion.div>

      {/* North: Library */}
      <NodeIcon icon={<BookOpen className="w-5 h-5" />} label="Library" className="left-1/2 top-[8%] -translate-x-1/2" delay={0} />
      {/* East: Workshop */}
      <NodeIcon icon={<Hammer className="w-5 h-5" />} label="Workshop" className="left-[88%] top-1/2 -translate-y-1/2" delay={0.5} />
      {/* South: Training Ground */}
      <NodeIcon icon={<Dumbbell className="w-5 h-5" />} label="Training" className="left-1/2 top-[88%] -translate-x-1/2" delay={1} />
      {/* West: Garden */}
      <NodeIcon icon={<Trees className="w-5 h-5" />} label="Garden" className="left-[8%] top-1/2 -translate-y-1/2" delay={1.5} />
      {/* NE: Community */}
      <NodeIcon icon={<Users className="w-5 h-5" />} label="Community" className="left-[75%] top-[20%]" delay={2} small />
    </div>
  );
}

function NodeIcon({
  icon,
  label,
  className,
  delay,
  small = false,
}: {
  icon: React.ReactNode;
  label: string;
  className: string;
  delay: number;
  small?: boolean;
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
    >
      <div className="flex flex-col items-center gap-1">
        <div
          className={`${small ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors`}
        >
          {icon}
        </div>
        <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
      </div>
    </motion.div>
  );
}
