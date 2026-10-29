'use client';
import { useExpansionStore } from '@/features/expansion/hooks/useExpansionStore';
import { type ExpansionPlan } from '@/features/expansion/types/expansion.types';
import { type ExpansionPlanRequestType } from '@/features/expansion/validations/expansion.validation';
import { useI18n } from '@/shared/hooks/use-i18n';
import { http } from '@/shared/lib/http';
import { translateError } from '@/shared/utils/i18n';

export const useExpansionPlan = () => {
  const { businessType, radiusM, count, setPlan, setPlanning, setError } = useExpansionStore();
  const { t } = useI18n();

  const run = async () => {
    setPlanning(true);
    setError(null);
    try {
      const body: ExpansionPlanRequestType = { businessType, radiusM, count };
      setPlan(await http.post<ExpansionPlan>('/expansion/plan', body));
    } catch (err) {
      setError(translateError(t, err, 'planFailed'));
    } finally {
      setPlanning(false);
    }
  };

  return { run };
};
