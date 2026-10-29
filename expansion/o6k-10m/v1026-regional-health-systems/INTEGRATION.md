# O6K-59 — Regional health systems v1 (`V1026_RHS_*`)

**Branch:** `cursor/o6k-10m-v1026-regional-health-systems`  
**Base:** `australia-game-upgrade`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Planned canonical band (integrator renumbers if occupied):

**`SECTION 20BV`**

## Proposed section header

```text
// ============================================================================
// SECTION 20BV: V10.26 REGIONAL HEALTH SYSTEMS — CAPACITY STRESS, HOSPITAL NETWORKS & PRIMARY CARE ACCESS (O6K-59)
// ============================================================================
```

Namespace prefix: **`V1026_RHS_*`** (wave 5 — national care scenarios, conservation-offset graph, hospital-network nodes, stewardship scoring).

Upstream ties:

| Section | Role |
|---------|------|
| **20AZ** | Public services v2 — clinic capacity, digital service coverage (`adapter-public-services-20az.ts`) |

| **20BT** | Digital governance (V1024) — model governance pressure, alignment drift (`adapter-digital-governance-20bt.ts`) |
| **20BR** | Climate adaptation (V1023) — heat stress pressure, resilience drift (`adapter-climate-adaptation-20br.ts`) |
| **20BA** | Trade depth — sanctions pressure, import dependency, export lanes (`adapter-v1014-trade-20ba.ts`) |
| **20BB** | Supply chain depth — bottleneck pressure, regional stock days |
| **20BC** | Energy depth — grid stability, reserve margin, grid clinical load (`adapter-v1014-energy-20bc.ts`) |
| **20BF** | Workforce migration v2 — readiness & mismatch (clinical & allied health staffing) |
| **20BU** (this shard) | Care scenario matrix, conservation-offset graph, hospital-network nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after upstream v1016–v1023 hooks as landed) |
| 2 | **`runV1026RhsTurn(input)`** — evaluates active care scenarios + conservation-offset pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1026RhsSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20AZ** public-services overrides via `applyV1026RhsPublicServices20azServiceOverrides` when public services tick runs |
| 5 | Apply **20BT** digital governance overrides via `applyV1026RhsDigitalGovernance20btDigitalGovernanceOverrides` when digital governance tick runs
| 5b | Apply **20BR** Climate adaptation overrides via `applyV1026RhsClimateAdaptation20brClimateAdaptationOverrides` when Climate adaptation tick runs |
| 6 | Apply **20BA** / **20BC** / **20BF** adapters as in v1018 cross-wire pattern |

Recommended input builder (merge owner implements):

```typescript
buildV1026RhsTurnInputFromGameState(gs, turn): V1026RhsTurnInput
```

Stub for wiring tests: **`buildV1026RhsTurnInputFromGameStateStub(turn, seed)`** in `engine/regional-health-systems-orchestrator.ts`.

Suggested field wiring:

- `supply20bb` ← `gs.v1014SupplyChain` / national systems bottleneck aggregates
- `trade20ba` ← `gs.v1014TradeDepth` sanctions + lane stability
- `energy20bc` ← `gs.energyDepth` / grid stability slices
- `workforce20bf` ← `gs.v1014WorkforceV2` readiness & mismatch
- `publicServices20az` ← `gs.v1014PublicServicesV2` / clinic + digital service slices
- `climateAdaptation20br` ← `gs.v1023ClimateAdaptation` / hazard resilience + drought-buffer slices
- `digitalGovernance20bt` ← `gs.v1024DigitalGovernance` / compliance + audit drift slices

---

## Persistence (§6)

| Key | Path | Purpose |
|-----|------|---------|
| Root | `save.meta.v1026.regional_health_systems` | `V1026RhsPersisted` |
| Policies | `save.meta.v1026.regional_health_systems.care_snapshots` | Scenario snapshots (`careSnapshots`) |
| Primary care access | `save.meta.v1026.regional_health_systems.primary_care_access_graph` | Graph revision counter |
| Regional | `save.meta.v1026.regional_health_systems.regional_hospital_network` | Per-region buffer / reroute / composite health system |
| History | `save.meta.v1026.regional_health_systems.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1026.regional_health_systems.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1026RhsPersisted(raw, turn)`** alongside other `v1026.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1026RhsPersisted()`**.

Schema: **`V1026_RHS_SCHEMA_VERSION = '10.25.regional_health_systems.1'`**.

Path constants: `persistence/keys.ts` → `V1026_RHS_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1026RhsdiversityStewardship`** ← `runV1026RhsTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1026_regional_health_systems`** |
| Runner | `npx tsx expansion/o6k-10m/v1026-regional-health-systems/run-self-tests.ts` |
| Cases | ≥75 (currently **83**) |

Regenerate generated modules:

```bash
python3 expansion/o6k-10m/v1026-regional-health-systems/scripts/generate.py
```

(172 care scenarios × 72 coef rows, 90 conservation-offset shards, 24 hospital-network nodes.)

---

## Module layout

| Path | Role |
|------|------|
| `types/core.ts` | Schema, turn I/O, policy snapshots |
| `engine/regional-health-systems-orchestrator.ts` | `runV1026RhsTurn` |
| `engine/regional-health-systems-utils.ts` | Clamp, hash, band helpers |
| `generated/care-scenarios/` | Per-region clinical/bed/primary-care evaluate/snapshot modules |
| `generated/primary-care-access-stacks/` | Primary care access graph shards |
| `generated/care-registry.ts` | Batch evaluation + active-id stride |
| `hospital-network-nodes/` | Species habitat / offset / invasive-pressure nodes |
| `primary-care-access-stacks/graph-utils.ts` | Graph merge, pressure, hash |
| `adapters/` | 20AZ / 20BR / 20BT / 20BA / 20BB / 20BC / 20BF bridges |
| `persistence/` | Keys + migrations |
| `self-tests/` | LAB suite |
