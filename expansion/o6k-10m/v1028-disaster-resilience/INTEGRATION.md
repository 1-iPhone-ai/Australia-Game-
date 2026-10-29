# O6K-62 — Disaster resilience v1 (`V1028_DRES_*`)

**Branch:** `cursor/o6k-10m-v1028-disaster-resilience`  
**Base:** `australia-game-upgrade`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Planned canonical band (integrator renumbers if occupied):

**`SECTION 20BX`**

## Proposed section header

```text
// ============================================================================
// SECTION 20BX: V10.28 DISASTER RESILIENCE — DISASTER RISK, EMERGENCY RESPONSE NODES & EVACUATION CAPACITY (O6K-62)
// ============================================================================
```

Namespace prefix: **`V1028_DRES_*`** (wave 6 — national hazard scenarios, evacuation-capacity graph, emergency-response nodes, disaster resilience scoring).

Upstream ties:

| Section | Role |
|---------|------|
| **20AZ** | Public services v2 — shelter capacity, digital alerting (`adapter-public-services-20az.ts`) |
| **20AS** | Crisis spine — national coordination, escalation lag (`adapter-crisis-spine-20as.ts`) |
| **20BR** | Climate adaptation (V1023) — hazard pressure, resilience drift (`adapter-climate-adaptation-20br.ts`) |
| **20BV** | Regional health systems (V1026) — hospital surge, bed drift (`adapter-regional-health-systems-20bv.ts`) |
| **20BW** | Water security (V1027) — supply stress under compound events (`adapter-water-security-20bw.ts`) |
| **20BX** (this shard) | Hazard scenario matrix, evacuation-capacity graph, emergency-response nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after upstream v1016–v1023 hooks as landed) |
| 2 | **`runV1028DresTurn(input)`** — evaluates active hazard scenarios + conservation-offset pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1028DresSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20AZ** public-services overrides via `applyV1028DresPublicServices20azServiceOverrides` when public services tick runs |
| 5 | Apply **20BT** digital governance overrides via `applyV1028DresDigitalGovernance20btDigitalGovernanceOverrides` when digital governance tick runs
| 5b | Apply **20BR** Climate adaptation overrides via `applyV1028DresClimateAdaptation20brClimateAdaptationOverrides` when Climate adaptation tick runs |
| 6 | Apply **20BA** / **20BC** / **20BF** adapters as in v1018 cross-wire pattern |

Recommended input builder (merge owner implements):

```typescript
buildV1028DresTurnInputFromGameState(gs, turn): V1028DresTurnInput
```

Stub for wiring tests: **`buildV1028DresTurnInputFromGameStateStub(turn, seed)`** in `engine/disaster-resilience-orchestrator.ts`.

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
| Root | `save.meta.v1028.disaster_resilience` | `V1028DresPersisted` |
| Policies | `save.meta.v1028.disaster_resilience.hazard_snapshots` | Scenario snapshots (`hazardSnapshots`) |
| Evacuation capacity | `save.meta.v1028.disaster_resilience.evacuation_capacity_graph` | Graph revision counter |
| Regional | `save.meta.v1028.disaster_resilience.regional_emergency_response` | Per-region buffer / reroute / composite disaster resilience |
| History | `save.meta.v1028.disaster_resilience.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1028.disaster_resilience.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1028DresPersisted(raw, turn)`** alongside other `v1028.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1028DresPersisted()`**.

Schema: **`V1028_DRES_SCHEMA_VERSION = '10.25.disaster_resilience.1'`**.

Path constants: `persistence/keys.ts` → `V1028_DRES_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1028DresdiversityStewardship`** ← `runV1028DresTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1028_disaster_resilience`** |
| Runner | `npx tsx expansion/o6k-10m/v1028-disaster-resilience/run-self-tests.ts` |
| Cases | ≥75 (currently **83**) |

Regenerate generated modules:

```bash
python3 expansion/o6k-10m/v1028-disaster-resilience/scripts/generate.py
```

(172 hazard scenarios × 72 coef rows, 90 conservation-offset shards, 24 emergency-response nodes.)

---

## Module layout

| Path | Role |
|------|------|
| `types/core.ts` | Schema, turn I/O, policy snapshots |
| `engine/disaster-resilience-orchestrator.ts` | `runV1028DresTurn` |
| `engine/disaster-resilience-utils.ts` | Clamp, hash, band helpers |
| `generated/hazard-scenarios/` | Per-region flood/bushfire/cyclone evaluate/snapshot modules |
| `generated/evacuation-capacity-stacks/` | Evacuation capacity graph shards |
| `generated/hazard-registry.ts` | Batch evaluation + active-id stride |
| `emergency-response-nodes/` | Species habitat / offset / invasive-pressure nodes |
| `evacuation-capacity-stacks/graph-utils.ts` | Graph merge, pressure, hash |
| `adapters/` | 20AZ / 20BR / 20BT / 20BV / 20BC bridges |
| `persistence/` | Keys + migrations |
| `self-tests/` | LAB suite |
