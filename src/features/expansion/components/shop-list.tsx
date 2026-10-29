'use client';
import { Loader2, X } from 'lucide-react';

import { useAddBranch } from '@/features/expansion/hooks/use-add-branch';
import { useDeleteBranch } from '@/features/expansion/hooks/use-delete-branch';
import { useExpansionStore } from '@/features/expansion/hooks/useExpansionStore';
import { AddressSearch } from '@/features/explorer/components/address-search';
import { Button } from '@/shared/components/ui/button';
import { HIGH_OVERLAP_PERCENT } from '@/shared/const/expansion.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { formatCoordinates } from '@/shared/utils/geo';

/** Step 1: the shops the business has today. Search or tap the map, then one "Yes" adds it. */
export const ShopList = () => {
  const { branches, draft, plan, loading, setDraft } = useExpansionStore();
  const { save, saving, error } = useAddBranch();
  const { remove } = useDeleteBranch();
  const { t, format } = useI18n();
  const overlapById = new Map(plan?.branches.map((branch) => [branch.id, branch.overlap]));

  return (
    <div className="flex flex-col gap-4">
      {loading && branches.length === 0 && <p className="text-sm text-muted-foreground">{t.expansion.loading}</p>}

      {branches.length > 0 && (
        <ul className="divide-y divide-border border-y border-border">
          {branches.map((branch, index) => (
            <li key={branch.id} className="flex items-center gap-3 py-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-xs text-background">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base">{branch.label}</p>
                {(overlapById.get(branch.id) ?? 0) >= HIGH_OVERLAP_PERCENT && (
                  <p className="text-xs text-brick">{t.expansion.tooClose}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={format(t.expansion.remove, { label: branch.label })}
                onClick={() => remove(branch.id)}
                className="text-muted-foreground hover:text-brick"
              >
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {draft ? (
        <div className="flex flex-col gap-3 rounded-md border-2 border-brick p-4">
          <p className="font-heading text-xl leading-snug">{t.expansion.confirmTitle}</p>
          <p className="line-clamp-2 text-sm text-muted-foreground">{draft.address || formatCoordinates(draft)}</p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="grid grid-cols-2 gap-2">
            <Button size="lg" onClick={save} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {saving ? t.expansion.adding : t.expansion.confirmYes}
            </Button>
            <Button size="lg" variant="outline" onClick={() => setDraft(null)} disabled={saving}>
              {t.expansion.confirmNo}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {!loading && branches.length === 0 && <p className="text-sm text-muted-foreground">{t.expansion.noShops}</p>}
          <AddressSearch
            placeholder={t.expansion.searchPlaceholder}
            hint={t.expansion.shopsHint}
            onPick={(result) => setDraft({ lng: result.lng, lat: result.lat, address: result.label, fromSearch: true })}
          />
        </>
      )}
    </div>
  );
};
