import { cn } from '@/lib/utils';

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
      <div className="h-4 w-2/3 bg-muted rounded animate-shimmer mb-3" />
      <div className="h-3 w-full bg-muted/60 rounded animate-shimmer mb-2" />
      <div className="h-3 w-1/2 bg-muted/60 rounded animate-shimmer" />
    </div>
  );
}

export function SkeletonGrid({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonWorld() {
  return (
    <div className="relative w-full aspect-square max-w-2xl mx-auto">
      <div className="absolute inset-0 rounded-full bg-muted/20 animate-shimmer" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-muted animate-pulse" />
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-muted animate-shimmer" />
      <div className="space-y-1">
        <div className="h-3 w-20 bg-muted rounded animate-shimmer" />
        <div className="h-2 w-14 bg-muted/60 rounded animate-shimmer" />
      </div>
    </div>
  );
}
