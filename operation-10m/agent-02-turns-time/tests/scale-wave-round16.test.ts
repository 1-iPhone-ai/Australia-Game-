import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  exportBatchNationalTickSessionLedger,
  runNationalTickOrchestratedUnifiedSession,
  runNationalTickOrchestratedSessionWave,
  computeBatchNationalTickUnifiedSessionDigest,
} from '../src/index.js';

describe('national tick session ledger export', () => {
  it('flattens ledger rows with digest', () => {
    const engine = new TurnTimeEngine();
    const session = runNationalTickOrchestratedUnifiedSession(engine, 1, createTurnAdvanceBudget(2), {
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },
    });
    const exp = exportBatchNationalTickSessionLedger(session.ledger);
    assert.equal(exp.entryCount, 1);
    assert.equal(exp.rows[0]?.tickIndex, 1);
    assert.equal(exp.allOk, true);
    assert.match(exp.ledgerDigest, /^[0-9a-f]{16}$/);
  });
});

describe('national tick unified session (round 16)', () => {
  it('requires unified XS-02 and stabilization alignment for ledger ok', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'r16', dueTurn: 1, kind: 'n' });
    const session = runNationalTickOrchestratedUnifiedSession(engine, 1, createTurnAdvanceBudget(2), {
      externalByTurn: { 1: ['r16'] },
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: true } },
    });
    assert.equal(session.unifiedGate?.ok, true);
    assert.equal(session.parityOk, true);
    assert.equal(session.ledger.entries[0]?.ok, true);
    assert.match(computeBatchNationalTickUnifiedSessionDigest(session), /^[0-9a-f]{16}$/);
  });

  it('marks ledger entry not ok when unified gate fails', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'miss', dueTurn: 1, kind: 'n' });
    const session = runNationalTickOrchestratedUnifiedSession(engine, 1, createTurnAdvanceBudget(2), {
      externalByTurn: { 1: ['wrong-id'] },
      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },
    });
    assert.equal(session.unifiedGate?.ok, false);
    assert.equal(session.ledger.entries[0]?.ok, false);
  });
});

describe('national tick session wave (round 16)', () => {
  it('chains unified sessions on one engine', () => {
    const engine = new TurnTimeEngine();
    const wave = runNationalTickOrchestratedSessionWave(engine, createTurnAdvanceBudget(3), [
      {
        maxSteps: 1,
        input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
      },
      {
        maxSteps: 1,
        input: { stabilizationByTurn: { 2: { postQueueCalm: true, pendingStabilizationWave: false } } },
      },
    ]);
    assert.equal(wave.sessions.length, 2);
    assert.equal(wave.ledgerExport.entryCount, 2);
    assert.equal(wave.ledgerExport.allOk, true);
    assert.match(wave.waveDigest, /^[0-9a-f]{16}$/);
  });
});
