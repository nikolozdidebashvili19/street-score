import { type CategoryCounts, type LocationScore, type ScoreFactor } from '@/features/scoring/types/scoring.types';
import { type BusinessType } from '@/shared/const/business-types.const';

export type CandidateLocation = {
  id: string;
  label: string;
  address: string;
  businessType: BusinessType;
  radiusM: number;
  lng: number;
  lat: number;
  rentGel: number | null;
  budgetGel: number | null;
  score: LocationScore | null;
  counts: CategoryCounts;
  createdAt: string;
};

export type CandidateLocationCreate = {
  userId: string;
  label: string;
  address: string;
  businessType: BusinessType;
  radiusM: number;
  location: { type: 'Point'; coordinates: [number, number] };
  rentGel: number | null;
  budgetGel: number | null;
  score: {
    total: number | null;
    coverage: number;
    factors: ScoreFactor[];
    counts: CategoryCounts;
    computedAt: Date;
  };
};

export type LocationsState = {
  items: CandidateLocation[];
  loading: boolean;
  error: string | null;
};

export type LocationsActions = {
  setItems: (items: CandidateLocation[]) => void;
  addItem: (item: CandidateLocation) => void;
  removeItem: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export type LocationsStore = LocationsState & LocationsActions;
