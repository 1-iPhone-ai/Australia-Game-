# O6K-66 — Inland heat adaptation v1 (`V1030_IHEAT_*`)

**Branch:** `cursor/o6k-10m-v1030-inland-heat`  
**Base:** `australia-game-upgrade`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Planned canonical band (integrator renumbers if occupied):

**`SECTION 20BZ`**

## Proposed section header

```text
// ============================================================================
// SECTION 20BZ: V10.30 INLAND HEAT / ARID ADAPTATION — INLAND HEAT EXPOSURE, INLAND ZONE NODES & ARID BUFFERS (O6K-66)
// ============================================================================
```

Namespace prefix: **`V1030_IHEAT_*`** (wave 6 — national heatwave scenarios, arid-buffer graph, inland-zone nodes, inland heat adaptation scoring).

Upstream ties:

| Section | Role |
|---------|------|
| **20AZ** | Public services v2 — cooling centers, digital alerting (`adapter-public-services-20az.ts`) |
| **20BR** | Climate adaptation (V1023) — heat pressure, resilience drift (`adapter-climate-adaptation-20br.ts`) |
| **20BV** | Regional health systems (V1026) — hospital surge, bed drift (`adapter-regional-health-systems-20bv.ts`) |
| **20BW** | Water security (V1027) — supply stress under arid stress (`adapter-water-security-20bw.ts`) |
| **20BX** | Disaster resilience (V1028) — compound hazards, evacuation lag (`adapter-disaster-resilience-20bx.ts`) |
| **20BY** | Coastal resilience (V1029) — surge / sea-level handoff (`adapter-coastal-resilience-20by.ts`) |
| **20BZ** (this shard) | Heatwave scenario matrix, arid-buffer graph, inland-zone nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after upstream v1016–v1023 hooks as landed) |
| 2 | **`runV1030IheatTurn(input)`** — evaluates active heatwave scenarios + conservation-offset pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1030IheatSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20AZ** public-services overrides via `applyV1030IheatPublicServices20azServiceOverrides` when public services tick runs |
| 5 | Apply **20BT** digital governance overrides via `applyV1030IheatDigitalGovernance20btDigitalGovernanceOverrides` when digital governance tick runs
| 5b | Apply **20BR** Climate adaptation overrides via `applyV1030IheatClimateAdaptation20brClimateAdaptationOverrides` when Climate adaptation tick runs |
| 6 | Apply **20BA** / **20BC** / **20BF** adapters as in v1018 cross-wire pattern |

Recommended input builder (merge owner implements):

```typescript
buildV1030IheatTurnInputFromGameState(gs, turn): V1030IheatTurnInput
```

Stub for wiring tests: **`buildV1030IheatTurnInputFromGameStateStub(turn, seed)`** in `engine/inland-heat-orchestrator.ts`.

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
| Root | `save.meta.v1030.inland_heat` | `V1030IheatPersisted` |
| Policies | `save.meta.v1030.inland_heat.heatwave_snapshots` | Scenario snapshots (`heatwaveSnapshots`) |
| Arid buffer | `save.meta.v1030.inland_heat.arid_buffer_graph` | Graph revision counter |
| Regional | `save.meta.v1030.inland_heat.regional_inland_zone` | Per-region buffer / reroute / composite inland heat adaptation |
| History | `save.meta.v1030.inland_heat.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1030.inland_heat.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1030IheatPersisted(raw, turn)`** alongside other `v1030.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1030IheatPersisted()`**.

Schema: **`V1030_IHEAT_SCHEMA_VERSION = '10.30.inland_heat.1'`**.

Path constants: `persistence/keys.ts` → `V1030_IHEAT_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1030IheatdiversityStewardship`** ← `runV1030IheatTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1030_inland_heat`** |
| Runner | `npx tsx expansion/o6k-10m/v1030-inland-heat/run-self-tests.ts` |
| Cases | **84** (all pass) |

Regenerate generated modules:

```bash
python3 expansion/o6k-10m/v1030-inland-heat/scripts/generate.py
```

(172 heatwave scenarios × 72 coef rows, 90 arid-buffer shards, 24 inland-zone nodes.)

---

## Module layout

| Path | Role |
|------|------|
| `types/core.ts` | Schema, turn I/O, policy snapshots |
| `engine/inland-heat-orchestrator.ts` | `runV1030IheatTurn` |
| `engine/inland-heat-utils.ts` | Clamp, hash, band helpers |
| `generated/heatwave-scenarios/` | Per-region extreme_heat/drought/dust evaluate/snapshot modules |
| `generated/arid-buffer-stacks/` | Arid buffer graph shards |
| `generated/heatwave-registry.ts` | Batch evaluation + active-id stride |
| `inland-zone-nodes/` | Species habitat / offset / invasive-pressure nodes |
| `arid-buffer-stacks/graph-utils.ts` | Graph merge, pressure, hash |
| `adapters/` | 20AZ / 20BR / 20BT / 20BV / 20BC bridges |
| `persistence/` | Keys + migrations |
| `self-tests/` | LAB suite |
