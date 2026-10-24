'use client';
import { Columns3, MapPinned } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { LocationCard } from '@/features/locations/components/location-card';
import { useDeleteLocation } from '@/features/locations/hooks/use-delete-location';
import { useLocations } from '@/features/locations/hooks/use-locations';
import { useLocationsStore } from '@/features/locations/hooks/useLocationsStore';
import { PageHeading } from '@/shared/components/layout/page-heading';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { MAX_COMPARE_LOCATIONS } from '@/shared/const/locations.const';
import { useI18n } from '@/shared/hooks/use-i18n';

export const SavedLocationsView = () => {
  useLocations();
  const { items, loading, error } = useLocationsStore();
  const { remove } = useDeleteLocation();
  const [selected, setSelected] = useState<string[]>([]);
  const { t } = useI18n();

  const toggle = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const handleDelete = (id: string) => {
    setSelected((current) => current.filter((item) => item !== id));
    remove(id);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeading
        eyebrow={t.locations.eyebrow}
        title={t.locations.title}
        description={t.locations.description}
      >
        <Button asChild disabled={selected.length < 2} className="w-full font-semibold sm:w-auto">
          <Link
            href={`/compare?ids=${selected.join(',')}`}
            aria-disabled={selected.length < 2}
            className={selected.length < 2 ? 'pointer-events-none opacity-50' : undefined}
          >
            <Columns3 className="size-4" /> {t.locations.compare} {selected.length > 0 ? `(${selected.length})` : ''}
          </Link>
        </Button>
      </PageHeading>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {loading && items.length === 0 && <p className="text-sm text-muted-foreground">{t.locations.loading}</p>}

      {!loading && items.length === 0 && (
        <Card className="animate-rise">
          <CardContent className="flex flex-col items-start gap-3 py-6">
            <MapPinned className="size-6 text-brick" />
            <p className="font-medium">{t.locations.emptyTitle}</p>
            <p className="text-sm text-muted-foreground">{t.locations.emptyText}</p>
            <Button asChild size="sm">
              <Link href="/explorer">{t.locations.openExplorer}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="animate-rise animate-rise-1 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
      </div>
    </div>
  );
};
