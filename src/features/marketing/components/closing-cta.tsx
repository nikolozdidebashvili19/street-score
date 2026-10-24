'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { useI18n } from '@/shared/hooks/use-i18n';

export const ClosingCta = () => {
  const { t } = useI18n();

  return (
    <section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
      <div className="flex flex-col gap-6 border-y border-foreground py-12 sm:flex-row sm:items-end sm:justify-between lg:py-16">
        <div>
          <p className="max-w-2xl font-heading text-3xl leading-tight sm:text-4xl">{t.home.cta.title}</p>
          <p className="mt-3 font-mono text-xs text-muted-foreground">{t.home.cta.note}</p>
        </div>
        <Button size="lg" asChild className="shrink-0">
          <Link href="/sign-up">
            {t.home.ctaPrimary}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};
