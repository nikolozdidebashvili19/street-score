'use client';
import Link from 'next/link';

import { useLocations } from '@/features/locations/hooks/use-locations';
import { useLocationsStore } from '@/features/locations/hooks/useLocationsStore';
import { ScoreBreakdown } from '@/features/scoring/components/score-breakdown';
import { ScoreExplanation } from '@/features/scoring/components/score-explanation';
import { explainScore } from '@/features/scoring/service/explanation.service';
import { EmptyState } from '@/shared/components/layout/empty-state';
import { PageHeading } from '@/shared/components/layout/page-heading';
import { Button } from '@/shared/components/ui/button';
import { BUSINESS_TYPES } from '@/shared/const/business-types.const';
import { MIN_COMPARE_LOCATIONS } from '@/shared/const/locations.const';
import { PLACE_CATEGORIES } from '@/shared/const/places.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { cn } from '@/shared/lib/utils';
import { formatDistance } from '@/shared/utils/geo';

const COMPARE_COLUMN_CLASS: Record<number, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
};

type CompareViewProps = {
  ids: string[];
};

export const CompareView = ({ ids }: CompareViewProps) => {
  useLocations();
  const { items, loading } = useLocationsStore();
  const { t, format, label } = useI18n();
  const locations = ids
    .map((id) => items.find((item) => item.id === id))
    .filter((item) => item !== undefined);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <PageHeading eyebrow={t.compare.eyebrow} title={t.compare.title} description={t.compare.disclaimer} />

      {loading && locations.length === 0 && (
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{t.compare.loading}</p>
      )}

      {!loading && locations.length < MIN_COMPARE_LOCATIONS && (
        <EmptyState
          title={t.compare.pickPrompt}
          action={
            <Button asChild size="sm">
              <Link href="/locations">{t.compare.choose}</Link>
            </Button>
          }
        />
      )}

      {locations.length >= MIN_COMPARE_LOCATIONS && (
        <div
          className={cn(
            'animate-rise animate-rise-2 grid grid-cols-1 divide-y divide-border border-y border-foreground lg:divide-x lg:divide-y-0',
            COMPARE_COLUMN_CLASS[locations.length]
          )}
        >
          {locations.map((location, index) => {
            const competitors = BUSINESS_TYPES[location.businessType].competitorCategories;
            const competitorCount = competitors.reduce((sum, category) => sum + (location.counts[category] ?? 0), 0);

            return (
              <article key={location.id} className="flex flex-col gap-6 py-6 lg:px-6 lg:first:pl-0 lg:last:pr-0">
                <header className="flex flex-col gap-1">
                  <p className="font-mono text-xs uppercase tracking-wider text-brick">
                    {format(t.compare.location, { letter: String.fromCharCode(65 + index) })}
                  </p>
                  <h2 className="text-2xl font-normal leading-tight">{location.label}</h2>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {label(BUSINESS_TYPES[location.businessType])} · {formatDistance(location.radiusM)} ·{' '}
                    {format(t.compare.competitorsMapped, {
                      count: competitorCount,
                      categories: competitors.map((category) => label(PLACE_CATEGORIES[category])).join(', '),
                    })}
                  </p>
                </header>
                {location.score ? (
                  <>
                    <ScoreBreakdown score={location.score} variant="compact" />
                    <div className="border-t border-border pt-5">
                      <ScoreExplanation score={location.score} explanation={explainScore(location.score)} maxItems={2} />
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">{t.locations.noScore}</p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
