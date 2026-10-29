# O6K-42 — Research pipeline v1 (`V1020_RPIPE_*`)

**Branch:** `cursor/o6k-10m-v1020-research-pipeline`  
**Base:** `australia-game-upgrade` @ `e666aed`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Canonical occupancy through **20BK** (intercity logistics v1017) on `australia-game-upgrade` @ `e666aed`. Use the next free band:

**`SECTION 20BL`**

## Proposed section header

```text
// ============================================================================
// SECTION 20BL: V10.20 RESEARCH PIPELINE — COMMERCIALIZATION, LAB TRANSFER & PIPELINE SCENARIOS (O6K-42)
// ============================================================================
```

Namespace prefix: **`V1020_RPIPE_*`** (wave 5 domain tier — R&D pipeline scenarios, commercialization stacks, lab-transfer nodes).

Upstream ties (V1014 cross-wire):

| Section | Role |
|---------|------|
| **20BB** | Supply chain depth — bottleneck pressure, regional stock days |
| **20BA** | Trade depth — sanctions pressure, import dependency, export lanes |
| **20BC** | Energy depth — grid stability, reserve margin |
| **20BF** | Workforce migration v2 — readiness & mismatch into compliance scoring |
| **20BE** | AI fidelity — commercialization readiness (`adapter-commercialization-20be.ts`) |
| **20BJ** | Fiscal federalism — lab transfer backlog (`adapter-lab-transfer-20bj.ts`) |
| **20BL** (this shard) | Pipeline scenario matrix, commercialization-stack graph, lab-transfer nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after v1018 / v1017 / v1016 hooks as landed) |
| 2 | **`runV1020RpipeTurn(input)`** — evaluates active pipeline scenarios + commercialization-stack pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1020RpipeSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20BE** commercialization overrides via `applyV1020RpipeCommercialization20beCommercializationOverrides` when AI fidelity tick runs |
| 5 | Apply **20BJ** lab-transfer overrides via `applyV1020RpipeLabTransfer20bjLabTransferOverrides` when fiscal federalism tick runs |
| 6 | Apply **20BA** / **20BC** / **20BF** adapters as in v1018 cross-wire pattern |

Recommended input builder (merge owner implements):

```typescript
buildV1020RpipeTurnInputFromGameState(gs, turn): V1020RpipeTurnInput
```

Stub for wiring tests: **`buildV1020RpipeTurnInputFromGameStateStub(turn, seed)`** in `engine/research-pipeline-orchestrator.ts`.

Suggested field wiring:

- `supply20bb` ← `gs.v1014SupplyChain` / national systems bottleneck aggregates
- `trade20ba` ← `gs.v1014TradeDepth` sanctions + lane stability
- `energy20bc` ← `gs.energyDepth` / grid stability slices
- `workforce20bf` ← `gs.v1014WorkforceV2` readiness & mismatch
- `aiFidelity20be` ← `gs.v1014AiFidelity` plan→verify + commercialization readiness
- `fiscalFederalism20bj` ← `gs.v1018FiscalFederalism` transfer pressure + lab backlog

---

## Persistence (§6)

| Key | Path | Purpose |
|-----|------|---------|
| Root | `save.meta.v1020.research_pipeline` | `V1020RpipePersisted` |
| Pipeline | `save.meta.v1020.research_pipeline.pipeline_snapshots` | Scenario snapshots (`pipelineSnapshots`) |
| Commercialization stacks | `save.meta.v1020.research_pipeline.commercialization_stack_graph` | Graph revision counter |
| Regional | `save.meta.v1020.research_pipeline.regional_lab_transfer` | Per-region buffer / reroute / composite compliance |
| History | `save.meta.v1020.research_pipeline.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1020.research_pipeline.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1020RpipePersisted(raw, turn)`** alongside other `v1020.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1020RpipePersisted()`**.

Schema: **`V1020_RPIPE_SCHEMA_VERSION = '10.20.research_pipeline.1'`**.

Path constants: `persistence/keys.ts` → `V1020_RPIPE_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1020ResearchPipeline`** ← `runV1020RpipeTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1020_research_pipeline`** |
| Entry | `runV1020RpipeSelfTests()` |
| CLI | `npx tsx expansion/o6k-10m/v1020-research-pipeline/run-self-tests.ts` |
| Minimum cases | ≥55 deterministic checks (turn fixtures, adapters, persistence, catalog sweep) |

---

## Module layout

```text
expansion/o6k-10m/v1020-research-pipeline/
  types/core.ts
  engine/research-pipeline-orchestrator.ts
  engine/research-pipeline-utils.ts
  adapters/adapter-v1014-{supply,trade,energy,workforce}-20*.ts
  adapters/adapter-commercialization-20be.ts
  adapters/adapter-lab-transfer-20bj.ts
  persistence/{keys,migrations}.ts
  commercialization-stacks/graph-utils.ts
  lab-transfers/lab-transfer-*.ts
  generated/pipeline-scenarios/scenario-*.ts
  generated/commercialization-stacks/commercialization-*.ts
  generated/pipeline-registry.ts
  generated/commercialization-stack-bundle.ts
  self-tests/run-v1020-rpipe-self-tests.ts
  scripts/generate.py
```

Regenerate depth shards:

```bash
python3 expansion/o6k-10m/v1020-research-pipeline/scripts/generate.py
```

(172 pipeline scenarios × 72 coef rows, 90 commercialization-stack shards, 24 lab-transfer nodes.)

---

## Merge checklist (Agent 25)

1. Confirm **20BL** still free against HEAD (after concurrent merges, use next free **20BM+** and update this doc).
2. Splice before **SECTION 21B** with **SECTION 20BL** header.
3. Register §11A hook after **`runV1018FfedTurn`** / **`runV1017IclogTurn`** (or last landed v1017/v1018 turn hook).
4. Register §6 sanitizer `sanitizeV1020RpipePersisted` on `save.meta.v1020.research_pipeline`.
5. Wire LAB `v1020_research_pipeline` into reliability rollup before §21B self-tests.
6. Resolve bundle symbol collisions (prefix `V1020_RPIPE_*`; rename local `check` / `baseInput` in inline merge if needed).

---

## Collision notes

- Do not reuse `V1014_*` prefixes for new exports in this band.
- Self-test helpers use `v1020_rpipe_*` ids; inline merge should prefer `v1020RpipeSelfTestCheck` if a global `check` already exists in §21B fixtures.
