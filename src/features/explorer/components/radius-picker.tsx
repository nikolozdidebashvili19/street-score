'use client';
import { RADIUS_OPTIONS_M } from '@/shared/const/places.const';
import { cn } from '@/shared/lib/utils';
import { formatDistance } from '@/shared/utils/geo';

export const segmentClassName = (active: boolean) =>
  cn(
    'rounded-md border px-3 py-2 text-sm font-medium transition-colors',
    active
      ? 'border-foreground bg-foreground text-background'
      : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground'
  );

type RadiusPickerProps = {
  legend: string;
  value: number;
  onChange: (value: number) => void;
};

export const RadiusPicker = ({ legend, value, onChange }: RadiusPickerProps) => {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">{legend}</legend>
      <div className="grid grid-cols-3 gap-2">
        {RADIUS_OPTIONS_M.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={cn(segmentClassName(value === option), 'font-mono')}
          >
            {formatDistance(option)}
          </button>
        ))}
      </div>
    </fieldset>
  );
};
