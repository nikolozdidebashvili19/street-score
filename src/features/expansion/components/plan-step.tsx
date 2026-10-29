import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

type PlanStepProps = {
  number: number;
  title: string;
  hint?: string;
  /** Dimmed until the earlier steps are done. */
  muted?: boolean;
  children: ReactNode;
};

/** A big numbered question — the planner is just three of these and a button. */
export const PlanStep = ({ number, title, hint, muted = false, children }: PlanStepProps) => {
  return (
    <section className={cn('flex flex-col gap-4 p-5 transition-opacity', muted && 'opacity-50')}>
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-foreground font-heading text-lg leading-none">
          {number}
        </span>
        <div>
          <h2 className="text-2xl font-normal leading-tight">{title}</h2>
          {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
};
