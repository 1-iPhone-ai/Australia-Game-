# O6K-37 — Fiscal federalism v1 (`V1018_FFED_*`)

**Branch:** `cursor/o6k-10m-v1018-fiscal-federalism`  
**Base:** `australia-game-upgrade` @ `b787c75`  
**Integrator:** Agent 25 only — **do not** edit `(V9.4) australia-game-with-ai.tsx` from this deliverable.

## Splice anchor

Insert the compiled/concatenated expansion **immediately before**:

```text
// SECTION 21B: RELIABILITY UPGRADE — FOCUSED REGRESSION SELF-TESTS
```

Canonical occupancy through **20BH** (national resilience v1016) on `australia-game-upgrade` @ `b787c75`. Use the next free band:

**`SECTION 20BI`**

## Proposed section header

```text
// ============================================================================
// SECTION 20BI: V10.18 FISCAL FEDERALISM — TRANSFERS, GRANT STACKS & AUDIT TRAILS (O6K-37)
// ============================================================================
```

Namespace prefix: **`V1018_FFED_*`** (wave 4 domain tier — state–federal transfers, grant stacks, audit trails).

Upstream ties (V1014 cross-wire):

| Section | Role |
|---------|------|
| **20BB** | Supply chain depth — bottleneck pressure, regional stock days |
| **20BA** | Trade depth — sanctions pressure, import dependency, export lanes |
| **20BC** | Energy depth — grid stability, reserve margin |
| **20BF** | Workforce migration v2 — readiness & mismatch into compliance scoring |
| **20BI** (this shard) | Transfer scenario matrix, grant-stack graph, audit-trail nodes |

---

## Turn pipeline hook

| Order | Step |
|------:|------|
| 1 | §11A day pipeline completes (after workforce v2 / AI fidelity / v1016 hooks as landed) |
| 2 | **`runV1018FfedTurn(input)`** — evaluates active transfer scenarios + grant-stack pressure |
| 3 | Apply **20BB** bottleneck overrides via `applyV1018FfedSupply20bbBottleneckOverrides` before supply tick |
| 4 | Apply **20BA** lane overrides via `applyV1018FfedTrade20baLaneOverrides` before trade tick |
| 5 | Apply **20BC** grid overrides via `applyV1018FfedEnergy20bcGridOverrides` before energy depth tick |
| 6 | Apply **20BF** readiness overrides via `applyV1018FfedWorkforce20bfReadinessOverrides` when workforce tick runs |

Recommended input builder (merge owner implements):

```typescript
buildV1018FfedTurnInputFromGameState(gs, turn): V1018FfedTurnInput
```

Stub for wiring tests: **`buildV1018FfedTurnInputFromGameStateStub(turn, seed)`** in `engine/fiscal-federalism-orchestrator.ts`.

Suggested field wiring:

- `supply20bb` ← `gs.v1014SupplyChain` / national systems bottleneck aggregates
- `trade20ba` ← `gs.v1014TradeDepth` sanctions + lane stability
- `energy20bc` ← `gs.energyDepth` / grid stability slices
- `workforce20bf` ← `gs.v1014WorkforceV2` readiness & mismatch

---

## Persistence (§6)

| Key | Path | Purpose |
|-----|------|---------|
| Root | `save.meta.v1018.fiscal_federalism` | `V1018FfedPersisted` |
| Transfers | `save.meta.v1018.fiscal_federalism.transfer_snapshots` | Scenario snapshots (`transferSnapshots`) |
| Grant stacks | `save.meta.v1018.fiscal_federalism.grant_stack_graph` | Graph revision counter |
| Regional | `save.meta.v1018.fiscal_federalism.regional_compliance` | Per-region buffer / reroute / composite compliance |
| History | `save.meta.v1018.fiscal_federalism.history` | Turn hash tail (`historyTail`) |
| AI cache | `save.meta.v1018.fiscal_federalism.ai_read_cache` | Briefing snippets |

Load/save: call **`sanitizeV1018FfedPersisted(raw, turn)`** alongside other `v1018.*` / `v1014.*` sanitizers.

Factory: **`createEmptyV1018FfedPersisted()`**.

Schema: **`V1018_FFED_SCHEMA_VERSION = '10.18.fiscal_federalism.1'`**.

Path constants: `persistence/keys.ts` → `V1018_FFED_PERSISTENCE_PATHS`.

Runtime slice on game state (suggested): **`gameState.v1018FiscalFederalism`** ← `runV1018FfedTurn(...).state`.

---

## LAB / self-tests

| Item | Value |
|------|-------|
| Suite id | **`v1018_fiscal_federalism`** |
| Entry | `runV1018FfedSelfTests()` |
| CLI | `npx tsx expansion/o6k-10m/v1018-fiscal-federalism/run-self-tests.ts` |
| Minimum cases | ≥55 deterministic checks (turn fixtures, adapters, persistence, catalog sweep) |

---

## Module layout

```text
expansion/o6k-10m/v1018-fiscal-federalism/
  types/core.ts
  engine/fiscal-federalism-orchestrator.ts
  engine/fiscal-federalism-utils.ts
  adapters/adapter-v1014-{supply,trade,energy,workforce}-20*.ts
  persistence/{keys,migrations}.ts
  grant-stacks/graph-utils.ts
  audit-trails/audit-*.ts
  generated/transfer-scenarios/scenario-*.ts
  generated/grant-stacks/grant-*.ts
  generated/transfer-registry.ts
  generated/grant-stack-bundle.ts
  self-tests/run-v1018-ffed-self-tests.ts
  scripts/generate.py
```

Regenerate depth shards:

```bash
python3 expansion/o6k-10m/v1018-fiscal-federalism/scripts/generate.py
```

(172 transfer scenarios × 72 coef rows, 90 grant-stack shards, 24 audit-trail nodes.)

---

## Merge checklist (Agent 25)

1. Confirm **20BI** still free against HEAD (after concurrent merges, use next free **20BJ+** and update this doc).
2. Splice before **SECTION 21B** with **SECTION 20BI** header.
3. Register §11A hook after **`runV1016NresTurn`** (or last landed v1016 turn hook).
4. Register §6 sanitizer `sanitizeV1018FfedPersisted` on `save.meta.v1018.fiscal_federalism`.
5. Wire LAB `v1018_fiscal_federalism` into reliability rollup before §21B self-tests.
6. Resolve bundle symbol collisions (prefix `V1018_FFED_*`; rename local `check` / `baseInput` in inline merge if needed).

---

## Collision notes

- Do not reuse `V1014_*` prefixes for new exports in this band.
- Self-test helpers use `v1018_ffed_*` ids; inline merge should prefer `v1018FfedSelfTestCheck` if a global `check` already exists in §21B fixtures.
