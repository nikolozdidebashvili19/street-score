'use client';
import { useExplorerStore } from '@/features/explorer/hooks/useExplorerStore';
import { BUSINESS_TYPES } from '@/shared/const/business-types.const';
import { PLACE_CATEGORIES } from '@/shared/const/places.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { formatDistance } from '@/shared/utils/geo';

const MAX_COMPETITORS_LISTED = 10;

export const NearbySummary = () => {
  const { places, result, businessType, radiusM } = useExplorerStore();
  const { t, format, label } = useI18n();
  if (!result) return null;

  const { competitorCategories } = BUSINESS_TYPES[businessType];
  const competitors = places.filter((place) => competitorCategories.includes(place.category));

  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {format(t.nearby.within, { radius: formatDistance(radiusM) })}
      </p>

      {competitors.length > 0 && (
        <ul className="flex flex-col divide-y divide-border text-sm">
          {competitors.slice(0, MAX_COMPETITORS_LISTED).map((place) => (
            <li key={place.id} className="flex items-center justify-between gap-3 py-2">
              <span className="flex min-w-0 items-center gap-2">
                <span className="size-2 shrink-0 rounded-full bg-brick" aria-hidden="true" />
                <span className="truncate">{place.name || label(PLACE_CATEGORIES[place.category])}</span>
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">{formatDistance(place.distanceM)}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">{t.nearby.coverageNotice}</p>
    </div>
  );
};
