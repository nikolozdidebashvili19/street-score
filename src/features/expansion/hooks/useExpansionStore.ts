'use client';
import { createContext, useContext } from 'react';
import { useStore, StoreApi } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { ExpansionStore } from '@/features/expansion/types/expansion.types';

export const ExpansionStoreContext = createContext<StoreApi<ExpansionStore> | null>(null);

export const useExpansionStore = () => {
  const store = useContext(ExpansionStoreContext);
  if (!store) throw new Error('useExpansionStore must be used within StoreProvider');
  return useStore(
    store,
    useShallow((state: ExpansionStore) => ({
      branches: state.branches,
      draft: state.draft,
      focus: state.focus,
      businessType: state.businessType,
      radiusM: state.radiusM,
      count: state.count,
      plan: state.plan,
      loading: state.loading,
      planning: state.planning,
      error: state.error,
      setBranches: state.setBranches,
      addBranch: state.addBranch,
      removeBranch: state.removeBranch,
      setDraft: state.setDraft,
      setFocus: state.setFocus,
      setBusinessType: state.setBusinessType,
      setRadius: state.setRadius,
      setCount: state.setCount,
      setPlan: state.setPlan,
      setLoading: state.setLoading,
      setPlanning: state.setPlanning,
      setError: state.setError,
    }))
  );
};
