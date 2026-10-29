import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  gateBatchExternalStabilizationUnified,
  stepTurnsWithBudgetStabilizationCapture,
  batchStabilizationGateOptionsFromCapture,
  runNationalTickOrchestratedSession,
  createBatchNationalTickLedger,
  exportBatchNationalTickScorecard,
  computeBatchNationalTickLedgerDigest,
} from '../src/index.js';

describe('batch external stabilization unified gate', () => {
  it('requires both XS-02 and stabilization batch alignment', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'u', dueTurn: 1, kind: 'n' });
    const { batch, capture } = stepTurnsWithBudgetStabilizationCapture(engine, 1, createTurnAdvanceBudget(2));
    const gate = gateBatchExternalStabilizationUnified(
      batch,
      { 1: ['u'] },
      { 1: { postQueueCalm: true, pendingStabilizationWave: true } },
      batchStabilizationGateOptionsFromCapture(capture),
    );
    assert.equal(gate.ok, true);
    assert.equal(gate.dayPlan.ok, true);
    assert.equal(gate.stabilization.ok, true);
  });
});

describe('national tick scorecard export', () => {
  it('flattens orchestrated result for Agent 25', () => {
    const engine = new TurnTimeEngine();
    const session = runNationalTickOrchestratedSession(engine, 1, createTurnAdvanceBudget(2), {
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },
    });
    const exp = exportBatchNationalTickScorecard(session.tick);
    assert.equal(exp.nationalTickDigest, session.tick.nationalTickDigest);
    assert.equal(exp.ok, session.tick.scorecard.ok);
  });
});

describe('national tick session (round 15)', () => {
  it('appends ledger entry with parity check', () => {
    const engine = new TurnTimeEngine();
    const ledger = createBatchNationalTickLedger();
    const session = runNationalTickOrchestratedSession(
      engine,
      1,
      createTurnAdvanceBudget(2),
      { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
      ledger,
    );
    assert.equal(session.parityOk, true);
    assert.equal(session.ledger.entries.length, 1);
    assert.equal(session.ledger.entries[0]?.tickIndex, 1);
    assert.match(session.sessionDigest, /^[0-9a-f]{16}$/);
    assert.equal(computeBatchNationalTickLedgerDigest(session.ledger).length, 16);
  });

  it('chains multiple ticks in ledger', () => {
    const engine = new TurnTimeEngine();
    let ledger = createBatchNationalTickLedger();
    ledger = runNationalTickOrchestratedSession(
      engine,
      1,
      createTurnAdvanceBudget(2),
      { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
      ledger,
    ).ledger;
    const second = runNationalTickOrchestratedSession(
      engine,
      1,
      createTurnAdvanceBudget(2),
      { stabilizationByTurn: { 2: { postQueueCalm: true, pendingStabilizationWave: false } } },
      ledger,
    );
    assert.equal(second.ledger.entries.length, 2);
    assert.equal(second.ledger.entries[1]?.tickIndex, 2);
  });
});
