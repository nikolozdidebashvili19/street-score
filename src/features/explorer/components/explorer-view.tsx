'use client';
import { Loader2, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import { AddressSearch } from '@/features/explorer/components/address-search';
import { ExplorerControls } from '@/features/explorer/components/explorer-controls';
import { NearbySummary } from '@/features/explorer/components/nearby-summary';
import { SiteOverview } from '@/features/explorer/components/site-overview';
import { useNearbyPlaces } from '@/features/explorer/hooks/use-nearby-places';
import { useExplorerStore } from '@/features/explorer/hooks/useExplorerStore';
import { SaveLocationForm } from '@/features/locations/components/save-location-form';
import { ScoreBreakdown } from '@/features/scoring/components/score-breakdown';
import { ScoreExplanation } from '@/features/scoring/components/score-explanation';
import { explainScore } from '@/features/scoring/service/explanation.service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { BUSINESS_TYPES, type BusinessType } from '@/shared/const/business-types.const';
import { useI18n } from '@/shared/hooks/use-i18n';

const ExplorerMap = dynamic(
  () => import('@/features/explorer/components/explorer-map').then((mod) => mod.ExplorerMap),
  { ssr: false, loading: () => <div className="size-full animate-pulse bg-muted" /> }
);

const EXPLORER_TABS = ['overview', 'factors', 'nearby', 'checklist'] as const;

type ExplorerViewProps = {
  initialPin: { lng: number; lat: number } | null;
  initialBusinessType: BusinessType | null;
};

export const ExplorerView = ({ initialPin, initialBusinessType }: ExplorerViewProps) => {
  const { pin, result, loading, error, setPin, setBusinessType, setRadius } = useExplorerStore();
  const { t } = useI18n();
  const savedLocationLabel = t.explorer.savedLocation;
  useNearbyPlaces();

  useEffect(() => {
    if (initialBusinessType) {
      setBusinessType(initialBusinessType);
      setRadius(BUSINESS_TYPES[initialBusinessType].defaultRadiusM);
    }
    if (initialPin) setPin({ ...initialPin, label: savedLocationLabel, fromSearch: true });
    // Only on mount / deep-link change — not when the language switches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPin, initialBusinessType, setPin, setBusinessType, setRadius]);

  return (
    <div className="flex min-h-full flex-col overflow-hidden rounded-lg border border-border bg-card lg:h-full lg:min-h-0 lg:flex-row">
      <div className="flex w-full flex-col divide-y divide-border lg:w-96 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-border">
        <section className="animate-rise flex flex-col gap-4 p-5">
          <AddressSearch />
          <ExplorerControls />
        </section>

        {pin && (
          <section className="animate-rise flex flex-col gap-5 p-5">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-brick" />
              <p className="min-w-0 truncate text-sm font-medium">{pin.label}</p>
              {loading && <Loader2 className="ml-auto size-4 shrink-0 animate-spin text-muted-foreground" />}
            </div>

            {error && <p className="border-l-2 border-destructive pl-3 text-sm text-destructive">{error}</p>}

            {result && (
              <Tabs defaultValue="overview">
                <TabsList>
                  {EXPLORER_TABS.map((tab) => (
                    <TabsTrigger key={tab} value={tab}>
                      {t.explorer.tabs[tab]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="overview">
                  <SiteOverview />
                </TabsContent>
                <TabsContent value="factors">
                  <ScoreBreakdown score={result.score} />
                </TabsContent>
                <TabsContent value="nearby">
                  <NearbySummary />
                </TabsContent>
                <TabsContent value="checklist">
                  <ScoreExplanation score={result.score} explanation={explainScore(result.score)} sections={['verify']} showTitles={false} />
                </TabsContent>
              </Tabs>
            )}

            <SaveLocationForm />
          </section>
        )}
      </div>

      <div className="relative order-first h-96 w-full lg:order-none lg:h-auto lg:flex-1">
        <ExplorerMap />
      </div>
    </div>
  );
};
