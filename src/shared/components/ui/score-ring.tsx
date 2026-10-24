import { cn } from '@/shared/lib/utils';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const SIZE_CLASS = {
  sm: 'size-14',
  md: 'size-20',
  lg: 'size-28',
} as const;

const VALUE_CLASS = {
  sm: 'text-xl',
  md: 'text-3xl',
  lg: 'text-4xl',
} as const;

type ScoreRingProps = {
  /** 0–100, or null when there is not enough data for a total. */
  value: number | null;
  size?: keyof typeof SIZE_CLASS;
  caption?: string;
  className?: string;
};

/** A thin dial: the number does the talking, the arc just shows how full it is. */
export const ScoreRing = ({ value, size = 'lg', caption, className }: ScoreRingProps) => {
  const progress = value === null ? 0 : Math.min(100, Math.max(0, value)) / 100;

  return (
    <div className={cn('relative shrink-0', SIZE_CLASS[size], className)}>
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={RADIUS} fill="none" strokeWidth="4" className="stroke-border" />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          className="stroke-positive transition-dash"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-heading leading-none', VALUE_CLASS[size])}>{value ?? '—'}</span>
        {caption && <span className="mt-0.5 font-mono text-xs text-muted-foreground">{caption}</span>}
      </div>
    </div>
  );
};
