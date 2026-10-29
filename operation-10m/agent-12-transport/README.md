# Agent 12 — Transportation & Infrastructure

Roads, rail, ports, and logistics nodes with **measurable productivity effects**:

- Regional `productivityIndexBonus` (additive points)
- `logisticsCostMultiplier` (lower is cheaper freight)
- `freightCapacityIndex` (normalized throughput)
- `travelTimeFactor` (crew / passenger travel friction)

## Layout

| Path | Role |
|------|------|
| `catalog/` | Baseline AU transport assets (roads, rail, ports, logistics) |
| `productivity/` | Deterministic formulas + national aggregation |
| `integration/v94-productivity-bridge.ts` | Maps active V9.4 infra projects → catalog boosts |
| `tests/` | Node test suite |
| `run-self-checks.ts` | Fast CI self-check runner |

## Commands

```bash
npm run test:agent12
npm run selfcheck:agent12
npm run build:agent12-chunk
```

Generated assembly artifact: `operation-10m/modules/agent-12-infrastructure/chunk.tsx` (`OP10M_MODULE_BEGIN agent-12-infrastructure`).

## Scale wave round 7

- Schema **`agent12/8`**: bulk export throughput, intermodal dwell median, urban congestion relief (`congestionReliefPolicy`)
- Catalog: **116** assets, **35** corridors, **53** scenarios
- Systems: `network/bulk-export-throughput-index.ts`, `operations/intermodal-dwell-index.ts`, `productivity/congestion-relief-index.ts`
- Verify: `npm run test:agent12` (**60/60**), `npm run build:agent12-chunk` (**5464** lines)

## Assembly

Agent 25 merges this tree into `(V9.4) australia-game-with-ai.tsx` near **SECTION 20U** / **V10.14** macro productivity inputs. See `INTEGRATION.md`.
