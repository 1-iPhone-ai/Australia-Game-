# Agent 10 — Finance, inflation & investment (Operation 10M)

Portable TypeScript for **credit conditions**, **reference rates**, **price boundaries** (commodity vs macro CPI), and **financial shocks**. Logic mirrors `(V9.4) australia-game-with-ai.tsx` Section **20AO** (`V1014_FINSTAB_*`).

## Layout

- `src/definitions/` — glossary, types, constants
- `src/credit/` — bands, leverage stress, spread multipliers
- `src/rates/` — policy stance & reference rate curves
- `src/prices/` — resource market helpers & CPI boundary rules
- `src/shocks/` — shock catalog & score impacts
- `src/compute/` — national macro-financial step (pure functions)
- `tests/` — Node test runner via `tsx`

## Tests

From repo root:

```bash
npm run test:agent10
```

## Integration

See [`../INTEGRATION.md`](../INTEGRATION.md).
