'use client';
import { ChevronDown } from 'lucide-react';

import { useExplorerStore } from '@/features/explorer/hooks/useExplorerStore';
import {
  BUSINESS_GROUP_KEYS,
  BUSINESS_TYPE_KEYS,
  BUSINESS_TYPES,
  type BusinessType,
} from '@/shared/const/business-types.const';
import { RADIUS_OPTIONS_M } from '@/shared/const/places.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';
import { formatDistance } from '@/shared/utils/geo';

const segmentClassName = (active: boolean) =>
  cn(
    'rounded-md border px-3 py-2 text-sm font-medium transition-colors',
    active
      ? 'border-foreground bg-foreground text-background'
      : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground'
  );

function isBusinessType(value: string): value is BusinessType {
  return BUSINESS_TYPE_KEYS.some((key) => key === value);
}

export const ExplorerControls = () => {
  const { businessType, radiusM, setBusinessType, setRadius } = useExplorerStore();
  const { t, label } = useI18n();

  const changeBusinessType = (value: string) => {
    if (!isBusinessType(value)) return;
    setBusinessType(value);
    setRadius(BUSINESS_TYPES[value].defaultRadiusM);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="business-type"
          className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
        >
          {t.explorer.businessType}
        </label>
        <div className="relative">
          <select
            id="business-type"
            value={businessType}
            onChange={(event) => changeBusinessType(event.target.value)}
            className={cn(
              'h-10 w-full appearance-none rounded-md border border-border bg-background pl-3 pr-9',
              'text-sm font-medium text-foreground outline-none transition-colors',
              'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50'
            )}
          >
            {BUSINESS_GROUP_KEYS.map((group) => (
              <optgroup key={group} label={t.explorer.groups[group]}>
                {BUSINESS_TYPE_KEYS.filter((key) => BUSINESS_TYPES[key].group === group).map((key) => (
                  <option key={key} value={key}>
                    {label(BUSINESS_TYPES[key])}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-muted-foreground" />
        </div>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {t.explorer.walkingRadius}
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {RADIUS_OPTIONS_M.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={radiusM === option}
              onClick={() => setRadius(option)}
              className={cn(segmentClassName(radiusM === option), 'font-mono')}
            >
              {formatDistance(option)}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
};
