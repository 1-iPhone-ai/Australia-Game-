import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  gateBatchAdvanceUnifiedPreconditions,
  gateStabilizationBacklogRebound,
  stepTurnsWithBudgetStabilizationCapture,
  batchStabilizationGateOptionsFromCapture,
  stepTurnsWithBudgetFullInstrumentedGate,
  computeBatchInstrumentedAdvanceDigest,
} from '../src/index.js';

describe('batch advance unified pre-gate', () => {
  it('passes when XS-02 and stabilization windows align', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'u1', dueTurn: 1, kind: 'n' });
    const gate = gateBatchAdvanceUnifiedPreconditions(engine.snapshot(), {
      fromTurn: 1,
      toTurn: 1,
      externalByTurn: { 1: ['u1'] },
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },
    });
    assert.equal(gate.ok, true);
    assert.equal(gate.dayPlan?.ok, true);
    assert.equal(gate.stabilization?.ok, true);
  });

  it('fails when stabilization window lattice is invalid', () => {
    const engine = new TurnTimeEngine();
    const gate = gateBatchAdvanceUnifiedPreconditions(engine.snapshot(), {
      fromTurn: 1,
      toTurn: 1,
      stabilizationByTurn: { 1: { postQueueCalm: false, pendingStabilizationWave: true } },
    });
    assert.equal(gate.stabilization?.merge.lattice.ok, false);
    assert.equal(gate.ok, false);
  });
});

describe('stabilization backlog rebound gate', () => {
  it('flags calm on a turn when backlog rebounded from prior step', () => {
    const engine = new TurnTimeEngine();
    const { batch, capture } = stepTurnsWithBudgetStabilizationCapture(engine, 2, createTurnAdvanceBudget(3));
    const rebound = gateStabilizationBacklogRebound(
      batch,
      {
        queueBeforeByTurn: {
          1: { pendingEventDueCount: 0, pendingObligationDueCount: 0 },
          2: { pendingEventDueCount: 0, pendingObligationDueCount: 1 },
        },
        queueAfterByTurn: {
          1: { pendingEventDueCount: 0, pendingObligationDueCount: 0 },
          2: { pendingEventDueCount: 0, pendingObligationDueCount: 0 },
        },
      },
      {
        1: { postQueueCalm: true, pendingStabilizationWave: false },
        2: { postQueueCalm: true, pendingStabilizationWave: false },
      },
    );
    assert.equal(rebound.ok, false);
    assert.deepEqual(rebound.reboundTurns, [2]);
  });

  it('passes when rebound turn clears calm flag', () => {
    const engine = new TurnTimeEngine();
    const { batch } = stepTurnsWithBudgetStabilizationCapture(engine, 2, createTurnAdvanceBudget(3));
    const capture = {
      queueBeforeByTurn: {
        1: { pendingEventDueCount: 0, pendingObligationDueCount: 0 },
        2: { pendingEventDueCount: 0, pendingObligationDueCount: 1 },
      },
      queueAfterByTurn: {
        1: { pendingEventDueCount: 0, pendingObligationDueCount: 0 },
        2: { pendingEventDueCount: 0, pendingObligationDueCount: 0 },
      },
    };
    const rebound = gateStabilizationBacklogRebound(batch, capture, {
      2: { postQueueCalm: false, pendingStabilizationWave: false },
    });
    assert.equal(rebound.ok, true);
  });
});

describe('full instrumented gate (round 11)', () => {
  it('returns consolidated report and digest', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'f1', dueTurn: 1, kind: 'n' });
    const run = stepTurnsWithBudgetFullInstrumentedGate(engine, 1, createTurnAdvanceBudget(2), {
      preGate: {
        fromTurn: 1,
        toTurn: 1,
        externalByTurn: { 1: ['f1'] },
        stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: true } },
      },
      externalByTurn: { 1: ['f1'] },
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: true } },
    });
    assert.equal(run.report.ok, true);
    assert.equal(run.report.preGate?.ok, true);
    assert.match(run.instrumentedDigest, /^[0-9a-f]{16}$/);
    assert.equal(computeBatchInstrumentedAdvanceDigest(run.report), run.instrumentedDigest);
  });

  it('uses auto capture when stepping two idle turns', () => {
    const engine = new TurnTimeEngine();
    const { batch, capture } = stepTurnsWithBudgetStabilizationCapture(engine, 2, createTurnAdvanceBudget(3));
    const opts = batchStabilizationGateOptionsFromCapture(capture);
    assert.ok(opts.queueBeforeByTurn?.[1]);
    assert.ok(opts.queueAfterByTurn?.[2]);
    assert.equal(batch.completed, 2);
  });
});
