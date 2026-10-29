'use client';
import { SpotCard } from '@/features/expansion/components/spot-card';
import { useExpansionStore } from '@/features/expansion/hooks/useExpansionStore';
import { useI18n } from '@/shared/hooks/use-i18n';

/** The answer: best new spots first, then the user's own saved places through the same check. */
export const SpotList = () => {
  const { plan } = useExpansionStore();
  const { t, format } = useI18n();
  if (!plan) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-normal leading-tight">{t.expansion.resultsTitle}</h2>
        {plan.sites.length === 0 ? (
          <p className="border-y border-border py-4 text-sm text-muted-foreground">{t.expansion.noResults}</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{t.expansion.resultsHint}</p>
            <ul className="divide-y divide-border border-y border-foreground">
              {plan.sites.map((site) => (
                <SpotCard
                  key={site.rank}
                  marker={
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-positive font-heading text-lg text-background">
                      {site.rank}
                    </span>
                  }
                  title={format(t.expansion.spotName, { rank: site.rank })}
                  point={site}
                  fit={site}
                  businessType={plan.businessType}
                />
              ))}
            </ul>
          </>
        )}
      </div>

      {plan.shortlist.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-normal">{t.expansion.savedTitle}</h3>
          <p className="text-sm text-muted-foreground">{t.expansion.savedHint}</p>
          <ul className="divide-y divide-border border-y border-border">
            {plan.shortlist.map((location) => (
              <SpotCard
                key={location.id}
                marker={<span className="size-3 shrink-0 rounded-full border-2 border-foreground" aria-hidden="true" />}
                title={location.label}
                point={location}
                fit={location}
                businessType={plan.businessType}
              />
            ))}
          </ul>
        </div>
      )}

      <p className="border-t border-border pt-4 text-xs text-muted-foreground">{t.expansion.note}</p>
    </div>
  );
};
