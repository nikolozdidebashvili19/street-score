'use client';
import { describeFactor } from '@/features/scoring/service/factor-text.service';
import { type LocationScore } from '@/features/scoring/types/scoring.types';
import { ScoreRing } from '@/shared/components/ui/score-ring';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';

const METER_CELLS = 20;

type ScoreBreakdownProps = {
  score: LocationScore;
  /** `factors`: bars with evidence (explorer tab). `compact`: ring + bars only (compare). */
  variant?: 'factors' | 'compact';
};

export const ScoreBreakdown = ({ score, variant = 'factors' }: ScoreBreakdownProps) => {
  const { t, locale, format } = useI18n();
  const showEvidence = variant === 'factors';

  return (
    <div className="flex flex-col gap-4">
      {variant === 'compact' && (
        <div className="flex items-center gap-4">
          <ScoreRing value={score.total} size="md" />
          <span className="font-mono text-xs text-muted-foreground">
            {score.coverage}% {t.score.backedByData}
          </span>
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {score.factors.map((factor) => {
          const text = describeFactor(factor, score.businessType, locale);
          const filled = factor.value === null ? 0 : Math.round((factor.value / 100) * METER_CELLS);
          const valueText = factor.value === null ? t.score.noData : String(factor.value);

          return (
            <li key={factor.key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span>{text.label}</span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">{valueText}</span>
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
              {showEvidence && <p className="text-xs text-muted-foreground">{text.evidence}</p>}
            </li>
          );
        })}
      </ul>

      {showEvidence && <p className="text-xs text-muted-foreground">{t.score.disclaimer}</p>}
    </div>
  );
};
