'use client';
import { useState } from 'react';

import { useExpansionStore } from '@/features/expansion/hooks/useExpansionStore';
import { type Branch } from '@/features/expansion/types/expansion.types';
import { type CreateBranchType } from '@/features/expansion/validations/expansion.validation';
import { useI18n } from '@/shared/hooks/use-i18n';
import { http } from '@/shared/lib/http';
import { shortAddress } from '@/shared/utils/format';
import { translateError } from '@/shared/utils/i18n';

/** One tap adds the draft pin as a shop, named after its street (or "Shop N" for a map click). */
export const useAddBranch = () => {
  const { draft, branches, addBranch, setDraft } = useExpansionStore();
  const { t, format } = useI18n();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setError(null);
    try {
      const body: CreateBranchType = {
        label: shortAddress(draft.address) || format(t.expansion.shopName, { number: branches.length + 1 }),
        address: draft.address,
        lng: draft.lng,
        lat: draft.lat,
      };
      addBranch(await http.post<Branch>('/branches', body));
      setDraft(null);
    } catch (err) {
      setError(translateError(t, err, 'branchSaveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return { save, saving, error };
};
