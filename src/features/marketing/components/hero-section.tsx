'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { StreetPlanFigure } from '@/features/marketing/components/street-plan-figure';
import { Button } from '@/shared/components/ui/button';
import { useI18n } from '@/shared/hooks/use-i18n';

export const HeroSection = () => {
  const { t } = useI18n();

  return (
    <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 pb-16 pt-12 sm:px-10 sm:pt-20 lg:grid-cols-12 lg:gap-10">
      <div className="flex flex-col lg:col-span-6 lg:pt-6">
        <p className="animate-rise font-mono text-xs uppercase tracking-wider text-brick">{t.home.badge}</p>

        <h1 className="animate-rise animate-rise-1 mt-5 text-5xl font-normal leading-none sm:text-6xl xl:text-7xl">
          {t.home.heroBefore} <em className="text-brick">{t.home.heroAccent}</em> {t.home.heroAfter}
        </h1>

        <p className="animate-rise animate-rise-2 mt-8 max-w-md text-lg leading-relaxed text-muted-foreground">{t.home.intro}</p>

        <div className="animate-rise animate-rise-2 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button size="lg" asChild>
            <Link href="/sign-up">
              {t.home.ctaPrimary}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Link href="/sign-in" className="text-sm underline underline-offset-4 transition-colors hover:text-brick">
            {t.home.ctaSecondary}
          </Link>
        </div>
      </div>

      <StreetPlanFigure className="animate-rise animate-rise-3 lg:col-span-6" />
    </section>
  );
};
