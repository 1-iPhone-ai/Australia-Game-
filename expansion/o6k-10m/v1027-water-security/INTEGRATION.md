# O6K-61 — Water security v1 (`V1027_WSEC_*`)

**Branch:** `cursor/o6k-10m-v1027-water-security`  
**Base:** `australia-game-upgrade`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Planned canonical band (integrator renumbers if occupied):

**`SECTION 20BW`**

## Proposed section header

```text
// ============================================================================
// SECTION 20BW: V10.27 WATER SECURITY — WATER STRESS, DISTRIBUTION NETWORKS & AQUIFER RESERVES (O6K-61)
// ============================================================================
```

Namespace prefix: **`V1027_WSEC_*`** (wave 6 — national basin scenarios, aquifer-reserve graph, distribution-network nodes, water security scoring).

Upstream ties:

| Section | Role |
|---------|------|
| **20AZ** | Public services v2 — utility capacity, digital service coverage (`adapter-public-services-20az.ts`) |
| **20BR** | Climate adaptation (V1023) — drought/heat pressure, resilience drift (`adapter-climate-adaptation-20br.ts`) |
| **20BT** | Digital governance (V1024) — metering/compliance pressure (`adapter-digital-governance-20bt.ts`) |
| **20BC** | Energy depth — grid stability, pumping load (`adapter-v1014-energy-20bc.ts`) |
| **20BU** | Biodiversity stewardship — catchment integrity, offset drift (`adapter-biodiversity-stewardship-20bu.ts`) |
| **20BW** (this shard) | Basin scenario matrix, aquifer-reserve graph, distribution-network nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after upstream v1016–v1023 hooks as landed) |
| 2 | **`runV1027WsecTurn(input)`** — evaluates active basin scenarios + conservation-offset pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1027WsecSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20AZ** public-services overrides via `applyV1027WsecPublicServices20azServiceOverrides` when public services tick runs |
| 5 | Apply **20BT** digital governance overrides via `applyV1027WsecDigitalGovernance20btDigitalGovernanceOverrides` when digital governance tick runs
| 5b | Apply **20BR** Climate adaptation overrides via `applyV1027WsecClimateAdaptation20brClimateAdaptationOverrides` when Climate adaptation tick runs |
| 6 | Apply **20BA** / **20BC** / **20BF** adapters as in v1018 cross-wire pattern |

Recommended input builder (merge owner implements):

```typescript
buildV1027WsecTurnInputFromGameState(gs, turn): V1027WsecTurnInput
```

Stub for wiring tests: **`buildV1027WsecTurnInputFromGameStateStub(turn, seed)`** in `engine/water-security-orchestrator.ts`.

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
| Root | `save.meta.v1027.water_security` | `V1027WsecPersisted` |
| Policies | `save.meta.v1027.water_security.basin_snapshots` | Scenario snapshots (`basinSnapshots`) |
| Aquifer reserve | `save.meta.v1027.water_security.aquifer_reserve_graph` | Graph revision counter |
| Regional | `save.meta.v1027.water_security.regional_distribution_network` | Per-region buffer / reroute / composite water security |
| History | `save.meta.v1027.water_security.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1027.water_security.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1027WsecPersisted(raw, turn)`** alongside other `v1027.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1027WsecPersisted()`**.

Schema: **`V1027_WSEC_SCHEMA_VERSION = '10.25.water_security.1'`**.

Path constants: `persistence/keys.ts` → `V1027_WSEC_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1027WsecdiversityStewardship`** ← `runV1027WsecTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1027_water_security`** |
| Runner | `npx tsx expansion/o6k-10m/v1027-water-security/run-self-tests.ts` |
| Cases | ≥75 (currently **83**) |

Regenerate generated modules:

```bash
python3 expansion/o6k-10m/v1027-water-security/scripts/generate.py
```

(172 basin scenarios × 72 coef rows, 90 conservation-offset shards, 24 distribution-network nodes.)

---

## Module layout

| Path | Role |
|------|------|
| `types/core.ts` | Schema, turn I/O, policy snapshots |
| `engine/water-security-orchestrator.ts` | `runV1027WsecTurn` |
| `engine/water-security-utils.ts` | Clamp, hash, band helpers |
| `generated/basin-scenarios/` | Per-region surface/ground/aquifer evaluate/snapshot modules |
| `generated/aquifer-reserve-stacks/` | Aquifer reserve graph shards |
| `generated/basin-registry.ts` | Batch evaluation + active-id stride |
| `distribution-network-nodes/` | Species habitat / offset / invasive-pressure nodes |
| `aquifer-reserve-stacks/graph-utils.ts` | Graph merge, pressure, hash |
| `adapters/` | 20AZ / 20BR / 20BT / 20BU / 20BC bridges |
| `persistence/` | Keys + migrations |
| `self-tests/` | LAB suite |
