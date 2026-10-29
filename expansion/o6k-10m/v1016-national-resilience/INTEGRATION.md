# O6K-33 — National resilience v1 (`V1016_NRES_*`)

**Branch:** `cursor/o6k-10m-v1016-national-resilience`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Canonical occupancy through **20BF** (workforce migration v2) is occupied on `australia-game-upgrade` @ `8c2fd60`. Use the next free band:

**`SECTION 20BG`**

## Proposed section header

```text
// ============================================================================
// SECTION 20BG: V10.16 NATIONAL RESILIENCE — SUPPLY SHOCK & CONTINUITY (O6K-33)
// ============================================================================
```

Namespace prefix: **`V1016_NRES_*`** (wave 3 domain tier — national resilience / supply shock / continuity).

Upstream ties (V1014 cross-wire):

| Section | Role |
|---------|------|
| **20BB** | Supply chain depth — bottleneck pressure, regional stock days |
| **20BA** | Trade depth — sanctions pressure, import dependency, export lanes |
| **20BC** | Energy depth — grid stability, reserve margin |
| **20BF** | Workforce migration v2 — readiness & mismatch into continuity scoring |
| **20BG** (this shard) | Supply-shock scenario matrix, propagation graph, continuity nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after workforce v2 / AI fidelity hooks as landed) |
| 2 | **`runV1016NresTurn(input)`** — evaluates active supply-shock scenarios + propagation pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1016NresSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20BA** lane overrides via `applyV1016NresTrade20baLaneOverrides` before trade tick |
| 5 | Apply **20BC** grid overrides via `applyV1016NresEnergy20bcGridOverrides` before energy depth tick |
| 6 | Apply **20BF** readiness overrides via `applyV1016NresWorkforce20bfReadinessOverrides` when workforce tick runs |

Recommended input builder (merge owner implements):

```typescript
buildV1016NresTurnInputFromGameState(gs, turn): V1016NresTurnInput
```

Stub for wiring tests: **`buildV1016NresTurnInputFromGameStateStub(turn, seed)`** in `engine/national-resilience-orchestrator.ts`.

Suggested field wiring:

- `supply20bb` ← `gs.v1014SupplyChain` / national systems bottleneck aggregates
- `trade20ba` ← `gs.v1014TradeDepth` sanctions + lane stability
- `energy20bc` ← `gs.energyDepth` / grid stability slices
- `workforce20bf` ← `gs.v1014WorkforceV2` readiness & mismatch

---

## Persistence (§6)

| Key | Path | Purpose |
|-----|------|---------|
| Root | `save.meta.v1016.national_resilience` | `V1016NresPersisted` |
| Shocks | `save.meta.v1016.national_resilience.supply_shocks` | Scenario snapshots (`shockSnapshots`) |
| Propagation | `save.meta.v1016.national_resilience.propagation_graph` | Graph revision counter |
| Regional | `save.meta.v1016.national_resilience.regional_continuity` | Per-region buffer / reroute / composite continuity |
| History | `save.meta.v1016.national_resilience.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1016.national_resilience.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1016NresPersisted(raw, turn)`** alongside other `v1016.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1016NresPersisted()`**.

Schema: **`V1016_NRES_SCHEMA_VERSION = '10.16.national_resilience.1'`**.

Path constants: `persistence/keys.ts` → `V1016_NRES_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1016NationalResilience`** ← `runV1016NresTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1016_national_resilience`** |
| Entry | `runV1016NresSelfTests()` |
| CLI | `npx tsx expansion/o6k-10m/v1016-national-resilience/run-self-tests.ts` |
| Minimum cases | ≥50 deterministic checks (turn fixtures, adapters, persistence, catalog sweep) |

---

## Module layout

```text
expansion/o6k-10m/v1016-national-resilience/
  types/core.ts
  engine/national-resilience-orchestrator.ts
  engine/national-resilience-utils.ts
  adapters/adapter-v1014-{supply,trade,energy,workforce}-20*.ts
  persistence/{keys,migrations}.ts
  propagation-graph/graph-utils.ts
  continuity-nodes/node-*.ts
  generated/supply-shock-scenarios/scenario-*.ts
  generated/propagation-graph/prop-*.ts
  generated/supply-shock-registry.ts
  generated/propagation-graph-bundle.ts
  self-tests/run-v1016-nres-self-tests.ts
  scripts/generate.py
```

Regenerate depth shards:

```bash
python3 expansion/o6k-10m/v1016-national-resilience/scripts/generate.py
```

(172 supply-shock scenarios × 72 coef rows, 90 propagation shards, 24 continuity nodes.)

---

## Merge checklist (Agent 25)

1. Confirm **20BG** still free against HEAD (after any concurrent merges, use next free **20BH+** and update this doc).
2. Splice before **SECTION 21B** with **SECTION 20BG** header.
3. Register §11A hook after **`runV1014WorkforceMigrationTurn`** (or last landed v1014 turn hook).
4. Register §6 sanitizer `sanitizeV1016NresPersisted` on `save.meta.v1016.national_resilience`.
5. Wire LAB `v1016_national_resilience` into reliability rollup before §21B self-tests.
6. Resolve bundle symbol collisions (prefix `V1016_NRES_*`; rename local `check` / `baseInput` in inline merge if needed).

---

## Collision notes

- Do not reuse `V1014_*` prefixes for new exports in this band.
- Self-test helpers use `v1016_nres_*` ids; inline merge should prefer `v1016NresSelfTestCheck` if a global `check` already exists in §21B fixtures.
