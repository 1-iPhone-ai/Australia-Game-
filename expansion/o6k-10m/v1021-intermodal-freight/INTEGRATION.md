# O6K-45 — Intermodal freight v1 (`V1021_IMFD_*`)

**Branch:** `cursor/o6k-10m-v1021-intermodal-freight`  
**Base:** `australia-game-upgrade`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Planned canonical band (integrator renumbers if occupied):

**`SECTION 20BO`**

## Proposed section header

```text
// ============================================================================
// SECTION 20BO: V10.21 INTERMODAL FREIGHT — CORRIDORS, HANDOFF STACKS & DWELL HUBS (O6K-45)
// ============================================================================
```

Namespace prefix: **`V1021_IMFD_*`** (wave 5 — national intermodal corridors, rail/port/air handoffs, dwell penalties, corridor capacity).

Upstream ties:

| Section | Role |
|---------|------|
| **20BA** | Trade depth — sanctions pressure, import dependency, export lanes (`adapter-v1014-trade-20ba.ts`) |
| **20BN** | Maritime trade (v1019) — berth utilization, port handoff readiness (`adapter-maritime-20bn.ts`) |
| **20BK** | Intercity logistics (v1017) — corridor backpressure, dwell backlog (`adapter-iclog-20bk.ts`) |
| **20BB** | Supply chain depth — bottleneck pressure, regional stock days |
| **20BC** | Energy depth — grid stability, reserve margin |
| **20BF** | Workforce migration v2 — readiness & mismatch |
| **20BO** (this shard) | Corridor scenario matrix, handoff-stack graph, dwell-hub nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after upstream v1016–v1020 hooks as landed) |
| 2 | **`runV1021ImfdTurn(input)`** — evaluates active corridor scenarios + handoff-stack pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1021ImfdSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20BN** maritime overrides via `applyV1021ImfdMaritime20bnHandoffOverrides` when maritime tick runs |
| 5 | Apply **20BK** iclog overrides via `applyV1021ImfdIclog20bkLabTransferOverrides` when intercity logistics tick runs |
| 6 | Apply **20BA** / **20BC** / **20BF** adapters as in v1018 cross-wire pattern |

Recommended input builder (merge owner implements):

```typescript
buildV1021ImfdTurnInputFromGameState(gs, turn): V1021ImfdTurnInput
```

Stub for wiring tests: **`buildV1021ImfdTurnInputFromGameStateStub(turn, seed)`** in `engine/intermodal-freight-orchestrator.ts`.

Suggested field wiring:

- `supply20bb` ← `gs.v1014SupplyChain` / national systems bottleneck aggregates
- `trade20ba` ← `gs.v1014TradeDepth` sanctions + lane stability
- `energy20bc` ← `gs.energyDepth` / grid stability slices
- `workforce20bf` ← `gs.v1014WorkforceV2` readiness & mismatch
- `maritime20bn` ← `gs.v1019MaritimeTrade` / port berth + crane automation slices
- `iclog20bk` ← `gs.v1017IntercityLogistics` corridor load + dwell backlog

---

## Persistence (§6)

| Key | Path | Purpose |
|-----|------|---------|
| Root | `save.meta.v1021.intermodal_freight` | `V1021ImfdPersisted` |
| Corridors | `save.meta.v1021.intermodal_freight.corridor_snapshots` | Scenario snapshots (`corridorSnapshots`) |
| Handoff stacks | `save.meta.v1021.intermodal_freight.handoff_stack_graph` | Graph revision counter |
| Regional | `save.meta.v1021.intermodal_freight.regional_dwell_hub` | Per-region buffer / reroute / composite capacity |
| History | `save.meta.v1021.intermodal_freight.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1021.intermodal_freight.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1021ImfdPersisted(raw, turn)`** alongside other `v1021.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1021ImfdPersisted()`**.

Schema: **`V1021_IMFD_SCHEMA_VERSION = '10.21.intermodal_freight.1'`**.

Path constants: `persistence/keys.ts` → `V1021_IMFD_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1021IntermodalFreight`** ← `runV1021ImfdTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1021_intermodal_freight`** |
| Runner | `npx tsx expansion/o6k-10m/v1021-intermodal-freight/run-self-tests.ts` |
| Cases | ≥75 (currently **83**) |

Regenerate generated modules:

```bash
python3 expansion/o6k-10m/v1021-intermodal-freight/scripts/generate.py
```

(172 corridor scenarios × 72 coef rows, 90 handoff-stack shards, 24 dwell-hub nodes.)

---

## Module layout

| Path | Role |
|------|------|
| `types/core.ts` | Schema, turn I/O, corridor snapshots |
| `engine/intermodal-freight-orchestrator.ts` | `runV1021ImfdTurn` |
| `engine/intermodal-freight-utils.ts` | Clamp, hash, band helpers |
| `generated/corridor-scenarios/` | Per-corridor evaluate/snapshot modules |
| `generated/handoff-stacks/` | Handoff graph shards |
| `generated/corridor-registry.ts` | Batch evaluation + active-id stride |
| `dwell-hubs/` | Dwell buffer / reroute stress nodes |
| `handoff-stacks/graph-utils.ts` | Graph merge, pressure, hash |
| `adapters/` | 20BA / 20BN / 20BK / 20BB / 20BC / 20BF bridges |
| `persistence/` | Keys + migrations |
| `self-tests/` | LAB suite |
