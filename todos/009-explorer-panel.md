# 009 — Explorer panel: search, category, radius, nearby list

**Phase:** 1 · **Depends on:** 006, 007, 008 · **Status:** done

## Tasks
- [x] Zustand explorer store (store factory / `useExplorerStore` / register in `store-provider.tsx`):
      `pin`, `businessType`, `radiusM`, `places`, `loading`, `error`.
- [x] Action hooks: `use-nearby-places.ts` (fetch on pin/type/radius change), `use-geocode.ts`.
- [x] `address-search.tsx` (react-hook-form + zod) → results list → pick sets pin.
- [x] Business type + radius selectors (250 / 500 / 1000 m).
- [x] `nearby-summary.tsx`: competitor count, relevant-place counts by group, closest competitors with
      distance, and the notice "OSM coverage may be incomplete".
- [x] `/explorer` page composes panel + map (split view on desktop, stacked on mobile).

## Acceptance criteria
- Searching an address or clicking the map loads competitors within the radius.
