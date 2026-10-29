import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  exportBatchNationalTickSessionWave,
  runNationalTickOrchestratedSessionWave,
  verifyBatchNationalTickSessionWaveReplayParity,
} from '../src/index.js';

describe('national tick session wave export (round 17)', () => {
  it('flattens wave sessions with digests', () => {
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
    const exp = exportBatchNationalTickSessionWave(wave);
    assert.equal(exp.sessionCount, 2);
    assert.equal(exp.waveDigest, wave.waveDigest);
    assert.equal(exp.ledgerDigest, wave.ledgerExport.ledgerDigest);
    assert.equal(exp.allOk, true);
    assert.match(exp.rows[0]?.sessionDigest ?? '', /^[0-9a-f]{16}$/);
  });

  it('marks export not ok when a unified gate fails', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'r17', dueTurn: 1, kind: 'n' });
    const wave = runNationalTickOrchestratedSessionWave(engine, createTurnAdvanceBudget(2), [
      {
        maxSteps: 1,
        input: {
          externalByTurn: { 1: ['wrong'] },
          stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },
        },
      },
    ]);
    const exp = exportBatchNationalTickSessionWave(wave);
    assert.equal(exp.allOk, false);
    assert.equal(exp.rows[0]?.unifiedOk, false);
  });
});

describe('national tick session wave replay parity (round 17)', () => {
  it('matches wave and ledger digests on replay from snapshot', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'rp17', dueTurn: 1, kind: 'n' });
    const ticks = [
      {
        maxSteps: 1,
        input: {
          externalByTurn: { 1: ['rp17'] },
          stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: true } },
        },
      },
    ] as const;
    const parity = verifyBatchNationalTickSessionWaveReplayParity(
      engine,
      createTurnAdvanceBudget(2),
      ticks,
    );
    assert.equal(parity.parityOk, true);
    assert.equal(parity.baseline.waveDigest, parity.replay.waveDigest);
  });
});
