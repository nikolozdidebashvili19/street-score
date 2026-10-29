'use client';
import { ChevronDown } from 'lucide-react';

import {
  BUSINESS_GROUP_KEYS,
  BUSINESS_TYPE_KEYS,
  BUSINESS_TYPES,
  type BusinessType,
} from '@/shared/const/business-types.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';

function isBusinessType(value: string): value is BusinessType {
  return BUSINESS_TYPE_KEYS.some((key) => key === value);
}

type BusinessTypeSelectProps = {
  id: string;
  value: BusinessType;
  onChange: (value: BusinessType) => void;
  /** Hide the visible label when a heading above already asks the question. */
  hideLabel?: boolean;
};

export const BusinessTypeSelect = ({ id, value, onChange, hideLabel = false }: BusinessTypeSelectProps) => {
  const { t, label } = useI18n();

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={cn('font-mono text-xs uppercase tracking-wider text-muted-foreground', hideLabel && 'sr-only')}
      >
        {t.explorer.businessType}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => {
            if (isBusinessType(event.target.value)) onChange(event.target.value);
          }}
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
  );
};
