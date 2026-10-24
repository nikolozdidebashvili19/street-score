'use client';
import { useState } from 'react';

import { useExplorerStore } from '@/features/explorer/hooks/useExplorerStore';
import { useLocationsStore } from '@/features/locations/hooks/useLocationsStore';
import { type CandidateLocation } from '@/features/locations/types/location.types';
import { type CreateLocationType, type SaveLocationFormType } from '@/features/locations/validations/location.validation';
import { useI18n } from '@/shared/hooks/use-i18n';
import { http } from '@/shared/lib/http';
import { translateError } from '@/shared/utils/i18n';

function toOptionalNumber(value?: string): number | null {
  return value ? Number(value) : null;
}

export const useSaveLocation = () => {
  const { pin, businessType, radiusM } = useExplorerStore();
  const { addItem } = useLocationsStore();
  const { t } = useI18n();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<CandidateLocation | null>(null);

  const save = async (form: SaveLocationFormType) => {
    if (!pin) return;
    setSaving(true);
    setError(null);
    try {
      const body: CreateLocationType = {
        label: form.label,
        address: pin.label,
        businessType,
        radiusM,
        lng: pin.lng,
        lat: pin.lat,
        rentGel: toOptionalNumber(form.rentGel),
        budgetGel: toOptionalNumber(form.budgetGel),
      };
      const location = await http.post<CandidateLocation>('/locations', body);
      addItem(location);
      setSaved(location);
    } catch (err) {
      setError(translateError(t, err, 'saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return { save, saving, error, saved, reset: () => setSaved(null) };
};
