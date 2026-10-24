'use client';
import { APP_NAME } from '@/shared/const/app.const';
import { useI18n } from '@/shared/hooks/use-i18n';

export const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-8 sm:flex-row sm:items-baseline sm:justify-between sm:px-10">
        <p className="font-heading text-lg">{APP_NAME}</p>
        <p className="max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-right">{t.footer}</p>
      </div>
    </footer>
  );
};
