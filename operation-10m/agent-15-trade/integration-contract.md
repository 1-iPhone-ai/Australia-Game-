# Agent 15 — Trade, diplomacy, world economy (Operation 10M)

## Purpose

Deterministic **global trade economy linkage (GTEL)** between:

- Diplomatic deals (especially `resource_trade` and resource-transfer terms)
- National trade network condition / export throughput
- Partner market access bands and commodity export indices
- **Structured trade agreements** (tariff / quota schedules independent of one-off deals)
- **World economy shocks** (embargo, shipping, commodity swings)
- **Commodity shock scenarios** (multi-shock bundles, deduped schedule)
- **Partner sanctions depth** (tiered escalation / de-escalation tied to diplomacy)
- **Domestic consequences** (regional employment / price / stability spillover)
- **Import dependency** (commodity import exposure vs partner access)
- **Diplomatic engagement tracks** (momentum, summit pulse, outreach events)
- **Trade finance** (export credit availability, financing premium, smoothed persist)
- **Market diversification** (partner concentration index, mix memory, spillover stress)

## Merge targets (Agent 25)

| Export | Canonical hook |
|--------|----------------|
| `advanceGlobalTradeEconomyTurn` | Per-turn national systems / macro tick |
| `buildGlobalTradeEconomyInputsFromGameState` | Reducer turn advance |
| `applyGlobalTradeHouseholdOverrides` | Household / GI inputs builder |
| `buildGlobalTradeGi3Notes` | Co-pilot / GI evidence strings |
| `GlobalTradeEconomyPanel` | Trade / economy UI section |
| `runAgent15GlobalTradeLinkageSelfTests` | Master self-test registry |
| `advancePartnerSanctions` / `deriveSanctionModifiers` | Sanctions tier tick |
| `triggerCommodityShockScenario` | Scenario tooling / events |

Persisted schema: `GTELPersisted.schemaVersion === 1`.

## State keys

```ts
gameState.globalTradeEconomy: GTELPersisted
gameState.tradeAgreementLedger?: TradeAgreementLedger  // optional until wired
```

## Dependencies (read-only at runtime)

- `diplomacyState` (deals, events)
- `nationalSystems.national.trade` and regional trade networks
- Optional `actorNames` for player-facing copy

## Tests

```bash
npm run test:agent15
```

Must pass before merge. No PR close/triage by workers.

## Assembly chunk (Agent 25)

```bash
npm run build:agent15-chunk
```

Output: `operation-10m/modules/agent-15-trade/chunk.tsx` (`OP10M_MODULE_BEGIN agent-15-trade` … `OP10M_MODULE_END`).
