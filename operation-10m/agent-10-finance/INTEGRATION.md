# Agent 10 — Integration (Operation 10M)

## Upstream reads (authoritative elsewhere)

| System | Agent | This module reads |
|--------|-------|-------------------|
| Investment climate | 08 / V10.9 | Bands via `investment/climate-link.ts` |
| Public finance | 07 / V10.12 | `fiscalPressure`, debt, sustainability inputs |
| Household economy | 09 / V10.13 | Affordability, regional housing pressure |
| Systemic liquidity | 06 / V10.6 | `systemicLiquidityBand` |

## Downstream consumers (metadata only)

- Loan spread multipliers → advanced loan UI / AI narration
- Cost-of-living multiplier → travel/economy presentation layers
- **Never** writes `gameState.resourcePrices` (commodity board)

## Assembly

- Chunk: `operation-10m/modules/agent-10-finance/chunk.tsx`
- Regenerate: `npm run build:agent10-chunk`
- Self-test entry: `runAgent10FinanceSelfTests()`

## Persist key (proposed for Agent 25)

`macroFinancialPersisted` / `nationalMacroFinancialState` — align with V9.4 Section 20AO field names on merge.
