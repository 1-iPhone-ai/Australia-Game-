# O6K-25 — Workforce migration v2 (`V1014_WORKFORCE_*`)

**Branch:** `cursor/o6k-10m-workforce-depth`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Use the next free band **`SECTION 20BD`** (20BD+ reserved for O6K depth shards).

## Proposed section header

```text
// ============================================================================
// SECTION 20BD: V10.14 WORKFORCE MIGRATION v2 — SKILLS GRAPH & 20AJ SCENARIOS (O6K-25)
// ============================================================================
```

Namespace prefix: **`V1014_WORKFORCE_*`** (20AC part 4 — mirrors 20AJ migration catalogs).

Upstream ties (per [agent-25-log.md](/cursor/stores/bc-98acc095-c912-4d9b-8aa4-ef32b9636c29/internal/agents/agent-25-log.md)):

| Section | Role |
|---------|------|
| **20AC** | Workforce, skills & human capital baseline |
| **20AJ** | Labor market, demographics, migration flow bands |
| **20AF** | Household living standards & domestic demand |
| **20BD** (this shard) | Migration scenario matrix, skills graph extensions, cross-wire adapters |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after orchestrator / supply / trade hooks as landed) |
| 2 | **`runV1014WorkforceMigrationTurn(input)`** — evaluates active migration scenarios + skills graph pressure |
| 3 | Apply **20AJ** attractiveness overrides via `applyV1014WorkforceAj20AttractivenessOverrides` when labor tick runs |
| 4 | Apply **20AF** demand overrides via `applyV1014WorkforceAf20DemandOverrides` before household economy tick |

Recommended input builder (merge owner implements):

```typescript
buildV1014WorkforceMigrationTurnInputFromGameState(gs, turn): V1014WorkforceTurnInput
```

Suggested field wiring:

- `ac20` ← `gs.workforceHumanCapital` / `gs.workforce` readiness & regional skill supply
- `aj20` ← `gs.laborDemographics` migration band & attractiveness
- `af20` ← `gs.householdEconomy` affordability & living standard slices

---

## Persistence (§6)

| Key | Path | Purpose |
|-----|------|---------|
| Root | `save.meta.v1014.workforce_v2` | `V1014WorkforcePersisted` |
| Migration | `save.meta.v1014.workforce_v2.migration` | Scenario snapshots (`migrationSnapshots`) |
| Skills graph | `save.meta.v1014.workforce_v2.skills_graph` | Graph revision counter |
| Regional | `save.meta.v1014.workforce_v2.regional` | Per-region queue / mismatch / readiness aggregates |
| History | `save.meta.v1014.workforce_v2.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1014.workforce_v2.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1014WorkforceMigrationPersisted(raw, turn)`** alongside other `v1014.*` sanitizers.

Factory: **`createEmptyV1014WorkforceMigrationPersisted()`**.

Schema: **`V1014_WORKFORCE_SCHEMA_VERSION = '10.14.workforce_v2.1'`**.

Path constants: `persistence/keys.ts` → `V1014_WORKFORCE_PERSISTENCE_PATHS`.

---

## Cross-wire adapters

| Section | Module | Symbols |
|---------|--------|---------|
| **20AC** | `adapters/adapter-20ac-workforce.ts` | `readV1014WorkforceAc20Bridge`, `buildV1014WorkforceMigrationBriefing` |
| **20AJ** | `adapters/adapter-20aj-labor.ts` | `computeV1014WorkforceAj20MigrationDelta`, `applyV1014WorkforceAj20AttractivenessOverrides` |
| **20AF** | `adapters/adapter-20af-household.ts` | `computeV1014WorkforceAf20HouseholdBridge`, `applyV1014WorkforceAf20DemandOverrides` |

Generated catalogs:

- `generated/migration-scenarios/*` — deterministic scenario evaluators (`V1014_WORKFORCE_MIG_SCENARIO_*`)
- `generated/skills-graph/*` + `skills-graph-bundle.ts` — graph extension edges for 20AC retrain paths
- `migration-corridors/*` — regional corridor capacity/backlog helpers aligned with 20AJ flow bands

---

## LAB suite

Register in the §21B catalog:

```typescript
{
  id: 'v1014_workforce_v2',
  label: 'V10.14 Workforce migration v2 (20BD / 20AC part 4)',
  tier: 'quick',
  section: 'System Regression',
  severity: 'MAJOR',
  run: () => runV1014WorkforceMigrationSelfTestsForLab(),
}
```

Primary runner: **`runV1014WorkforceMigrationSelfTests()`** — **≥40** deterministic cases (turn hashes, scenario batch, adapters, §6 sanitize, multi-turn persistence).

---

## Public API (merge minimum)

| Symbol | Role |
|--------|------|
| `runV1014WorkforceMigrationTurn` | Turn engine |
| `createEmptyV1014WorkforceMigrationPersisted` / `sanitizeV1014WorkforceMigrationPersisted` | §6 lifecycle |
| `v1014WorkforceMigrationInputHash` | Determinism / replay |
| `runV1014WorkforceMigrationSelfTests` / `runV1014WorkforceMigrationSelfTestsForLab` | Regression |
| `V1014_WORKFORCE_evaluateMigrationScenarioBatch` | Scenario orchestration |
| `V1014_WORKFORCE_GENERATED_SKILLS_EDGES` | Skills graph extension data |
| Cross-wire adapters (table above) | 20AC / 20AJ / 20AF |

---

## Merge procedure (Agent 25)

1. Concatenate or transpile `expansion/o6k-10m/workforce-migration/**/*.ts` into one TSX shard (preserve export names; no duplicate §22 re-exports).
2. Splice before **SECTION 21B** with **SECTION 20BD** header.
3. Wire turn hook after §11A (see pipeline table) and §6 migration sanitizer for `save.meta.v1014.workforce_v2`.
4. Register **`v1014_workforce_v2`** LAB entry.
5. Run `npm ci && npm run build` and LAB quick tier.

Regenerate deterministic shards: `python3 expansion/o6k-10m/workforce-migration/scripts/generate.py`.

---

## Layout

```text
expansion/o6k-10m/workforce-migration/
  INTEGRATION.md
  index.ts
  types/core.ts
  constants/regions-skills.ts
  engine/workforce-migration-orchestrator.ts
  engine/workforce-migration-utils.ts
  skills-graph/graph-utils.ts
  migration-corridors/
  generated/migration-scenarios/
  generated/skills-graph/
  generated/migration-scenario-registry.ts
  generated/skills-graph-bundle.ts
  adapters/adapter-20{ac,aj,af}-*.ts
  persistence/
  self-tests/run-v1014-workforce-self-tests.ts
  scripts/generate.py
```
