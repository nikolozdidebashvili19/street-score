'use client';
import { Loader2, Search } from 'lucide-react';
import dynamic from 'next/dynamic';

import { CountPicker } from '@/features/expansion/components/count-picker';
import { PlanStep } from '@/features/expansion/components/plan-step';
import { ShopList } from '@/features/expansion/components/shop-list';
import { SpotList } from '@/features/expansion/components/spot-list';
import { useBranches } from '@/features/expansion/hooks/use-branches';
import { useExpansionPlan } from '@/features/expansion/hooks/use-expansion-plan';
import { useExpansionStore } from '@/features/expansion/hooks/useExpansionStore';
import { BusinessTypeSelect } from '@/features/explorer/components/business-type-select';
import { Button } from '@/shared/components/ui/button';
import { BUSINESS_TYPES, type BusinessType } from '@/shared/const/business-types.const';
import { useI18n } from '@/shared/hooks/use-i18n';

const ExpansionMap = dynamic(
  () => import('@/features/expansion/components/expansion-map').then((mod) => mod.ExpansionMap),
  { ssr: false, loading: () => <div className="size-full animate-pulse bg-muted" /> }
);

export const ExpansionView = () => {
  useBranches();
  const { branches, businessType, plan, planning, error, setBusinessType, setRadius } = useExpansionStore();
  const { run } = useExpansionPlan();
  const { t } = useI18n();
  const hasShops = branches.length > 0;

  // Each business type has a sensible walking distance, so the user never has to pick one.
  const changeBusinessType = (value: BusinessType) => {
    setBusinessType(value);
    setRadius(BUSINESS_TYPES[value].defaultRadiusM);
  };

  return (
    <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
      <div className="flex w-full flex-col divide-y divide-border bg-card lg:w-md lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-border">
        <header className="animate-rise flex flex-col gap-2 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-brick">{t.expansion.eyebrow}</p>
          <h1 className="text-3xl font-normal leading-tight">{t.expansion.title}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">{t.expansion.intro}</p>
        </header>

        <PlanStep number={1} title={t.expansion.shopsTitle}>
          <ShopList />
        </PlanStep>

        <PlanStep number={2} title={t.expansion.sellTitle} muted={!hasShops}>
          <BusinessTypeSelect id="expansion-business-type" value={businessType} onChange={changeBusinessType} hideLabel />
        </PlanStep>

        <PlanStep number={3} title={t.expansion.countTitle} muted={!hasShops}>
          <CountPicker />
          <Button size="lg" onClick={run} disabled={!hasShops || planning} className="h-12 w-full text-base">
            {planning ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}
            {planning ? t.expansion.finding : t.expansion.find}
          </Button>
          {!hasShops && <p className="text-sm text-muted-foreground">{t.expansion.needShop}</p>}
          {error && <p className="border-l-2 border-destructive pl-3 text-sm text-destructive">{error}</p>}
        </PlanStep>

        {plan && (
          <section className="animate-rise p-5">
            <SpotList />
          </section>
        )}
      </div>

      <div
        id="expansion-map"
        className="relative order-first h-96 w-full border-b border-border lg:order-none lg:h-auto lg:flex-1 lg:border-b-0"
      >
        <ExpansionMap />
      </div>
    </div>
  );
};
