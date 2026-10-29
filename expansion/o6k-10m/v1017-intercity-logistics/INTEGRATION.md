# O6K-36 — Intercity logistics v1 (`V1017_ICLOG_*`)

**Branch:** `cursor/o6k-10m-v1017-intercity-logistics`  
**Base:** `australia-game-upgrade` @ `b787c75`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Canonical occupancy through **20BG** (V1016 national resilience) on `australia-game-upgrade` @ `b787c75`. Use the next free band (canonical merge may assign **20BJ** if **20BI** is taken):

**`SECTION 20BI`**

## Proposed section header

```text
// ============================================================================
// SECTION 20BI: V10.17 INTERCITY LOGISTICS — FREIGHT ROUTES & CORRIDOR HUBS (O6K-36)
// ============================================================================
```

Namespace prefix: **`V1017_ICLOG_*`** (wave 4 domain tier — intercity freight, corridor graph, logistics hubs).

Upstream ties:

| Section | Role |
|---------|------|
| **20BB** | V1014 supply chain depth — bottleneck pressure, regional stock days |
| **20BA** | V1014 trade depth — sanctions pressure, import dependency, export lanes |
| **20AK** | V1014 cities & intercity links — corridor congestion, hub throughput |
| **20BG** | V1016 national resilience — continuity score, shock pressure into logistics reroute |
| **20BI** (this shard) | Freight-route scenario matrix, corridor graph, logistics hub nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after V1016 / workforce hooks as landed) |
| 2 | **`runV1017IclogTurn(input)`** — evaluates active freight-route scenarios + corridor pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1017IclogSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20BA** lane overrides via `applyV1017IclogTrade20baLaneOverrides` before trade tick |
| 5 | Apply **20AK** link overrides via `applyV1017IclogCities20akLinkOverrides` before cities / intercity tick |
| 6 | Apply **20BG** continuity overrides via `applyV1017IclogResilience20bgContinuityOverrides` when resilience tick runs |

Recommended input builder (merge owner implements):

```typescript
buildV1017IclogTurnInputFromGameState(gs, turn): V1017IclogTurnInput
```

Stub for wiring tests: **`buildV1017IclogTurnInputFromGameStateStub(turn, seed)`** in `engine/intercity-logistics-orchestrator.ts`.

Suggested field wiring:

- `supply20bb` ← `gs.v1014SupplyChain` / national systems bottleneck aggregates
- `trade20ba` ← `gs.v1014TradeDepth` sanctions + lane stability
- `cities20ak` ← `gs.v1014CitiesIntercity` / link congestion + hub throughput
- `resilience20bg` ← `gs.v1016NationalResilience` continuity + shock pressure

---

## Persistence (§6)

| Key | Path | Purpose |
|-----|------|---------|
| Root | `save.meta.v1017.intercity_logistics` | `V1017IclogPersisted` |
| Routes | `save.meta.v1017.intercity_logistics.freight_routes` | Scenario snapshots (`routeSnapshots`) |
| Corridor | `save.meta.v1017.intercity_logistics.corridor_graph` | Graph revision counter |
| Regional | `save.meta.v1017.intercity_logistics.regional_hub` | Per-region buffer / reroute / composite hub |
| History | `save.meta.v1017.intercity_logistics.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1017.intercity_logistics.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1017IclogPersisted(raw, turn)`** alongside other `v1017.*` / `v1014.*` / `v1016.*` sanitizers.

Factory: **`createEmptyV1017IclogPersisted()`**.

Schema: **`V1017_ICLOG_SCHEMA_VERSION = '10.17.intercity_logistics.1'`**.

Path constants: `persistence/keys.ts` → `V1017_ICLOG_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1017IntercityLogistics`** ← `runV1017IclogTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1017_intercity_logistics`** |
| Entry | `runV1017IclogSelfTests()` |
| CLI | `npx tsx expansion/o6k-10m/v1017-intercity-logistics/run-self-tests.ts` |
| Minimum cases | ≥55 deterministic checks (turn fixtures, adapters, persistence, catalog sweep) |

---

## Module layout

```text
expansion/o6k-10m/v1017-intercity-logistics/
  types/core.ts
  engine/intercity-logistics-orchestrator.ts
  engine/intercity-logistics-utils.ts
  adapters/adapter-v1014-{supply,trade,cities}-20*.ts
  adapters/adapter-v1016-resilience-20bg.ts
  persistence/{keys,migrations}.ts
  corridor-graph/graph-utils.ts
  logistics-hubs/hub-*.ts
  generated/freight-route-scenarios/route-*.ts
  generated/corridor-graph/corr-*.ts
  generated/freight-route-registry.ts
  generated/corridor-graph-bundle.ts
  self-tests/run-v1017-iclog-self-tests.ts
  scripts/generate.py
```

Regenerate bulk catalogs: `python3 expansion/o6k-10m/v1017-intercity-logistics/scripts/generate.py`.

---

## Merge checklist (Agent 25)

1. Confirm **20BI** still free against HEAD (if taken, use **20BJ** and update this doc).
2. Splice before **SECTION 21B** with **SECTION 20BI** header.
3. Wire turn hook after §11A and §6 sanitizer for `save.meta.v1017.intercity_logistics`.
4. Register LAB suite **`v1017_intercity_logistics`** beside other O6K wave-4 suites.
