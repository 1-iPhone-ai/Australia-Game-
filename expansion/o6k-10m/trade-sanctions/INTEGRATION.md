# T6-6 — Trade, sanctions & capital controls (`V1014_TRADE_DEPTH_*`)

**Branch:** `cursor/o6k-10m-trade-depth`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Remote HEAD anchor (~line **319,482** on `origin/australia-game-upgrade`; re-measure before merge).

## Proposed section header

```text
// ============================================================================
// SECTION 20BA: V10.14 TRADE DEPTH — TARIFFS, SANCTIONS & CAPITAL CONTROLS (T6-6)
// ============================================================================
```

Namespace prefix: **`V1014_TRADE_DEPTH_*`** (domain tag `TRADE_DEPTH` in symbol names).

---

## Turn pipeline hook

Per [tranche-6-expansion-plan.md](/cursor/stores/bc-98acc095-c912-4d9b-8aa4-ef32b9636c29/internal/integration/tranche-6-expansion-plan.md) **T6-6**:

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes |
| 2 | **`runV1014TradeDepthTurn(input)`** — bilateral machines, tariff ladders, sanctions packages, capital/remittance regimes |
| 3 | Apply bridges to GTEL / diplomacy reads (adapters below) |
| 4 | Household demand tick (**20AF**) — use `applyV1014TradeDepthHouseholdOverrides` after `buildHouseholdEconomyInputs` |

Recommended input builder (merge owner implements):

```typescript
buildV1014TradeDepthTurnInputFromGameState(gs, turn): V1014TradeDepthTurnInput
```

---

## Persistence (§6)

| Key | Path | Purpose |
|-----|------|---------|
| Root | `save.meta.v1014.trade_depth` | `V1014TradeDepthPersisted` |
| Bilateral | `save.meta.v1014.trade_depth.bilateral` | Pair phase / trust / tariff snapshots |
| Tariffs | `save.meta.v1014.trade_depth.tariffs` | Partner rung indices |
| Sanctions | `save.meta.v1014.trade_depth.sanctions` | Active package ids |
| Capital | `save.meta.v1014.trade_depth.capital` | Regime states + remittance shocks |
| AI cache | `save.meta.v1014.trade_depth.ai_read_cache` | Diplomatic briefing snippets |

Load/save: call **`sanitizeV1014TradeDepthPersisted(raw, turn)`** alongside other `v1014.*` sanitizers.

Factory: **`createEmptyV1014TradeDepthPersisted()`**.

Schema: **`V1014_TRADE_DEPTH_SCHEMA_VERSION = '10.14.trade_depth.1'`**.

---

## Cross-wire notes (20AT, 20H, 20AB, 20AE, 20AF)

| Section | Adapter module | Symbols | Wiring |
|---------|----------------|---------|--------|
| **20AT** GTEL | `adapters/adapter-20at-gtel.ts` | `applyV1014TradeDepthGtelBridge`, `v1014TradeDepthToGtelPartnerModifier` | After trade depth tick, adjust partner access bands / export throughput fed into `advanceGlobalTradeEconomyTurn` inputs |
| **20H** Diplomacy 2.0 | `adapters/adapter-20h-diplomacy.ts` | `readV1014TradeDepthDiplomacySlice`, `v1014TradeDepthDiplomaticRetaliationHint` | Read-only deal/trust slice for DN evaluators; hints for counter/delay when retaliation window active |
| **20AB** Investment climate | `adapters/adapter-20ab-investment.ts` | `computeV1014TradeDepthInvestmentDelta` | Add `scoreDelta` / `confidenceDelta` into strategic capital allocation climate roll-forward |
| **20AE** Fiscal capacity | `adapters/adapter-20ae-fiscal.ts` | `computeV1014TradeDepthFiscalBridge` | Map tariff/sanctions pressure → revenue drag & expenditure pressure on V10.12 headroom |
| **20AF** Households | `adapters/adapter-20af-household.ts` | `computeV1014TradeDepthHouseholdBridge`, `applyV1014TradeDepthHouseholdOverrides` | Import price shock + remittance income effect on domestic demand before `computeNationalHouseholdEconomy` |

AI personas: `ai/diplomatic-read-adapters.ts` + generated `ai/personas/*` shards → GI3 fact bundle `trade_depth_state` when queries mention trade/sanctions.

---

## LAB suite

Register in the §21B catalog (pattern: `v1014_energy`, `v1014_fiscal`):

```typescript
{
  id: 'v1014_trade_depth',
  label: 'V10.14 Trade depth (T6-6 tariffs/sanctions/capital)',
  tier: 'quick',
  section: 'System Regression',
  severity: 'MAJOR',
  run: () => runV1014TradeDepthSelfTestsForLab(),
}
```

Primary runner: **`runV1014TradeDepthSelfTests()`** — **≥40** deterministic cases (turn hashes, escalation ordering, cross-wire adapters, multi-turn persistence).

Fixture modules under `fixtures/trade-war-fixture-*.ts` support extended LAB scenarios.

---

## Public API (merge minimum)

| Symbol | Role |
|--------|------|
| `runV1014TradeDepthTurn` | Turn engine |
| `createEmptyV1014TradeDepthPersisted` / `sanitizeV1014TradeDepthPersisted` | §6 lifecycle |
| `v1014TradeDepthInputHash` | Determinism / replay |
| `runV1014TradeDepthSelfTests` / `runV1014TradeDepthSelfTestsForLab` | Regression |
| `buildV1014TradeDepthAiBriefing` | AI / ACC read surface |
| Cross-wire adapters (table above) | 20AT / 20H / 20AB / 20AE / 20AF |

Generated shards (bilateral state machines, tariff ladders, sanctions packages, capital regimes, retaliation matrices) are imported by the orchestrator during merge or re-exported as a single SECTION 20BA block.

---

## Merge procedure (Agent 25)

1. Concatenate or transpile `expansion/o6k-10m/trade-sanctions/**/*.ts` into one TSX shard (preserve export names; no duplicate §22 re-exports).
2. Splice before **SECTION 21B** with **SECTION 20BA** header.
3. Wire turn hook after §11A (see pipeline table).
4. Register **`v1014_trade_depth`** LAB entry.
5. Initialize `save.meta.v1014.trade_depth` in default game state factory.
6. Run `npm ci && npm run build` and LAB quick tier.

---

## Layout

```text
expansion/o6k-10m/trade-sanctions/
  INTEGRATION.md
  index.ts
  types/core.ts
  engine/trade-depth-orchestrator.ts
  engine/trade-depth-utils.ts
  engine/retaliation/
  adapters/adapter-20{at,h,ab,ae,af}-*.ts
  ai/
  bilateral-deals/
  tariffs/ladders/
  sanctions/packages/
  capital-controls/regimes/
  fixtures/
  persistence/
  self-tests/run-v1014-trade-depth-self-tests.ts
```

---

## Tranche plan reference

**T6-6** — [tranche-6-expansion-plan.md § T6-6](/cursor/stores/bc-98acc095-c912-4d9b-8aa4-ef32b9636c29/internal/integration/tranche-6-expansion-plan.md): bilateral deal state machines, automatic retaliation, AI diplomatic personas reading trade state; merge order **7** (after fiscal/household stabilizers).
