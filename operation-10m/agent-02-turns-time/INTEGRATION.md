# Agent 02 integration contract (draft)

## Purpose

Provide a **pure**, replay-safe turn/time layer that mirrors V9.4 concepts (`turn`, `turnCounter`, `day`, `endTurn`, `laborTurnsRequired`, deterministic epoch time) without importing canonical TSX.

## Canonical alignment (read-only reference)

| Game concept | Module mapping |
|--------------|----------------|
| `turn` / `turnCounter` | `TurnClock.turnIndex` |
| `day` | `TurnClock.dayIndex` |
| `FIXED_EPOCH + (turn-1)*86400000` | `TurnClock.epochIso` |
| `endTurnIssuedForTurnKey` | `TurnClock.phaseTokens` — one token per `(turnKey, phase, channel)` |
| Infrastructure `laborTurnsRequired` | `ConstructionProject.laborTurnsRequired` |
| Scheduled loan/event due turns | `ScheduledObligation.dueTurn` |
| Dynamic/world events on a turn phase | `ScheduledEvent` via `scheduleEvent()` |
| UI pause (modals, overlays) blocking advance | `TurnTimeEngine.setPaused()` / `clearPaused()` |

## Host wiring (future Agent 25 assembly)

1. Construct `TurnTimeEngine` from save snapshot `{ turnIndex, dayIndex, obligations, projects }`.
2. On `END_TURN` / `NEXT_DAY`, call `engine.advance({ phases?: TurnPhase[] })` or `engine.fastForwardTo(targetTurn)`.
3. Map `engine.consumeTrace()` into existing diag hooks (`recordDiag2Event`).
4. Abort reducer commit if `engine.validate()` reports `duplicateFired` or `skippedDue`.

## Invariants (must hold)

- Effect sequence numbers are strictly increasing and never reused.
- Each obligation `id` fires at most once while `status === 'pending'`.
- Fast-forward from turn `T0` to `T1` fires exactly the same obligation set as stepping one turn at a time.
- Construction labor increments at most once per completed `end` phase per project per turn.
