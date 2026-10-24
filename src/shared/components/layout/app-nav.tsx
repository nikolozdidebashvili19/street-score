'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { APP_NAV_ITEMS } from '@/shared/const/navigation.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';

type AppNavProps = {
  className?: string;
};

/** Section tabs for the signed-in app, set like running heads on a report. */
export const AppNav = ({ className }: AppNavProps) => {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav aria-label={t.common.primaryNav} className={cn('flex items-stretch gap-5 sm:gap-6', className)}>
      {APP_NAV_ITEMS.map(({ href, key }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              '-mb-px flex shrink-0 items-center border-b-2 text-sm transition-colors',
              isActive ? 'border-brick text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t.nav[key]}
          </Link>
        );
      })}
    </nav>
  );
};
