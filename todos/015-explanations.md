# 015 — Template-based explanations & verify checklist

**Phase:** 2 · **Depends on:** 013 · **Status:** done

## Tasks
- [x] `features/scoring/service/explanation.service.ts` — from factors only, produce
      `advantages[]`, `risks[]`, `missing[]`, `verifyBeforeLease[]` using templates in
      `src/shared/const/explanations.const.ts`.
- [x] Thresholds (factor ≥ 70 → advantage, ≤ 40 → risk); every sentence cites its factor + source.
- [x] Always include baseline verify items (actual foot traffic, rent terms, permits, visibility).
- [ ] Later, optional: LLM rephrasing behind a flag — it may never change numbers.

## Implementation notes
- English templates only for now; Georgian copy is part of ticket 022.
- LLM rephrasing not implemented (optional, later).
