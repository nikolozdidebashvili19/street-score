'use client';
import { describeFactor, factorVerdict, type FactorVerdict } from '@/features/scoring/service/factor-text.service';
import { type LocationScore } from '@/features/scoring/types/scoring.types';
import { ScoreRing } from '@/shared/components/ui/score-ring';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';

const METER_CELLS = 20;

const VERDICT_CLASS: Record<FactorVerdict, string> = {
  good: 'bg-positive text-background',
  okay: 'border border-foreground/40 text-foreground',
  weak: 'border border-brick text-brick',
  none: 'border border-dashed border-border text-muted-foreground',
};

type ScoreBreakdownProps = {
  score: LocationScore;
  /** `factors`: a question per factor with its answer and evidence (explorer tab). `compact`: ring + answers (compare). */
  variant?: 'factors' | 'compact';
};

/** Each factor reads as a plain question with a one-word answer; the number stays in the meter's label. */
export const ScoreBreakdown = ({ score, variant = 'factors' }: ScoreBreakdownProps) => {
  const { t, locale, format } = useI18n();
  const detailed = variant === 'factors';

  return (
    <div className="flex flex-col gap-4">
      {!detailed && (
        <div className="flex items-center gap-4">
          <ScoreRing value={score.total} size="md" />
          <span className="font-mono text-xs text-muted-foreground">
            {score.coverage}% {t.score.backedByData}
          </span>
        </div>
      )}

      <ul className={cn('flex flex-col', detailed ? 'divide-y divide-border' : 'gap-3')}>
        {score.factors.map((factor) => {
          const text = describeFactor(factor, score.businessType, locale);
          const verdict = factorVerdict(factor.value);
          const filled = factor.value === null ? 0 : Math.round((factor.value / 100) * METER_CELLS);
          const valueText = factor.value === null ? t.score.noData : String(factor.value);

          return (
            <li key={factor.key} className={cn('flex flex-col gap-2', detailed && 'py-4 first:pt-0')}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {detailed && <p className="text-base leading-snug">{text.question}</p>}
                  <p className={cn(detailed ? 'mt-0.5 font-mono text-xs uppercase tracking-wider text-muted-foreground' : 'text-sm')}>
                    {text.label}
                  </p>
                </div>
                <span className={cn('shrink-0 rounded-md px-2 py-0.5 text-xs font-medium', VERDICT_CLASS[verdict])}>
                  {t.score.verdict[verdict]}
                </span>
              </div>
              <div className="flex gap-0.5" role="img" aria-label={format(t.score.valueOf, { label: text.label, value: valueText })}>
                {Array.from({ length: METER_CELLS }).map((_, cell) => (
                  <span
                    key={cell}
                    className={cn(
                      'h-1 flex-1 rounded-full',
                      factor.value === null ? 'bg-muted/50' : cell < filled ? 'bg-positive' : 'bg-muted'
                    )}
                  />
                ))}
              </div>
              {detailed && <p className="text-sm leading-relaxed text-muted-foreground">{text.evidence}</p>}
            </li>
          );
        })}
      </ul>

      {detailed && <p className="text-xs text-muted-foreground">{t.score.disclaimer}</p>}
    </div>
  );
};
