# O6K-86 — Information integrity network resilience v1 (`V1036_IIRES_*`)

**Branch:** `cursor/o6k-10m-v1036-information-integrity-resilience`  
**Base:** `australia-game-upgrade`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Planned canonical band (integrator renumbers if occupied):

**`SECTION 20CI`**

## Proposed section header

```text
// ============================================================================
// SECTION 20CI: V10.36 INFORMATION INTEGRITY / NATIONAL ATTESTATION MESH RESILIENCE — ATTESTATION MESH STRESS EXPOSURE, FACILITY ZONE NODES & SEGMENT BUFFERS (O6K-86)
// ============================================================================
```

Namespace prefix: **`V1036_IIRES_*`** (wave 6 — national attestation integrity scenarios, backbone-buffer graph, facility-zone nodes, information integrity network resilience scoring).

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
| **20CA** | Sovereign cyber resilience (V1031) — outage / grid-buffer handoff (`adapter-cyber-resilience-20cg.ts`) |
| **20CI** (this shard) | Attestation integrity scenario matrix, backbone-buffer graph, facility-zone nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after upstream v1016–v1023 hooks as landed) |
| 2 | **`runV1036IiresTurn(input)`** — evaluates active attestation integrity scenarios + conservation-offset pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1036IiresSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20AZ** public-services overrides via `applyV1036IiresPublicServices20azServiceOverrides` when public services tick runs |
| 5 | Apply **20BT** digital governance overrides via `applyV1036IiresDigitalGovernance20btDigitalGovernanceOverrides` when digital governance tick runs
| 5b | Apply **20BR** Climate adaptation overrides via `applyV1036IiresClimateAdaptation20brClimateAdaptationOverrides` when Climate adaptation tick runs |
| 6 | Apply **20BA** / **20BC** / **20BF** adapters as in v1018 cross-wire pattern |

Recommended input builder (merge owner implements):

```typescript
buildV1036IiresTurnInputFromGameState(gs, turn): V1036IiresTurnInput
```

Stub for wiring tests: **`buildV1036IiresTurnInputFromGameStateStub(turn, seed)`** in `engine/information-integrity-resilience-orchestrator.ts`.

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
| Root | `save.meta.v1032.information_integrity_resilience` | `V1036IiresPersisted` |
| Policies | `save.meta.v1032.information_integrity_resilience.attestation_snapshots` | Scenario snapshots (`attestationSnapshots`) |
| Segment buffer | `save.meta.v1032.information_integrity_resilience.attestation_mesh_graph` | Graph revision counter |
| Regional | `save.meta.v1032.information_integrity_resilience.regional_facility_zone` | Per-region buffer / reroute / composite information integrity network resilience |
| History | `save.meta.v1032.information_integrity_resilience.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1032.information_integrity_resilience.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1036IiresPersisted(raw, turn)`** alongside other `v1031.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1036IiresPersisted()`**.

Schema: **`V1036_IIRES_SCHEMA_VERSION = '10.30.information_integrity_resilience.1'`**.

Path constants: `persistence/keys.ts` → `V1036_IIRES_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1036InformationIntegrityResilience`** ← `runV1036IiresTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1032_information_integrity_resilience`** |
| Runner | `npx tsx expansion/o6k-10m/v1036-information-integrity-resilience/run-self-tests.ts` |
| Cases | **84** (all pass) |

Regenerate generated modules:

```bash
python3 expansion/o6k-10m/v1036-information-integrity-resilience/scripts/generate.py
```

(172 attestation integrity scenarios × 72 coef rows, 90 arid-buffer shards, 24 facility-zone nodes.)

---

## Module layout

| Path | Role |
|------|------|
| `types/core.ts` | Schema, turn I/O, policy snapshots |
| `engine/information-integrity-resilience-orchestrator.ts` | `runV1036IiresTurn` |
| `engine/information-integrity-resilience-utils.ts` | Clamp, hash, band helpers |
| `generated/attestation-scenarios/` | Per-region extreme_heat/drought/dust evaluate/snapshot modules |
| `generated/attestation-mesh-stacks/` | Segment buffer graph shards |
| `generated/attestation-registry.ts` | Batch evaluation + active-id stride |
| `facility-zone-nodes/` | Species habitat / offset / invasive-pressure nodes |
| `attestation-mesh-stacks/graph-utils.ts` | Graph merge, pressure, hash |
| `adapters/` | 20AZ / 20BR / 20BT / 20BV / 20BC bridges |
| `persistence/` | Keys + migrations |
| `self-tests/` | LAB suite |
