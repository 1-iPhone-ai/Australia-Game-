# O6K-56 — Biodiversity stewardship v1 (`V1025_BIO_*`)

**Branch:** `cursor/o6k-10m-v1025-biodiversity-stewardship`  
**Base:** `australia-game-upgrade`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Planned canonical band (integrator renumbers if occupied):

**`SECTION 20BU`**

## Proposed section header

```text
// ============================================================================
// SECTION 20BU: V10.25 BIODIVERSITY STEWARDSHIP — ECOSYSTEM STRESS, PROTECTED AREAS & CONSERVATION OFFSETS (O6K-56)
// ============================================================================
```

Namespace prefix: **`V1025_BIO_*`** (wave 5 — national recovery scenarios, conservation-offset graph, protected-area nodes, stewardship scoring).

Upstream ties:

| Section | Role |
|---------|------|
| **20AZ** | Public services v2 — clinic capacity, digital service coverage (`adapter-public-services-20az.ts`) |
| **20BR** | Climate adaptation (V1023) — heat stress pressure, resilience drift (`adapter-climate-adaptation-20br.ts`) |
| **20BA** | Trade depth — sanctions pressure, import dependency, export lanes (`adapter-v1014-trade-20ba.ts`) |
| **20BB** | Supply chain depth — bottleneck pressure, regional stock days |
| **20BC** | Energy depth — grid stability, reserve margin, grid habitat load (`adapter-v1014-energy-20bc.ts`) |
| **20BF** | Workforce migration v2 — readiness & mismatch (park ranger & field staffing) |
| **20BU** (this shard) | Recovery scenario matrix, conservation-offset graph, protected-area nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after upstream v1016–v1023 hooks as landed) |
| 2 | **`runV1025BioTurn(input)`** — evaluates active recovery scenarios + conservation-offset pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1025BioSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20AZ** public-services overrides via `applyV1025BioPublicServices20azServiceOverrides` when public services tick runs |
| 5 | Apply **20BR** Climate adaptation overrides via `applyV1025BioClimateAdaptation20brClimateAdaptationOverrides` when Climate adaptation tick runs |
| 6 | Apply **20BA** / **20BC** / **20BF** adapters as in v1018 cross-wire pattern |

Recommended input builder (merge owner implements):

```typescript
buildV1025BioTurnInputFromGameState(gs, turn): V1025BioTurnInput
```

Stub for wiring tests: **`buildV1025BioTurnInputFromGameStateStub(turn, seed)`** in `engine/biodiversity-stewardship-orchestrator.ts`.

Suggested field wiring:

- `supply20bb` ← `gs.v1014SupplyChain` / national systems bottleneck aggregates
- `trade20ba` ← `gs.v1014TradeDepth` sanctions + lane stability
- `energy20bc` ← `gs.energyDepth` / grid stability slices
- `workforce20bf` ← `gs.v1014WorkforceV2` readiness & mismatch
- `publicServices20az` ← `gs.v1014PublicServicesV2` / clinic + digital service slices
- `climateAdaptation20br` ← `gs.v1023ClimateAdaptation` / hazard resilience + drought-buffer slices

---

## Persistence (§6)

| Key | Path | Purpose |
|-----|------|---------|
| Root | `save.meta.v1025.biodiversity_stewardship` | `V1025BioPersisted` |
| Policies | `save.meta.v1025.biodiversity_stewardship.recovery_snapshots` | Scenario snapshots (`recoverySnapshots`) |
| Conservation offset | `save.meta.v1025.biodiversity_stewardship.conservation_offset_graph` | Graph revision counter |
| Regional | `save.meta.v1025.biodiversity_stewardship.regional_protected_area` | Per-region buffer / reroute / composite stewardship |
| History | `save.meta.v1025.biodiversity_stewardship.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1025.biodiversity_stewardship.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1025BioPersisted(raw, turn)`** alongside other `v1025.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1025BioPersisted()`**.

Schema: **`V1025_BIO_SCHEMA_VERSION = '10.25.biodiversity_stewardship.1'`**.

Path constants: `persistence/keys.ts` → `V1025_BIO_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1025BiodiversityStewardship`** ← `runV1025BioTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1025_biodiversity_stewardship`** |
| Runner | `npx tsx expansion/o6k-10m/v1025-biodiversity-stewardship/run-self-tests.ts` |
| Cases | ≥75 (currently **83**) |

Regenerate generated modules:

```bash
python3 expansion/o6k-10m/v1025-biodiversity-stewardship/scripts/generate.py
```

(172 recovery scenarios × 72 coef rows, 90 conservation-offset shards, 24 protected-area nodes.)

---

## Module layout

| Path | Role |
|------|------|
| `types/core.ts` | Schema, turn I/O, policy snapshots |
| `engine/biodiversity-stewardship-orchestrator.ts` | `runV1025BioTurn` |
| `engine/biodiversity-stewardship-utils.ts` | Clamp, hash, band helpers |
| `generated/recovery-scenarios/` | Per-region species/habitat/offset evaluate/snapshot modules |
| `generated/conservation-offset-stacks/` | Conservation offset graph shards |
| `generated/recovery-registry.ts` | Batch evaluation + active-id stride |
| `protected-area-nodes/` | Species habitat / offset / invasive-pressure nodes |
| `conservation-offset-stacks/graph-utils.ts` | Graph merge, pressure, hash |
| `adapters/` | 20AZ / 20BR / 20BA / 20BB / 20BC / 20BF bridges |
| `persistence/` | Keys + migrations |
| `self-tests/` | LAB suite |
