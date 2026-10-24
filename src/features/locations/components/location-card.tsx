'use client';
import { ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { type CandidateLocation } from '@/features/locations/types/location.types';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ScoreRing } from '@/shared/components/ui/score-ring';
import { BUSINESS_TYPES } from '@/shared/const/business-types.const';
import { DATE_LOCALE } from '@/shared/const/i18n.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';
import { formatDistance } from '@/shared/utils/geo';

type LocationCardProps = {
  location: CandidateLocation;
  selected: boolean;
  selectable: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export const LocationCard = ({ location, selected, selectable, onToggle, onDelete }: LocationCardProps) => {
  const { t, format, label, locale } = useI18n();
  const explorerHref = `/explorer?lng=${location.lng}&lat=${location.lat}&type=${location.businessType}`;

  return (
    <Card
      className={cn(
        'gap-4 transition-colors hover:border-foreground/30',
        selected && 'border-brick ring-1 ring-brick'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <div className="min-w-0">
          <CardTitle className="truncate text-base">{location.label}</CardTitle>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{location.address || t.explorer.droppedPin}</p>
          <p className="mt-2 inline-flex font-mono text-xs text-muted-foreground">
            {format(t.locations.coverage, { coverage: location.score?.coverage ?? 0 })}
          </p>
        </div>
        <ScoreRing value={location.score?.total ?? null} size="sm" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-xs text-muted-foreground">
          {format(t.locations.meta, {
            type: label(BUSINESS_TYPES[location.businessType]),
            radius: formatDistance(location.radiusM),
            date: new Date(location.createdAt).toLocaleDateString(DATE_LOCALE[locale]),
          })}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label className={cn('flex items-center gap-2 text-sm', !selectable && !selected && 'opacity-50')}>
            <input
              type="checkbox"
              checked={selected}
              disabled={!selectable && !selected}
              onChange={() => onToggle(location.id)}
              className="size-4 accent-primary"
            />
            {t.locations.compare}
          </label>
          <Button variant="ghost" size="sm" asChild className="ml-auto">
            <Link href={explorerHref}>
              <ExternalLink className="size-4" /> {t.locations.open}
            </Link>
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={format(t.locations.delete, { label: location.label })} onClick={() => onDelete(location.id)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
