'use client';
import { ArrowUpRight, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { type CandidateLocation } from '@/features/locations/types/location.types';
import { Button } from '@/shared/components/ui/button';
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

/** One ledger row on the saved-locations page. */
export const LocationCard = ({ location, selected, selectable, onToggle, onDelete }: LocationCardProps) => {
  const { t, format, label, locale } = useI18n();
  const explorerHref = `/explorer?lng=${location.lng}&lat=${location.lat}&type=${location.businessType}`;
  const disabled = !selectable && !selected;

  return (
    <li
      className={cn(
        'grid grid-cols-12 items-center gap-x-4 gap-y-3 border-l-2 py-4 pl-3 pr-1 transition-colors',
        selected ? 'border-brick bg-accent' : 'border-transparent hover:bg-accent/50'
      )}
    >
      <label className={cn('col-span-12 flex items-center gap-2 text-sm md:col-span-1', disabled && 'opacity-50')}>
        <input
          type="checkbox"
          checked={selected}
          disabled={disabled}
          onChange={() => onToggle(location.id)}
          className="size-4 accent-primary"
        />
        <span className="md:sr-only">{t.locations.compare}</span>
      </label>

      <div className="col-span-3 md:col-span-2">
        <p className="font-heading text-3xl leading-none">
          {location.score?.total ?? '—'}
          <span className="ml-1 font-mono text-xs text-muted-foreground">/100</span>
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {format(t.locations.coverage, { coverage: location.score?.coverage ?? 0 })}
        </p>
      </div>

      <div className="col-span-9 min-w-0 md:col-span-5">
        <p className="truncate font-heading text-lg leading-snug">{location.label}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{location.address || t.explorer.droppedPin}</p>
      </div>

      <p className="col-span-8 font-mono text-xs leading-relaxed text-muted-foreground md:col-span-3">
        {format(t.locations.meta, {
          type: label(BUSINESS_TYPES[location.businessType]),
          radius: formatDistance(location.radiusM),
          date: new Date(location.createdAt).toLocaleDateString(DATE_LOCALE[locale]),
        })}
      </p>

      <div className="col-span-4 flex justify-end gap-1 md:col-span-1">
        <Button variant="ghost" size="icon-sm" asChild aria-label={t.locations.open}>
          <Link href={explorerHref}>
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={format(t.locations.delete, { label: location.label })}
          onClick={() => onDelete(location.id)}
          className="text-muted-foreground hover:text-brick"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </li>
  );
};
