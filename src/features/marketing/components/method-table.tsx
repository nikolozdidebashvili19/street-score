'use client';
import { ReportSection } from '@/features/marketing/components/report-section';
import { HOME_METHOD_BUSINESS_TYPE, HOME_METHOD_CELL_POINTS, HOME_METHOD_SOURCES } from '@/shared/const/home.const';
import { SCORE_FACTOR_KEYS, SCORING_PROFILES } from '@/shared/const/scoring.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';

const LABEL_CLASS = 'font-mono text-xs font-normal uppercase tracking-wider text-muted-foreground';

/** Table 2 — the real scoring weights, read straight from SCORING_PROFILES. */
export const MethodTable = () => {
  const { t } = useI18n();
  const method = t.home.method;
  const { weights } = SCORING_PROFILES[HOME_METHOD_BUSINESS_TYPE];
  const maxCells = Math.max(...Object.values(weights)) / HOME_METHOD_CELL_POINTS;

  return (
    <ReportSection eyebrow={method.eyebrow} title={method.title} lede={method.lede}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-xl text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className={cn(LABEL_CLASS, 'py-3 pr-4')}>{method.columns.factor}</th>
              <th scope="col" className={cn(LABEL_CLASS, 'py-3 pr-4')}>{method.columns.weight}</th>
              <th scope="col" className={cn(LABEL_CLASS, 'py-3 pr-4')}>{method.columns.measures}</th>
              <th scope="col" className={cn(LABEL_CLASS, 'py-3')}>{method.columns.source}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {SCORE_FACTOR_KEYS.map((key) => {
              const cells = weights[key] / HOME_METHOD_CELL_POINTS;

              return (
                <tr key={key} className="align-top">
                  <th scope="row" className="py-3 pr-4 font-heading text-lg font-normal">{t.score.factors[key]}</th>
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-2">
                      <span className="flex gap-0.5" aria-hidden="true">
                        {Array.from({ length: maxCells }).map((_, cell) => (
                          <span key={cell} className={cn('h-3 w-1.5', cell < cells ? 'bg-positive' : 'bg-border')} />
                        ))}
                      </span>
                      <span className="font-mono text-xs">{weights[key]}%</span>
                    </span>
                  </td>
                  <td className="py-3 pr-4 leading-relaxed text-muted-foreground">{method.measures[key]}</td>
                  <td className="whitespace-nowrap py-3 font-mono text-xs text-muted-foreground">{t.score.sources[HOME_METHOD_SOURCES[key]]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 border-t border-border pt-3 font-mono text-xs text-muted-foreground">{t.score.disclaimer}</p>
    </ReportSection>
  );
};
