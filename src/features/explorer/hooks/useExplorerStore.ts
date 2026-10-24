'use client';
import { createContext, useContext } from 'react';
import { useStore, StoreApi } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { ExplorerStore } from '@/features/explorer/types/explorer.types';

export const ExplorerStoreContext = createContext<StoreApi<ExplorerStore> | null>(null);

export const useExplorerStore = () => {
  const store = useContext(ExplorerStoreContext);
  if (!store) throw new Error('useExplorerStore must be used within StoreProvider');
  return useStore(
    store,
    useShallow((state: ExplorerStore) => ({
      pin: state.pin,
      businessType: state.businessType,
      radiusM: state.radiusM,
      places: state.places,
      result: state.result,
      loading: state.loading,
      error: state.error,
      setPin: state.setPin,
      setBusinessType: state.setBusinessType,
      setRadius: state.setRadius,
      setResults: state.setResults,
      setLoading: state.setLoading,
      setError: state.setError,
    }))
  );
};
