# O6K-88 — Provenance chain network resilience v1 (`V1037_PCRS_*`)

**Branch:** `cursor/o6k-10m-v1037-provenance-chain-resilience`  
**Base:** `australia-game-upgrade`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Planned canonical band (integrator renumbers if occupied):

**`SECTION 20CK`**

## Proposed section header

```text
// ============================================================================
// SECTION 20CK: V10.37 PUBLIC RECORDS PROVENANCE / CHAIN-OF-CUSTODY RESILIENCE — CUSTODY CHAIN STRESS EXPOSURE, FACILITY ZONE NODES & SEGMENT BUFFERS (O6K-88)
// ============================================================================
```

Namespace prefix: **`V1037_PCRS_*`** (wave 6 — national chain-of-custody incident scenarios, backbone-buffer graph, facility-zone nodes, provenance chain network resilience scoring).

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
| **20CA** | Information integrity resilience (V1031) — outage / grid-buffer handoff (`adapter-information-integrity-resilience-20ci.ts`) |
| **20CK** (this shard) | Chain-of-custody incident scenario matrix, backbone-buffer graph, facility-zone nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after upstream v1016–v1023 hooks as landed) |
| 2 | **`runV1037PcresTurn(input)`** — evaluates active chain-of-custody incident scenarios + conservation-offset pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1037PcresSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20AZ** public-services overrides via `applyV1037PcresPublicServices20azServiceOverrides` when public services tick runs |
| 5 | Apply **20BT** digital governance overrides via `applyV1037PcresDigitalGovernance20btDigitalGovernanceOverrides` when digital governance tick runs
| 5b | Apply **20BR** Climate adaptation overrides via `applyV1037PcresClimateAdaptation20brClimateAdaptationOverrides` when Climate adaptation tick runs |
| 6 | Apply **20BA** / **20BC** / **20BF** adapters as in v1018 cross-wire pattern |

Recommended input builder (merge owner implements):

```typescript
buildV1037PcresTurnInputFromGameState(gs, turn): V1037PcresTurnInput
```

Stub for wiring tests: **`buildV1037PcresTurnInputFromGameStateStub(turn, seed)`** in `engine/provenance-chain-resilience-orchestrator.ts`.

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
| Root | `save.meta.v1032.provenance_chain_resilience` | `V1037PcresPersisted` |
| Policies | `save.meta.v1032.provenance_chain_resilience.custody_snapshots` | Scenario snapshots (`custodySnapshots`) |
| Segment buffer | `save.meta.v1032.provenance_chain_resilience.custody_chain_mesh_graph` | Graph revision counter |
| Regional | `save.meta.v1032.provenance_chain_resilience.regional_facility_zone` | Per-region buffer / reroute / composite provenance chain network resilience |
| History | `save.meta.v1032.provenance_chain_resilience.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1032.provenance_chain_resilience.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1037PcresPersisted(raw, turn)`** alongside other `v1031.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1037PcresPersisted()`**.

Schema: **`V1037_PCRS_SCHEMA_VERSION = '10.30.provenance_chain_resilience.1'`**.

Path constants: `persistence/keys.ts` → `V1037_PCRS_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1037ProvenanceChainResilience`** ← `runV1037PcresTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1032_provenance_chain_resilience`** |
| Runner | `npx tsx expansion/o6k-10m/v1037-provenance-chain-resilience/run-self-tests.ts` |
| Cases | **84** (all pass) |

Regenerate generated modules:

```bash
python3 expansion/o6k-10m/v1037-provenance-chain-resilience/scripts/generate.py
```

(172 chain-of-custody incident scenarios × 72 coef rows, 90 arid-buffer shards, 24 facility-zone nodes.)

---

## Module layout

| Path | Role |
|------|------|
| `types/core.ts` | Schema, turn I/O, policy snapshots |
| `engine/provenance-chain-resilience-orchestrator.ts` | `runV1037PcresTurn` |
| `engine/provenance-chain-resilience-utils.ts` | Clamp, hash, band helpers |
| `generated/custody-scenarios/` | Per-region extreme_heat/drought/dust evaluate/snapshot modules |
| `generated/custody-chain-mesh-stacks/` | Segment buffer graph shards |
| `generated/custody-registry.ts` | Batch evaluation + active-id stride |
| `facility-zone-nodes/` | Species habitat / offset / invasive-pressure nodes |
| `custody-chain-mesh-stacks/graph-utils.ts` | Graph merge, pressure, hash |
| `adapters/` | 20AZ / 20BR / 20BT / 20BV / 20BC bridges |
| `persistence/` | Keys + migrations |
| `self-tests/` | LAB suite |
