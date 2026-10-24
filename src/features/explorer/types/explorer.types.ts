import { type NearbyPlace } from '@/features/places/types/place.types';
import { type ScoredLocation } from '@/features/scoring/types/scoring.types';
import { type BusinessType } from '@/shared/const/business-types.const';

export type ExplorerPin = {
  lng: number;
  lat: number;
  label: string;
  /** True when the pin came from address search, so the map should fly to it. */
  fromSearch: boolean;
};

export type ExplorerState = {
  pin: ExplorerPin | null;
  businessType: BusinessType;
  radiusM: number;
  places: NearbyPlace[];
  result: ScoredLocation | null;
  loading: boolean;
  error: string | null;
};

export type ExplorerActions = {
  setPin: (pin: ExplorerPin | null) => void;
  setBusinessType: (businessType: BusinessType) => void;
  setRadius: (radiusM: number) => void;
  setResults: (places: NearbyPlace[], result: ScoredLocation | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export type ExplorerStore = ExplorerState & ExplorerActions;
