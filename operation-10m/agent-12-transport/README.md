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

## Scale wave round 11

- Schema **`agent12/12`**: defence logistics readiness, weather-resilience routing, digital freight visibility (`defenceMobilityPolicy`, `weatherResiliencePolicy`, `digitalFreightPolicy`)
- Catalog: **168** assets, **47** corridors, **73** scenarios
- Systems: `network/defence-logistics-readiness-index.ts`, `operations/weather-resilience-routing-index.ts`, `productivity/digital-freight-visibility-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 10

- Schema **`agent12/11`**: deep-sea gateway throughput, infrastructure permitting velocity, electric freight corridor share (`deepSeaGatewayPolicy`, `permittingStreamlinePolicy`, `electricFreightPolicy`)
- Catalog: **155** assets, **44** corridors, **68** scenarios
- Systems: `network/deep-sea-gateway-throughput-index.ts`, `operations/infrastructure-permitting-index.ts`, `productivity/electric-freight-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 9

- Schema **`agent12/10`**: coastal shipping throughput, biosecurity clearance efficiency, autonomous freight share (`coastalShippingPolicy`, `biosecurityStreamlinePolicy`, `autonomousFreightPolicy`)
- Catalog: **142** assets, **41** corridors, **63** scenarios
- Systems: `network/coastal-shipping-throughput-index.ts`, `operations/biosecurity-clearance-index.ts`, `productivity/autonomous-freight-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 8

- Schema **`agent12/9`**: aviation cargo throughput, customs clearance efficiency, hydrogen corridor share (`hydrogenFreightPolicy`, `customsModernizationPolicy`)
- Catalog: **129** assets, **38** corridors, **58** scenarios
- Systems: `network/aviation-cargo-throughput-index.ts`, `operations/customs-clearance-index.ts`, `productivity/hydrogen-freight-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 7

- Schema **`agent12/8`**: bulk export throughput, intermodal dwell median, urban congestion relief (`congestionReliefPolicy`)
- Catalog: **116** assets, **35** corridors, **53** scenarios
- Systems: `network/bulk-export-throughput-index.ts`, `operations/intermodal-dwell-index.ts`, `productivity/congestion-relief-index.ts`
- Verify: `npm run test:agent12` (**60/60**), `npm run build:agent12-chunk` (**5464** lines)

## Assembly

Agent 25 merges this tree into `(V9.4) australia-game-with-ai.tsx` near **SECTION 20U** / **V10.14** macro productivity inputs. See `INTEGRATION.md`.
