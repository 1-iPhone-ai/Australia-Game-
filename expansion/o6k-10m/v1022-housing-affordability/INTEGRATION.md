# O6K-49 — Housing affordability v1 (`V1022_HAFF_*`)

**Branch:** `cursor/o6k-10m-v1022-housing-affordability`  
**Base:** `australia-game-upgrade`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Planned canonical band (integrator renumbers if occupied):

**`SECTION 20BQ`**

## Proposed section header

```text
// ============================================================================
// SECTION 20BQ: V10.22 HOUSING AFFORDABILITY — RENT/MORTGAGE STRESS, SUPPLY PIPELINE & ZONING FRICTION (O6K-49)
// ============================================================================
```

Namespace prefix: **`V1022_HAFF_*`** (wave 5 — regional rent/mortgage stress, construction supply pipeline, zoning friction, affordability scoring).

Upstream ties:

| Section | Role |
|---------|------|
| **20BA** | Trade depth — sanctions pressure, import dependency, export lanes (`adapter-v1014-trade-20ba.ts`) |
| **20AZ** | Public services v2 — clinic capacity, digital service coverage (`adapter-public-services-20az.ts`) |
| **20BJ** | Fiscal federalism — transfer backpressure, grant-stack load (`adapter-fiscal-20bj.ts`) |
| **20BB** | Supply chain depth — bottleneck pressure, regional stock days |
| **20BC** | Energy depth — grid stability, reserve margin |
| **20BF** | Workforce migration v2 — readiness & mismatch (commute / essential-worker housing) |
| **20BQ** (this shard) | Stress scenario matrix, supply-pipeline graph, zoning-friction nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after upstream v1016–v1021 hooks as landed) |
| 2 | **`runV1022HaffTurn(input)`** — evaluates active stress scenarios + supply-pipeline pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1022HaffSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20AZ** public-services overrides via `applyV1022HaffPublicServices20azServiceOverrides` when public services tick runs |
| 5 | Apply **20BJ** fiscal overrides via `applyV1022HaffFiscalFederalism20bjZoningOverrides` when fiscal federalism tick runs |
| 6 | Apply **20BA** / **20BC** / **20BF** adapters as in v1018 cross-wire pattern |

Recommended input builder (merge owner implements):

```typescript
buildV1022HaffTurnInputFromGameState(gs, turn): V1022HaffTurnInput
```

Stub for wiring tests: **`buildV1022HaffTurnInputFromGameStateStub(turn, seed)`** in `engine/housing-affordability-orchestrator.ts`.

Suggested field wiring:

- `supply20bb` ← `gs.v1014SupplyChain` / national systems bottleneck aggregates
- `trade20ba` ← `gs.v1014TradeDepth` sanctions + lane stability
- `energy20bc` ← `gs.energyDepth` / grid stability slices
- `workforce20bf` ← `gs.v1014WorkforceV2` readiness & mismatch
- `publicServices20az` ← `gs.v1014PublicServicesV2` / clinic + digital service slices
- `fiscalFederalism20bj` ← `gs.v1018FiscalFederalism` transfer pressure + zoning backlog

---

## Persistence (§6)

| Key | Path | Purpose |
|-----|------|---------|
| Root | `save.meta.v1022.housing_affordability` | `V1022HaffPersisted` |
| Stress | `save.meta.v1022.housing_affordability.stress_snapshots` | Scenario snapshots (`stressSnapshots`) |
| Supply pipeline | `save.meta.v1022.housing_affordability.supply_pipeline_graph` | Graph revision counter |
| Regional | `save.meta.v1022.housing_affordability.regional_zoning_friction` | Per-region buffer / reroute / composite affordability |
| History | `save.meta.v1022.housing_affordability.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1022.housing_affordability.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1022HaffPersisted(raw, turn)`** alongside other `v1022.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1022HaffPersisted()`**.

Schema: **`V1022_HAFF_SCHEMA_VERSION = '10.22.housing_affordability.1'`**.

Path constants: `persistence/keys.ts` → `V1022_HAFF_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1022HousingAffordability`** ← `runV1022HaffTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1022_housing_affordability`** |
| Runner | `npx tsx expansion/o6k-10m/v1022-housing-affordability/run-self-tests.ts` |
| Cases | ≥75 (currently **83**) |

Regenerate generated modules:

```bash
python3 expansion/o6k-10m/v1022-housing-affordability/scripts/generate.py
```

(172 stress scenarios × 72 coef rows, 90 supply-pipeline shards, 24 zoning-friction nodes.)

---

## Module layout

| Path | Role |
|------|------|
| `types/core.ts` | Schema, turn I/O, stress snapshots |
| `engine/housing-affordability-orchestrator.ts` | `runV1022HaffTurn` |
| `engine/housing-affordability-utils.ts` | Clamp, hash, band helpers |
| `generated/stress-scenarios/` | Per-region rent/mortgage evaluate/snapshot modules |
| `generated/supply-pipeline-stacks/` | Supply pipeline graph shards |
| `generated/stress-registry.ts` | Batch evaluation + active-id stride |
| `zoning-friction-nodes/` | Zoning buffer / approval stress nodes |
| `supply-pipeline-stacks/graph-utils.ts` | Graph merge, pressure, hash |
| `adapters/` | 20BA / 20AZ / 20BJ / 20BB / 20BC / 20BF bridges |
| `persistence/` | Keys + migrations |
| `self-tests/` | LAB suite |
