'use client';
import { BusinessTypeSelect } from '@/features/explorer/components/business-type-select';
import { RadiusPicker } from '@/features/explorer/components/radius-picker';
import { useExplorerStore } from '@/features/explorer/hooks/useExplorerStore';
import { BUSINESS_TYPES, type BusinessType } from '@/shared/const/business-types.const';
import { useI18n } from '@/shared/hooks/use-i18n';

export const ExplorerControls = () => {
  const { businessType, radiusM, setBusinessType, setRadius } = useExplorerStore();
  const { t } = useI18n();

  const changeBusinessType = (value: BusinessType) => {
    setBusinessType(value);
    setRadius(BUSINESS_TYPES[value].defaultRadiusM);
  };

  return (
    <div className="flex flex-col gap-4">
      <BusinessTypeSelect id="business-type" value={businessType} onChange={changeBusinessType} />
      <RadiusPicker legend={t.explorer.walkingRadius} value={radiusM} onChange={setRadius} />
    </div>
  );
};
