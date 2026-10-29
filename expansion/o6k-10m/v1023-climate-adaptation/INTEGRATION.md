# O6K-51 — Climate adaptation v1 (`V1023_CLAD_*`)

**Branch:** `cursor/o6k-10m-v1023-climate-adaptation`  
**Base:** `australia-game-upgrade`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Planned canonical band (integrator renumbers if occupied):

**`SECTION 20BR`**

## Proposed section header

```text
// ============================================================================
// SECTION 20BR: V10.23 CLIMATE ADAPTATION — HEAT STRESS, FLOOD DEFEND & DROUGHT BUFFERS (O6K-51)
// ============================================================================
```

Namespace prefix: **`V1023_CLAD_*`** (wave 5 — national hazard scenarios, drought-buffer graph, flood-defend nodes, resilience scoring).

Upstream ties:

| Section | Role |
|---------|------|
| **20AZ** | Public services v2 — clinic capacity, digital service coverage (`adapter-public-services-20az.ts`) |
| **20BC** | Energy depth — grid stability, reserve margin, cooling load (`adapter-v1014-energy-20bc.ts`) |
| **20BD** | Scenario packs v2 — pack cohesion, objective drift (`adapter-scenarios-20bd.ts`) |
| **20BA** | Trade depth — sanctions pressure, import dependency, export lanes (`adapter-v1014-trade-20ba.ts`) |
| **20BB** | Supply chain depth — bottleneck pressure, regional stock days |
| **20BF** | Workforce migration v2 — readiness & mismatch (emergency services staffing) |
| **20BR** (this shard) | Hazard scenario matrix, drought-buffer graph, flood-defend nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after upstream v1016–v1022 hooks as landed) |
| 2 | **`runV1023CladTurn(input)`** — evaluates active hazard scenarios + drought-buffer pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1023CladSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20AZ** public-services overrides via `applyV1023CladPublicServices20azServiceOverrides` when public services tick runs |
| 5 | Apply **20BD** scenario overrides via `applyV1023CladScenarioPacks20bdScenarioPackOverrides` when scenario packs tick runs |
| 6 | Apply **20BA** / **20BC** / **20BF** adapters as in v1018 cross-wire pattern |

Recommended input builder (merge owner implements):

```typescript
buildV1023CladTurnInputFromGameState(gs, turn): V1023CladTurnInput
```

Stub for wiring tests: **`buildV1023CladTurnInputFromGameStateStub(turn, seed)`** in `engine/climate-adaptation-orchestrator.ts`.

Suggested field wiring:

- `supply20bb` ← `gs.v1014SupplyChain` / national systems bottleneck aggregates
- `trade20ba` ← `gs.v1014TradeDepth` sanctions + lane stability
- `energy20bc` ← `gs.energyDepth` / grid stability slices
- `workforce20bf` ← `gs.v1014WorkforceV2` readiness & mismatch
- `publicServices20az` ← `gs.v1014PublicServicesV2` / clinic + digital service slices
- `scenarioPacks20bd` ← `gs.v1014ScenarioV2` pack cohesion + objective drift

---

## Persistence (§6)

| Key | Path | Purpose |
|-----|------|---------|
| Root | `save.meta.v1023.climate_adaptation` | `V1023CladPersisted` |
| Hazards | `save.meta.v1023.climate_adaptation.hazard_snapshots` | Scenario snapshots (`hazardSnapshots`) |
| Drought buffer | `save.meta.v1023.climate_adaptation.drought_buffer_graph` | Graph revision counter |
| Regional | `save.meta.v1023.climate_adaptation.regional_flood_defend` | Per-region buffer / reroute / composite resilience |
| History | `save.meta.v1023.climate_adaptation.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1023.climate_adaptation.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1023CladPersisted(raw, turn)`** alongside other `v1023.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1023CladPersisted()`**.

Schema: **`V1023_CLAD_SCHEMA_VERSION = '10.23.climate_adaptation.1'`**.

Path constants: `persistence/keys.ts` → `V1023_CLAD_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1023ClimateAdaptation`** ← `runV1023CladTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1023_climate_adaptation`** |
| Runner | `npx tsx expansion/o6k-10m/v1023-climate-adaptation/run-self-tests.ts` |
| Cases | ≥75 (currently **83**) |

Regenerate generated modules:

```bash
python3 expansion/o6k-10m/v1023-climate-adaptation/scripts/generate.py
```

(172 hazard scenarios × 72 coef rows, 90 drought-buffer shards, 24 flood-defend nodes.)

---

## Module layout

| Path | Role |
|------|------|
| `types/core.ts` | Schema, turn I/O, hazard snapshots |
| `engine/climate-adaptation-orchestrator.ts` | `runV1023CladTurn` |
| `engine/climate-adaptation-utils.ts` | Clamp, hash, band helpers |
| `generated/hazard-scenarios/` | Per-region heat/flood/drought evaluate/snapshot modules |
| `generated/drought-buffer-stacks/` | Drought buffer graph shards |
| `generated/hazard-registry.ts` | Batch evaluation + active-id stride |
| `flood-defend-nodes/` | Flood levee / pump / retreat nodes |
| `drought-buffer-stacks/graph-utils.ts` | Graph merge, pressure, hash |
| `adapters/` | 20AZ / 20BC / 20BD / 20BA / 20BB / 20BF bridges |
| `persistence/` | Keys + migrations |
| `self-tests/` | LAB suite |
