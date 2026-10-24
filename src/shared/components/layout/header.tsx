'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { useLogout } from '@/features/auth/hooks/use-logout';
import { AppNav } from '@/shared/components/layout/app-nav';
import { BrandLogo } from '@/shared/components/layout/brand-logo';
import { LocaleToggle } from '@/shared/components/layout/locale-toggle';
import { ThemeToggle } from '@/shared/components/layout/theme-toggle';
import { Button } from '@/shared/components/ui/button';
import { useI18n } from '@/shared/hooks/use-i18n';

type SessionUser = {
  name?: string | null;
  avatar?: string | null;
};

type HeaderProps = {
  /** Show the app section tabs (signed-in app pages). */
  showNav?: boolean;
};

export const Header = ({ showNav = false }: HeaderProps) => {
  const { data: session } = useSession();
  const { logout } = useLogout();
  const { t } = useI18n();
  const sessionUser = session?.user as SessionUser | undefined;
  const userName = sessionUser?.name ?? '';
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="flex h-14 items-stretch justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-stretch gap-8">
          <span className="flex items-center">
            <BrandLogo />
          </span>
          {showNav && <AppNav className="hidden md:flex" />}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <LocaleToggle />
          <ThemeToggle />

          {sessionUser ? (
            <>
              {!showNav && (
                <Button variant="ghost" size="sm" asChild className="hidden text-muted-foreground hover:text-foreground sm:inline-flex">
                  <Link href="/explorer">{t.common.openApp}</Link>
                </Button>
              )}
              <div className="mx-1 hidden items-center gap-2 border-l border-border pl-3 sm:flex">
                {sessionUser.avatar ? (
                  <Image src={sessionUser.avatar} alt={userName} width={28} height={28} className="size-7 rounded-full object-cover" />
                ) : (
                  <span className="flex size-7 items-center justify-center rounded-full border border-brick font-mono text-xs text-brick">
                    {initials || 'U'}
                  </span>
                )}
                <span className="hidden text-sm lg:block">{userName}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
                {t.common.signOut}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link href="/sign-in">{t.common.signIn}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">{t.common.signUp}</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {showNav && <AppNav className="h-11 border-t border-border px-4 sm:px-6 md:hidden" />}
    </header>
  );
};
