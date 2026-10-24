'use client';
import { MAP_LEGEND } from '@/shared/const/map.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';

export const MapLegend = () => {
  const { t } = useI18n();

  return (
    <ul className="absolute left-3 top-3 flex flex-col gap-1.5 rounded-md border border-border bg-card px-3 py-2.5 text-xs">
      {MAP_LEGEND.map(({ role, dotClassName }) => (
        <li key={role} className="flex items-center gap-2">
          <span className={cn('size-2.5 rounded-full', dotClassName)} aria-hidden="true" />
          <span className="text-muted-foreground">{t.legend[role]}</span>
        </li>
      ))}
    </ul>
  );
};
