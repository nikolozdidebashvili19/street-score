'use client';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode } from 'react';

import { useExpansionStore } from '@/features/expansion/hooks/useExpansionStore';
import { spotRating } from '@/features/expansion/service/expansion.service';
import { type NetworkFit } from '@/features/expansion/types/expansion.types';
import { Button } from '@/shared/components/ui/button';
import { type BusinessType } from '@/shared/const/business-types.const';
import { HIGH_OVERLAP_PERCENT, type SpotRating } from '@/shared/const/expansion.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';
import { formatDistance, type LngLat } from '@/shared/utils/geo';

const RATING_CLASS: Record<SpotRating, string> = {
  great: 'bg-positive text-background',
  good: 'border border-positive text-positive',
  okay: 'border border-border text-muted-foreground',
};

type SpotCardProps = {
  marker: ReactNode;
  title: string;
  point: LngLat;
  fit: NetworkFit;
  businessType: BusinessType;
};

/** One result in plain words: a rating, one sentence about the nearest shop, two buttons. */
export const SpotCard = ({ marker, title, point, fit, businessType }: SpotCardProps) => {
  const { setFocus } = useExpansionStore();
  const { t, format } = useI18n();
  const rating = spotRating(fit.expansionScore);
  // Proposed spots are referred to as "#2" by the server; show them as "Spot 2".
  const shop = fit.nearestLabel?.startsWith('#')
    ? format(t.expansion.spotName, { rank: fit.nearestLabel.slice(1) })
    : fit.nearestLabel;

  const showOnMap = () => {
    setFocus({ ...point });
    document.getElementById('expansion-map')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <li className="flex flex-col gap-3 py-4">
      <div className="flex items-center gap-3">
        {marker}
        <p className="min-w-0 flex-1 truncate font-heading text-xl leading-snug">{title}</p>
        <span className={cn('shrink-0 rounded-md px-2 py-1 text-xs font-medium', RATING_CLASS[rating])}>
          {t.expansion.rating[rating]}
        </span>
      </div>
      {shop !== null && fit.nearestM !== null && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {fit.overlap >= HIGH_OVERLAP_PERCENT
            ? format(t.expansion.closeTo, { shop })
            : format(t.expansion.farFrom, { shop, distance: formatDistance(fit.nearestM) })}
        </p>
      )}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={showOnMap}>
          <MapPin className="size-4" />
          {t.expansion.showOnMap}
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/explorer?lng=${point.lng}&lat=${point.lat}&type=${businessType}`}>{t.expansion.lookCloser}</Link>
        </Button>
      </div>
    </li>
  );
};
