'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center py-16 px-4"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
        <div className="relative w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center">
          <Icon className="w-10 h-10 text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {action}
    </motion.div>
  );
}
