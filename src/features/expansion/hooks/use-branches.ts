'use client';
import { useEffect } from 'react';

import { useExpansionStore } from '@/features/expansion/hooks/useExpansionStore';
import { type Branch } from '@/features/expansion/types/expansion.types';
import { useI18n } from '@/shared/hooks/use-i18n';
import { http } from '@/shared/lib/http';
import { translateError } from '@/shared/utils/i18n';

/** Loads the signed-in user's existing branches into the store on mount. */
export const useBranches = () => {
  const { setBranches, setLoading, setError } = useExpansionStore();
  const { t } = useI18n();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const branches = await http.get<Branch[]>('/branches');
        if (!cancelled) setBranches(branches);
      } catch (err) {
        if (!cancelled) setError(translateError(t, err, 'branchesFailed'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [setBranches, setLoading, setError, t]);
};
