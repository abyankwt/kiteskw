import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
  animate?: boolean;
}

function Skeleton({
  className,
  variant = 'rectangular',
  animate = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-gray-200 dark:bg-gray-800 relative overflow-hidden",
        variant === 'circular' && "rounded-full",
        variant === 'rectangular' && "rounded-md",
        variant === 'text' && "rounded",
        animate && "animate-pulse",
        className
      )}
      {...props}
    >
      {/* Shimmer overlay */}
      {animate && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
      )}
    </div>
  );
}

// Preset Skeleton Components
function SkeletonCard() {
  return (
    <div className="space-y-4 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return (
    <Skeleton
      variant="circular"
      className="flex-shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/5" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

function SkeletonImage({ aspectRatio = '16/9', className }: { aspectRatio?: string; className?: string }) {
  return (
    <div className={cn("w-full relative", className)} style={{ aspectRatio }}>
      <Skeleton className="absolute inset-0 h-full w-full" />
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonAvatar, SkeletonText, SkeletonImage };
