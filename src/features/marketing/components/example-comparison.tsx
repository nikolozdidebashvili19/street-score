'use client';
import { ReportSection } from '@/features/marketing/components/report-section';
import { HOME_EXAMPLE_ROWS, HOME_EXAMPLE_SCORES } from '@/shared/const/home.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';

const LABEL_CLASS = 'font-mono text-xs font-normal uppercase tracking-wider text-muted-foreground';

/** Table 1 — the PRODUCT.md §2 example, set like a page from a printed report. */
export const ExampleComparison = () => {
  const { t } = useI18n();
  const example = t.home.example;

  return (
    <ReportSection eyebrow={example.eyebrow} title={example.title} lede={example.lede}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-md text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="w-1/4 py-3 pr-4" />
              <th scope="col" className={cn(LABEL_CLASS, 'py-3 pr-4')}>{example.columnA}</th>
              <th scope="col" className={cn(LABEL_CLASS, 'py-3')}>{example.columnB}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <th scope="row" className="py-4 pr-4 font-normal text-muted-foreground">{example.rows.score}</th>
              {[HOME_EXAMPLE_SCORES.a, HOME_EXAMPLE_SCORES.b].map((score) => (
                <td key={score} className="py-4 pr-4 font-heading text-4xl leading-none">
                  {score}
                  <span className="ml-1 font-mono text-xs text-muted-foreground">/100</span>
                </td>
              ))}
            </tr>
            {HOME_EXAMPLE_ROWS.map((row) => (
              <tr key={row} className="align-top">
                <th scope="row" className="py-4 pr-4 font-normal text-muted-foreground">{example.rows[row]}</th>
                {[example.a[row], example.b[row]].map((text) => (
                  <td
                    key={text}
                    className={cn('py-4 pr-4 leading-relaxed', row === 'risk' && 'text-brick', row === 'suits' && 'font-heading text-lg italic')}
                  >
                    {text}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 border-t border-border pt-3 font-mono text-xs text-muted-foreground">{example.note}</p>
    </ReportSection>
  );
};
