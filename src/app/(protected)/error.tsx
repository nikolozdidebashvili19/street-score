'use client';
import { useEffect } from 'react';

import { Button } from '@/shared/components/ui/button';
import { useI18n } from '@/shared/hooks/use-i18n';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-96 w-full max-w-xl flex-col items-start justify-center gap-4 px-6">
      <h2 className="text-3xl font-normal">{t.common.errorTitle}</h2>
      <p className="text-sm text-muted-foreground">{t.errors.INTERNAL_ERROR}</p>
      <Button onClick={reset}>{t.common.tryAgain}</Button>
    </div>
  );
}
