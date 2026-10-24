import { createStore } from 'zustand/vanilla';

import { ExplorerState, ExplorerStore } from '@/features/explorer/types/explorer.types';
import { BUSINESS_TYPES } from '@/shared/const/business-types.const';

export const createExplorerStore = (initState: Partial<ExplorerState> = {}) => {
  const DEFAULT_STATE: ExplorerState = {
    pin: null,
    businessType: 'cafe',
    radiusM: BUSINESS_TYPES.cafe.defaultRadiusM,
    places: [],
    result: null,
    loading: false,
    error: null,
  };

  return createStore<ExplorerStore>()((set) => ({
    ...DEFAULT_STATE,
    ...initState,
    setPin: (pin) => set({ pin }),
    setBusinessType: (businessType) => set({ businessType }),
    setRadius: (radiusM) => set({ radiusM }),
    setResults: (places, result) => set({ places, result }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
  }));
};
