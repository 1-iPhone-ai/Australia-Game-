# O6K-41 — Maritime trade v1 (`V1019_MTRD_*`)

**Branch:** `cursor/o6k-10m-v1019-maritime-trade`  
**Base:** `australia-game-upgrade` @ `e666aed`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Canonical occupancy through **20BL** (V1018 fiscal federalism / wave-4 depth) on `australia-game-upgrade` @ `e666aed`. Target band for this shard:

**`SECTION 20BM`**

If **20BM** is occupied at merge, renumber to the next free band (likely **20BN**) and update this doc.

## Proposed section header

```text
// ============================================================================
// SECTION 20BM: V10.19 MARITIME TRADE — SHIPPING LANES, PORT GRAPH & ENERGY COUPLING (O6K-41)
// ============================================================================
```

Namespace prefix: **`V1019_MTRD_*`** (wave 5 domain tier — maritime lanes, port throughput, trade–energy coupling).

Upstream ties (V1014 cross-wire):

| Section | Role |
|---------|------|
| **20BA** | V1014 trade depth — sanctions pressure, import dependency, export lane stability |
| **20BC** | V1014 energy depth — grid stability, reserve margin, carbon stress into bunkering |
| **20BM** (this shard) | Shipping-lane scenario matrix, lane-graph coupling, maritime port nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after V1018 / V1017 hooks as landed) |
| 2 | **`runV1019MtrdTurn(input)`** — evaluates active shipping-lane scenarios + lane-graph pressure |
| 3 | Apply **20BA** lane overrides via `applyV1019MtrdTrade20baLaneOverrides` before trade tick |
| 4 | Apply **20BC** grid overrides via `applyV1019MtrdEnergy20bcGridOverrides` before energy depth tick |

Recommended input builder (merge owner implements):

```typescript
buildV1019MtrdTurnInputFromGameState(gs, turn): V1019MtrdTurnInput
```

Stub for wiring tests: **`buildV1019MtrdTurnInputFromGameStateStub(turn, seed)`** in `engine/maritime-trade-orchestrator.ts`.

Suggested field wiring:

- `trade20ba` ← `gs.v1014TradeDepth` sanctions + lane stability
- `energy20bc` ← `gs.v1014EnergyDepth` grid + reserve + carbon stress

---

## Persistence (§6)

| Key | Path | Purpose |
|-----|------|---------|
| Root | `save.meta.v1019.maritime_trade` | `V1019MtrdPersisted` |
| Lanes | `save.meta.v1019.maritime_trade.shipping_lanes` | Scenario snapshots (`laneSnapshots`) |
| Graph | `save.meta.v1019.maritime_trade.lane_graph` | Graph revision counter |
| Regional | `save.meta.v1019.maritime_trade.regional_port` | Per-region buffer / reroute / composite port |
| History | `save.meta.v1019.maritime_trade.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1019.maritime_trade.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1019MtrdPersisted(raw, turn)`** alongside other `v1019.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1019MtrdPersisted()`**.

Schema: **`V1019_MTRD_SCHEMA_VERSION = '10.19.maritime_trade.1'`**.

Path constants: `persistence/keys.ts` → `V1019_MTRD_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1019MaritimeTrade`** ← `runV1019MtrdTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1019_maritime_trade`** |
| Entry | `runV1019MtrdSelfTests()` |
| CLI | `npx tsx expansion/o6k-10m/v1019-maritime-trade/run-self-tests.ts` |
| Minimum cases | ≥55 deterministic checks (turn fixtures, adapters, persistence, catalog sweep) |

---

## Module layout

```text
expansion/o6k-10m/v1019-maritime-trade/
  types/core.ts
  engine/maritime-trade-orchestrator.ts
  engine/maritime-trade-utils.ts
  adapters/adapter-v1014-{trade,energy}-20*.ts
  adapters/adapter-crosswire-hub.ts
  persistence/{keys,migrations}.ts
  lane-graph/graph-utils.ts
  maritime-ports/port-*.ts
  generated/shipping-lane-scenarios/lane-*.ts
  generated/lane-graph/lane-*.ts
  generated/shipping-lane-registry.ts
  generated/lane-graph-bundle.ts
  self-tests/run-v1019-mtrd-self-tests.ts
  scripts/generate.py
```

Regenerate bulk catalogs: `python3 expansion/o6k-10m/v1019-maritime-trade/scripts/generate.py`.

---

## Merge checklist (Agent 25)

1. Confirm **20BM** still free against HEAD (if taken, use **20BN** and update this doc).
2. Splice before **SECTION 21B** with **SECTION 20BM** header.
3. Wire turn hook after §11A and §6 sanitizer for `save.meta.v1019.maritime_trade`.
4. Register LAB suite **`v1019_maritime_trade`** beside other O6K wave-5 suites.
