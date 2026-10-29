# O6K-84 — Sovereign cyber network resilience v1 (`V1035_CYRES_*`)

**Branch:** `cursor/o6k-10m-v1035-cyber-resilience`  
**Base:** `australia-game-upgrade`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Planned canonical band (integrator renumbers if occupied):

**`SECTION 20CG`**

## Proposed section header

```text
// ============================================================================
// SECTION 20CG: V10.35 SOVEREIGN CYBER / NATIONAL DIGITAL OPERATIONS RESILIENCE — SOVEREIGN DIGITAL STRESS EXPOSURE, FACILITY ZONE NODES & SEGMENT BUFFERS (O6K-84)
// ============================================================================
```

Namespace prefix: **`V1035_CYRES_*`** (wave 6 — national intrusion incident scenarios, backbone-buffer graph, facility-zone nodes, sovereign cyber network resilience scoring).

Upstream ties:

| Section | Role |
|---------|------|
| **20AZ** | Public services v2 — cooling centers, digital alerting (`adapter-public-services-20az.ts`) |
| **20BR** | Climate adaptation (V1023) — heat pressure, resilience drift (`adapter-climate-adaptation-20br.ts`) |
| **20BV** | Regional health systems (V1026) — hospital surge, bed drift (`adapter-regional-health-systems-20bv.ts`) |
| **20BW** | Water security (V1027) — supply stress under telecom stress (`adapter-water-security-20bw.ts`) |
| **20BX** | Disaster resilience (V1028) — compound hazards, evacuation lag (`adapter-disaster-resilience-20bx.ts`) |
| **20BY** | Coastal resilience (V1029) — surge / sea-level handoff (`adapter-coastal-resilience-20by.ts`) |
| **20BZ** | Inland heat (V1030) — heatwave / arid-buffer handoff (`adapter-inland-heat-20bz.ts`) |
| **20CA** | Critical infrastructure resilience (V1031) — outage / grid-buffer handoff (`adapter-critical-infrastructure-resilience-20ce.ts`) |
| **20CG** (this shard) | Intrusion incident scenario matrix, backbone-buffer graph, facility-zone nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after upstream v1016–v1023 hooks as landed) |
| 2 | **`runV1035CyresTurn(input)`** — evaluates active intrusion incident scenarios + conservation-offset pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1035CyresSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20AZ** public-services overrides via `applyV1035CyresPublicServices20azServiceOverrides` when public services tick runs |
| 5 | Apply **20BT** digital governance overrides via `applyV1035CyresDigitalGovernance20btDigitalGovernanceOverrides` when digital governance tick runs
| 5b | Apply **20BR** Climate adaptation overrides via `applyV1035CyresClimateAdaptation20brClimateAdaptationOverrides` when Climate adaptation tick runs |
| 6 | Apply **20BA** / **20BC** / **20BF** adapters as in v1018 cross-wire pattern |

Recommended input builder (merge owner implements):

```typescript
buildV1035CyresTurnInputFromGameState(gs, turn): V1035CyresTurnInput
```

Stub for wiring tests: **`buildV1035CyresTurnInputFromGameStateStub(turn, seed)`** in `engine/cyber-resilience-orchestrator.ts`.

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
| Root | `save.meta.v1032.cyber_resilience` | `V1035CyresPersisted` |
| Policies | `save.meta.v1032.cyber_resilience.intrusion_snapshots` | Scenario snapshots (`intrusionSnapshots`) |
| Segment buffer | `save.meta.v1032.cyber_resilience.segment_buffer_graph` | Graph revision counter |
| Regional | `save.meta.v1032.cyber_resilience.regional_facility_zone` | Per-region buffer / reroute / composite sovereign cyber network resilience |
| History | `save.meta.v1032.cyber_resilience.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1032.cyber_resilience.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1035CyresPersisted(raw, turn)`** alongside other `v1031.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1035CyresPersisted()`**.

Schema: **`V1035_CYRES_SCHEMA_VERSION = '10.30.cyber_resilience.1'`**.

Path constants: `persistence/keys.ts` → `V1035_CYRES_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1035CyberResilience`** ← `runV1035CyresTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1032_cyber_resilience`** |
| Runner | `npx tsx expansion/o6k-10m/v1035-cyber-resilience/run-self-tests.ts` |
| Cases | **84** (all pass) |

Regenerate generated modules:

```bash
python3 expansion/o6k-10m/v1035-cyber-resilience/scripts/generate.py
```

(172 intrusion incident scenarios × 72 coef rows, 90 arid-buffer shards, 24 facility-zone nodes.)

---

## Module layout

| Path | Role |
|------|------|
| `types/core.ts` | Schema, turn I/O, policy snapshots |
| `engine/cyber-resilience-orchestrator.ts` | `runV1035CyresTurn` |
| `engine/cyber-resilience-utils.ts` | Clamp, hash, band helpers |
| `generated/intrusion-scenarios/` | Per-region extreme_heat/drought/dust evaluate/snapshot modules |
| `generated/segment-buffer-stacks/` | Segment buffer graph shards |
| `generated/intrusion-registry.ts` | Batch evaluation + active-id stride |
| `facility-zone-nodes/` | Species habitat / offset / invasive-pressure nodes |
| `segment-buffer-stacks/graph-utils.ts` | Graph merge, pressure, hash |
| `adapters/` | 20AZ / 20BR / 20BT / 20BV / 20BC bridges |
| `persistence/` | Keys + migrations |
| `self-tests/` | LAB suite |
