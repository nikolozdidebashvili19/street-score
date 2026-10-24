import { DICTIONARIES } from '@/shared/const/dictionaries.const';
import { getServerLocale } from '@/shared/utils/server-locale';

export default async function Loading() {
  const locale = await getServerLocale();

  return (
    <div className="flex min-h-96 items-center justify-center">
      <p className="animate-pulse font-mono text-xs uppercase tracking-wider text-muted-foreground">{DICTIONARIES[locale].common.loading}</p>
    </div>
  );
}
