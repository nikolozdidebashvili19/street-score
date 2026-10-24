'use client';
import { APP_NAME } from '@/shared/const/app.const';
import { useI18n } from '@/shared/hooks/use-i18n';

export const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border px-6 py-6 sm:px-10">
      <p className="text-center text-xs text-muted-foreground">
        {APP_NAME} · {t.footer}
      </p>
    </footer>
  );
};
