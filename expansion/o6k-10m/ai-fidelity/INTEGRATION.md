# T6-8 — AI execution fidelity & team ops (`V1014_AI_FIDELITY_*`)

**Branch:** `cursor/o6k-10m-ai-fidelity`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Remote HEAD anchor (~line **319,482** on `origin/australia-game-upgrade`; re-measure before merge).

## Proposed section headers (20BE+ band)

Primary splice block:

```text
// ============================================================================
// SECTION 20BE: V10.14 AI FIDELITY — PLAN→ACT→VERIFY LOOPS (T6-8)
// ============================================================================
```

Nested content bands (same physical splice, ordered sub-blocks):

| Sub-band | Content |
|----------|---------|
| **`SECTION 20BC`** | ACC17 execution verifier hooks, fingerprint-gated verify phase |
| **`SECTION 20BD`** | Progressive UI unlock matrix v2 (extends **20P-A22**) |
| **`SECTION 20BE`** | Orchestrator + persistence + cross-wire adapters |

Namespace prefix: **`V1014_AI_FIDELITY_*`** (domain tag `AI_FIDELITY` in symbol names).

---

## Turn pipeline hook

Per [tranche-6-expansion-plan.md](/cursor/stores/bc-98acc095-c912-4d9b-8aa4-ef32b9636c29/internal/integration/tranche-6-expansion-plan.md) **T6-8**:

| Order | Step |
|------:|------|
| 1 | §11A day pipeline + team coordination batch (`coordinateRoundPlannedDecisions` / **20AU**) |
| 2 | **`runV1014AiFidelityTurn(input)`** — plan→act→verify micro-loops, ACC17 verify bridge, advisory escalation |
| 3 | Apply cross-wire reads to **ACC17**, **20AU**, **20PA**, **20BD** UI gates |
| 4 | Feed explainability bundles into GI3 / §1B fact surfaces when AI fidelity queries fire |

Recommended input builder (merge owner implements):

```typescript
buildV1014AiFidelityTurnInputFromGameState(gs, turn): V1014AiFidelityTurnInput
```

---

## Persistence (§6)

| Key | Path | Purpose |
|-----|------|---------|
| Root | `save.meta.v1014.ai_fidelity` | `V1014AiFidelityPersisted` |
| Loops | `save.meta.v1014.ai_fidelity.loop_snapshots` | Per-loop PAV phase + score |
| Verify | `save.meta.v1014.ai_fidelity.verify_pass_rate` | Rolling ACC17 verify pass rate |
| Routes | `save.meta.v1014.ai_fidelity.route_hashes` | **20AU** routing digests |
| Advisory | `save.meta.v1014.ai_fidelity.advisory_escalations` | **20PA** escalation ids |
| UI | `save.meta.v1014.ai_fidelity.ui_unlock_flags` | **20BD** surface unlock map |
| Explain | `save.meta.v1014.ai_fidelity.explainability_cache` | §1B paired briefing snippets |

Load/save: call **`sanitizeV1014AiFidelityPersisted(raw, turn)`** alongside other `v1014.*` sanitizers.

Factory: **`createEmptyV1014AiFidelityPersisted()`**.

Schema: **`V1014_AI_FIDELITY_SCHEMA_VERSION = '10.14.ai_fidelity.1'`**.

---

## Cross-wire notes (ACC17, 20AU, 20PA, 20BD)

| Section | Adapter module | Symbols | Wiring |
|---------|----------------|---------|--------|
| **ACC17** §15 | `adapters/adapter-acc17-execution.ts` | `readV1014AiFidelityAcc17Slice`, `applyV1014AiFidelityAcc17VerifyBridge` | After PAV **verify** phase, adjust verified execution rate + fingerprint gate before ACC17 queue drain |
| **20AU** Team Intel 3.0 | `adapters/adapter-20au-team-routing.ts` | `applyV1014AiFidelity20AuRoutingBridge`, `v1014AiFidelity20AuTeamRouteModifier` | Publish routing coherence digest into Team OS / coordination ledger |
| **20PA** Guardian advisory | `adapters/adapter-20pa-advisory.ts` | `applyV1014AiFidelity20PaAdvisoryBridge`, `v1014AiFidelity20PaCopilotStripHint` | Map monitor severity → escalation ids for Co-Pilot candidate stripping |
| **20BD** UI unlock v2 | `adapters/adapter-20bd-ui-gates.ts` | `evaluateV1014AiFidelityUiUnlocks`, `countV1014AiFidelityUiSurfacesUnlocked` | Gate flagship surfaces by national development tier + feature flags |

Explainability: `ai/fidelity-read-adapters.ts` → GI3 fact bundle `ai_fidelity_state` when queries mention execution fidelity / team ops.

Generated shards under `engine/plan-act-verify/`, `verify/checks/`, `team-routes/`, `advisory/rules/`, `ui-gates/`, `ai/explainability-bundles/` supply deterministic catalog depth for merge-time concatenation.

---

## LAB suite

Register in the §21B catalog (pattern: `v1014_trade_depth`, `v1014_fiscal`):

```typescript
{
  id: 'v1014_ai_fidelity',
  label: 'V10.14 AI fidelity (T6-8 plan/act/verify + UI gates)',
  tier: 'quick',
  section: 'System Regression',
  severity: 'MAJOR',
  run: () => runV1014AiFidelitySelfTestsForLab(),
}
```

Primary runner: **`runV1014AiFidelitySelfTests()`** — **≥50** deterministic cases (PAV ordering, ACC17 gate, 20AU/20PA adapters, UI unlock matrix, multi-turn persistence).

---

## Public API (merge minimum)

| Symbol | Role |
|--------|------|
| `runV1014AiFidelityTurn` | Turn engine |
| `createEmptyV1014AiFidelityPersisted` / `sanitizeV1014AiFidelityPersisted` | §6 lifecycle |
| `v1014AiFidelityInputHash` | Determinism / replay |
| `runV1014AiFidelitySelfTests` / `runV1014AiFidelitySelfTestsForLab` | Regression |
| `buildV1014AiFidelityAiBriefing` | AI / explainability read surface |
| Cross-wire adapters (table above) | ACC17 / 20AU / 20PA / 20BD |

---

## Merge procedure (Agent 25)

1. Concatenate or transpile `expansion/o6k-10m/ai-fidelity/**/*.ts` into one TSX shard (preserve export names; no duplicate §22 re-exports).
2. Splice before **SECTION 21B** with **SECTION 20BE** header (retain **20BC** / **20BD** sub-headers inside the block).
3. Wire turn hook after team coordination (see pipeline table).
4. Register **`v1014_ai_fidelity`** LAB entry.
5. Initialize `save.meta.v1014.ai_fidelity` in default game state factory.
6. Run `npm ci && npm run build` and LAB quick tier.

---

## Layout

```text
expansion/o6k-10m/ai-fidelity/
  INTEGRATION.md
  index.ts
  types/core.ts
  constants/teams-routes.ts
  engine/ai-fidelity-orchestrator.ts
  engine/ai-fidelity-utils.ts
  engine/plan-act-verify/
  verify/checks/
  team-routes/
  advisory/rules/
  ui-gates/
  ai/
  adapters/adapter-acc17-execution.ts
  adapters/adapter-20au-team-routing.ts
  adapters/adapter-20pa-advisory.ts
  adapters/adapter-20bd-ui-gates.ts
  persistence/
  self-tests/run-v1014-ai-fidelity-self-tests.ts
```

---

## Tranche plan reference

T6-8 target ~30,000 LOC · cross-wire **§9–16** AI stack · **20E** command center · **20F** background workers · depends on explainability (**§1B**) and **20AU** team routes.
