# 001 — Rebrand template to StreetPulse

**Phase:** 0 · **Depends on:** — · **Status:** done

## Goal
Turn the generic starter into StreetPulse while keeping the locked design direction (CLAUDE.md §19).

## Tasks
- [x] `src/shared/const/app.const.ts`: `APP_NAME = 'StreetPulse'`, description from PRODUCT.md.
- [x] Landing copy in `src/shared/const/home.const.ts` + `features/marketing/components/home-page.tsx`:
      hero answers "Is this location a good place to open my business?", three feature cards
      (Explore, Score, Verify), honest stat strip ("Tbilisi first", "Open data", "Transparent scores").
- [x] Header logo icon → map pin.
- [x] `package.json` name → `streetpulse`.

## Acceptance criteria
- No "NextJS Starter" strings remain in the UI.
- Lint + build pass.
