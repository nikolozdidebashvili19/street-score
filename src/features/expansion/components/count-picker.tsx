'use client';
import { useExpansionStore } from '@/features/expansion/hooks/useExpansionStore';
import { NEW_BRANCH_OPTIONS } from '@/shared/const/expansion.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';

/** Step 3: big number buttons instead of a stepper. */
export const CountPicker = () => {
  const { count, setCount } = useExpansionStore();
  const { t } = useI18n();

  return (
    <div role="group" aria-label={t.expansion.countTitle} className="grid grid-cols-5 gap-2">
      {NEW_BRANCH_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={count === option}
          onClick={() => setCount(option)}
          className={cn(
            'h-12 rounded-md border font-heading text-xl transition-colors',
            count === option
              ? 'border-foreground bg-foreground text-background'
              : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
