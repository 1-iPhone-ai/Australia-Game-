# Automation Engine Specification — V9.4 / Operation 111

**Operation 111 · Agent 48 (Automation Engine Engineer)**  
**Canonical baseline:** `(V9.4) australia-game-with-ai.tsx`  
**Branch:** `op111/agent-48-automation`  
**Status:** Normative for Division E workers (41–50), Agent 76 (idle), and Agent 111 integration of automation paths.

---

## 1. Purpose

This document defines the **Automation Engine** — the coordinated stack that lets the human player delegate turn actions without bypassing safety, governance, or replay contracts. It spans:

| Layer | Primary location (baseline lines) | Role |
|-------|----------------------------------|------|
| **Smart Settings & Game Experience Director** | §11 ~43605–44244 | Presets, transactional apply, Auto Mode boundary checks |
| **Human Player Automation (HA1–HA3)** | ~91856–92486 + UI ~225900+ | Rule CRUD, triggers, execution orchestration |
| **Turn orchestrator** | ~203424–203540 | `runHumanAutomationsForPlayer` — single chokepoint for auto-execution |
| **Auto Mode runtime** | §9 + dev self-tests ~55219+ | Adaptive match manager; must respect Smart Settings locks |
| **Guardian interception** | §13 pipeline | Blocks or confirms high-risk automated actions |

Workers must not add parallel execution paths that call `executeTeamAiAction` for human automation outside this engine.

---

## 2. Subsystems and ownership

| Subsystem | Agent 48 scope | Related fleet roles |
|-----------|----------------|---------------------|
| Human automation schema, sanitize, import/export | **Owner** | 84 persistence, 9 compatibility |
| Trigger / eligibility / decision pure functions | **Owner** | 91 verification |
| Turn-start orchestrator semantics | **Owner** | 76 idle (must not double-fire) |
| Smart Settings transactional apply | **Co-owner** with Agent 44 (command center) | 111 integration |
| Auto Mode vs Smart Settings boundaries | **Owner** | 45 background AI |
| Guardian on `source: 'human_automation'` | **Consumer** | 41 Guardian AI |

**Flagship overlap:** Agent **76** (Idle Gameplay) may schedule passive income or background ticks; those flows must **not** invoke `runHumanAutomationsForPlayer` or duplicate its ordering. Idle features call the same **action chokepoint** (`executeTeamAiAction`) only through documented hooks in §7.

---

## 3. Human Player Automation — data model

### 3.1 Persistence

- Field: `humanAutomations: HumanAutomation[]` on save payload (sanitized via `sanitizeHumanAutomations` on load).
- Master toggle: `gameSettings.humanAutomationEnabled` (default **false**, HA1).
- **Schema class:** additive fields on `HumanAutomation` require Agent 9 compatibility review before merge.

### 3.2 Authority modes

| Mode | Behavior |
|------|----------|
| `confirm_before_running` | Builds approval request; **never** calls `executeTeamAiAction` directly from orchestrator |
| `notify_after_running` | Executes, then notification on result |
| `silent_autorun` | Executes; optional transparency notification |
| `disabled` | Rule stored but inert |

### 3.3 Execution limits & safety

Enforced in pure functions before orchestrator dispatch:

- `evaluateHumanAutomationExecutionEligibility` — day window, cooldown, max runs, no-op suspension
- `checkHumanAutomationSafetyLimits` — per-run cost cap, min cash **after** run (uses **spendable** cash, vault-aware in orchestrator)
- Optional Guardian pipeline when enabled (critical/serious → block)

### 3.4 Triggers

- Core triggers always available when extended flag off.
- Extended triggers (`day_number_at_or_above`, opponent model triggers, etc.) require `gameSettings.automationExtendedTriggersEnabled`.
- `manual_test_only` never fires in live orchestrator (dashboard test uses `testHumanAutomationAgainstCurrentState`).

### 3.5 Actions

- Core: travel, challenge, sell, craft, buy_market, region_deposit, invest, buy_equipment.
- Extended (`automationExtendedActionsEnabled`): end_turn, wait, cashout_region, loan.
- Sequences (`automationSequenceLaunchEnabled`): `launch_sequence`.

Extended actions intentionally excluded from HA3 templates where not meaningful for solo human automation (documented in baseline comments).

---

## 4. Turn orchestrator contract (normative)

`runHumanAutomationsForPlayer` (React hook, baseline ~203430) is the **only** automatic execution entry for human automations.

### 4.1 Preconditions

1. `gameSettings.humanAutomationEnabled === true`
2. Not re-entrant (`humanAutomationExecutingRef`)
3. Current actor is human player, not in transit
4. `gameState.gameMode === 'game'` and `currentActorId === 'player'`
5. Once per player turn (`lastAutomationTurnKeyRef`)

### 4.2 Evaluation order

1. Sort enabled rules by **descending priority**
2. For each candidate (stop after **first** successful run):
   - Eligibility → Trigger → `buildHumanAutomationDecision` → Safety → optional `conditions` via `evaluateActionRequirements` → Guardian → authority branch

### 4.3 Scope bounds (must not change without spec bump)

- **At most one** automation executed per player-turn evaluation (documented in baseline).
- No multi-rule chaining in one turn (future HA scope).
- Must not bypass approval queue for `confirm_before_running`.
- Must not call `executeTeamAiAction` when Guardian blocks (via `guardianBlocksAutomation`).

### 4.4 Test-against-current-state

`testHumanAutomationAgainstCurrentState` must use the **same** pure evaluators as §4.2 and perform **no** mutations.

---

## 5. Smart Settings & Auto Mode boundaries

### 5.1 Transactional apply

- `applySmartSettingsPlan` — records `priorValues` / `priorSubsystemValues` for undo; defers live-unsafe keys to `deferredTransactions`.
- Flush boundaries: `flushTurnEndDeferredSettings`, `flushMatchWideDeferredSettings`.

### 5.2 Auto Mode action gate

`validateAutoModeActionAgainstSmartBoundaries(actionType, profile, autoModeSettings)`:

1. Reject if Smart Settings profile disabled or automation preference `manual`
2. Reject if Auto Mode disabled or permission `disabled` / `locked`
3. Honor category/key locks on profile
4. Honor per-domain flags on `autoModeSettings` (strategy, economy, grants, numerical modifiers, etc.)

All Auto Mode executors must call this gate (or equivalent inlined checks) before mutating settings or dispatching adaptive actions.

---

## 6. Import / export envelope

`exportHumanAutomationsJSON` / `importHumanAutomationsJSON`:

| Field | Requirement |
|-------|-------------|
| `system` | Must be `'HumanAutomation'` |
| `automations` | Array; sanitized on import |
| `version` | Envelope semver (currently `1.0.0` in baseline) |

Import never bypasses slot cap (`HUMAN_AUTOMATION_MAX_COUNT` / progression).

---

## 7. Integration rules for Agent 111

1. **No second orchestrator** — idle/background systems enqueue actions or call documented hooks; they do not copy the priority loop.
2. **RNG / replay** — automated actions that touch RNG must respect `preserveReplayDeterminism` and existing registry (see save-compatibility spec).
3. **Co-Pilot** — co-pilot suggestions and human automation are distinct; co-pilot must not mutate `humanAutomations` without UI consent.
4. **Conflict warnings** — `detectHumanAutomationConflicts` is UI-only when `automationConflictWarningsEnabled`; does not block execution.

---

## 8. Contract verification (this branch)

| Check | Command |
|-------|---------|
| Baseline export lock | `npm test` → `src/automation-engine/baseline-lock.test.ts` |
| Reference trigger scenarios | `src/automation-engine/human-automation-scenarios.test.ts` |

Tests **do not** import the full monolith (241k-line transform exceeds CI budget). They lock **export surface**, **section markers**, orchestrator scope text, and reference trigger semantics documented in §3.4.

Before merging to canonical `(V9.4) australia-game-with-ai.tsx`:

- [ ] Re-run `npm test` on integrated baseline
- [ ] Confirm Agent 9 sign-off if save shape changed
- [ ] Run in-game `testHumanAutomationAgainstCurrentState` smoke on dashboard

---

## 9. Related baseline anchors

| Topic | Approx. lines |
|-------|----------------|
| Section 11 Smart Settings | 43605–44244 |
| Human automation types & pure engine | 91856–92486 |
| Orchestrator + test mode | 203424–203596 |
| Automation settings registry | 13323–13519, 64505 |
| Auto Mode dev self-tests | 55219+ |

---

*Agent 48 · Operation 111 · Gate A may be incomplete; this spec is valid for parallel Division E work.*
