'use client';
import { useEffect } from 'react';

import { useExplorerStore } from '@/features/explorer/hooks/useExplorerStore';
import { type NearbyPlace } from '@/features/places/types/place.types';
import { type ScoredLocation } from '@/features/scoring/types/scoring.types';
import { useI18n } from '@/shared/hooks/use-i18n';
import { http } from '@/shared/lib/http';
import { translateError } from '@/shared/utils/i18n';

/** Loads nearby places and the location score whenever the pin, business type or radius changes. */
export const useNearbyPlaces = () => {
  const { pin, businessType, radiusM, setResults, setLoading, setError } = useExplorerStore();
  const { t } = useI18n();

  useEffect(() => {
    if (!pin) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const coordinates = { lng: pin.lng, lat: pin.lat, radiusM };
        const [places, result] = await Promise.all([
          http.post<NearbyPlace[]>('/places/nearby', coordinates),
          http.post<ScoredLocation>('/score', { ...coordinates, businessType }),
        ]);
        if (!cancelled) setResults(places, result);
      } catch (err) {
        if (!cancelled) setError(translateError(t, err, 'nearbyFailed'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [pin, businessType, radiusM, setResults, setLoading, setError, t]);
};
