import { createStore } from 'zustand/vanilla';

import { LocationsState, LocationsStore } from '@/features/locations/types/location.types';

export const createLocationsStore = (initState: Partial<LocationsState> = {}) => {
  const DEFAULT_STATE: LocationsState = {
    items: [],
    loading: false,
    error: null,
  };

  return createStore<LocationsStore>()((set) => ({
    ...DEFAULT_STATE,
    ...initState,
    setItems: (items) => set({ items }),
    addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
    removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
  }));
};
