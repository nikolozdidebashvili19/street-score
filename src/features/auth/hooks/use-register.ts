'use client';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { SignUpType } from '@/features/auth/validations/auth.validation';
import { useI18n } from '@/shared/hooks/use-i18n';
import { http } from '@/shared/lib/http';
import { translateError } from '@/shared/utils/i18n';

export const useRegister = () => {
  const { setLoading, setError } = useAuthStore();
  const { t } = useI18n();
  const router = useRouter();

  const register = async (data: SignUpType) => {
    setLoading(true);
    setError(null);
    try {
      await http.post('/auth/register', data);
      router.push('/sign-in');
    } catch (err) {
      setError(translateError(t, err, 'registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return { register };
};
