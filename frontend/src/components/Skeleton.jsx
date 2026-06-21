export default function Skeleton({ className = '', variant = 'rect' }) {
  const base = 'animate-pulse bg-white/10 rounded-lg';
  const variants = {
    rect: base,
    circle: `${base} rounded-full`,
    text: `${base} h-4 w-full`,
  };
  return <div className={`${variants[variant]} ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="glass p-6 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass p-6">
      <Skeleton className="h-6 w-1/4 mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
