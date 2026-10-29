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

## Scale wave round 17

- Schema **`agent12/18`**: subsea cable landing throughput, green ammonia export readiness, airport express rail share (`subseaCableLandingPolicy`, `greenAmmoniaExportPolicy`, `airportExpressRailPolicy`)
- Catalog: **247** assets, **65** corridors, **103** scenarios
- Systems: `network/subsea-cable-landing-index.ts`, `operations/green-ammonia-export-index.ts`, `productivity/airport-express-rail-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 16

- Schema **`agent12/17`**: offshore wind logistics throughput, battery supply chain readiness, cruise turnaround share (`offshoreWindLogisticsPolicy`, `batterySupplyChainPolicy`, `cruiseTurnaroundPolicy`)
- Catalog: **234** assets, **62** corridors, **98** scenarios
- Systems: `network/offshore-wind-logistics-index.ts`, `operations/battery-supply-chain-index.ts`, `productivity/cruise-turnaround-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 15

- Schema **`agent12/16`**: Pacific feeder tradelane throughput, medical supply chain readiness, data-centre logistics share (`pacificFeederPolicy`, `medicalSupplyPolicy`, `dataCentreLogisticsPolicy`)
- Catalog: **221** assets, **59** corridors, **93** scenarios
- Systems: `network/pacific-feeder-tradelane-index.ts`, `operations/medical-supply-chain-index.ts`, `productivity/data-centre-logistics-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 14

- Schema **`agent12/15`**: agricultural export throughput, track possession efficiency, green bunkering share (`agriculturalExportPolicy`, `trackPossessionPolicy`, `greenBunkeringPolicy`)
- Catalog: **208** assets, **56** corridors, **88** scenarios
- Systems: `network/agricultural-export-throughput-index.ts`, `operations/track-possession-efficiency-index.ts`, `productivity/green-bunkering-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 13

- Schema **`agent12/14`**: gauge interoperability, disaster recovery staging, circular freight share (`gaugeInteroperabilityPolicy`, `disasterRecoveryStagingPolicy`, `circularFreightPolicy`)
- Catalog: **194** assets, **53** corridors, **83** scenarios
- Systems: `network/gauge-interoperability-index.ts`, `operations/disaster-recovery-staging-index.ts`, `productivity/circular-freight-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

## Scale wave round 12

- Schema **`agent12/13`**: critical-minerals export throughput, channel maintenance readiness, indigenous remote supply share (`criticalMineralsPolicy`, `channelMaintenancePolicy`, `indigenousRemoteSupplyPolicy`)
- Catalog: **181** assets, **50** corridors, **78** scenarios
- Systems: `network/critical-minerals-export-index.ts`, `operations/channel-maintenance-index.ts`, `productivity/indigenous-remote-supply-index.ts`
- Verify: `npm run test:agent12`, `npm run build:agent12-chunk`

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
