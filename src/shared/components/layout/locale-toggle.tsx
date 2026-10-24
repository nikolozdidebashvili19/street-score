'use client';
import { Languages } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE_S, LOCALE_SWITCH_LABEL } from '@/shared/const/i18n.const';
import { useI18n } from '@/shared/hooks/use-i18n';

export const LocaleToggle = () => {
  const { locale, t } = useI18n();
  const router = useRouter();

  const switchLocale = () => {
    const next = locale === 'ka' ? 'en' : 'ka';
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE_S}; samesite=lax`;
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchLocale}
      aria-label={t.common.switchLanguage}
      title={t.common.switchLanguage}
      className="text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      <Languages className="size-4" />
      {LOCALE_SWITCH_LABEL[locale]}
    </Button>
  );
};
