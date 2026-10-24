'use client';
import { useLocationsStore } from '@/features/locations/hooks/useLocationsStore';
import { useI18n } from '@/shared/hooks/use-i18n';
import { http } from '@/shared/lib/http';
import { translateError } from '@/shared/utils/i18n';

export const useDeleteLocation = () => {
  const { removeItem, setError } = useLocationsStore();
  const { t } = useI18n();

  const remove = async (id: string) => {
    setError(null);
    try {
      await http.delete(`/locations/${id}`);
      removeItem(id);
    } catch (err) {
      setError(translateError(t, err, 'deleteFailed'));
    }
  };

  return { remove };
};
