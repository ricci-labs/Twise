---
name: domain-rule
description: Add or change a money, invoice, installment, date or period rule in this repo, example first — write the worked example in the domain doc, a failing test from it, the pure implementation, then the docs. Use for any business rule about amounts or dates.
---

# Add a domain rule

Read first: `docs/domain/billing-and-installments.md` for anything with money or dates, and
`docs/domain/glossary.md` before naming anything.

1. **Write the example in the domain doc** with round placeholder amounts, step by step. If the rule
   isn't settled, mark it **Open question:** and ask the user instead of choosing.
2. **Write a failing test from that example** in `packages/shared/src/<area>/<concept>/`, with the same
   numbers. Run it and see it fail for the right reason:
   `pnpm --filter @financas/shared test:watch`.
3. **Implement it as a pure function** in the same folder: no database, no `new Date()`, money as integer
   cents, dates as `IsoDate`. Types go in `<concept>.types.ts`, schemas in `<concept>.schemas.ts`.
4. **Cover the edges:** rounding (the leftover cent has a stated owner), month ends, leap years,
   business days, a zero or the largest allowed value.
5. **Call it from a service.** Routes, the agent and jobs hold no business logic. A test with fixed dates
   calls `freezeDate()` when the rule reads the clock.
6. **Update every doc that states the rule** and bump `updated:`. The doc and the test must show the same
   numbers.
