'use client';
import Link from 'next/link';

import { useLocations } from '@/features/locations/hooks/use-locations';
import { useLocationsStore } from '@/features/locations/hooks/useLocationsStore';
import { ScoreBreakdown } from '@/features/scoring/components/score-breakdown';
import { ScoreExplanation } from '@/features/scoring/components/score-explanation';
import { explainScore } from '@/features/scoring/service/explanation.service';
import { PageHeading } from '@/shared/components/layout/page-heading';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <PageHeading
        eyebrow={t.compare.eyebrow}
        title={t.compare.title}
        description={t.compare.disclaimer}
      />

      {loading && locations.length === 0 && <p className="text-sm text-muted-foreground">{t.compare.loading}</p>}

      {!loading && locations.length < MIN_COMPARE_LOCATIONS && (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-6">
            <p className="font-medium">{t.compare.pickPrompt}</p>
            <Button asChild size="sm">
              <Link href="/locations">{t.compare.choose}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {locations.length >= MIN_COMPARE_LOCATIONS && (
        <div className={cn('animate-rise animate-rise-2 grid grid-cols-1 gap-4', COMPARE_COLUMN_CLASS[locations.length])}>
          {locations.map((location, index) => {
            const competitors = BUSINESS_TYPES[location.businessType].competitorCategories;
            const competitorCount = competitors.reduce((sum, category) => sum + (location.counts[category] ?? 0), 0);

            return (
              <Card key={location.id}>
                <CardHeader>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {format(t.compare.location, { letter: String.fromCharCode(65 + index) })}
                  </p>
                  <CardTitle className="text-lg">{location.label}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {label(BUSINESS_TYPES[location.businessType])} · {formatDistance(location.radiusM)} ·{' '}
                    {format(t.compare.competitorsMapped, {
                      count: competitorCount,
                      categories: competitors.map((category) => label(PLACE_CATEGORIES[category])).join(', '),
                    })}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  {location.score ? (
                    <>
                      <ScoreBreakdown score={location.score} variant="compact" />
                      <ScoreExplanation score={location.score} explanation={explainScore(location.score)} maxItems={2} />
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t.locations.noScore}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
