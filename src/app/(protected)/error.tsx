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
    <div className="flex flex-col items-center justify-center min-h-96 gap-4">
      <h2 className="text-2xl font-bold">{t.common.errorTitle}</h2>
      <p className="text-muted-foreground">{t.errors.INTERNAL_ERROR}</p>
      <Button onClick={reset}>{t.common.tryAgain}</Button>
    </div>
  );
}
