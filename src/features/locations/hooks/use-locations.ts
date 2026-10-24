'use client';
import { useEffect } from 'react';

import { useLocationsStore } from '@/features/locations/hooks/useLocationsStore';
import { type CandidateLocation } from '@/features/locations/types/location.types';
import { useI18n } from '@/shared/hooks/use-i18n';
import { http } from '@/shared/lib/http';
import { translateError } from '@/shared/utils/i18n';

/** Loads the signed-in user's saved locations into the store on mount. */
export const useLocations = () => {
  const { setItems, setLoading, setError } = useLocationsStore();
  const { t } = useI18n();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await http.get<CandidateLocation[]>('/locations');
        if (!cancelled) setItems(items);
      } catch (err) {
        if (!cancelled) setError(translateError(t, err, 'locationsFailed'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [setItems, setLoading, setError, t]);
};
