'use client';
import { createContext, useContext } from 'react';
import { useStore, StoreApi } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { LocationsStore } from '@/features/locations/types/location.types';

export const LocationsStoreContext = createContext<StoreApi<LocationsStore> | null>(null);

export const useLocationsStore = () => {
  const store = useContext(LocationsStoreContext);
  if (!store) throw new Error('useLocationsStore must be used within StoreProvider');
  return useStore(
    store,
    useShallow((state: LocationsStore) => ({
      items: state.items,
      loading: state.loading,
      error: state.error,
      setItems: state.setItems,
      addItem: state.addItem,
      removeItem: state.removeItem,
      setLoading: state.setLoading,
      setError: state.setError,
    }))
  );
};
