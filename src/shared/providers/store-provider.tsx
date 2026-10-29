'use client';
import { type ReactNode, useState } from 'react';
import { type StoreApi } from 'zustand';

import { AuthStoreContext } from '@/features/auth/hooks/useAuthStore';
import { createAuthStore } from '@/features/auth/store/auth-store';
import { AuthStore } from '@/features/auth/types/auth.types';
import { ExpansionStoreContext } from '@/features/expansion/hooks/useExpansionStore';
import { createExpansionStore } from '@/features/expansion/store/expansion-store';
import { ExpansionStore } from '@/features/expansion/types/expansion.types';
import { ExplorerStoreContext } from '@/features/explorer/hooks/useExplorerStore';
import { createExplorerStore } from '@/features/explorer/store/explorer-store';
import { ExplorerStore } from '@/features/explorer/types/explorer.types';
import { LocationsStoreContext } from '@/features/locations/hooks/useLocationsStore';
import { createLocationsStore } from '@/features/locations/store/locations-store';
import { LocationsStore } from '@/features/locations/types/location.types';

export type StoreProviderProps = { children: ReactNode };

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [authStore] = useState<StoreApi<AuthStore>>(() => createAuthStore());
  const [explorerStore] = useState<StoreApi<ExplorerStore>>(() => createExplorerStore());
  const [locationsStore] = useState<StoreApi<LocationsStore>>(() => createLocationsStore());
  const [expansionStore] = useState<StoreApi<ExpansionStore>>(() => createExpansionStore());

  return (
    <AuthStoreContext.Provider value={authStore}>
      <ExplorerStoreContext.Provider value={explorerStore}>
        <LocationsStoreContext.Provider value={locationsStore}>
          <ExpansionStoreContext.Provider value={expansionStore}>
            {children}
          </ExpansionStoreContext.Provider>
        </LocationsStoreContext.Provider>
      </ExplorerStoreContext.Provider>
    </AuthStoreContext.Provider>
  );
};
