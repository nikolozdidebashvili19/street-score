'use client';
import { signIn, getSession } from 'next-auth/react';

import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { User } from '@/features/auth/types/auth.types';
import { LoginType } from '@/features/auth/validations/auth.validation';
import { APP_HOME_ROUTE } from '@/shared/const/routes.const';
import { useI18n } from '@/shared/hooks/use-i18n';
import { translateError } from '@/shared/utils/i18n';


export const useLogin = () => {
  const { setUser, setLoading, setError } = useAuthStore();
  const { t } = useI18n();

  const handleSession = async (setUserFn: typeof setUser) => {
    const session = await getSession();
    const sessionUser = session?.user as User | undefined;
    if (!sessionUser) return;

    setUserFn({
      id: sessionUser.id ?? '',
      name: sessionUser.name ?? '',
      email: sessionUser.email ?? '',
      role: sessionUser.role ?? 'user',
      avatar: sessionUser.avatar ?? '',
    });

    window.location.href = APP_HOME_ROUTE;
  };

  const login = async (data: LoginType) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t.errors.invalidCredentials);
        return;
      }

      if (result?.ok) {
        await handleSession(setUser);
      }
    } catch (err) {
      setError(translateError(t, err, 'loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return { login };
};
