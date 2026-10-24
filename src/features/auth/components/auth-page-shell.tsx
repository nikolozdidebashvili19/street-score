'use client';
import { type ReactNode } from 'react';

import { StreetPlanFigure } from '@/features/marketing/components/street-plan-figure';
import { Header } from '@/shared/components/layout/header';
import { useI18n } from '@/shared/hooks/use-i18n';

type AuthPageShellProps = {
  children: ReactNode;
};

/** Form on the left, a page of the report on the right (desktop only). */
export const AuthPageShell = ({ children }: AuthPageShellProps) => {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="grid flex-1 grid-cols-1 lg:grid-cols-2">
        <div className="animate-rise flex items-center justify-center px-6 py-12 sm:px-10">{children}</div>

        <aside className="hidden flex-col justify-center gap-8 border-l border-border bg-card px-12 py-12 lg:flex xl:px-20">
          <StreetPlanFigure className="animate-rise animate-rise-2" />
          <blockquote className="animate-rise animate-rise-3 border-l-2 border-brick pl-5">
            <p className="font-heading text-xl italic leading-snug">{t.home.example.lede}</p>
          </blockquote>
        </aside>
      </main>
    </div>
  );
};
