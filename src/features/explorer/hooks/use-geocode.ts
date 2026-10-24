'use client';
import { useState } from 'react';

import { type GeocodeType } from '@/features/geocoding/validations/geocoding.validation';
import { useI18n } from '@/shared/hooks/use-i18n';
import { http } from '@/shared/lib/http';
import { type GeocodeResult } from '@/shared/lib/nominatim';
import { translateError } from '@/shared/utils/i18n';

export const useGeocode = () => {
  const { t } = useI18n();
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (data: GeocodeType) => {
    setSearching(true);
    setError(null);
    try {
      const found = await http.post<GeocodeResult[]>('/geocode', data);
      setResults(found);
      if (found.length === 0) setError(t.errors.noAddress);
    } catch (err) {
      setError(translateError(t, err, 'geocodeFailed'));
    } finally {
      setSearching(false);
    }
  };

  const clear = () => setResults([]);

  return { results, searching, error, search, clear };
};
