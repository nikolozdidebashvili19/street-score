'use client';
import { useExpansionStore } from '@/features/expansion/hooks/useExpansionStore';
import { useI18n } from '@/shared/hooks/use-i18n';
import { http } from '@/shared/lib/http';
import { translateError } from '@/shared/utils/i18n';

export const useDeleteBranch = () => {
  const { removeBranch, setError } = useExpansionStore();
  const { t } = useI18n();

  const remove = async (id: string) => {
    setError(null);
    try {
      await http.delete(`/branches/${id}`);
      removeBranch(id);
    } catch (err) {
      setError(translateError(t, err, 'branchDeleteFailed'));
    }
  };

  return { remove };
};
