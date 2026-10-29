import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  TurnTimeEngine,
  createTurnAdvanceBudget,
  exportBatchNationalTickSessionWave,
  exportBatchNationalTickSessionWaveScorecard,
  compareBatchNationalTickSessionWaveExports,
  gateBatchNationalTickSessionWaveAssembly,
  runNationalTickOrchestratedSessionWave,
} from '../src/index.js';

describe('national tick session wave scorecard (round 18)', () => {
  it('rolls up export counts and digest', () => {
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
    const scorecard = exportBatchNationalTickSessionWaveScorecard(wave);
    assert.equal(scorecard.sessionCount, 2);
    assert.equal(scorecard.unifiedOkCount, 2);
    assert.equal(scorecard.ok, true);
    assert.match(scorecard.scorecardDigest, /^[0-9a-f]{16}$/);
  });
});

describe('national tick session wave export compare (round 18)', () => {
  it('matches twin exports from replay-identical waves', () => {
    const engine = new TurnTimeEngine();
    const ticks = [
      {
        maxSteps: 1,
        input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
      },
    ] as const;
    const a = exportBatchNationalTickSessionWave(
      runNationalTickOrchestratedSessionWave(engine, createTurnAdvanceBudget(2), ticks),
    );
    const b = exportBatchNationalTickSessionWave(
      runNationalTickOrchestratedSessionWave(new TurnTimeEngine(), createTurnAdvanceBudget(2), ticks),
    );
    const cmp = compareBatchNationalTickSessionWaveExports(a, b);
    assert.equal(cmp.waveDigestMatch, true);
    assert.equal(cmp.ok, true);
  });
});

describe('national tick session wave assembly gate (round 18)', () => {
  it('passes when export, scorecard, and parity align', () => {
    const engine = new TurnTimeEngine();
    const budget = createTurnAdvanceBudget(2);
    const ticks = [
      {
        maxSteps: 1,
        input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } },
      },
    ] as const;
    const wave = runNationalTickOrchestratedSessionWave(engine, budget, ticks);
    const gate = gateBatchNationalTickSessionWaveAssembly(engine, budget, ticks, wave);
    assert.equal(gate.ok, true);
    assert.equal(gate.exportAllOk, true);
    assert.equal(gate.parityOk, true);
  });

  it('fails assembly when unified gate breaks export ok', () => {
    const engine = new TurnTimeEngine();
    engine.scheduleEvent({ id: 'r18', dueTurn: 1, kind: 'n' });
    const budget = createTurnAdvanceBudget(2);
    const ticks = [
      {
        maxSteps: 1,
        input: {
          externalByTurn: { 1: ['wrong'] },
          stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },
        },
      },
    ] as const;
    const wave = runNationalTickOrchestratedSessionWave(engine, budget, ticks);
    const gate = gateBatchNationalTickSessionWaveAssembly(engine, budget, ticks, wave);
    assert.equal(gate.exportAllOk, false);
    assert.equal(gate.ok, false);
  });
});
