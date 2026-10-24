'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { ExampleComparison } from '@/features/marketing/components/example-comparison';
import { Button } from '@/shared/components/ui/button';
import { useI18n } from '@/shared/hooks/use-i18n';

export const HeroSection = () => {
  const { t } = useI18n();

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-14 sm:px-10 sm:pt-20 pb-4">
      <p className="animate-rise font-mono text-xs uppercase tracking-wider text-brick">{t.home.badge}</p>

      <h1 className="animate-rise animate-rise-1 mt-5 max-w-4xl text-5xl font-normal leading-none sm:text-7xl">
        {t.home.heroBefore} <em className="text-brick">{t.home.heroAccent}</em> {t.home.heroAfter}
      </h1>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="animate-rise animate-rise-2 lg:col-span-5">
          <p className="text-lg leading-relaxed text-muted-foreground">{t.home.intro}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                {t.home.ctaPrimary}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="link" size="lg" asChild className="px-0 text-foreground underline underline-offset-4 sm:px-4">
              <Link href="/sign-in">{t.home.ctaSecondary}</Link>
            </Button>
          </div>
        </div>

        <div className="animate-rise animate-rise-3 lg:col-span-7">
          <ExampleComparison />
        </div>
      </div>
    </section>
  );
};
