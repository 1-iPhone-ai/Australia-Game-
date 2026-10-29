# O6K-54 — Digital governance v1 (`V1024_DGOV_*`)

**Branch:** `cursor/o6k-10m-v1024-digital-governance`  
**Base:** `australia-game-upgrade`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Planned canonical band (integrator renumbers if occupied):

**`SECTION 20BT`**

## Proposed section header

```text
// ============================================================================
// SECTION 20BT: V10.24 DIGITAL GOVERNANCE — COMPLIANCE STRESS, PLATFORM REGULATION & DATA SOVEREIGNTY (O6K-54)
// ============================================================================
```

Namespace prefix: **`V1024_DGOV_*`** (wave 5 — national policy scenarios, data-sovereignty graph, platform-regulation nodes, governance scoring).

Upstream ties:

| Section | Role |
|---------|------|
| **20AZ** | Public services v2 — clinic capacity, digital service coverage (`adapter-public-services-20az.ts`) |
| **20BE** | AI fidelity — model governance pressure, alignment drift (`adapter-ai-fidelity-20be.ts`) |
| **20BA** | Trade depth — sanctions pressure, import dependency, export lanes (`adapter-v1014-trade-20ba.ts`) |
| **20BB** | Supply chain depth — bottleneck pressure, regional stock days |
| **20BC** | Energy depth — grid stability, reserve margin, compute governance load (`adapter-v1014-energy-20bc.ts`) |
| **20BF** | Workforce migration v2 — readiness & mismatch (digital service delivery staffing) |
| **20BT** (this shard) | Policy scenario matrix, data-sovereignty graph, platform-regulation nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after upstream v1016–v1023 hooks as landed) |
| 2 | **`runV1024DgovTurn(input)`** — evaluates active policy scenarios + data-sovereignty pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1024DgovSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20AZ** public-services overrides via `applyV1024DgovPublicServices20azServiceOverrides` when public services tick runs |
| 5 | Apply **20BE** AI fidelity overrides via `applyV1024DgovAiFidelity20beAiFidelityOverrides` when AI fidelity tick runs |
| 6 | Apply **20BA** / **20BC** / **20BF** adapters as in v1018 cross-wire pattern |

Recommended input builder (merge owner implements):

```typescript
buildV1024DgovTurnInputFromGameState(gs, turn): V1024DgovTurnInput
```

Stub for wiring tests: **`buildV1024DgovTurnInputFromGameStateStub(turn, seed)`** in `engine/digital-governance-orchestrator.ts`.

Suggested field wiring:

- `supply20bb` ← `gs.v1014SupplyChain` / national systems bottleneck aggregates
- `trade20ba` ← `gs.v1014TradeDepth` sanctions + lane stability
- `energy20bc` ← `gs.energyDepth` / grid stability slices
- `workforce20bf` ← `gs.v1014WorkforceV2` readiness & mismatch
- `publicServices20az` ← `gs.v1014PublicServicesV2` / clinic + digital service slices
- `aiFidelity20be` ← `gs.v1014AiFidelity` / commercialization readiness + model governance slices

---

## Persistence (§6)

| Key | Path | Purpose |
|-----|------|---------|
| Root | `save.meta.v1024.digital_governance` | `V1024DgovPersisted` |
| Policies | `save.meta.v1024.digital_governance.policy_snapshots` | Scenario snapshots (`policySnapshots`) |
| Data sovereignty | `save.meta.v1024.digital_governance.data_sovereignty_graph` | Graph revision counter |
| Regional | `save.meta.v1024.digital_governance.regional_platform_regulation` | Per-region buffer / reroute / composite governance |
| History | `save.meta.v1024.digital_governance.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1024.digital_governance.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1024DgovPersisted(raw, turn)`** alongside other `v1024.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1024DgovPersisted()`**.

Schema: **`V1024_DGOV_SCHEMA_VERSION = '10.24.digital_governance.1'`**.

Path constants: `persistence/keys.ts` → `V1024_DGOV_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1024DigitalGovernance`** ← `runV1024DgovTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1024_digital_governance`** |
| Runner | `npx tsx expansion/o6k-10m/v1024-digital-governance/run-self-tests.ts` |
| Cases | ≥75 (currently **83**) |

Regenerate generated modules:

```bash
python3 expansion/o6k-10m/v1024-digital-governance/scripts/generate.py
```

(172 policy scenarios × 72 coef rows, 90 data-sovereignty shards, 24 platform-regulation nodes.)

---

## Module layout

| Path | Role |
|------|------|
| `types/core.ts` | Schema, turn I/O, policy snapshots |
| `engine/digital-governance-orchestrator.ts` | `runV1024DgovTurn` |
| `engine/digital-governance-utils.ts` | Clamp, hash, band helpers |
| `generated/policy-scenarios/` | Per-region residency/liability/audit evaluate/snapshot modules |
| `generated/data-sovereignty-stacks/` | Data sovereignty graph shards |
| `generated/policy-registry.ts` | Batch evaluation + active-id stride |
| `platform-regulation-nodes/` | Platform liability / audit / disclosure nodes |
| `data-sovereignty-stacks/graph-utils.ts` | Graph merge, pressure, hash |
| `adapters/` | 20AZ / 20BE / 20BA / 20BB / 20BC / 20BF bridges |
| `persistence/` | Keys + migrations |
| `self-tests/` | LAB suite |
