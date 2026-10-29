'use client';
import { ReportSection } from '@/features/marketing/components/report-section';
import { HOME_LOOK_ITEMS } from '@/shared/const/home.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';

/** The four things the score looks at, with the same coloured dots as the map. */
export const WhatWeLookAt = () => {
  const { t } = useI18n();
  const looks = t.home.looks;

  return (
    <ReportSection eyebrow={looks.eyebrow} title={looks.title}>
      <ul className="divide-y divide-border border-y border-border">
        {HOME_LOOK_ITEMS.map(({ key, dotClassName }) => (
          <li key={key} className="flex items-center gap-4 py-4">
            <span className={cn('size-4 shrink-0 rounded-full', dotClassName)} aria-hidden="true" />
            <span className="text-lg leading-snug">{looks.items[key]}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{looks.note}</p>
    </ReportSection>
  );
};
