import { createStore } from 'zustand/vanilla';

import { ExpansionState, ExpansionStore } from '@/features/expansion/types/expansion.types';
import { BUSINESS_TYPES } from '@/shared/const/business-types.const';
import { DEFAULT_NEW_BRANCHES } from '@/shared/const/expansion.const';

export const createExpansionStore = (initState: Partial<ExpansionState> = {}) => {
  const DEFAULT_STATE: ExpansionState = {
    branches: [],
    draft: null,
    focus: null,
    businessType: 'cafe',
    radiusM: BUSINESS_TYPES.cafe.defaultRadiusM,
    count: DEFAULT_NEW_BRANCHES,
    plan: null,
    loading: false,
    planning: false,
    error: null,
  };

  return createStore<ExpansionStore>()((set) => ({
    ...DEFAULT_STATE,
    ...initState,
    // Any change to the network or the inputs makes the current plan stale.
    setBranches: (branches) => set({ branches }),
    addBranch: (branch) => set((state) => ({ branches: [...state.branches, branch], plan: null })),
    removeBranch: (id) => set((state) => ({ branches: state.branches.filter((item) => item.id !== id), plan: null })),
    setDraft: (draft) => set({ draft }),
    setFocus: (focus) => set({ focus }),
    setBusinessType: (businessType) => set({ businessType, plan: null }),
    setRadius: (radiusM) => set({ radiusM, plan: null }),
    setCount: (count) => set({ count, plan: null }),
    setPlan: (plan) => set({ plan }),
    setLoading: (loading) => set({ loading }),
    setPlanning: (planning) => set({ planning }),
    setError: (error) => set({ error }),
  }));
};
