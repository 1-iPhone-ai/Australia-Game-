import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createInitialClock,
  deterministicEpochIso,
  buildTurnKey,
  enterPhaseOnce,
  registerObligation,
  fireObligationOnce,
  fastForwardTo,
  proveFastForwardParity,
  validateTurnTimeIntegrity,
  traceObligationFirings,
} from '../src/index.js';

describe('deterministic turn sequencing', () => {
  it('derives epoch ISO from turn index', () => {
    assert.equal(deterministicEpochIso(1), new Date(Date.UTC(2020, 0, 1)).toISOString());
    assert.equal(deterministicEpochIso(2), new Date(Date.UTC(2020, 0, 2)).toISOString());
  });

  it('issues phase tokens once per turn key', () => {
    let clock = createInitialClock(3, 5);
    const first = enterPhaseOnce(clock, 'end', 'player', 'endTurn');
    assert.equal(first.entered, true);
    clock = first.clock;
    const second = enterPhaseOnce(clock, 'end', 'player', 'endTurn');
    assert.equal(second.entered, false);
    assert.equal(second.sequence, first.sequence);
    assert.equal(buildTurnKey('player', 3, 5), 'player:3:d5');
  });

  it('advances turn and day monotonically', () => {
    const engine = new TurnTimeEngine();
    const step = engine.stepFullTurn();
    assert.equal(step.clockBefore.turnIndex, 1);
    assert.equal(step.clockAfter.turnIndex, 2);
    assert.equal(step.clockAfter.dayIndex, 2);
    assert.ok(engine.validate().ok);
  });
});

describe('scheduled obligations', () => {
  it('fires due obligations exactly once in priority order', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'b', dueTurn: 1, priority: 200, kind: 'loan_payment' });
    engine.registerObligation({ id: 'a', dueTurn: 1, priority: 100, kind: 'event' });
    engine.registerObligation({ id: 'c', dueTurn: 2, kind: 'tax' });

    const turn1 = engine.stepFullTurn();
    assert.deepEqual(turn1.firedObligationIds, ['a', 'b']);

    const turn2 = engine.stepFullTurn();
    assert.deepEqual(turn2.firedObligationIds, ['c']);

    const fired = engine.snapshot().obligations.filter((o) => o.status === 'fired');
    assert.equal(fired.length, 3);
    assert.ok(engine.validate().ok);
  });

  it('does not duplicate fire when obligation handler retried', () => {
    let obligations = registerObligation([], { id: 'x', dueTurn: 4, kind: 'test' });
    const clock = createInitialClock(4, 4);
    const first = fireObligationOnce(obligations, 'x', clock, 1);
    obligations = first.obligations;
    const second = fireObligationOnce(obligations, 'x', clock, 2);
    assert.ok(first.fired);
    assert.equal(second.fired, null);
    assert.equal(second.obligations.filter((o) => o.status === 'fired').length, 1);
  });
});

describe('multi-turn construction', () => {
  it('completes project after required labor turns', () => {
    const engine = new TurnTimeEngine();
    engine.startConstruction({ id: 'infra_nsw', laborTurnsRequired: 3 });
    engine.stepFullTurn();
    engine.stepFullTurn();
    const third = engine.stepFullTurn();
    assert.deepEqual(third.completedProjects, ['infra_nsw']);
    const project = engine.snapshot().projects[0];
    assert.equal(project.status, 'completed');
    assert.equal(project.laborTurnsCompleted, 3);
  });
});

describe('fast-forward safety', () => {
  it('matches stepped simulation for mixed obligations and construction', () => {
    const seed = new TurnTimeEngine().snapshot();
    const setup = TurnTimeEngine.fromSnapshot(seed);
    setup.registerObligation({ id: 'o1', dueTurn: 1, kind: 'a' });
    setup.registerObligation({ id: 'o2', dueTurn: 3, kind: 'b' });
    setup.registerObligation({ id: 'o3', dueTurn: 5, kind: 'c' });
    setup.startConstruction({ id: 'build', laborTurnsRequired: 4 });
    const base = setup.snapshot();

    const parity = proveFastForwardParity(base, 6);
    assert.equal(parity.ok, true, JSON.stringify(parity));
  });

  it('fastForwardTo leaves no skipped due effects', () => {
    const engine = TurnTimeEngine.fromSnapshot(new TurnTimeEngine().snapshot());
    engine.registerObligation({ id: 'due-4', dueTurn: 4, kind: 'deadline' });
    engine.registerObligation({ id: 'due-6', dueTurn: 6, kind: 'deadline' });
    const result = fastForwardTo(engine, { targetTurn: 7 });
    assert.ok(result.parityOk);
    const trace = traceObligationFirings(result.snapshot.trace);
    assert.deepEqual(trace, ['due-4', 'due-6']);
    assert.ok(validateTurnTimeIntegrity(result.snapshot.clock, result.snapshot.obligations, result.snapshot.projects).ok);
  });
});

describe('diagnostics — no duplicate or skipped effects', () => {
  it('detects skipped past-due obligations', () => {
    const clock = createInitialClock(5, 5);
    const obligations = [
      { id: 'late', dueTurn: 2, priority: 1, kind: 'x', status: 'pending' as const },
    ];
    const report = validateTurnTimeIntegrity(clock, obligations, []);
    assert.equal(report.ok, false);
    assert.deepEqual(report.skippedDue, ['late']);
  });

  it('maintains strictly increasing effect sequences across a long run', () => {
    const engine = new TurnTimeEngine();
    for (let i = 1; i <= 12; i += 1) {
      engine.registerObligation({ id: `o-${i}`, dueTurn: i, kind: 'tick' });
    }
    engine.startConstruction({ id: 'p1', laborTurnsRequired: 5 });
    engine.startConstruction({ id: 'p2', laborTurnsRequired: 8 });
    fastForwardTo(engine, { targetTurn: 13 });

    const { trace, obligations, projects } = engine.snapshot();
    const sequences = trace.map((t) => t.sequence);
    for (let i = 1; i < sequences.length; i += 1) {
      assert.ok(sequences[i] > sequences[i - 1], 'sequence must increase');
    }
    assert.equal(obligations.every((o) => o.status !== 'pending' || o.dueTurn >= 13), true);
    assert.ok(engine.validate().ok);
    assert.equal(projects.filter((p) => p.status === 'completed').length, 2);
  });

  it('replay from snapshot does not re-fire past obligations', () => {
    const engine = new TurnTimeEngine();
    engine.registerObligation({ id: 'once', dueTurn: 1, kind: 'singleton' });
    engine.stepFullTurn();
    const snap = engine.snapshot();
    assert.equal(traceObligationFirings(snap.trace).filter((id) => id === 'once').length, 1);

    const replay = TurnTimeEngine.fromSnapshot(snap);
    replay.stepFullTurn();
    assert.equal(replay.snapshot().obligations.find((o) => o.id === 'once')?.status, 'fired');
    assert.equal(traceObligationFirings(replay.consumeTrace()).includes('once'), false);
    assert.ok(replay.validate().ok);
  });
});
