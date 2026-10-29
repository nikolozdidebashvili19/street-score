'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { ReportSection } from '@/features/marketing/components/report-section';
import { HOME_USE_ITEMS } from '@/shared/const/home.const';
import { useI18n } from '@/shared/hooks/use-i18n';

/** One row per app section, each linking straight to it (sign-in first when needed). */
export const WhatYouCanDo = () => {
  const { t } = useI18n();
  const uses = t.home.uses;

  return (
    <ReportSection eyebrow={uses.eyebrow} title={uses.title}>
      <ul className="divide-y divide-border border-y border-border">
        {HOME_USE_ITEMS.map(({ key, href }) => (
          <li key={key}>
            <Link href={href} className="group flex items-center gap-4 py-5 transition-colors hover:text-brick">
              <span className="min-w-0 flex-1">
                <span className="block font-heading text-2xl leading-tight">{uses.items[key].title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{uses.items[key].text}</span>
              </span>
              <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-brick" />
            </Link>
          </li>
        ))}
      </ul>
    </ReportSection>
  );
};
