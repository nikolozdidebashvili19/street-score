# 019 — Billing fields, Dodo checkout & webhook

**Phase:** 3 · **Depends on:** 002 · **Status:** todo

## Tasks
- [ ] User schema: `plan`, `dodoCustomerId`, `dodoSubscriptionId`, `subscriptionStatus`, `reportCredits`, `currentPeriodEnd`.
- [ ] `src/shared/lib/dodo.ts` client singleton (+ spec); env: `DODO_API_KEY`, `DODO_WEBHOOK_SECRET`,
      `DODO_PRODUCT_REPORT`, `DODO_PRODUCT_PRO`.
- [ ] `POST /api/billing/checkout` `{ product: 'report' | 'pro' }` → hosted checkout URL.
- [ ] `POST /api/webhooks/dodo` — verify signature, idempotent handling, update plan/credits.
- [ ] Pricing page (USD with approximate ₾ if GEL is unsupported).
- [ ] Before launch: verify GEL support, payout fees to a Georgian bank, test mode.
