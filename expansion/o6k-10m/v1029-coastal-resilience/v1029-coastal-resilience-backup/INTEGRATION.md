# O6K-64 — Coastal resilience v1 (`V1029_CRES_*`)

**Branch:** `cursor/o6k-10m-v1029-coastal-resilience`  
**Base:** `australia-game-upgrade`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Planned canonical band (integrator renumbers if occupied):

**`SECTION 20BY`**

## Proposed section header

```text
// ============================================================================
// SECTION 20BY: V10.29 COASTAL RESILIENCE — SEA-LEVEL EXPOSURE, LITTORAL ZONE NODES & ADAPTATION BUFFERS (O6K-64)
// ============================================================================
```

Namespace prefix: **`V1029_CRES_*`** (wave 6 — national surge scenarios, adaptation-buffer graph, littoral-zone nodes, coastal resilience scoring).

Upstream ties:

| Section | Role |
|---------|------|
| **20AZ** | Public services v2 — coastal shelter, digital alerting (`adapter-public-services-20az.ts`) |
| **20BX** | Disaster resilience (V1028) — compound hazards, evacuation lag (`adapter-disaster-resilience-20bx.ts`) |
| **20BR** | Climate adaptation (V1023) — sea-level pressure, resilience drift (`adapter-climate-adaptation-20br.ts`) |
| **20BV** | Regional health systems (V1026) — hospital surge, bed drift (`adapter-regional-health-systems-20bv.ts`) |
| **20BW** | Water security (V1027) — supply stress under inundation (`adapter-water-security-20bw.ts`) |
| **20BY** (this shard) | Surge scenario matrix, adaptation-buffer graph, littoral-zone nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after upstream v1016–v1023 hooks as landed) |
| 2 | **`runV1029CresTurn(input)`** — evaluates active surge scenarios + conservation-offset pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1029CresSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20AZ** public-services overrides via `applyV1029CresPublicServices20azServiceOverrides` when public services tick runs |
| 5 | Apply **20BT** digital governance overrides via `applyV1029CresDigitalGovernance20btDigitalGovernanceOverrides` when digital governance tick runs
| 5b | Apply **20BR** Climate adaptation overrides via `applyV1029CresClimateAdaptation20brClimateAdaptationOverrides` when Climate adaptation tick runs |
| 6 | Apply **20BA** / **20BC** / **20BF** adapters as in v1018 cross-wire pattern |

Recommended input builder (merge owner implements):

```typescript
buildV1029CresTurnInputFromGameState(gs, turn): V1029CresTurnInput
```

Stub for wiring tests: **`buildV1029CresTurnInputFromGameStateStub(turn, seed)`** in `engine/coastal-resilience-orchestrator.ts`.

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
| Root | `save.meta.v1029.coastal_resilience` | `V1029CresPersisted` |
| Policies | `save.meta.v1029.coastal_resilience.surge_snapshots` | Scenario snapshots (`surgeSnapshots`) |
| Adaptation buffer | `save.meta.v1029.coastal_resilience.adaptation_buffer_graph` | Graph revision counter |
| Regional | `save.meta.v1029.coastal_resilience.regional_littoral_zone` | Per-region buffer / reroute / composite coastal resilience |
| History | `save.meta.v1029.coastal_resilience.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1029.coastal_resilience.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1029CresPersisted(raw, turn)`** alongside other `v1029.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1029CresPersisted()`**.

Schema: **`V1029_CRES_SCHEMA_VERSION = '10.25.coastal_resilience.1'`**.

Path constants: `persistence/keys.ts` → `V1029_CRES_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1029CresdiversityStewardship`** ← `runV1029CresTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1029_coastal_resilience`** |
| Runner | `npx tsx expansion/o6k-10m/v1029-coastal-resilience/run-self-tests.ts` |
| Cases | ≥75 (currently **83**) |

Regenerate generated modules:

```bash
python3 expansion/o6k-10m/v1029-coastal-resilience/scripts/generate.py
```

(172 surge scenarios × 72 coef rows, 90 conservation-offset shards, 24 littoral-zone nodes.)

---

## Module layout

| Path | Role |
|------|------|
| `types/core.ts` | Schema, turn I/O, policy snapshots |
| `engine/coastal-resilience-orchestrator.ts` | `runV1029CresTurn` |
| `engine/coastal-resilience-utils.ts` | Clamp, hash, band helpers |
| `generated/surge-scenarios/` | Per-region storm_surge/king_tide/erosion evaluate/snapshot modules |
| `generated/adaptation-buffer-stacks/` | Adaptation buffer graph shards |
| `generated/surge-registry.ts` | Batch evaluation + active-id stride |
| `littoral-zone-nodes/` | Species habitat / offset / invasive-pressure nodes |
| `adaptation-buffer-stacks/graph-utils.ts` | Graph merge, pressure, hash |
| `adapters/` | 20AZ / 20BR / 20BT / 20BV / 20BC bridges |
| `persistence/` | Keys + migrations |
| `self-tests/` | LAB suite |
