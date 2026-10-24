'use client';
import { Columns3 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { LocationCard } from '@/features/locations/components/location-card';
import { useDeleteLocation } from '@/features/locations/hooks/use-delete-location';
import { useLocations } from '@/features/locations/hooks/use-locations';
import { useLocationsStore } from '@/features/locations/hooks/useLocationsStore';
import { EmptyState } from '@/shared/components/layout/empty-state';
import { PageHeading } from '@/shared/components/layout/page-heading';
import { Button } from '@/shared/components/ui/button';
import { MAX_COMPARE_LOCATIONS, MIN_COMPARE_LOCATIONS } from '@/shared/const/locations.const';
import { useI18n } from '@/shared/hooks/use-i18n';

const COLUMN_LABEL_CLASS = 'font-mono text-xs uppercase tracking-wider text-muted-foreground';

export const SavedLocationsView = () => {
  useLocations();
  const { items, loading, error } = useLocationsStore();
  const { remove } = useDeleteLocation();
  const [selected, setSelected] = useState<string[]>([]);
  const { t } = useI18n();
  const canCompare = selected.length >= MIN_COMPARE_LOCATIONS;

  const toggle = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const handleDelete = (id: string) => {
    setSelected((current) => current.filter((item) => item !== id));
    remove(id);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <PageHeading eyebrow={t.locations.eyebrow} title={t.locations.title} description={t.locations.description}>
        <Button asChild disabled={!canCompare} className="w-full sm:w-auto">
          <Link
            href={`/compare?ids=${selected.join(',')}`}
            aria-disabled={!canCompare}
            className={canCompare ? undefined : 'pointer-events-none opacity-50'}
          >
            <Columns3 className="size-4" /> {t.locations.compare} {selected.length > 0 ? `(${selected.length})` : ''}
          </Link>
        </Button>
      </PageHeading>

      {error && <p className="border-l-2 border-destructive pl-3 text-sm text-destructive">{error}</p>}
      {loading && items.length === 0 && <p className={COLUMN_LABEL_CLASS}>{t.locations.loading}</p>}

      {!loading && items.length === 0 && (
        <EmptyState
          title={t.locations.emptyTitle}
          text={t.locations.emptyText}
          action={
            <Button asChild size="sm">
              <Link href="/explorer">{t.locations.openExplorer}</Link>
            </Button>
          }
        />
      )}

      {items.length > 0 && (
        <div className="animate-rise animate-rise-1">
          <div className="hidden grid-cols-12 gap-x-4 border-b border-foreground pb-2 pl-3.5 pr-1 md:grid">
            <span className={`${COLUMN_LABEL_CLASS} col-span-1`}>{t.locations.columns.compare}</span>
            <span className={`${COLUMN_LABEL_CLASS} col-span-2`}>{t.locations.columns.score}</span>
            <span className={`${COLUMN_LABEL_CLASS} col-span-5`}>{t.locations.columns.site}</span>
            <span className={`${COLUMN_LABEL_CLASS} col-span-4`}>{t.locations.columns.details}</span>
          </div>
          <ul className="divide-y divide-border border-b border-border">
            {items.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                selected={selected.includes(location.id)}
                selectable={selected.length < MAX_COMPARE_LOCATIONS}
                onToggle={toggle}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
