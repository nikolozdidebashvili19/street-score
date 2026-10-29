'use client';
import { ReportSection } from '@/features/marketing/components/report-section';
import { HOME_STEP_KEYS } from '@/shared/const/home.const';
import { useI18n } from '@/shared/hooks/use-i18n';

/** Three numbered steps — the whole product in one glance. */
export const HowItWorks = () => {
  const { t } = useI18n();
  const steps = t.home.steps;

  return (
    <ReportSection eyebrow={steps.eyebrow} title={steps.title}>
      <ol className="grid grid-cols-1 divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {HOME_STEP_KEYS.map((key, index) => (
          <li key={key} className="flex flex-col gap-2 py-6 sm:px-6 sm:first:pl-0 sm:last:pr-0">
            <span className="font-heading text-5xl leading-none text-brick">{index + 1}</span>
            <p className="mt-2 font-heading text-2xl leading-tight">{steps.items[key].title}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{steps.items[key].text}</p>
          </li>
        ))}
      </ol>
    </ReportSection>
  );
};
