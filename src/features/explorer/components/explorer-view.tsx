'use client';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import { AddressSearch } from '@/features/explorer/components/address-search';
import { BusinessTypeSelect } from '@/features/explorer/components/business-type-select';
import { NearbySummary } from '@/features/explorer/components/nearby-summary';
import { SiteOverview } from '@/features/explorer/components/site-overview';
import { useNearbyPlaces } from '@/features/explorer/hooks/use-nearby-places';
import { useExplorerStore } from '@/features/explorer/hooks/useExplorerStore';
import { SaveLocationForm } from '@/features/locations/components/save-location-form';
import { ScoreBreakdown } from '@/features/scoring/components/score-breakdown';
import { ScoreExplanation } from '@/features/scoring/components/score-explanation';
import { explainScore } from '@/features/scoring/service/explanation.service';
import { StepSection } from '@/shared/components/layout/step-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { BUSINESS_TYPES, type BusinessType } from '@/shared/const/business-types.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { formatCoordinates, formatDistance } from '@/shared/utils/geo';

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
  const { pin, businessType, radiusM, result, loading, error, setPin, setBusinessType, setRadius } = useExplorerStore();
  const { t, format } = useI18n();
  const savedLocationLabel = t.explorer.savedLocation;
  useNearbyPlaces();

  // Each business type has a sensible walking distance, so the user never has to pick one.
  const changeBusinessType = (value: BusinessType) => {
    setBusinessType(value);
    setRadius(BUSINESS_TYPES[value].defaultRadiusM);
  };

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
    <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
      <div className="flex w-full flex-col divide-y divide-border bg-card lg:w-md lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-border">
        <StepSection number={1} title={t.explorer.stepSell}>
          <BusinessTypeSelect id="business-type" value={businessType} onChange={changeBusinessType} hideLabel />
        </StepSection>

        <StepSection number={2} title={t.explorer.stepPlace}>
          <AddressSearch
            onPick={(result) => setPin({ lng: result.lng, lat: result.lat, label: result.label, fromSearch: true })}
          />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {format(t.explorer.radiusNote, { radius: formatDistance(radiusM) })}
          </p>
        </StepSection>

        {pin && (
          <section className="animate-rise flex flex-col gap-5 p-5">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs uppercase tracking-wider text-brick">{t.explorer.selectedSite}</p>
                <h2 className="mt-1 line-clamp-2 text-2xl font-normal leading-tight">{pin.label}</h2>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{formatCoordinates(pin)}</p>
              </div>
              {loading && <Loader2 className="mt-1 size-4 shrink-0 animate-spin text-muted-foreground" />}
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

      <div className="relative order-first h-96 w-full border-b border-border lg:order-none lg:h-auto lg:flex-1 lg:border-b-0">
        <ExplorerMap />
      </div>
    </div>
  );
};
