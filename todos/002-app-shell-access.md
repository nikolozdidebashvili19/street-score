# 002 — Open the app shell to all signed-in users

**Phase:** 0 · **Depends on:** 001 · **Status:** done

## Goal
The template only lets `admin` into `(protected)`. StreetPulse customers are regular users.

## Tasks
- [x] `(protected)/layout.tsx`: require a session only (drop the admin check).
- [x] Sidebar nav (`navigation.const.ts`): Explorer `/explorer`, Saved `/locations`, Compare `/compare`.
- [x] Add the new routes to `PROTECTED_ROUTES` and the `proxy.ts` matcher.
- [x] Header shows "Open app" for any signed-in user; login redirects to `/explorer`.
- [x] `/dashboard` redirects to `/explorer`.

## Acceptance criteria
- A fresh credentials user can sign in and reach `/explorer`.
- Signed-out users hitting `/explorer` are redirected to `/sign-in?callbackUrl=/explorer`.
